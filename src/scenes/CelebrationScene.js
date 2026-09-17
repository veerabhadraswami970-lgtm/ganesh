/**
 * CelebrationScene: Grand 21-Modak Aarti Finale & Festival Celebration!
 * Interactive Diya Aarti rotation, fireworks, sacred bells, ranking and stats.
 */
import { gameState, SCORING_TABLE } from '../data/scoring.js';
import { soundManager } from '../audio/SoundManager.js';

export default class CelebrationScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CelebrationScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Apply Final 21-Modak Completion Bonus (+2,000 pts)
    gameState.addScore(SCORING_TABLE.FINAL_21_COMPLETION);
    gameState.saveHighScore();

    // Night Sky Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x2a0845, 0x2a0845, 0x0d0217, 0x0d0217, 1);
    bg.fillRect(0, 0, width, height);

    // Toran top border
    for (let x = 40; x < width; x += 80) {
      this.add.image(x, 20, 'toran').setScale(1.1);
    }

    // Top-Left Back Button
    const backBtn = this.add.container(65, 30).setDepth(20);
    const backBg = this.add.graphics();
    backBg.fillStyle(0x12091f, 0.9);
    backBg.lineStyle(1.5, 0xffd54f, 0.8);
    backBg.fillRoundedRect(-45, -16, 90, 32, 16);
    backBg.strokeRoundedRect(-45, -16, 90, 32, 16);

    const backText = this.add.text(0, 0, '⬅ BACK', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '13px',
      fontWeight: '800',
      color: '#ffd54f'
    }).setOrigin(0.5);

    backBtn.add([backBg, backText]);
    backBtn.setSize(90, 32);
    backBtn.setInteractive({ useHandCursor: true });

    backBtn.on('pointerdown', () => {
      soundManager.playBellChime();
      this.scene.start('MenuScene');
    });

    // Grand Title
    this.add.text(width / 2, 45, '🎆 GANPATI BAPPA MORYA! 🎆', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '24px',
      fontWeight: '800',
      color: '#ffd54f',
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.add.text(width / 2, 75, 'All 21 Sacred Modaks Gathered • The Pandal is Blessed!', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '15px',
      fontWeight: '600',
      color: '#ff9e42'
    }).setOrigin(0.5);

    // Center Stage Aura & Divine Bappa
    const aura = this.add.circle(width / 2, 230, 95, 0xffd54f, 0.35);
    this.tweens.add({
      targets: aura,
      scale: 1.35,
      alpha: 0.15,
      duration: 1400,
      yoyo: true,
      repeat: -1
    });

    this.bappa = this.add.image(width / 2, 230, 'ganesha_emblem').setScale(1.6).setDepth(10);
    this.tweens.add({
      targets: this.bappa,
      scale: 1.7,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 21 Golden Modaks Arc around Bappa
    const modakRadius = 135;
    for (let i = 0; i < 21; i++) {
      const angle = -Math.PI + (i * (2 * Math.PI / 21));
      const mx = width / 2 + Math.cos(angle) * modakRadius;
      const my = 230 + Math.sin(angle) * (modakRadius * 0.75);
      const modak = this.add.image(mx, my, 'modak').setScale(0.65).setDepth(8);

      // Floating gentle animation
      this.tweens.add({
        targets: modak,
        y: my - 6,
        duration: 1200 + (i * 50),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // Mascot Mushika celebrating
    const mushika = this.add.image(140, 310, 'mushika').setScale(1.5).setDepth(12);
    this.tweens.add({
      targets: mushika,
      angle: { from: -10, to: 10 },
      y: 295,
      duration: 400,
      yoyo: true,
      repeat: -1
    });

    // Interactive Aarti Diya Plate
    this.aartiAngle = -Math.PI / 2;
    this.aartiDist = 80;
    this.aartiPlate = this.add.image(width / 2, 310, 'aarti_plate').setScale(1.1).setDepth(15);
    this.aartiPlate.setInteractive({ draggable: true, useHandCursor: true });
    this.input.setDraggable(this.aartiPlate);

    this.aartiPlate.on('drag', (pointer, dragX, dragY) => {
      // Rotate around Bappa
      const dx = dragX - width / 2;
      const dy = dragY - 230;
      this.aartiAngle = Math.atan2(dy, dx);
      this.aartiPlate.x = width / 2 + Math.cos(this.aartiAngle) * 90;
      this.aartiPlate.y = 230 + Math.sin(this.aartiAngle) * 90;
      this.spawnAartiSparkles(this.aartiPlate.x, this.aartiPlate.y);
      if (Math.random() < 0.15) {
        soundManager.playBellChime(1200);
      }
    });

    // Auto Aarti Tween
    this.aartiTween = this.tweens.addCounter({
      from: 0,
      to: Math.PI * 2,
      duration: 4000,
      repeat: -1,
      onUpdate: (tween) => {
        if (!this.aartiPlate.input.isDragged) {
          const val = tween.getValue();
          this.aartiPlate.x = width / 2 + Math.cos(val) * 85;
          this.aartiPlate.y = 230 + Math.sin(val) * 85;
        }
      }
    });

    // Results & Rating Card
    const rating = gameState.getRating();
    const cardBg = this.add.graphics().setDepth(10);
    cardBg.fillStyle(0x1a092b, 0.95);
    cardBg.lineStyle(2, 0xffd54f, 1);
    cardBg.fillRoundedRect(width / 2 - 270, 390, 540, 115, 14);
    cardBg.strokeRoundedRect(width / 2 - 270, 390, 540, 115, 14);

    // Final score and rating text
    this.add.text(width / 2, 410, `FINAL SCORE: ${gameState.score}  |  HIGH SCORE: ${gameState.getHighScore()}`, {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '18px',
      fontWeight: '800',
      color: '#ffd54f'
    }).setOrigin(0.5).setDepth(11);

    this.add.text(width / 2, 438, `DEVOTEE RANK: ${rating.title.toUpperCase()}`, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '16px',
      fontWeight: '800',
      color: '#00e676'
    }).setOrigin(0.5).setDepth(11);

    this.add.text(width / 2, 465, `"${rating.desc}"`, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '13px',
      fontWeight: '600',
      fontStyle: 'italic',
      color: '#ffffff'
    }).setOrigin(0.5).setDepth(11);

    // Action Buttons: "Perform Aarti" & "Play Again"
    this.createAartiButton(width / 2 - 130, 545);
    this.createPlayAgainButton(width / 2 + 130, 545);

    // Trigger Initial Celebratory Audio & Fireworks
    soundManager.playVictoryFanfare();
    soundManager.playAartiBellSequence();

    // Continuous Fireworks & Confetti
    this.fireworkTimer = this.time.addEvent({
      delay: 600,
      callback: this.launchRandomFirework,
      callbackScope: this,
      loop: true
    });
  }

  createAartiButton(x, y) {
    const btn = this.add.container(x, y).setDepth(15);
    const bg = this.add.graphics();
    bg.fillStyle(0xff6f00, 1);
    bg.lineStyle(2, 0xffd54f, 1);
    bg.fillRoundedRect(-110, -22, 220, 44, 22);
    bg.strokeRoundedRect(-110, -22, 220, 44, 22);

    const txt = this.add.text(0, 0, '🪔 RING AARTI BELLS', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '14px',
      fontWeight: '800',
      color: '#ffffff'
    }).setOrigin(0.5);

    btn.add([bg, txt]);
    btn.setSize(220, 44);
    btn.setInteractive({ useHandCursor: true });

    btn.on('pointerdown', () => {
      soundManager.playAartiBellSequence();
      this.launchRandomFirework();
      this.spawnAartiSparkles(this.scale.width / 2, 230);
      this.tweens.add({
        targets: btn,
        scale: 1.1,
        duration: 120,
        yoyo: true
      });
    });
  }

  createPlayAgainButton(x, y) {
    const btn = this.add.container(x, y).setDepth(15);
    const bg = this.add.graphics();
    bg.fillStyle(0x1b5e20, 1);
    bg.lineStyle(2, 0xffd54f, 1);
    bg.fillRoundedRect(-110, -22, 220, 44, 22);
    bg.strokeRoundedRect(-110, -22, 220, 44, 22);

    const txt = this.add.text(0, 0, '🔄 PLAY AGAIN', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '14px',
      fontWeight: '800',
      color: '#ffffff'
    }).setOrigin(0.5);

    btn.add([bg, txt]);
    btn.setSize(220, 44);
    btn.setInteractive({ useHandCursor: true });

    btn.on('pointerdown', () => {
      soundManager.playBellChime();
      gameState.reset();
      this.scene.start('MenuScene');
    });
  }

  spawnAartiSparkles(x, y) {
    for (let i = 0; i < 5; i++) {
      const spark = this.add.image(x + Phaser.Math.Between(-20, 20), y + Phaser.Math.Between(-20, 20), 'sparkle').setScale(0.9).setDepth(20);
      this.tweens.add({
        targets: spark,
        y: spark.y - 25,
        alpha: 0,
        duration: 500,
        onComplete: () => spark.destroy()
      });
    }
  }

  launchRandomFirework() {
    const fwX = Phaser.Math.Between(80, this.scale.width - 80);
    const fwY = Phaser.Math.Between(70, 220);
    const colors = [0xffd54f, 0xff4081, 0x00e676, 0x29b6f6, 0xff9100];
    const col = Phaser.Utils.Array.GetRandom(colors);

    soundManager.playFireworkBurst();

    // Burst particles
    for (let i = 0; i < 14; i++) {
      const angle = (i * Math.PI * 2) / 14;
      const speed = Phaser.Math.Between(40, 90);
      const conf = this.add.image(fwX, fwY, 'confetti').setScale(0.9).setTint(col).setDepth(18);

      this.tweens.add({
        targets: conf,
        x: fwX + Math.cos(angle) * speed,
        y: fwY + Math.sin(angle) * speed + 20,
        alpha: 0,
        scale: 0.2,
        duration: 900,
        ease: 'Quad.easeOut',
        onComplete: () => conf.destroy()
      });
    }
  }

  shutdown() {
    if (this.fireworkTimer) this.fireworkTimer.remove();
  }
}
