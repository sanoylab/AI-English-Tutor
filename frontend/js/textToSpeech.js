// Text-to-Speech Module using Web Speech API
class TextToSpeechManager {
    constructor() {
        this.synth = window.speechSynthesis;
        this.isSpeaking = false;
        this.currentUtterance = null;
        this.voices = [];
        this.selectedVoice = null;
        this.onStartCallback = null;
        this.onEndCallback = null;
        this.onErrorCallback = null;
        
        this.init();
    }

    // Initialize TTS and load voices
    init() {
        if (!this.synth) {
            console.error('Speech Synthesis not supported in this browser');
            return false;
        }

        // Load voices
        this.loadVoices();

        // Chrome loads voices asynchronously
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {
                this.loadVoices();
            };
        }

        return true;
    }

    // Load available voices
    loadVoices() {
        this.voices = this.synth.getVoices();
        
        // Try to find a good English voice
        const preferredVoices = [
            'Google US English',
            'Microsoft David',
            'Microsoft Mark',
            'Alex',
            'Samantha',
            'Daniel',
            'Karen'
        ];

        // Find first available preferred voice
        for (const voiceName of preferredVoices) {
            const voice = this.voices.find(v => 
                v.name.includes(voiceName) || 
                (v.lang.startsWith('en') && v.name.includes(voiceName))
            );
            if (voice) {
                this.selectedVoice = voice;
                console.log('Selected voice:', voice.name);
                break;
            }
        }

        // Fallback to any English voice
        if (!this.selectedVoice) {
            this.selectedVoice = this.voices.find(v => v.lang.startsWith('en'));
        }

        // Last resort: use first available voice
        if (!this.selectedVoice && this.voices.length > 0) {
            this.selectedVoice = this.voices[0];
        }

        console.log('Available voices:', this.voices.length);
        if (this.selectedVoice) {
            console.log('Using voice:', this.selectedVoice.name, '(', this.selectedVoice.lang, ')');
        }
    }

    // Speak text
    speak(text, options = {}) {
        if (!this.synth) {
            console.error('Speech synthesis not available');
            return false;
        }

        // Cancel any ongoing speech
        this.cancel();

        if (!text || text.trim().length === 0) {
            console.warn('No text to speak');
            return false;
        }

        // Create utterance
        this.currentUtterance = new SpeechSynthesisUtterance(text);
        
        // Set voice
        if (this.selectedVoice) {
            this.currentUtterance.voice = this.selectedVoice;
        }

        // Set options with defaults
        this.currentUtterance.rate = options.rate || 0.9; // Slightly slower for clarity
        this.currentUtterance.pitch = options.pitch || 1.0;
        this.currentUtterance.volume = options.volume || 1.0;
        this.currentUtterance.lang = options.lang || 'en-US';

        // Event listeners
        this.currentUtterance.onstart = () => {
            console.log('Started speaking:', text.substring(0, 50) + '...');
            this.isSpeaking = true;
            if (this.onStartCallback) {
                this.onStartCallback();
            }
        };

        this.currentUtterance.onend = () => {
            console.log('Finished speaking');
            this.isSpeaking = false;
            this.currentUtterance = null;
            if (this.onEndCallback) {
                this.onEndCallback();
            }
        };

        this.currentUtterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            this.isSpeaking = false;
            this.currentUtterance = null;
            if (this.onErrorCallback) {
                this.onErrorCallback(event.error);
            }
        };

        // Speak
        try {
            this.synth.speak(this.currentUtterance);
            return true;
        } catch (error) {
            console.error('Failed to speak:', error);
            this.isSpeaking = false;
            return false;
        }
    }

    // Cancel current speech
    cancel() {
        if (this.synth && this.synth.speaking) {
            this.synth.cancel();
            this.isSpeaking = false;
            this.currentUtterance = null;
        }
    }

    // Pause speech
    pause() {
        if (this.synth && this.synth.speaking && !this.synth.paused) {
            this.synth.pause();
        }
    }

    // Resume speech
    resume() {
        if (this.synth && this.synth.paused) {
            this.synth.resume();
        }
    }

    // Check if currently speaking
    getIsSpeaking() {
        return this.isSpeaking || (this.synth && this.synth.speaking);
    }

    // Check if supported
    isSupported() {
        return !!this.synth;
    }

    // Get available voices
    getVoices() {
        return this.voices.filter(v => v.lang.startsWith('en'));
    }

    // Set voice by name
    setVoice(voiceName) {
        const voice = this.voices.find(v => v.name === voiceName);
        if (voice) {
            this.selectedVoice = voice;
            console.log('Voice changed to:', voice.name);
            return true;
        }
        return false;
    }

    // Set callback for start
    onStart(callback) {
        this.onStartCallback = callback;
    }

    // Set callback for end
    onEnd(callback) {
        this.onEndCallback = callback;
    }

    // Set callback for error
    onError(callback) {
        this.onErrorCallback = callback;
    }
}

// Export for use in other scripts
window.TextToSpeechManager = TextToSpeechManager;

