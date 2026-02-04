/**
 * Toast Notification System (DOM Version)
 * Displays pixel-perfect popups for events using HTML/CSS overlay
 * This ensures visibility regardless of canvas scaling/camera.
 */
class ToastNotification {
    constructor(scene) {
        this.scene = scene;
        this.createDOMStructure();
    }

    createDOMStructure() {
        // Check if already exists to prevent duplicates
        if (document.getElementById('toast-container')) return;

        const container = document.createElement('div');
        container.id = 'toast-container';
        container.style.position = 'absolute'; // Relative to game-wrapper
        container.style.bottom = '20px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.gap = '10px';
        container.style.pointerEvents = 'none'; // Click through
        container.style.zIndex = '1000';
        container.style.width = '100%';

        // Find the game wrapper to attach to, or fallback to body
        const wrapper = document.querySelector('.game-wrapper') || document.body;
        wrapper.appendChild(container);
    }

    /**
     * Show a toast message
     * @param {string} message - The text to display
     * @param {string} icon - Optional emoji or icon char (e.g. '♥')
     */
    show(message, icon = '♥') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        // Create Toast Element
        const toast = document.createElement('div');
        
        // CSS Styles inline for simplicity, or we could add to style class
        toast.style.background = 'rgba(26, 26, 26, 0.95)';
        toast.style.border = '2px solid #d8bfd8'; // Dusty pink border
        toast.style.borderRadius = '4px';
        toast.style.padding = '10px 20px';
        toast.style.color = '#ffffff';
        toast.style.fontFamily = '"Press Start 2P", monospace';
        toast.style.fontSize = '10px';
        toast.style.textAlign = 'center';
        toast.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        toast.innerText = `${icon} ${message} ${icon}`;

        container.appendChild(toast);

        // Animate In (Next Frame)
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        // Play Sound (Phaser context) via ducking helper
        if (this.scene.playSound) {
            this.scene.playSound('achivement', { volume: 0.8 });
        } else {
            // Fallback for non-GameScene contexts (like Menu)
            if (this.scene.sound.get('achivement')) {
                this.scene.sound.play('achivement', { volume: 0.8 });
            }
        }

        // Remove after delay
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            
            // Clean DOM
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 500); // Match transition time
        }, 3000);
    }
}
