# Riverwood AI Voice Agent - Setup Guide

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **OpenAI API Key** - [Get it here](https://platform.openai.com/api-keys)
- **ElevenLabs API Key** - [Get it here](https://elevenlabs.io/)

### Step 1: Get API Keys

#### OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (starts with `sk-`)

#### ElevenLabs API Key
1. Go to https://elevenlabs.io/
2. Sign up for a free account
3. Go to Profile Settings → API Keys
4. Copy your API key

### Step 2: Configure Environment

1. Open the `.env` file in the root directory
2. Add your API keys:

```env
OPENAI_API_KEY=sk-your-openai-key-here
ELEVENLABS_API_KEY=your-elevenlabs-key-here
ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 3: Install Dependencies

**Option A: Using PowerShell Script (Recommended)**
```powershell
.\setup.ps1
```

**Option B: Manual Installation**
```powershell
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 4: Start the Application

**Option A: Using PowerShell Script (Recommended)**
```powershell
.\start.ps1
```

**Option B: Manual Start**

Open two terminal windows:

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Step 5: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 🎯 Using the Voice Agent

1. **Select a Project**: Choose from the dropdown (RW001 or RW002)
2. **Start Conversation**: Click "Start Conversation" button
3. **Interact**:
   - **Voice Input**: Click the microphone button and speak
   - **Text Input**: Type your message in the input field
   - **Listen**: Click "Play Audio" on any AI response to hear it

## 🗣️ Sample Conversations

### Example 1: Initial Greeting
**User**: "Hello"
**AI**: "Namaste! Main Riverwood se bol rahi hoon. Aaj aapke project ke baare mein ek exciting update hai!"

### Example 2: Asking About Progress
**User**: "Kya update hai?"
**AI**: "Aaj ka update bahut accha hai! Ground floor construction 60% complete ho gaya hai. Workers ne pillars ka kaam finish kar diya hai."

### Example 3: Asking Questions
**User**: "Kab complete hoga?"
**AI**: "Aapka project on schedule hai! Expected completion date June 2025 hai. Bilkul time pe complete hoga."

## 🛠️ Troubleshooting

### Backend Not Starting
- Check if `.env` file exists with valid API keys
- Ensure port 3001 is not in use
- Run `npm install` in backend directory

### Frontend Not Starting
- Ensure port 5173 is not in use
- Run `npm install` in frontend directory
- Check if backend is running

### Voice Not Working
- Use Chrome or Edge browser (Safari not supported)
- Allow microphone permissions
- Check if ElevenLabs API key is valid

### API Errors
- Verify OpenAI API key is valid and has credits
- Verify ElevenLabs API key is valid
- Check backend console for error messages

## 📁 Project Structure

```
riverwood/
├── backend/
│   ├── server.js              # Express server
│   ├── routes/                # API endpoints
│   │   ├── chat.routes.js
│   │   ├── voice.routes.js
│   │   ├── memory.routes.js
│   │   └── construction.routes.js
│   ├── services/              # Business logic
│   │   ├── openai.service.js
│   │   ├── elevenlabs.service.js
│   │   ├── memory.service.js
│   │   └── construction.service.js
│   └── data/                  # JSON storage
│       └── conversations.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main component
│   │   ├── components/        # React components
│   │   └── services/          # API client
│   └── public/
└── .env                       # Environment variables
```

## 🔑 API Endpoints

### Chat
- `POST /api/chat` - Send message
- `POST /api/chat/greeting` - Get greeting

### Voice
- `POST /api/voice/synthesize` - Text-to-speech
- `GET /api/voice/voices` - List voices

### Memory
- `GET /api/memory/:customerId` - Get history
- `DELETE /api/memory/:customerId` - Clear history

### Construction
- `GET /api/construction/projects` - List projects
- `GET /api/construction/updates/:projectId` - Get update

## 💡 Tips

1. **Voice Recognition**: Speak clearly in Hindi or English
2. **API Costs**: Monitor your OpenAI and ElevenLabs usage
3. **Testing**: Use text input first to test functionality
4. **Browser**: Chrome/Edge recommended for best voice support

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend console logs
3. Check browser console for frontend errors

## 📝 License

MIT License - Free to use and modify!

---

Built with ❤️ for Riverwood Real Estate
