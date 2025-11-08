# 🚀 Riverwood AI Voice Agent - Quick Start

## ⚡ 3-Step Setup

### Step 1: Get API Keys (5 minutes)
1. **OpenAI**: https://platform.openai.com/api-keys
2. **ElevenLabs**: https://elevenlabs.io/ → Profile → API Keys

### Step 2: Configure (2 minutes)
```powershell
# Edit .env file in root directory
OPENAI_API_KEY=sk-your-key-here
ELEVENLABS_API_KEY=your-key-here
```

### Step 3: Run (1 minute)
```powershell
# Option A: Automated (Recommended)
.\setup.ps1    # First time only
.\start.ps1    # Every time

# Option B: Manual
cd backend && npm install && npm run dev    # Terminal 1
cd frontend && npm install && npm run dev   # Terminal 2
```

## 🎯 Access
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

## 💬 Usage
1. Select project (RW001 or RW002)
2. Click "Start Conversation"
3. Talk (🎤) or Type (⌨️)
4. Listen to AI responses in Hinglish

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Check .env file has valid API keys |
| Voice not working | Use Chrome/Edge, allow microphone |
| Port in use | Change PORT in .env |
| API errors | Verify API keys have credits |

## 📚 Documentation
- **Full Setup**: See `SETUP_GUIDE.md`
- **Project Details**: See `PROJECT_SUMMARY.md`
- **Features**: See `README.md`

## 🎤 Sample Conversations

**English**: "What's the update?"
**Hinglish**: "Kya update hai?"
**Response**: "Aaj ka update bahut accha hai! Ground floor 60% complete ho gaya hai."

## 🔑 Key Files
```
.env                    # Your API keys (CREATE THIS!)
backend/server.js       # Backend entry point
frontend/src/App.jsx    # Frontend entry point
```

## ⚠️ Important
- ✅ Node.js 18+ required
- ✅ Chrome/Edge for voice input
- ✅ Valid API keys needed
- ✅ Internet connection required

## 🆘 Need Help?
1. Check `SETUP_GUIDE.md` for detailed instructions
2. Review backend console for errors
3. Check browser console for frontend errors

---

**That's it! You're ready to go! 🎉**
