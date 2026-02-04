class UIOverlay {
    constructor(scene, gameState) {
        this.scene = scene;
        this.gameState = gameState;
        this.createElements();
        this.updateInterval = setInterval(() => this.update(), 500); // Check every 500ms
    }

    createElements() {
        // Quest Hint Container
        this.questContainer = document.createElement('div');
        this.questContainer.className = 'ui-quest';
        this.questContainer.style.display = 'none'; // Hidden
        document.body.appendChild(this.questContainer);

        // Inventory Container
        this.inventoryContainer = document.createElement('div');
        this.inventoryContainer.className = 'ui-inventory';
        this.inventoryContainer.innerHTML = 'Inventory: ';
        document.body.appendChild(this.inventoryContainer);
        
        // Capture Button
        this.captureBtn = document.createElement('div');
        this.captureBtn.className = 'ui-capture';
        this.captureBtn.innerHTML = '📷 Snap';
        this.captureBtn.onclick = () => this.takeSnapshot();
        document.body.appendChild(this.captureBtn);

        // Add Styles dynamically
        const style = document.createElement('style');
        style.innerHTML = `
            .ui-quest {
                position: fixed;
                top: 20px;
                left: 20px;
                background: rgba(0, 0, 0, 0.7);
                color: #fff;
                padding: 10px 15px;
                border: 2px solid #fff;
                border-radius: 8px;
                font-family: "Press Start 2P", monospace;
                font-size: 12px;
                z-index: 1000;
                pointer-events: none;
            }
            .ui-inventory {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.7);
                color: #ffcc00;
                padding: 10px 15px;
                border: 2px solid #ffcc00;
                border-radius: 8px;
                font-family: "Press Start 2P", monospace;
                font-size: 12px;
                z-index: 1000;
                pointer-events: none;
            }
            .ui-capture {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.15);
                color: #fff;
                padding: 12px 18px;
                border: 2px solid #fff;
                border-radius: 50px;
                font-family: "Press Start 2P", monospace;
                font-size: 10px;
                cursor: pointer;
                z-index: 1000;
                pointer-events: auto;
                transition: all 0.2s ease;
                backdrop-filter: blur(2px);
            }
            .ui-capture:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.05);
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
            }
            .ui-capture:active {
                transform: scale(0.95);
            }
        `;
        document.head.appendChild(style);
    }
    
    takeSnapshot() {
        if (!this.scene) return;
        
        // Hide Prompt Labels (Talk, Pet, etc.)
        const interactionManager = this.scene.interactionManager;
        let originalAlpha = 1;
        
        if (interactionManager && interactionManager.promptText) {
            originalAlpha = interactionManager.promptText.alpha;
            interactionManager.promptText.alpha = 0; // Hide via alpha to override setVisible loop
        }
        
        // Visual feedback
        this.captureBtn.innerHTML = '✨ Saved!';
        setTimeout(() => {
             if (this.captureBtn) this.captureBtn.innerHTML = '📷 Snap';
        }, 2000);
        
        this.scene.game.renderer.snapshot((image) => {
            // Restore Prompt Labels
            if (interactionManager && interactionManager.promptText) {
                interactionManager.promptText.alpha = originalAlpha;
            }
            
            const link = document.createElement('a');
            link.download = `memory_${new Date().toISOString().slice(0,19).replace(/[:T]/g, "-")}.png`;
            link.href = image.src;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    update() {
        this.updateQuest();
        this.updateInventory();
    }

    updateQuest() {
        let hint = "Explore the dream...";
        
        if (!this.gameState.getFlag('introTalked')) hint = "Talk to the Villager";
        else if (!this.gameState.getFlag('bridgeSeen')) hint = "Explore the river to the East";
        else if (!this.gameState.getFlag('questStarted')) hint = "Talk to the Injured Man";
        else if (!this.gameState.getFlag('catFound')) hint = "Find the Cat (Search bushes)";
        else if (!this.gameState.getFlag('keyCollected')) hint = "Return Cat to Man";
        else if (!this.gameState.getFlag('toolsCollected')) hint = "Find the Chest (South)";
        else if (!this.gameState.getFlag('bridgeRepaired')) hint = "Repair the Bridge";
        else if (!this.gameState.getFlag('northVillagerTalked')) hint = "Cross bridge & explore";
        else if (!this.gameState.getFlag('hasBouquet')) hint = `Find Roses (${this.gameState.getFlag('flowersCollected') || 0}/3)`;
        else if (!this.gameState.getFlag('metGirl')) hint = "Find the Girl (Flower Field)";
        else hint = "Happy Valentine's Day! ❤️";

        this.questContainer.innerText = hint;
    }

    updateInventory() {
        // Map items to icons
        const iconMap = { 'Key': 'Key 🗝️', 'Tools': 'Tools 🛠️', 'Bouquet': 'Bouquet 💐' };
        
        // Use direct inventory array
        const items = this.gameState.inventory.map(i => iconMap[i] || i);

        if (items.length === 0) {
            this.inventoryContainer.style.display = 'none';
        } else {
            this.inventoryContainer.style.display = 'block';
            this.inventoryContainer.innerHTML = 'Inv: ' + items.join("  ");
        }
    }
    
    destroy() {
        if (this.updateInterval) clearInterval(this.updateInterval);
        if (this.questContainer) this.questContainer.remove();
        if (this.inventoryContainer) this.inventoryContainer.remove();
        if (this.captureBtn) this.captureBtn.remove();
    }
}

window.UIOverlay = UIOverlay;
