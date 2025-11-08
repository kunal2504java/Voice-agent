import axios from 'axios';

class ElevenLabsService {
  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
    this.voiceId = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB';
    this.baseUrl = 'https://api.elevenlabs.io/v1';
  }

  async textToSpeech(text, voiceSettings = {}) {
    try {
      const url = `${this.baseUrl}/text-to-speech/${this.voiceId}`;
      
      const response = await axios.post(
        url,
        {
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: voiceSettings.stability || 0.5,
            similarity_boost: voiceSettings.similarity_boost || 0.75,
            style: voiceSettings.style || 0.5,
            use_speaker_boost: true
          }
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );

      return {
        audio: Buffer.from(response.data),
        contentType: 'audio/mpeg'
      };
    } catch (error) {
      console.error('ElevenLabs API Error:', error.response?.data || error.message);
      throw new Error('Failed to synthesize speech');
    }
  }

  async getVoices() {
    try {
      const url = `${this.baseUrl}/voices`;
      
      const response = await axios.get(url, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      return response.data.voices;
    } catch (error) {
      console.error('Error fetching voices:', error);
      throw new Error('Failed to fetch voices');
    }
  }

  async streamTextToSpeech(text, voiceSettings = {}) {
    try {
      const url = `${this.baseUrl}/text-to-speech/${this.voiceId}/stream`;
      
      const response = await axios.post(
        url,
        {
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: voiceSettings.stability || 0.5,
            similarity_boost: voiceSettings.similarity_boost || 0.75,
            style: voiceSettings.style || 0.5,
            use_speaker_boost: true
          }
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json'
          },
          responseType: 'stream'
        }
      );

      return response.data;
    } catch (error) {
      console.error('ElevenLabs Streaming Error:', error);
      throw new Error('Failed to stream speech');
    }
  }
}

export default new ElevenLabsService();
