import express from 'express';
import memoryService from '../services/memoryService.js';

const router = express.Router();

// GET /api/memory/:customerId - Get conversation history
router.get('/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { lastN } = req.query;
    
    const history = await memoryService.getConversationHistory(
      customerId, 
      lastN ? parseInt(lastN) : 5
    );

    res.json({
      success: true,
      customerId,
      history,
      count: history.length
    });
  } catch (error) {
    console.error('Memory fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch conversation history',
      details: error.message
    });
  }
});

// GET /api/memory/:customerId/summary - Get summarized context
router.get('/:customerId/summary', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { lastN } = req.query;
    
    const summary = await memoryService.getSummarizedContext(
      customerId,
      lastN ? parseInt(lastN) : 5
    );

    res.json({
      success: true,
      customerId,
      summary
    });
  } catch (error) {
    console.error('Summary fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch conversation summary',
      details: error.message
    });
  }
});

// GET /api/memory/:customerId/context - Get customer context
router.get('/:customerId/context', async (req, res) => {
  try {
    const { customerId } = req.params;
    const context = await memoryService.getCustomerContext(customerId);

    if (!context) {
      return res.status(404).json({
        error: 'Customer context not found'
      });
    }

    res.json({
      success: true,
      customerId,
      context
    });
  } catch (error) {
    console.error('Context fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch customer context',
      details: error.message
    });
  }
});

// POST /api/memory/:customerId/conversation - Save conversation
router.post('/:customerId/conversation', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { userMessage, aiResponse, timestamp, context } = req.body;

    if (!userMessage || !aiResponse) {
      return res.status(400).json({
        error: 'userMessage and aiResponse are required'
      });
    }

    const success = await memoryService.saveConversation(
      customerId,
      userMessage,
      aiResponse,
      timestamp,
      context
    );

    res.json({
      success: success,
      message: 'Conversation saved successfully'
    });
  } catch (error) {
    console.error('Conversation save error:', error);
    res.status(500).json({
      error: 'Failed to save conversation',
      details: error.message
    });
  }
});

// PUT /api/memory/:customerId/context - Update customer context
router.put('/:customerId/context', async (req, res) => {
  try {
    const { customerId } = req.params;
    const updates = req.body;

    const success = await memoryService.updateCustomerContext(customerId, updates);

    res.json({
      success: success,
      message: 'Customer context updated successfully'
    });
  } catch (error) {
    console.error('Context update error:', error);
    res.status(500).json({
      error: 'Failed to update customer context',
      details: error.message
    });
  }
});

// POST /api/memory/:customerId/concern - Add concern
router.post('/:customerId/concern', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { concern } = req.body;

    if (!concern) {
      return res.status(400).json({
        error: 'concern is required'
      });
    }

    await memoryService.addConcern(customerId, concern);

    res.json({
      success: true,
      message: 'Concern added successfully'
    });
  } catch (error) {
    console.error('Add concern error:', error);
    res.status(500).json({
      error: 'Failed to add concern',
      details: error.message
    });
  }
});

// DELETE /api/memory/:customerId/concern - Remove concern
router.delete('/:customerId/concern', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { concern } = req.body;

    if (!concern) {
      return res.status(400).json({
        error: 'concern is required'
      });
    }

    await memoryService.removeConcern(customerId, concern);

    res.json({
      success: true,
      message: 'Concern removed successfully'
    });
  } catch (error) {
    console.error('Remove concern error:', error);
    res.status(500).json({
      error: 'Failed to remove concern',
      details: error.message
    });
  }
});

// DELETE /api/memory/:customerId - Clear conversation history
router.delete('/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    await memoryService.clearHistory(customerId);

    res.json({
      success: true,
      message: 'Conversation history cleared'
    });
  } catch (error) {
    console.error('Memory clear error:', error);
    res.status(500).json({
      error: 'Failed to clear conversation history',
      details: error.message
    });
  }
});

// GET /api/memory/stats - Get memory statistics
router.get('/stats/all', async (req, res) => {
  try {
    const stats = await memoryService.getMemoryStats();

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch memory statistics',
      details: error.message
    });
  }
});

export default router;
