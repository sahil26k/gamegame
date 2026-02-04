class InteractionManager {
    constructor(scene) {
        this.scene = scene;
        this.interactiveObjects = [];
        this.promptText = null;
        this.closestObj = null;

        // Create UI prompt (hidden by default)
        this.createPrompt();
    }


    
    createPrompt() {
        this.promptText = this.scene.add.text(0, 0, 'Press E', {
            fontFamily: '"Press Start 2P", "Segoe UI", sans-serif',
            fontSize: '10px',
            backgroundColor: '#000000',
            color: '#ffffff',
            padding: { x: 4, y: 2 }
        });
        this.promptText.setOrigin(0.5);
        this.promptText.setDepth(1000); // Always on top
        this.promptText.setVisible(false);
    }
    
    add(x, y, radius, onInteract, label) {
        const obj = { x, y, radius, onInteract, label, active: true };
        this.interactiveObjects.push(obj);
        return obj;
    }

    tryInteract() {
        if (this.closestObj) {
            console.log('✨ Interacting with:', this.closestObj.label);
            this.closestObj.onInteract();
        } else {
            console.log('❌ No object close enough to interact');
        }
    }
    
    update() {
        if (!this.scene.player) return;
        
        const playerX = this.scene.player.x;
        const playerY = this.scene.player.y;
        
        this.closestObj = null;
        let minDist = Infinity;
        
        // Find closest interactive object within radius
        this.interactiveObjects.forEach(obj => {
            if (!obj.active) return;
            
            const dist = Phaser.Math.Distance.Between(playerX, playerY, obj.x, obj.y);
            if (dist <= obj.radius && dist < minDist) {
                minDist = dist;
                this.closestObj = obj;
            }
        });
        
        if (this.closestObj) {
            this.promptText.setPosition(this.closestObj.x, this.closestObj.y - 20);
            this.promptText.setText(this.closestObj.label || 'Press E');
            this.promptText.setVisible(true);
        } else {
            this.promptText.setVisible(false);
        }
    }
    
    remove(obj) {
        const index = this.interactiveObjects.indexOf(obj);
        if (index > -1) {
            this.interactiveObjects.splice(index, 1);
        }
    }
}

window.InteractionManager = InteractionManager;
