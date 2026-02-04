/**
 * Memory Device Registry
 * Handling the persistence of recovered memory fragments
 */
class MemoryRegistry {
    constructor() {
        this.storageKey = 'our_adventure_memory_v1';
        this.unlockedFragments = new Set();
        this.load();
    }

    // Load from local storage
    load() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (raw) {
                const data = JSON.parse(raw);
                this.unlockedFragments = new Set(data.fragments || []);
                console.log('💾 Memory Data Loaded:', this.unlockedFragments);
            }
        } catch (e) {
            console.warn('Memory load failed:', e);
            this.unlockedFragments = new Set();
        }
    }

    // Save to local storage
    save() {
        try {
            const data = {
                fragments: Array.from(this.unlockedFragments),
                timestamp: Date.now()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (e) {
            console.warn('Memory save failed:', e);
        }
    }

    // Unlock a specific memory fragment
    unlock(id) {
        if (!this.unlockedFragments.has(id)) {
            console.log(`🔓 Unlocked Fragment: ${id}`);
            this.unlockedFragments.add(id);
            this.save();
            return true; // Newly unlocked
        }
        return false; // Already unlocked
    }

    // Check if unlocked
    isUnlocked(id) {
        return this.unlockedFragments.has(id);
    }

    // Get all unlocked IDs
    getAll() {
        return Array.from(this.unlockedFragments);
    }

    // Full reset (for debug or wipe)
    reset() {
        this.unlockedFragments.clear();
        localStorage.removeItem(this.storageKey);
        console.log('🗑️ Memory Wiped');
    }
}

// Global Instance
window.MemoryRegistry = new MemoryRegistry();
