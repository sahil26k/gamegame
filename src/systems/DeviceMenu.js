/**
 * Device Menu (Pause Menu)
 * Overlay that appears when pressing ESC/M
 */
class DeviceMenu {
    constructor(scene) {
        this.scene = scene;
        this.isVisible = false;
        this.options = [
            { text: 'RESUME', action: 'resume' },
            { text: 'FRAGMENTS', action: 'fragments' },
            { text: 'EXIT', action: 'exit' }
        ];
        this.selectedIndex = 0;
        this.container = null;
    }

    create() {
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;

        this.container = this.scene.add.container(0, 0);
        this.container.setDepth(2000); // Top layer
        this.container.setScrollFactor(0); // Fixed to camera
        this.container.setVisible(false);

        // 1. Overlay Background (Dim)
        const bg = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        bg.setOrigin(0);
        this.container.add(bg);

        // 2. Menu Box
        const boxW = 160;
        const boxH = 120;
        const boxX = width / 2;
        const boxY = height / 2;

        const box = this.scene.add.graphics();
        box.fillStyle(0x1a1a1a, 1);
        box.lineStyle(2, 0xa78bfa, 1);
        box.fillRoundedRect(boxX - boxW/2, boxY - boxH/2, boxW, boxH, 10);
        box.strokeRoundedRect(boxX - boxW/2, boxY - boxH/2, boxW, boxH, 10);
        this.container.add(box);

        // 3. Title
        const title = this.scene.add.text(boxX, boxY - 40, 'DEVICE PAUSED', {
            fontSize: '10px',
            fontFamily: 'Press Start 2P',
            color: '#d8bfd8'
        }).setOrigin(0.5);
        this.container.add(title);

        // 4. Options
        this.menuItems = [];
        this.options.forEach((opt, index) => {
            const y = boxY - 10 + (index * 25);
            const text = this.scene.add.text(boxX, y, opt.text, {
                fontSize: '12px',
                fontFamily: 'Press Start 2P',
                color: '#64748b'
            }).setOrigin(0.5);
            this.container.add(text);
            this.menuItems.push(text);
        });

        // 5. Arrow
        this.arrow = this.scene.add.text(0, 0, '>', {
             fontSize: '12px',
             fontFamily: 'Press Start 2P',
             color: '#a78bfa'
        }).setOrigin(0.5);
        this.container.add(this.arrow);

        this.updateSelection();

        // Input Handling
        this.scene.input.keyboard.on('keydown-UP', () => {
            if (this.isVisible) this.changeSelection(-1);
        });
        this.scene.input.keyboard.on('keydown-DOWN', () => {
             if (this.isVisible) this.changeSelection(1);
        });
        this.scene.input.keyboard.on('keydown-ENTER', () => {
             if (this.isVisible) this.confirm();
        });
        
        // Toggle Keys (ESC, M)
        const toggle = () => this.toggle();
        this.scene.input.keyboard.on('keydown-ESC', toggle);
        this.scene.input.keyboard.on('keydown-M', toggle);
    }

    toggle() {
        this.isVisible = !this.isVisible;
        this.container.setVisible(this.isVisible);
        
        // Play toggle sound directly without ducking music
        const soundKey = this.scene.sound.get('toggle') ? 'toggle' : 'wallhit';
        this.scene.sound.play(soundKey, { volume: 0.4 });

        // Force unmute BG music just in case something else muted it
        if (this.scene.bgMusic) {
             this.scene.bgMusic.setMute(false);
        }

        if (this.isVisible) {
            this.scene.physics.pause();
        } else {
            this.scene.physics.resume();
        }
    }

    changeSelection(delta) {
        this.selectedIndex += delta;
        if (this.selectedIndex < 0) this.selectedIndex = this.options.length - 1;
        if (this.selectedIndex >= this.options.length) this.selectedIndex = 0;
        
        this.updateSelection();
        if (this.scene.playSound) {
            this.scene.playSound('wallhit', { volume: 0.1, detune: 500 });
        } else {
            this.scene.sound.play('wallhit', { volume: 0.1, detune: 500 });
        }
    }

    updateSelection() {
        this.menuItems.forEach((item, index) => {
            const isSelected = index === this.selectedIndex;
            item.setColor(isSelected ? '#a78bfa' : '#64748b');
            
            if (isSelected) {
                this.arrow.setPosition(item.x - (item.width/2) - 15, item.y);
            }
        });
    }

    confirm() {
        const action = this.options[this.selectedIndex].action;
        
        if (action === 'resume') {
            this.toggle();
        } else if (action === 'fragments') {
            // Use switch for cleaner transition (sleeps current, starts target)
            this.scene.scene.switch('FragmentViewerScene'); 
            // Note: DeviceMenu remains 'visible' so it's there when we return
        } else if (action === 'exit') {
            this.scene.scene.start('MenuScene');
        }
    }
}
