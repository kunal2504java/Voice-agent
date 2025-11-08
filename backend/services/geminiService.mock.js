// Mock Gemini Service - Returns realistic responses without API calls
// Use this temporarily until Gemini API key issue is resolved

class MockGeminiService {
  constructor() {
    console.log('⚠️  Using MOCK Gemini Service (no real API calls)');
    this.responses = {
      greeting: [
        "Namaste! Main Priya hoon Riverwood se. Aapka construction update share karna chahti hoon. Sunenge?",
        "Hello! Kaise hain aap? Aaj aapke ghar ki construction mein bahut acchi progress hui hai!",
        "Namaste ji! Aaj site pe bahut accha kaam hua hai. Update batau?"
      ],
      update: [
        "Ji haan! Aaj foundation work complete ho gaya hai. Bahut accha quality ka kaam hua hai. Workers ne puri mehnat ki.",
        "Bilkul! Aaj plumbing ka kaam start ho gaya. Next week tak complete ho jayega. Sab kuch schedule pe chal raha hai.",
        "Haan ji! Aaj electrical wiring ka kaam hua. Quality check bhi ho gaya. Sab perfect hai!"
      ],
      question: [
        "Ji bilkul! Main aapko details batati hoon. Aapka plot number kya hai?",
        "Haan, main check karke batati hoon. Ek minute dijiye.",
        "Sure! Aapke liye latest update check karti hoon."
      ],
      concern: [
        "Main samajh sakti hoon aapki chinta. Main is baare mein site engineer se baat karke aapko update dungi.",
        "Aapki baat bilkul sahi hai. Main isko priority pe le rahi hoon aur jaldi resolve karungi.",
        "Thank you for sharing this. Main immediately is issue ko address karungi."
      ],
      positive: [
        "Bahut accha! Aapko update pasand aaya, yeh sunke bahut khushi hui!",
        "Great! Aap weekend pe site visit kar sakte hain. Progress dekhke aapko aur bhi accha lagega!",
        "Wonderful! Hum aapke dream home ko reality banane mein lage hain!"
      ]
    };
  }

  async createChatCompletion(messages) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    const userText = lastMessage.content.toLowerCase();

    // Determine response type based on user message
    let responseType = 'question';
    
    if (userText.includes('hello') || userText.includes('namaste') || userText.includes('hi')) {
      responseType = 'greeting';
    } else if (userText.includes('update') || userText.includes('kya hua') || userText.includes('progress')) {
      responseType = 'update';
    } else if (userText.includes('problem') || userText.includes('issue') || userText.includes('chinta')) {
      responseType = 'concern';
    } else if (userText.includes('good') || userText.includes('great') || userText.includes('accha')) {
      responseType = 'positive';
    }

    // Get random response from the category
    const responses = this.responses[responseType];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    // Return in OpenAI-compatible format
    return {
      choices: [
        {
          message: {
            role: 'assistant',
            content: randomResponse
          },
          finish_reason: 'stop',
          index: 0
        }
      ],
      usage: {
        prompt_tokens: this.estimateTokens(messages),
        completion_tokens: this.estimateTokens([{ content: randomResponse }]),
        total_tokens: this.estimateTokens(messages) + this.estimateTokens([{ content: randomResponse }])
      }
    };
  }

  estimateTokens(messages) {
    const text = messages.map(m => m.content || '').join(' ');
    return Math.ceil(text.length / 4);
  }

  async testConnection() {
    return {
      success: true,
      message: 'Mock Gemini Service (no real API)',
      response: 'Namaste! Main mock service hoon. Real API key milne ke baad main real responses dungi!'
    };
  }
}

export default new MockGeminiService();
