import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';

dotenv.config();

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

console.log('Testing ElevenLabs API');
console.log('API Key:', API_KEY?.substring(0, 20) + '...');
console.log('Voice ID:', VOICE_ID);

async function testElevenLabs() {
  try {
    const text = "Namaste! Main Priya hoon Riverwood se.";
    
    console.log('\nSending request to ElevenLabs...');
    
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer',
        timeout: 30000
      }
    );
    
    console.log('SUCCESS! Audio received');
    console.log('Audio size:', response.data.length, 'bytes');
    
    // Save to file
    fs.writeFileSync('test-output.mp3', Buffer.from(response.data));
    console.log('Saved to: test-output.mp3');
    
  } catch (error) {
    console.log('FAILED!');
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
}

testElevenLabs();
