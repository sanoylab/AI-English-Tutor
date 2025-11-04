-- AI English Language Tutor Database Schema
-- Note: Run this script manually in your PostgreSQL database

-- Users table (for future authentication)
CREATE TABLE IF NOT EXISTS ai_tutor_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversations table
CREATE TABLE IF NOT EXISTS ai_tutor_conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES ai_tutor_users(id) ON DELETE CASCADE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    session_id VARCHAR(255) UNIQUE
);

-- Messages table
CREATE TABLE IF NOT EXISTS ai_tutor_messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES ai_tutor_conversations(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progress tracking table
CREATE TABLE IF NOT EXISTS ai_tutor_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES ai_tutor_users(id) ON DELETE CASCADE,
    level VARCHAR(50) DEFAULT 'beginner',
    score INTEGER DEFAULT 0,
    topics_covered TEXT[], -- Array of topics discussed
    total_conversations INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_tutor_conversations_user_id ON ai_tutor_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_tutor_conversations_session_id ON ai_tutor_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_tutor_messages_conversation_id ON ai_tutor_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_tutor_messages_timestamp ON ai_tutor_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_ai_tutor_progress_user_id ON ai_tutor_progress(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION ai_tutor_update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to users table
CREATE TRIGGER ai_tutor_update_users_updated_at BEFORE UPDATE ON ai_tutor_users
    FOR EACH ROW EXECUTE FUNCTION ai_tutor_update_updated_at_column();

