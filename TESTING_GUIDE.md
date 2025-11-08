# Testing Guide - Riverwood AI Voice Agent

## 🧪 Pre-Testing Checklist

- [ ] Node.js 18+ installed
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Frontend dependencies installed (`cd frontend && npm install`)
- [ ] `.env` file created with valid API keys
- [ ] Chrome or Edge browser available

## 🚀 Testing Steps

### 1. Backend Testing

#### Start Backend Server
```powershell
cd backend
npm run dev
```

**Expected Output:**
```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🏗️  Riverwood AI Voice Agent API                   ║
║                                                       ║
║   Server running on: http://localhost:3001           ║
║   Environment: development                            ║
║                                                       ║
║   Ready to serve construction updates! 🎙️            ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

#### Test Health Endpoint
```powershell
# In a new terminal
curl http://localhost:3001/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T10:00:00.000Z",
  "service": "Riverwood Voice Agent API"
}
```

#### Test Projects Endpoint
```powershell
curl http://localhost:3001/api/construction/projects
```

**Expected Response:**
```json
{
  "success": true,
  "projects": [
    {
      "projectId": "RW001",
      "projectName": "Riverwood Heights - Tower A",
      "customerName": "Rajesh Kumar",
      "flatNumber": "A-1204"
    },
    {
      "projectId": "RW002",
      "projectName": "Riverwood Gardens - Villa 5",
      "customerName": "Priya Sharma",
      "flatNumber": "Villa-5"
    }
  ]
}
```

#### Test Chat Endpoint
```powershell
curl -X POST http://localhost:3001/api/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"customerId\":\"CUST001\",\"message\":\"Hello\",\"projectId\":\"RW001\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "response": "Namaste! Main Riverwood se bol rahi hoon...",
  "constructionUpdate": { ... },
  "usage": { ... }
}
```

### 2. Frontend Testing

#### Start Frontend Server
```powershell
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

#### Open Browser
Navigate to: http://localhost:5173

### 3. UI Component Testing

#### Test 1: Initial Load
- [ ] Page loads without errors
- [ ] Header displays "Riverwood AI Voice Agent"
- [ ] Project selector is visible
- [ ] No chat messages displayed
- [ ] Welcome message shown

#### Test 2: Project Selection
- [ ] Click project selector dropdown
- [ ] Two projects visible (RW001, RW002)
- [ ] Select RW001
- [ ] Project name displays correctly
- [ ] "Start Conversation" button appears

#### Test 3: Start Conversation
- [ ] Click "Start Conversation"
- [ ] Button shows "Starting..." briefly
- [ ] AI greeting appears in chat
- [ ] Construction update card displays
- [ ] Audio plays automatically (if ElevenLabs key valid)

#### Test 4: Text Input
- [ ] Type "What's the update?" in input field
- [ ] Click Send button
- [ ] User message appears (right side, blue)
- [ ] AI response appears (left side, gray)
- [ ] "Play Audio" button visible on AI message

#### Test 5: Voice Input (Chrome/Edge only)
- [ ] Click microphone button
- [ ] Button turns red and shows "MicOff" icon
- [ ] "Listening... Speak now" message appears
- [ ] Speak: "Kya update hai?"
- [ ] Transcript appears in input field
- [ ] Message sent automatically
- [ ] AI responds

#### Test 6: Audio Playback
- [ ] Click "Play Audio" on any AI message
- [ ] "Playing audio..." message appears
- [ ] Audio plays through speakers
- [ ] Message disappears when audio ends

#### Test 7: Construction Update Card
- [ ] Update card displays project name
- [ ] Current phase shown
- [ ] Progress percentage visible
- [ ] Worker count displayed
- [ ] Weather condition shown
- [ ] Next milestone visible

#### Test 8: Conversation History
- [ ] Click History icon in header
- [ ] Previous messages load (if any)
- [ ] Scroll through history

#### Test 9: Clear History
- [ ] Click Trash icon in header
- [ ] Confirmation dialog appears
- [ ] Click OK
- [ ] Chat messages cleared
- [ ] Update card remains

#### Test 10: Switch Projects
- [ ] Select different project (RW002)
- [ ] Project info updates
- [ ] Previous conversation remains
- [ ] Start new conversation
- [ ] New update for RW002 displays

## 🎯 Functional Testing Scenarios

### Scenario 1: First-Time User
```
1. Open application
2. See project selector
3. Select RW001
4. Click "Start Conversation"
5. Receive greeting in Hinglish
6. See construction update
7. Hear audio greeting
✓ Success if all steps work
```

### Scenario 2: Voice Conversation
```
1. Start conversation
2. Click microphone
3. Say "Kya update hai?"
4. See transcript
5. Receive AI response
6. Hear audio response
✓ Success if voice recognized and responded
```

### Scenario 3: Text Conversation
```
1. Start conversation
2. Type "What's the progress?"
3. Click Send
4. Receive response
5. Click "Play Audio"
6. Hear response
✓ Success if text works and audio plays
```

### Scenario 4: Multi-Turn Conversation
```
1. Start conversation
2. Ask: "Hello"
3. AI responds
4. Ask: "What's the update?"
5. AI responds with update
6. Ask: "When will it complete?"
7. AI responds with timeline
✓ Success if context maintained
```

### Scenario 5: Project Switching
```
1. Start conversation with RW001
2. Have 2-3 exchanges
3. Switch to RW002
4. Start new conversation
5. Verify different update
6. Switch back to RW001
7. Verify history preserved
✓ Success if projects independent
```

## 🐛 Error Testing

### Test Invalid API Keys

#### OpenAI Key Error
1. Set invalid `OPENAI_API_KEY` in `.env`
2. Restart backend
3. Try to send message
4. **Expected**: Error message in backend console
5. **Expected**: "Failed to process chat message" in frontend

#### ElevenLabs Key Error
1. Set invalid `ELEVENLABS_API_KEY` in `.env`
2. Restart backend
3. Try to play audio
4. **Expected**: Error message in backend console
5. **Expected**: Audio doesn't play, but chat works

### Test Network Errors

#### Backend Down
1. Stop backend server
2. Try to send message in frontend
3. **Expected**: Error in browser console
4. **Expected**: Message not sent

#### Frontend Down
1. Stop frontend server
2. Try to access http://localhost:5173
3. **Expected**: "This site can't be reached"

### Test Browser Compatibility

#### Chrome/Edge (Should Work)
- [ ] Voice input works
- [ ] Audio playback works
- [ ] All features functional

#### Firefox (Limited)
- [ ] Voice input may not work
- [ ] Audio playback works
- [ ] Text input works

#### Safari (Limited)
- [ ] Voice input may not work
- [ ] Audio playback may have issues
- [ ] Text input works

## 📊 Performance Testing

### Response Time Testing
```
Expected Response Times:
- Health check: < 50ms
- Get projects: < 100ms
- Chat response: 2-5 seconds (OpenAI API)
- Voice synthesis: 1-3 seconds (ElevenLabs API)
```

### Load Testing (Manual)
1. Send 10 messages rapidly
2. Check if all responses received
3. Check if memory saves correctly
4. Check for any errors

### Memory Testing
1. Have 100+ message conversation
2. Check memory usage
3. Verify only last 50 saved
4. Check file size of conversations.json

## 🔍 Debugging Checklist

### Backend Issues

#### Server Won't Start
```powershell
# Check Node version
node --version  # Should be 18+

# Check if port in use
netstat -ano | findstr :3001

# Check .env file exists
ls .env

# Check dependencies installed
ls backend/node_modules
```

#### API Errors
```powershell
# Check backend logs
# Look for error messages in terminal

# Test API keys
curl https://api.openai.com/v1/models ^
  -H "Authorization: Bearer YOUR_KEY"
```

### Frontend Issues

#### Page Won't Load
```powershell
# Check if Vite running
# Look for "Local: http://localhost:5173"

# Check browser console
# Press F12, look for errors

# Check if backend running
curl http://localhost:3001/health
```

#### Voice Not Working
```
1. Check browser (Chrome/Edge only)
2. Check microphone permissions
3. Check HTTPS (localhost is OK)
4. Check browser console for errors
```

## 📝 Test Results Template

```
Test Date: _______________
Tester: _______________
Environment: Development / Production

Backend Tests:
[ ] Server starts successfully
[ ] Health endpoint works
[ ] Projects endpoint works
[ ] Chat endpoint works
[ ] Voice endpoint works
[ ] Memory endpoint works

Frontend Tests:
[ ] Page loads
[ ] Project selection works
[ ] Start conversation works
[ ] Text input works
[ ] Voice input works
[ ] Audio playback works
[ ] History works
[ ] Clear history works

Integration Tests:
[ ] End-to-end conversation works
[ ] Voice to text to AI to speech works
[ ] Memory persists across sessions
[ ] Multiple projects work independently

Performance:
[ ] Response times acceptable
[ ] No memory leaks
[ ] Audio plays smoothly
[ ] UI responsive

Issues Found:
1. _______________
2. _______________
3. _______________

Notes:
_______________
_______________
_______________
```

## 🎓 Testing Tips

1. **Always test in order**: Backend → Frontend → Integration
2. **Check console logs**: Both browser and terminal
3. **Test one feature at a time**: Isolate issues
4. **Use Chrome DevTools**: Network tab for API calls
5. **Clear browser cache**: If seeing old code
6. **Restart servers**: After .env changes
7. **Check API quotas**: OpenAI and ElevenLabs limits
8. **Test with real speech**: Not just typing
9. **Test different accents**: Hindi and English
10. **Document issues**: Note exact steps to reproduce

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Voice not working | Use Chrome/Edge, check mic permissions |
| No audio playback | Check ElevenLabs API key, check speakers |
| Slow responses | Normal, OpenAI takes 2-5 seconds |
| Port already in use | Change PORT in .env or kill process |
| CORS errors | Check FRONTEND_URL in .env |
| API key errors | Verify keys are valid and have credits |
| Memory not saving | Check backend/data folder exists |
| UI not updating | Check React state updates in console |

## ✅ Success Criteria

Your system is working correctly if:
- ✅ Backend starts without errors
- ✅ Frontend loads and displays correctly
- ✅ Can select and switch projects
- ✅ Can start conversation and get AI greeting
- ✅ Can send text messages and get responses
- ✅ Can use voice input (Chrome/Edge)
- ✅ Can play audio responses
- ✅ Construction updates display correctly
- ✅ Conversation history persists
- ✅ Can clear history
- ✅ No console errors during normal use

---

Happy Testing! 🧪✨
