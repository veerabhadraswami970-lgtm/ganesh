/**
 * ModakRunScene: 3-lane agility runner mini-game.
 */
import { gameState, SCORING_TABLE } from '../data/scoring.js';
import { soundManager } from '../audio/SoundManager.js';

export default class ModakRunScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ModakRunScene' });
  }

  init() {
    this.lanes = [310, 450, 590];
    this.currentLane = 1;
    this.targetModaks = 4;
    this.collectedInRound = 0;
    this.isGameOver = false;
    this.speed = 220; // Falling obstacle/item speed
  }

  create() {
    const { width, height } = this.scale;
    this.isGameOver = false;
    this.collectedInRound = 0;
    this.startTime = this.time.now;

    // Reset challenge-specific stats
    gameState.challengeStats = {
      startTime: this.time.now,
      mistakes: 0,
      hintsUsed: 0,
      modaksEarned: 0,
      ecoActions: 0
    };

    // Festive Street Background
    this.createStreetBackground(width, height);

    // Player Mushika
    this.player = this.add.image(this.lanes[this.currentLane], 465, 'mushika').setScale(1.3).setDepth(10);
    this.playerShield = this.add.circle(this.player.x, this.player.y, 35, 0xffd54f, 0).setDepth(9);

    // Groups
    this.modaksGroup = this.add.group();
    this.obstaclesGroup = this.add.group();

    // Controls: Keyboard
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    // Controls: Touch / Pointer with Touch Guard (Decision 3)
    this.input.on('pointerdown', (pointer) => {
      // TOUCH GUARD: Ignore any tap in bottom 90px (reserved for HUD buttons)
      if (pointer.y > height - 90) return;

      if (pointer.x < width / 2) {
        this.moveLane(-1);
      } else {
        this.moveLane(1);
      }
    });

    // Spawning timer
    this.spawnEvent = this.time.addEvent({
      delay: 1100,
      callback: this.spawnEntity,
      callbackScope: this,
      loop: true
    });

    // Listen to Divine Abilities
    this.game.events.on('ability:vighnaharta', this.triggerVighnaharta, this);
    this.game.events.on('ability:hint', this.showWisdomHint, this);
    this.game.events.on('challenge:timeup', this.onTimeUp, this);
  }

  createStreetBackground(width, height) {
    const bg = this.add.graphics();
    // Night sky gradient
    bg.fillGradientStyle(0x1a092b, 0x1a092b, 0x0c0214, 0x0c0214, 1);
    bg.fillRect(0, 0, width, height);

    // Roadway
    bg.fillStyle(0x2d1a45, 1);
    bg.fillRect(230, 0, 440, height);

    // Lane Dividers
    bg.lineStyle(3, 0xffd54f, 0.4);
    bg.lineBetween(380, 0, 380, height);
    bg.lineBetween(520, 0, 520, height);

    // Road borders with festive marigold garlands
    bg.lineStyle(4, 0xff7700, 0.9);
    bg.lineBetween(230, 0, 230, height);
    bg.lineBetween(670, 0, 670, height);

    // Festive street diyas on the pavements
    for (let y = 80; y < height - 80; y += 100) {
      this.add.image(180, y, 'diya').setScale(0.8);
      this.add.image(720, y, 'diya').setScale(0.8).setFlipX(true);
    }
  }

  update(time, delta) {
    if (this.isGameOver) return;

    // Keyboard lane movement
    if (Phaser.Input.Keyboard.JustDown(this.cursors.left) || Phaser.Input.Keyboard.JustDown(this.keyA)) {
      this.moveLane(-1);
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right) || Phaser.Input.Keyboard.JustDown(this.keyD)) {
      this.moveLane(1);
    }

    // Move modaks down
    this.modaksGroup.getChildren().forEach((modak) => {
      modak.y += (this.speed * delta) / 1000;
      // Check collision
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, modak.x, modak.y) < 40) {
        this.collectModak(modak);
      } else if (modak.y > 540) {
        modak.destroy();
      }
    });

    // Move obstacles down
    this.obstaclesGroup.getChildren().forEach((obs) => {
      obs.y += (this.speed * delta) / 1000;
      // Check collision
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, obs.x, obs.y) < 40) {
        this.hitObstacle(obs);
      } else if (obs.y > 540) {
        obs.destroy();
      }
    });

    // Update shield position
    this.playerShield.setPosition(this.player.x, this.player.y);
  }

  moveLane(dir) {
    const newLane = Phaser.Math.Clamp(this.currentLane + dir, 0, this.lanes.length - 1);
    if (newLane !== this.currentLane) {
      this.currentLane = newLane;
      soundManager.playDholThump(160);
      this.tweens.add({
        targets: this.player,
        x: this.lanes[this.currentLane],
        duration: 100,
        ease: 'Quad.easeOut'
      });
    }
  }

  spawnEntity() {
    if (this.isGameOver) return;

    const availableLanes = [0, 1, 2];
    Phaser.Utils.Array.Shuffle(availableLanes);

    const modakLane = availableLanes[0];
    const obsLane = availableLanes[1];

    // Spawn Modak
    const modak = this.add.image(this.lanes[modakLane], 60, 'modak').setScale(1.1);
    this.modaksGroup.add(modak);

    // 75% chance to spawn obstacle in a different lane
    if (Math.random() < 0.75) {
      const obs = this.add.image(this.lanes[obsLane], 60, 'obstacle_barrier').setScale(1.0);
      this.obstaclesGroup.add(obs);
    }
  }

  collectModak(modak) {
    modak.destroy();
    soundManager.playPickupDing();
    gameState.recordModak();
    this.collectedInRound++;

    // Streak bonus
    const bonus = gameState.addStreakBonus();

    // Floating text
    this.showFloatingEffect(this.player.x, this.player.y - 20, `+100 🥟 (+${bonus})`, '#ffd54f');

    // Notify HUD
    this.game.events.emit('hud:update');

    // Check completion condition
    if (this.collectedInRound >= this.targetModaks) {
      this.completeChallenge(true);
    }
  }

  hitObstacle(obs) {
    obs.destroy();

    // Check Ganesha's Blessing protection
    if (!gameState.blessingUsed) {
      gameState.blessingUsed = true;
      soundManager.playPowerUpHum();
      this.showFloatingEffect(this.player.x, this.player.y - 30, '🛡 BLESSING SAVED YOU!', '#a5d6a7');
      
      // Shield visual flash
      this.playerShield.setFillStyle(0x66bb6a, 0.6);
      this.tweens.add({
        targets: this.playerShield,
        alpha: { from: 1, to: 0 },
        scale: { from: 1, to: 1.8 },
        duration: 600,
        onComplete: () => {
          this.playerShield.setFillStyle(0xffd54f, 0);
          this.playerShield.setScale(1);
          this.playerShield.setAlpha(1);
        }
      });
      this.game.events.emit('hud:update');
      return;
    }

    // Mistake
    soundManager.playErrorBuzz();
    gameState.recordMistake();
    this.showFloatingEffect(this.player.x, this.player.y - 20, '-50 Mistake!', '#ff5252');
    this.cameras.main.shake(180, 0.015);

    // Player flash red
    this.tweens.add({
      targets: this.player,
      tint: 0xff1744,
      duration: 100,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        this.player.clearTint();
      }
    });

    this.game.events.emit('hud:update');
  }

  triggerVighnaharta() {
    // Clear all obstacles with golden explosion
    this.obstaclesGroup.getChildren().forEach((obs) => {
      this.showFloatingEffect(obs.x, obs.y, '✨', '#ffd54f');
      obs.destroy();
    });
  }

  showWisdomHint() {
    // Show glowing arrows in the safest lane
    const safeLaneIndex = this.currentLane === 1 ? 0 : 1;
    const arrow = this.add.text(this.lanes[safeLaneIndex], 300, '⬇ SAFE LANE ⬇', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '18px',
      fontWeight: '800',
      color: '#00e676',
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.tweens.add({
      targets: arrow,
      alpha: { from: 1, to: 0 },
      y: 350,
      duration: 1800,
      onComplete: () => arrow.destroy()
    });
  }

  showFloatingEffect(x, y, text, color) {
    const txt = this.add.text(x, y, text, {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '16px',
      fontWeight: '800',
      color: color,
      stroke: '#000',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(20);

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
    if (this.spawnEvent) this.spawnEvent.remove();

    // Clean up HUD
    this.scene.stop('HUDScene');

    // Calculate score bonuses
    let challengeBonus = 0;
    let fastBonus = 0;
    let perfectBonus = 0;

    if (isSuccess) {
      soundManager.playVictoryFanfare();
      challengeBonus = SCORING_TABLE.CHALLENGE_COMPLETED;
      gameState.addScore(challengeBonus);

      // Fast completion bonus
      fastBonus = 200;
      gameState.addScore(fastBonus);

      // Perfect challenge bonus (0 mistakes)
      if (gameState.challengeStats.mistakes === 0) {
        perfectBonus = SCORING_TABLE.PERFECT_BONUS;
        gameState.addScore(perfectBonus);
      }
    } else {
      soundManager.playErrorBuzz();
    }

    // Save high score
    gameState.saveHighScore();

    // Transition to ResultScene
    this.time.delayedCall(400, () => {
      this.scene.start('ResultScene', {
        challengeIndex: 0,
        challengeTitle: 'Modak Run',
        isSuccess: isSuccess,
        modaksEarned: this.collectedInRound,
        challengeBonus: challengeBonus,
        fastBonus: fastBonus,
        perfectBonus: perfectBonus,
        mistakes: gameState.challengeStats.mistakes,
        nextScene: 'MemoryScene',
        nextTitle: 'Challenge 2: Wisdom Memory',
        nextData: {
          challengeIndex: 1,
          title: 'Challenge 2: Wisdom Memory',
          targetModaks: 4,
          timeLimit: 40
        }
      });
    });
  }

  shutdown() {
    this.game.events.off('ability:vighnaharta', this.triggerVighnaharta, this);
    this.game.events.off('ability:hint', this.showWisdomHint, this);
    this.game.events.off('challenge:timeup', this.onTimeUp, this);
    if (this.spawnEvent) this.spawnEvent.remove();
  }
}
