/**
 * Boot Scene
 * The startup sequence for the Memory Device
 */
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Just load the minimal assets for the boot sequence
        // We defer global asset loading to MenuScene to mimic "boot up"
        this.load.audio('startup', 'assets/sounds/startup.mp3'); 
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // 1. Black Screen (Initial State)
        this.cameras.main.setBackgroundColor('#000000');
        
        // Hide HTML Loader is now handled by the user clicking the welcome screen
        // const loader = document.getElementById('page-loader');
        // if (loader) loader.classList.add('hidden');
        
        // 2. Text Object (Hidden initially)
        const text = this.add.text(width / 2, height / 2, 'MEMORY DEVICE\nv 1.0', {
            fontFamily: 'Press Start 2P',
            fontSize: '16px',
            color: '#a78bfa',
            align: 'center'
        }).setOrigin(0.5);
        text.setAlpha(0);

        // 3. Boot Sequence Animation
        this.time.delayedCall(500, () => {
             // Fade Text In
             this.tweens.add({
                 targets: text,
                 alpha: 1,
                 duration: 1000,
                 ease: 'Power2',
                 onComplete: () => {
                     // Hold...
                     this.time.delayedCall(1500, () => {
                         // Fade Text Out
                         this.tweens.add({
                             targets: text,
                             alpha: 0,
                             duration: 800,
                             onComplete: () => {
                                 // Transition to Menu
                                 this.scene.start('MenuScene');
                             }
                         });
                     });
                 }
             });
        });

        // Optional: startup sound if we had one
        // if (this.sound.get('startup')) this.sound.play('startup');
    }
}

window.BootScene = BootScene;
