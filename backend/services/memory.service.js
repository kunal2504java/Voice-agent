import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const CONVERSATIONS_FILE = path.join(DATA_DIR, 'conversations.json');

class MemoryService {
  constructor() {
    this.ensureDataDirectory();
  }

  async ensureDataDirectory() {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }

    try {
      await fs.access(CONVERSATIONS_FILE);
    } catch {
      await fs.writeFile(CONVERSATIONS_FILE, JSON.stringify({}, null, 2));
    }
  }

  async getConversationHistory(customerId) {
    try {
      const data = await fs.readFile(CONVERSATIONS_FILE, 'utf-8');
      const conversations = JSON.parse(data);
      return conversations[customerId] || [];
    } catch (error) {
      console.error('Error reading conversation history:', error);
      return [];
    }
  }

  async saveMessage(customerId, role, content, metadata = {}) {
    try {
      const data = await fs.readFile(CONVERSATIONS_FILE, 'utf-8');
      const conversations = JSON.parse(data);

      if (!conversations[customerId]) {
        conversations[customerId] = [];
      }

      conversations[customerId].push({
        role,
        content,
        timestamp: new Date().toISOString(),
        ...metadata
      });

      // Keep only last 50 messages per customer
      if (conversations[customerId].length > 50) {
        conversations[customerId] = conversations[customerId].slice(-50);
      }

      await fs.writeFile(CONVERSATIONS_FILE, JSON.stringify(conversations, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving message:', error);
      return false;
    }
  }

  async getCustomerContext(customerId) {
    const history = await this.getConversationHistory(customerId);
    
    // Extract relevant context from history
    const lastMessages = history.slice(-10);
    const preferences = this.extractPreferences(history);
    
    return {
      lastMessages,
      preferences,
      totalInteractions: history.length
    };
  }

  extractPreferences(history) {
    // Simple preference extraction
    const preferences = {
      language: 'hinglish',
      preferredTime: 'morning',
      interests: []
    };

    // Analyze history for patterns
    const recentMessages = history.slice(-20);
    const hindiWords = ['haan', 'nahi', 'kya', 'kaise', 'theek', 'accha'];
    
    let hindiCount = 0;
    recentMessages.forEach(msg => {
      if (msg.role === 'user') {
        hindiWords.forEach(word => {
          if (msg.content.toLowerCase().includes(word)) {
            hindiCount++;
          }
        });
      }
    });

    if (hindiCount > 5) {
      preferences.language = 'more_hindi';
    }

    return preferences;
  }

  async clearHistory(customerId) {
    try {
      const data = await fs.readFile(CONVERSATIONS_FILE, 'utf-8');
      const conversations = JSON.parse(data);
      
      delete conversations[customerId];
      
      await fs.writeFile(CONVERSATIONS_FILE, JSON.stringify(conversations, null, 2));
      return true;
    } catch (error) {
      console.error('Error clearing history:', error);
      return false;
    }
  }
}

export default new MemoryService();
