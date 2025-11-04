# AI English Tutor - Architecture Documentation

## System Overview

The AI English Tutor is a full-stack web application that enables interactive English language learning through conversational AI.

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  HTML/CSS   │  │  JavaScript  │  │  Web Speech API  │  │
│  │  Bootstrap  │  │   Frontend   │  │  (STT/TTS)       │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS BACKEND                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Routes     │  │   Services   │  │  Conversation    │  │
│  │  (chat.js)   │  │  (ollama.js) │  │   Manager        │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└────────────────────────┬───────────────────┬────────────────┘
                         │                    │
                         ▼                    ▼
              ┌──────────────────┐  ┌──────────────────┐
              │  Ollama Service  │  │   PostgreSQL     │
              │   (Local AI)     │  │   (Render.com)   │
              └──────────────────┘  └──────────────────┘
```

## Component Architecture

### Frontend Layer

#### 1. HTML/CSS (Bootstrap)
- **Location**: `frontend/index.html`, `frontend/css/styles.css`
- **Purpose**: User interface and styling
- **Key Features**:
  - Responsive layout using Bootstrap 5
  - Animated avatar with multiple states
  - Chat interface with message history
  - Input controls (microphone, text input)

#### 2. JavaScript Modules

**a) speechRecognition.js**
- Wraps Web Speech API for voice input
- Handles browser compatibility
- Provides event-driven interface
- Features: interim results, error handling

**b) textToSpeech.js**
- Wraps Web Speech Synthesis API
- Voice selection and management
- Speaking state tracking
- Queue management

**c) app.js**
- Main application controller
- Orchestrates all components
- Manages application state
- Handles API communication
- Updates UI based on events

### Backend Layer

#### 1. Express.js Server
- **Location**: `backend/src/server.js`
- **Purpose**: HTTP server and API gateway
- **Features**:
  - CORS enabled for cross-origin requests
  - Static file serving (frontend)
  - JSON request/response handling
  - Error handling middleware
  - Request logging

#### 2. Routes
- **Location**: `backend/src/routes/chat.js`
- **Endpoints**:
  - `POST /api/chat/start` - Initialize conversation
  - `POST /api/chat` - Send message and get response
  - `GET /api/chat/history/:id` - Get conversation history
  - `DELETE /api/chat/:id` - Clear conversation
  - `GET /api/health` - Health check

#### 3. Services

**a) ollama.js**
- **Purpose**: Interface with Ollama AI service
- **Key Functions**:
  - `chat(context)` - Send conversation to AI
  - `getGreeting()` - Get initial greeting
  - `testConnection()` - Verify Ollama availability
- **Features**:
  - Custom system prompt for English tutoring
  - Context management
  - Error handling and fallbacks

**b) conversationManager.js**
- **Purpose**: Manage conversation state and history
- **Storage**: In-memory Map (temporary, will be DB later)
- **Key Functions**:
  - `createSession()` - Create new conversation
  - `addMessage()` - Add message to history
  - `getContext()` - Get conversation context for AI
  - `cleanupOldSessions()` - Automatic cleanup
- **Features**:
  - Session-based conversation tracking
  - Message history management
  - Automatic old session cleanup
  - Context windowing (last 20 messages)

#### 4. Database Models
- **Location**: `backend/src/models/conversation.js`
- **Purpose**: Future database operations
- **Status**: Prepared but not yet active in MVP
- **Tables**: users, conversations, messages, progress

#### 5. Database Configuration
- **Location**: `backend/src/config/database.js`
- **Purpose**: PostgreSQL connection pool
- **Features**:
  - Connection pooling
  - SSL support for production
  - Query helper functions
  - Error handling

### External Services

#### 1. Ollama (Local AI)
- **Connection**: HTTP REST API (default: localhost:11434)
- **Model**: Configurable (llama2, mistral, etc.)
- **Purpose**: Generate AI tutor responses
- **API Endpoint**: `/api/generate`

#### 2. PostgreSQL (Render.com)
- **Purpose**: Persistent data storage (future use)
- **Connection**: TCP/IP with SSL
- **Schema**: Defined in `database/schema.sql`
- **Status**: Prepared for future features

### Web Speech API

#### Speech Recognition (Browser)
- **API**: Web Speech API (SpeechRecognition)
- **Support**: Chrome, Edge, Safari
- **Features**: Real-time voice-to-text
- **Language**: English (en-US)

#### Text-to-Speech (Browser)
- **API**: Web Speech API (SpeechSynthesis)
- **Support**: All modern browsers
- **Features**: Natural voice output
- **Voice**: Automatically selects best English voice

## Data Flow

### Starting a Conversation

```
User clicks "Start" button
    │
    ▼
Frontend: POST /api/chat/start
    │
    ▼
Backend: Create session
    │
    ▼
Backend: Get AI greeting
    │
    ▼
Ollama: Generate greeting
    │
    ▼
Backend: Return greeting + sessionId
    │
    ▼
Frontend: Display message
    │
    ▼
Frontend: Speak greeting (TTS)
```

### User Message Flow

```
User speaks or types message
    │
    ▼
[If speech] Web Speech API → Text
    │
    ▼
Frontend: Display user message
    │
    ▼
Frontend: POST /api/chat
    │
    ▼
Backend: Add message to history
    │
    ▼
Backend: Get conversation context
    │
    ▼
Backend: Send context to Ollama
    │
    ▼
Ollama: Generate response
    │
    ▼
Backend: Add response to history
    │
    ▼
Backend: Return response
    │
    ▼
Frontend: Display AI message
    │
    ▼
Frontend: Speak response (TTS)
```

## State Management

### Frontend State
- `conversationId` - Current session identifier
- `isConversationActive` - Conversation status flag
- `speechRecognition.isListening` - Microphone state
- `textToSpeech.isSpeaking` - Speech output state
- Avatar state: idle, listening, speaking, thinking

### Backend State
- In-memory conversation Map
  - Key: sessionId
  - Value: { id, messages[], createdAt, lastActivity }
- Message history per session (max 20 messages)

## Security Considerations

### Current Implementation
- CORS enabled (development)
- Input sanitization (XSS prevention)
- HTML escaping in frontend
- Environment variables for sensitive config
- No authentication (MVP)

### Future Enhancements
- JWT-based authentication
- OAuth2 with Google
- Rate limiting
- API key validation
- HTTPS enforcement
- Input validation with Joi/Zod
- SQL injection prevention (parameterized queries ready)

## Scalability Considerations

### Current Limitations (MVP)
- In-memory session storage
- Single server instance
- Local Ollama (not suitable for production)
- No load balancing
- No caching

### Future Improvements
- Database-backed sessions
- Redis for session caching
- Replace Ollama with cloud AI (OpenAI/Anthropic)
- Horizontal scaling with load balancer
- CDN for static assets
- WebSocket for real-time features
- Message queue for async processing

## Deployment Architecture

### Current (Development)
```
Docker Container (Backend + Frontend)
    │
    ├─ Express.js (port 3000)
    ├─ Static files (frontend/)
    │
    └─ External connections:
        ├─ Ollama (localhost:11434)
        └─ PostgreSQL (Render.com)
```

### Future (Production)
```
Load Balancer
    │
    ├─ Backend Instances (auto-scaled)
    │   ├─ Express.js
    │   └─ Redis (sessions)
    │
    ├─ Frontend (CDN/S3)
    │
    └─ External Services:
        ├─ OpenAI API
        ├─ PostgreSQL (managed)
        └─ Object Storage
```

## Performance Optimization

### Current Optimizations
- Conversation context windowing (20 messages)
- Static asset caching
- Efficient DOM updates
- Old session cleanup

### Future Optimizations
- Response caching
- Database connection pooling (ready)
- Lazy loading frontend assets
- Code splitting
- Image optimization
- Compression middleware
- Database indexing (schema ready)

## Error Handling Strategy

### Frontend
- User-friendly error messages
- Automatic retry on network failures
- Graceful degradation (speech → text fallback)
- Browser compatibility checks

### Backend
- Structured error responses
- Detailed logging
- Error propagation with context
- Ollama connection fallback
- Database error handling

## Monitoring & Logging

### Current
- Console logging (development)
- Request logging
- Error logging
- Speech API event logging

### Future Recommendations
- Structured logging (Winston/Pino)
- Application monitoring (PM2, New Relic)
- Error tracking (Sentry)
- Analytics (Google Analytics, Mixpanel)
- Performance monitoring (Web Vitals)
- Database query monitoring

## Technology Choices Rationale

### Why Node.js/Express?
- Unified JavaScript stack
- Excellent async I/O for real-time features
- Large ecosystem
- Easy deployment
- Perfect for API gateway pattern

### Why Bootstrap?
- Quick MVP development
- Responsive out of the box
- Mature and stable
- Good documentation
- User preference

### Why Web Speech API?
- No additional cost
- Works in browser
- Good enough for MVP
- Easy to implement
- Can be replaced later

### Why Ollama (for MVP)?
- Free local testing
- No API costs during development
- Privacy (data stays local)
- Fast iteration
- Easy to swap for cloud AI later

### Why PostgreSQL?
- Robust and mature
- Good for structured data
- Strong consistency
- JSON support for flexibility
- User has existing instance

