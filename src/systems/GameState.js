class GameState {
    constructor() {
        if (GameState.instance) {
            return GameState.instance;
        }
        GameState.instance = this;

        // Initialize flags
        this.flags = {
            // Act 0: Dream
            gameStarted: false,
            introTalked: false,
            blueTalked: false,
            orangeTalked: false,
            
            // Act 1: Discovery
            bridgeSeen: false,
            
            // Act 2: Injured Man & Cat
            questStarted: false, // Talked to injured man
            catFound: false,
            keyCollected: false,
            
            // Act 3: Chest
            chestOpened: false,
            toolsCollected: false,
            
            // Act 4: Bridge
            bridgeRepaired: false,
            failedBridge: false,
            woodCollected: 0,
            
            // Act 5: Other side
            northVillagerTalked: false,
            
            // Act 6: Flowers
            flowersCollected: 0,
            hasBouquet: false,
            
            // Act 7: End
            metGirl: false
        };
        
        this.inventory = [];
    }
    
    setFlag(flag, value) {
        if (this.flags.hasOwnProperty(flag)) {
            this.flags[flag] = value;
            console.log(`🚩 Flag updated: ${flag} = ${value}`);
            return true;
        }
        console.warn(`⚠️ Flag not found: ${flag}`);
        return false;
    }
    
    getFlag(flag) {
        return this.flags[flag];
    }
    
    addToInventory(item) {
        this.inventory.push(item);
        console.log(`🎒 Processed item: ${item}`);
    }
    
    hasItem(item) {
        return this.inventory.includes(item);
    }
    
    removeFromInventory(item) {
        const index = this.inventory.indexOf(item);
        if (index > -1) {
            this.inventory.splice(index, 1);
            console.log(`🎒 Used item: ${item}`);
            return true;
        }
        return false;
    }
    
    // Game completion tracking (persisted to localStorage)
    setGameCompleted(completed = true) {
        try {
            localStorage.setItem('our_adventure_completed', completed ? 'true' : 'false');
            console.log(`🏆 Game completion status: ${completed}`);
        } catch (e) {
            console.warn('Failed to save completion status:', e);
        }
    }
    
    isGameCompleted() {
        try {
            return localStorage.getItem('our_adventure_completed') === 'true';
        } catch (e) {
            return false;
        }
    }
}

window.GameState = GameState;
