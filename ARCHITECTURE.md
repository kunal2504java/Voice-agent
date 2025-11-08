# Riverwood AI Voice Agent - Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (React Frontend - Port 5173)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Project    │  │ Construction │  │     Chat     │        │
│  │   Selector   │  │    Update    │  │   Messages   │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐         │
│  │         Voice Interface Component                │         │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐      │         │
│  │  │   Mic    │  │  Audio   │  │   Text   │      │         │
│  │  │  Input   │  │  Player  │  │  Input   │      │         │
│  │  └──────────┘  └──────────┘  └──────────┘      │         │
│  └──────────────────────────────────────────────────┘         │
│                                                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP/REST API
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    BACKEND API SERVER                           │
│                  (Express.js - Port 3001)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    API ROUTES                           │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │  │
│  │  │   Chat   │ │  Voice   │ │  Memory  │ │Construction│ │  │
│  │  │  Routes  │ │  Routes  │ │  Routes  │ │  Routes   │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                            │                                    │
│  ┌─────────────────────────▼───────────────────────────────┐  │
│  │                    SERVICES LAYER                       │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │  │
│  │  │  OpenAI  │ │ElevenLabs│ │  Memory  │ │Construction│ │  │
│  │  │ Service  │ │ Service  │ │ Service  │ │  Service  │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                            │                                    │
└────────────────────────────┼────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│   OpenAI API  │  │ ElevenLabs API│  │  JSON Files   │
│  (GPT-4o-mini)│  │     (TTS)     │  │  (Storage)    │
└───────────────┘  └───────────────┘  └───────────────┘
```

## 🔄 Data Flow

### 1. Voice Input Flow
```
User Speaks
    ↓
Web Speech API (Browser)
    ↓
Transcript Generated
    ↓
Sent to Backend (/api/chat)
    ↓
OpenAI Service (GPT-4o-mini)
    ↓
AI Response Generated
    ↓
Saved to Memory Service
    ↓
Sent to ElevenLabs Service
    ↓
Audio Generated
    ↓
Played in Browser
```

### 2. Text Input Flow
```
User Types Message
    ↓
Sent to Backend (/api/chat)
    ↓
OpenAI Service (GPT-4o-mini)
    ↓
AI Response Generated
    ↓
Saved to Memory Service
    ↓
Sent to ElevenLabs Service
    ↓
Audio Generated
    ↓
Played in Browser
```

### 3. Construction Update Flow
```
User Selects Project
    ↓
Frontend Requests Update
    ↓
Backend Construction Service
    ↓
Generate Random Update
    ↓
Include in AI Context
    ↓
AI Mentions Update in Response
    ↓
Update Card Displayed
```

## 🧩 Component Breakdown

### Frontend Components

#### App.jsx (Main Container)
- Manages global state
- Handles API calls
- Coordinates all child components

#### VoiceInterface.jsx
- Web Speech API integration
- Microphone button
- Listening state management

#### ChatMessage.jsx
- Individual message display
- User vs AI styling
- Audio playback trigger

#### ConstructionUpdate.jsx
- Update card display
- Progress visualization
- Project details

#### ProjectSelector.jsx
- Project dropdown
- Project switching
- Project info display

### Backend Services

#### openai.service.js
```javascript
- generateResponse()      // Main conversation logic
- generateGreeting()      // Initial greeting
- buildSystemPrompt()     // Context building
```

#### elevenlabs.service.js
```javascript
- textToSpeech()         // Generate audio
- streamTextToSpeech()   // Stream audio
- getVoices()            // List available voices
```

#### memory.service.js
```javascript
- getConversationHistory()  // Fetch history
- saveMessage()             // Save message
- getCustomerContext()      // Get context
- clearHistory()            // Clear history
```

#### construction.service.js
```javascript
- generateDailyUpdate()     // Create update
- getProjectInfo()          // Get project
- getConstructionTimeline() // Get timeline
```

## 🔐 Security Layers

```
┌─────────────────────────────────────┐
│         Environment Variables       │
│  (API Keys stored securely in .env) │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│         CORS Protection             │
│  (Only frontend URL allowed)        │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│         Input Validation            │
│  (Request body validation)          │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│         Error Handling              │
│  (Try-catch blocks everywhere)      │
└─────────────────────────────────────┘
```

## 📊 State Management

### Frontend State (React useState)
```javascript
- messages[]              // Chat history
- inputMessage           // Current input
- isListening            // Voice recording state
- isSending              // API call state
- isPlaying              // Audio playing state
- selectedProject        // Current project
- constructionUpdate     // Latest update
- customerId             // User identifier
```

### Backend State (JSON Files)
```javascript
conversations.json
{
  "CUST001": [
    {
      "role": "user",
      "content": "Hello",
      "timestamp": "2024-01-01T10:00:00Z"
    },
    {
      "role": "assistant",
      "content": "Namaste!",
      "timestamp": "2024-01-01T10:00:01Z"
    }
  ]
}
```

## 🌐 API Endpoints Map

```
Backend API (localhost:3001)
│
├── /health (GET)
│   └── Health check
│
├── /api/chat
│   ├── POST /
│   │   └── Send message, get response
│   └── POST /greeting
│       └── Get initial greeting
│
├── /api/voice
│   ├── POST /synthesize
│   │   └── Text to speech
│   ├── POST /stream
│   │   └── Stream audio
│   └── GET /voices
│       └── List voices
│
├── /api/memory
│   ├── GET /:customerId
│   │   └── Get history
│   ├── GET /:customerId/context
│   │   └── Get context
│   └── DELETE /:customerId
│       └── Clear history
│
└── /api/construction
    ├── GET /projects
    │   └── List all projects
    ├── GET /projects/:projectId
    │   └── Get project info
    ├── GET /updates/:projectId
    │   └── Get daily update
    └── GET /timeline/:projectId
        └── Get timeline
```

## 🔄 Request/Response Flow

### Example: Sending a Message

**1. Frontend Request**
```javascript
POST http://localhost:3001/api/chat
Content-Type: application/json

{
  "customerId": "CUST001",
  "message": "Kya update hai?",
  "projectId": "RW001"
}
```

**2. Backend Processing**
```javascript
// 1. Receive request
// 2. Get conversation history from memory
// 3. Get construction update
// 4. Build context for OpenAI
// 5. Call OpenAI API
// 6. Save response to memory
// 7. Return response
```

**3. Backend Response**
```javascript
{
  "success": true,
  "response": "Aaj ka update bahut accha hai! Ground floor 60% complete...",
  "constructionUpdate": {
    "projectId": "RW001",
    "currentPhase": "Ground Floor Construction",
    "overallProgress": 65,
    ...
  },
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 80,
    "total_tokens": 230
  }
}
```

**4. Frontend Processing**
```javascript
// 1. Receive response
// 2. Add to messages array
// 3. Update construction update card
// 4. Call voice synthesis API
// 5. Play audio
```

## 🎨 UI/UX Flow

```
┌─────────────────────────────────────┐
│         Landing Screen              │
│  - Header with branding             │
│  - Project selector                 │
│  - "Start Conversation" button      │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│      Conversation Screen            │
│  ┌─────────────────────────────┐   │
│  │   Construction Update Card  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │      Chat Messages          │   │
│  │  - AI greeting              │   │
│  │  - User messages            │   │
│  │  - AI responses             │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │   Input Controls            │   │
│  │  [🎤] [Text Input] [Send]   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

## 🚀 Performance Considerations

### Frontend Optimization
- React component memoization
- Lazy loading for components
- Debouncing for API calls
- Audio caching

### Backend Optimization
- Response streaming for audio
- Conversation history limiting (50 messages)
- Efficient JSON file operations
- Error handling to prevent crashes

## 🔧 Configuration Files

### Backend
- `package.json` - Dependencies
- `.env` - Environment variables
- `server.js` - Entry point

### Frontend
- `package.json` - Dependencies
- `vite.config.js` - Build config
- `tailwind.config.js` - Styling config
- `postcss.config.js` - CSS processing

## 📦 Dependencies Overview

### Backend (Node.js)
```
express          - Web framework
cors             - CORS middleware
dotenv           - Environment variables
axios            - HTTP client
openai           - OpenAI SDK
elevenlabs-node  - ElevenLabs SDK
ws               - WebSocket support
uuid             - ID generation
multer           - File uploads
```

### Frontend (React)
```
react            - UI framework
react-dom        - React renderer
axios            - API client
lucide-react     - Icons
vite             - Build tool
tailwindcss      - CSS framework
```

## 🎯 Key Design Decisions

1. **JSON Storage**: Simple, no database setup needed
2. **REST API**: Standard, easy to understand
3. **Web Speech API**: No external dependencies
4. **Component Architecture**: Modular, reusable
5. **Service Layer**: Separation of concerns
6. **Environment Variables**: Secure configuration
7. **TailwindCSS**: Rapid UI development
8. **Vite**: Fast development experience

---

This architecture provides a solid foundation for a production-ready voice agent system!
