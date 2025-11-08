# Riverwood AI Voice Agent 🏗️🎙️

An intelligent voice agent that calls customers daily with construction updates in a friendly, personalized manner using Hinglish (Hindi + English mix).

## 🚀 Features

- **Conversational AI**: Powered by OpenAI GPT-4o-mini for natural conversations
- **Voice Synthesis**: ElevenLabs API for natural Indian voice text-to-speech
- **Speech Recognition**: Web Speech API integration for voice input
- **Memory System**: Conversation history tracking with JSON storage
- **Construction Updates**: Automated daily update simulator
- **Bilingual Support**: Seamless Hindi-English (Hinglish) conversations
- **Real-time Demo**: Interactive React frontend for testing

## 🛠️ Tech Stack

### Backend
- Node.js with Express
- OpenAI GPT-4o-mini API
- ElevenLabs Text-to-Speech API
- JSON-based conversation memory

### Frontend
- React 18
- Vite
- TailwindCSS
- Lucide Icons
- Web Speech API

## 📁 Project Structure

```
riverwood/
├── backend/
│   ├── server.js              # Main Express server
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   │   ├── openai.service.js  # OpenAI integration
│   │   ├── elevenlabs.service.js # Voice synthesis
│   │   └── memory.service.js  # Conversation memory
│   ├── data/                  # JSON storage
│   │   └── conversations.json # Conversation history
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main React component
│   │   ├── components/        # React components
│   │   └── services/          # API clients
│   ├── index.html
│   └── package.json
├── .env.example               # Environment variables template
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- OpenAI API key
- ElevenLabs API key

### 1. Clone and Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` in the root directory and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your actual API keys:
```
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
```

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

## 🎯 Usage

1. Open http://localhost:5173 in your browser
2. Click "Start Conversation" to begin
3. Speak or type your message
4. The AI agent will respond with construction updates in Hinglish
5. View conversation history and memory in the interface

## 🔑 API Endpoints

### Backend API

- `POST /api/chat` - Send message and get AI response
- `POST /api/voice/synthesize` - Convert text to speech
- `GET /api/conversations/:customerId` - Get conversation history
- `POST /api/conversations` - Save conversation
- `GET /api/updates/:projectId` - Get construction updates

## 🌟 Features in Detail

### Conversational Intelligence
- Context-aware responses using GPT-4o-mini
- Personalized greetings and updates
- Natural Hinglish conversation flow

### Voice Capabilities
- High-quality Indian voice synthesis via ElevenLabs
- Real-time speech recognition
- Audio playback controls

### Memory System
- Persistent conversation history
- Customer preference tracking
- Context retention across sessions

### Construction Updates
- Daily automated updates
- Project-specific information
- Progress tracking and milestones

## 📝 License

MIT License - feel free to use for your projects!

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for Riverwood Real Estate
