// Direct test without our wrapper
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log('🧪 Direct Gemini API Test\n');
console.log('API Key:', API_KEY ? API_KEY.substring(0, 20) + '...' : 'NOT FOUND');
console.log('\nTesting...\n');

const genAI = new GoogleGenerativeAI(API_KEY);

// Try different model names
const modelsToTry = [
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest',
  'gemini-1.0-pro-latest',
  'gemini-pro',
  'gemini-1.5-flash',
  'gemini-1.5-pro'
];

for (const modelName of modelsToTry) {
  console.log(`\nTrying model: ${modelName}`);
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Say hello in Hindi');
    const response = await result.response;
    const text = response.text();
    
    console.log(`✅ SUCCESS with ${modelName}!`);
    console.log('Response:', text);
    break; // Stop after first success
  } catch (error) {
    console.log(`❌ Failed with ${modelName}`);
    console.log('Error:', error.message.substring(0, 100) + '...');
  }
}
