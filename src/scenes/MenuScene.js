/**
 * MenuScene: Main landing menu with title, high score, start button, and how-to-play popup.
 */
import { gameState } from '../data/scoring.js';
import { soundManager } from '../audio/SoundManager.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Background gradient glow
    const bgGraphics = this.add.graphics();
    bgGraphics.fillGradientStyle(0x2e1045, 0x2e1045, 0x12091f, 0x12091f, 1);
    bgGraphics.fillRect(0, 0, width, height);

    // Decorative toran header
    for (let x = 40; x < width; x += 80) {
      this.add.image(x, 20, 'toran').setScale(1.1);
    }

    // Diyas flanking top corners
    this.add.image(45, 45, 'diya').setScale(1.1);
    this.add.image(width - 45, 45, 'diya').setScale(1.1).setFlipX(true);

    // Divine Ganesha Emblem in center-top
    const emblem = this.add.image(width / 2, 110, 'ganesha_emblem').setScale(1.1);
    this.tweens.add({
      targets: emblem,
      scale: 1.18,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Title
    this.add.text(width / 2, 185, 'GANESHA', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '44px',
      fontWeight: '900',
      color: '#ffd54f',
      stroke: '#b71c1c',
      strokeThickness: 5,
      shadow: { blur: 15, color: '#ff7700', fill: true }
    }).setOrigin(0.5);

    this.add.text(width / 2, 230, 'THE 21 MODAKS', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '28px',
      fontWeight: '700',
      color: '#ffffff',
      letterSpacing: 4,
      stroke: '#4a148c',
      strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(width / 2, 265, '🌸 A Festival Adventure with Mushika 🌸', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '16px',
      fontWeight: '600',
      color: '#ff9e42'
    }).setOrigin(0.5);

    // Mushika Hero Mascot in center
    const mushika = this.add.image(width / 2 - 80, 360, 'mushika').setScale(1.8);
    const modak = this.add.image(width / 2 + 80, 355, 'modak').setScale(1.6);

    this.tweens.add({
      targets: mushika,
      y: 350,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Quad.easeInOut'
    });

    this.tweens.add({
      targets: modak,
      y: 345,
      angle: 8,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // High Score Badge
    const highScore = gameState.getHighScore();
    const hsBox = this.add.container(width / 2, 330);
    const hsBg = this.add.graphics();
    hsBg.fillStyle(0x4a148c, 0.7);
    hsBg.lineStyle(1.5, 0xffd54f, 0.8);
    hsBg.fillRoundedRect(-110, -18, 220, 36, 18);
    hsBg.strokeRoundedRect(-110, -18, 220, 36, 18);
    const hsText = this.add.text(0, 0, `🏆 HIGH SCORE: ${highScore}`, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '15px',
      fontWeight: '700',
      color: '#ffd54f'
    }).setOrigin(0.5);
    hsBox.add([hsBg, hsText]);

    // Play Button
    this.createButton(width / 2, 440, '▶ START FESTIVAL', '#1b5e20', '#2e7d32', () => {
      soundManager.playBellChime();
      gameState.reset();
      this.scene.start('StoryScene');
    });

    // How to Play Button
    this.createButton(width / 2, 510, '📖 HOW TO PLAY', '#ff7700', '#e65100', () => {
      soundManager.playPickupDing();
      this.showHowToPlayModal();
    });

    // Audio Mute toggle button (top right)
    this.createMuteButton(width - 50, 45);
  }

  createButton(x, y, text, colBg, colHover, callback) {
    const btn = this.add.container(x, y);
    const w = 240;
    const h = 50;

    const bg = this.add.graphics();
    bg.fillStyle(Phaser.Display.Color.HexStringToColor(colBg).color, 1);
    bg.lineStyle(2, 0xffd54f, 1);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 25);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 25);

    const label = this.add.text(0, 0, text, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '18px',
      fontWeight: '800',
      color: '#ffffff'
    }).setOrigin(0.5);

    btn.add([bg, label]);
    btn.setSize(w, h);
    btn.setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(Phaser.Display.Color.HexStringToColor(colHover).color, 1);
      bg.lineStyle(2, 0xffffff, 1);
      bg.fillRoundedRect(-w / 2, -h / 2, w, h, 25);
      bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 25);
      btn.setScale(1.04);
    });

    btn.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(Phaser.Display.Color.HexStringToColor(colBg).color, 1);
      bg.lineStyle(2, 0xffd54f, 1);
      bg.fillRoundedRect(-w / 2, -h / 2, w, h, 25);
      bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 25);
      btn.setScale(1.0);
    });

    btn.on('pointerdown', callback);

    return btn;
  }

  createMuteButton(x, y) {
    const muteBtn = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.fillStyle(0x212121, 0.7);
    bg.lineStyle(1.5, 0xffd54f, 0.8);
    bg.fillCircle(0, 0, 20);
    bg.strokeCircle(0, 0, 20);

    const icon = this.add.text(0, 0, '🔊', { fontSize: '18px' }).setOrigin(0.5);
    muteBtn.add([bg, icon]);
    muteBtn.setSize(40, 40);
    muteBtn.setInteractive({ useHandCursor: true });

    muteBtn.on('pointerdown', () => {
      const isMuted = soundManager.toggleMute();
      icon.setText(isMuted ? '🔇' : '🔊');
    });
  }

  showHowToPlayModal() {
    const { width, height } = this.scale;
    const modal = this.add.container(0, 0).setDepth(100);

    // Dim overlay
    const dim = this.add.rectangle(0, 0, width, height, 0x000000, 0.85).setOrigin(0);
    dim.setInteractive(); // Block clicks below

    // Dialog card
    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x1a092b, 1);
    cardBg.lineStyle(3, 0xffd54f, 1);
    cardBg.fillRoundedRect(50, 40, width - 100, height - 80, 16);
    cardBg.strokeRoundedRect(50, 40, width - 100, height - 80, 16);

    const title = this.add.text(width / 2, 75, 'HOW TO PLAY', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '26px',
      fontWeight: '800',
      color: '#ffd54f'
    }).setOrigin(0.5);

    const info = this.add.text(80, 115, 
      `🎯 MISSION: Help Mushika gather 21 Modaks across 5 festival challenges!\n\n` +
      `🏃 1. Modak Run: Arrow keys / A-D (or tap sides) to switch lanes & collect modaks.\n` +
      `🔔 2. Wisdom Memory: Watch the glowing temple bells and repeat the sequence.\n` +
      `🛕 3. Pandal Builder: Drag & drop holy offerings into their glowing outlines.\n` +
      `🌱 4. Eco Sort: Catch organic offerings in the basket; avoid plastic waste.\n` +
      `🥁 5. Dhol Rhythm: Press A/S/D/F (or tap drum pads) as modaks hit markers.\n\n` +
      `✨ ABILITIES:\n` +
      `💡 Wisdom Hint (-25 pts)  •  ✨ Vighnaharta (clear obstacles)  •  🛡 Blessing (saves 1st mistake)`,
      {
        fontFamily: 'Outfit, sans-serif',
        fontSize: '14px',
        color: '#ffffff',
        lineSpacing: 5,
        wordWrap: { width: width - 160 }
      }
    );

    // Close button
    const closeBtn = this.add.container(width / 2, height - 75);
    const closeBg = this.add.graphics();
    closeBg.fillStyle(0xc2185b, 1);
    closeBg.lineStyle(2, 0xffd54f, 1);
    closeBg.fillRoundedRect(-80, -20, 160, 40, 20);
    closeBg.strokeRoundedRect(-80, -20, 160, 40, 20);
    const closeText = this.add.text(0, 0, 'GOT IT!', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '16px',
      fontWeight: '800',
      color: '#ffffff'
    }).setOrigin(0.5);
    closeBtn.add([closeBg, closeText]);
    closeBtn.setSize(160, 40);
    closeBtn.setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => {
      soundManager.playDholThump(120);
      modal.destroy();
    });

    modal.add([dim, cardBg, title, info, closeBtn]);
  }
}
