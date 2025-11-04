// Main Application Controller
class EnglishTutorApp {
    constructor() {
        // API Configuration
        // Use environment variable or default to localhost:3000
        this.apiBaseUrl = window.API_BASE_URL || 'http://localhost:3000';
        this.conversationId = null;
        this.isConversationActive = false;

        // Initialize managers
        this.avatarAnimator = new AvatarAnimator('avatar');
        this.speechRecognition = new SpeechRecognitionManager();
        this.textToSpeech = new TextToSpeechManager();

        // DOM Elements
        this.elements = {
            // Buttons
            startBtn: document.getElementById('start-btn'),
            stopBtn: document.getElementById('stop-btn'),
            clearBtn: document.getElementById('clear-btn'),
            micBtn: document.getElementById('mic-btn'),
            sendBtn: document.getElementById('send-btn'),
            
            // Input
            textInput: document.getElementById('text-input'),
            inputStatus: document.getElementById('input-status'),
            
            // Chat
            chatMessages: document.getElementById('chat-messages'),
            
            // Avatar
            avatarContainer: document.getElementById('avatar-container'),
            avatarStatus: document.getElementById('avatar-status'),
            
            // Status
            statusIndicator: document.getElementById('status-indicator'),
            loadingOverlay: document.getElementById('loading-overlay')
        };

        this.init();
    }

    // Initialize application
    init() {
        console.log('Initializing AI English Tutor...');

        // Check browser support
        if (!this.speechRecognition.isSupported()) {
            this.showError('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
        }

        if (!this.textToSpeech.isSupported()) {
            this.showError('Text-to-speech is not supported in your browser.');
        }

        // Setup event listeners
        this.setupEventListeners();
        this.setupSpeechCallbacks();

        console.log('App initialized successfully');
    }

    // Setup event listeners for buttons and inputs
    setupEventListeners() {
        // Start conversation
        this.elements.startBtn.addEventListener('click', () => {
            this.startConversation();
        });

        // Stop conversation
        this.elements.stopBtn.addEventListener('click', () => {
            this.stopConversation();
        });

        // Clear chat
        this.elements.clearBtn.addEventListener('click', () => {
            this.clearChat();
        });

        // Microphone button
        this.elements.micBtn.addEventListener('click', () => {
            this.toggleMicrophone();
        });

        // Send button
        this.elements.sendBtn.addEventListener('click', () => {
            this.sendTextMessage();
        });

        // Text input - press Enter to send
        this.elements.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendTextMessage();
            }
        });
    }

    // Setup callbacks for speech recognition and TTS
    setupSpeechCallbacks() {
        // Speech Recognition callbacks
        this.speechRecognition.onStart(() => {
            console.log('Listening started');
            this.elements.micBtn.classList.add('listening');
            this.elements.inputStatus.innerHTML = '<i class="bi bi-mic-fill"></i> Listening... Speak now!';
            this.setAvatarState('listening');
        });

        this.speechRecognition.onEnd(() => {
            console.log('Listening ended');
            this.elements.micBtn.classList.remove('listening');
            this.elements.inputStatus.innerHTML = '<i class="bi bi-info-circle"></i> Click microphone to speak';
            this.setAvatarState('idle');
        });

        this.speechRecognition.onResult((result) => {
            // Show interim results in input
            if (result.interim) {
                this.elements.textInput.value = result.interim;
            }
            
            // Process final result
            if (result.isFinal && result.final.trim().length > 0) {
                this.elements.textInput.value = result.final;
                this.sendTextMessage();
            }
        });

        this.speechRecognition.onError((error) => {
            console.error('Speech recognition error:', error);
            this.showNotification(error, 'danger');
            this.elements.micBtn.classList.remove('listening');
            this.setAvatarState('idle');
        });

        // Text-to-Speech callbacks
        this.textToSpeech.onStart(() => {
            console.log('Speaking started');
            this.setAvatarState('speaking');
        });

        this.textToSpeech.onEnd(() => {
            console.log('Speaking ended');
            this.setAvatarState('idle');
        });

        this.textToSpeech.onError((error) => {
            console.error('Text-to-speech error:', error);
            this.setAvatarState('idle');
        });
    }

    // Start a new conversation
    async startConversation() {
        try {
            this.showLoading(true);
            this.elements.startBtn.disabled = true;

            // Call API to start conversation
            const response = await fetch(`${this.apiBaseUrl}/api/chat/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Failed to start conversation');
            }

            const data = await response.json();
            this.conversationId = data.conversationId;
            this.isConversationActive = true;

            // Update UI
            this.elements.startBtn.classList.add('d-none');
            this.elements.stopBtn.classList.remove('d-none');
            this.enableInputs();
            this.updateStatus('Active', 'success');

            // Clear chat area
            this.elements.chatMessages.innerHTML = '';

            // Display greeting
            this.addMessage('assistant', data.greeting);

            // Speak greeting
            this.textToSpeech.speak(data.greeting);

            this.showNotification('Conversation started! Feel free to speak or type.', 'success');

        } catch (error) {
            console.error('Error starting conversation:', error);
            this.showNotification('Failed to start conversation. Please ensure the backend is running.', 'danger');
            this.elements.startBtn.disabled = false;
        } finally {
            this.showLoading(false);
        }
    }

    // Stop conversation
    stopConversation() {
        this.isConversationActive = false;
        this.conversationId = null;

        // Cancel any ongoing speech
        this.textToSpeech.cancel();
        this.speechRecognition.stop();

        // Update UI
        this.elements.stopBtn.classList.add('d-none');
        this.elements.startBtn.classList.remove('d-none');
        this.elements.startBtn.disabled = false;
        this.disableInputs();
        this.updateStatus('Stopped', 'secondary');
        this.setAvatarState('idle');

        this.showNotification('Conversation stopped', 'info');
    }

    // Toggle microphone on/off
    toggleMicrophone() {
        if (this.speechRecognition.getIsListening()) {
            this.speechRecognition.stop();
        } else {
            // Cancel TTS if speaking
            if (this.textToSpeech.getIsSpeaking()) {
                this.textToSpeech.cancel();
            }
            this.speechRecognition.start();
        }
    }

    // Send text message
    async sendTextMessage() {
        const message = this.elements.textInput.value.trim();

        if (!message || !this.isConversationActive) {
            return;
        }

        // Clear input
        this.elements.textInput.value = '';

        // Add user message to chat
        this.addMessage('user', message);

        // Send to backend
        await this.sendMessageToAI(message);
    }

    // Send message to AI backend
    async sendMessageToAI(message) {
        try {
            this.showLoading(true);
            this.setAvatarState('thinking');
            this.disableInputs();

            const response = await fetch(`${this.apiBaseUrl}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    conversationId: this.conversationId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response from AI');
            }

            const data = await response.json();

            // Update conversation ID
            this.conversationId = data.conversationId;

            // Add AI response to chat
            this.addMessage('assistant', data.response);

            // Speak response
            this.textToSpeech.speak(data.response);

        } catch (error) {
            console.error('Error communicating with AI:', error);
            this.showNotification('Failed to get response. Please check if Ollama is running.', 'danger');
            this.setAvatarState('idle');
        } finally {
            this.showLoading(false);
            this.enableInputs();
        }
    }

    // Add message to chat
    addMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;

        const label = role === 'user' ? 'You' : 'Tutor';
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageDiv.innerHTML = `
            <div class="message-label">${label}</div>
            <div class="message-content">${this.escapeHtml(content)}</div>
            <div class="message-time">${time}</div>
        `;

        this.elements.chatMessages.appendChild(messageDiv);

        // Scroll to bottom
        this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
    }

    // Clear chat
    async clearChat() {
        if (!confirm('Are you sure you want to clear the chat?')) {
            return;
        }

        if (this.conversationId) {
            try {
                await fetch(`${this.apiBaseUrl}/api/chat/${this.conversationId}`, {
                    method: 'DELETE'
                });
            } catch (error) {
                console.error('Error clearing chat on server:', error);
            }
        }

        this.elements.chatMessages.innerHTML = `
            <div class="text-center text-muted py-5">
                <i class="bi bi-chat-square-dots" style="font-size: 3rem;"></i>
                <p class="mt-2">Chat cleared. Click "Start Conversation" to begin!</p>
            </div>
        `;

        this.stopConversation();
        this.showNotification('Chat cleared', 'info');
    }

    // Set avatar state (idle, listening, speaking, thinking)
    setAvatarState(state) {
        // Update avatar animator
        if (this.avatarAnimator) {
            this.avatarAnimator.setState(state);
        }
        
        // Update container classes for CSS animations
        this.elements.avatarContainer.className = 'avatar-container';
        
        switch (state) {
            case 'listening':
                this.elements.avatarContainer.classList.add('listening');
                this.elements.avatarStatus.textContent = 'Listening...';
                break;
            case 'speaking':
                this.elements.avatarContainer.classList.add('speaking');
                this.elements.avatarStatus.textContent = 'Speaking...';
                break;
            case 'thinking':
                this.elements.avatarContainer.classList.add('thinking');
                this.elements.avatarStatus.textContent = 'Thinking...';
                break;
            default:
                this.elements.avatarStatus.textContent = 'Idle';
        }
    }

    // Enable inputs
    enableInputs() {
        this.elements.micBtn.disabled = false;
        this.elements.sendBtn.disabled = false;
        this.elements.textInput.disabled = false;
        this.elements.inputStatus.innerHTML = '<i class="bi bi-info-circle"></i> Click microphone to speak or type your message';
    }

    // Disable inputs
    disableInputs() {
        this.elements.micBtn.disabled = true;
        this.elements.sendBtn.disabled = true;
        this.elements.textInput.disabled = true;
        this.elements.inputStatus.innerHTML = '<i class="bi bi-info-circle"></i> Start a conversation to enable input';
    }

    // Update status indicator
    updateStatus(text, type) {
        this.elements.statusIndicator.textContent = text;
        this.elements.statusIndicator.className = `badge bg-${type}`;
    }

    // Show/hide loading overlay
    showLoading(show) {
        if (show) {
            this.elements.loadingOverlay.classList.remove('d-none');
        } else {
            this.elements.loadingOverlay.classList.add('d-none');
        }
    }

    // Show notification (temporary message)
    showNotification(message, type = 'info') {
        // Create toast-like notification
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 10000; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Show error message
    showError(message) {
        console.error(message);
        this.showNotification(message, 'danger');
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    window.app = new EnglishTutorApp();
});

