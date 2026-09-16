/**
 * MemoryScene: Simon-says temple bell sequence mini-game.
 * Listen to the sacred temple bells and repeat the sequence in exact order!
 */
import { gameState, SCORING_TABLE } from '../data/scoring.js';
import { soundManager } from '../audio/SoundManager.js';

export default class MemoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MemoryScene' });
  }

  init() {
    this.bellNotes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    this.bellColors = ['#e53935', '#43a047', '#1e88e5', '#fdd835'];
    this.bellNames = ['Ruby Bell', 'Emerald Bell', 'Sapphire Bell', 'Topaz Bell'];
    this.sequence = [];
    this.playerStep = 0;
    this.currentRound = 1;
    this.totalRounds = 4; // 1 modak per round = 4 modaks
    this.isShowingSequence = false;
    this.canPlayerInput = false;
    this.isGameOver = false;
    this.collectedInRound = 0;
  }

  create() {
    const { width, height } = this.scale;
    this.isGameOver = false;
    this.collectedInRound = 0;
    this.currentRound = 1;
    this.sequence = [];
    this.playerStep = 0;
    this.startTime = this.time.now;

    // Reset challenge stats
    gameState.challengeStats = {
      startTime: this.time.now,
      mistakes: 0,
      hintsUsed: 0,
      modaksEarned: 0,
      ecoActions: 0
    };

    // Make sure HUD is active
    if (!this.scene.isActive('HUDScene')) {
      this.scene.launch('HUDScene', {
        challengeIndex: 1,
        title: 'Challenge 2: Wisdom Memory',
        targetModaks: 4,
        timeLimit: 40
      });
    }

    // Temple Sanctum Background
    this.createSanctumBackground(width, height);

    // Bappa Divine Guidance Emblem
    this.emblem = this.add.image(width / 2, 130, 'ganesha_emblem').setScale(1.1);
    this.tweens.add({
      targets: this.emblem,
      scale: 1.16,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Round / Status Banner
    this.statusText = this.add.text(width / 2, 215, '🌟 Round 1 / 4: Watch & Listen to the Bells! 🌟', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '18px',
      fontWeight: '700',
      color: '#ffd54f',
      align: 'center'
    }).setOrigin(0.5);

    // Create 4 Temple Bells
    this.bells = [];
    this.bellGlows = [];
    const startX = 225;
    const spacing = 150;
    const bellY = 330;

    for (let i = 0; i < 4; i++) {
      const x = startX + i * spacing;

      // Glow halo
      const glow = this.add.circle(x, bellY, 45, Phaser.Display.Color.HexStringToColor(this.bellColors[i]).color, 0).setDepth(2);
      this.bellGlows.push(glow);

      // Bell sprite
      const bell = this.add.image(x, bellY, `bell_${i}`).setScale(1.4).setDepth(5);
      bell.setData('index', i);
      bell.setInteractive({ useHandCursor: true });

      // Key label / Badge under bell
      const keyBox = this.add.graphics().setDepth(5);
      keyBox.fillStyle(0x1a092b, 0.9);
      keyBox.lineStyle(1.5, 0xffd54f, 0.8);
      keyBox.fillRoundedRect(x - 22, bellY + 50, 44, 26, 6);
      keyBox.strokeRoundedRect(x - 22, bellY + 50, 44, 26, 6);

      const keyLabel = this.add.text(x, bellY + 63, `[${i + 1}]`, {
        fontFamily: 'Outfit, sans-serif',
        fontSize: '14px',
        fontWeight: '800',
        color: '#ffd54f'
      }).setOrigin(0.5).setDepth(6);

      // Pointer event on bell
      bell.on('pointerdown', () => {
        if (!this.canPlayerInput || this.isShowingSequence || this.isGameOver) return;
        this.handlePlayerPress(i);
      });

      this.bells.push(bell);
    }

    // Mushika Helper
    this.mushika = this.add.image(100, 430, 'mushika').setScale(1.4).setDepth(8);

    // Keyboard inputs: 1,2,3,4 or Q,W,E,R
    this.input.keyboard.on('keydown', (event) => {
      if (!this.canPlayerInput || this.isShowingSequence || this.isGameOver) return;
      let pressedIndex = -1;
      if (event.key === '1' || event.key === 'q' || event.key === 'Q') pressedIndex = 0;
      else if (event.key === '2' || event.key === 'w' || event.key === 'W') pressedIndex = 1;
      else if (event.key === '3' || event.key === 'e' || event.key === 'E') pressedIndex = 2;
      else if (event.key === '4' || event.key === 'r' || event.key === 'R') pressedIndex = 3;

      if (pressedIndex !== -1) {
        this.handlePlayerPress(pressedIndex);
      }
    });

    // Listen to Divine Abilities
    this.game.events.on('ability:vighnaharta', this.triggerVighnaharta, this);
    this.game.events.on('ability:hint', this.showWisdomHint, this);
    this.game.events.on('challenge:timeup', this.onTimeUp, this);

    // Start Round 1 after a brief delay
    this.time.delayedCall(800, () => {
      this.startNewRound();
    });
  }

  createSanctumBackground(width, height) {
    const bg = this.add.graphics();
    // Temple sanctum gradient
    bg.fillGradientStyle(0x2a0845, 0x2a0845, 0x110224, 0x110224, 1);
    bg.fillRect(0, 0, width, height);

    // Toran on top
    for (let x = 40; x < width; x += 80) {
      this.add.image(x, 20, 'toran').setScale(1.1);
    }

    // Temple Altar Arch
    bg.lineStyle(3, 0xffd54f, 0.5);
    bg.strokeRoundedRect(120, 80, width - 240, height - 170, 20);

    // Side Diyas
    for (let y = 140; y <= 420; y += 90) {
      this.add.image(60, y, 'diya').setScale(0.85);
      this.add.image(width - 60, y, 'diya').setScale(0.85).setFlipX(true);
    }
  }

  startNewRound() {
    if (this.isGameOver) return;

    this.canPlayerInput = false;
    this.isShowingSequence = true;
    this.playerStep = 0;

    // Sequence length: Round 1 -> 2 notes, Round 2 -> 3 notes, Round 3 -> 4 notes, Round 4 -> 5 notes
    const targetLength = this.currentRound + 1;
    this.sequence = [];
    for (let i = 0; i < targetLength; i++) {
      this.sequence.push(Phaser.Math.Between(0, 3));
    }

    this.statusText.setText(`🌟 Round ${this.currentRound}/${this.totalRounds}: Listen closely to Bappa's bells! 🌟`);
    this.statusText.setColor('#ffd54f');

    // Play sequence
    this.playSequenceIndex(0);
  }

  playSequenceIndex(index) {
    if (index >= this.sequence.length) {
      // Sequence playback finished! Turn over to player
      this.time.delayedCall(400, () => {
        this.isShowingSequence = false;
        this.canPlayerInput = true;
        this.statusText.setText(`🔔 Your Turn: Repeat the ${this.sequence.length}-bell sacred sequence! 🔔`);
        this.statusText.setColor('#00e676');
      });
      return;
    }

    const bellIndex = this.sequence[index];
    this.animateBellRing(bellIndex, true, () => {
      this.time.delayedCall(300, () => {
        this.playSequenceIndex(index + 1);
      });
    });
  }

  animateBellRing(index, isDemonstration = false, onComplete = null) {
    const bell = this.bells[index];
    const glow = this.bellGlows[index];
    const freq = this.bellNotes[index];

    soundManager.playBellChime(freq);

    // Glow tween
    glow.setAlpha(0.8);
    this.tweens.add({
      targets: glow,
      alpha: 0,
      scale: 1.4,
      duration: 500,
      onComplete: () => {
        glow.setScale(1);
      }
    });

    // Bell swing/bounce animation
    this.tweens.add({
      targets: bell,
      angle: { from: -12, to: 12 },
      scale: 1.6,
      duration: 100,
      yoyo: true,
      repeat: 1,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        bell.setAngle(0);
        bell.setScale(1.4);
        if (onComplete) onComplete();
      }
    });

    // Particle sparkle
    for (let i = 0; i < 4; i++) {
      const spark = this.add.image(bell.x + Phaser.Math.Between(-20, 20), bell.y + Phaser.Math.Between(-20, 20), 'sparkle').setScale(0.8);
      this.tweens.add({
        targets: spark,
        y: spark.y - 25,
        alpha: 0,
        duration: 600,
        onComplete: () => spark.destroy()
      });
    }
  }

  handlePlayerPress(index) {
    if (!this.canPlayerInput || this.isShowingSequence || this.isGameOver) return;

    const expectedIndex = this.sequence[this.playerStep];

    if (index === expectedIndex) {
      // Correct bell press!
      this.animateBellRing(index, false);
      this.playerStep++;

      // Check if sequence completed
      if (this.playerStep >= this.sequence.length) {
        this.canPlayerInput = false;
        this.collectedInRound++;
        gameState.recordModak();
        const streakBonus = gameState.addStreakBonus();
        this.game.events.emit('hud:update');

        this.showFloatingText(this.bells[index].x, this.bells[index].y - 30, `+100 🥟 (+${streakBonus})`, '#ffd54f');
        soundManager.playPickupDing();

        if (this.currentRound >= this.totalRounds) {
          // Finished all 4 rounds!
          this.statusText.setText('🎉 WISDOM OF BAPPA ACHIEVED! ALL 4 MODAKS EARNED! 🎉');
          this.statusText.setColor('#ffd54f');
          this.time.delayedCall(800, () => this.completeChallenge(true));
        } else {
          this.currentRound++;
          this.statusText.setText(`✨ Round ${this.currentRound - 1} Clear! Next Sequence Coming... ✨`);
          this.statusText.setColor('#00e676');
          this.time.delayedCall(1200, () => this.startNewRound());
        }
      }
    } else {
      // Incorrect bell press!
      if (!gameState.blessingUsed) {
        gameState.blessingUsed = true;
        soundManager.playPowerUpHum();
        this.showFloatingText(this.bells[index].x, this.bells[index].y - 30, '🛡 BLESSING SAVED YOU!', '#a5d6a7');
        this.game.events.emit('hud:update');
        // Re-demonstrate current sequence without score penalty
        this.time.delayedCall(600, () => {
          this.canPlayerInput = false;
          this.isShowingSequence = true;
          this.playerStep = 0;
          this.playSequenceIndex(0);
        });
        return;
      }

      // Mistake penalty
      soundManager.playErrorBuzz();
      gameState.recordMistake();
      this.game.events.emit('hud:update');
      this.cameras.main.shake(180, 0.015);
      this.showFloatingText(this.bells[index].x, this.bells[index].y - 30, '-50 Mistake! Listen again', '#ff5252');

      this.canPlayerInput = false;
      this.isShowingSequence = true;
      this.playerStep = 0;
      this.time.delayedCall(900, () => {
        this.playSequenceIndex(0);
      });
    }
  }

  triggerVighnaharta() {
    if (this.isGameOver) return;
    // Divine ability: Auto-reveals & slowly guides the full sequence
    this.canPlayerInput = false;
    this.isShowingSequence = true;
    this.playerStep = 0;
    this.statusText.setText('✨ VIGHNAHARTA: DIVINE SLOW-MOTION GUIDANCE! ✨');
    this.statusText.setColor('#ffd54f');
    this.playSequenceIndex(0);
  }

  showWisdomHint() {
    if (this.isGameOver || !this.canPlayerInput) return;
    // Highlight the exact next bell the player needs to press
    const nextExpected = this.sequence[this.playerStep];
    if (nextExpected !== undefined) {
      const bell = this.bells[nextExpected];
      const arrow = this.add.text(bell.x, bell.y - 65, '⬇ PRESS THIS ⬇', {
        fontFamily: 'Outfit, sans-serif',
        fontSize: '16px',
        fontWeight: '800',
        color: '#00e676',
        stroke: '#000',
        strokeThickness: 3
      }).setOrigin(0.5).setDepth(20);

      this.tweens.add({
        targets: [arrow, bell],
        scale: 1.6,
        duration: 300,
        yoyo: true,
        repeat: 3,
        onComplete: () => {
          arrow.destroy();
          bell.setScale(1.4);
        }
      });
    }
  }

  showFloatingText(x, y, text, color) {
    const txt = this.add.text(x, y, text, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '16px',
      fontWeight: '800',
      color: color,
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(25);

    this.tweens.add({
      targets: txt,
      y: y - 35,
      alpha: 0,
      duration: 1000,
      ease: 'Quad.easeOut',
      onComplete: () => txt.destroy()
    });
  }

  onTimeUp() {
    if (this.isGameOver) return;
    this.completeChallenge(false);
  }

  completeChallenge(isSuccess) {
    this.isGameOver = true;
    this.canPlayerInput = false;
    this.scene.stop('HUDScene');

    let challengeBonus = 0;
    let fastBonus = 0;
    let perfectBonus = 0;

    if (isSuccess) {
      soundManager.playVictoryFanfare();
      challengeBonus = SCORING_TABLE.CHALLENGE_COMPLETED;
      gameState.addScore(challengeBonus);

      fastBonus = 200;
      gameState.addScore(fastBonus);

      if (gameState.challengeStats.mistakes === 0) {
        perfectBonus = SCORING_TABLE.PERFECT_BONUS;
        gameState.addScore(perfectBonus);
      }
    } else {
      soundManager.playErrorBuzz();
    }

    gameState.saveHighScore();

    this.time.delayedCall(400, () => {
      this.scene.start('ResultScene', {
        challengeIndex: 1,
        challengeTitle: 'Wisdom Memory',
        isSuccess: isSuccess,
        modaksEarned: this.collectedInRound,
        challengeBonus: challengeBonus,
        fastBonus: fastBonus,
        perfectBonus: perfectBonus,
        mistakes: gameState.challengeStats.mistakes,
        nextScene: 'PandalScene',
        nextTitle: 'Challenge 3: Pandal Builder',
        nextData: {
          challengeIndex: 2,
          title: 'Challenge 3: Pandal Builder',
          targetModaks: 4,
          timeLimit: 35
        }
      });
    });
  }

  shutdown() {
    this.game.events.off('ability:vighnaharta', this.triggerVighnaharta, this);
    this.game.events.off('ability:hint', this.showWisdomHint, this);
    this.game.events.off('challenge:timeup', this.onTimeUp, this);
  }
}
