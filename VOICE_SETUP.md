# Voice Service Setup Guide

## 🎙️ ElevenLabs Voice Configuration

### Overview
The voice service uses ElevenLabs API to generate natural, warm Indian English speech for customer conversations. The service is optimized for Hinglish (Hindi-English mix) conversations.

## 🔑 Getting Your ElevenLabs API Key

### Step 1: Create Account
1. Go to https://elevenlabs.io/
2. Click "Sign Up" (free tier available)
3. Verify your email

### Step 2: Get API Key
1. Log in to ElevenLabs
2. Click on your profile (top right)
3. Select "Profile Settings"
4. Navigate to "API Keys" tab
5. Click "Generate API Key"
6. Copy the key (starts with a long string)

### Step 3: Add to .env File
```env
ELEVENLABS_API_KEY=your_api_key_here
ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
```

## 🎤 Voice Selection

### Recommended Voice: Bella
- **Voice ID**: `pNInz6obpgDQGcFmaJgB`
- **Type**: Female, warm, conversational
- **Best for**: Customer service, friendly conversations
- **Accent**: American English (adaptable to Indian context)
- **Why**: Natural inflection, warm tone, works excellently with Hinglish

### Alternative Voices

#### Sarah
- **Voice ID**: `EXAVITQu4vr4xnSDxMaL`
- **Type**: Professional yet friendly
- **Best for**: Professional updates, formal communication

#### Dorothy
- **Voice ID**: `ThT5KcBeYPX3keUQqHPh`
- **Type**: Pleasant, mature female voice
- **Best for**: Premium real estate, sophisticated tone

### How to Change Voice
Edit `.env` file:
```env
ELEVENLABS_VOICE_ID=your_preferred_voice_id
```

## ⚙️ Voice Settings (Optimized)

The service uses these optimal settings:

```javascript
{
  stability: 0.75,           // Higher = more consistent, clear
  similarity_boost: 0.75,    // Higher = more natural characteristics
  style: 0.5,                // Balanced expressiveness
  use_speaker_boost: true    // Enhanced clarity
}
```

### What Each Setting Does:

**Stability (0.75)**
- Controls voice consistency
- Higher = more predictable, clear pronunciation
- Lower = more expressive but variable
- 0.75 is optimal for customer service

**Similarity Boost (0.75)**
- Maintains voice characteristics
- Higher = more natural to selected voice
- Lower = more generic
- 0.75 preserves warmth and personality

**Style (0.5)**
- Controls expressiveness
- Higher = more dramatic
- Lower = more monotone
- 0.5 is balanced for conversations

**Speaker Boost (true)**
- Enhances voice clarity
- Recommended for all use cases

## 💰 Pricing & Cost Management

### ElevenLabs Pricing Tiers

#### Free Tier
- **Characters/month**: 10,000
- **Cost**: $0
- **Good for**: Testing, small projects
- **~67 messages** (assuming 150 chars/message)

#### Starter ($5/month)
- **Characters/month**: 30,000
- **Cost per 1000 chars**: $0.30
- **Good for**: Small businesses
- **~200 messages/month**

#### Creator ($22/month)
- **Characters/month**: 100,000
- **Cost per 1000 chars**: $0.24
- **Good for**: Growing businesses
- **~667 messages/month**

#### Pro ($99/month)
- **Characters/month**: 500,000
- **Cost per 1000 chars**: $0.18
- **Good for**: Large scale operations
- **~3,333 messages/month**

### Cost Estimation

**Average Message**: 150 characters
**Cost per message**: ~$0.045 (Starter tier)

**Example Scenarios:**

| Daily Calls | Messages/Call | Monthly Messages | Monthly Cost (Starter) |
|-------------|---------------|------------------|------------------------|
| 10          | 5             | 1,500            | $6.75                  |
| 25          | 5             | 3,750            | $16.88                 |
| 50          | 5             | 7,500            | $33.75                 |
| 100         | 5             | 15,000           | $67.50                 |

### Cost Optimization Tips

1. **Keep responses concise** (3-4 sentences)
2. **Use text input when possible** (voice output only)
3. **Monitor usage** via `/api/voice/usage` endpoint
4. **Set up alerts** for high usage
5. **Consider caching** common responses

## 🧪 Testing Your Voice Setup

### Quick Test
```bash
cd backend
npm run test:voice
```

This will:
1. Check API key configuration
2. Test voice synthesis
3. Generate a sample audio file
4. Show cost estimates
5. Display usage statistics

### Manual Test via API

**Test Synthesis:**
```bash
curl -X POST http://localhost:3001/api/voice/synthesize \
  -H "Content-Type: application/json" \
  -d '{"text": "Namaste! Aaj ka update bahut accha hai."}'
```

**Check Health:**
```bash
curl http://localhost:3001/api/voice/health
```

**Get Usage Stats:**
```bash
curl http://localhost:3001/api/voice/usage
```

## 📊 Monitoring & Analytics

### Available Endpoints

#### GET /api/voice/usage
Returns current usage statistics:
```json
{
  "success": true,
  "usage": {
    "totalCharacters": 1500,
    "totalRequests": 10,
    "estimatedCost": 0.45,
    "averageCharactersPerRequest": 150,
    "remainingFreeCharacters": 8500
  }
}
```

#### GET /api/voice/health
Check service health:
```json
{
  "status": "healthy",
  "apiKeyConfigured": true,
  "voicesAvailable": 25,
  "usageStats": {...}
}
```

#### POST /api/voice/estimate
Estimate conversation cost:
```json
{
  "messageCount": 10,
  "avgCharactersPerMessage": 150
}
```

Response:
```json
{
  "success": true,
  "estimate": {
    "messageCount": 10,
    "totalCharacters": 1500,
    "estimatedCost": 0.45,
    "costPerMessage": 0.045,
    "formattedCost": "$0.0450"
  }
}
```

## 🔍 Troubleshooting

### Error: "Invalid API key"
**Solution**: 
- Check `.env` file has correct key
- Verify key at elevenlabs.io
- Regenerate key if needed

### Error: "Rate limit exceeded"
**Solution**:
- Wait a few minutes
- Upgrade to paid tier
- Reduce request frequency

### Error: "Text too long"
**Solution**:
- Keep responses under 5000 characters
- Split long text into multiple requests
- Optimize AI responses to be concise

### Error: "Service unavailable"
**Solution**:
- Check internet connection
- Verify ElevenLabs status page
- Retry after a few seconds

### Poor Voice Quality
**Solution**:
- Try different voice ID
- Adjust voice settings
- Check audio playback device
- Ensure good internet speed

## 🎯 Best Practices

### 1. Response Length
- Keep AI responses to 3-4 sentences
- Aim for 100-200 characters per message
- Break long updates into multiple messages

### 2. Voice Settings
- Don't change settings too often
- Test changes with sample text
- Document any custom settings

### 3. Cost Management
- Monitor usage weekly
- Set monthly budget alerts
- Review conversation patterns
- Optimize message length

### 4. Error Handling
- Always check `result.success`
- Handle retryable errors gracefully
- Log errors for debugging
- Show user-friendly error messages

### 5. Performance
- Use streaming for real-time feel
- Cache common responses (future)
- Implement request queuing
- Monitor response times

## 📝 Voice Service Features

### ✅ Implemented Features

1. **Text-to-Speech Synthesis**
   - High-quality audio generation
   - Optimized for Hinglish
   - Natural Indian English voice

2. **Streaming Support**
   - Real-time audio streaming
   - Lower latency
   - Better user experience

3. **Cost Tracking**
   - Character counting
   - Cost estimation
   - Usage statistics
   - Monthly tracking

4. **Error Handling**
   - Detailed error messages
   - Retry logic for transient errors
   - Graceful degradation

5. **Voice Management**
   - Multiple voice support
   - Voice recommendations
   - Easy voice switching

6. **Health Monitoring**
   - Service health checks
   - API connectivity tests
   - Usage reporting

### 🔮 Future Enhancements

1. **Response Caching**
   - Cache common greetings
   - Store frequently used phrases
   - Reduce API calls

2. **Voice Cloning**
   - Custom voice training
   - Brand-specific voice
   - Regional accent support

3. **Advanced Analytics**
   - Voice quality metrics
   - User satisfaction tracking
   - A/B testing different voices

4. **Batch Processing**
   - Generate multiple audios
   - Scheduled voice generation
   - Bulk operations

## 🆘 Support

### Getting Help

1. **Check Logs**: Look at backend console for errors
2. **Test Script**: Run `npm run test:voice`
3. **API Docs**: Visit https://elevenlabs.io/docs
4. **Community**: ElevenLabs Discord server

### Common Questions

**Q: Can I use my own voice?**
A: Yes! ElevenLabs offers voice cloning on paid tiers.

**Q: Does it support pure Hindi?**
A: Yes, the multilingual model supports Hindi, but Hinglish works best.

**Q: How fast is synthesis?**
A: Typically 1-3 seconds for 150 characters.

**Q: Can I change voice mid-conversation?**
A: Yes, pass different `voiceId` to synthesis function.

**Q: What's the audio quality?**
A: High quality MP3 at 128kbps, suitable for phone/web.

---

## 🎉 Ready to Go!

Your voice service is now configured and ready to use. Run the test script to verify everything works:

```bash
cd backend
npm run test:voice
```

If all tests pass, start the server and enjoy natural Hinglish conversations! 🚀
