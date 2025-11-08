import OpenAI from 'openai';
import memoryService from './memory.service.js';

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateResponse(customerId, userMessage, constructionUpdate = null) {
    try {
      // Get conversation context
      const context = await memoryService.getCustomerContext(customerId);
      
      // Build system prompt
      const systemPrompt = this.buildSystemPrompt(context, constructionUpdate);
      
      // Build messages array
      const messages = [
        { role: 'system', content: systemPrompt }
      ];

      // Add recent conversation history
      const recentHistory = context.lastMessages.slice(-6);
      recentHistory.forEach(msg => {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role,
            content: msg.content
          });
        }
      });

      // Add current user message
      messages.push({
        role: 'user',
        content: userMessage
      });

      // Call OpenAI API
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.8,
        max_tokens: 300
      });

      const assistantMessage = response.choices[0].message.content;

      // Save messages to memory
      await memoryService.saveMessage(customerId, 'user', userMessage);
      await memoryService.saveMessage(customerId, 'assistant', assistantMessage);

      return {
        message: assistantMessage,
        usage: response.usage
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate response');
    }
  }

  buildSystemPrompt(context, constructionUpdate) {
    const basePrompt = `You are a friendly AI voice agent for Riverwood Real Estate Company. Your job is to call customers daily with construction updates about their property.

PERSONALITY:
- Warm, friendly, and professional
- Speak in natural Hinglish (mix of Hindi and English)
- Use casual, conversational tone like a helpful friend
- Show genuine care about customer's investment

LANGUAGE STYLE:
- Mix Hindi and English naturally (e.g., "Namaste! Aaj main aapko ek exciting update dene aayi hoon")
- Use common Hindi words: haan, nahi, theek hai, accha, kya, kaise, bilkul
- Keep sentences short and natural
- Use English for technical terms but explain in simple Hinglish

CONVERSATION GUIDELINES:
1. Start with warm greeting (Namaste/Hello)
2. Ask how they are doing
3. Share construction update enthusiastically
4. Answer questions clearly
5. End with positive note and next update timing

IMPORTANT:
- Keep responses under 3-4 sentences
- Be conversational, not robotic
- Show excitement about progress
- Address concerns empathetically
- Never be pushy or salesy`;

    let updateContext = '';
    if (constructionUpdate) {
      updateContext = `\n\nTODAY'S CONSTRUCTION UPDATE:
${JSON.stringify(constructionUpdate, null, 2)}

Share this update naturally in conversation.`;
    }

    let customerContext = '';
    if (context.totalInteractions > 0) {
      customerContext = `\n\nCUSTOMER CONTEXT:
- Total previous interactions: ${context.totalInteractions}
- Language preference: ${context.preferences.language}
- This is a returning customer, be warm and familiar`;
    }

    return basePrompt + updateContext + customerContext;
  }

  async generateGreeting(customerId, customerName = 'Customer') {
    const greetings = [
      `Namaste ${customerName}! Main Riverwood se bol rahi hoon. Aaj aapke project ke baare mein ek exciting update hai!`,
      `Hello ${customerName}! Kaise hain aap? Main aapko Riverwood construction ki latest update dene aayi hoon.`,
      `Hi ${customerName}! Riverwood se call hai. Aapke ghar ki construction mein bahut acchi progress hui hai!`,
      `Namaste ${customerName}! Hope aap theek hain. Aaj ka construction update share karne aayi hoon.`
    ];

    return greetings[Math.floor(Math.random() * greetings.length)];
  }
}

export default new OpenAIService();
