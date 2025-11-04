const axios = require('axios');

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2';

// System prompt for the English tutor AI
const SYSTEM_PROMPT = `You are an enthusiastic and patient English language tutor. Your role is to:

1. Have natural, engaging conversations with students learning English
2. Ask interesting questions about their daily life, hobbies, interests, and opinions
3. Listen actively and provide constructive feedback on their responses
4. Gently correct grammar mistakes in a supportive way
5. Suggest better vocabulary choices when appropriate
6. Encourage them to express themselves more
7. Keep the conversation flowing naturally by asking follow-up questions
8. Adapt to their English level - if they make many mistakes, use simpler language; if they're advanced, challenge them more
9. Be encouraging and positive - learning a language should be fun!
10. Keep your responses conversational and not too long (2-4 sentences typically)

Guidelines:
- Start with a warm greeting and an easy question
- When you notice mistakes, acknowledge their effort first, then provide gentle corrections like "Great effort! A better way to say that would be..."
- End each response with a question to keep the conversation going
- Mix different topics: daily routines, preferences, experiences, opinions, hypothetical scenarios
- Show genuine interest in their responses
- If they're struggling, offer encouragement and maybe rephrase your question more simply

Remember: You're having a conversation, not giving a lecture. Be friendly, natural, and supportive!`;

// Send a chat message to Ollama with conversation context
const chat = async (conversationContext) => {
  try {
    const messages = conversationContext || [];
    
    // Build the prompt with system instruction and conversation history
    let prompt = SYSTEM_PROMPT + '\n\n';
    
    // Add conversation history
    messages.forEach(msg => {
      if (msg.role === 'user') {
        prompt += `Student: ${msg.content}\n\n`;
      } else if (msg.role === 'assistant') {
        prompt += `Tutor: ${msg.content}\n\n`;
      }
    });
    
    prompt += 'Tutor: ';

    const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
      model: OLLAMA_MODEL,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.8, // More creative/varied responses
        top_p: 0.9,
        top_k: 40,
      }
    }, {
      timeout: 60000, // 60 second timeout
    });

    const aiResponse = response.data.response.trim();
    return aiResponse;

  } catch (error) {
    console.error('Ollama API error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to Ollama. Please ensure Ollama is running.');
    }
    
    if (error.response) {
      throw new Error(`Ollama returned error: ${error.response.status}`);
    }
    
    throw error;
  }
};

// Get initial greeting from the AI tutor
const getGreeting = async () => {
  try {
    const prompt = `${SYSTEM_PROMPT}

You are meeting a new student for the first time. Give them a warm, friendly greeting and introduce yourself as their English tutor. Then ask them an easy, engaging question to start the conversation (like about their day, their interests, or where they're from). Keep it natural and encouraging!

Tutor: `;

    const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
      model: OLLAMA_MODEL,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.8,
        top_p: 0.9,
      }
    }, {
      timeout: 60000,
    });

    return response.data.response.trim();

  } catch (error) {
    console.error('Ollama greeting error:', error.message);
    // Fallback greeting if Ollama fails
    return "Hello! I'm your English tutor, and I'm so excited to help you practice English today! Let's have a nice conversation together. To start, can you tell me a bit about yourself? What do you like to do in your free time?";
  }
};

// Test Ollama connection
const testConnection = async () => {
  try {
    const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, {
      timeout: 5000,
    });
    
    const models = response.data.models || [];
    const modelExists = models.some(m => m.name.includes(OLLAMA_MODEL));
    
    return {
      connected: true,
      modelAvailable: modelExists,
      availableModels: models.map(m => m.name)
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message
    };
  }
};

module.exports = {
  chat,
  getGreeting,
  testConnection,
};

