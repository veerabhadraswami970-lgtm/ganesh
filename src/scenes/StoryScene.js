/**
 * StoryScene: Animated narrative introducing the 21 Modak festival quest.
 */
import { gameState } from '../data/scoring.js';
import { soundManager } from '../audio/SoundManager.js';

export default class StoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StoryScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Background gradient
    const bgGraphics = this.add.graphics();
    bgGraphics.fillGradientStyle(0x2e1045, 0x2e1045, 0x12091f, 0x12091f, 1);
    bgGraphics.fillRect(0, 0, width, height);

    // Decorative toran header
    for (let x = 40; x < width; x += 80) {
      this.add.image(x, 20, 'toran').setScale(1.1);
    }

    // Ganesha Divine Icon
    const emblem = this.add.image(width / 2, 110, 'ganesha_emblem').setScale(1.2);
    this.tweens.add({
      targets: emblem,
      scale: 1.28,
      duration: 1600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Story Dialog Card
    const card = this.add.container(width / 2, 305);
    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x1a092b, 0.95);
    cardBg.lineStyle(2.5, 0xffd54f, 1);
    cardBg.fillRoundedRect(-360, -145, 720, 290, 16);
    cardBg.strokeRoundedRect(-360, -145, 720, 290, 16);

    const title = this.add.text(0, -115, '🌟 THE SACRED MISSION 🌟', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '22px',
      fontWeight: '800',
      color: '#ffd54f'
    }).setOrigin(0.5);

    const storyText = 
      `Ganesh Chaturthi has arrived, and Lord Ganesha's grand pandal is being prepared!\n\n` +
      `Mushika, the beloved companion of Bappa, has been entrusted with a sacred task:\n` +
      `Gather all 21 Sacred Modaks by clearing 5 festive challenges before the countdown ends!\n\n` +
      `Dodge obstacles in the streets, remember sacred temple bells, decorate the divine pandal, ` +
      `sort eco-friendly offerings, and play the joyful Nashik Dhol beats!`;

    const body = this.add.text(0, -80, storyText, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '15px',
      color: '#ffffff',
      lineSpacing: 4,
      align: 'center',
      wordWrap: { width: 660 }
    }).setOrigin(0.5, 0);

    // Mascot & Modak inside card
    const mushika = this.add.image(-280, 95, 'mushika').setScale(1.3);
    const modak = this.add.image(280, 95, 'modak').setScale(1.3);

    card.add([cardBg, title, body, mushika, modak]);

    // Start Challenge 1 Button
    const btn = this.add.container(width / 2, 515);
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x1b5e20, 1);
    btnBg.lineStyle(2, 0xffd54f, 1);
    btnBg.fillRoundedRect(-140, -24, 280, 48, 24);
    btnBg.strokeRoundedRect(-140, -24, 280, 48, 24);

    const btnText = this.add.text(0, 0, 'BEGIN CHALLENGE 1 ➔', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '18px',
      fontWeight: '800',
      color: '#ffffff'
    }).setOrigin(0.5);

    btn.add([btnBg, btnText]);
    btn.setSize(280, 48);
    btn.setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => {
      btnBg.clear();
      btnBg.fillStyle(0x2e7d32, 1);
      btnBg.lineStyle(2, 0xffffff, 1);
      btnBg.fillRoundedRect(-140, -24, 280, 48, 24);
      btnBg.strokeRoundedRect(-140, -24, 280, 48, 24);
      btn.setScale(1.04);
    });

    btn.on('pointerout', () => {
      btnBg.clear();
      btnBg.fillStyle(0x1b5e20, 1);
      btnBg.lineStyle(2, 0xffd54f, 1);
      btnBg.fillRoundedRect(-140, -24, 280, 48, 24);
      btnBg.strokeRoundedRect(-140, -24, 280, 48, 24);
      btn.setScale(1.0);
    });

    btn.on('pointerdown', () => {
      soundManager.playBellChime();
      this.scene.start('ModakRunScene');
      this.scene.launch('HUDScene', {
        challengeIndex: 0,
        title: 'Challenge 1: Modak Run',
        targetModaks: 4,
        timeLimit: 30
      });
    });
  }
}
