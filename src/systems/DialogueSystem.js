/**
 * Dialogue System - Pokemon-style dialogue box with typewriter effect
 * Now supports conversation chains
 */
class DialogueSystem {
    constructor() {
        this.isActive = false;
        this.currentText = '';
        this.displayedText = '';
        this.charIndex = 0;
        this.typewriterSpeed = 30; // ms per character
        this.typewriterTimer = null;
        
        // Conversation chain support
        this.conversationQueue = [];
        this.currentIndex = 0;
        
        this.createDialogueBox();
    }
    
    createDialogueBox() {
        // Create dialogue container
        this.container = document.createElement('div');
        this.container.id = 'dialogue-box';
        this.container.className = 'dialogue-box hidden';
        
        // Create text element
        this.textElement = document.createElement('div');
        this.textElement.className = 'dialogue-text';
        
        // Create continue indicator
        this.indicator = document.createElement('div');
        this.indicator.className = 'dialogue-indicator';
        this.indicator.innerHTML = '▼';
        
        this.container.appendChild(this.textElement);
        this.container.appendChild(this.indicator);
        
        document.body.appendChild(this.container);
    }
    
    // Show a single message (legacy support)
    show(text) {
        if (this.isActive) return;
        
        this.isActive = true;
        this.currentText = text;
        this.charIndex = 0;
        this.displayedText = '';
        
        this.container.classList.remove('hidden');
        this.indicator.classList.add('hidden');
        this.textElement.textContent = '';
        
        this.startTypewriter();
    }
    
    // Show a conversation (array of messages)
    showConversation(messages, onComplete = null) {
        if (this.isActive) return;
        
        this.conversationQueue = messages;
        this.currentIndex = 0;
        this.onComplete = onComplete;
        this.showNextInConversation();
    }
    
    showNextInConversation() {
        if (this.currentIndex < this.conversationQueue.length) {
            const message = this.conversationQueue[this.currentIndex];
            this.currentIndex++;
            
            this.isActive = true;
            this.currentText = message;
            this.charIndex = 0;
            this.displayedText = '';
            
            this.container.classList.remove('hidden');
            this.indicator.classList.add('hidden');
            this.textElement.textContent = '';
            
            this.startTypewriter();
        } else {
            // Conversation complete
            this.hide();
        }
    }
    
    startTypewriter() {
        if (this.charIndex < this.currentText.length) {
            this.displayedText += this.currentText[this.charIndex];
            this.textElement.textContent = this.displayedText;
            this.charIndex++;
            
            this.typewriterTimer = setTimeout(() => {
                this.startTypewriter();
            }, this.typewriterSpeed);
        } else {
            // Text complete, show indicator
            this.indicator.classList.remove('hidden');
        }
    }
    
    hide() {
        // Check if there are more messages in the conversation
        if (this.conversationQueue.length > 0 && this.currentIndex < this.conversationQueue.length) {
            // Continue to next message
            this.showNextInConversation();
        } else {
            // Actually hide
            this.isActive = false;
            this.conversationQueue = [];
            this.currentIndex = 0;
            if (this.typewriterTimer) {
                clearTimeout(this.typewriterTimer);
            }
            this.container.classList.add('hidden');
            
            if (this.onComplete) {
                const callback = this.onComplete;
                this.onComplete = null;
                callback();
            }
        }
    }
    
    skip() {
        // Skip to end of current text
        if (this.charIndex < this.currentText.length) {
            clearTimeout(this.typewriterTimer);
            this.displayedText = this.currentText;
            this.textElement.textContent = this.displayedText;
            this.charIndex = this.currentText.length;
            this.indicator.classList.remove('hidden');
        }
    }
}

// Export for use in game
window.DialogueSystem = DialogueSystem;
