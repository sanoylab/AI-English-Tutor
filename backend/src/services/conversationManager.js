const crypto = require('crypto');

// In-memory storage for conversations (will be replaced with database in future)
const conversations = new Map();

// Maximum messages to keep in context (to avoid token limits)
const MAX_CONTEXT_MESSAGES = 20;

// Creates a new conversation session and returns session ID
const createSession = () => {
  const sessionId = crypto.randomBytes(16).toString('hex');
  conversations.set(sessionId, {
    id: sessionId,
    messages: [],
    createdAt: new Date(),
    lastActivity: new Date(),
  });
  return sessionId;
};

// Add a message to conversation history
const addMessage = (sessionId, role, content) => {
  const conversation = conversations.get(sessionId);
  
  if (!conversation) {
    throw new Error(`Conversation ${sessionId} not found`);
  }

  const message = {
    role, // 'user' or 'assistant'
    content,
    timestamp: new Date(),
  };

  conversation.messages.push(message);
  conversation.lastActivity = new Date();

  // Keep only recent messages to avoid token limits
  if (conversation.messages.length > MAX_CONTEXT_MESSAGES) {
    // Keep the most recent messages
    conversation.messages = conversation.messages.slice(-MAX_CONTEXT_MESSAGES);
  }

  return message;
};

// Get conversation context for AI (formatted messages)
const getContext = (sessionId) => {
  const conversation = conversations.get(sessionId);
  
  if (!conversation) {
    throw new Error(`Conversation ${sessionId} not found`);
  }

  return conversation.messages.map(msg => ({
    role: msg.role,
    content: msg.content,
  }));
};

// Get full conversation history
const getHistory = (sessionId) => {
  const conversation = conversations.get(sessionId);
  
  if (!conversation) {
    return null;
  }

  return conversation.messages;
};

// Get message count for a session
const getMessageCount = (sessionId) => {
  const conversation = conversations.get(sessionId);
  return conversation ? conversation.messages.length : 0;
};

// Clear a conversation session
const clearSession = (sessionId) => {
  return conversations.delete(sessionId);
};

// Get conversation metadata
const getSessionInfo = (sessionId) => {
  const conversation = conversations.get(sessionId);
  
  if (!conversation) {
    return null;
  }

  return {
    id: conversation.id,
    messageCount: conversation.messages.length,
    createdAt: conversation.createdAt,
    lastActivity: conversation.lastActivity,
  };
};

// Clean up old conversations (run periodically)
const cleanupOldSessions = (maxAgeHours = 24) => {
  const now = new Date();
  const maxAge = maxAgeHours * 60 * 60 * 1000; // Convert to milliseconds
  
  let deletedCount = 0;
  
  for (const [sessionId, conversation] of conversations.entries()) {
    const age = now - conversation.lastActivity;
    if (age > maxAge) {
      conversations.delete(sessionId);
      deletedCount++;
    }
  }
  
  console.log(`Cleaned up ${deletedCount} old conversation sessions`);
  return deletedCount;
};

// Get statistics
const getStats = () => {
  return {
    totalSessions: conversations.size,
    sessions: Array.from(conversations.values()).map(conv => ({
      id: conv.id,
      messageCount: conv.messages.length,
      createdAt: conv.createdAt,
      lastActivity: conv.lastActivity,
    }))
  };
};

// Run cleanup every hour
setInterval(() => {
  cleanupOldSessions(24); // Clean sessions older than 24 hours
}, 60 * 60 * 1000);

module.exports = {
  createSession,
  addMessage,
  getContext,
  getHistory,
  getMessageCount,
  clearSession,
  getSessionInfo,
  cleanupOldSessions,
  getStats,
};

