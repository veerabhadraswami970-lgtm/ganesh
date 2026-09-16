/**
 * PandalScene: Pandal Builder mini-game.
 * Decorate Bappa's pandal by placing garlands, diyas, kalash & offerings in their slots!
 */
import { gameState, SCORING_TABLE } from '../data/scoring.js';
import { soundManager } from '../audio/SoundManager.js';

export default class PandalScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PandalScene' });
  }

  init() {
    this.targetModaks = 4;
    this.collectedInRound = 0;
    this.isGameOver = false;
    this.placedCount = 0;
    this.selectedItem = null;
  }

  create() {
    const { width, height } = this.scale;
    this.isGameOver = false;
    this.collectedInRound = 0;
    this.placedCount = 0;
    this.selectedItem = null;
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
        challengeIndex: 2,
        title: 'Challenge 3: Pandal Builder',
        targetModaks: 4,
        timeLimit: 35
      });
    }

    // Pandal Temple Background
    this.createPandalBackground(width, height);

    // Bappa Murti in Center
    this.bappa = this.add.image(width / 2, 230, 'ganesha_emblem').setScale(1.4).setDepth(5);
    this.bappaAura = this.add.circle(width / 2, 230, 75, 0xffd54f, 0.2).setDepth(4);
    this.tweens.add({
      targets: this.bappaAura,
      scale: 1.25,
      alpha: 0.45,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Instructions banner
    this.statusText = this.add.text(width / 2, 85, '🛕 Drag & Drop the sacred offerings to their glowing altar spots! 🛕', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '17px',
      fontWeight: '700',
      color: '#ffd54f'
    }).setOrigin(0.5);

    // Slot Definitions
    this.slotDefs = [
      { id: 'item_flower', name: 'Marigold Garland', x: width / 2, y: 135, icon: '🌺', outlineScale: 1.2 },
      { id: 'diya', name: 'Golden Diya', x: 230, y: 310, icon: '🪔', outlineScale: 1.1 },
      { id: 'kalash', name: 'Sacred Kalash', x: 670, y: 310, icon: '🏺', outlineScale: 1.1 },
      { id: 'item_thali', name: 'Modak Thali', x: width / 2, y: 360, icon: '🥟', outlineScale: 1.1 }
    ];

    // Create Glowing Target Slots
    this.slots = [];
    this.slotDefs.forEach((def, index) => {
      // Glow slot graphic
      const slotBg = this.add.graphics().setDepth(3);
      slotBg.fillStyle(0x311b92, 0.4);
      slotBg.lineStyle(2, 0xffd54f, 0.8);
      slotBg.strokeCircle(def.x, def.y, 34);
      slotBg.fillCircle(def.x, def.y, 34);

      // Label under slot
      const label = this.add.text(def.x, def.y + 44, def.name, {
        fontFamily: 'Outfit, sans-serif',
        fontSize: '13px',
        fontWeight: '700',
        color: '#ff9e42'
      }).setOrigin(0.5).setDepth(4);

      const slotObj = {
        ...def,
        index,
        slotBg,
        label,
        occupied: false,
        sprite: null
      };

      this.slots.push(slotObj);

      // Make slot interactive for click-to-place
      const hitArea = this.add.circle(def.x, def.y, 36, 0x000000, 0).setInteractive({ useHandCursor: true }).setDepth(6);
      hitArea.on('pointerdown', () => {
        if (this.selectedItem && !slotObj.occupied) {
          this.attemptPlacement(this.selectedItem, slotObj);
        }
      });
    });

    // Bottom Inventory Tray Shelf (y: 460)
    const trayBg = this.add.graphics().setDepth(2);
    trayBg.fillStyle(0x1a092b, 0.95);
    trayBg.lineStyle(2, 0xffd54f, 0.8);
    trayBg.fillRoundedRect(120, 440, width - 240, 75, 14);
    trayBg.strokeRoundedRect(120, 440, width - 240, 75, 14);

    const trayLabel = this.add.text(width / 2, 452, 'INVENTORY OFFERINGS', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '12px',
      fontWeight: '800',
      color: '#ff9e42'
    }).setOrigin(0.5).setDepth(3);

    // Create 4 Draggable Items
    this.items = [];
    const itemStartX = 230;
    const itemSpacing = 145;
    const itemY = 485;

    // Shuffle item order on tray
    const shuffledDefs = Phaser.Utils.Array.Shuffle([...this.slotDefs]);

    shuffledDefs.forEach((def, i) => {
      const origX = itemStartX + i * itemSpacing;
      const origY = itemY;

      // Item image
      const itemSprite = this.add.image(origX, origY, def.id).setScale(1.2).setDepth(10);
      itemSprite.setData('id', def.id);
      itemSprite.setData('origX', origX);
      itemSprite.setData('origY', origY);
      itemSprite.setData('placed', false);
      itemSprite.setInteractive({ draggable: true, useHandCursor: true });

      // Drag events
      this.input.setDraggable(itemSprite);

      itemSprite.on('dragstart', () => {
        if (this.isGameOver || itemSprite.getData('placed')) return;
        this.selectedItem = itemSprite;
        itemSprite.setScale(1.35).setDepth(20);
        soundManager.playBellChime(1200);
      });

      itemSprite.on('drag', (pointer, dragX, dragY) => {
        if (this.isGameOver || itemSprite.getData('placed')) return;
        itemSprite.x = dragX;
        itemSprite.y = dragY;
      });

      itemSprite.on('dragend', () => {
        if (this.isGameOver || itemSprite.getData('placed')) return;
        itemSprite.setScale(1.2).setDepth(10);
        this.checkDropPlacement(itemSprite);
      });

      // Pointer click to select
      itemSprite.on('pointerdown', () => {
        if (this.isGameOver || itemSprite.getData('placed')) return;
        this.selectedItem = itemSprite;
        this.tweens.add({
          targets: itemSprite,
          scale: 1.35,
          duration: 100,
          yoyo: true
        });
      });

      this.items.push(itemSprite);
    });

    // Keyboard Shortcuts: 1, 2, 3, 4 auto-selects unplaced items
    this.input.keyboard.on('keydown', (event) => {
      if (this.isGameOver) return;
      let num = parseInt(event.key, 10);
      if (num >= 1 && num <= 4) {
        const slot = this.slots[num - 1];
        if (!slot.occupied) {
          const matchingItem = this.items.find(it => it.getData('id') === slot.id && !it.getData('placed'));
          if (matchingItem) {
            this.attemptPlacement(matchingItem, slot);
          }
        }
      }
    });

    // Listen to Divine Abilities
    this.game.events.on('ability:vighnaharta', this.triggerVighnaharta, this);
    this.game.events.on('ability:hint', this.showWisdomHint, this);
    this.game.events.on('challenge:timeup', this.onTimeUp, this);
  }

  createPandalBackground(width, height) {
    const bg = this.add.graphics();
    // Regal temple sanctum
    bg.fillGradientStyle(0x31084d, 0x31084d, 0x140424, 0x140424, 1);
    bg.fillRect(0, 0, width, height);

    // Toran on top
    for (let x = 40; x < width; x += 80) {
      this.add.image(x, 20, 'toran').setScale(1.1);
    }

    // Divine Mandap Pillars
    bg.fillStyle(0x4a148c, 0.7);
    bg.lineStyle(2, 0xffd54f, 0.6);
    // Left Pillar
    bg.fillRoundedRect(90, 80, 40, height - 170, 8);
    bg.strokeRoundedRect(90, 80, 40, height - 170, 8);
    // Right Pillar
    bg.fillRoundedRect(width - 130, 80, 40, height - 170, 8);
    bg.strokeRoundedRect(width - 130, 80, 40, height - 170, 8);

    // Altar Table Graphic
    bg.fillStyle(0x210936, 0.9);
    bg.lineStyle(2.5, 0xff7700, 0.8);
    bg.fillRoundedRect(170, 200, width - 340, 210, 16);
    bg.strokeRoundedRect(170, 200, width - 340, 210, 16);
  }

  checkDropPlacement(item) {
    const itemId = item.getData('id');
    let nearestSlot = null;
    let minDist = 70; // snap threshold distance

    this.slots.forEach(slot => {
      const dist = Phaser.Math.Distance.Between(item.x, item.y, slot.x, slot.y);
      if (dist < minDist) {
        minDist = dist;
        nearestSlot = slot;
      }
    });

    if (nearestSlot) {
      this.attemptPlacement(item, nearestSlot);
    } else {
      // Snap back to tray
      this.tweens.add({
        targets: item,
        x: item.getData('origX'),
        y: item.getData('origY'),
        duration: 200,
        ease: 'Quad.easeOut'
      });
    }
  }

  attemptPlacement(item, slot) {
    if (slot.occupied) {
      // Slot already filled
      this.returnItemToTray(item);
      return;
    }

    const itemId = item.getData('id');

    if (itemId === slot.id) {
      // Correct placement!
      slot.occupied = true;
      item.setData('placed', true);
      this.input.setDraggable(item, false);
      this.selectedItem = null;

      // Animate snap to slot
      this.tweens.add({
        targets: item,
        x: slot.x,
        y: slot.y,
        scale: 1.3,
        duration: 200,
        ease: 'Back.easeOut',
        onComplete: () => {
          // Glow effect on slot
          slot.slotBg.clear();
          slot.slotBg.fillStyle(0x1b5e20, 0.8);
          slot.slotBg.lineStyle(2.5, 0x00e676, 1);
          slot.slotBg.strokeCircle(slot.x, slot.y, 36);
          slot.slotBg.fillCircle(slot.x, slot.y, 36);
        }
      });

      soundManager.playPickupDing();
      this.placedCount++;
      this.collectedInRound++;
      gameState.recordModak();
      const bonus = gameState.addStreakBonus();
      this.game.events.emit('hud:update');

      this.showFloatingText(slot.x, slot.y - 30, `+100 🥟 (+${bonus})`, '#ffd54f');
      this.spawnSparkles(slot.x, slot.y);

      // Check completion
      if (this.placedCount >= this.slots.length) {
        this.statusText.setText('🎉 BAPPA\'S PANDAL IS FULLY DECORATED & BLESSED! 🎉');
        this.statusText.setColor('#ffd54f');
        this.time.delayedCall(800, () => this.completeChallenge(true));
      }
    } else {
      // Incorrect slot!
      if (!gameState.blessingUsed) {
        gameState.blessingUsed = true;
        soundManager.playPowerUpHum();
        this.showFloatingText(slot.x, slot.y - 30, '🛡 BLESSING SAVED YOU!', '#a5d6a7');
        this.game.events.emit('hud:update');
        this.returnItemToTray(item);
        return;
      }

      soundManager.playErrorBuzz();
      gameState.recordMistake();
      this.game.events.emit('hud:update');
      this.cameras.main.shake(180, 0.015);
      this.showFloatingText(slot.x, slot.y - 30, '-50 Wrong Slot!', '#ff5252');
      this.returnItemToTray(item);
    }
  }

  returnItemToTray(item) {
    this.selectedItem = null;
    this.tweens.add({
      targets: item,
      x: item.getData('origX'),
      y: item.getData('origY'),
      duration: 250,
      ease: 'Quad.easeOut'
    });
  }

  spawnSparkles(x, y) {
    for (let i = 0; i < 6; i++) {
      const spark = this.add.image(x + Phaser.Math.Between(-25, 25), y + Phaser.Math.Between(-25, 25), 'sparkle').setScale(1.0);
      this.tweens.add({
        targets: spark,
        y: spark.y - 30,
        alpha: 0,
        scale: 1.4,
        duration: 700,
        onComplete: () => spark.destroy()
      });
    }
  }

  triggerVighnaharta() {
    if (this.isGameOver) return;
    // Auto-place one unplaced item correctly!
    const unplacedSlot = this.slots.find(s => !s.occupied);
    if (unplacedSlot) {
      const matchingItem = this.items.find(it => it.getData('id') === unplacedSlot.id && !it.getData('placed'));
      if (matchingItem) {
        this.statusText.setText('✨ VIGHNAHARTA: DIVINE PLACEMENT! ✨');
        this.statusText.setColor('#ffd54f');
        this.attemptPlacement(matchingItem, unplacedSlot);
      }
    }
  }

  showWisdomHint() {
    if (this.isGameOver) return;
    // Connect unplaced item to matching slot with glowing indicator
    const unplacedSlot = this.slots.find(s => !s.occupied);
    if (unplacedSlot) {
      const matchingItem = this.items.find(it => it.getData('id') === unplacedSlot.id && !it.getData('placed'));
      if (matchingItem) {
        const hintText = this.add.text(unplacedSlot.x, unplacedSlot.y - 50, `⬇ PLACE ${unplacedSlot.name.toUpperCase()} HERE ⬇`, {
          fontFamily: 'Outfit, sans-serif',
          fontSize: '15px',
          fontWeight: '800',
          color: '#00e676',
          stroke: '#000',
          strokeThickness: 3
        }).setOrigin(0.5).setDepth(30);

        this.tweens.add({
          targets: [hintText, matchingItem],
          scale: 1.4,
          duration: 350,
          yoyo: true,
          repeat: 3,
          onComplete: () => hintText.destroy()
        });
      }
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
    }).setOrigin(0.5).setDepth(30);

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
        challengeIndex: 2,
        challengeTitle: 'Pandal Builder',
        isSuccess: isSuccess,
        modaksEarned: this.collectedInRound,
        challengeBonus: challengeBonus,
        fastBonus: fastBonus,
        perfectBonus: perfectBonus,
        mistakes: gameState.challengeStats.mistakes,
        nextScene: 'EcoScene',
        nextTitle: 'Challenge 4: Eco Sort',
        nextData: {
          challengeIndex: 3,
          title: 'Challenge 4: Eco Sort',
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
