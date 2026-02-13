/**
 * Menu Scene
 * Handles asset preloading and the title screen
 */
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        // --- PRELOAD ASSETS ---
        // Map
        this.load.tilemapTiledJSON('map', 'assets/maps/map.json?t=' + Date.now());
        
        // Tilesets
        const tilesets = [
            'decor', 'grass', 'bush', 'fence', 'broken-bridge', 'bridge',
            'soil', 'tree1', 'tree3', 'flowers', 'nametag', 'treetrunk',
            'weed', 'flowergrass2', 'flowergrass', 'ground-decor', 'stones', 'nametagnishi'
        ];
        tilesets.forEach(t => this.load.image(t, `assets/tilesets/${t}.png`));

        // Sprites
        const sprites = [
            'player-front', 'player-back', 'player-left', 'player-right',
            'player-front-flower', 'player-left-flower', 'player-right-flower',
            'injured-man', 'cat', 'girl', 'villager', 'villager2', 'villager3', 'island-villager',
            'gf_left', 'gf_flower_left', 'gf_front', 'gf_back', 'gf_right',
            'gf_flower_front', 'gf_flower_right'
        ];
        sprites.forEach(s => this.load.image(s, `assets/sprites/${s}.png`));

        // Audio
        this.load.audio('walk', 'assets/sounds/walk.m4a');
        this.load.audio('wallhit', 'assets/sounds/wallhit.mp3');
        this.load.audio('meow', 'assets/sounds/meow.mp3');
        this.load.audio('bg-music', 'assets/sounds/bg.mp3');
        this.load.audio('bg2-music', 'assets/sounds/bg2.mp3');
        this.load.audio('bg3-music', 'assets/sounds/bg3.mp3');
        this.load.audio('died', 'assets/sounds/died.mp3');
        this.load.audio('chop', 'assets/sounds/chop.mp3');
        this.load.audio('repair', 'assets/sounds/repair.mp3');
        this.load.audio('toggle', 'assets/sounds/toggle.mp3');
        this.load.audio('achivement', 'assets/sounds/achivement.mp3');

        // Fragments
        this.load.image('frag_intro_dream', 'assets/fragments/first.png');
        this.load.image('frag_cat_memory', 'assets/fragments/second.png');
        this.load.image('frag_bridge_memory', 'assets/fragments/third.png');
        this.load.image('frag_flowers_memory', 'assets/fragments/foruth.png');

        // --- LOADING UI ---
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRoundedRect(width / 2 - 160, height / 2 - 25, 320, 50, 10);

        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px Outfit',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 + 60,
            text: '0%',
            style: {
                font: '18px Outfit',
                fill: '#a78bfa'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        this.load.on('progress', (value) => {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xa78bfa, 1);
            progressBar.fillRoundedRect(width / 2 - 150, height / 2 - 15, 300 * value, 30, 5);
        });

        this.load.on('filecomplete', (key, type) => {
            // console.log(`📦 Loaded ${type}: ${key}`); // Reduce clutter
        });

        this.load.on('loaderror', (file) => {
            console.error(`❌ Failed to load: ${file.key} (${file.src})`);
        });

        this.load.on('complete', () => {
            console.log('✅ All assets loaded into global cache');
            console.log('Audio keys in cache:', this.cache.audio.getKeys());
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background
        this.add.rectangle(0, 0, width, height, 0x020617).setOrigin(0);

        // Title
        // Title
        const title = this.add.text(width / 2, height / 4, 'MEMORY DEVICE', {
            fontSize: '24px',
            fontFamily: 'Press Start 2P',
            color: '#a78bfa'
        }).setOrigin(0.5);
        title.setShadow(0, 4, 'rgba(167, 139, 250, 0.3)', 10);

        // Menu Options
        // Check unlocked fragments count for the label
        const unlockedCount = window.MemoryRegistry ? window.MemoryRegistry.getAll().length : 0;
        const fragmentLabel = unlockedCount > 0 ? `FRAGMENTS (${unlockedCount})` : 'FRAGMENTS (LOCKED)';

        // Check if game is completed to show Load Game option
        const gameCompleted = new window.GameState().isGameCompleted();
        
        this.menuOptions = [
            { text: 'BEGIN MEMORY', action: 'start' }
        ];
        
        // Add Load Game option if game is completed
        if (gameCompleted) {
            this.menuOptions.push({ text: 'LOAD GAME', action: 'load' });
        }
        
        this.menuOptions.push(
            { text: fragmentLabel, action: 'fragments', locked: unlockedCount === 0 }
        );
        this.menuItems = [];
        this.selectedIndex = 0;

        const startY = height / 2 + 20;
        this.menuOptions.forEach((option, index) => {
            const item = this.add.text(width / 2, startY + (index * 50), option.text, {
                fontSize: '14px',
                fontFamily: 'Press Start 2P',
                color: index === 0 ? '#a78bfa' : '#475569'
            }).setOrigin(0.5);
            
            this.menuItems.push(item);
        });

        // Controls hint
        this.add.text(width / 2, height - 20, 'ENTER: CONFIRM • ESC: CANCEL', {
            fontSize: '10px',
            fontFamily: 'Press Start 2P',
            color: '#475569'
        }).setOrigin(0.5);

        // Selection Arrow
        this.selectionArrow = this.add.text(0, 0, '♥', {
            fontSize: '12px',
            fontFamily: 'Press Start 2P',
            color: '#d8bfd8'
        }).setOrigin(0.5);
        this.updateSelection();

        // Keyboard Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Prevent multiple rapid triggers
        this.isTransitioning = false;

        this.input.keyboard.on('keydown-UP', () => this.changeSelection(-1));
        this.input.keyboard.on('keydown-DOWN', () => this.changeSelection(1));
        
        const confirmSelection = () => {
            if (this.isTransitioning) return;
            
            const option = this.menuOptions[this.selectedIndex];
            
            if (option.locked) {
                // Play locked sound
                this.sound.play('wallhit', { volume: 0.3, detune: -500 });
                // Small shake on text
                const item = this.menuItems[this.selectedIndex];
                this.tweens.add({
                    targets: item,
                    x: item.x + 5,
                    duration: 50,
                    yoyo: true,
                    repeat: 1
                });
                return;
            }

            if (option.action === 'start') {
                this.startGame();
            } else if (option.action === 'load') {
                this.loadGame();
            } else if (option.action === 'fragments') {
                this.scene.start('FragmentViewerScene');
            } else if (option.action === 'settings') {
                // Placeholder for settings
                this.sound.play('wallhit', { volume: 0.5 });
            }
        };

        this.input.keyboard.on('keydown-ENTER', confirmSelection);
        this.input.keyboard.on('keydown-SPACE', confirmSelection);

        // Logic for mouse click as well (classic hybrid feel)
        this.menuItems.forEach((item, index) => {
            item.setInteractive({ useHandCursor: true });
            item.on('pointerover', () => {
                this.selectedIndex = index;
                this.updateSelection();
            });
            item.on('pointerdown', () => confirmSelection());
        });

        // Page loader is hidden only after user enters password and taps to start
    }

    changeSelection(delta) {
        if (this.isTransitioning) return;
        
        this.selectedIndex += delta;
        if (this.selectedIndex < 0) this.selectedIndex = this.menuOptions.length - 1;
        if (this.selectedIndex >= this.menuOptions.length) this.selectedIndex = 0;
        
        this.updateSelection();
        
        // Optional: Play a tiny tick sound if you have one
        this.sound.play('wallhit', { volume: 0.2, detune: 500 });
    }

    updateSelection() {
        this.menuItems.forEach((item, index) => {
            const isSelected = index === this.selectedIndex;
            const isLocked = this.menuOptions[index].locked;
            
            // Style Active vs Inactive
            item.setColor(isSelected ? '#d8bfd8' : (isLocked ? '#334155' : '#64748b'));
            item.setAlpha(isLocked ? 0.5 : 1);
            
            if (isSelected) {
                this.selectionArrow.setPosition(item.x - (item.width / 2) - 20, item.y);
                this.selectionArrow.setVisible(true);
            }
        });
    }

    startGame() {
        this.isTransitioning = true;
        
        // Play confirming sound
        this.sound.play('wallhit', { volume: 0.5 });

        // Stop any existing background music - remove ALL instances
        const allBgMusic = ['bg-music', 'bg2-music', 'bg3-music'];
        allBgMusic.forEach(key => {
            this.sound.removeByKey(key);
        });
        
        // Start normal game music
        const bgMusic = this.sound.add('bg-music', { loop: true, volume: 0.05 });
        bgMusic.play();

        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameScene');
        });
    }
    
    loadGame() {
        this.isTransitioning = true;
        
        // Play confirming sound
        this.sound.play('wallhit', { volume: 0.5 });

        // Stop ALL background music explicitly - remove ALL instances
        const allBgMusic = ['bg-music', 'bg2-music', 'bg3-music'];
        allBgMusic.forEach(key => {
            // removeByKey removes ALL instances with this key
            this.sound.removeByKey(key);
        });
        
        // Start fresh post-game music (bg2)
        const bg2Music = this.sound.add('bg2-music', { loop: true, volume: 0.15 });
        bg2Music.play();

        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Pass data to GameScene to load in post-game state
            this.scene.start('GameScene', { loadPostGame: true });
        });
    }

    showControls() {
        // Simple alert or temporary text for controls
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const info = this.add.text(width / 2, height / 2, 'WASD to Move\nE to Interact\nY/N for Choices', {
            fontSize: '16px',
            fontFamily: 'Outfit',
            color: '#ffffff',
            align: 'center',
            backgroundColor: '#0f172a',
            padding: { x: 20, y: 20 }
        }).setOrigin(0.5).setDepth(10);
        
        this.time.delayedCall(2000, () => info.destroy());
    }
}

window.MenuScene = MenuScene;
