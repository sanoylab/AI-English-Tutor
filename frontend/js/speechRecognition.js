// Speech Recognition Module using Web Speech API
class SpeechRecognitionManager {
    constructor() {
        // Check browser support
        this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = null;
        this.isListening = false;
        this.onResultCallback = null;
        this.onErrorCallback = null;
        this.onStartCallback = null;
        this.onEndCallback = null;
        
        this.init();
    }

    // Initialize speech recognition
    init() {
        if (!this.SpeechRecognition) {
            console.error('Speech Recognition not supported in this browser');
            return false;
        }

        this.recognition = new this.SpeechRecognition();
        this.recognition.continuous = false; // Stop after one sentence
        this.recognition.interimResults = true; // Get results while speaking
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 1;

        this.setupEventListeners();
        return true;
    }

    // Setup event listeners
    setupEventListeners() {
        if (!this.recognition) return;

        // When speech recognition starts
        this.recognition.onstart = () => {
            console.log('Speech recognition started');
            this.isListening = true;
            if (this.onStartCallback) {
                this.onStartCallback();
            }
        };

        // When speech recognition results are received
        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            if (this.onResultCallback) {
                this.onResultCallback({
                    final: finalTranscript,
                    interim: interimTranscript,
                    isFinal: finalTranscript.length > 0
                });
            }
        };

        // When speech recognition ends
        this.recognition.onend = () => {
            console.log('Speech recognition ended');
            this.isListening = false;
            if (this.onEndCallback) {
                this.onEndCallback();
            }
        };

        // Handle errors
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            
            let errorMessage = 'Speech recognition error';
            
            switch (event.error) {
                case 'no-speech':
                    errorMessage = 'No speech detected. Please try again.';
                    break;
                case 'audio-capture':
                    errorMessage = 'Microphone not found. Please check your device.';
                    break;
                case 'not-allowed':
                    errorMessage = 'Microphone access denied. Please allow microphone access.';
                    break;
                case 'network':
                    errorMessage = 'Network error. Please check your connection.';
                    break;
                case 'aborted':
                    errorMessage = 'Speech recognition aborted.';
                    break;
            }

            if (this.onErrorCallback) {
                this.onErrorCallback(errorMessage);
            }
        };
    }

    // Start listening
    start() {
        if (!this.recognition) {
            console.error('Speech recognition not initialized');
            return false;
        }

        if (this.isListening) {
            console.warn('Already listening');
            return false;
        }

        try {
            this.recognition.start();
            return true;
        } catch (error) {
            console.error('Failed to start speech recognition:', error);
            if (this.onErrorCallback) {
                this.onErrorCallback('Failed to start listening. Please try again.');
            }
            return false;
        }
    }

    // Stop listening
    stop() {
        if (!this.recognition || !this.isListening) {
            return;
        }

        try {
            this.recognition.stop();
        } catch (error) {
            console.error('Failed to stop speech recognition:', error);
        }
    }

    // Check if supported
    isSupported() {
        return !!this.SpeechRecognition;
    }

    // Set callback for results
    onResult(callback) {
        this.onResultCallback = callback;
    }

    // Set callback for errors
    onError(callback) {
        this.onErrorCallback = callback;
    }

    // Set callback for start
    onStart(callback) {
        this.onStartCallback = callback;
    }

    // Set callback for end
    onEnd(callback) {
        this.onEndCallback = callback;
    }

    // Get listening status
    getIsListening() {
        return this.isListening;
    }
}

// Export for use in other scripts
window.SpeechRecognitionManager = SpeechRecognitionManager;

