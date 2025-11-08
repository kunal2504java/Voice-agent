import geminiService from './services/geminiService.js';
import dotenv from 'dotenv';

dotenv.config();

async function testGemini() {
  console.log('🧪 Testing Gemini API Integration\n');
  console.log('═══════════════════════════════════════\n');

  // Debug: Check if API key is loaded
  console.log('Debug: API Key loaded:', process.env.GEMINI_API_KEY ? 'Yes ✅' : 'No ❌');
  console.log('Debug: API Key (first 20 chars):', process.env.GEMINI_API_KEY?.substring(0, 20) + '...\n');

  // Test 1: API Connection
  console.log('Test 1: API Connection');
  console.log('─────────────────────────────────────');
  const connectionTest = await geminiService.testConnection();
  
  if (connectionTest.success) {
    console.log('✅ Success!');
    console.log('Response:', connectionTest.response);
  } else {
    console.log('❌ Failed!');
    console.log('Error:', connectionTest.error);
    return;
  }

  console.log('\n');

  // Test 2: Simple Conversation
  console.log('Test 2: Simple Conversation');
  console.log('─────────────────────────────────────');
  try {
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant speaking in Hinglish (mix of Hindi and English).'
      },
      {
        role: 'user',
        content: 'Namaste! Kaise ho?'
      }
    ];

    const response = await geminiService.createChatCompletion(messages);
    console.log('✅ Success!');
    console.log('AI Response:', response.choices[0].message.content);
    console.log('Tokens Used:', response.usage.total_tokens);
  } catch (error) {
    console.log('❌ Failed!');
    console.log('Error:', error.message);
  }

  console.log('\n');

  // Test 3: Construction Update Context
  console.log('Test 3: Construction Update Context');
  console.log('─────────────────────────────────────');
  try {
    const messages = [
      {
        role: 'system',
        content: `You are Priya, a friendly AI assistant from Riverwood Real Estate. 
You speak natural Hinglish and provide construction updates to customers.
Be warm, use "ji" respectfully, and keep responses concise.`
      },
      {
        role: 'user',
        content: 'Kya update hai aaj? Mera plot A-1204 hai.'
      }
    ];

    const response = await geminiService.createChatCompletion(messages);
    console.log('✅ Success!');
    console.log('AI Response:', response.choices[0].message.content);
    console.log('Tokens Used:', response.usage.total_tokens);
  } catch (error) {
    console.log('❌ Failed!');
    console.log('Error:', error.message);
  }

  console.log('\n');

  // Test 4: Multi-turn Conversation
  console.log('Test 4: Multi-turn Conversation');
  console.log('─────────────────────────────────────');
  try {
    const messages = [
      {
        role: 'system',
        content: 'You are Priya from Riverwood. Speak in Hinglish.'
      },
      {
        role: 'user',
        content: 'Foundation work kab start hoga?'
      },
      {
        role: 'assistant',
        content: 'Foundation work kal se start ho raha hai! Very exciting news.'
      },
      {
        role: 'user',
        content: 'Kitne din lagenge complete hone mein?'
      }
    ];

    const response = await geminiService.createChatCompletion(messages);
    console.log('✅ Success!');
    console.log('AI Response:', response.choices[0].message.content);
    console.log('Tokens Used:', response.usage.total_tokens);
  } catch (error) {
    console.log('❌ Failed!');
    console.log('Error:', error.message);
  }

  console.log('\n═══════════════════════════════════════');
  console.log('✅ All tests completed!');
  console.log('\n💡 Tip: If all tests passed, your Gemini integration is working perfectly!');
}

// Run tests
testGemini().catch(console.error);
