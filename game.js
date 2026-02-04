// Phaser 3 Game Configuration
const config = {
    type: Phaser.AUTO,
    width: 480,   // Retro resolution
    height: 320,  // Retro resolution
    parent: 'game-canvas',
    backgroundColor: '#1a1a1a',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: true,  // Crisp pixel rendering
    roundPixels: true  // Prevent sub-pixel rendering
};

const game = new Phaser.Game(config);

let player;
let cursors;
let wasd;
let map;

// Dialogue system
let dialogueBox;
let dialogueText;
let isDialogueActive = false;
let currentDialogue = "";
let dialogueIndex = 0;
let dialogueTimer;

function preload() {
    // Load the map from assets/maps folder
    this.load.tilemapTiledJSON('map', 'assets/maps/map.json');
    
    // Load tilesets from assets/tilesets folder
    this.load.image('decor', 'assets/tilesets/decor.png');
    this.load.image('grass', 'assets/tilesets/grass.png');
    this.load.image('bush', 'assets/tilesets/bush.png');
    
    // Load player sprites (4 directions)
    // Each sprite is 303x539, we'll scale it down to fit 32x32 tiles
    this.load.image('player-front', 'assets/sprites/player-front.png');
    this.load.image('player-back', 'assets/sprites/player-back.png');
    this.load.image('player-left', 'assets/sprites/player-left.png');
    this.load.image('player-right', 'assets/sprites/player-right.png');
}

function create() {
    // Create the tilemap
    map = this.make.tilemap({ key: 'map' });
    
    // Add tilesets - names must match the "name" field in map.json
    const decorTileset = map.addTilesetImage('decor', 'decor');
    const grassTileset = map.addTilesetImage('grass', 'grass');
    const bushTileset = map.addTilesetImage('bush', 'bush');
    
    // Create layers - names must match layer names in map.json
    const allTilesets = [decorTileset, grassTileset, bushTileset];
    
    const groundLayer = map.createLayer('ground', allTilesets, 0, 0);
    const waterLayer = map.createLayer('water', allTilesets, 0, 0);
    const decorLayer = map.createLayer('decor', allTilesets, 0, 0);
    const wallsLayer = map.createLayer('walls', allTilesets, 0, 0);
    const bushLayer = map.createLayer('bush', allTilesets, 0, 0);
    
    // Set collision on walls layer
    if (wallsLayer) {
        wallsLayer.setCollisionByExclusion([-1]);  // All wall tiles are solid
    }
    
    // Set collision on bush layer (only on tiles that have bushes, not empty tiles)
    if (bushLayer) {
        bushLayer.setCollisionByExclusion([-1, 0]);  // Exclude -1 (no tile) and 0 (empty)
    }
    
    // Create player sprite (start with front-facing)
    player = this.physics.add.sprite(640, 512, 'player-front');
    
    // Scale down the sprite to fit 32x32 tile size
    // Original: 303x539, Target: 32x32
    const scaleX = 32 / 303;
    const scaleY = 32 / 539;
    const scale = Math.min(scaleX, scaleY); // Use smaller scale to fit within 32x32
    player.setScale(scale);
    
    player.setDepth(5);
    player.setCollideWorldBounds(true);
    
    // Track player direction
    player.currentDirection = 'front';
    
    // Set world bounds to map size
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    
    // Add collision between player and walls
    if (wallsLayer) {
        this.physics.add.collider(player, wallsLayer);
    }
    
    // Add collision between player and bushes
    if (bushLayer) {
        this.physics.add.collider(player, bushLayer);
    }
    
    // Camera follows player
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player, true, 1.0, 1.0);  // Instant follow (no lag)
    this.cameras.main.setZoom(1.5);  // Zoom in for retro feel
    this.cameras.main.roundPixels = true;  // Prevent sub-pixel rendering artifacts
    
    // Input controls
    cursors = this.input.keyboard.createCursorKeys();
    wasd = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });
    
    
    // Create dialogue box (Pokemon style)
    createDialogueBox(this);
    
    console.log('✅ Phaser game created successfully!');
    console.log('Map size:', map.width, 'x', map.height, 'tiles');
    console.log('Map size:', map.widthInPixels, 'x', map.heightInPixels, 'pixels');
}

function createDialogueBox(scene) {
    const width = 460;
    const height = 90;
    const x = 10;
    const y = 220; // Positioned at very bottom
    
    // Create graphics for the box
    const graphics = scene.add.graphics();
    graphics.setScrollFactor(0); // Fixed to camera
    graphics.setDepth(100);
    
    // Outer border (dark)
    graphics.fillStyle(0x000000, 1);
    graphics.fillRoundedRect(x, y, width, height, 8);
    
    // Inner box (white)
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRoundedRect(x + 4, y + 4, width - 8, height - 8, 6);
    
    // Arrow indicator (bottom right corner)
    const arrowGraphics = scene.add.graphics();
    arrowGraphics.setScrollFactor(0);
    arrowGraphics.setDepth(101);
    arrowGraphics.fillStyle(0x000000, 1);
    // Draw a small down arrow
    arrowGraphics.fillTriangle(
        x + width - 25, y + height - 18,
        x + width - 15, y + height - 18,
        x + width - 20, y + height - 10
    );
    
    // Text with better styling
    dialogueText = scene.add.text(x + 16, y + 16, '', {
        fontFamily: 'Courier New, monospace',
        fontSize: '14px',
        color: '#000000',
        lineSpacing: 4,
        wordWrap: { width: width - 50 }
    });
    dialogueText.setScrollFactor(0);
    dialogueText.setDepth(101);
    
    // Store references
    dialogueBox = {
        graphics: graphics,
        arrow: arrowGraphics,
        text: dialogueText
    };
    
    // Hide initially
    hideDialogue();
}

function showDialogue(message) {
    if (isDialogueActive) return;
    
    isDialogueActive = true;
    currentDialogue = message;
    dialogueIndex = 0;
    
    // Show box
    dialogueBox.graphics.setVisible(true);
    dialogueBox.arrow.setVisible(false); // Hide arrow until text is done
    dialogueBox.text.setVisible(true);
    dialogueBox.text.setText('');
    
    // Start typewriter effect
    typewriterEffect();
}

function typewriterEffect() {
    if (dialogueIndex < currentDialogue.length) {
        dialogueBox.text.setText(currentDialogue.substring(0, dialogueIndex + 1));
        dialogueIndex++;
        dialogueTimer = setTimeout(typewriterEffect, 50); // 50ms per character
    } else {
        // Text complete, show arrow
        dialogueBox.arrow.setVisible(true);
    }
}

function hideDialogue() {
    isDialogueActive = false;
    if (dialogueTimer) {
        clearTimeout(dialogueTimer);
    }
    if (dialogueBox) {
        dialogueBox.graphics.setVisible(false);
        dialogueBox.arrow.setVisible(false);
        dialogueBox.text.setVisible(false);
    }
}

function update() {
    if (!player) return;
    
    const speed = 100;  // Slower speed for retro feel
    
    // E key to toggle dialogue
    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('E'))) {
        if (isDialogueActive) {
            hideDialogue();
        } else {
            showDialogue("Welcome to our adventure!\nPress E to close.");
        }
    }
    
    // Don't allow movement during dialogue
    if (isDialogueActive) {
        player.setVelocity(0);
        return;
    }
    
    // Reset velocity
    player.setVelocity(0);
    
    let newDirection = player.currentDirection;
    
    // Horizontal movement
    if (cursors.left.isDown || wasd.left.isDown) {
        player.setVelocityX(-speed);
        newDirection = 'left';
    } else if (cursors.right.isDown || wasd.right.isDown) {
        player.setVelocityX(speed);
        newDirection = 'right';
    }
    
    // Vertical movement
    if (cursors.up.isDown || wasd.up.isDown) {
        player.setVelocityY(-speed);
        newDirection = 'back';
    } else if (cursors.down.isDown || wasd.down.isDown) {
        player.setVelocityY(speed);
        newDirection = 'front';
    }
    
    // Update sprite if direction changed
    if (newDirection !== player.currentDirection) {
        player.setTexture('player-' + newDirection);
        player.currentDirection = newDirection;
    }
    
    // Normalize diagonal movement
    if (player.body.velocity.x !== 0 && player.body.velocity.y !== 0) {
        player.body.velocity.normalize().scale(speed);
    }
}
