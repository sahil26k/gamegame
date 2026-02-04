/**
 * Main Game Configuration
 */

const config = {
    type: Phaser.AUTO,
    width: 480,
    height: 320,
    parent: 'game-canvas',
    backgroundColor: '#1a1a1a',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene, MenuScene, GameScene, FragmentViewerScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: true,
    roundPixels: true
};

// Initialize game
const game = new Phaser.Game(config);
