import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    // Don't initialize here - do it lazily when first called
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;
    
    this.apiKey = process.env.GEMINI_API_KEY;
    
    console.log('🤖 GeminiService initializing...');
    console.log('   API Key:', this.apiKey ? `${this.apiKey.substring(0, 15)}...` : 'NOT FOUND');
    
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }
    
    // Note: API key is loaded via dotenv in server.js
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    
    // Use Gemini 2.0 Flash (latest model, same as Cline uses)
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 300,
      }
    });
    
    this.initialized = true;
    console.log('✅ GeminiService ready!');
  }

  /**
   * Generate chat completion (compatible with OpenAI format)
   * @param {Array} messages - Array of message objects with role and content
   * @returns {Object} Response in OpenAI-compatible format
   */
  async createChatCompletion(messages) {
    try {
      // Initialize on first use
      this.initialize();
      
      // Convert OpenAI message format to Gemini format
      const geminiMessages = this.convertToGeminiFormat(messages);
      
      // Start chat session
      const chat = this.model.startChat({
        history: geminiMessages.history,
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 300,
        },
      });

      // Send the latest user message
      const result = await chat.sendMessage(geminiMessages.latestMessage);
      const response = await result.response;
      const text = response.text();

      // Return in OpenAI-compatible format
      return {
        choices: [
          {
            message: {
              role: 'assistant',
              content: text
            },
            finish_reason: 'stop',
            index: 0
          }
        ],
        usage: {
          prompt_tokens: this.estimateTokens(messages),
          completion_tokens: this.estimateTokens([{ content: text }]),
          total_tokens: this.estimateTokens(messages) + this.estimateTokens([{ content: text }])
        }
      };

    } catch (error) {
      console.error('Gemini API Error:', error);
      console.error('Full error details:', error.message);
      
      // Don't use mock - throw error to see what's wrong
      throw new Error(`Gemini API failed: ${error.message}`);
    }
  }

  getMockResponse(messages) {
    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    const conversationHistory = messages.slice(0, -1); // All messages except the last one
    
    let response = "";
    
    // Contextual responses based on conversation flow
    if (lastMessage.includes('हां') || lastMessage.includes('हाँ') || lastMessage.includes('details') || lastMessage.includes('batao')) {
      // User wants details
      response = "Bilkul! Aaj foundation ka kaam 85% complete ho gaya hai. Engineers ne quality check bhi kar liya - sab perfect hai! Plumbing ka kaam bhi start ho gaya hai. Agle hafte tak poora foundation ready ho jayega. Aapko koi specific cheez dekhni hai site pe?";
    } 
    else if (lastMessage.includes('visit') || lastMessage.includes('dekhna') || lastMessage.includes('aana')) {
      // User wants to visit
      response = "Zaroor! Weekend pe aap 10 AM se 5 PM ke beech kabhi bhi aa sakte hain. Main site engineer Rajesh ko inform kar dungi. Unka number bhi share kar deti hoon - 98765-43210. Aap Saturday ya Sunday, kaunsa din prefer karenge?";
    }
    else if (lastMessage.includes('saturday') || lastMessage.includes('sunday') || lastMessage.includes('weekend')) {
      response = "Perfect! Main Rajesh ko bol dungi ki aap aa rahe hain. Woh aapko poora site tour denge aur har detail explain karenge. Koi aur sawaal hai mere paas?";
    }
    else if (lastMessage.includes('payment') || lastMessage.includes('paisa') || lastMessage.includes('cost')) {
      response = "Ji, aapka next installment 15th December ko due hai - 5 lakh rupees. Finance team ne email bhi bhej di hai details ke saath. Agar koi payment related query hai toh main finance head se connect kara sakti hoon. Chahiye?";
    }
    else if (lastMessage.includes('quality') || lastMessage.includes('material') || lastMessage.includes('achha')) {
      response = "Haan bilkul! Hum sirf best quality material use karte hain. Cement Ultratech ka hai, steel Tata ka. Har material ki quality certificate bhi hai. Aapko chahiye toh main photos aur certificates WhatsApp pe bhej sakti hoon?";
    }
    else if (lastMessage.includes('photo') || lastMessage.includes('picture') || lastMessage.includes('image')) {
      response = "Sure! Abhi latest photos WhatsApp pe bhej rahi hoon. Aapko daily updates chahiye? Main har shaam 6 baje ek photo aur progress report bhej sakti hoon. Convenient rahega?";
    }
    else if (lastMessage.includes('thanks') || lastMessage.includes('thank you') || lastMessage.includes('dhanyavaad') || lastMessage.includes('shukriya')) {
      response = "Arey, mention not! Yeh toh mera kaam hai. Aap kabhi bhi call kar sakte hain agar kuch bhi chahiye. Main hamesha available hoon. Aapka din accha rahe! 😊";
    }
    else if (lastMessage.includes('problem') || lastMessage.includes('issue') || lastMessage.includes('delay') || lastMessage.includes('chinta')) {
      response = "Main samajh sakti hoon aapki chinta. Aap batao kya problem hai? Main immediately site engineer se baat karke aapko update dungi. Aapki satisfaction hamari priority hai.";
    }
    else if (lastMessage.includes('weather') || lastMessage.includes('rain') || lastMessage.includes('barish')) {
      response = "Haan, kal thodi barish hui thi, lekin kaam pe koi asar nahi pada. Hum waterproof covering use karte hain. Aaj mausam accha hai toh full speed mein kaam chal raha hai!";
    }
    else if (lastMessage.includes('timeline') || lastMessage.includes('kab') || lastMessage.includes('when') || lastMessage.includes('complete')) {
      response = "Current progress dekh ke lagta hai ki March end tak possession ready ho jayega. Abhi hum schedule se 2 weeks ahead chal rahe hain! Agar yahi pace rahi toh maybe aur jaldi bhi ho sakta hai. Exciting hai na?";
    }
    else if (lastMessage.includes('update') || lastMessage.includes('progress') || lastMessage.includes('kya hua')) {
      response = "Haan bilkul! Aaj bahut accha kaam hua. Foundation work almost complete hai - 85% done. Quality inspection bhi pass ho gaya. Kal se plumbing start hone wala hai. Aapko detailed update chahiye ya yeh theek hai?";
    }
    else if (lastMessage.includes('hello') || lastMessage.includes('hi') || lastMessage.includes('namaste') || lastMessage.includes('hey')) {
      response = "Namaste! Kaise hain aap? Aaj aapke ghar ki construction mein bahut acchi progress hui hai! Batau kya hua aaj?";
    }
    else {
      // Default contextual response
      response = "Ji, main sun rahi hoon. Aap construction update, site visit, payment details, ya koi bhi sawaal pooch sakte hain. Main yahan hoon aapki help karne ke liye!";
    }
    
    return {
      choices: [{
        message: {
          role: 'assistant',
          content: response
        },
        finish_reason: 'stop',
        index: 0
      }],
      usage: {
        prompt_tokens: this.estimateTokens(messages),
        completion_tokens: this.estimateTokens([{ content: response }]),
        total_tokens: this.estimateTokens(messages) + this.estimateTokens([{ content: response }])
      }
    };
  }

  /**
   * Convert OpenAI message format to Gemini format
   * @param {Array} messages - OpenAI format messages
   * @returns {Object} Gemini format with history and latest message
   */
  convertToGeminiFormat(messages) {
    const history = [];
    let latestMessage = '';

    messages.forEach((msg, index) => {
      if (msg.role === 'system') {
        // Gemini doesn't have system role, prepend to first user message
        if (index === 0 && messages[index + 1]) {
          // Will be added to next user message
          return;
        }
      } else if (msg.role === 'user') {
        // Check if previous message was system
        const systemMsg = index > 0 && messages[index - 1].role === 'system' 
          ? messages[index - 1].content + '\n\n' 
          : '';
        
        if (index === messages.length - 1) {
          // This is the latest message
          latestMessage = systemMsg + msg.content;
        } else {
          history.push({
            role: 'user',
            parts: [{ text: systemMsg + msg.content }]
          });
        }
      } else if (msg.role === 'assistant') {
        history.push({
          role: 'model',
          parts: [{ text: msg.content }]
        });
      }
    });

    return { history, latestMessage };
  }

  /**
   * Estimate token count (rough approximation)
   * @param {Array} messages - Messages to estimate
   * @returns {number} Estimated token count
   */
  estimateTokens(messages) {
    const text = messages.map(m => m.content || '').join(' ');
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  /**
   * Test connection to Gemini API
   * @returns {Object} Test result
   */
  async testConnection() {
    try {
      const result = await this.model.generateContent('Hello');
      const response = await result.response;
      const text = response.text();
      
      return {
        success: true,
        message: 'Gemini API connection successful',
        response: text
      };
    } catch (error) {
      return {
        success: false,
        message: 'Gemini API connection failed',
        error: error.message
      };
    }
  }
}

export default new GeminiService();
