/**
 * RhythmScene: 4-track Nashik Dhol rhythm mini-game.
 * Play the sacred Nashik Dhol beats as modaks hit the rhythm markers!
 */
import { gameState, SCORING_TABLE } from '../data/scoring.js';
import { soundManager } from '../audio/SoundManager.js';

export default class RhythmScene extends Phaser.Scene {
  constructor() {
    super({ key: 'RhythmScene' });
  }

  init() {
    this.lanes = [240, 380, 520, 660];
    this.laneKeys = ['A', 'S', 'D', 'F'];
    this.laneKeyCodes = [
      Phaser.Input.Keyboard.KeyCodes.A,
      Phaser.Input.Keyboard.KeyCodes.S,
      Phaser.Input.Keyboard.KeyCodes.D,
      Phaser.Input.Keyboard.KeyCodes.F
    ];
    this.lanePitches = [90, 120, 160, 200];
    this.targetModaks = 5; // 5 modaks to reach full 21!
    this.collectedInRound = 0;
    this.isGameOver = false;
    this.noteSpeed = 230;
    this.targetY = 465;
    this.hitWindow = 45; // pixels tolerance
    this.hintActive = false;
  }

  create() {
    const { width, height } = this.scale;
    this.isGameOver = false;
    this.collectedInRound = 0;
    this.hintActive = false;
    this.startTime = this.time.now;

    // Reset challenge stats
    gameState.challengeStats = {
      startTime: this.time.now,
      mistakes: 0,
      hintsUsed: 0,
      modaksEarned: 0,
      ecoActions: 0
    };

    // Ensure HUD is active
    if (!this.scene.isActive('HUDScene')) {
      this.scene.launch('HUDScene', {
        challengeIndex: 4,
        title: 'Challenge 5: Dhol Rhythm',
        targetModaks: 5,
        timeLimit: 35
      });
    }

    // Festive Stage Background
    this.createStageBackground(width, height);

    // Dhol Rhythm Target Line (Golden Beat Bar)
    const beatBar = this.add.graphics().setDepth(4);
    beatBar.lineStyle(3, 0xffd54f, 0.85);
    beatBar.lineBetween(170, this.targetY, width - 170, this.targetY);

    // 4 Dhol Pads
    this.pads = [];
    this.padGlows = [];

    this.lanes.forEach((x, i) => {
      // Glow circle
      const glow = this.add.circle(x, this.targetY, 40, 0xffd54f, 0).setDepth(5);
      this.padGlows.push(glow);

      // Pad sprite
      const pad = this.add.image(x, this.targetY, `dhol_pad_${i}`).setScale(1.15).setDepth(6);
      pad.setInteractive({ useHandCursor: true });

      // Key label under pad
      const keyBox = this.add.graphics().setDepth(7);
      keyBox.fillStyle(0x1a092b, 0.9);
      keyBox.lineStyle(1.5, 0xffd54f, 0.8);
      keyBox.fillRoundedRect(x - 18, this.targetY + 40, 36, 22, 5);
      keyBox.strokeRoundedRect(x - 18, this.targetY + 40, 36, 22, 5);

      this.add.text(x, this.targetY + 51, this.laneKeys[i], {
        fontFamily: 'Outfit, sans-serif',
        fontSize: '13px',
        fontWeight: '800',
        color: '#ffd54f'
      }).setOrigin(0.5).setDepth(8);

      // Touch / pointer interaction on pad
      pad.on('pointerdown', (pointer) => {
        // TOUCH GUARD: Ignore bottom 90px
        if (pointer.y > height - 90) return;
        this.hitLane(i);
      });

      this.pads.push(pad);
    });

    // Notes Group
    this.notesGroup = this.add.group();

    // Keyboard controls: A, S, D, F and 1, 2, 3, 4
    this.input.keyboard.on('keydown', (event) => {
      if (this.isGameOver) return;
      const k = event.key.toUpperCase();
      if (k === 'A' || k === '1') this.hitLane(0);
      else if (k === 'S' || k === '2') this.hitLane(1);
      else if (k === 'D' || k === '3') this.hitLane(2);
      else if (k === 'F' || k === '4') this.hitLane(3);
    });

    // Note Spawning Timer
    this.spawnTimer = this.time.addEvent({
      delay: 1100,
      callback: this.spawnRhythmNote,
      callbackScope: this,
      loop: true
    });

    // Listen to Divine Abilities
    this.game.events.on('ability:vighnaharta', this.triggerVighnaharta, this);
    this.game.events.on('ability:hint', this.showWisdomHint, this);
    this.game.events.on('challenge:timeup', this.onTimeUp, this);
  }

  createStageBackground(width, height) {
    const bg = this.add.graphics();
    // Night festival stage gradient
    bg.fillGradientStyle(0x310a47, 0x310a47, 0x110224, 0x110224, 1);
    bg.fillRect(0, 0, width, height);

    // Toran on top
    for (let x = 40; x < width; x += 80) {
      this.add.image(x, 20, 'toran').setScale(1.1);
    }

    // 4 Track Lanes Background
    bg.fillStyle(0x1e0930, 0.9);
    bg.fillRect(170, 60, width - 340, height - 140);

    // Vertical Track divider lines
    bg.lineStyle(2, 0xffd54f, 0.3);
    this.lanes.forEach(x => {
      bg.lineBetween(x, 60, x, height - 80);
    });

    // Stage border
    bg.lineStyle(3, 0xff7700, 0.8);
    bg.strokeRect(170, 60, width - 340, height - 140);

    // Festive stage diyas
    for (let y = 100; y <= 420; y += 80) {
      this.add.image(110, y, 'diya').setScale(0.8);
      this.add.image(width - 110, y, 'diya').setScale(0.8).setFlipX(true);
    }
  }

  update(time, delta) {
    if (this.isGameOver) return;

    const dt = delta / 1000;

    // Move notes down tracks
    this.notesGroup.getChildren().forEach((note) => {
      note.y += this.noteSpeed * dt;

      // Check if note passed past bottom miss threshold
      if (note.y > this.targetY + this.hitWindow + 20) {
        this.missNote(note);
      }
    });
  }

  spawnRhythmNote() {
    if (this.isGameOver) return;

    const laneIndex = Phaser.Math.Between(0, 3);
    const laneX = this.lanes[laneIndex];

    const note = this.add.image(laneX, 60, 'modak').setScale(1.15).setDepth(10);
    note.setData('lane', laneIndex);
    note.setData('hit', false);
    this.notesGroup.add(note);
  }

  hitLane(laneIndex) {
    if (this.isGameOver) return;

    const pad = this.pads[laneIndex];
    const glow = this.padGlows[laneIndex];
    const pitch = this.lanePitches[laneIndex];

    // Dhol thump sound
    soundManager.playDholThump(pitch);

    // Pad bounce animation
    pad.setScale(1.35);
    glow.setAlpha(0.8);
    this.tweens.add({
      targets: [pad, glow],
      scale: 1.15,
      alpha: 0,
      duration: 180
    });

    // Find closest note in this lane
    let closestNote = null;
    let minDist = Infinity;
    const windowTol = this.hintActive ? 85 : this.hitWindow;

    this.notesGroup.getChildren().forEach((note) => {
      if (note.getData('lane') === laneIndex && !note.getData('hit')) {
        const dist = Math.abs(note.y - this.targetY);
        if (dist < minDist) {
          minDist = dist;
          closestNote = note;
        }
      }
    });

    if (closestNote && minDist <= windowTol) {
      // Hit!
      closestNote.setData('hit', true);
      closestNote.destroy();

      const isPerfect = minDist <= 25;
      const hitScore = isPerfect ? 100 : 75;
      const hitLabel = isPerfect ? '✨ PERFECT! ✨' : '👍 GOOD!';
      const hitColor = isPerfect ? '#ffd54f' : '#00e676';

      soundManager.playPickupDing();
      this.collectedInRound++;
      gameState.recordModak();
      const bonus = gameState.addStreakBonus();
      this.game.events.emit('hud:update');

      this.showFloatingText(pad.x, this.targetY - 35, `${hitLabel} +${hitScore} (+${bonus})`, hitColor);
      this.spawnSparkles(pad.x, this.targetY);

      // Check completion
      if (this.collectedInRound >= this.targetModaks) {
        this.completeChallenge(true);
      }
    }
  }

  missNote(note) {
    note.destroy();

    // Check Blessing
    if (!gameState.blessingUsed) {
      gameState.blessingUsed = true;
      soundManager.playPowerUpHum();
      this.showFloatingText(note.x, this.targetY - 30, '🛡 BLESSING SAVED COMBO!', '#a5d6a7');
      this.game.events.emit('hud:update');
      return;
    }

    // Mistake penalty
    soundManager.playErrorBuzz();
    gameState.recordMistake();
    this.game.events.emit('hud:update');
    this.cameras.main.shake(150, 0.012);
    this.showFloatingText(note.x, this.targetY - 30, '❌ MISS! -50', '#ff5252');
  }

  spawnSparkles(x, y) {
    for (let i = 0; i < 6; i++) {
      const spark = this.add.image(x + Phaser.Math.Between(-20, 20), y + Phaser.Math.Between(-20, 20), 'sparkle').setScale(1.0).setDepth(20);
      this.tweens.add({
        targets: spark,
        y: spark.y - 30,
        alpha: 0,
        duration: 500,
        onComplete: () => spark.destroy()
      });
    }
  }

  triggerVighnaharta() {
    if (this.isGameOver) return;
    // Divine shockwave auto-hits all notes on screen!
    this.notesGroup.getChildren().forEach(note => {
      const lane = note.getData('lane');
      const pad = this.pads[lane];
      soundManager.playDholThump(this.lanePitches[lane]);
      this.spawnSparkles(pad.x, this.targetY);
      this.showFloatingText(pad.x, this.targetY - 30, '✨ DIVINE BEAT! ✨', '#ffd54f');
      note.destroy();
      this.collectedInRound++;
      gameState.recordModak();
      gameState.addStreakBonus();
    });

    this.game.events.emit('hud:update');
    if (this.collectedInRound >= this.targetModaks) {
      this.completeChallenge(true);
    }
  }

  showWisdomHint() {
    if (this.isGameOver) return;
    // Widen hit window and highlight beat line
    this.hintActive = true;
    this.showFloatingText(this.scale.width / 2, this.targetY - 50, '💡 WIDE HIT WINDOW ACTIVE (6s) 💡', '#00e676');

    this.time.delayedCall(6000, () => {
      this.hintActive = false;
    });
  }

  showFloatingText(x, y, text, color) {
    const txt = this.add.text(x, y, text, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '15px',
      fontWeight: '800',
      color: color,
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(30);

    this.tweens.add({
      targets: txt,
      y: y - 35,
      alpha: 0,
      duration: 900,
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
    if (this.spawnTimer) this.spawnTimer.remove();
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
        challengeIndex: 4,
        challengeTitle: 'Dhol Rhythm',
        isSuccess: isSuccess,
        modaksEarned: this.collectedInRound,
        challengeBonus: challengeBonus,
        fastBonus: fastBonus,
        perfectBonus: perfectBonus,
        mistakes: gameState.challengeStats.mistakes,
        nextScene: 'CelebrationScene',
        nextTitle: 'Grand Aarti & Finale'
      });
    });
  }

  shutdown() {
    this.game.events.off('ability:vighnaharta', this.triggerVighnaharta, this);
    this.game.events.off('ability:hint', this.showWisdomHint, this);
    this.game.events.off('challenge:timeup', this.onTimeUp, this);
    if (this.spawnTimer) this.spawnTimer.remove();
  }
}
