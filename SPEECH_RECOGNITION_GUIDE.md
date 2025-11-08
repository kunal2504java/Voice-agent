# Speech Recognition Setup Guide

## 🎤 Web Speech API Implementation

### Overview
The Riverwood Voice Agent uses the Web Speech API for speech-to-text conversion, supporting both Hindi and English (Hinglish) input.

## ✅ Browser Compatibility

### Fully Supported
- ✅ **Google Chrome** (Desktop & Android)
- ✅ **Microsoft Edge** (Desktop)
- ✅ **Chrome-based browsers** (Brave, Opera, Vivaldi)

### Limited/No Support
- ❌ **Firefox** - No Web Speech API support
- ⚠️ **Safari** - Limited support, may not work reliably
- ❌ **Internet Explorer** - Not supported

### Recommendation
**Use Google Chrome or Microsoft Edge for best experience**

## 🔧 Setup Instructions

### 1. Enable Microphone Permissions

#### Chrome/Edge (Desktop)
1. Click the lock icon in address bar
2. Find "Microphone" permission
3. Set to "Allow"
4. Refresh the page

#### Chrome (Android)
1. Go to Settings → Site Settings → Microphone
2. Find your site
3. Enable microphone access

### 2. Test Your Microphone

Before using the voice agent:
1. Open browser settings
2. Go to Privacy & Security → Site Settings → Microphone
3. Test microphone to ensure it's working
4. Check volume levels

## 📝 Usage Guide

### How to Use Voice Input

1. **Start Call**: Click "Start Call" button
2. **Click Microphone**: Large green microphone button
3. **Speak**: Say your message in Hindi, English, or mix both
4. **Auto-Send**: Message sends automatically when you stop speaking

### Language Support

The system recognizes:
- **Pure Hindi**: "Namaste, kya update hai?"
- **Pure English**: "What's the construction progress?"
- **Hinglish Mix**: "Hello, aaj ka update kya hai?"

### Tips for Best Recognition

1. **Speak Clearly**: Enunciate words properly
2. **Normal Pace**: Don't speak too fast or too slow
3. **Reduce Noise**: Minimize background noise
4. **Good Microphone**: Use quality microphone if possible
5. **Short Phrases**: Keep sentences concise (3-5 seconds)

## 🔍 Troubleshooting

### Issue: "Voice input not supported"
**Solution**: 
- Use Chrome or Edge browser
- Update browser to latest version
- Check if running on HTTPS (required for microphone access)

### Issue: "Microphone permission denied"
**Solution**:
1. Click lock icon in address bar
2. Reset microphone permission
3. Refresh page
4. Allow when prompted

### Issue: "No speech detected"
**Solution**:
- Check microphone is connected
- Test microphone in system settings
- Ensure microphone isn't muted
- Try speaking louder or closer to mic

### Issue: "Network error"
**Solution**:
- Check internet connection
- Web Speech API requires internet
- Try refreshing the page

### Issue: Poor Hindi Recognition
**Solution**:
- Speak more clearly
- Try using more English words
- Consider Deepgram integration (see below)

## 🚀 Advanced: Deepgram Integration

For production deployment with better Hindi support, consider Deepgram API.

### Why Deepgram?

| Feature | Web Speech API | Deepgram |
|---------|---------------|----------|
| Hindi Accuracy | 70-80% | 90%+ |
| Hinglish Support | Basic | Excellent |
| Offline Mode | No | No |
| Cost | Free | $0.0043/min |
| Real-time | Yes | Yes |
| Punctuation | No | Yes |
| Custom Vocabulary | No | Yes |

### Deepgram Setup

#### 1. Sign Up
```
https://deepgram.com/
```

#### 2. Get API Key
1. Create account
2. Go to Dashboard
3. Generate API key
4. Copy key

#### 3. Install SDK
```bash
cd frontend
npm install @deepgram/sdk
```

#### 4. Add to Environment
```env
# frontend/.env
VITE_DEEPGRAM_API_KEY=your_api_key_here
```

#### 5. Implementation Example

```javascript
// frontend/src/hooks/useDeepgramRecognition.js
import { useState, useRef } from 'react';
import { createClient } from '@deepgram/sdk';

const useDeepgramRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const deepgramRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const startListening = async () => {
    try {
      // Initialize Deepgram client
      const deepgram = createClient(import.meta.env.VITE_DEEPGRAM_API_KEY);
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true 
      });
      
      // Create live connection
      const connection = deepgram.listen.live({
        model: 'nova-2',
        language: 'hi', // Hindi
        smart_format: true,
        interim_results: true,
        punctuate: true,
      });
      
      // Handle transcription results
      connection.on('Results', (data) => {
        const transcript = data.channel.alternatives[0].transcript;
        if (transcript) {
          setTranscript(transcript);
        }
      });
      
      // Send audio to Deepgram
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          connection.send(event.data);
        }
      };
      
      mediaRecorder.start(250); // Send chunks every 250ms
      
      deepgramRef.current = connection;
      mediaRecorderRef.current = mediaRecorder;
      setIsListening(true);
      
    } catch (error) {
      console.error('Deepgram error:', error);
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (deepgramRef.current) {
      deepgramRef.current.finish();
    }
    setIsListening(false);
  };

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
  };
};

export default useDeepgramRecognition;
```

#### 6. Update Component

```javascript
// Replace useSpeechRecognition with useDeepgramRecognition
import useDeepgramRecognition from '../hooks/useDeepgramRecognition';

const VoiceInterface = () => {
  const { transcript, isListening, startListening, stopListening } = 
    useDeepgramRecognition();
  
  // Rest of component...
};
```

### Deepgram Pricing

#### Free Tier
- $200 in credits
- ~46,000 minutes of transcription
- Perfect for testing and small deployments

#### Pay-as-you-go
- $0.0043 per minute
- No monthly commitment
- Pay only for what you use

#### Example Costs
| Daily Calls | Minutes/Call | Monthly Cost |
|-------------|--------------|--------------|
| 10          | 5            | $6.45        |
| 25          | 5            | $16.13       |
| 50          | 5            | $32.25       |
| 100         | 5            | $64.50       |

### Deepgram Features

1. **Better Hindi Accuracy**
   - Trained on Indian accents
   - Better handling of code-mixed languages
   - Regional dialect support

2. **Real-time Streaming**
   - Low latency (< 300ms)
   - Interim results as user speaks
   - Smooth user experience

3. **Smart Formatting**
   - Automatic punctuation
   - Capitalization
   - Number formatting

4. **Custom Vocabulary**
   - Add real estate terms
   - Project-specific words
   - Customer names

5. **Speaker Diarization**
   - Identify different speakers
   - Useful for multi-party calls

## 📊 Comparison: Web Speech API vs Deepgram

### When to Use Web Speech API
- ✅ Development and testing
- ✅ Small user base (< 100 users)
- ✅ Budget constraints
- ✅ Simple use case
- ✅ English-heavy conversations

### When to Use Deepgram
- ✅ Production deployment
- ✅ Large user base (> 100 users)
- ✅ Hindi-heavy conversations
- ✅ Need high accuracy (90%+)
- ✅ Professional application
- ✅ Custom vocabulary needed

## 🔒 Security & Privacy

### Web Speech API
- Audio sent to Google servers
- Processed in real-time
- Not stored (according to Google)
- No explicit privacy controls

### Deepgram
- Audio sent to Deepgram servers
- Can request data deletion
- GDPR compliant
- SOC 2 Type II certified
- Can use on-premise deployment

## 🎯 Best Practices

### 1. User Experience
- Show clear "Listening" indicator
- Display interim results
- Provide visual feedback
- Handle errors gracefully
- Offer text input fallback

### 2. Error Handling
```javascript
try {
  await startListening();
} catch (error) {
  if (error.name === 'NotAllowedError') {
    alert('Please allow microphone access');
  } else if (error.name === 'NotFoundError') {
    alert('No microphone found');
  } else {
    alert('Error: ' + error.message);
  }
}
```

### 3. Accessibility
- Keyboard shortcuts for voice input
- Screen reader announcements
- High contrast visual indicators
- Clear error messages

### 4. Performance
- Stop recognition when not needed
- Clean up resources properly
- Handle multiple rapid clicks
- Debounce API calls

## 📱 Mobile Considerations

### Android
- Chrome works well
- Request permissions properly
- Test on different devices
- Handle screen rotation

### iOS
- Safari has limited support
- Recommend Chrome/Edge
- May need native app for best experience

## 🧪 Testing Checklist

- [ ] Test in Chrome (Desktop)
- [ ] Test in Edge (Desktop)
- [ ] Test in Chrome (Android)
- [ ] Test with Hindi speech
- [ ] Test with English speech
- [ ] Test with Hinglish mix
- [ ] Test microphone permissions
- [ ] Test error scenarios
- [ ] Test with background noise
- [ ] Test with different accents

## 📞 Support

### Common Questions

**Q: Why isn't voice input working?**
A: Check browser (Chrome/Edge), microphone permissions, and internet connection.

**Q: Can I use it offline?**
A: No, both Web Speech API and Deepgram require internet connection.

**Q: How accurate is Hindi recognition?**
A: Web Speech API: 70-80%, Deepgram: 90%+

**Q: Does it work on mobile?**
A: Yes, on Chrome for Android. Limited on iOS Safari.

**Q: Can I customize the vocabulary?**
A: Not with Web Speech API. Yes with Deepgram.

## 🎓 Resources

### Web Speech API
- [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Google Developers Guide](https://developers.google.com/web/updates/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API)

### Deepgram
- [Official Documentation](https://developers.deepgram.com/)
- [API Reference](https://developers.deepgram.com/api-reference/)
- [Pricing Calculator](https://deepgram.com/pricing)

---

## 🎉 Ready to Go!

Your speech recognition is now configured and ready to use. For best results:
1. Use Chrome or Edge
2. Allow microphone permissions
3. Speak clearly in Hindi or English
4. Consider Deepgram for production

Happy talking! 🎤✨
