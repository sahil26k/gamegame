/**
 * Main Game Scene
 */
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    preload() {
        // Preloading is now handled by MenuScene.js
    }
    
    create(data) {
        this.setupMap();
        
        // Initialize systems first
        // Initialize systems first
        this.gameState = new GameState();
        
        // Check if loading post-game state
        const loadPostGame = data && data.loadPostGame;
        this.isLoadedGame = loadPostGame; // Store flag for later use
        if (loadPostGame) {
            // Story progression flags
            this.gameState.setFlag('metGirl', true);
            this.gameState.setFlag('hasBouquet', false); // Bouquet already given
            this.gameState.setFlag('gameStarted', true);
            
            // Quest completion flags
            this.gameState.setFlag('questStarted', true);
            this.gameState.setFlag('catFound', true);
            this.gameState.setFlag('keyCollected', true);
            this.gameState.setFlag('chestOpened', true);
            this.gameState.setFlag('toolsCollected', true);
            
            // Bridge repair
            this.gameState.setFlag('bridgeRepaired', true);
            this.gameState.setFlag('woodCollected', 2);
            
            // Flower quest
            this.gameState.setFlag('flowersCollected', 3);
            this.gameState.setFlag('northVillagerTalked', true);
        }
        
        this.uiOverlay = new UIOverlay(this, this.gameState);
        this.interactionManager = new InteractionManager(this);
        this.toast = new ToastNotification(this);
        this.deviceMenu = new DeviceMenu(this);
        this.deviceMenu.create();
        
        this.setupPlayer();
        this.setupCamera();
        this.setupControls();
        this.setupDialogue();
        this.setupSounds();
        
        
        // Initialize state
        this.isDying = false;
        this.isChopping = false;
        this.waitingForRestart = false;
        
        this.setupEntities();

        // Page loader is hidden only after user enters password and taps to start
        
        // Game Start Monologue
        this.time.delayedCall(1000, () => {
            if (!this.gameState.getFlag('gameStarted')) {
                this.dialogueSystem.showConversation([
                    "(That dream again...)",
                    "(The river. The flowers.)",
                    "(And her.)",
                    "(I don't even know who she is.)",
                    "(But it felt... real.)"
                ], () => {
                    // Trigger first memory unlock after dialogue completes
                    const id = 'intro_dream';
                    if (window.MemoryRegistry && window.MemoryRegistry.unlock(id)) {
                        this.toast.show('Daydream Recovered');
                    }
                });
                this.gameState.setFlag('gameStarted', true);
            }
        });
        
        // RETROSPECTIVE FIX: Unlock Bloom memory if girl said Yes
        if (this.gameState && this.gameState.getFlag('metGirl')) {
             if (window.MemoryRegistry && window.MemoryRegistry.unlock('flowers_memory')) {
                 this.toast.show('Memory Fragment: Bloom', '💐');
             }
        }

        console.log('✅ Game scene created');
    }
    
    setupMap() {
        try {
            console.log('🗺️ Starting map setup...');
            
            // Create tilemap
            this.map = this.make.tilemap({ key: 'map' });
            console.log('✅ Tilemap created');
            
            // Add tilesets
            console.log('📦 Loading tilesets...');
            const decorTileset = this.map.addTilesetImage('decor', 'decor');
            const grassTileset = this.map.addTilesetImage('grass', 'grass');
            const bushTileset = this.map.addTilesetImage('bush', 'bush');
            const fenceTileset = this.map.addTilesetImage('fence', 'fence');
            const brokenBridgeTileset = this.map.addTilesetImage('broken-bridge', 'broken-bridge');
            const bridgeTileset = this.map.addTilesetImage('bridge', 'bridge');
            const soilTileset = this.map.addTilesetImage('soil', 'soil');
            const tree1Tileset = this.map.addTilesetImage('tree1', 'tree1');
            const tree3Tileset = this.map.addTilesetImage('tree3', 'tree3');
            const flowersTileset = this.map.addTilesetImage('flowers', 'flowers');
            const nametagTileset = this.map.addTilesetImage('nametag', 'nametag');
            const treetrunkTileset = this.map.addTilesetImage('treetrunk', 'treetrunk');
            const weedTileset = this.map.addTilesetImage('weed', 'weed');
            const flowergrass2Tileset = this.map.addTilesetImage('flowergrass2', 'flowergrass2');
            const flowergrassTileset = this.map.addTilesetImage('flowergrass', 'flowergrass');
            const groundDecorTileset = this.map.addTilesetImage('ground-decor', 'ground-decor');
            const stonesTileset = this.map.addTilesetImage('stones', 'stones');
            const nametagnishiTileset = this.map.addTilesetImage('nametagnishi', 'nametagnishi');
            console.log('✅ All tilesets loaded');
            
            const allTilesets = [
                decorTileset, grassTileset, bushTileset, fenceTileset, brokenBridgeTileset, bridgeTileset,
                soilTileset, tree1Tileset, tree3Tileset, flowersTileset, nametagTileset, treetrunkTileset,
                weedTileset, flowergrass2Tileset, flowergrassTileset, groundDecorTileset, stonesTileset, nametagnishiTileset
            ];
            
            // Create layers (in order from bottom to top - matching map.json layer order)
            // Create layers
            console.log('🎨 Creating layers...');
            this.groundLayer = this.map.createLayer('ground', allTilesets, 0, 0);
            this.soilLayer = this.map.createLayer('soil', allTilesets, 0, 0);
            this.waterLayer = this.map.createLayer('water', allTilesets, 0, 0);
            this.decorLayer = this.map.createLayer('decor', allTilesets, 0, 0);
            this.chestLayer = this.map.createLayer('chest', allTilesets, 0, 0);
            this.flowersLayer = this.map.createLayer('flowers', allTilesets, 0, 0);
            this.mushroomLayer = this.map.createLayer('mushroom', allTilesets, 0, 0);
            this.treesLayer = this.map.createLayer('trees', allTilesets, 0, 0);
            this.fenceLayer = this.map.createLayer('fence', allTilesets, 0, 0);
            this.bridgeBrokenLayer = this.map.createLayer('bridge-broken', allTilesets, 0, 0);
            this.bridgeFixedLayer = this.map.createLayer('bridge-fixed', allTilesets, 0, 0);
            
            if (this.bridgeFixedLayer) {
                this.bridgeFixedLayer.setVisible(false);
            } else {
                console.warn('⚠️ bridge-fixed layer not found or could not be created');
            }

            this.wallsLayer = this.map.createLayer('walls', allTilesets, 0, 0);
            this.bushLayer = this.map.createLayer('bush', allTilesets, 0, 0);
            
            // Log created layers for debugging
            console.log('✅ Layers created. Status:', {
                ground: !!this.groundLayer,
                water: !!this.waterLayer,
                trees: !!this.treesLayer,
                bridgeFixed: !!this.bridgeFixedLayer
            });

            // Set collisions for all blocking layers
            console.log('🚧 Setting up collisions...');
            if (this.wallsLayer) this.wallsLayer.setCollisionByExclusion([-1]);
            if (this.bushLayer) this.bushLayer.setCollisionByExclusion([-1, 0]);
            if (this.waterLayer) this.waterLayer.setCollisionByExclusion([-1, 0]);
            if (this.treesLayer) this.treesLayer.setCollisionByExclusion([-1, 0]);
            if (this.fenceLayer) this.fenceLayer.setCollisionByExclusion([-1]);
            
            console.log('✅ Map setup complete!');
        } catch (error) {
            console.error('❌ Map setup failed:', error);
            console.error('Stack:', error.stack);
        }
    }
    
    setupPlayer() {
        // Create player - spawn position depends on game state
        // Post-game: spawn near bridge (tile ~20, 19), Normal: spawn at start (1, 10)
        const spawnX = this.gameState.getFlag('metGirl') ? 640 : 16;  // 20 * 32 = 640
        const spawnY = this.gameState.getFlag('metGirl') ? 608 : 304; // 19 * 32 = 608
        
        this.player = this.physics.add.sprite(spawnX, spawnY, 'player-front');
        
        // Scale to fit 32x32 tiles
        const scale = Math.min(32 / 303, 32 / 539);
        this.player.setScale(scale);
        this.player.setDepth(5);
        this.player.setCollideWorldBounds(true);
        this.player.currentDirection = 'front';
        
        // Fix bridge visibility for post-game
        if (this.gameState.getFlag('bridgeRepaired')) {
            if (this.bridgeFixedLayer) {
                this.bridgeFixedLayer.setVisible(true);
            }
            // Hide broken bridge layer if it exists
            if (this.bridgeBrokenLayer) {
                this.bridgeBrokenLayer.setVisible(false);
            }
            
            // Clear collision for bridge area to allow crossing
            const clearCollision = (x, y) => {
                if (this.waterLayer) {
                    const tile = this.waterLayer.getTileAt(x, y);
                    if (tile) tile.setCollision(false, false, false, false);
                }
            };
            for (let x = 17; x <= 23; x++) {
                for (let y = 18; y <= 19; y++) {
                    clearCollision(x, y);
                }
            }
        }
        
        // Initialize collision tracking
        this.lastWallHitTime = 0;
        this.wasMoving = false;
        this.wasStuck = false;
        
        // Set world bounds
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        
        // Add collisions with blocking layers
        if (this.wallsLayer) {
            this.physics.add.collider(this.player, this.wallsLayer, () => this.playWallHit());
        }
        if (this.bushLayer) {
            this.physics.add.collider(this.player, this.bushLayer, () => this.playWallHit());
        }
        if (this.waterLayer) {
            this.physics.add.collider(this.player, this.waterLayer, () => this.playWallHit());
        }
        if (this.fenceLayer) {
            this.physics.add.collider(this.player, this.fenceLayer, () => this.playWallHit());
        }
        if (this.treesLayer) {
            this.physics.add.collider(this.player, this.treesLayer, (player, tile) => {
                 this.playWallHit();
            });
            
            this.treeInteractionMap = new Map();
            
            // Convert Trees to Interactive (Choppable)
            this.treesLayer.forEachTile((tile) => {
                if (tile.index !== -1) {
                    const tileX = tile.getCenterX();
                    const tileY = tile.getCenterY();
                    const interaction = this.interactionManager.add(tileX, tileY, 40, () => {
                         // Check if tile still exists
                         if (!this.treesLayer.hasTileAt(tile.x, tile.y)) return;
                         if (this.isChopping) return;

                         if (this.gameState.hasItem('Old Axe')) {
                             let wood = this.gameState.getFlag('woodCollected') || 0;
                             if (wood < 2) {
                                  // Start chopping process
                                  this.isChopping = true;
                                  this.player.setVelocity(0); // Stop player
                                  
                                  // Play chop sound at 2x speed (3s duration)
                                  if (this.chopSound) {
                                      this.chopSound.play({ rate: 2 });
                                  }

                                  this.dialogueSystem.show("*Chopping tree...*");

                                  this.time.delayedCall(3000, () => {
                                      this.isChopping = false;
                                      
                                      this.dialogueSystem.showConversation([
                                          "(Timber!)",
                                          "Collected 1 Wood Log 🪵"
                                      ]);
                                      
                                      // Remove Tree Cluster
                                      const radius = 2;
                                      for (let dx = -radius; dx <= radius; dx++) {
                                          for (let dy = -radius; dy <= radius; dy++) {
                                              const nx = tile.x + dx;
                                              const ny = tile.y + dy;
                                              if (this.treesLayer.hasTileAt(nx, ny)) {
                                                  this.treesLayer.removeTileAt(nx, ny);
                                                  
                                                  // Disable interaction for this tile
                                                  const key = `${nx},${ny}`;
                                                  if (this.treeInteractionMap.has(key)) {
                                                      const linkedInteraction = this.treeInteractionMap.get(key);
                                                      linkedInteraction.active = false;
                                                  }
                                              }
                                          }
                                      }
                                      
                                      wood++;
                                      this.gameState.setFlag('woodCollected', wood);
                                      
                                      if (wood === 2) {
                                          this.dialogueSystem.show("(That's enough wood to fix the bridge.)");
                                      }
                                  });
                             } else {
                                 this.dialogueSystem.show("(I have enough wood. I should fix the bridge now.)");
                             }
                         } else {
                             this.dialogueSystem.show("(A sturdy tree. I'd need an axe to cut this.)");
                         }
                    }, 'Chop');
                    
                    // Store in map
                    this.treeInteractionMap.set(`${tile.x},${tile.y}`, interaction);
                }
            });
        }
    }
    

    
    setupCamera() {
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 1.0, 1.0);
        this.cameras.main.setZoom(1.5);
        this.cameras.main.roundPixels = true;
    }
    
    setupControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.yKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
        this.nKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
    }
    
    setupDialogue() {
        this.dialogueSystem = new DialogueSystem();
    }
    
    setupSounds() {
        try {
            console.log('🔊 Setting up sounds...');
            console.log('Cache keys (audio):', this.cache.audio.getKeys());

            const addSound = (key, config) => {
                if (!this.cache.audio.exists(key)) {
                    console.warn(`⚠️ Sound key "${key}" missing from cache!`);
                    return null;
                }
                return this.sound.add(key, config);
            };

            // Create walk sound with looping
            this.walkSound = addSound('walk', {
                loop: true,
                volume: 0.3
            });
            
            // Create wall hit sound (one-shot)
            this.wallHitSound = addSound('wallhit', {
                volume: 0.3
            });

            // Create meow sound
            this.meowSound = addSound('meow', {
                volume: 0.8
            });

            // Use existing background music if it's already playing from MenuScene
            // Skip bg-music setup entirely if this is a loaded game (bg2 is already playing)
            if (!this.isLoadedGame) {
                const allSounds = this.sound.getAllPlaying();
                const existingBG = allSounds.find(s => s.key === 'bg-music');

                if (existingBG) {
                    this.bgMusic = existingBG;
                    this.bgMusic.setVolume(0.05); // Extremely low (5% volume)
                    console.log('🎵 Reusing background music from Menu at extremely low volume');
                } else {
                    this.bgMusic = addSound('bg-music', {
                        loop: true,
                        volume: 0.05 // Extremely low (5% volume)
                    });
                    if (this.bgMusic) this.bgMusic.play();
                }
            } else {
                console.log('🎵 Skipping bg-music - loaded game uses bg2-music');
            }

            // Create death sound
            this.deathSound = addSound('died', {
                loop: false,
                volume: 0.8
            });

            // Create chop sound
            this.chopSound = addSound('chop', {
                volume: 0.8
            });

            // Create repair sound
            this.repairSound = addSound('repair', {
                volume: 0.8
            });

            // Pre-add UI sounds so systems can use them
            addSound('toggle', { volume: 0.4 });
            addSound('achivement', { volume: 0.8 });
            
            console.log('✅ Sound setup complete');
        } catch (err) {
            console.error('❌ Sound setup failed:', err);
        }
    }
    
    setupEntities() {
        // 1. Villager (Act 0)
        const villager = this.physics.add.sprite(400, 270, 'villager');
        villager.setScale(0.26);
        villager.setDepth(5);
        villager.setImmovable(true);
        this.physics.add.collider(this.player, villager);
        
        this.interactionManager.add(400, 270, 50, () => {
            // Post-game dialogue
            if (this.gameState.getFlag('metGirl')) {
                const postGameLines = [
                    "Villager 1: You two look amazing together.",
                    "Villager 1: Seems like your dream came true.",
                    "Villager 1: That smile on your face says it all."
                ];
                const line = Phaser.Math.RND.pick(postGameLines);
                this.dialogueSystem.show(line);
                return;
            }
            
            if (!this.gameState.getFlag('introTalked')) {
                this.dialogueSystem.showConversation([
                    "Villager 1: You look like someone who didn't sleep much.",
                    "Sahil: Yeah... I keep having this strange dream.",
                    "Villager 1: Dreams have a habit of returning when they're unfinished.",
                    "Sahil: Unfinished how?",
                    "Villager 1: That part... you usually find out yourself."
                ]);
                this.gameState.setFlag('introTalked', true);
            } else {
                this.dialogueSystem.showConversation([
                    "Sahil: Do you think dreams actually mean something?",
                    "Villager 1: Some don't.\nThe ones that stay?",
                    "Villager 1: ...",
                    "Villager 1: Those usually do."
                ]);
            }
        }, 'Talk');

        // NPC 1: Right-Up from first villager
        const npc1 = this.physics.add.sprite(900, 200, 'villager3');
        npc1.setScale(0.26);
        npc1.setDepth(5);
        npc1.setImmovable(true);
        // npc1.setTint(0xaaccff); // Removed tint as we are using a specific sprite
        this.physics.add.collider(this.player, npc1);
        
        this.interactionManager.add(900, 200, 50, () => {
            // Post-game dialogue
            if (this.gameState.getFlag('metGirl')) {
                const postGameLines = [
                    "Villager 2: Found what the river was hiding, huh?",
                    "Villager 2: You two make a lovely pair.",
                    "Villager 2: Love looks good on you both."
                ];
                const line = Phaser.Math.RND.pick(postGameLines);
                this.dialogueSystem.show(line);
                return;
            }
            
            if (!this.gameState.getFlag('blueTalked')) {
                this.dialogueSystem.showConversation([
                    "Villager 2: You seem distracted.",
                    "Sahil: Ever feel like you've been somewhere before... without actually going there?",
                    "Villager 2: Hah. All the time.\nThe river's like that for me.",
                    "Sahil: The river?",
                    "Villager 2: Yeah. Feels like it's hiding something."
                ]);
                this.gameState.setFlag('blueTalked', true);
            } else {
                const lines = [
                   "Villager 2: The water is calm today.",
                   "Villager 2: I saw a fish jump earlier!",
                   "Villager 2: sometimes I wonder where the river flows to."
                ];
                const r = Math.floor(Math.random() * lines.length);
                this.dialogueSystem.show(lines[r]);
            }
        }, 'Talk');

        // NPC 2: Right-Below from first villager
        const npc2 = this.physics.add.sprite(340, 600, 'villager2');
        npc2.setScale(0.26);
        npc2.setDepth(5);
        npc2.setImmovable(true);
        npc2.setTint(0xffccaa); // Orange tint to distinguish
        this.physics.add.collider(this.player, npc2);
        
        this.interactionManager.add(340, 600, 50, () => {
            // Post-game dialogue
            if (this.gameState.getFlag('metGirl')) {
                const postGameLines = [
                    "Villager 3: You two look perfect together!",
                    "Villager 3: Guess you found what you were looking for.",
                    "Villager 3: That's the kind of ending I like to see."
                ];
                const line = Phaser.Math.RND.pick(postGameLines);
                this.dialogueSystem.show(line);
                return;
            }
            
            if (!this.gameState.getFlag('orangeTalked')) {
                this.dialogueSystem.showConversation([
                    "Villager 3: You pacing around again?",
                    "Sahil: Just thinking.",
                    "Villager 3: Careful. That's how people end up somewhere unexpected.",
                    "*smiles*",
                    "Villager 3: If you're curious, go take a walk east."
                ]);
                this.gameState.setFlag('orangeTalked', true);
            } else {
                const lines = [
                   "Villager 3: That bridge to the east looks dangerous.",
                   "Villager 3: Don't get lost in the woods!",
                   "Villager 3: Lovely weather for a mystery, eh?"
                ];
                const r = Math.floor(Math.random() * lines.length);
                this.dialogueSystem.show(lines[r]);
            }
        }, 'Talk');
        
        // Cat logic moved down to unified section

        // 2. Broken Bridge Zone (Act 1 & 4)
        // Coordinates: 20 tiles left * 32 = 640; 14 tiles from bottom (32-14=18) * 32 = 576
        this.interactionManager.add(640, 576, 60, () => {
             if (this.gameState.getFlag('bridgeRepaired')) {
                 this.dialogueSystem.show("The bridge is sturdy now.\nTime to cross.");
                 return;
             }

             if (!this.gameState.getFlag('bridgeSeen')) {
                 this.dialogueSystem.showConversation([
                     "(This place...)",
                     "(I've seen this before.)",
                     "(It was in my dream.)",
                     "(I couldn't cross it then either.)"
                 ]);
                 this.gameState.setFlag('bridgeSeen', true);
                 // Reveal Injured Man
                 this.injuredMan.enableBody(true, 200, 800, true, true);
                 this.injuredManInteraction.active = true;
             } else {
                  // Check for Wood (>= 2)
                  const wood = this.gameState.getFlag('woodCollected') || 0;
                  
                  if (wood >= 2) {
                     this.dialogueSystem.showConversation([
                         "Sahil: I have enough wood now.",
                         "(I'll use the axe to shape the planks.)"
                     ], () => {
                         // Play repair sound when hammering starts
                         if (this.repairSound) this.repairSound.play();
                         
                         this.dialogueSystem.showConversation([
                             "*hammering and fixing*"
                         ], () => {
                             // Repair Logic runs AFTER hammering dialogue finishes
                             this.gameState.setFlag('bridgeRepaired', true);
                             if (this.bridgeBrokenLayer) this.bridgeBrokenLayer.setVisible(false);
                             if (this.bridgeFixedLayer) this.bridgeFixedLayer.setVisible(true);
                             
                             // Clear collision for bridge area
                             const clearCollision = (x, y) => {
                                 if (this.waterLayer) {
                                     const tile = this.waterLayer.getTileAt(x, y);
                                     if (tile) tile.setCollision(false, false, false, false);
                                 }
                             };
                             for (let x = 17; x <= 23; x++) {
                                 for (let y = 18; y <= 19; y++) {
                                     clearCollision(x, y);
                                 }
                             }
                             
                              // Show post-repair dialogue
                              this.dialogueSystem.showConversation([
                                  "(Funny...)",
                                  "(Some things only break so you can rebuild them.)"
                              ], () => {
                                  // Unlock Bridge Memory AFTER final dialogue
                                  const memId = 'bridge_memory';
                                  if (window.MemoryRegistry && window.MemoryRegistry.unlock(memId)) {
                                      this.toast.show('Memory Fragment: Reconnection', '🌉');
                                  }
                              });

                              // Remove Axe and disable chopping
                              this.gameState.removeFromInventory('Old Axe');
                              if (this.treeInteractionMap) {
                                  this.treeInteractionMap.forEach(interaction => {
                                      interaction.active = false;
                                  });
                              }
                          });
                      });
                  } else {
                      this.dialogueSystem.showConversation([
                          "(The bridge is out.)",
                          `(I need wood to fix it. Wood: ${wood}/2)`,
                          "(I should find an axe and chop some trees.)"
                      ]);
                  }
             }
        }, 'Inspect');

        // 3. Injured Man (Act 2) - Hidden initially
        this.injuredMan = this.physics.add.sprite(200, 800, 'injured-man');
        this.injuredMan.setScale(0.26);
        this.injuredMan.setDepth(5);
        this.injuredMan.setImmovable(true);
        
        // Setup initial state: enabled if post-game or bridge seen
        if (this.gameState.getFlag('metGirl') || this.gameState.getFlag('bridgeSeen')) {
            this.injuredMan.enableBody(true, 200, 800, true, true);
        } else {
            this.injuredMan.disableBody(true, true);
        }
        
        this.physics.add.collider(this.player, this.injuredMan);
        
        // Save interaction reference
        this.injuredManInteraction = this.interactionManager.add(200, 800, 50, () => {
            // Post-game dialogue check
            if (this.gameState.getFlag('metGirl')) {
                const postGameLines = [
                    "Injured Man: Thanks for the help earlier.",
                    "Injured Man: You two are adorable together!",
                    "Injured Man: Glad to see you found happiness."
                ];
                const line = Phaser.Math.RND.pick(postGameLines);
                this.dialogueSystem.show(line);
                return;
            }

            if (!this.gameState.getFlag('questStarted')) {
                this.dialogueSystem.showConversation([
                    "Injured Man: Hey—wait.",
                    "Sahil: Are you okay?",
                    "Injured Man: Could be better.\nLeg's messed up pretty bad.",
                    "Sahil: What happened?",
                    "Injured Man: Tried crossing the bridge before it gave out.",
                    "*sighs*",
                    "Injured Man: My cat bolted when I fell.\nRan into the bushes.",
                    "Sahil: I can help you find him.",
                    "Injured Man: You'd do that?",
                    "*soft smile*",
                    "Injured Man: Thank you. He ran toward the trees to the south."
                ]);
                this.gameState.setFlag('questStarted', true);
                // Reveal Cat at quest position
                this.cat.enableBody(true, 420, 930, true, true);
                this.catInteraction.active = true;
            } else if (!this.gameState.getFlag('catFound')) {
                this.dialogueSystem.show("Injured Man: I hope she's away from the river.\nPlease hurry!");
            } else {
                if (!this.gameState.getFlag('keyCollected')) {
                    this.dialogueSystem.showConversation([
                        "Injured Man: You found him...",
                        "*kneels slightly*",
                        "Injured Man: I don't know how to thank you.",
                        "Sahil: I'm just glad he's okay.",
                        "Injured Man: Here, take this.",
                        "*hands you a key*",
                        "Injured Man: I found it near the river bank.",
                        "Injured Man: Rumor has it there's a hidden chest nearby.",
                        "Injured Man: But with my leg like this... I can't go looking for it.",
                        "Injured Man: Maybe you can find use for it."
                    ], () => {
                        this.gameState.setFlag('keyCollected', true);
                        this.gameState.addToInventory('Key');
                        // Reveal Chest
                        if (this.chestLayer) this.chestLayer.setVisible(true);
                        if (this.chestInteractions) {
                            this.chestInteractions.forEach(i => i.active = true);
                        }
                    });
                } else {
                     this.dialogueSystem.show("Injured Man: I hope that key was useful.");
                }
            }
        }, 'Talk');
        
        // Active if post-game or bridge seen
        this.injuredManInteraction.active = (this.gameState.getFlag('metGirl') || this.gameState.getFlag('bridgeSeen'));

        // 4. Cat (Act 2) - Hidden initially
        // Position depends on game state: quest (420, 930) or post-game (300, 750)
        const catX = this.gameState.getFlag('metGirl') ? 300 : 420;
        const catY = this.gameState.getFlag('metGirl') ? 750 : 930;
        
        this.cat = this.physics.add.sprite(catX, catY, 'cat');
        this.cat.setScale(0.40); 
        this.cat.setDepth(5);
        this.cat.setImmovable(true);
        
        if (this.gameState.getFlag('metGirl')) {
             this.cat.enableBody(true, 300, 750, true, true);
        } else {
             this.cat.disableBody(true, true);
        }
        this.physics.add.collider(this.player, this.cat);
        
        this.catInteraction = this.interactionManager.add(catX, catY, 50, () => {
            // Post-game dialogue check
            if (this.gameState.getFlag('metGirl')) {
                if (this.meowSound) this.meowSound.play();
                this.dialogueSystem.show("*Meow~*");
                return;
            }

            if (this.meowSound) this.meowSound.play();
            
            this.dialogueSystem.showConversation([
                "Sahil: Hey... it's okay.",
                "Cat: Meow...",
                "Sahil: Your owner's worried about you.",
                "*The cat follows you*"
            ], () => {
                // Unlock Cat Memory AFTER dialogue completes
                const memId = 'cat_memory';
                if (window.MemoryRegistry && window.MemoryRegistry.unlock(memId)) {
                    this.toast.show('Memory Fragment: The Stray', '🐱');
                }
            });
            this.cat.setVisible(false); // Cat picked up / returned
            this.catInteraction.active = false;
            this.gameState.setFlag('catFound', true);
        }, 'Pick Up');
        
        // Post-game: active with 'Pet' label. Quest: active only when revealed.
        if (this.gameState.getFlag('metGirl')) {
            this.catInteraction.active = true;
            this.catInteraction.label = 'Pet';
        } else {
            this.catInteraction.active = false;
            this.catInteraction.label = 'Pick Up';
        }
        
        // 5. Chest (Act 3) - Hidden initially (Layer-based)
        this.chestInteractions = [];
        if (this.chestLayer) {
            this.chestLayer.forEachTile((tile) => {
                if (tile.index !== -1) {
                    const tileX = tile.getCenterX();
                    const tileY = tile.getCenterY();
                    
                    const interaction = this.interactionManager.add(tileX, tileY, 40, () => {
                        if (this.gameState.getFlag('chestOpened')) {
                            this.dialogueSystem.show("Empty.");
                            return;
                        }
                        
                        if (this.gameState.hasItem('Key')) {
                             this.dialogueSystem.showConversation([
                                "Sahil: an old axe...",
                                "*You picked up the Old Axe*",
                                "(This looks sharp enough.)",
                                "(I can use this to cut some trees for wood.)",
                                "(I just need 2 logs to fix the bridge.)"
                             ]);
                             // Unlocked Memory removed from here as per new plan
                             // const memId = 'chest_memory'; 
                             // ...

                             this.gameState.setFlag('chestOpened', true);
                             this.gameState.addToInventory('Old Axe');
                             this.gameState.removeFromInventory('Key'); // Optional: Use up key? Or keep it? keeping it is fine.
                        } else {
                             this.dialogueSystem.show("It's locked.\n(I need a key.)");
                        }
                    }, 'Open');
                    
                    // Interaction always active now (visible chest)
                    interaction.active = true;
                    this.chestInteractions.push(interaction);
                }
            });
            console.log("📦 Converted chest layer tiles to interactions");
        }

        // 6. Act 5: Villager (Other Side)
        
        // 7. Flowers (Unlock Bloom Memory)
        if (this.groundDecorLayer) {
             this.groundDecorLayer.forEachTile((tile) => {
                 // Assuming flower tiles have valid index. 
                 // In many sets, flowers are distinct. 
                 // We will attach to any tile in this layer that isn't empty, 
                 // or ideally we'd check tile index. 
                 // For now, let's make specific locations interactive if possible,
                 // or just all non-empty tiles in this layer.
                 if (tile.index !== -1) {
                     // Check if this is a "flower" tile (placeholder logic or add to all)
                     // Let's add it to just one specific spot for the memory if getting indices is hard,
                     // But usually ground decor is everywhere.
                     // The user said "finding flowers and making bouquet".
                     // Maybe a specific patch?
                     // I will assume there's a patch near the river or bridge.
                     // I'll add a specific interaction zone instead of tile iteration if I don't know indices.
                 }
             });
             
             // Adding a static interaction zone for "Wildflowers" near the start/river 
             // calculated or estimated. 
             // Let's place it near the water, maybe x=300, y=400?
             // Or better, let's scan for the new 'flowers' tileset usage if any.
        }
        
        // Creating a specific interaction point for the "Bouquet" quest
        // Placing it in a grassy area
        this.flowerPatchInteraction = this.interactionManager.add(100, 600, 40, () => {
             if (!this.gameState.getFlag('flowersCollected')) {
                  this.dialogueSystem.showConversation([
                      "Sahil: These wildflowers are beautiful.",
                      "(Purple and blue... just like in the dream.)",
                      "*You gather a small bouquet*",
                      "Sahil: Maybe I'll keep these."
                  ], () => {
                      // Unlock Flowers Memory AFTER dialogue completes
                      const memId = 'flowers_memory';
                      if (window.MemoryRegistry && window.MemoryRegistry.unlock(memId)) {
                          this.toast.show('Memory Fragment: Bloom', '💐');
                      }
                  });
                  this.gameState.setFlag('flowersCollected', true);
                  this.gameState.addToInventory('Bouquet');
             } else {
                 this.dialogueSystem.show("(I already made a bouquet.)");
             }
        }, 'Pick Flowers');
        
        // 6. Act 5: Villager (Other Side)
        // 5 tiles right of bridge (X=20 + 5 = 25). Target: X=25, Y=18 => 800, 576
        const villager2 = this.physics.add.sprite(900, 550, 'island-villager');
        villager2.setScale(0.26);
        villager2.setDepth(5);
        villager2.setImmovable(true);
        // villager2.setTint(0xffcccc); // Removed tint as we are using a specific sprite
        this.physics.add.collider(this.player, villager2);
        
        this.interactionManager.add(900, 550, 50, () => {
             // Post-game dialogue
             if (this.gameState.getFlag('metGirl')) {
                 const postGameLines = [
                     "Island Villager: I see you found her by the flowers.",
                     "Island Villager: Dreams do come true, don't they?",
                     "Island Villager: You two look wonderful together."
                 ];
                 const line = Phaser.Math.RND.pick(postGameLines);
                 this.dialogueSystem.show(line);
                 return;
             }
             
             if (!this.gameState.getFlag('northVillagerTalked')) {
                 this.dialogueSystem.showConversation([
                     "Island Villager: I didn't expect to see anyone cross that bridge.",
                     "Sahil: I almost didn't.",
                     "Island Villager: You look like you're searching for something.",
                     "Sahil: Someone, actually.",
                     "Sahil: (from a dream.)",
                     "Island Villager: ...Dreams bring people here for different reasons.",
                     "Island Villager: Who is she?",
                     "Sahil: I keep seeing her in dreams shes always surrounded by flowers.\nQuiet type.",
                     "Island Villager: Hmm.. If thats the case then you should pick some flowers for her.",
                     "Sahil: That would be good.",
                     "Island Villager: Try looking in the north."
                 ]);
                 this.gameState.setFlag('northVillagerTalked', true);
                 // Enable flower interactions
                 if (this.flowerInteractions) {
                     this.flowerInteractions.forEach(i => i.active = true);
                 }
             } else {
                 if (this.gameState.getFlag('hasBouquet')) {
                     this.dialogueSystem.show("Villager: That is a beautiful bouquet.\nSomeone will be very happy.");
                 } else {
                     let count = this.gameState.getFlag('flowersCollected') || 0;
                     this.dialogueSystem.show(`Villager: Search the island.\nYou have found ${count}/3.`);
                 }
             }
        }, 'Talk');

        // 7. Act 6: Flowers (Layer-based)
        // Convert all tiles in 'flowers' layer to interactive objects
        this.flowerInteractions = [];
        if (this.flowersLayer) {
            this.flowersLayer.forEachTile((tile) => {
                if (tile.index !== -1) { // If there is a tile here
                    // World coordinates of the tile center
                    const tileX = tile.getCenterX();
                    const tileY = tile.getCenterY();
                    
                    const interaction = this.interactionManager.add(tileX, tileY, 32, () => {
                        // Pick logic
                        // Remove the tile visual
                        this.flowersLayer.removeTileAt(tile.x, tile.y);
                        
                        // Disable this interaction
                        interaction.active = false;
                        
                        let count = this.gameState.getFlag('flowersCollected') || 0;
                        count++;
                        this.gameState.setFlag('flowersCollected', count);
                        
                        if (count === 1) {
                             this.dialogueSystem.showConversation([
                                 "(These look familiar.)",
                                 "Picked a Flower 🌹 (1/3)"
                             ]);
                        } else if (count === 2) {
                             this.dialogueSystem.showConversation([
                                 "(Just like in my dream...)",
                                 "Picked a Flower 🌹 (2/3)"
                             ]);
                        } else if (count === 3) {
                             this.dialogueSystem.showConversation([
                                 "(I think this is enough.)",
                                 "(I carefully tie them together.)",
                                 "(It feels... important.)",
                                 "You made a beautiful Bouquet! 💐"
                             ]);
                             this.gameState.setFlag('hasBouquet', true);
                             this.gameState.addToInventory('Bouquet');
                             
                              
                             // Reveal Girl (Act 7)
                             this.girl.enableBody(true, 1100, 900, true, true);
                             this.girlInteraction.active = true;
                        } else {
                             this.dialogueSystem.show("Found another Flower! 🌹\n(Added to collection)");
                        }

                    }, 'Pick');
                    
                    interaction.active = false; // Initially inactive until Villager talk
                    this.flowerInteractions.push(interaction);
                }
            });
            console.log("🌸 Converted flower layer tiles to interactions");
        }

        // 8. Mushroom interactions (Layer-based)
        this.mushroomInteractions = [];
        this.awaitingMushroomChoice = false;
        this.currentMushroomTile = null;
        
        if (this.mushroomLayer) {
            this.mushroomLayer.forEachTile((tile) => {
                if (tile.index !== -1) {
                    const tileX = tile.getCenterX();
                    const tileY = tile.getCenterY();
                    
                    const interaction = this.interactionManager.add(tileX, tileY, 32, () => {
                        if (!this.awaitingMushroomChoice) {
                            this.currentMushroomTile = { x: tile.x, y: tile.y, interaction };
                            this.awaitingMushroomChoice = true;
                            this.dialogueSystem.showConversation([
                                "(These mushrooms look... edible?)",
                                "(Should I eat them?)",
                                "Press Y for Yes, N for No"
                            ]);
                        }
                    }, 'Inspect');
                    
                    this.mushroomInteractions.push(interaction);
                }
            });
            console.log("🍄 Converted mushroom layer tiles to interactions");
        }
          // 9. Girl (Act 7) - Hidden until end
        // Let's place her nearby the flowers but slightly away? 
        // User didn't specify, so I'll place her near the flowers (e.g., 1000, 900)
        // Or "Flower Field" implies she is there correctly.
        // Let's keep her at 800, 100 placeholder or move her closer?
        // "bottom right" -> maybe (1100, 900)?
        // I'll update her position to be near the flowers: (1100, 900)
        // Using 'gf_left' sprite as requested
        // Position depends on game state: post-game near bridge, normal at flower area
        const girlX = this.gameState.getFlag('metGirl') ? 672 : 1100; // Post-game: 21*32=672, Normal: 1100
        const girlY = this.gameState.getFlag('metGirl') ? 608 : 900;  // Post-game: 19*32=608, Normal: 900
        
        this.girl = this.physics.add.sprite(girlX, girlY, 'gf_left');
        // Match player scale
        const scale = Math.min(32 / 303, 32 / 539);
        this.girl.setScale(scale);
        this.girl.setDepth(5);
        this.girl.setImmovable(true);
        
        // In post-game, girl is already active
        if (this.gameState.getFlag('metGirl')) {
            this.girl.enableBody(true, girlX, girlY, true, true);
            this.girl.setCollideWorldBounds(true);
            this.girl.setImmovable(false);
            this.girl.body.setBounce(0);
            this.girl.currentDirection = 'left';
            
            // Add colliders for the Girl immediately in post-game
            if (this.wallsLayer) this.physics.add.collider(this.girl, this.wallsLayer, () => this.playWallHit());
            if (this.bushLayer) this.physics.add.collider(this.girl, this.bushLayer, () => this.playWallHit());
            if (this.waterLayer) this.physics.add.collider(this.girl, this.waterLayer, () => this.playWallHit());
            if (this.fenceLayer) this.physics.add.collider(this.girl, this.fenceLayer, () => this.playWallHit());
            if (this.treesLayer) this.physics.add.collider(this.girl, this.treesLayer, () => this.playWallHit());
            if (this.cat) this.physics.add.collider(this.girl, this.cat);
            if (this.injuredMan) this.physics.add.collider(this.girl, this.injuredMan);
        } else {
            this.girl.disableBody(true, true);
        }
        this.physics.add.collider(this.player, this.girl);
        
        // Random conversation pool for post-game
        this.randomConversations = [
            ["Nishi: The flowers are still beautiful.", "Sahil: Just like you.", "Nishi: Smooth talker."],
            ["Sahil: Want to explore more?", "Nishi: Sure! Lead the way."],
            ["Nishi: I'm glad you found me.", "Sahil: Me too."],
            ["Sahil: This place is peaceful.", "Nishi: It really is.", "Nishi: I could stay here forever."],
            ["Nishi: Remember when we first met?", "Sahil: How could I forget?", "Nishi: Those were good times."],
            ["Sahil: What should we do now?", "Nishi: Let's just walk around.", "Sahil: Sounds perfect."],
            ["Nishi: I love this.", "Sahil: Love what?", "Nishi: Being with you."],
            ["Sahil: Are you happy?", "Nishi: Very.", "Sahil: Good. That's all I wanted."],
            ["Sahil: Hi baby", "Nishi: hie baby"],
            ["Nishi: Saley", "Sahil: ...."],
            ["Nishi: Hijde", "Sahil: ...."]
        ];
        
        this.girlInteraction = this.interactionManager.add(1100, 900, 50, () => {
             // Check if post-game (after saying yes)
             if (this.gameState.getFlag('metGirl')) {
                 // Show random conversation
                 const randomConvo = Phaser.Math.RND.pick(this.randomConversations);
                 this.dialogueSystem.showConversation(randomConvo);
                 return;
             }
             
             // Part 1: Before handing over flowers
             this.dialogueSystem.showConversation([
                 "Sahil: Hi..",
                 "Nishi: Nepali Hijde.",
                 "Sahil: Youre much more beautiful than I imagined.",
                 "Nishi: heh.",
                 "Sahil: I been looking for you from so long.",
                 "Nishi: Were you now...",
                 "Sahil: Never thought I'd see you outside dreams.",
                 "Sahil: I picked up some flowers for you."
             ], () => {
                 // --- ACTION: Handover Visuals ---
                 // 1. Player drops flowers (Visual update via handleMovement paused, so manual update)
                 this.gameState.setFlag('hasBouquet', false);
                 console.log('DEBUG: Handover direction:', this.player.currentDirection);
                 const safeDirection = this.player.currentDirection || 'front'; // Fallback to 'front' if undefined
                 this.player.setTexture('player-' + safeDirection);
                 
                 // 2. Girl takes flowers
                 this.girl.setTexture('gf_flower_left');
                 
                 // Part 2: The reaction
                 this.dialogueSystem.showConversation([
                     "*You hand over the bouquet*",
                     "Nishi: It's beautiful...but why?",
                     "Sahil: Its cause..",
                     "Sahil: I love you so much and i want to spend the rest of my life with you.",
                     "Sahil: Will you be my valentine nishi?"
                 ], () => {
                     // Trigger Choice Mode
                     this.awaitingValentineChoice = true;
                     this.dialogueSystem.show("Press Y for Yes, N for No");
                 });
             });
        }, '?');
        
        // Setup initial interaction state
        if (this.gameState.getFlag('metGirl')) {
            this.girlInteraction.active = true;
            this.girlInteraction.label = 'Talk';
        } else {
            this.girlInteraction.active = false;
        }
    }
    
    update() {
        this.handleInput();
        if (this.interactionManager) this.interactionManager.update();
        
        // Prevent movement during dialogue or death
        if (this.dialogueSystem.isActive || this.isDying) {
            this.player.setVelocity(0);
            if (this.gameState.getFlag('metGirl')) {
                this.girl.setVelocity(0);
            }
            return;
        }
        
        // Update girl interaction position to follow her (post-game)
        if (this.gameState.getFlag('metGirl') && this.girlInteraction) {
            this.girlInteraction.x = this.girl.x;
            this.girlInteraction.y = this.girl.y;
        }
        
        this.handleMovement();
    }
    
    handleInput() {
        // Handle Valentine Choice
        if (this.awaitingValentineChoice) {
            if (this.dialogueSystem.currentText && this.dialogueSystem.currentText.includes("Press Y for Yes")) {
                if (Phaser.Input.Keyboard.JustDown(this.yKey)) {
                    this.awaitingValentineChoice = false;
                    this.dialogueSystem.hide();
                    
                    // --- 1. IMMEDIATE MUSIC TRANSITION ---
                    this.sound.stopAll(); // Ensure clean slate
                    const bg3 = this.sound.add('bg3-music', { loop: false, volume: 0.4 });
                    bg3.play();
                    
                    bg3.once('complete', () => {
                         const bg2 = this.sound.add('bg2-music', { loop: true, volume: 0.15 });
                         bg2.play();
                    });

                    // YES RESPONSE
                    this.dialogueSystem.showConversation([
                        "Nishi: YESSSSSS!!",
                        "(She smiles brightly.)",
                        "Sahil: You made me the happiest person ever."
                    ], () => {
                        this.gameState.setFlag('metGirl', true);

                        // --- 2. WORLD UPDATE (Instant Post-Game State) ---
                        
                        // Update Cat: Move to post-game spot (near bridge)
                        this.cat.setPosition(300, 750);
                        this.cat.enableBody(true, 300, 750, true, true);
                        this.cat.setVisible(true);
                        
                        // Update Cat Interaction
                        if (this.catInteraction) {
                             this.catInteraction.x = 300;
                             this.catInteraction.y = 750;
                             this.catInteraction.label = 'Pet';
                             this.catInteraction.active = true;
                        }

                        // ENABLE GIRL PHYSICS FOR INDEPENDENT MOVEMENT
                        this.girl.enableBody(true, this.girl.x, this.girl.y, true, true);
                        this.girl.setCollideWorldBounds(true);
                        this.girl.setImmovable(false); // Make her movable
                        this.girl.body.setBounce(0);
                        this.girl.currentDirection = 'left';
                        
                        // Add colliders for the Girl
                        if (this.wallsLayer) this.physics.add.collider(this.girl, this.wallsLayer, () => this.playWallHit());
                        if (this.bushLayer) this.physics.add.collider(this.girl, this.bushLayer, () => this.playWallHit());
                        if (this.waterLayer) this.physics.add.collider(this.girl, this.waterLayer, () => this.playWallHit());
                        if (this.fenceLayer) this.physics.add.collider(this.girl, this.fenceLayer, () => this.playWallHit());
                        if (this.treesLayer) this.physics.add.collider(this.girl, this.treesLayer, () => this.playWallHit());
                        if (this.cat) this.physics.add.collider(this.girl, this.cat);
                        if (this.injuredMan) this.physics.add.collider(this.girl, this.injuredMan);
                        
                        // UNLOCK FRAGMENT: Bloom
                        if (window.MemoryRegistry && window.MemoryRegistry.unlock('flowers_memory')) {
                            this.toast.show('Memory Fragment: Bloom', '💐');
                        }
                        
                        this.toast.show('Dream Completed!', '❤️');
                        
                        // Mark game as completed
                        this.gameState.setGameCompleted(true);
                        
                        // Update interaction label to "Talk"
                        this.girlInteraction.label = 'Talk';
                    });
                } else if (Phaser.Input.Keyboard.JustDown(this.nKey)) {
                    this.awaitingValentineChoice = false;
                    this.dialogueSystem.hide();
                    
                    // NO RESPONSE - THE TWIST ENDING
                    this.dialogueSystem.showConversation([
                        "Nishi: bkl..",
                        "Nishi: After searching for me all this time...",
                        "Nishi: This is all you have to offer?",
                        "Sahil: I... I thought you'd like them.",
                        "Nishi: I don't like flowers, Sahil.",
                        "Nishi: I like memories.",
                        "Nishi: And I think I'll take yours."
                    ], () => {
                        this.triggerStabbingEnding();
                    });
                }
                return;
            }
        }

        // Handle mushroom choice (Y/N) - block all other input ONLY when on the choice line
        if (this.awaitingMushroomChoice) {
            // Only capture input if we are on the actual choice line
            if (this.dialogueSystem.currentText && this.dialogueSystem.currentText.includes("Press Y for Yes")) {
                if (Phaser.Input.Keyboard.JustDown(this.yKey)) {
                    this.awaitingMushroomChoice = false;
                    this.dialogueSystem.hide(); // Clear "Press Y/N"
                    this.eatMushroom();
                } else if (Phaser.Input.Keyboard.JustDown(this.nKey)) {
                    this.awaitingMushroomChoice = false;
                    this.currentMushroomTile = null;
                    
                    this.dialogueSystem.hide(); // Clear "Press Y/N" before showing new text
                    this.dialogueSystem.showConversation([
                        "(Better not risk it.)",
                        "(I'll leave them alone.)"
                    ]);
                }
                // Don't process any other input (including E key) when waiting for Y/N
                return;
            }
        }
        
        // Normal E key handling (Works for previous lines of mushroom dialogue too)
        if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
            if (this.dialogueSystem.isActive) {
                this.dialogueSystem.hide();
            } else {
                this.interactionManager.tryInteract();
            }
        }
    }
    
    eatMushroom() {
        // Remove the mushroom tile
        if (this.currentMushroomTile) {
            this.mushroomLayer.removeTileAt(this.currentMushroomTile.x, this.currentMushroomTile.y);
            this.currentMushroomTile.interaction.active = false;
        }
        
        // Random chance: 70% Poison, 30% Safe
        const isPoison = Math.random() < 0.7;
        
        if (isPoison) {
            // POISON MUSHROOM
            this.dialogueSystem.showConversation([
                "(I take a bite...)",
                "(Hmm, tastes a bit strange...)",
                "(Wait... something's wrong...)"
            ]);
            
            // Start poison death sequence after dialogue
            this.time.delayedCall(4000, () => {
                this.triggerPoisonDeath();
            });
        } else {
            // SAFE MUSHROOM
            this.dialogueSystem.showConversation([
                "(I take a bite...)",
                "(It tastes somewhat earthy...)",
                "(But I feel fine.)",
                "(Not bad.)"
            ]);
        }
    }
    
    triggerPoisonDeath() {
        // Disable player movement
        this.player.setVelocity(0);
        this.isDying = true;

        // Stop background music and play death sound
        if (this.bgMusic) this.bgMusic.stop();
        if (this.deathSound) this.deathSound.play();
        
        // Create red overlay for poison effect
        const redOverlay = this.add.rectangle(
            this.cameras.main.scrollX + this.cameras.main.width / 2,
            this.cameras.main.scrollY + this.cameras.main.height / 2,
            this.cameras.main.width * 2,
            this.cameras.main.height * 2,
            0xff0000,
            0
        );
        redOverlay.setScrollFactor(0);
        redOverlay.setDepth(1000);
        
        // Flash red multiple times with increasing intensity
        let flashCount = 0;
        const flashInterval = this.time.addEvent({
            delay: 300,
            repeat: 8,
            callback: () => {
                flashCount++;
                const intensity = Math.min(0.7, flashCount * 0.08);
                
                this.tweens.add({
                    targets: redOverlay,
                    alpha: intensity,
                    duration: 150,
                    yoyo: true,
                    ease: 'Sine.easeInOut'
                });
                
                // Shake camera
                this.cameras.main.shake(200, 0.005 * flashCount);
            }
        });
        
        
        // Show death message with dramatic text
        this.time.delayedCall(2000, () => {
            this.dialogueSystem.showConversation([
                "(The world is spinning...)",
                "(I can't... breathe...)"
            ]);
        });
        
        // Final fade to black and show YOU DIED
        this.time.delayedCall(3500, () => {
            // Stop death sound as we transition to black
            if (this.deathSound) this.deathSound.stop();
            
            this.tweens.add({
                targets: redOverlay,
                alpha: 0.9,
                duration: 1000,
                ease: 'Sine.easeIn',
                onComplete: () => {
                    this.dialogueSystem.hide();
                    
                    // Create black overlay
                    const blackOverlay = this.add.rectangle(
                        this.cameras.main.scrollX + this.cameras.main.width / 2,
                        this.cameras.main.scrollY + this.cameras.main.height / 2,
                        this.cameras.main.width * 2,
                        this.cameras.main.height * 2,
                        0x000000,
                        0
                    );
                    blackOverlay.setScrollFactor(0);
                    blackOverlay.setDepth(1001);
                    
                    this.tweens.add({
                        targets: blackOverlay,
                        alpha: 1,
                        duration: 500,
                        onComplete: () => {
                            // Create "YOU DIED" text
                            const deathText = this.add.text(
                                this.cameras.main.width / 2,
                                this.cameras.main.height / 2,
                                'YOU DIED',
                                {
                                    fontSize: '64px',
                                    fontFamily: 'Arial',
                                    color: '#ff0000',
                                    stroke: '#000000',
                                    strokeThickness: 8,
                                    align: 'center'
                                }
                            );
                            deathText.setOrigin(0.5);
                            deathText.setScrollFactor(0);
                            deathText.setDepth(1002);
                            deathText.setAlpha(0);
                            
                            // Subtitle text
                            const subtitleText = this.add.text(
                                this.cameras.main.width / 2,
                                this.cameras.main.height / 2 + 60,
                                'Poisoned by mushrooms',
                                {
                                    fontSize: '24px',
                                    fontFamily: 'Arial',
                                    color: '#ffffff',
                                    align: 'center'
                                }
                            );
                            subtitleText.setOrigin(0.5);
                            subtitleText.setScrollFactor(0);
                            subtitleText.setDepth(1002);
                            subtitleText.setAlpha(0);
                            
                            // Fade in death text
                            this.tweens.add({
                                targets: [deathText, subtitleText],
                                alpha: 1,
                                duration: 1000,
                                ease: 'Power2'
                            });
                            
                            // Auto-restart after 3 seconds
                            this.time.delayedCall(3000, () => {
                                this.scene.restart();
                            });
                        }
                    });
                }
            });
        });
    }
    
    triggerStabbingEnding() {
        // Disable player movement
        this.player.setVelocity(0);
        this.isDying = true;

        // Stop background music and play death sound (for the stab)
        if (this.bgMusic) this.bgMusic.stop();
        if (this.deathSound) this.deathSound.play();

        // WIPE ALL MEMORIES (Fragments deleted)
        if (window.MemoryRegistry) {
            window.MemoryRegistry.reset();
        }

        // Visual effects for stabbing
        this.cameras.main.flash(500, 255, 0, 0); // Red flash
        this.cameras.main.shake(1000, 0.02);

        // Flash screen red several times
        let flashCount = 0;
        const flashTimer = this.time.addEvent({
            delay: 150,
            repeat: 5,
            callback: () => {
                flashCount++;
                this.cameras.main.flash(100, 150, 0, 0);
            }
        });

        // Final sequence
        this.time.delayedCall(2000, () => {
            // Create black overlay
            const blackOverlay = this.add.rectangle(
                this.cameras.main.scrollX + this.cameras.main.width / 2,
                this.cameras.main.scrollY + this.cameras.main.height / 2,
                this.cameras.main.width * 2,
                this.cameras.main.height * 2,
                0x000000,
                0
            );
            blackOverlay.setScrollFactor(0);
            blackOverlay.setDepth(1001);

            this.tweens.add({
                targets: blackOverlay,
                alpha: 1,
                duration: 1000,
                onComplete: () => {
                    this.dialogueSystem.hide();

                    // Create "MEMORIES ERASED" text
                    const erasedText = this.add.text(
                        this.cameras.main.width / 2,
                        this.cameras.main.height / 2,
                        'MEMORIES ERASED',
                        {
                            fontSize: '12px',
                            fontFamily: '"Press Start 2P"',
                            color: '#ff0000',
                            align: 'center'
                        }
                    );
                    erasedText.setOrigin(0.5);
                    erasedText.setScrollFactor(0);
                    erasedText.setDepth(1002);

                    // Auto-restart after 4 seconds to BootScene (Full Wipe feel)
                    this.time.delayedCall(4000, () => {
                        this.scene.start('BootScene');
                    });
                }
            });
        });
    }
    
    handleMovement() {
        if (this.isDying || this.isChopping) return;
        
        const speed = 70;
        
        // --- 1. HANDLE PLAYER MOVEMENT (WASD ONLY) ---
        this.player.setVelocity(0);
        let playerNewDirection = this.player.currentDirection;
        let playerIsMoving = false;
        
        if (this.wasd.left.isDown) {
            this.player.setVelocityX(-speed);
            playerNewDirection = 'left';
            playerIsMoving = true;
        } else if (this.wasd.right.isDown) {
            this.player.setVelocityX(speed);
            playerNewDirection = 'right';
            playerIsMoving = true;
        }
        
        if (this.wasd.up.isDown) {
            this.player.setVelocityY(-speed);
            playerNewDirection = 'back';
            playerIsMoving = true;
        } else if (this.wasd.down.isDown) {
            this.player.setVelocityY(speed);
            playerNewDirection = 'front';
            playerIsMoving = true;
        }
        
        // Update player sprite
        let playerTexture = 'player-' + playerNewDirection;
        if (this.gameState.getFlag('hasBouquet') && playerNewDirection !== 'back' && !this.gameState.getFlag('metGirl')) {
            playerTexture += '-flower';
        }
        
        if (this.player.texture.key !== playerTexture) {
            this.player.setTexture(playerTexture);
            this.player.currentDirection = playerNewDirection;
        }
        
        if (this.player.body.velocity.x !== 0 && this.player.body.velocity.y !== 0) {
            this.player.body.velocity.normalize().scale(speed);
        }

        // --- 2. HANDLE GIRL MOVEMENT (ARROW KEYS ONLY) ---
        if (this.gameState.getFlag('metGirl')) {
            this.girl.setVelocity(0);
            let girlNewDirection = this.girl.currentDirection || 'left';
            let girlIsMoving = false;

            if (this.cursors.left.isDown) {
                this.girl.setVelocityX(-speed);
                girlNewDirection = 'left';
                girlIsMoving = true;
            } else if (this.cursors.right.isDown) {
                this.girl.setVelocityX(speed);
                girlNewDirection = 'right';
                girlIsMoving = true;
            }

            if (this.cursors.up.isDown) {
                this.girl.setVelocityY(-speed);
                girlNewDirection = 'back';
                girlIsMoving = true;
            } else if (this.cursors.down.isDown) {
                this.girl.setVelocityY(speed);
                girlNewDirection = 'front';
                girlIsMoving = true;
            }

            // Update girl sprite - use flower sprites in post-game (except back)
            let girlTexture = 'gf';
            if (girlNewDirection === 'back') {
                girlTexture += '_back'; // Back is same with or without flowers
            } else {
                girlTexture += '_flower_' + girlNewDirection; // Use flower sprites for front, left, right
            }
            if (this.girl.texture.key !== girlTexture) {
                this.girl.setTexture(girlTexture);
                this.girl.currentDirection = girlNewDirection;
            }

            if (this.girl.body.velocity.x !== 0 && this.girl.body.velocity.y !== 0) {
                this.girl.body.velocity.normalize().scale(speed);
            }
        }
        
        // Handle walk sound (if either is moving)
        const isEitherMoving = (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0) || 
                              (this.gameState.getFlag('metGirl') && (this.girl.body.velocity.x !== 0 || this.girl.body.velocity.y !== 0));
        
        if (isEitherMoving) {
            if (!this.walkSound.isPlaying) {
                this.walkSound.play();
            }
        } else {
            if (this.walkSound.isPlaying) {
                this.walkSound.stop();
            }
        }
    }
    
    playWallHit() {
        const now = this.time.now;
        // Check if either player is trying to move (pressing keys)
        const isTryingToMove = this.wasd.left.isDown || this.wasd.right.isDown ||
                               this.wasd.up.isDown || this.wasd.down.isDown ||
                               this.cursors.left.isDown || this.cursors.right.isDown ||
                               this.cursors.up.isDown || this.cursors.down.isDown;

        // Increase cooldown to 3 seconds to be absolutely sure it doesn't "repeat" annoyingly
        if (isTryingToMove && now - this.lastWallHitTime > 3000) {
            this.playSound('wallhit', { volume: 0.3 });
            this.lastWallHitTime = now;
        }
    }

    /**
     * Helper to play sound with "ducking" (muting BG music)
     */
    playSound(key, config = {}) {
        if (!this.cache.audio.exists(key)) return;
        
        // 1. Create a sound instance to get access to events and properties
        const sound = this.sound.add(key, config);
        
        // 2. Duck BG music if playing
        let musicWasMuted = false;
        if (this.bgMusic && this.bgMusic.isPlaying && !this.bgMusic.mute) {
            this.bgMusic.setMute(true);
            musicWasMuted = true;
        }

        // 3. Play the sound
        sound.play();

        // 4. Handle un-ducking when sound finishes
        const restoreMusic = () => {
            if (musicWasMuted && this.bgMusic) {
                this.bgMusic.setMute(false);
            }
            sound.destroy(); // Cleanup instance
        };

        sound.once('complete', restoreMusic);
        
        // Fallback safety (in case 'complete' doesn't fire for some reason)
        // Set fallback to 5 seconds or sound duration if known
        const duration = (sound.duration || 3) * 1000;
        this.time.delayedCall(duration + 500, () => {
             if (sound && sound.isPlaying) return; // Still playing? fine.
             restoreMusic();
        });
    }
}

window.GameScene = GameScene;
