import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

console.log('🧪 Testing OpenAI API\n');
console.log('API Key loaded:', process.env.OPENAI_API_KEY ? 'Yes ✅' : 'No ❌');
console.log('API Key (first 20 chars):', process.env.OPENAI_API_KEY?.substring(0, 20) + '...\n');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

try {
  console.log('Sending test request...\n');
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Say hello in Hindi' }
    ],
    max_tokens: 50
  });

  console.log('✅ SUCCESS!');
  console.log('Response:', response.choices[0].message.content);
  console.log('\nOpenAI is working perfectly! 🎉');
  
} catch (error) {
  console.log('❌ FAILED!');
  console.log('Error:', error.message);
}
