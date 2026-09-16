/**
 * EcoScene: Eco-Friendly Sorting Catcher mini-game.
 * Catch organic puja offerings into the bamboo basket and avoid plastic waste!
 */
import { gameState, SCORING_TABLE } from '../data/scoring.js';
import { soundManager } from '../audio/SoundManager.js';

export default class EcoScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EcoScene' });
  }

  init() {
    this.targetModaks = 4;
    this.collectedInRound = 0;
    this.isGameOver = false;
    this.basketSpeed = 480;
    this.fallingSpeed = 190;
  }

  create() {
    const { width, height } = this.scale;
    this.isGameOver = false;
    this.collectedInRound = 0;
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
        challengeIndex: 3,
        title: 'Challenge 4: Eco Sort',
        targetModaks: 4,
        timeLimit: 35
      });
    }

    // Eco River Ghat & Temple Garden Background
    this.createGardenBackground(width, height);

    // Player Basket Catcher + Mushika
    this.basket = this.add.image(width / 2, 470, 'basket').setScale(1.3).setDepth(10);
    this.mushika = this.add.image(width / 2 - 45, 460, 'mushika').setScale(0.9).setDepth(11);
    this.basketShield = this.add.circle(this.basket.x, this.basket.y, 45, 0xffd54f, 0).setDepth(9);

    // Groups for falling items
    this.ecoItemsGroup = this.add.group();
    this.toxicItemsGroup = this.add.group();

    // Controls: Keyboard
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    // Controls: Pointer / Touch with Touch Guard (Decision 3)
    this.input.on('pointermove', (pointer) => {
      if (this.isGameOver) return;
      // TOUCH GUARD: Ignore bottom 90px (HUD ability buttons)
      if (pointer.y > height - 90) return;
      this.basket.x = Phaser.Math.Clamp(pointer.x, 80, width - 80);
      this.mushika.x = this.basket.x - 45;
    });

    this.input.on('pointerdown', (pointer) => {
      if (this.isGameOver) return;
      // TOUCH GUARD: Ignore bottom 90px
      if (pointer.y > height - 90) return;
      this.basket.x = Phaser.Math.Clamp(pointer.x, 80, width - 80);
      this.mushika.x = this.basket.x - 45;
    });

    // Spawning timer
    this.spawnTimer = this.time.addEvent({
      delay: 950,
      callback: this.spawnFallingItem,
      callbackScope: this,
      loop: true
    });

    // Listen to Divine Abilities
    this.game.events.on('ability:vighnaharta', this.triggerVighnaharta, this);
    this.game.events.on('ability:hint', this.showWisdomHint, this);
    this.game.events.on('challenge:timeup', this.onTimeUp, this);
  }

  createGardenBackground(width, height) {
    const bg = this.add.graphics();
    // Eco temple river ghat gradient
    bg.fillGradientStyle(0x133e28, 0x133e28, 0x071b11, 0x071b11, 1);
    bg.fillRect(0, 0, width, height);

    // River water at bottom
    bg.fillStyle(0x004d40, 0.85);
    bg.fillRect(0, 440, width, 85);

    // Toran on top
    for (let x = 40; x < width; x += 80) {
      this.add.image(x, 20, 'toran').setScale(1.1);
    }

    // Festive diyas along the ghat steps
    for (let x = 60; x < width; x += 110) {
      this.add.image(x, 430, 'diya').setScale(0.7);
    }

    // Sacred banana trees on sides
    const leaf = this.add.graphics();
    leaf.fillStyle(0x2e7d32, 0.4);
    leaf.fillEllipse(50, 260, 40, 180);
    leaf.fillEllipse(width - 50, 260, 40, 180);
  }

  update(time, delta) {
    if (this.isGameOver) return;

    const dt = delta / 1000;

    // Keyboard movement
    let moveDir = 0;
    if (this.cursors.left.isDown || this.keyA.isDown) moveDir = -1;
    else if (this.cursors.right.isDown || this.keyD.isDown) moveDir = 1;

    if (moveDir !== 0) {
      this.basket.x = Phaser.Math.Clamp(this.basket.x + moveDir * this.basketSpeed * dt, 80, this.scale.width - 80);
      this.mushika.x = this.basket.x - 45;
    }

    this.basketShield.setPosition(this.basket.x, this.basket.y);

    // Update eco items
    this.ecoItemsGroup.getChildren().forEach((item) => {
      item.y += this.fallingSpeed * dt;
      // Catch check
      if (Math.abs(item.x - this.basket.x) < 48 && Math.abs(item.y - this.basket.y) < 28) {
        this.catchEcoItem(item);
      } else if (item.y > 540) {
        item.destroy();
      }
    });

    // Update toxic items
    this.toxicItemsGroup.getChildren().forEach((item) => {
      item.y += this.fallingSpeed * dt;
      // Catch check
      if (Math.abs(item.x - this.basket.x) < 44 && Math.abs(item.y - this.basket.y) < 28) {
        this.catchToxicItem(item);
      } else if (item.y > 540) {
        item.destroy();
      }
    });
  }

  spawnFallingItem() {
    if (this.isGameOver) return;

    const spawnX = Phaser.Math.Between(100, this.scale.width - 100);
    const rand = Math.random();

    if (rand < 0.35) {
      // Modak (Sacred target)
      const modak = this.add.image(spawnX, 60, 'modak').setScale(1.1);
      modak.setData('type', 'modak');
      this.ecoItemsGroup.add(modak);
    } else if (rand < 0.55) {
      // Marigold Flower (Eco offering)
      const flower = this.add.image(spawnX, 60, 'item_flower').setScale(1.1);
      flower.setData('type', 'flower');
      this.ecoItemsGroup.add(flower);
    } else if (rand < 0.70) {
      // Coconut (Eco offering)
      const coconut = this.add.image(spawnX, 60, 'item_coconut').setScale(1.0);
      coconut.setData('type', 'coconut');
      this.ecoItemsGroup.add(coconut);
    } else {
      // Plastic Toxic Waste (Avoid!)
      const plastic = this.add.image(spawnX, 60, 'item_plastic_cup').setScale(1.1);
      plastic.setData('type', 'plastic');
      this.toxicItemsGroup.add(plastic);
    }
  }

  catchEcoItem(item) {
    const type = item.getData('type');
    item.destroy();

    if (type === 'modak') {
      soundManager.playPickupDing();
      this.collectedInRound++;
      gameState.recordModak();
      const bonus = gameState.addStreakBonus();
      this.showFloatingText(this.basket.x, this.basket.y - 30, `+100 🥟 (+${bonus})`, '#ffd54f');
    } else {
      // Organic offering (Flower / Coconut)
      soundManager.playBellChime(1000);
      gameState.addScore(SCORING_TABLE.ECO_ACTION);
      gameState.challengeStats.ecoActions++;
      const bonus = gameState.addStreakBonus();
      const label = type === 'flower' ? '+100 🌺 Eco-Action!' : '+100 🥥 Eco-Action!';
      this.showFloatingText(this.basket.x, this.basket.y - 30, `${label} (+${bonus})`, '#66bb6a');
    }

    this.game.events.emit('hud:update');

    // Check completion condition
    if (this.collectedInRound >= this.targetModaks) {
      this.completeChallenge(true);
    }
  }

  catchToxicItem(item) {
    item.destroy();

    // Check Blessing
    if (!gameState.blessingUsed) {
      gameState.blessingUsed = true;
      soundManager.playPowerUpHum();
      this.showFloatingText(this.basket.x, this.basket.y - 30, '🛡 BLESSING DEFLECTED PLASTIC!', '#a5d6a7');

      this.basketShield.setFillStyle(0x66bb6a, 0.6);
      this.tweens.add({
        targets: this.basketShield,
        alpha: { from: 1, to: 0 },
        scale: { from: 1, to: 1.8 },
        duration: 500,
        onComplete: () => {
          this.basketShield.setFillStyle(0xffd54f, 0);
          this.basketShield.setScale(1);
          this.basketShield.setAlpha(1);
        }
      });

      this.game.events.emit('hud:update');
      return;
    }

    // Mistake
    soundManager.playErrorBuzz();
    gameState.recordMistake();
    this.game.events.emit('hud:update');
    this.cameras.main.shake(180, 0.015);
    this.showFloatingText(this.basket.x, this.basket.y - 30, '-50 Plastic Waste!', '#ff5252');

    // Flash basket red
    this.tweens.add({
      targets: this.basket,
      tint: 0xff1744,
      duration: 100,
      yoyo: true,
      repeat: 2,
      onComplete: () => this.basket.clearTint()
    });
  }

  triggerVighnaharta() {
    if (this.isGameOver) return;
    // Divine flash removes all falling plastic
    this.toxicItemsGroup.getChildren().forEach(p => {
      this.showFloatingText(p.x, p.y, '✨ VAPORIZED ✨', '#ffd54f');
      p.destroy();
    });
  }

  showWisdomHint() {
    if (this.isGameOver) return;
    // Highlight eco items with green halos
    this.ecoItemsGroup.getChildren().forEach(item => {
      const glow = this.add.circle(item.x, item.y, 28, 0x00e676, 0.5).setDepth(8);
      this.tweens.add({
        targets: glow,
        scale: 1.5,
        alpha: 0,
        duration: 1000,
        onComplete: () => glow.destroy()
      });
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
    }).setOrigin(0.5).setDepth(25);

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
        challengeIndex: 3,
        challengeTitle: 'Eco Sort',
        isSuccess: isSuccess,
        modaksEarned: this.collectedInRound,
        challengeBonus: challengeBonus,
        fastBonus: fastBonus,
        perfectBonus: perfectBonus,
        mistakes: gameState.challengeStats.mistakes,
        nextScene: 'RhythmScene',
        nextTitle: 'Challenge 5: Dhol Rhythm',
        nextData: {
          challengeIndex: 4,
          title: 'Challenge 5: Dhol Rhythm',
          targetModaks: 5,
          timeLimit: 35
        }
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
