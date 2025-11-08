import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables FIRST before any other imports
const result = dotenv.config({ path: join(__dirname, '.env') });

if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
} else {
  console.log('✅ Environment variables loaded');
  console.log('   GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Found' : 'Missing');
  console.log('   ELEVENLABS_API_KEY:', process.env.ELEVENLABS_API_KEY ? 'Found' : 'Missing');
}

import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat.routes.js';
import voiceRoutes from './routes/voice.routes.js';
import memoryRoutes from './routes/memory.routes.js';
import constructionRoutes from './routes/construction.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Riverwood Voice Agent API'
  });
});

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/construction', constructionRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Riverwood AI Voice Agent API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      chat: '/api/chat',
      voice: '/api/voice',
      memory: '/api/memory',
      construction: '/api/construction'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🏗️  Riverwood AI Voice Agent API                   ║
║                                                       ║
║   Server running on: http://localhost:${PORT}        ║
║   Environment: ${process.env.NODE_ENV || 'development'}                      ║
║                                                       ║
║   Ready to serve construction updates! 🎙️            ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  process.exit(0);
});
