import express from 'express';
import conversationService from '../services/conversationService.js';

const router = express.Router();

// POST /api/chat - Send message and get AI response
router.post('/', async (req, res) => {
  try {
    const { customerId, message } = req.body;

    if (!customerId || !message) {
      return res.status(400).json({
        error: 'customerId and message are required'
      });
    }

    // Handle conversation with full context
    const result = await conversationService.handleConversation(customerId, message);

    res.json(result);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to process chat message',
      details: error.message
    });
  }
});

// POST /api/chat/greeting - Generate initial greeting
router.post('/greeting', async (req, res) => {
  try {
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({
        error: 'customerId is required'
      });
    }

    const result = await conversationService.generateGreeting(customerId);

    res.json(result);
  } catch (error) {
    console.error('Greeting error:', error);
    res.status(500).json({
      error: 'Failed to generate greeting',
      details: error.message
    });
  }
});

// GET /api/chat/customers - Get all customers (for testing/admin)
router.get('/customers', (req, res) => {
  try {
    const customers = conversationService.getAllCustomers();
    res.json({
      success: true,
      customers
    });
  } catch (error) {
    console.error('Customers fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch customers',
      details: error.message
    });
  }
});

export default router;
