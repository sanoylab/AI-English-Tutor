# AI English Tutor - Setup Guide

Complete step-by-step guide to get your AI English Tutor running locally.

## Prerequisites Checklist

Before you begin, ensure you have:

- [ ] Docker and Docker Compose installed
- [ ] Ollama installed on your machine
- [ ] PostgreSQL database (Render.com or local)
- [ ] Modern web browser (Chrome/Edge/Safari)

## Step 1: Install Ollama

### macOS
```bash
brew install ollama
```

### Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Windows
Download from [ollama.ai](https://ollama.ai)

## Step 2: Download AI Model

```bash
# Start Ollama service
ollama serve

# In a new terminal, pull a model (choose one):
ollama pull llama2          # Good balance (3.8GB)
ollama pull mistral         # Fast and capable (4.1GB)
ollama pull llama2:13b      # More capable (7.4GB)
ollama pull neural-chat     # Optimized for chat (4.1GB)

# Verify model is available
ollama list
```

## Step 3: Setup PostgreSQL Database

### Option A: Using Render.com (Recommended for Production)

1. Go to [render.com](https://render.com) and sign up
2. Create a new PostgreSQL database
3. Copy the connection details (host, port, database name, user, password)
4. Keep these details for the next step

### Option B: Local PostgreSQL

```bash
# macOS
brew install postgresql
brew services start postgresql
createdb ai_tutor

# Linux
sudo apt install postgresql
sudo service postgresql start
sudo -u postgres createdb ai_tutor
```

## Step 4: Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your favorite editor
nano .env
```

Update the following values in `.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Ollama Configuration
OLLAMA_BASE_URL=http://host.docker.internal:11434
OLLAMA_MODEL=llama2    # Use the model you downloaded

# PostgreSQL Database Configuration
DB_HOST=your-render-postgres-host.render.com
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
```

## Step 5: Initialize Database (Optional - for future features)

```bash
# Connect to your PostgreSQL database and run the schema
# If using Render.com, use their web SQL console
# If local:
psql -d ai_tutor -f database/schema.sql

# Or copy the contents of database/schema.sql and paste into Render's SQL editor
```

Note: The MVP works without database setup, but having the schema ready prepares for future features.

## Step 6: Build and Run with Docker

```bash
# Make sure you're in the project root
cd ai-tutor

# Build and start the container
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

You should see output like:
```
=================================
🚀 AI English Tutor Backend
📡 Server running on port 3000
🌍 Environment: development
🤖 Ollama: http://host.docker.internal:11434
📝 Model: llama2
=================================
```

## Step 7: Access the Application

Open your web browser and navigate to:
```
http://localhost:3000
```

## Step 8: Test the Application

1. Click "Start Conversation"
2. The AI tutor should greet you (listen to the voice)
3. Click the microphone button (allow browser microphone access)
4. Say something in English (e.g., "Hello, my name is John")
5. Wait for the AI to respond with feedback

## Troubleshooting

### Issue: "Cannot connect to Ollama"

**Solution:**
```bash
# Check if Ollama is running
ps aux | grep ollama

# If not running, start it:
ollama serve

# Check if model is available:
ollama list

# Test Ollama directly:
curl http://localhost:11434/api/tags
```

### Issue: "Microphone not working"

**Solutions:**
- Make sure you're using HTTPS or localhost
- Check browser permissions (click the lock icon in address bar)
- Try Chrome or Edge (best Web Speech API support)
- Check your system microphone settings

### Issue: "Speech recognition error: not-allowed"

**Solution:**
- Browser needs microphone permission
- Go to browser settings → Privacy → Microphone
- Allow access for localhost

### Issue: "Database connection failed"

**Solution:**
- Verify database credentials in `.env`
- Check if database is accessible from your network
- For Render.com, check if IP is whitelisted (usually not needed)
- Note: Database is optional for MVP functionality

### Issue: Docker container won't start

**Solution:**
```bash
# Check Docker logs
docker-compose logs

# Restart Docker service
# macOS/Windows: Restart Docker Desktop
# Linux:
sudo systemctl restart docker

# Rebuild without cache
docker-compose build --no-cache
docker-compose up
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process (replace PID)
kill -9 <PID>

# Or change port in .env
PORT=3001
```

## Development Mode (Without Docker)

If you prefer to run without Docker for development:

```bash
# Install dependencies
cd backend
npm install

# Start the server
npm run dev

# In another terminal, serve the frontend
# You can use any static file server
cd frontend
python3 -m http.server 8000

# Or use Node's http-server
npx http-server -p 8000
```

Then access:
- Backend API: http://localhost:3000
- Frontend: http://localhost:8000

## Stopping the Application

```bash
# If running in foreground
Ctrl+C

# If running in background
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Next Steps

Once everything is running:

1. Practice conversations with the AI tutor
2. Try different English topics
3. Notice how the tutor provides feedback
4. Experiment with different difficulty levels

## Getting the Most Out of the Tutor

**Tips for better learning:**
- Speak clearly and naturally
- Try to form complete sentences
- Ask the tutor questions too
- Don't be afraid to make mistakes
- Practice regularly (even 10 minutes daily helps)

**Good conversation starters:**
- "Tell me about your favorite hobby"
- "What did you do yesterday?"
- "Do you prefer coffee or tea? Why?"
- "What's your opinion on social media?"

## Future Features (Coming Soon)

- User authentication with Gmail
- Progress tracking and analytics
- Difficulty level selection
- Topic-specific conversations
- Pronunciation scoring
- Grammar exercises
- Conversation history

## Need Help?

- Check the main README.md
- Review Ollama docs: https://ollama.ai
- Check Docker docs: https://docs.docker.com

Happy learning! 🎉

