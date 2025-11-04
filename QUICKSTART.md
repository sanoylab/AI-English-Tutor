# Quick Start Guide

Get your AI English Tutor running in 5 minutes!

## Prerequisites

- Docker installed
- Ollama installed

## 1. Install & Setup Ollama

```bash
# Install Ollama (macOS)
brew install ollama

# Start Ollama service
ollama serve

# In a new terminal, download a model
ollama pull llama2

# Verify
ollama list
```

## 2. Configure Environment

```bash
cd ai-tutor

# Copy environment template
cp .env.example .env

# Edit .env and update these essential values:
# OLLAMA_MODEL=llama2 (or your downloaded model)
# Database settings (if you have them)
nano .env
```

## 3. Run the Application

```bash
# Build and start with Docker
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

## 4. Access the App

Open your browser:
```
http://localhost:3000
```

## 5. Test It Out

1. Click "Start Conversation"
2. Allow microphone access when prompted
3. Click the microphone button
4. Say "Hello, I want to practice English"
5. Wait for the AI tutor to respond!

## Common Commands

```bash
# View logs
docker-compose logs -f

# Stop the app
docker-compose down

# Restart the app
docker-compose restart

# Rebuild after changes
docker-compose up --build

# Check Ollama status
ollama list
curl http://localhost:11434/api/tags
```

## Troubleshooting

### Issue: Cannot connect to Ollama
```bash
# Make sure Ollama is running
ollama serve

# Check if model is downloaded
ollama list
```

### Issue: Port 3000 already in use
```bash
# Change port in .env
PORT=3001

# Or kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Issue: Microphone not working
- Use Chrome or Edge browser
- Allow microphone permissions
- Must use localhost or HTTPS

## What's Next?

- See [SETUP.md](SETUP.md) for detailed setup
- See [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- See [README.md](README.md) for full documentation

## Tips for Best Experience

1. Speak clearly and naturally
2. Use complete sentences
3. Let the tutor finish speaking before responding
4. Don't be afraid to make mistakes - that's how you learn!
5. Practice regularly, even just 10 minutes a day

Enjoy learning English! 🎉

