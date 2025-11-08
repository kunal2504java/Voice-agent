# 🚀 Complete Setup with Gemini API

## Quick Start (5 Minutes)

### Step 1: Get Your Gemini API Key

1. Go to: **https://makersuite.google.com/app/apikey**
2. Click **"Get API Key"** or **"Create API Key"**
3. Copy your key (starts with `AIza...`)

**No credit card needed!** ✅

---

### Step 2: Install Dependencies

```powershell
# Navigate to project
cd c:\Users\Kunal\OneDrive\Desktop\riverwood

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..\frontend
npm install
```

---

### Step 3: Configure Environment

Create `backend/.env` file:

```env
# Google Gemini API Key
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# ElevenLabs API Key (for voice synthesis)
ELEVENLABS_API_KEY=your-elevenlabs-key-here
ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB

# Server Configuration
PORT=3001
NODE_ENV=development
```

**Note:** ElevenLabs is optional. You can test without voice first.

---

### Step 4: Test Gemini Connection

```powershell
cd backend
node test-gemini.js
```

**Expected output:**
```
🧪 Testing Gemini API Integration
═══════════════════════════════════════

Test 1: API Connection
─────────────────────────────────────
✅ Success!
Response: Hello! How can I help you today?

Test 2: Simple Conversation
─────────────────────────────────────
✅ Success!
AI Response: Namaste! Main bilkul theek hoon, thank you! Aap kaise hain?
Tokens Used: 45

✅ All tests completed!
```

---

### Step 5: Start the Application

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Expected output:**
```
Server running on: http://localhost:3001
Ready to serve construction updates! 🎙️
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

**Expected output:**
```
Local: http://localhost:5173/
```

---

### Step 6: Open in Browser

1. Open **Chrome** or **Edge**
2. Go to: **http://localhost:5173**
3. You should see the Riverwood AI Voice Agent!

---

## 🎯 Testing the App

### Option 1: Interactive Demo (No API needed)

1. Look for **"Interactive Demo"** button
2. Click **"Start Demo"**
3. Watch the automated conversation
4. See real-time metrics

### Option 2: Live Chat with Gemini

1. **Select Customer**: Choose "Rajesh Kumar" from dropdown
2. **Start Call**: Click the green "Start Call" button
3. **Type Message**: Type "Kya update hai?" and press Enter
4. **See Response**: Gemini AI will respond in Hinglish!

### Option 3: Voice Input (Optional)

1. Click the **microphone button** (green circle)
2. Allow microphone access
3. Speak: "Namaste, construction update batao"
4. AI will respond with voice!

---

## 📊 What You Get with Gemini

### ✅ Advantages

| Feature | Gemini | OpenAI |
|---------|--------|--------|
| **Free Tier** | ✅ Yes (60 req/min) | ❌ No |
| **Setup** | No credit card | Credit card required |
| **Cost** | $0.075/1M tokens | $0.150/1M tokens |
| **Hindi Support** | Excellent | Good |
| **Speed** | Very Fast | Fast |

### 💰 Cost Example

**100 conversations per day:**
- Gemini: **~$1.13/month**
- OpenAI: **~$2.25/month**

**Savings: 50%!**

---

## 🔧 Configuration Options

### Use Gemini Pro (More Powerful)

Edit `backend/services/geminiService.js` line 17:

```javascript
model: 'gemini-1.5-pro',  // Instead of 'gemini-1.5-flash'
```

**When to use:**
- Need better reasoning
- Complex conversations
- More nuanced responses

**Cost:** Still cheaper than GPT-4!

### Adjust Response Style

Edit `backend/services/geminiService.js`:

```javascript
generationConfig: {
  temperature: 0.9,      // 0.0 = focused, 1.0 = creative
  maxOutputTokens: 500,  // Longer responses
}
```

---

## 🐛 Common Issues

### Issue 1: "API key not valid"

**Solution:**
```powershell
# Check your .env file
cd backend
type .env

# Make sure key starts with AIza
# No spaces before/after
# Restart server after changes
```

### Issue 2: "Module not found"

**Solution:**
```powershell
cd backend
npm install @google/generative-ai
npm run dev
```

### Issue 3: "Quota exceeded"

**Solution:**
- Free tier: 60 requests per minute
- Wait 1 minute
- Or upgrade to paid tier (still cheap!)

### Issue 4: Port already in use

**Solution:**
```powershell
# Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <process_id> /F

# Try again
npm run dev
```

---

## 📱 Testing Checklist

- [ ] Gemini API key added to `.env`
- [ ] Dependencies installed (`npm install`)
- [ ] Test script passes (`node test-gemini.js`)
- [ ] Backend starts successfully
- [ ] Frontend starts successfully
- [ ] Can access http://localhost:5173
- [ ] Can select customer
- [ ] Can send message
- [ ] AI responds in Hinglish
- [ ] Conversation history shows

---

## 🎓 Next Steps

### 1. Add ElevenLabs Voice (Optional)

Get free API key: https://elevenlabs.io/
Add to `.env`:
```env
ELEVENLABS_API_KEY=your-key-here
```

### 2. Customize Responses

Edit `backend/services/conversationService.js`:
- Change AI personality
- Adjust greetings
- Modify construction updates

### 3. Add More Customers

Edit customer database in `conversationService.js`:
```javascript
'CUST004': {
  name: 'Your Customer',
  plotNumber: 'B-205',
  // ... more details
}
```

### 4. Deploy to Production

- Use environment variables
- Enable rate limiting
- Monitor API usage
- Set up error logging

---

## 💡 Pro Tips

1. **Test without voice first** - Easier to debug
2. **Use Chrome/Edge** - Best browser support
3. **Check console logs** - Press F12 to see errors
4. **Monitor API usage** - Check Gemini dashboard
5. **Start with demo mode** - No API calls needed

---

## 📞 Support

### Gemini API Issues
- **Docs**: https://ai.google.dev/docs
- **Community**: https://discuss.ai.google.dev/

### App Issues
- Check `backend/` console for errors
- Check browser console (F12)
- Verify `.env` file is correct
- Restart both servers

---

## ✅ Success!

If you can:
1. ✅ Start both servers
2. ✅ Open http://localhost:5173
3. ✅ Send a message
4. ✅ Get AI response

**You're all set!** 🎉

Your Riverwood AI Voice Agent is now powered by Google Gemini!

---

## 🎬 Quick Demo Commands

```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev

# Terminal 3 - Test Gemini
cd backend
node test-gemini.js
```

**Open browser:** http://localhost:5173

**Start chatting!** 🚀✨
