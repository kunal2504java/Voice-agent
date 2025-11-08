import express from 'express';
import voiceService from '../services/voiceService.js';

const router = express.Router();

// POST /api/voice/synthesize - Convert text to speech
router.post('/synthesize', async (req, res) => {
  try {
    const { text, voiceId, voiceSettings } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'text is required'
      });
    }

    console.log(`🎤 Voice synthesis request: "${text.substring(0, 50)}..."`);

    const result = await voiceService.synthesizeSpeech(text, voiceId, voiceSettings);

    if (!result.success) {
      console.warn('⚠️ ElevenLabs failed, sending browser TTS fallback');
      // Return error but indicate client should use browser TTS
      return res.status(200).json({
        success: false,
        useBrowserTTS: true,
        text: text,
        error: result.error
      });
    }

    console.log(`✅ ElevenLabs synthesis successful`);

    // Set response headers
    res.set({
      'Content-Type': result.contentType,
      'Content-Length': result.audio.length,
      'X-Character-Count': result.metadata.characterCount,
      'X-Processing-Time': result.metadata.processingTime,
      'X-Estimated-Cost': result.metadata.estimatedCost
    });

    res.send(result.audio);
  } catch (error) {
    console.error('❌ Voice synthesis error:', error.message);
    // Return success with flag to use browser TTS
    res.status(200).json({
      success: false,
      useBrowserTTS: true,
      text: text,
      error: error.message
    });
  }
});

// POST /api/voice/stream - Stream text to speech
router.post('/stream', async (req, res) => {
  try {
    const { text, voiceId } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'text is required'
      });
    }

    const result = await voiceService.streamSpeech(text, voiceId);

    if (!result.success) {
      return res.status(500).json({
        error: result.error,
        errorCode: result.errorCode,
        retryable: result.retryable
      });
    }

    res.set({
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked',
      'X-Character-Count': result.metadata.characterCount
    });

    result.stream.pipe(res);
  } catch (error) {
    console.error('Voice streaming error:', error);
    res.status(500).json({
      error: 'Failed to stream speech',
      details: error.message
    });
  }
});

// GET /api/voice/voices - Get available voices
router.get('/voices', async (req, res) => {
  try {
    const result = await voiceService.getAvailableVoices();
    res.json(result);
  } catch (error) {
    console.error('Voices fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch voices',
      details: error.message
    });
  }
});

// GET /api/voice/usage - Get usage statistics
router.get('/usage', (req, res) => {
  try {
    const stats = voiceService.getUsageStats();
    res.json({
      success: true,
      usage: stats
    });
  } catch (error) {
    console.error('Usage stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch usage statistics',
      details: error.message
    });
  }
});

// GET /api/voice/health - Check voice service health
router.get('/health', async (req, res) => {
  try {
    const health = await voiceService.getHealthStatus();
    res.json(health);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

// POST /api/voice/test - Test voice synthesis
router.post('/test', async (req, res) => {
  try {
    const { voiceId } = req.body;
    const success = await voiceService.testVoice(voiceId);
    
    res.json({
      success: success,
      message: success ? 'Voice test successful' : 'Voice test failed'
    });
  } catch (error) {
    console.error('Voice test error:', error);
    res.status(500).json({
      error: 'Failed to test voice',
      details: error.message
    });
  }
});

// POST /api/voice/estimate - Estimate conversation cost
router.post('/estimate', (req, res) => {
  try {
    const { messageCount, avgCharactersPerMessage } = req.body;
    
    if (!messageCount) {
      return res.status(400).json({
        error: 'messageCount is required'
      });
    }

    const estimate = voiceService.estimateConversationCost(
      messageCount,
      avgCharactersPerMessage
    );
    
    res.json({
      success: true,
      estimate: estimate
    });
  } catch (error) {
    console.error('Cost estimation error:', error);
    res.status(500).json({
      error: 'Failed to estimate cost',
      details: error.message
    });
  }
});

export default router;
