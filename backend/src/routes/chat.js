const express = require('express');
const router = express.Router();
const ollamaService = require('../services/ollama');
const conversationManager = require('../services/conversationManager');

// POST /api/chat - Send message to AI tutor
router.post('/', async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    // Validate request
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Message is required and must be a non-empty string' 
      });
    }

    // Get or create conversation context
    const sessionId = conversationId || conversationManager.createSession();
    
    // Add user message to conversation history
    conversationManager.addMessage(sessionId, 'user', message);

    // Get conversation context for AI
    const context = conversationManager.getContext(sessionId);

    // Send to Ollama and get response
    const aiResponse = await ollamaService.chat(context);

    // Add AI response to conversation history
    conversationManager.addMessage(sessionId, 'assistant', aiResponse);

    // Return response
    res.json({
      response: aiResponse,
      conversationId: sessionId,
      messageCount: conversationManager.getMessageCount(sessionId)
    });

  } catch (error) {
    console.error('Chat error:', error);
    
    // Handle specific errors
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'AI service is unavailable. Please ensure Ollama is running.' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to process your message. Please try again.' 
    });
  }
});

// GET /api/chat/history/:conversationId - Get conversation history
router.get('/history/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    const history = conversationManager.getHistory(conversationId);

    if (!history) {
      return res.status(404).json({ 
        error: 'Conversation not found' 
      });
    }

    res.json({
      conversationId,
      messages: history,
      messageCount: history.length
    });

  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve conversation history' 
    });
  }
});

// DELETE /api/chat/:conversationId - Clear conversation
router.delete('/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    conversationManager.clearSession(conversationId);

    res.json({ 
      message: 'Conversation cleared successfully',
      conversationId 
    });

  } catch (error) {
    console.error('Clear conversation error:', error);
    res.status(500).json({ 
      error: 'Failed to clear conversation' 
    });
  }
});

// POST /api/chat/start - Start a new conversation with greeting
router.post('/start', async (req, res) => {
  try {
    // Create new session
    const sessionId = conversationManager.createSession();

    // Get initial greeting from AI
    const greeting = await ollamaService.getGreeting();

    // Add greeting to conversation history
    conversationManager.addMessage(sessionId, 'assistant', greeting);

    res.json({
      conversationId: sessionId,
      greeting: greeting
    });

  } catch (error) {
    console.error('Start conversation error:', error);
    res.status(500).json({ 
      error: 'Failed to start conversation. Please try again.' 
    });
  }
});

module.exports = router;

