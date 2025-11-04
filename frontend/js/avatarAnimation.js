// Avatar Animation with Lip Sync
class AvatarAnimator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentState = 'idle';
        this.lipSyncInterval = null;
        this.blinkInterval = null;
        
        this.init();
    }

    init() {
        // Create SVG avatar
        this.createAvatar();
        this.startBlinking();
    }

    createAvatar() {
        const svg = `
            <svg class="human-avatar" viewBox="0 0 300 450" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <!-- Gradients for realistic 3D look -->
                    <radialGradient id="faceGradient" cx="50%" cy="40%">
                        <stop offset="0%" style="stop-color:#ffe5dc;stop-opacity:1" />
                        <stop offset="70%" style="stop-color:#ffd5cc;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#ffb8a8;stop-opacity:1" />
                    </radialGradient>
                    
                    <radialGradient id="hairGradient" cx="30%" cy="30%">
                        <stop offset="0%" style="stop-color:#9d6e3f;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#7a5230;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#5d3d24;stop-opacity:1" />
                    </radialGradient>
                    
                    <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#ff8eb3;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#ff6b9d;stop-opacity:1" />
                    </linearGradient>
                    
                    <radialGradient id="eyeGradient" cx="50%" cy="50%">
                        <stop offset="0%" style="stop-color:#a67c52;stop-opacity:1" />
                        <stop offset="60%" style="stop-color:#8b6947;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#6b4423;stop-opacity:1" />
                    </radialGradient>
                    
                    <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                        <feOffset dx="0" dy="2" result="offsetblur"/>
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.3"/>
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                
                <!-- Body and Shoulders with gradient -->
                <ellipse cx="150" cy="310" rx="95" ry="45" fill="url(#bodyGradient)" opacity="0.9"/>
                <rect x="55" y="310" width="190" height="140" fill="url(#bodyGradient)" rx="20"/>
                
                <!-- Arms with shading -->
                <ellipse cx="47" cy="360" rx="20" ry="70" fill="#ffd5cc"/>
                <ellipse cx="45" cy="360" rx="18" ry="68" fill="url(#faceGradient)"/>
                <ellipse cx="253" cy="360" rx="20" ry="70" fill="#ffd5cc"/>
                <ellipse cx="255" cy="360" rx="18" ry="68" fill="url(#faceGradient)"/>
                
                <!-- Neck with shadow -->
                <ellipse cx="150" cy="255" rx="25" ry="35" fill="url(#faceGradient)"/>
                <ellipse cx="150" cy="245" rx="22" ry="15" fill="#ffb8a8" opacity="0.3"/>
                
                <!-- Head with 3D gradient -->
                <ellipse cx="150" cy="150" rx="80" ry="95" fill="url(#faceGradient)" filter="url(#softShadow)"/>
                
                <!-- Face shading (cheekbones and jaw) -->
                <ellipse cx="100" cy="170" rx="25" ry="35" fill="#ffb8a8" opacity="0.15"/>
                <ellipse cx="200" cy="170" rx="25" ry="35" fill="#ffb8a8" opacity="0.15"/>
                <ellipse cx="150" cy="210" rx="35" ry="20" fill="#ffe5dc" opacity="0.3"/>
                
                <!-- Ears with detail -->
                <ellipse cx="72" cy="155" rx="14" ry="22" fill="#ffd5cc"/>
                <ellipse cx="74" cy="155" rx="12" ry="20" fill="url(#faceGradient)"/>
                <ellipse cx="76" cy="155" rx="6" ry="10" fill="#ffb8a8" opacity="0.5"/>
                <ellipse cx="228" cy="155" rx="14" ry="22" fill="#ffd5cc"/>
                <ellipse cx="226" cy="155" rx="12" ry="20" fill="url(#faceGradient)"/>
                <ellipse cx="224" cy="155" rx="6" ry="10" fill="#ffb8a8" opacity="0.5"/>
                
                <!-- Gold earrings with shine -->
                <circle cx="72" cy="172" r="7" fill="#FFD700"/>
                <circle cx="72" cy="172" r="6" fill="#FFA500" opacity="0.6"/>
                <circle cx="70" cy="170" r="2" fill="#FFFF99"/>
                <circle cx="228" cy="172" r="7" fill="#FFD700"/>
                <circle cx="228" cy="172" r="6" fill="#FFA500" opacity="0.6"/>
                <circle cx="226" cy="170" r="2" fill="#FFFF99"/>
                
                <!-- Hair - back layer with gradient -->
                <ellipse cx="150" cy="135" rx="88" ry="100" fill="url(#hairGradient)"/>
                <path d="M 65 100 Q 60 140, 70 200 Q 75 230, 80 250" 
                      fill="none" stroke="url(#hairGradient)" stroke-width="25" stroke-linecap="round"/>
                <path d="M 235 100 Q 240 140, 230 200 Q 225 230, 220 250" 
                      fill="none" stroke="url(#hairGradient)" stroke-width="25" stroke-linecap="round"/>
                
                <!-- Hair - front with volume -->
                <ellipse cx="150" cy="90" rx="82" ry="55" fill="url(#hairGradient)"/>
                <path d="M 75 100 Q 70 70, 150 60 Q 230 70, 225 100" fill="url(#hairGradient)"/>
                
                <!-- Hair strands for detail -->
                <path d="M 95 75 Q 90 85, 95 100" stroke="#5d3d24" stroke-width="3" fill="none" opacity="0.4"/>
                <path d="M 120 68 Q 115 80, 118 95" stroke="#5d3d24" stroke-width="3" fill="none" opacity="0.4"/>
                <path d="M 150 65 Q 148 78, 150 92" stroke="#5d3d24" stroke-width="3" fill="none" opacity="0.4"/>
                <path d="M 180 68 Q 178 80, 182 95" stroke="#5d3d24" stroke-width="3" fill="none" opacity="0.4"/>
                <path d="M 205 75 Q 202 85, 205 100" stroke="#5d3d24" stroke-width="3" fill="none" opacity="0.4"/>
                
                <!-- Eyebrows - realistic arch -->
                <path d="M 92 112 Q 115 105, 142 110" fill="none" stroke="#5d3d24" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
                <path d="M 158 110 Q 185 105, 208 112" fill="none" stroke="#5d3d24" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
                
                <!-- Eyes - detailed and expressive -->
                <g id="eyes">
                    <!-- Left Eye -->
                    <ellipse id="left-eye-white" cx="115" cy="138" rx="22" ry="26" fill="white"/>
                    <ellipse cx="115" cy="140" rx="22" ry="24" fill="white"/>
                    
                    <!-- Iris with gradient -->
                    <circle cx="115" cy="143" r="13" fill="url(#eyeGradient)"/>
                    <circle cx="115" cy="143" r="10" fill="#6b4423"/>
                    <circle cx="115" cy="143" r="6" fill="#3d2817"/>
                    
                    <!-- Sparkle/highlight -->
                    <circle cx="119" cy="139" r="5" fill="white" opacity="0.9"/>
                    <circle cx="112" cy="145" r="2" fill="white" opacity="0.6"/>
                    
                    <!-- Right Eye -->
                    <ellipse id="right-eye-white" cx="185" cy="138" rx="22" ry="26" fill="white"/>
                    <ellipse cx="185" cy="140" rx="22" ry="24" fill="white"/>
                    
                    <!-- Iris with gradient -->
                    <circle cx="185" cy="143" r="13" fill="url(#eyeGradient)"/>
                    <circle cx="185" cy="143" r="10" fill="#6b4423"/>
                    <circle cx="185" cy="143" r="6" fill="#3d2817"/>
                    
                    <!-- Sparkle/highlight -->
                    <circle cx="189" cy="139" r="5" fill="white" opacity="0.9"/>
                    <circle cx="182" cy="145" r="2" fill="white" opacity="0.6"/>
                    
                    <!-- Upper eyelids with shadow -->
                    <path d="M 93 132 Q 115 128, 137 132" fill="none" stroke="#ffb8a8" stroke-width="2" opacity="0.5"/>
                    <path d="M 163 132 Q 185 128, 207 132" fill="none" stroke="#ffb8a8" stroke-width="2" opacity="0.5"/>
                    
                    <!-- Eyelashes - detailed -->
                    <path d="M 95 127 Q 93 122, 94 118 M 102 125 Q 100 120, 101 115 M 109 124 Q 107 119, 108 114 M 116 124 Q 114 119, 115 114 M 123 125 Q 121 120, 122 115 M 130 127 Q 128 122, 129 118" 
                          stroke="#3d2817" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
                    <path d="M 205 127 Q 207 122, 206 118 M 198 125 Q 200 120, 199 115 M 191 124 Q 193 119, 192 114 M 184 124 Q 186 119, 185 114 M 177 125 Q 179 120, 178 115 M 170 127 Q 172 122, 171 118" 
                          stroke="#3d2817" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
                    
                    <!-- Eyelids for blinking -->
                    <ellipse id="left-eyelid" cx="115" cy="126" rx="22" ry="0" fill="url(#faceGradient)"/>
                    <ellipse id="right-eyelid" cx="185" cy="126" rx="22" ry="0" fill="url(#faceGradient)"/>
                </g>
                
                <!-- Nose with shading -->
                <path d="M 150 155 Q 148 172, 145 178" fill="none" stroke="#ffb8a8" stroke-width="2" opacity="0.4"/>
                <ellipse cx="145" cy="180" rx="3" ry="4" fill="#ffb8a8" opacity="0.3"/>
                <ellipse cx="155" cy="180" rx="3" ry="4" fill="#ffb8a8" opacity="0.3"/>
                <path d="M 148 178 L 152 178" fill="none" stroke="#ffb8a8" stroke-width="1.5"/>
                
                <!-- Rosy cheeks with gradient -->
                <ellipse cx="100" cy="168" rx="20" ry="15" fill="#ff9eb3" opacity="0.35"/>
                <ellipse cx="200" cy="168" rx="20" ry="15" fill="#ff9eb3" opacity="0.35"/>
                
                <!-- Mouth with realistic lips -->
                <g id="mouth-container">
                    <!-- Smile (idle) -->
                    <g id="mouth-smile" opacity="1">
                        <path d="M 118 198 Q 150 212, 182 198" fill="#c41e3a" opacity="0.8"/>
                        <path d="M 120 195 Q 150 208, 180 195" fill="#dc143c"/>
                        <path d="M 122 194 Q 150 205, 178 194" fill="#ff6b7a" opacity="0.5"/>
                        <ellipse cx="135" cy="196" rx="4" ry="2" fill="white" opacity="0.3"/>
                    </g>
                    
                    <!-- Talking -->
                    <g id="mouth-talking" opacity="0">
                        <ellipse cx="150" cy="202" rx="24" ry="18" fill="#8b1538"/>
                        <ellipse cx="150" cy="200" rx="22" ry="16" fill="#dc143c"/>
                        <ellipse cx="150" cy="199" rx="18" ry="13" fill="#ff6b9d"/>
                        <rect x="137" y="194" width="26" height="9" fill="white" rx="2"/>
                        <path d="M 128 195 Q 150 200, 172 195" fill="#ff6b7a" opacity="0.5"/>
                    </g>
                    
                    <!-- Wide -->
                    <g id="mouth-wide" opacity="0">
                        <ellipse cx="150" cy="202" rx="30" ry="20" fill="#8b1538"/>
                        <ellipse cx="150" cy="200" rx="28" ry="18" fill="#dc143c"/>
                        <ellipse cx="150" cy="199" rx="24" ry="15" fill="#ff6b9d"/>
                        <rect x="130" y="194" width="40" height="9" fill="white" rx="2"/>
                    </g>
                    
                    <!-- Round -->
                    <g id="mouth-round" opacity="0">
                        <ellipse cx="150" cy="202" rx="16" ry="20" fill="#8b1538"/>
                        <ellipse cx="150" cy="201" rx="14" ry="18" fill="#dc143c"/>
                        <ellipse cx="150" cy="201" rx="11" ry="15" fill="#ff6b9d"/>
                    </g>
                </g>
                
                <!-- Necklace with realistic gold -->
                <circle cx="150" cy="275" r="10" fill="#DAA520" opacity="0.3"/>
                <circle cx="150" cy="275" r="9" fill="#FFD700"/>
                <circle cx="150" cy="275" r="7" fill="#FFA500" opacity="0.6"/>
                <circle cx="147" cy="272" r="2" fill="#FFFF99"/>
            </svg>
        `;
        
        this.container.innerHTML = svg;
        this.mouthSmile = document.getElementById('mouth-smile');
        this.mouthTalking = document.getElementById('mouth-talking');
        this.mouthWide = document.getElementById('mouth-wide');
        this.mouthRound = document.getElementById('mouth-round');
        this.leftEyelid = document.getElementById('left-eyelid');
        this.rightEyelid = document.getElementById('right-eyelid');
    }

    // Set avatar state
    setState(state) {
        this.currentState = state;
        
        // Stop any ongoing lip sync
        if (this.lipSyncInterval) {
            clearInterval(this.lipSyncInterval);
            this.lipSyncInterval = null;
        }
        
        switch (state) {
            case 'idle':
                this.setIdle();
                break;
            case 'listening':
                this.setListening();
                break;
            case 'speaking':
                this.setSpeaking();
                break;
            case 'thinking':
                this.setThinking();
                break;
        }
    }

    setIdle() {
        this.showMouth('smile');
        this.container.style.transform = 'scale(1)';
    }

    setListening() {
        this.showMouth('smile');
        // Gentle pulsing animation
        this.container.style.animation = 'gentle-pulse 2s ease-in-out infinite';
    }

    setSpeaking() {
        this.startLipSync();
    }

    setThinking() {
        this.showMouth('smile');
        // Slight head tilt
        this.container.style.animation = 'think-tilt 1.5s ease-in-out infinite alternate';
    }

    // Show specific mouth shape
    showMouth(type) {
        // Hide all mouths
        if (this.mouthSmile) this.mouthSmile.style.opacity = '0';
        if (this.mouthTalking) this.mouthTalking.style.opacity = '0';
        if (this.mouthWide) this.mouthWide.style.opacity = '0';
        if (this.mouthRound) this.mouthRound.style.opacity = '0';
        
        // Show selected mouth
        switch (type) {
            case 'smile':
                if (this.mouthSmile) this.mouthSmile.style.opacity = '1';
                break;
            case 'talking':
                if (this.mouthTalking) this.mouthTalking.style.opacity = '1';
                break;
            case 'wide':
                if (this.mouthWide) this.mouthWide.style.opacity = '1';
                break;
            case 'round':
                if (this.mouthRound) this.mouthRound.style.opacity = '1';
                break;
        }
    }

    // Start lip sync animation
    startLipSync() {
        const mouthShapes = ['talking', 'wide', 'round', 'talking'];
        let currentIndex = 0;
        
        this.lipSyncInterval = setInterval(() => {
            this.showMouth(mouthShapes[currentIndex]);
            currentIndex = (currentIndex + 1) % mouthShapes.length;
        }, 150); // Change mouth shape every 150ms
    }

    // Sync lip movement with text (more advanced)
    syncWithText(text) {
        if (!text) return;
        
        // Clear existing interval
        if (this.lipSyncInterval) {
            clearInterval(this.lipSyncInterval);
        }
        
        // Simple phoneme-based lip sync
        const words = text.toLowerCase().split(' ');
        let delay = 0;
        
        words.forEach(word => {
            setTimeout(() => {
                this.animateWord(word);
            }, delay);
            delay += word.length * 80; // Approximate timing
        });
    }

    animateWord(word) {
        // Vowel detection for mouth shapes
        const hasA = /[aá]/.test(word);
        const hasE = /[eé]/.test(word);
        const hasI = /[ií]/.test(word);
        const hasO = /[oó]/.test(word);
        const hasU = /[uú]/.test(word);
        
        if (hasO || hasU) {
            this.showMouth('round');
        } else if (hasA || hasE) {
            this.showMouth('wide');
        } else {
            this.showMouth('talking');
        }
        
        // Return to neutral after a short time
        setTimeout(() => {
            if (this.currentState === 'speaking') {
                this.showMouth('talking');
            }
        }, 100);
    }

    // Eye blinking
    startBlinking() {
        this.blinkInterval = setInterval(() => {
            this.blink();
        }, 3000 + Math.random() * 2000); // Random interval between 3-5 seconds
    }

    blink() {
        if (!this.leftEyelid || !this.rightEyelid) return;
        
        // Close eyes
        this.leftEyelid.setAttribute('ry', '22');
        this.rightEyelid.setAttribute('ry', '22');
        
        // Open eyes after 150ms
        setTimeout(() => {
            if (this.leftEyelid && this.rightEyelid) {
                this.leftEyelid.setAttribute('ry', '0');
                this.rightEyelid.setAttribute('ry', '0');
            }
        }, 150);
    }

    // Stop animations
    stop() {
        if (this.lipSyncInterval) {
            clearInterval(this.lipSyncInterval);
        }
        if (this.blinkInterval) {
            clearInterval(this.blinkInterval);
        }
        this.setState('idle');
    }

    // Cleanup
    destroy() {
        this.stop();
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Export for use in other scripts
window.AvatarAnimator = AvatarAnimator;

