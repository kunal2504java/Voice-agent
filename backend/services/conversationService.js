import geminiService from './geminiService.js';
import memoryService from './memoryService.js';
import constructionService from './construction.service.js';

class ConversationService {
  constructor() {
    // Using Gemini
    this.client = geminiService;

    // Mock customer database with rich context
    this.customerDatabase = {
      'CUST001': {
        customerId: 'CUST001',
        name: 'Rajesh Kumar',
        plotNumber: 'A-1204',
        projectId: 'RW001',
        phone: '+91 98765 43210',
        email: 'rajesh.kumar@email.com',
        joinedDate: '2024-01-15',
        personality: 'detail-oriented, asks technical questions',
        preferences: {
          callTime: 'morning',
          language: 'more_hindi',
          interests: ['construction_quality', 'timeline', 'amenities']
        },
        visitHistory: [
          {
            date: '2024-10-20',
            purpose: 'Site inspection',
            feedback: 'Happy with progress, concerned about bathroom tiles'
          },
          {
            date: '2024-09-15',
            purpose: 'Documentation',
            feedback: 'Completed registration paperwork'
          }
        ],
        lastConversation: {
          date: '2024-11-05',
          topic: 'Discussed bathroom tile selection and plumbing work',
          sentiment: 'positive',
          concerns: ['bathroom tiles quality'],
          promises: ['Will visit site this weekend']
        },
        familyInfo: {
          spouse: 'Priya',
          children: 2,
          movingFrom: 'Gurgaon',
          occupation: 'Software Engineer'
        }
      },
      'CUST002': {
        customerId: 'CUST002',
        name: 'Amit Sharma',
        plotNumber: 'Villa-5',
        projectId: 'RW002',
        phone: '+91 98765 12345',
        email: 'amit.sharma@email.com',
        joinedDate: '2024-03-01',
        personality: 'friendly, casual, trusts easily',
        preferences: {
          callTime: 'evening',
          language: 'balanced_hinglish',
          interests: ['garden', 'parking', 'security']
        },
        visitHistory: [
          {
            date: '2024-10-28',
            purpose: 'Weekend visit with family',
            feedback: 'Wife loved the garden space, kids excited about play area'
          },
          {
            date: '2024-10-01',
            purpose: 'Diwali celebration at site',
            feedback: 'Enjoyed the community event'
          }
        ],
        lastConversation: {
          date: '2024-11-04',
          topic: 'Discussed garden landscaping and kids play area',
          sentiment: 'very_positive',
          concerns: [],
          promises: ['Will bring family for Diwali pooja at site']
        },
        familyInfo: {
          spouse: 'Neha',
          children: 2,
          movingFrom: 'Delhi',
          occupation: 'Business Owner'
        }
      },
      'CUST003': {
        customerId: 'CUST003',
        name: 'Priya Verma',
        plotNumber: 'B-805',
        projectId: 'RW001',
        phone: '+91 98765 67890',
        email: 'priya.verma@email.com',
        joinedDate: '2024-02-10',
        personality: 'practical, budget-conscious, asks about costs',
        preferences: {
          callTime: 'afternoon',
          language: 'more_english',
          interests: ['payment_schedule', 'cost_savings', 'resale_value']
        },
        visitHistory: [
          {
            date: '2024-10-15',
            purpose: 'Payment and documentation',
            feedback: 'Appreciated flexible payment options'
          },
          {
            date: '2024-09-20',
            purpose: 'Interior design consultation',
            feedback: 'Looking for cost-effective interior solutions'
          }
        ],
        lastConversation: {
          date: '2024-11-03',
          topic: 'Discussed next payment installment and interior work timeline',
          sentiment: 'neutral',
          concerns: ['budget for interiors'],
          promises: ['Will make payment by 15th November']
        },
        familyInfo: {
          spouse: 'Rahul',
          children: 1,
          movingFrom: 'Noida',
          occupation: 'Marketing Manager'
        }
      }
    };
  }

  /**
   * Get customer context from database
   */
  getCustomerContext(customerId) {
    const customer = this.customerDatabase[customerId];
    if (!customer) {
      return null;
    }
    return customer;
  }

  /**
   * Build system prompt with customer context
   */
  buildSystemPrompt(customerContext, constructionUpdate, conversationHistory = []) {
    const customer = customerContext;
    
    // Determine language style based on preference
    let languageInstruction = '';
    if (customer.preferences.language === 'more_hindi') {
      languageInstruction = 'Use more Hindi words naturally mixed with English. Examples: "Aaj main aapko ek bahut acchi update dene aayi hoon", "Kaam bilkul time pe chal raha hai"';
    } else if (customer.preferences.language === 'more_english') {
      languageInstruction = 'Use mostly English with occasional Hindi words for warmth. Examples: "Today I have great news", "Everything is going accha"';
    } else {
      languageInstruction = 'Balance Hindi and English equally. Examples: "Hello ji, aaj ka update sunao?", "Construction work is going bahut smoothly"';
    }

    // Build context about last conversation
    let lastConversationContext = '';
    if (customer.lastConversation) {
      lastConversationContext = `
LAST CONVERSATION (${customer.lastConversation.date}):
- Topic: ${customer.lastConversation.topic}
- Customer mood: ${customer.lastConversation.sentiment}
- Concerns raised: ${customer.lastConversation.concerns.join(', ') || 'None'}
- Promises made: ${customer.lastConversation.promises.join(', ') || 'None'}

IMPORTANT: Reference this naturally! For example:
- "Kal baat hui thi bathroom tiles ke baare mein, aaj uska update hai"
- "Aapne kaha tha weekend pe visit karenge, kaise raha?"
- "Last time jo concern tha, wo resolve ho gaya"`;
    }

    // Build visit history context
    let visitContext = '';
    if (customer.visitHistory && customer.visitHistory.length > 0) {
      const lastVisit = customer.visitHistory[0];
      visitContext = `
RECENT SITE VISIT (${lastVisit.date}):
- Purpose: ${lastVisit.purpose}
- Feedback: ${lastVisit.feedback}
Reference this: "Last visit mein aapne dekha tha...", "Jab aaye the tab..."`;
    }

    // Build family context
    let familyContext = '';
    if (customer.familyInfo) {
      familyContext = `
FAMILY CONTEXT:
- Spouse: ${customer.familyInfo.spouse}
- Children: ${customer.familyInfo.children}
- Moving from: ${customer.familyInfo.movingFrom}
Use this warmly: "Priya ji ko bhi pasand aayega", "Bacchon ke liye play area ready ho raha hai"`;
    }

    // Build construction update context
    let updateContext = '';
    if (constructionUpdate) {
      updateContext = `
TODAY'S CONSTRUCTION UPDATE:
- Phase: ${constructionUpdate.currentPhase}
- Update: ${constructionUpdate.updateMessage}
- Progress: ${constructionUpdate.overallProgress}%
- Status: ${constructionUpdate.completionStatus}
- Next Milestone: ${constructionUpdate.nextMilestone}
- Workers on site: ${constructionUpdate.workersOnSite}
- Weather: ${constructionUpdate.weather}

Share this update naturally and enthusiastically!`;
    }

    const systemPrompt = `You are Priya, a professional and friendly AI voice agent for Riverwood Real Estate. You assist customers with construction updates, site visits, payment queries, and general property inquiries.

🚨 MOST IMPORTANT RULE - READ THIS FIRST:
${conversationHistory.length > 0 ? 
  '⚠️ THIS IS A FOLLOW-UP MESSAGE IN AN ONGOING CONVERSATION. DO NOT introduce yourself. DO NOT say "Namaste". DO NOT say "Main Priya bol rahi hoon". Just answer their question directly and briefly!' 
  : 
  '✅ This is the FIRST message. You may introduce yourself professionally.'}

🎯 GOALS:
1. Understand user intent (construction update, site visit, payment query, quality concern, timeline question, general inquiry)
2. Provide clear, accurate information about their property construction
3. Adapt gracefully if user changes topic mid-conversation
4. Offer next steps like scheduling visits, sharing photos, or connecting to site engineer
5. Keep responses natural, brief (1-2 sentences), and conversational
6. NEVER EVER introduce yourself in follow-up messages

🧩 RESPONSE BEHAVIOR:
- Respond directly to what user asked
- Keep tone warm, clear, and concise
- Adapt if user changes topic (e.g., from update → site visit)
- If something is unclear, ask clarifying questions naturally
- Always sound like a helpful friend, not a robot

LANGUAGE STYLE - ADAPTIVE HINGLISH:
${languageInstruction}
- Mix Hindi and English naturally based on user's language
- If user speaks more English, respond in more English
- If user speaks more Hindi, respond in more Hindi
- Keep it conversational and natural

CONVERSATION PATTERNS:
- Greetings: "Namaste ji!", "Hello, kaise hain?", "Hi!", "Arey!"
- Transitions: "Haan toh", "Aur suniye", "Accha", "Bilkul"
- Excitement: "Bahut acchi news!", "Kamaal ho gaya!", "Great progress!"
- Empathy: "Main samajh sakti hoon", "Valid concern hai", "Don't worry"
- Endings: "Aur kuch?", "Take care!", "Kal baat karte hain"

⚠️ CRITICAL RULES FOR FOLLOW-UP MESSAGES (After first greeting):
- NEVER introduce yourself again ("Main Priya..." only in FIRST message)
- NEVER use customer's full name again (just "ji" or nothing)
- Keep responses VERY SHORT (1-3 sentences max)
- Be direct and to the point
- Respond ONLY to what they asked
- Sound like a normal conversation, not a formal call
- No greetings like "Namaste" in follow-ups

CUSTOMER CONTEXT:
- Name: ${customer.name}
- Plot: ${customer.plotNumber}
- Project: ${customer.projectId}
${familyContext}
${lastConversationContext}
${visitContext}
${updateContext}

📋 INTENT DETECTION & ADAPTIVE RESPONSES:

Intent: construction_update
User: "Kya update hai?", "Progress?", "Batao"
Response: "Foundation 85% done. Quality check pass. Photos bhejun?"

Intent: site_visit  
User: "Visit kar sakta hoon?", "Dekhna hai"
Response: "Haan! Weekend pe 10-5. Engineer ko inform kar dungi. Saturday theek hai?"

Intent: payment_query
User: "Payment kab hai?", "Installment?"
Response: "15th December - 5 lakhs. Email check karo. Finance team se baat karni hai?"

Intent: quality_concern
User: "Quality kaisi hai?", "Material accha?"
Response: "Top quality! Ultratech cement, Tata steel. Certificates bhejun?"

Intent: timeline_question
User: "Kab ready hoga?", "Timeline?"
Response: "March end tak. Schedule se 2 weeks ahead hain. On track!"

Intent: change_topic (ADAPTIVE)
User switches topic
Response: "Accha, visit ki baat karte hain. Weekend convenient hai?"

Intent: general_chat
User: "How are you?", "Kaise ho?"
Response: "Theek hoon! Aaj site pe accha kaam hua. Update sunoge?"

🎯 RESPONSE FORMAT:
- Answer what they asked directly
- Keep it natural and conversational
- Offer next step if relevant
- NO internal thoughts, NO meta-commentary, NO "(Thinks:...)" text
- Just respond like a human would

❌ ABSOLUTELY FORBIDDEN IN FOLLOW-UP MESSAGES:
"Namaste ji! Main Priya bol rahi hoon..."
"Namaste Amit Sharma ji! Main Priya..."
"Hello! Main Priya, Riverwood Real Estate se..."
"Main Priya hoon Riverwood se..."
ANY introduction or greeting with your name!

✅ CORRECT FOLLOW-UP RESPONSES (Short & Direct):
User: "Update chahiye"
You: "Ground floor 60% complete. Overall 65% progress. Accha chal raha hai!"

User: "Visit kar sakta hoon?"
You: "Haan! Weekend pe aa sakte ho. Saturday ya Sunday?"

User: "Quality kaisi hai?"
You: "Top quality! Ultratech cement use kar rahe hain. Certificates bhejun?"

User: "Kab ready hoga?"
You: "March end tak. Schedule se ahead hain!"

CRITICAL: ${conversationHistory.length > 0 ? 'THIS IS NOT THE FIRST MESSAGE - DO NOT INTRODUCE YOURSELF!' : 'This is the first message - you may introduce yourself.'}`;

    return systemPrompt;
  }

  /**
   * Main conversation handler
   */
  async handleConversation(customerId, userMessage, options = {}) {
    try {
      // Get customer context
      const customerContext = this.getCustomerContext(customerId);
      if (!customerContext) {
        throw new Error('Customer not found');
      }

      // Get construction update
      let constructionUpdate = null;
      if (options.includeUpdate !== false) {
        constructionUpdate = constructionService.generateDailyUpdate(customerContext.projectId);
      }

      // Get conversation history from memory
      const conversationHistory = await memoryService.getConversationHistory(customerId);
      
      // Build system prompt with conversation history
      const systemPrompt = this.buildSystemPrompt(customerContext, constructionUpdate, conversationHistory);

      // Prepare messages for OpenAI
      const messages = [
        { role: 'system', content: systemPrompt }
      ];

      // Add recent conversation history (last 6 messages for context)
      const recentHistory = conversationHistory.slice(-6);
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

      // Call Gemini API
      const response = await this.client.createChatCompletion(messages);

      const assistantMessage = response.choices[0].message.content;

      // Determine conversation context
      const sentiment = this.analyzeSentiment(userMessage);
      const topic = this.extractTopic(userMessage, constructionUpdate);

      // Save conversation to new memory service
      await memoryService.saveConversation(
        customerId,
        userMessage,
        assistantMessage,
        new Date().toISOString(),
        {
          topic: topic,
          sentiment: sentiment,
          concerns: this.extractConcerns(userMessage),
          nextSteps: this.extractNextSteps(assistantMessage)
        }
      );

      // Return response with full context
      return {
        success: true,
        response: assistantMessage,
        customerContext: {
          name: customerContext.name,
          plotNumber: customerContext.plotNumber,
          projectId: customerContext.projectId
        },
        constructionUpdate: constructionUpdate,
        conversationMetadata: {
          messageCount: conversationHistory.length + 2,
          lastTopic: customerContext.lastConversation?.topic,
          sentiment: this.analyzeSentiment(userMessage)
        },
        usage: response.usage
      };

    } catch (error) {
      console.error('Conversation Service Error:', error);
      throw new Error(`Failed to handle conversation: ${error.message}`);
    }
  }

  /**
   * Generate initial greeting for customer
   */
  async generateGreeting(customerId) {
    try {
      const customerContext = this.getCustomerContext(customerId);
      if (!customerContext) {
        throw new Error('Customer not found');
      }

      const constructionUpdate = constructionService.generateDailyUpdate(customerContext.projectId);
      
      // Personalized greetings based on customer personality and time
      const hour = new Date().getHours();
      let timeGreeting = '';
      
      if (hour < 12) {
        timeGreeting = 'Good morning';
      } else if (hour < 17) {
        timeGreeting = 'Good afternoon';
      } else {
        timeGreeting = 'Good evening';
      }

      // Professional, warm first greeting
      const greetings = [
        `Namaste ${customerContext.name} ji! Main Priya bol rahi hoon Riverwood Real Estate se. Main kis prakar se aapki sahayata kar sakti hoon? Aapke ${customerContext.plotNumber} ki construction update chahiye ya koi aur jaankari?`,
        
        `Namaste ji! ${timeGreeting}! Main Priya hoon Riverwood Real Estate se. Aaj main aapko ${customerContext.plotNumber} ki construction update dene ke liye call kar rahi hoon. Kya aap update sunna chahenge?`,
        
        `Hello ${customerContext.name} ji! Main Priya, Riverwood Real Estate se baat kar rahi hoon. Aapke ghar ki construction ke baare mein update share karne ke liye call kiya hai. Main aapki kaise madad kar sakti hoon?`,
        
        `Namaste! Main Priya bol rahi hoon Riverwood Real Estate se. Aaj aapke ${customerContext.plotNumber} ki construction mein acchi progress hui hai. Kya main aapko details bata sakti hoon?`
      ];

      // Choose greeting based on customer preference
      let selectedGreeting;
      if (customerContext.preferences.language === 'more_english') {
        selectedGreeting = `${timeGreeting} ${customerContext.name}! This is Priya calling from Riverwood Real Estate. I'm calling to share an update about your ${customerContext.plotNumber}. How may I assist you today?`;
      } else {
        selectedGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      }

      // Save greeting to memory using saveConversation
      await memoryService.saveConversation(
        customerId,
        '', // No user message for greeting
        selectedGreeting,
        new Date().toISOString(),
        {
          type: 'greeting',
          topic: 'greeting',
          sentiment: 'positive',
          constructionUpdate: constructionUpdate.updateMessage
        }
      );

      return {
        success: true,
        greeting: selectedGreeting,
        customerContext: {
          name: customerContext.name,
          plotNumber: customerContext.plotNumber,
          projectId: customerContext.projectId
        },
        constructionUpdate: constructionUpdate
      };

    } catch (error) {
      console.error('Greeting Generation Error:', error);
      throw new Error(`Failed to generate greeting: ${error.message}`);
    }
  }

  /**
   * Simple sentiment analysis
   */
  analyzeSentiment(message) {
    const lowerMessage = message.toLowerCase();
    
    const positiveWords = ['good', 'great', 'excellent', 'happy', 'accha', 'bahut', 'nice', 'wonderful', 'love'];
    const negativeWords = ['bad', 'poor', 'issue', 'problem', 'concern', 'worried', 'delay', 'kharab'];
    const questionWords = ['?', 'kya', 'kab', 'kaise', 'when', 'what', 'how', 'why'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    let hasQuestion = false;
    
    positiveWords.forEach(word => {
      if (lowerMessage.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (lowerMessage.includes(word)) negativeCount++;
    });
    
    questionWords.forEach(word => {
      if (lowerMessage.includes(word)) hasQuestion = true;
    });
    
    if (hasQuestion) return 'inquiry';
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Extract topic from user message
   */
  extractTopic(message, constructionUpdate) {
    const lowerMessage = message.toLowerCase();
    
    const topicKeywords = {
      'construction_progress': ['progress', 'update', 'kya hua', 'construction', 'kaam'],
      'payment': ['payment', 'installment', 'pay', 'paisa', 'amount'],
      'site_visit': ['visit', 'dekhna', 'site', 'aana'],
      'tiles': ['tiles', 'tile', 'flooring'],
      'plumbing': ['plumbing', 'pipe', 'water'],
      'electrical': ['electrical', 'wiring', 'light', 'bijli'],
      'painting': ['paint', 'color', 'rang'],
      'interior': ['interior', 'design', 'furniture'],
      'timeline': ['when', 'kab', 'complete', 'ready', 'timeline'],
      'garden': ['garden', 'landscaping', 'grass'],
      'amenities': ['amenity', 'amenities', 'facility', 'facilities']
    };

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword)) {
          return topic;
        }
      }
    }

    // If construction update exists, use that phase
    if (constructionUpdate) {
      return constructionUpdate.currentPhase.toLowerCase().replace(/ /g, '_');
    }

    return 'general';
  }

  /**
   * Extract concerns from user message
   */
  extractConcerns(message) {
    const lowerMessage = message.toLowerCase();
    const concerns = [];

    const concernKeywords = {
      'delay': ['delay', 'late', 'slow', 'der'],
      'quality': ['quality', 'kharab', 'issue', 'problem'],
      'cost': ['expensive', 'cost', 'budget', 'paisa'],
      'timeline': ['when', 'kab', 'complete']
    };

    for (const [concern, keywords] of Object.entries(concernKeywords)) {
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword)) {
          if (!concerns.includes(concern)) {
            concerns.push(concern);
          }
        }
      }
    }

    return concerns;
  }

  /**
   * Extract next steps from AI response
   */
  extractNextSteps(response) {
    const lowerResponse = response.toLowerCase();
    const nextSteps = [];

    const stepKeywords = {
      'site_visit': ['visit', 'dekhna', 'site pe'],
      'payment': ['payment', 'installment'],
      'meeting': ['meeting', 'baat', 'discuss'],
      'inspection': ['inspection', 'check'],
      'follow_up': ['call', 'update', 'bataunga']
    };

    for (const [step, keywords] of Object.entries(stepKeywords)) {
      for (const keyword of keywords) {
        if (lowerResponse.includes(keyword)) {
          if (!nextSteps.includes(step)) {
            nextSteps.push(step);
          }
        }
      }
    }

    return nextSteps;
  }

  /**
   * Get all customers (for admin/testing)
   */
  getAllCustomers() {
    return Object.values(this.customerDatabase);
  }

  /**
   * Update customer context (for future use)
   */
  updateCustomerContext(customerId, updates) {
    if (this.customerDatabase[customerId]) {
      this.customerDatabase[customerId] = {
        ...this.customerDatabase[customerId],
        ...updates
      };
      return true;
    }
    return false;
  }
}

export default new ConversationService();
