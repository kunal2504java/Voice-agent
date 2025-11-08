// List available models
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log('🔍 Listing Available Gemini Models\n');

const genAI = new GoogleGenerativeAI(API_KEY);

try {
  const models = await genAI.listModels();
  
  console.log('✅ Available Models:\n');
  for (const model of models) {
    console.log(`- ${model.name}`);
    console.log(`  Display Name: ${model.displayName}`);
    console.log(`  Supported: ${model.supportedGenerationMethods.join(', ')}`);
    console.log('');
  }
} catch (error) {
  console.log('❌ Error listing models:', error.message);
}
