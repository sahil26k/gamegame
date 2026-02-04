/**
 * Fragment Viewer Scene
 * Displays the grid of collected memory fragments with fullscreen preview
 */
class FragmentViewerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FragmentViewerScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // --- State ---
        this.selectedIndex = 0;
        this.isFullView = false;
        this.isExiting = false;
        
        // --- Data ---
        this.allFragments = [
            { id: 'intro_dream', label: 'THE DREAM', key: 'frag_intro_dream', hint: 'Recovered at start' },
            { id: 'cat_memory', label: 'THE STRAY', key: 'frag_cat_memory', hint: 'A new friend' },
            { id: 'bridge_memory', label: 'RECONNECTION', key: 'frag_bridge_memory', hint: 'Path restored' },
            { id: 'flowers_memory', label: 'BLOOM', key: 'frag_flowers_memory', hint: 'Nature\'s gift' }
        ];

        this.unlockedIds = new Set(window.MemoryRegistry.getAll());
        this.fragmentItems = [];

        // --- UI Layers ---
        this.bgLayer = this.add.layer();
        this.gridLayer = this.add.container();
        this.overlayLayer = this.add.container().setDepth(100).setVisible(false);

        // Background
        this.bgLayer.add(this.add.rectangle(0, 0, width, height, 0x1a1a1a).setOrigin(0));
        this.bgLayer.add(this.add.text(width / 2, 30, 'MEMORY FRAGMENTS', {
            fontSize: '16px',
            fontFamily: 'Press Start 2P',
            color: '#d8bfd8'
        }).setOrigin(0.5));

        // --- Grid Builder ---
        this.buildGrid(width);

        // --- Fullscreen Overlay ---
        this.buildOverlay(width, height);

        // --- Input Handling ---
        this.setupInput();

        // Initial Selection
        this.updateSelection();
        
        // Lifecycle Handlers
        this.events.on('shutdown', this.shutdown, this);
        this.events.on('wake', this.onWake, this);
    }

    onWake() {
        console.log('🔄 FragmentViewerScene waking up');
        this.isExiting = false;
        this.isFullView = false;
        
        // Refresh unlocked fragments in case new ones were collected
        this.unlockedIds = new Set(window.MemoryRegistry.getAll());
        
        // Re-setup input to ensure clean state
        this.setupInput();
    }

    shutdown() {
        console.log('🛑 FragmentViewerScene shutting down');
        if (this.input && this.input.keyboard) {
            this.input.keyboard.removeAllListeners();
            this.input.keyboard.clearCaptures();
        }
        this.isExiting = false;
        this.isFullView = false;
    }

    buildGrid(width) {
        const cols = 2; 
        const startY = 100;
        const cellW = 140;
        const cellH = 100;

        this.allFragments.forEach((frag, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            
            // Center the grid
            const offsetX = (width - (cols * cellW)) / 2 + (cellW / 2);
            const x = offsetX + (col * cellW);
            const y = startY + (row * cellH);

            const isUnlocked = this.unlockedIds.has(frag.id);

            // Container Group
            const itemContainer = this.add.container(x, y);
            this.gridLayer.add(itemContainer);

            // Box Graphics
            const box = this.add.graphics();
            const color = isUnlocked ? 0xa78bfa : 0x334155;
            
            box.fillStyle(0x000000, 0.5);
            box.lineStyle(2, color, 1);
            
            const boxW = 120;
            const boxH = 90;
            box.fillRoundedRect(-boxW/2, -boxH/2, boxW, boxH, 10);
            box.strokeRoundedRect(-boxW/2, -boxH/2, boxW, boxH, 10);
            itemContainer.add(box);

            // Store ref for logic
            this.fragmentItems.push({ container: itemContainer, box, isUnlocked, data: frag });

            if (isUnlocked && this.textures.exists(frag.key)) {
                // Render Memory Image
                const img = this.add.image(0, -10, frag.key);
                const scaleX = 100 / img.width;
                const scaleY = 60 / img.height;
                const scale = Math.min(scaleX, scaleY); 
                img.setScale(scale);
                itemContainer.add(img);
                
                // Label
                itemContainer.add(this.add.text(0, 30, frag.label, {
                    fontSize: '8px',
                    fontFamily: 'Press Start 2P',
                    color: '#ffffff'
                }).setOrigin(0.5));
            } else {
                // Locked
                itemContainer.add(this.add.text(0, -5, '?', {
                    fontSize: '24px',
                    fontFamily: 'Press Start 2P',
                    color: '#64748b'
                }).setOrigin(0.5));
                
                itemContainer.add(this.add.text(0, 25, 'LOCKED', {
                    fontSize: '8px',
                    fontFamily: 'Press Start 2P',
                    color: '#475569'
                }).setOrigin(0.5));
            }

            // Click Area
            const zone = this.add.zone(0, 0, boxW, boxH).setInteractive();
            zone.on('pointerdown', () => {
                this.selectedIndex = index;
                this.updateSelection();
                this.openFullView();
            });
            itemContainer.add(zone);
        });
        
        // Navigation Hint
        this.add.text(width / 2, this.cameras.main.height - 30, 'Arrows: Move • Enter: View • ESC: Back', {
            fontSize: '10px',
            fontFamily: 'Press Start 2P',
            color: '#64748b'
        }).setOrigin(0.5);
    }

    buildOverlay(width, height) {
        // Dim Background
        const bg = this.add.rectangle(0, 0, width, height, 0x000000, 0.9).setOrigin(0).setInteractive();
        bg.on('pointerdown', () => this.closeFullView());
        this.overlayLayer.add(bg);

        // Elements
        this.overlayImage = this.add.image(width / 2, height / 2 - 20, 'frag_intro_dream').setOrigin(0.5);
        this.overlayTitle = this.add.text(width / 2, height / 2 + 80, '', {
             fontSize: '14px',
             fontFamily: 'Press Start 2P',
             color: '#a78bfa'
        }).setOrigin(0.5);
        
        this.overlayHint = this.add.text(width / 2, height / 2 + 100, '', {
             fontSize: '10px',
             fontFamily: 'Outfit',
             color: '#94a3b8'
        }).setOrigin(0.5);

        this.overlayLayer.add([this.overlayImage, this.overlayTitle, this.overlayHint]);
    }

    setupInput() {
        // CRITICAL: Clear any existing keyboard listeners first to prevent duplicates
        if (this.input && this.input.keyboard) {
            this.input.keyboard.removeAllListeners();
            this.input.keyboard.clearCaptures();
        }

        // Navigation
        this.input.keyboard.on('keydown-RIGHT', () => this.moveSelection(1));
        this.input.keyboard.on('keydown-LEFT', () => this.moveSelection(-1));
        this.input.keyboard.on('keydown-DOWN', () => this.moveSelection(2)); // cols = 2
        this.input.keyboard.on('keydown-UP', () => this.moveSelection(-2));
        
        // Enter to open/close fullview
        this.input.keyboard.on('keydown-ENTER', () => {
             if (this.isFullView) this.closeFullView();
             else this.openFullView();
        });

        // Back handler
        const onBack = () => {
             console.log('🔙 onBack triggered. FullView:', this.isFullView, 'isExiting:', this.isExiting);
             
             // Prevent double-triggering
             if (this.isExiting) {
                 console.log('⚠️ Already exiting, ignoring duplicate call');
                 return;
             }
             
             if (this.isFullView) {
                 this.closeFullView();
             } else {
                 this.exitScene();
             }
        };

        // Capture Backspace globally to prevent browser navigation
        this.input.keyboard.addCapture(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);

        // Multiple back keys
        this.input.keyboard.on('keydown-ESC', onBack);
        this.input.keyboard.on('keydown-X', onBack);
        
        // Robust Backspace handler
        this.input.keyboard.on('keydown-BACKSPACE', (event) => {
             if (event) {
                 if (typeof event.preventDefault === 'function') event.preventDefault();
                 if (typeof event.stopPropagation === 'function') event.stopPropagation();
             }
             onBack();
        });
    }

    moveSelection(delta) {
        if (this.isFullView) return;

        let newIndex = this.selectedIndex + delta;
        
        // Bounds Check
        if (newIndex < 0) newIndex = this.fragmentItems.length - 1;
        if (newIndex >= this.fragmentItems.length) newIndex = 0;

        this.selectedIndex = newIndex;
        this.updateSelection();
        if (this.cache.audio.exists('wallhit')) {
            this.sound.play('wallhit', { volume: 0.1, detune: 600 });
        }
    }

    updateSelection() {
        this.fragmentItems.forEach((item, index) => {
            const isSelected = index === this.selectedIndex;
            // Highlight effect
            item.box.lineStyle(2, isSelected ? 0xffffff : (item.isUnlocked ? 0xa78bfa : 0x334155), 1);
            item.container.setAlpha(isSelected ? 1 : 0.7);
            item.container.setScale(isSelected ? 1.05 : 1);
        });
    }

    openFullView() {
        const item = this.fragmentItems[this.selectedIndex];
        if (!item.isUnlocked) {
            // Shake effect for locked
            this.tweens.add({
                targets: item.container,
                x: item.container.x + 5,
                duration: 50,
                yoyo: true,
                repeat: 3
            });
            this.sound.play('wallhit', { volume: 0.2, detune: -400 });
            return;
        }

        const data = item.data;
        this.overlayImage.setTexture(data.key);
        
        // Scale Image up but keep aspect
        const maxWidth = this.cameras.main.width * 0.8;
        const maxHeight = this.cameras.main.height * 0.6;
        const scaleX = maxWidth / this.overlayImage.width;
        const scaleY = maxHeight / this.overlayImage.height;
        const scale = Math.min(scaleX, scaleY);
        this.overlayImage.setScale(scale);

        this.overlayTitle.setText(data.label);
        this.overlayHint.setText(data.hint);
        
        this.overlayLayer.setVisible(true);
        this.overlayLayer.setAlpha(0);
        this.tweens.add({
            targets: this.overlayLayer,
            alpha: 1,
            duration: 200
        });

        this.isFullView = true;
        if (this.cache.audio.exists('wallhit')) {
            this.sound.play('wallhit', { volume: 0.2, detune: 200 });
        }
    }

    closeFullView() {
        // Set state immediately to prevent "stuck" feeling
        this.isFullView = false;
        
        this.tweens.add({
            targets: this.overlayLayer,
            alpha: 0,
            duration: 200,
            onComplete: () => {
                this.overlayLayer.setVisible(false);
            }
        });
        
        if (this.sound.get('wallhit')) {
            this.sound.play('wallhit', { volume: 0.2, detune: 100 });
        }
    }

    exitScene() {
        if (this.isExiting) {
            console.log('⚠️ Exit already in progress, ignoring duplicate call');
            return;
        }
        
        this.isExiting = true;
        console.log('🛑 Clean Exit to Home...');

        // Clean up keyboard listeners immediately
        if (this.input && this.input.keyboard) {
            this.input.keyboard.removeAllListeners();
            this.input.keyboard.clearCaptures();
        }

        // Manual Cleanup of UI to prevent crash
        try {
            if (this.gridLayer) this.gridLayer.destroy();
            if (this.overlayLayer) this.overlayLayer.destroy();
            if (this.bgLayer) this.bgLayer.destroy();
        } catch (e) { 
            console.warn('Cleanup warning:', e); 
        }

        try {
            const gameScene = this.scene.get('GameScene');
            // Check specific sleeping state to determine origin
            // If sleeping, we came from Game -> DeviceMenu -> Fragments
            const isSleeping = gameScene && gameScene.sys && gameScene.sys.settings.status === Phaser.Scenes.SLEEPING;

            if (isSleeping) {
                console.log('🔙 Resuming GameScene (Sleeping)');
                this.scene.wake('GameScene');
                this.scene.stop(); // Stop viewer only
            } else {
                console.log('🔙 Returning to MenuScene (Home)');
                // If not sleeping, we likely came from Menu, so ensure Game is stopped
                if (gameScene && (this.scene.isActive('GameScene'))) {
                    this.scene.stop('GameScene');
                }
                this.scene.start('MenuScene');
            }
        } catch (err) {
            console.error('Exit Routing Error:', err);
            // Fallback safest option
            this.scene.start('MenuScene');
        }
    }
}

window.FragmentViewerScene = FragmentViewerScene;