# 🎓 AI English Language Tutor

<div align="center">

![AI English Tutor](https://raw.githubusercontent.com/sanoylab/AI-English-Tutor/refs/heads/main/Screenshot%202025-11-03%20at%207.37.04%E2%80%AFPM.png)

**Learn English Through Natural Conversation with AI**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 About

An interactive web application that helps users learn and practice English through natural conversations with an AI tutor. The app features a realistic animated character that asks questions, listens to your responses via voice input, provides constructive feedback, and helps you improve your English in a fun and engaging way.

Perfect for:
- 🌍 ESL (English as a Second Language) learners
- 🗣️ Practicing conversational English
- 📚 Building vocabulary and grammar skills
- 🎯 Improving pronunciation and fluency
- 💪 Gaining confidence in speaking English

## ✨ Features

### Core Features
- 🎯 **Conversational AI Tutor** - Powered by local Ollama (supports various models)
- 🎤 **Voice Input** - Speak naturally using Web Speech API
- 🔊 **Text-to-Speech** - Hear responses with natural voice
- 💬 **Real-time Chat** - Interactive conversation interface
- 🎨 **Animated Avatar** - Realistic character with lip-sync animation
- 🧠 **Context Awareness** - Maintains conversation flow and history
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

### Technical Features
- ⚡ Fast and responsive
- 🔒 Privacy-focused (runs locally)
- 🐳 Docker containerized
- 🎨 Beautiful Bootstrap UI
- 🔄 Real-time feedback
- 💾 Database ready for user progress tracking

## 🎬 Demo

The AI tutor:
1. **Greets you** warmly and starts a natural conversation
2. **Asks engaging questions** about various topics (hobbies, daily life, opinions)
3. **Listens to your responses** using voice recognition
4. **Provides constructive feedback** on grammar, vocabulary, and expression
5. **Keeps the conversation flowing** with follow-up questions

*The avatar features realistic lip-sync animation that matches the spoken words!*

## 🚀 Quick Start

Get up and running in 5 minutes!

### Prerequisites
- [Docker](https://www.docker.com/get-started) & Docker Compose
- [Ollama](https://ollama.ai) installed locally
- Modern web browser (Chrome, Edge, or Safari recommended)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR-USERNAME/ai-tutor.git
cd ai-tutor

# 2. Install and start Ollama
ollama serve
ollama pull llama2  # or mistral, neural-chat, etc.

# 3. Configure environment
cp .env.example .env
# Edit .env and set OLLAMA_MODEL to your model name

# 4. Start the application
docker-compose up --build

# 5. Open your browser
# Navigate to http://localhost:3000
```

**That's it!** Click "Start Conversation" and begin practicing English! 🎉

> **Note:** See [SETUP.md](SETUP.md) for detailed installation instructions and troubleshooting.

## Development

### Running Locally (Without Docker)

```bash
cd backend
npm install
npm run dev
```

Then open `frontend/index.html` in your browser or serve it with a local server.

### Project Structure

```
ai-tutor/
├── backend/
│   ├── src/
│   │   ├── server.js           # Express app entry point
│   │   ├── routes/
│   │   │   └── chat.js         # Chat API endpoints
│   │   ├── services/
│   │   │   ├── ollama.js       # Ollama AI service
│   │   │   └── conversationManager.js
│   │   ├── models/
│   │   │   └── conversation.js
│   │   └── config/
│   │       └── database.js     # Postgres connection
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
└── docker-compose.yml
```

## 💡 How to Use

1. **Start Conversation** - Click the blue button to begin
2. **Enable Microphone** - Allow browser access when prompted
3. **Speak Naturally** - Click the microphone and speak in English
4. **Get Feedback** - The tutor will respond and help you improve
5. **Keep Talking** - Continue the conversation to practice more!

**Tips for Best Results:**
- 🎯 Speak clearly and naturally
- 📝 Use complete sentences when possible
- 💪 Don't worry about mistakes - that's how you learn!
- ⏰ Practice regularly, even just 10 minutes daily
- 🗣️ Try different topics to expand vocabulary

## API Endpoints

### POST /api/chat
Send a message to the AI tutor and get a response.

**Request:**
```json
{
  "message": "Hello, I want to learn English",
  "conversationId": "optional-session-id"
}
```

**Response:**
```json
{
  "response": "AI tutor's response",
  "conversationId": "session-id"
}
```


## ⚙️ Configuration

### Environment Variables

All configuration is done via the `.env` file. See `.env.example` for all available options.

| Variable | Description | Default |
|----------|-------------|---------|
| `OLLAMA_MODEL` | AI model name | llama2 |
| `OLLAMA_BASE_URL` | Ollama API URL | http://host.docker.internal:11434 |
| `PORT` | Server port | 3000 |
| `DB_HOST` | Database host (optional) | - |

**Key Configuration:**
```env
OLLAMA_MODEL=llama2  # Change to your preferred model
```

## 🔧 Troubleshooting

### Common Issues

<details>
<summary><b>❌ "Cannot connect to Ollama"</b></summary>

```bash
# Make sure Ollama is running
ollama serve

# Verify model is installed
ollama list

# Test connection
curl http://localhost:11434/api/tags
```
</details>

<details>
<summary><b>🎤 Microphone not working</b></summary>

- Use Chrome, Edge, or Safari (best support)
- Allow microphone permissions when prompted
- Must use `localhost` or HTTPS
- Check browser console for error messages
</details>

<details>
<summary><b>🐳 Docker issues</b></summary>

```bash
# View logs
docker-compose logs -f

# Full rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up

# Complete reset
docker-compose down -v
```
</details>

> For more troubleshooting help, see [SETUP.md](SETUP.md)

## 🛠️ Technology Stack

<table>
<tr>
<td>

**Frontend**
- HTML5, CSS3, JavaScript
- Bootstrap 5.3
- Web Speech API
- SVG Animations

</td>
<td>

**Backend**
- Node.js 18
- Express.js 4
- Axios
- PostgreSQL

</td>
<td>

**AI & DevOps**
- Ollama (Local AI)
- Docker & Compose
- Git

</td>
</tr>
</table>

## 📚 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get running in 5 minutes
- **[Setup Guide](SETUP.md)** - Detailed installation and configuration
- **[Architecture](ARCHITECTURE.md)** - Technical documentation and design decisions

## 🤝 Contributing

Contributions are welcome! This project is open for:

- 🐛 Bug reports and fixes
- ✨ Feature suggestions and implementations
- 📖 Documentation improvements
- 🎨 UI/UX enhancements
- 🌍 Translations and localization

**To contribute:**
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Roadmap

### Phase 1: MVP ✅
- [x] Basic conversational AI
- [x] Speech recognition and TTS
- [x] Simple avatar animation
- [x] Docker setup
- [x] Database schema

### Phase 2: User Features (Planned)
- [ ] User authentication (Gmail OAuth)
- [ ] User profiles
- [ ] Conversation history
- [ ] Progress tracking
- [ ] Topic selection

### Phase 3: Advanced Features (Planned)
- [ ] Pronunciation scoring
- [ ] Grammar exercises
- [ ] Vocabulary builder
- [ ] Achievement system
- [ ] Social features (leaderboard)

### Phase 4: Production (Planned)
- [ ] Replace Ollama with cloud AI
- [ ] Production deployment
- [ ] CI/CD pipeline
- [ ] Monitoring and analytics
- [ ] Mobile app

## Technology Stack Summary

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5.3
- Web Speech API

**Backend:**
- Node.js 18
- Express.js 4
- Axios (HTTP client)

**AI/ML:**
- Ollama (local development)
- Configurable models (Llama2, Mistral, etc.)

**Database:**
- PostgreSQL (Render.com)
- pg (Node.js driver)

**DevOps:**
- Docker & Docker Compose
- Git

## Performance Notes

- Average response time: 2-5 seconds (depends on Ollama model)
- Speech recognition latency: ~500ms
- TTS latency: ~200ms
- Memory usage: ~100MB (backend) + model size
- Recommended: 8GB RAM minimum for running Ollama

## Browser Compatibility

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| UI | ✅ | ✅ | ✅ | ✅ |
| Speech Recognition | ✅ | ✅ | ✅ | ⚠️ |
| Text-to-Speech | ✅ | ✅ | ✅ | ✅ |

⚠️ Firefox has limited Web Speech API support

## Resources

- [Ollama Documentation](https://ollama.ai)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Express.js Guide](https://expressjs.com/)
- [Bootstrap Documentation](https://getbootstrap.com/)
- [Docker Documentation](https://docs.docker.com/)

## 🗺️ Roadmap

### Phase 1: MVP ✅
- [x] Basic conversational AI
- [x] Speech recognition and TTS
- [x] Animated avatar with lip-sync
- [x] Docker setup
- [x] Database schema

### Phase 2: User Features (Coming Soon)
- [ ] User authentication (Gmail OAuth)
- [ ] Save conversation history
- [ ] Track learning progress
- [ ] Select conversation topics
- [ ] Difficulty level adjustment

### Phase 3: Advanced Features (Planned)
- [ ] Pronunciation scoring
- [ ] Grammar exercises
- [ ] Vocabulary builder
- [ ] Achievement system
- [ ] Mobile app version

## ⚠️ Known Issues & Limitations

- Speech recognition works best in Chrome and Edge
- Requires microphone access (HTTPS or localhost)
- Ollama models run locally (need sufficient RAM)
- Database is optional for MVP

## 📊 Browser Compatibility

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| UI | ✅ | ✅ | ✅ | ✅ |
| Speech Recognition | ✅ | ✅ | ✅ | ⚠️ Limited |
| Text-to-Speech | ✅ | ✅ | ✅ | ✅ |
| Overall Experience | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai) - For making local AI accessible
- [Bootstrap](https://getbootstrap.com/) - For the beautiful UI framework
- Web Speech API - For voice capabilities
- The open-source community

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/YOUR-USERNAME/ai-tutor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR-USERNAME/ai-tutor/discussions)
- **Documentation**: See [SETUP.md](SETUP.md) and [ARCHITECTURE.md](ARCHITECTURE.md)

## ⭐ Show Your Support

If you find this project helpful, please consider giving it a star ⭐ on GitHub!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for English learners worldwide**

[⬆ Back to Top](#-ai-english-language-tutor)

</div>

