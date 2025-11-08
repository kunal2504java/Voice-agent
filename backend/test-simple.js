import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log('Testing Gemini API (Simple Test)\n');
console.log('API Key:', API_KEY?.substring(0, 20) + '...\n');

const genAI = new GoogleGenerativeAI(API_KEY);

// Try different models to find which one works
async function test() {
  const modelsToTry = [
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro"
  ];
  
  for (const modelName of modelsToTry) {
    console.log(`\nTrying: ${modelName}`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent("Say hello");
      const response = result.response;
      const text = response.text();
      
      console.log(`✅ SUCCESS with ${modelName}!`);
      console.log('Response:', text);
      console.log('\n🎉 This model works! Update geminiService.js to use:', modelName);
      return; // Stop after first success
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message.substring(0, 80)}...`);
    }
  }
  
  console.log('\n⚠️  None of the models worked. Your API key might not have access to Gemini models.');
}

test();
