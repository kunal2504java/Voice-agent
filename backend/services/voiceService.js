import axios from 'axios';
import speechOptimizer from './speechOptimizer.js';

class VoiceService {
  constructor() {
    this.initialized = false;
    this.baseUrl = 'https://api.elevenlabs.io/v1';
  }

  initialize() {
    if (this.initialized) return;
    
    this.apiKey = process.env.ELEVENLABS_API_KEY;
    
    console.log('🔑 VoiceService initializing...');
    console.log('   API Key:', this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'NOT FOUND');
    
    // Voice configuration
    this.defaultVoiceId = process.env.ELEVENLABS_VOICE_ID || this.getOptimalVoice();
    console.log('   Voice ID:', this.defaultVoiceId);
    
    this.initialized = true;
    console.log('✅ VoiceService ready!');
    
    // Pricing information (as of 2024)
    this.pricing = {
      free: {
        charactersPerMonth: 10000,
        costPerCharacter: 0
      },
      starter: {
        charactersPerMonth: 30000,
        costPerCharacter: 0.00030 // $0.30 per 1000 characters
      },
      creator: {
        charactersPerMonth: 100000,
        costPerCharacter: 0.00024 // $0.24 per 1000 characters
      },
      pro: {
        charactersPerMonth: 500000,
        costPerCharacter: 0.00018 // $0.18 per 1000 characters
      }
    };

    // Track usage for cost estimation
    this.usageStats = {
      totalCharacters: 0,
      totalRequests: 0,
      estimatedCost: 0,
      lastReset: new Date()
    };

    // Voice settings optimized for natural, conversational speech
    this.optimalSettings = {
      stability: 0.65,           // Slightly lower for more natural variation
      similarity_boost: 0.80,    // High similarity for authentic voice
      style: 0.65,               // More expressive for conversational feel
      use_speaker_boost: true    // Enhanced clarity
    };
  }

  /**
   * Get optimal voice ID for Indian female voice
   * Returns recommended voice with reasoning
   */
  getOptimalVoice() {
    // Recommended ElevenLabs voices for Indian English (female, warm tone)
    const recommendedVoices = {
      // Primary recommendation
      primary: {
        id: 'pNInz6obpgDQGcFmaJgB', // Adam (can be adjusted for female tone)
        name: 'Bella',
        description: 'Warm, friendly female voice - excellent for customer service',
        accent: 'American English (adaptable)',
        reasoning: 'Bella has a warm, conversational tone perfect for building rapport with customers. Natural inflection works well with Hinglish.'
      },
      // Alternative options
      alternatives: [
        {
          id: 'EXAVITQu4vr4xnSDxMaL', // Sarah
          name: 'Sarah',
          description: 'Professional yet friendly female voice',
          accent: 'American English',
          reasoning: 'Clear pronunciation, professional tone suitable for real estate updates'
        },
        {
          id: 'ThT5KcBeYPX3keUQqHPh', // Dorothy
          name: 'Dorothy',
          description: 'Pleasant, mature female voice',
          accent: 'British English',
          reasoning: 'Sophisticated tone, works well for premium real estate communication'
        }
      ]
    };

    console.log('Voice Selection Reasoning:');
    console.log(`Primary: ${recommendedVoices.primary.name} - ${recommendedVoices.primary.reasoning}`);
    
    return recommendedVoices.primary.id;
  }

  /**
   * Main function to synthesize speech from text
   * @param {string} text - Text to convert to speech
   * @param {string} voiceId - Optional voice ID (uses default if not provided)
   * @param {object} customSettings - Optional custom voice settings
   * @returns {Promise<object>} Audio data and metadata
   */
  async synthesizeSpeech(text, voiceId = null, customSettings = {}) {
    try {
      // Initialize on first use
      this.initialize();
      
      // Validate inputs
      if (!text || text.trim().length === 0) {
        return {
          success: false,
          error: 'Text cannot be empty'
        };
      }

      if (!this.apiKey) {
        console.warn('⚠️ ElevenLabs API key not configured, will use browser TTS');
        return {
          success: false,
          error: 'ElevenLabs API key not configured',
          useBrowserTTS: true
        };
      }

      // 🎯 OPTIMIZE TEXT FOR NATURAL SPEECH
      const optimizedText = speechOptimizer.optimize(text);
      const characterCount = optimizedText.length;
      
      // Check if text is too long (ElevenLabs has limits)
      if (characterCount > 5000) {
        throw new Error('Text too long. Maximum 5000 characters per request.');
      }

      // Use provided voice or default
      const selectedVoiceId = voiceId || this.defaultVoiceId;

      // Merge custom settings with optimal settings
      const voiceSettings = {
        ...this.optimalSettings,
        ...customSettings
      };

      // Prepare API request
      const url = `${this.baseUrl}/text-to-speech/${selectedVoiceId}`;
      
      console.log(`Synthesizing speech: ${characterCount} characters`);
      console.log(`Voice ID: ${selectedVoiceId}`);

      const startTime = Date.now();

      // Call ElevenLabs API with optimized text
      const response = await axios.post(
        url,
        {
          text: optimizedText,
          model_id: 'eleven_multilingual_v2', // Supports multiple languages including Hindi
          voice_settings: voiceSettings
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer',
          timeout: 30000 // 30 second timeout
        }
      );

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      // Convert to Buffer
      const audioBuffer = Buffer.from(response.data);

      // Update usage statistics
      this.updateUsageStats(characterCount);

      // Calculate cost for this request
      const estimatedCost = this.calculateCost(characterCount);

      console.log(`✓ Speech synthesized successfully in ${processingTime}ms`);
      console.log(`  Characters: ${characterCount}`);
      console.log(`  Estimated cost: $${estimatedCost.toFixed(4)}`);

      return {
        success: true,
        audio: audioBuffer,
        contentType: 'audio/mpeg',
        metadata: {
          characterCount: characterCount,
          processingTime: processingTime,
          voiceId: selectedVoiceId,
          voiceSettings: voiceSettings,
          estimatedCost: estimatedCost,
          audioSize: audioBuffer.length
        }
      };

    } catch (error) {
      return this.handleError(error, text);
    }
  }

  /**
   * Stream speech synthesis for real-time playback
   * @param {string} text - Text to convert to speech
   * @param {string} voiceId - Optional voice ID
   * @returns {Promise<Stream>} Audio stream
   */
  async streamSpeech(text, voiceId = null) {
    try {
      if (!text || text.trim().length === 0) {
        throw new Error('Text cannot be empty');
      }

      if (!this.apiKey) {
        throw new Error('ElevenLabs API key not configured');
      }

      const selectedVoiceId = voiceId || this.defaultVoiceId;
      const url = `${this.baseUrl}/text-to-speech/${selectedVoiceId}/stream`;

      console.log(`Streaming speech: ${text.length} characters`);

      const response = await axios.post(
        url,
        {
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: this.optimalSettings
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json'
          },
          responseType: 'stream',
          timeout: 30000
        }
      );

      // Update usage stats
      this.updateUsageStats(text.length);

      return {
        success: true,
        stream: response.data,
        metadata: {
          characterCount: text.length,
          voiceId: selectedVoiceId
        }
      };

    } catch (error) {
      return this.handleError(error, text);
    }
  }

  /**
   * Get available voices from ElevenLabs
   * @returns {Promise<Array>} List of available voices
   */
  async getAvailableVoices() {
    try {
      if (!this.apiKey) {
        throw new Error('ElevenLabs API key not configured');
      }

      const url = `${this.baseUrl}/voices`;
      
      const response = await axios.get(url, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      const voices = response.data.voices;

      // Filter and annotate voices suitable for Indian English
      const suitableVoices = voices.map(voice => ({
        id: voice.voice_id,
        name: voice.name,
        category: voice.category,
        description: voice.description || 'No description',
        labels: voice.labels,
        previewUrl: voice.preview_url,
        recommended: this.isRecommendedVoice(voice)
      }));

      return {
        success: true,
        voices: suitableVoices,
        total: voices.length
      };

    } catch (error) {
      console.error('Failed to fetch voices:', error.message);
      throw new Error(`Failed to fetch voices: ${error.message}`);
    }
  }

  /**
   * Check if voice is recommended for Indian English
   */
  isRecommendedVoice(voice) {
    const femaleIndicators = ['female', 'woman', 'girl'];
    const warmIndicators = ['warm', 'friendly', 'conversational', 'pleasant'];
    
    const name = voice.name?.toLowerCase() || '';
    const description = voice.description?.toLowerCase() || '';
    const labels = voice.labels ? Object.values(voice.labels).join(' ').toLowerCase() : '';
    
    const allText = `${name} ${description} ${labels}`;
    
    const isFemale = femaleIndicators.some(indicator => allText.includes(indicator));
    const isWarm = warmIndicators.some(indicator => allText.includes(indicator));
    
    return isFemale && isWarm;
  }

  /**
   * Calculate estimated cost for character count
   * @param {number} characterCount - Number of characters
   * @param {string} tier - Pricing tier (default: 'starter')
   * @returns {number} Estimated cost in USD
   */
  calculateCost(characterCount, tier = 'starter') {
    const tierPricing = this.pricing[tier] || this.pricing.starter;
    return characterCount * tierPricing.costPerCharacter;
  }

  /**
   * Update usage statistics
   */
  updateUsageStats(characterCount) {
    this.usageStats.totalCharacters += characterCount;
    this.usageStats.totalRequests += 1;
    this.usageStats.estimatedCost = this.calculateCost(this.usageStats.totalCharacters);

    // Reset monthly stats if needed
    const now = new Date();
    const lastReset = new Date(this.usageStats.lastReset);
    
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      console.log('Monthly usage stats reset');
      this.usageStats = {
        totalCharacters: characterCount,
        totalRequests: 1,
        estimatedCost: this.calculateCost(characterCount),
        lastReset: now
      };
    }
  }

  /**
   * Get current usage statistics
   */
  getUsageStats() {
    return {
      ...this.usageStats,
      averageCharactersPerRequest: this.usageStats.totalRequests > 0 
        ? Math.round(this.usageStats.totalCharacters / this.usageStats.totalRequests)
        : 0,
      remainingFreeCharacters: Math.max(0, this.pricing.free.charactersPerMonth - this.usageStats.totalCharacters)
    };
  }

  /**
   * Test voice synthesis with sample text
   */
  async testVoice(voiceId = null) {
    const testText = "Namaste! Main Priya bol rahi hoon Riverwood se. Aaj aapke ghar ki construction mein bahut acchi progress hui hai.";
    
    console.log('Testing voice synthesis...');
    console.log(`Test text: "${testText}"`);
    
    try {
      const result = await this.synthesizeSpeech(testText, voiceId);
      
      if (result.success) {
        console.log('✓ Voice test successful!');
        console.log(`  Audio size: ${(result.metadata.audioSize / 1024).toFixed(2)} KB`);
        console.log(`  Processing time: ${result.metadata.processingTime}ms`);
        console.log(`  Cost: $${result.metadata.estimatedCost.toFixed(4)}`);
        return true;
      } else {
        console.log('✗ Voice test failed');
        return false;
      }
    } catch (error) {
      console.error('Voice test error:', error.message);
      return false;
    }
  }

  /**
   * Handle errors with detailed information
   */
  handleError(error, text = '') {
    console.error('Voice Service Error:', error.message);

    let errorMessage = 'Failed to synthesize speech';
    let errorCode = 'SYNTHESIS_ERROR';
    let retryable = false;

    if (error.response) {
      const status = error.response.status;
      
      switch (status) {
        case 401:
          errorMessage = 'Invalid API key. Please check your ElevenLabs API key.';
          errorCode = 'INVALID_API_KEY';
          break;
        
        case 429:
          errorMessage = 'Rate limit exceeded. Please try again later.';
          errorCode = 'RATE_LIMIT';
          retryable = true;
          break;
        
        case 400:
          errorMessage = 'Invalid request. Check text length and voice ID.';
          errorCode = 'INVALID_REQUEST';
          break;
        
        case 500:
        case 502:
        case 503:
          errorMessage = 'ElevenLabs service temporarily unavailable.';
          errorCode = 'SERVICE_UNAVAILABLE';
          retryable = true;
          break;
        
        default:
          errorMessage = `API error: ${error.response.statusText}`;
          errorCode = 'API_ERROR';
      }
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Text might be too long.';
      errorCode = 'TIMEOUT';
      retryable = true;
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorMessage = 'Cannot connect to ElevenLabs API. Check internet connection.';
      errorCode = 'CONNECTION_ERROR';
      retryable = true;
    }

    return {
      success: false,
      error: errorMessage,
      errorCode: errorCode,
      retryable: retryable,
      details: {
        originalError: error.message,
        textLength: text.length,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Get voice service health status
   */
  async getHealthStatus() {
    try {
      // Try to fetch voices as a health check
      const voices = await this.getAvailableVoices();
      
      return {
        status: 'healthy',
        apiKeyConfigured: !!this.apiKey,
        voicesAvailable: voices.voices.length,
        usageStats: this.getUsageStats(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        apiKeyConfigured: !!this.apiKey,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Estimate cost for a conversation
   * @param {number} messageCount - Expected number of messages
   * @param {number} avgCharactersPerMessage - Average characters per message
   */
  estimateConversationCost(messageCount, avgCharactersPerMessage = 150) {
    const totalCharacters = messageCount * avgCharactersPerMessage;
    const cost = this.calculateCost(totalCharacters);
    
    return {
      messageCount: messageCount,
      avgCharactersPerMessage: avgCharactersPerMessage,
      totalCharacters: totalCharacters,
      estimatedCost: cost,
      costPerMessage: cost / messageCount,
      formattedCost: `$${cost.toFixed(4)}`
    };
  }
}

export default new VoiceService();
