/**
 * ResultScene: Challenge summary displaying earned points, modak progress, and next steps.
 */
import { gameState } from '../data/scoring.js';
import { soundManager } from '../audio/SoundManager.js';

export default class ResultScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ResultScene' });
  }

  init(data) {
    this.challengeTitle = data.challengeTitle || 'Challenge';
    this.isSuccess = data.isSuccess !== false;
    this.modaksEarned = data.modaksEarned || 0;
    this.challengeBonus = data.challengeBonus || 0;
    this.fastBonus = data.fastBonus || 0;
    this.perfectBonus = data.perfectBonus || 0;
    this.mistakes = data.mistakes || 0;
    this.nextScene = data.nextScene || null;
    this.nextTitle = data.nextTitle || 'Next Challenge';
    this.nextData = data.nextData || null;
  }

  create() {
    const { width, height } = this.scale;

    // Background gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x2e1045, 0x2e1045, 0x12091f, 0x12091f, 1);
    bg.fillRect(0, 0, width, height);

    // Toran header
    for (let x = 40; x < width; x += 80) {
      this.add.image(x, 20, 'toran').setScale(1.1);
    }

    // Result Card
    const card = this.add.container(width / 2, 280);
    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x1a092b, 0.95);
    cardBg.lineStyle(2.5, 0xffd54f, 1);
    cardBg.fillRoundedRect(-320, -170, 640, 340, 16);
    cardBg.strokeRoundedRect(-320, -170, 640, 340, 16);

    // Title / Status
    const titleText = this.isSuccess ? '🎉 CHALLENGE CLEARED! 🎉' : '⏰ TIME EXPIRED';
    const titleColor = this.isSuccess ? '#ffd54f' : '#ff5252';
    const title = this.add.text(0, -135, titleText, {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '24px',
      fontWeight: '800',
      color: titleColor
    }).setOrigin(0.5);

    const sub = this.add.text(0, -100, this.challengeTitle, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '18px',
      fontWeight: '600',
      color: '#ff9e42'
    }).setOrigin(0.5);

    // Score Breakdown list
    const breakdown = [
      `🥟 Modaks Gathered: +${this.modaksEarned * 100} pts (${this.modaksEarned} Modaks)`,
      `🏆 Challenge Completion: +${this.challengeBonus} pts`,
      this.fastBonus > 0 ? `⚡ Speed Bonus: +${this.fastBonus} pts` : null,
      this.perfectBonus > 0 ? `✨ Perfect Run Bonus (0 Mistakes): +${this.perfectBonus} pts` : null,
      this.mistakes > 0 ? `❌ Mistakes: ${this.mistakes} (-${this.mistakes * 50} pts)` : null
    ].filter(Boolean);

    const breakdownText = this.add.text(-280, -65, breakdown.join('\n\n'), {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '15px',
      fontWeight: '600',
      color: '#ffffff',
      lineSpacing: 2
    });

    // Total Score & 21-Modak Progress Status
    const totalScoreText = this.add.text(0, 80, `TOTAL SCORE: ${gameState.score}  |  TOTAL MODAKS: ${gameState.modaksCollected}/21 🥟`, {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '17px',
      fontWeight: '700',
      color: '#ffd54f'
    }).setOrigin(0.5);

    // Rating indicator
    const rating = gameState.getRating();
    const ratingText = this.add.text(0, 115, `Rank: ${rating.title}`, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '15px',
      fontWeight: '700',
      color: '#00e676'
    }).setOrigin(0.5);

    card.add([cardBg, title, sub, breakdownText, totalScoreText, ratingText]);

    // Button: Continue or Next
    const btn = this.add.container(width / 2, 495);
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x1b5e20, 1);
    btnBg.lineStyle(2, 0xffd54f, 1);
    btnBg.fillRoundedRect(-140, -22, 280, 44, 22);
    btnBg.strokeRoundedRect(-140, -22, 280, 44, 22);

    const btnLabel = this.nextScene ? 'CONTINUE ➔' : 'RETURN TO MENU';
    const btnText = this.add.text(0, 0, btnLabel, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '16px',
      fontWeight: '800',
      color: '#ffffff'
    }).setOrigin(0.5);

    btn.add([btnBg, btnText]);
    btn.setSize(280, 44);
    btn.setInteractive({ useHandCursor: true });

    btn.on('pointerdown', () => {
      soundManager.playBellChime();
      if (this.nextScene && this.scene.get(this.nextScene)) {
        this.scene.start(this.nextScene);
        if (this.nextScene !== 'CelebrationScene' && this.nextData) {
          this.scene.launch('HUDScene', this.nextData);
        }
      } else {
        this.scene.start('MenuScene');
      }
    });
  }
}
