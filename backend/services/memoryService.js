import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const CONVERSATIONS_DIR = path.join(DATA_DIR, 'conversations');
const CUSTOMER_CONTEXT_FILE = path.join(DATA_DIR, 'customer_context.json');

class MemoryService {
  constructor() {
    this.ensureDataDirectory();
    this.initializeSampleData();
  }

  /**
   * Ensure data directories exist
   */
  async ensureDataDirectory() {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }

    try {
      await fs.access(CONVERSATIONS_DIR);
    } catch {
      await fs.mkdir(CONVERSATIONS_DIR, { recursive: true });
    }

    try {
      await fs.access(CUSTOMER_CONTEXT_FILE);
    } catch {
      await fs.writeFile(CUSTOMER_CONTEXT_FILE, JSON.stringify({}, null, 2));
    }
  }

  /**
   * Initialize sample conversation data for demo
   */
  async initializeSampleData() {
    try {
      // Check if sample data already exists
      const contextData = await fs.readFile(CUSTOMER_CONTEXT_FILE, 'utf-8');
      const contexts = JSON.parse(contextData);
      
      // If no data, create sample conversations
      if (Object.keys(contexts).length === 0) {
        await this.createSampleConversations();
      }
    } catch (error) {
      console.error('Error initializing sample data:', error);
    }
  }

  /**
   * Create sample conversation history for demo
   */
  async createSampleConversations() {
    console.log('Creating sample conversation data...');

    // Sample conversation for Rajesh Kumar (CUST001)
    const rajeshConversations = [
      {
        date: '2024-11-01T10:30:00Z',
        userMessage: 'Hello, kya update hai?',
        aiResponse: 'Namaste Rajesh ji! Aaj ka update bahut accha hai. Ground floor ka slab work complete ho gaya hai. 65% progress ho gayi hai overall.',
        context: {
          topic: 'construction_progress',
          sentiment: 'positive',
          concerns: [],
          nextSteps: []
        }
      },
      {
        date: '2024-11-02T11:00:00Z',
        userMessage: 'Bathroom tiles ka kya scene hai?',
        aiResponse: 'Bathroom tiles ke liye aapne jo Italian marble select kiya tha, wo aa gaya hai site pe. Quality bahut acchi hai. Next week installation start hoga.',
        context: {
          topic: 'bathroom_tiles',
          sentiment: 'inquiry',
          concerns: ['tile_quality'],
          nextSteps: ['tile_installation_next_week']
        }
      },
      {
        date: '2024-11-03T10:15:00Z',
        userMessage: 'When can I visit the site?',
        aiResponse: 'Aap is weekend visit kar sakte hain. Saturday morning 10 baje best time hai. Main site engineer ko inform kar dungi. Aap Priya ji ko bhi saath la sakte hain.',
        context: {
          topic: 'site_visit',
          sentiment: 'positive',
          concerns: [],
          nextSteps: ['weekend_site_visit_planned']
        }
      },
      {
        date: '2024-11-04T09:45:00Z',
        userMessage: 'Plumbing work kaisa chal raha hai?',
        aiResponse: 'Plumbing work bilkul schedule pe hai. Hot water pipes install ho gaye hain. Cold water connection bhi ready hai. Quality check bhi pass ho gaya.',
        context: {
          topic: 'plumbing_work',
          sentiment: 'positive',
          concerns: [],
          nextSteps: []
        }
      }
    ];

    // Sample conversation for Amit Sharma (CUST002)
    const amitConversations = [
      {
        date: '2024-11-01T16:30:00Z',
        userMessage: 'Hi Priya, garden ka kya update hai?',
        aiResponse: 'Hello Amit Sir! Garden area mein landscaping ka kaam start ho gaya hai. Grass lagane ka kaam next week hoga. Aapki wife ko bahut pasand aayega!',
        context: {
          topic: 'garden_landscaping',
          sentiment: 'positive',
          concerns: [],
          nextSteps: ['grass_installation_next_week']
        }
      },
      {
        date: '2024-11-02T17:00:00Z',
        userMessage: 'Kids play area ready hai?',
        aiResponse: 'Yes! Play area almost ready hai. Swings aur slides install ho gaye hain. Safety flooring ka kaam chal raha hai. Bacche bahut enjoy karenge!',
        context: {
          topic: 'play_area',
          sentiment: 'excited',
          concerns: [],
          nextSteps: ['safety_flooring_in_progress']
        }
      },
      {
        date: '2024-11-03T16:45:00Z',
        userMessage: 'Diwali pe site visit kar sakte hain?',
        aiResponse: 'Bilkul! Diwali pe special arrangement hai. Pooja bhi hogi site pe. Aap family ke saath aaiye. 11 baje se event hai.',
        context: {
          topic: 'diwali_visit',
          sentiment: 'positive',
          concerns: [],
          nextSteps: ['diwali_site_visit_confirmed']
        }
      }
    ];

    // Sample conversation for Priya Verma (CUST003)
    const priyaConversations = [
      {
        date: '2024-11-01T14:00:00Z',
        userMessage: 'Next payment kab hai?',
        aiResponse: 'Next installment 15th November ko due hai. Amount Rs. 5 lakhs hai. Online payment ka option available hai. Koi issue ho toh batayiye.',
        context: {
          topic: 'payment_schedule',
          sentiment: 'neutral',
          concerns: ['payment_due'],
          nextSteps: ['payment_by_15th_november']
        }
      },
      {
        date: '2024-11-02T14:30:00Z',
        userMessage: 'Interior work ka budget kya hoga?',
        aiResponse: 'Interior work ke liye estimated budget Rs. 8-10 lakhs hai for your flat size. Cost-effective options bhi available hain. Interior designer se meeting arrange kar sakti hoon.',
        context: {
          topic: 'interior_budget',
          sentiment: 'concerned',
          concerns: ['interior_cost'],
          nextSteps: ['interior_designer_meeting']
        }
      },
      {
        date: '2024-11-03T13:45:00Z',
        userMessage: 'Can I get payment extension?',
        aiResponse: 'Yes, extension possible hai. 7 days ka grace period automatically hai. Zyada extension chahiye toh finance team se baat karni hogi. Main arrange kar dungi.',
        context: {
          topic: 'payment_extension',
          sentiment: 'concerned',
          concerns: ['payment_flexibility'],
          nextSteps: ['finance_team_discussion']
        }
      }
    ];

    // Save conversations
    await this.saveConversationBatch('CUST001', rajeshConversations);
    await this.saveConversationBatch('CUST002', amitConversations);
    await this.saveConversationBatch('CUST003', priyaConversations);

    // Initialize customer contexts
    await this.updateCustomerContext('CUST001', {
      last_call_date: '2024-11-04T09:45:00Z',
      topics_discussed: ['construction_progress', 'bathroom_tiles', 'site_visit', 'plumbing_work'],
      upcoming_visit: '2024-11-09T10:00:00Z',
      concerns: ['bathroom_tiles'],
      preferences: {
        call_time: 'morning',
        language: 'more_hindi',
        communication_style: 'detailed'
      }
    });

    await this.updateCustomerContext('CUST002', {
      last_call_date: '2024-11-03T16:45:00Z',
      topics_discussed: ['garden_landscaping', 'play_area', 'diwali_visit'],
      upcoming_visit: '2024-11-12T11:00:00Z',
      concerns: [],
      preferences: {
        call_time: 'evening',
        language: 'balanced_hinglish',
        communication_style: 'casual'
      }
    });

    await this.updateCustomerContext('CUST003', {
      last_call_date: '2024-11-03T13:45:00Z',
      topics_discussed: ['payment_schedule', 'interior_budget', 'payment_extension'],
      upcoming_visit: null,
      concerns: ['interior_cost', 'payment_flexibility'],
      preferences: {
        call_time: 'afternoon',
        language: 'more_english',
        communication_style: 'concise'
      }
    });

    console.log('✓ Sample conversation data created successfully');
  }

  /**
   * Save a batch of conversations
   */
  async saveConversationBatch(customerId, conversations) {
    const filePath = path.join(CONVERSATIONS_DIR, `${customerId}.json`);
    await fs.writeFile(filePath, JSON.stringify(conversations, null, 2));
  }

  /**
   * Save a single conversation
   * @param {string} customerId - Customer ID
   * @param {string} userMessage - User's message
   * @param {string} aiResponse - AI's response
   * @param {string} timestamp - ISO timestamp
   * @param {object} context - Additional context
   */
  async saveConversation(customerId, userMessage, aiResponse, timestamp = null, context = {}) {
    try {
      const filePath = path.join(CONVERSATIONS_DIR, `${customerId}.json`);
      
      // Read existing conversations
      let conversations = [];
      try {
        const data = await fs.readFile(filePath, 'utf-8');
        conversations = JSON.parse(data);
      } catch (error) {
        // File doesn't exist, start fresh
        conversations = [];
      }

      // Create conversation entry
      const conversation = {
        date: timestamp || new Date().toISOString(),
        userMessage: userMessage,
        aiResponse: aiResponse,
        context: {
          topic: context.topic || 'general',
          sentiment: context.sentiment || 'neutral',
          concerns: context.concerns || [],
          nextSteps: context.nextSteps || [],
          ...context
        }
      };

      conversations.push(conversation);

      // Keep only last 100 conversations
      if (conversations.length > 100) {
        conversations = conversations.slice(-100);
      }

      // Save to file
      await fs.writeFile(filePath, JSON.stringify(conversations, null, 2));

      // Update customer context
      await this.updateLastCallDate(customerId);

      console.log(`✓ Conversation saved for ${customerId}`);
      return true;
    } catch (error) {
      console.error('Error saving conversation:', error);
      return false;
    }
  }

  /**
   * Get conversation history for a customer
   * @param {string} customerId - Customer ID
   * @param {number} lastN - Number of recent conversations to retrieve
   * @returns {Array} Array of conversations
   */
  async getConversationHistory(customerId, lastN = 5) {
    try {
      const filePath = path.join(CONVERSATIONS_DIR, `${customerId}.json`);
      
      const data = await fs.readFile(filePath, 'utf-8');
      const conversations = JSON.parse(data);

      // Return last N conversations
      const recentConversations = conversations.slice(-lastN);

      return recentConversations;
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return empty array
        return [];
      }
      console.error('Error reading conversation history:', error);
      return [];
    }
  }

  /**
   * Get summarized context from conversation history
   * @param {string} customerId - Customer ID
   * @param {number} lastN - Number of conversations to analyze
   * @returns {object} Summarized context
   */
  async getSummarizedContext(customerId, lastN = 5) {
    try {
      const conversations = await this.getConversationHistory(customerId, lastN);
      
      if (conversations.length === 0) {
        return {
          hasHistory: false,
          conversationCount: 0,
          recentTopics: [],
          concerns: [],
          nextSteps: [],
          sentiment: 'neutral'
        };
      }

      // Extract topics
      const topics = conversations.map(c => c.context.topic).filter(Boolean);
      const uniqueTopics = [...new Set(topics)];

      // Extract concerns
      const allConcerns = conversations.flatMap(c => c.context.concerns || []);
      const uniqueConcerns = [...new Set(allConcerns)];

      // Extract next steps
      const allNextSteps = conversations.flatMap(c => c.context.nextSteps || []);
      const uniqueNextSteps = [...new Set(allNextSteps)];

      // Determine overall sentiment
      const sentiments = conversations.map(c => c.context.sentiment);
      const positiveCount = sentiments.filter(s => s === 'positive' || s === 'excited').length;
      const negativeCount = sentiments.filter(s => s === 'negative' || s === 'concerned').length;
      
      let overallSentiment = 'neutral';
      if (positiveCount > negativeCount) overallSentiment = 'positive';
      else if (negativeCount > positiveCount) overallSentiment = 'concerned';

      // Get last conversation summary
      const lastConversation = conversations[conversations.length - 1];

      return {
        hasHistory: true,
        conversationCount: conversations.length,
        recentTopics: uniqueTopics,
        concerns: uniqueConcerns,
        nextSteps: uniqueNextSteps,
        sentiment: overallSentiment,
        lastConversation: {
          date: lastConversation.date,
          topic: lastConversation.context.topic,
          userMessage: lastConversation.userMessage,
          summary: lastConversation.aiResponse.substring(0, 100) + '...'
        }
      };
    } catch (error) {
      console.error('Error getting summarized context:', error);
      return {
        hasHistory: false,
        conversationCount: 0,
        recentTopics: [],
        concerns: [],
        nextSteps: [],
        sentiment: 'neutral'
      };
    }
  }

  /**
   * Update customer context
   * @param {string} customerId - Customer ID
   * @param {object} updates - Context updates
   */
  async updateCustomerContext(customerId, updates) {
    try {
      // Read existing contexts
      const data = await fs.readFile(CUSTOMER_CONTEXT_FILE, 'utf-8');
      const contexts = JSON.parse(data);

      // Initialize if doesn't exist
      if (!contexts[customerId]) {
        contexts[customerId] = {
          created_at: new Date().toISOString(),
          last_call_date: null,
          topics_discussed: [],
          upcoming_visit: null,
          concerns: [],
          preferences: {}
        };
      }

      // Merge updates
      contexts[customerId] = {
        ...contexts[customerId],
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Save to file
      await fs.writeFile(CUSTOMER_CONTEXT_FILE, JSON.stringify(contexts, null, 2));

      console.log(`✓ Customer context updated for ${customerId}`);
      return true;
    } catch (error) {
      console.error('Error updating customer context:', error);
      return false;
    }
  }

  /**
   * Get customer context
   * @param {string} customerId - Customer ID
   * @returns {object} Customer context
   */
  async getCustomerContext(customerId) {
    try {
      const data = await fs.readFile(CUSTOMER_CONTEXT_FILE, 'utf-8');
      const contexts = JSON.parse(data);
      
      return contexts[customerId] || null;
    } catch (error) {
      console.error('Error getting customer context:', error);
      return null;
    }
  }

  /**
   * Update last call date
   */
  async updateLastCallDate(customerId) {
    await this.updateCustomerContext(customerId, {
      last_call_date: new Date().toISOString()
    });
  }

  /**
   * Add topic to discussed topics
   */
  async addDiscussedTopic(customerId, topic) {
    const context = await this.getCustomerContext(customerId);
    if (context) {
      const topics = context.topics_discussed || [];
      if (!topics.includes(topic)) {
        topics.push(topic);
        await this.updateCustomerContext(customerId, {
          topics_discussed: topics
        });
      }
    }
  }

  /**
   * Add or update concern
   */
  async addConcern(customerId, concern) {
    const context = await this.getCustomerContext(customerId);
    if (context) {
      const concerns = context.concerns || [];
      if (!concerns.includes(concern)) {
        concerns.push(concern);
        await this.updateCustomerContext(customerId, {
          concerns: concerns
        });
      }
    }
  }

  /**
   * Remove resolved concern
   */
  async removeConcern(customerId, concern) {
    const context = await this.getCustomerContext(customerId);
    if (context) {
      const concerns = (context.concerns || []).filter(c => c !== concern);
      await this.updateCustomerContext(customerId, {
        concerns: concerns
      });
    }
  }

  /**
   * Clear conversation history for a customer
   */
  async clearHistory(customerId) {
    try {
      const filePath = path.join(CONVERSATIONS_DIR, `${customerId}.json`);
      await fs.unlink(filePath);
      console.log(`✓ Conversation history cleared for ${customerId}`);
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, nothing to clear
        return true;
      }
      console.error('Error clearing history:', error);
      return false;
    }
  }

  /**
   * Get all customers with conversation history
   */
  async getAllCustomersWithHistory() {
    try {
      const files = await fs.readdir(CONVERSATIONS_DIR);
      const customerIds = files
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''));
      
      return customerIds;
    } catch (error) {
      console.error('Error getting customers:', error);
      return [];
    }
  }

  /**
   * Get memory statistics
   */
  async getMemoryStats() {
    try {
      const customerIds = await this.getAllCustomersWithHistory();
      
      let totalConversations = 0;
      const customerStats = [];

      for (const customerId of customerIds) {
        const conversations = await this.getConversationHistory(customerId, 1000);
        totalConversations += conversations.length;
        
        customerStats.push({
          customerId,
          conversationCount: conversations.length,
          lastConversation: conversations[conversations.length - 1]?.date
        });
      }

      return {
        totalCustomers: customerIds.length,
        totalConversations: totalConversations,
        averageConversationsPerCustomer: customerIds.length > 0 
          ? Math.round(totalConversations / customerIds.length) 
          : 0,
        customers: customerStats
      };
    } catch (error) {
      console.error('Error getting memory stats:', error);
      return {
        totalCustomers: 0,
        totalConversations: 0,
        averageConversationsPerCustomer: 0,
        customers: []
      };
    }
  }
}

export default new MemoryService();
