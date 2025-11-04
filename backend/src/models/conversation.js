const { query } = require('../config/database');

// Database model for conversations (prepared for future use)

// Create a new conversation in database
const createConversation = async (userId, sessionId) => {
  const sql = `
    INSERT INTO ai_tutor_conversations (user_id, session_id, started_at)
    VALUES ($1, $2, NOW())
    RETURNING *
  `;
  const result = await query(sql, [userId, sessionId]);
  return result.rows[0];
};

// End a conversation
const endConversation = async (conversationId) => {
  const sql = `
    UPDATE ai_tutor_conversations 
    SET ended_at = NOW()
    WHERE id = $1
    RETURNING *
  `;
  const result = await query(sql, [conversationId]);
  return result.rows[0];
};

// Save a message to database
const saveMessage = async (conversationId, role, content) => {
  const sql = `
    INSERT INTO ai_tutor_messages (conversation_id, role, content, timestamp)
    VALUES ($1, $2, $3, NOW())
    RETURNING *
  `;
  const result = await query(sql, [conversationId, role, content]);
  return result.rows[0];
};

// Get conversation history from database
const getConversationHistory = async (conversationId) => {
  const sql = `
    SELECT * FROM ai_tutor_messages
    WHERE conversation_id = $1
    ORDER BY timestamp ASC
  `;
  const result = await query(sql, [conversationId]);
  return result.rows;
};

// Get user's conversations
const getUserConversations = async (userId, limit = 10) => {
  const sql = `
    SELECT c.*, COUNT(m.id) as message_count
    FROM ai_tutor_conversations c
    LEFT JOIN ai_tutor_messages m ON c.id = m.conversation_id
    WHERE c.user_id = $1
    GROUP BY c.id
    ORDER BY c.started_at DESC
    LIMIT $2
  `;
  const result = await query(sql, [userId, limit]);
  return result.rows;
};

// Update user progress
const updateProgress = async (userId, data) => {
  const sql = `
    INSERT INTO ai_tutor_progress (user_id, level, score, topics_covered, total_conversations, total_messages)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      level = $2,
      score = ai_tutor_progress.score + $3,
      topics_covered = $4,
      total_conversations = ai_tutor_progress.total_conversations + $5,
      total_messages = ai_tutor_progress.total_messages + $6,
      last_activity = NOW()
    RETURNING *
  `;
  const result = await query(sql, [
    userId,
    data.level || 'beginner',
    data.score || 0,
    data.topics_covered || [],
    data.total_conversations || 1,
    data.total_messages || 0
  ]);
  return result.rows[0];
};

// Get user progress
const getUserProgress = async (userId) => {
  const sql = `
    SELECT * FROM ai_tutor_progress
    WHERE user_id = $1
  `;
  const result = await query(sql, [userId]);
  return result.rows[0];
};

module.exports = {
  createConversation,
  endConversation,
  saveMessage,
  getConversationHistory,
  getUserConversations,
  updateProgress,
  getUserProgress,
};

