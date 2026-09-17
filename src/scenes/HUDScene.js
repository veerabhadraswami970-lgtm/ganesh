/**
 * HUDScene: Persistent overlay HUD for score, 21-modak progress bar, timer, and Ganesha abilities.
 */
import { gameState, SCORING_TABLE } from '../data/scoring.js';
import { soundManager } from '../audio/SoundManager.js';

export default class HUDScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HUDScene' });
  }

  init(data) {
    this.challengeTitle = data.title || 'Challenge';
    this.timeLimit = data.timeLimit || 30;
    this.timeLeft = this.timeLimit;
    this.vighnahartaCooldown = 8; // seconds
    this.vighnahartaTimer = 0;
  }

  create() {
    const { width, height } = this.scale;

    // === TOP HUD BAR ===
    const topBar = this.add.graphics();
    topBar.fillStyle(0x12091f, 0.9);
    topBar.fillRect(0, 0, width, 55);
    topBar.lineStyle(2, 0xffd54f, 0.6);
    topBar.lineBetween(0, 55, width, 55);

    // Top-Left Exit/Back Button
    const backBtn = this.add.container(55, 27);
    const backBg = this.add.graphics();
    backBg.fillStyle(0x1a092b, 0.95);
    backBg.lineStyle(1.5, 0xffd54f, 0.9);
    backBg.fillRoundedRect(-40, -15, 80, 30, 15);
    backBg.strokeRoundedRect(-40, -15, 80, 30, 15);

    const backText = this.add.text(0, 0, '⬅ BACK', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '12px',
      fontWeight: '800',
      color: '#ffd54f'
    }).setOrigin(0.5);

    backBtn.add([backBg, backText]);
    backBtn.setSize(80, 30);
    backBtn.setInteractive({ useHandCursor: true });

    backBtn.on('pointerover', () => {
      backBg.clear();
      backBg.fillStyle(0xc2185b, 1);
      backBg.lineStyle(1.5, 0xffffff, 1);
      backBg.fillRoundedRect(-40, -15, 80, 30, 15);
      backBg.strokeRoundedRect(-40, -15, 80, 30, 15);
      backBtn.setScale(1.05);
    });

    backBtn.on('pointerout', () => {
      backBg.clear();
      backBg.fillStyle(0x1a092b, 0.95);
      backBg.lineStyle(1.5, 0xffd54f, 0.9);
      backBg.fillRoundedRect(-40, -15, 80, 30, 15);
      backBg.strokeRoundedRect(-40, -15, 80, 30, 15);
      backBtn.setScale(1.0);
    });

    backBtn.on('pointerdown', (pointer) => {
      pointer.event.stopPropagation();
      soundManager.playBellChime();
      const activeGameplayScenes = ['ModakRunScene', 'MemoryScene', 'PandalScene', 'EcoScene', 'RhythmScene'];
      activeGameplayScenes.forEach((key) => {
        if (this.scene.isActive(key)) {
          this.scene.stop(key);
        }
      });
      this.scene.stop('HUDScene');
      const goMenu = () => this.scene.start('MenuScene');
      if (window.transition3DScene) {
        window.transition3DScene(goMenu, 'right');
      } else {
        goMenu();
      }
    });

    // Challenge Title
    this.titleText = this.add.text(105, 17, this.challengeTitle, {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '15px',
      fontWeight: '700',
      color: '#ffd54f'
    });

    // Score Display
    this.scoreText = this.add.text(345, 17, `SCORE: ${gameState.score}`, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '16px',
      fontWeight: '800',
      color: '#ffffff'
    });

    // 21-Modak Progress Bar
    this.createModakProgressBar(520, 18);

    // Countdown Timer
    this.timerText = this.add.text(width - 85, 17, `⏱ ${this.timeLeft}s`, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '16px',
      fontWeight: '800',
      color: '#ffd54f'
    });

    // === BOTTOM ABILITY BAR (height 80px) ===
    const bottomBar = this.add.graphics();
    bottomBar.fillStyle(0x12091f, 0.9);
    bottomBar.fillRect(0, height - 75, width, 75);
    bottomBar.lineStyle(1.5, 0xffd54f, 0.5);
    bottomBar.lineBetween(0, height - 75, width, height - 75);

    // Ability 1: 💡 Wisdom Hint (-25 pts)
    this.createHintButton(170, height - 38);

    // Ability 2: ✨ Vighnaharta (Clear Obstacles, 8s Cooldown)
    this.createVighnahartaButton(450, height - 38);

    // Ability 3: 🛡 Ganesha's Blessing (Passive Shield status)
    this.createBlessingBadge(730, height - 38);

    // Timer event
    this.timeEvent = this.time.addEvent({
      delay: 1000,
      callback: this.tickTimer,
      callbackScope: this,
      loop: true
    });

    // Listen to global events
    this.game.events.on('hud:update', this.updateHUD, this);
  }

  createModakProgressBar(x, y) {
    const barWidth = 140;
    const barHeight = 18;

    this.barBg = this.add.graphics();
    this.barBg.fillStyle(0x311b92, 0.8);
    this.barBg.lineStyle(1.5, 0xffd54f, 0.8);
    this.barBg.fillRoundedRect(x, y, barWidth, barHeight, 9);
    this.barBg.strokeRoundedRect(x, y, barWidth, barHeight, 9);

    this.barFill = this.add.graphics();
    this.updateProgressBarFill(x, y, barWidth, barHeight);

    this.modakLabel = this.add.text(x + barWidth + 10, y, `🥟 ${gameState.modaksCollected}/21`, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '15px',
      fontWeight: '700',
      color: '#ffd54f'
    });
  }

  updateProgressBarFill(x = 470, y = 18, barWidth = 140, barHeight = 18) {
    this.barFill.clear();
    const pct = Phaser.Math.Clamp(gameState.modaksCollected / 21, 0, 1);
    if (pct > 0) {
      this.barFill.fillStyle(0xff7700, 1);
      this.barFill.fillRoundedRect(x + 2, y + 2, Math.max(8, (barWidth - 4) * pct), barHeight - 4, 7);
    }
  }

  createHintButton(x, y) {
    const btn = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.fillStyle(0x311b92, 1);
    bg.lineStyle(1.5, 0xffd54f, 1);
    bg.fillRoundedRect(-110, -22, 220, 44, 22);
    bg.strokeRoundedRect(-110, -22, 220, 44, 22);

    const txt = this.add.text(0, 0, '💡 HINT (-25 pts)', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '14px',
      fontWeight: '800',
      color: '#ffd54f'
    }).setOrigin(0.5);

    btn.add([bg, txt]);
    btn.setSize(220, 44);
    btn.setInteractive({ useHandCursor: true });

    btn.on('pointerdown', (pointer) => {
      pointer.event.stopPropagation();
      soundManager.playBellChime(1200);
      gameState.addScore(SCORING_TABLE.HINT_USED);
      gameState.challengeStats.hintsUsed++;
      this.updateHUD();
      this.game.events.emit('ability:hint');
      
      // Floating score deduction text
      this.showFloatingText(x, y - 30, '-25 pts', '#ff9800');
    });

    this.hintBtn = btn;
  }

  createVighnahartaButton(x, y) {
    const btn = this.add.container(x, y);
    this.vigBg = this.add.graphics();
    this.vigBg.fillStyle(0xc2185b, 1);
    this.vigBg.lineStyle(1.5, 0xffd54f, 1);
    this.vigBg.fillRoundedRect(-110, -22, 220, 44, 22);
    this.vigBg.strokeRoundedRect(-110, -22, 220, 44, 22);

    this.vigText = this.add.text(0, 0, '✨ VIGHNAHARTA', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '14px',
      fontWeight: '800',
      color: '#ffffff'
    }).setOrigin(0.5);

    btn.add([this.vigBg, this.vigText]);
    btn.setSize(220, 44);
    btn.setInteractive({ useHandCursor: true });

    btn.on('pointerdown', (pointer) => {
      pointer.event.stopPropagation();
      if (this.vighnahartaTimer > 0) return; // on cooldown

      soundManager.playPowerUpHum();
      this.vighnahartaTimer = this.vighnahartaCooldown;
      this.game.events.emit('ability:vighnaharta');
      this.showFloatingText(x, y - 30, '✨ OBSTACLES REMOVED! ✨', '#ffd54f');
    });

    this.vighnahartaBtn = btn;
  }

  createBlessingBadge(x, y) {
    const badge = this.add.container(x, y);
    this.blessingBg = this.add.graphics();
    this.updateBlessingGraphic();

    this.blessingText = this.add.text(0, 0, gameState.blessingUsed ? '🛡 BLESSING USED' : '🛡 BLESSING: ACTIVE', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '13px',
      fontWeight: '800',
      color: gameState.blessingUsed ? '#9e9e9e' : '#a5d6a7'
    }).setOrigin(0.5);

    badge.add([this.blessingBg, this.blessingText]);
    this.blessingBadge = badge;
  }

  updateBlessingGraphic() {
    this.blessingBg.clear();
    if (gameState.blessingUsed) {
      this.blessingBg.fillStyle(0x37474f, 0.6);
      this.blessingBg.lineStyle(1, 0x78909c, 0.5);
    } else {
      this.blessingBg.fillStyle(0x1b5e20, 0.85);
      this.blessingBg.lineStyle(1.5, 0x66bb6a, 1);
    }
    this.blessingBg.fillRoundedRect(-100, -22, 200, 44, 22);
    this.blessingBg.strokeRoundedRect(-100, -22, 200, 44, 22);
  }

  tickTimer() {
    if (this.timeLeft > 0) {
      this.timeLeft--;
      this.timerText.setText(`⏱ ${this.timeLeft}s`);
      if (this.timeLeft <= 5) {
        this.timerText.setColor('#ff5252');
      }
    } else {
      this.timeEvent.remove();
      this.game.events.emit('challenge:timeup');
    }

    // Handle Vighnaharta cooldown
    if (this.vighnahartaTimer > 0) {
      this.vighnahartaTimer--;
      if (this.vighnahartaTimer > 0) {
        this.vigText.setText(`✨ COOLDOWN (${this.vighnahartaTimer}s)`);
        this.vigBg.clear();
        this.vigBg.fillStyle(0x424242, 0.8);
        this.vigBg.lineStyle(1, 0x757575, 1);
        this.vigBg.fillRoundedRect(-110, -22, 220, 44, 22);
        this.vigBg.strokeRoundedRect(-110, -22, 220, 44, 22);
      } else {
        this.vigText.setText('✨ VIGHNAHARTA');
        this.vigBg.clear();
        this.vigBg.fillStyle(0xc2185b, 1);
        this.vigBg.lineStyle(1.5, 0xffd54f, 1);
        this.vigBg.fillRoundedRect(-110, -22, 220, 44, 22);
        this.vigBg.strokeRoundedRect(-110, -22, 220, 44, 22);
      }
    }
  }

  updateHUD() {
    this.scoreText.setText(`SCORE: ${gameState.score}`);
    this.modakLabel.setText(`🥟 ${gameState.modaksCollected}/21`);
    this.updateProgressBarFill();

    if (gameState.blessingUsed && this.blessingText) {
      this.blessingText.setText('🛡 BLESSING USED');
      this.blessingText.setColor('#9e9e9e');
      this.updateBlessingGraphic();
    }
  }

  showFloatingText(x, y, text, color) {
    const float = this.add.text(x, y, text, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '16px',
      fontWeight: '800',
      color: color,
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.tweens.add({
      targets: float,
      y: y - 25,
      alpha: 0,
      duration: 1000,
      ease: 'Quad.easeOut',
      onComplete: () => float.destroy()
    });
  }

  shutdown() {
    if (this.timeEvent) this.timeEvent.remove();
    this.game.events.off('hud:update', this.updateHUD, this);
  }
}
