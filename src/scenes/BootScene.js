/**
 * BootScene: Generates all procedural vector canvas textures
 * with rich festival palette (saffron, marigold, crimson, emerald, divine purple).
 */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Show a loading text or indicator
    const { width, height } = this.scale;
    const loadText = this.add.text(width / 2, height / 2, 'Invoking Bappa\'s Blessings...', {
      fontFamily: 'Cinzel, Georgia, serif',
      fontSize: '24px',
      color: '#ffd54f'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: loadText,
      alpha: 0.3,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
  }

  create() {
    this.generateTextures();
    this.scene.start('MenuScene');
  }

  generateTextures() {
    this.createMushikaTexture();
    this.createModakTexture();
    this.createDiyaTexture();
    this.createPujaItems();
    this.createBellTextures();
    this.createEcoTextures();
    this.createRhythmTextures();
    this.createObstacleTextures();
    this.createParticleTextures();
    this.createGaneshaEmblemTexture();
    this.createExtraTextures();
  }

  createMushikaTexture() {
    if (this.textures.exists('mushika')) return;
    const canvas = this.textures.createCanvas('mushika', 64, 64);
    const ctx = canvas.getContext();

    // Body (warm grey/slate)
    ctx.fillStyle = '#78909c';
    ctx.beginPath();
    ctx.ellipse(32, 38, 18, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Saffron Dhoti/Scarf
    ctx.fillStyle = '#ff7700';
    ctx.beginPath();
    ctx.ellipse(32, 44, 14, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Golden border on dhoti
    ctx.strokeStyle = '#ffd54f';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Head
    ctx.fillStyle = '#90a4ae';
    ctx.beginPath();
    ctx.arc(32, 22, 14, 0, Math.PI * 2);
    ctx.fill();

    // Ears (outer + inner pink)
    ctx.fillStyle = '#78909c';
    ctx.beginPath();
    ctx.arc(20, 12, 8, 0, Math.PI * 2);
    ctx.arc(44, 12, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f48fb1';
    ctx.beginPath();
    ctx.arc(20, 12, 4.5, 0, Math.PI * 2);
    ctx.arc(44, 12, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#212121';
    ctx.beginPath();
    ctx.arc(26, 20, 2.5, 0, Math.PI * 2);
    ctx.arc(38, 20, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Eye shine
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(27, 19, 1, 0, Math.PI * 2);
    ctx.arc(39, 19, 1, 0, Math.PI * 2);
    ctx.fill();

    // Snout / Nose
    ctx.fillStyle = '#f48fb1';
    ctx.beginPath();
    ctx.arc(32, 27, 3, 0, Math.PI * 2);
    ctx.fill();

    // Red Tilak on forehead
    ctx.fillStyle = '#c2185b';
    ctx.beginPath();
    ctx.ellipse(32, 16, 2, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(29, 17, 6, 1.5);

    // Whiskers
    ctx.strokeStyle = '#37474f';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(28, 27); ctx.lineTo(14, 25);
    ctx.moveTo(28, 29); ctx.lineTo(15, 30);
    ctx.moveTo(36, 27); ctx.lineTo(50, 25);
    ctx.moveTo(36, 29); ctx.lineTo(49, 30);
    ctx.stroke();

    // Tail
    ctx.strokeStyle = '#90a4ae';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(18, 48);
    ctx.bezierCurveTo(8, 46, 6, 32, 12, 26);
    ctx.stroke();

    canvas.refresh();
  }

  createModakTexture() {
    if (this.textures.exists('modak')) return;
    const canvas = this.textures.createCanvas('modak', 56, 56);
    const ctx = canvas.getContext();

    // Divine outer glow
    const gradGlow = ctx.createRadialGradient(28, 28, 10, 28, 28, 26);
    gradGlow.addColorStop(0, 'rgba(255, 213, 79, 0.8)');
    gradGlow.addColorStop(0.7, 'rgba(255, 158, 66, 0.4)');
    gradGlow.addColorStop(1, 'rgba(255, 119, 0, 0)');
    ctx.fillStyle = gradGlow;
    ctx.fillRect(0, 0, 56, 56);

    // Modak Body (Golden Dumpling)
    const modakGrad = ctx.createLinearGradient(28, 10, 28, 46);
    modakGrad.addColorStop(0, '#fff9c4');
    modakGrad.addColorStop(0.3, '#fbc02d');
    modakGrad.addColorStop(1, '#f57f17');

    ctx.fillStyle = modakGrad;
    ctx.beginPath();
    ctx.moveTo(28, 10); // pointed top
    ctx.bezierCurveTo(34, 18, 44, 28, 44, 38);
    ctx.bezierCurveTo(44, 46, 36, 48, 28, 48);
    ctx.bezierCurveTo(20, 48, 12, 46, 12, 38);
    ctx.bezierCurveTo(12, 28, 22, 18, 28, 10);
    ctx.fill();

    // Pleats / Folds
    ctx.strokeStyle = '#e65100';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(28, 11); ctx.lineTo(28, 48);
    ctx.moveTo(28, 14); ctx.quadraticCurveTo(36, 28, 38, 44);
    ctx.moveTo(28, 14); ctx.quadraticCurveTo(20, 28, 18, 44);
    ctx.stroke();

    // Saffron Kesar Mark on Top
    ctx.fillStyle = '#d84315';
    ctx.beginPath();
    ctx.arc(28, 14, 2.5, 0, Math.PI * 2);
    ctx.fill();

    canvas.refresh();
  }

  createDiyaTexture() {
    if (this.textures.exists('diya')) return;
    const canvas = this.textures.createCanvas('diya', 50, 50);
    const ctx = canvas.getContext();

    // Clay Base
    ctx.fillStyle = '#bf360c';
    ctx.beginPath();
    ctx.moveTo(10, 30);
    ctx.bezierCurveTo(10, 44, 40, 44, 40, 30);
    ctx.bezierCurveTo(40, 28, 10, 28, 10, 30);
    ctx.fill();

    // Golden rim
    ctx.strokeStyle = '#ffd54f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(25, 30, 15, 4, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Flame
    const flameGrad = ctx.createRadialGradient(25, 20, 2, 25, 20, 12);
    flameGrad.addColorStop(0, '#ffffff');
    flameGrad.addColorStop(0.3, '#ffeb3b');
    flameGrad.addColorStop(0.7, '#ff5722');
    flameGrad.addColorStop(1, 'rgba(255, 87, 34, 0)');
    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.moveTo(25, 8);
    ctx.quadraticCurveTo(32, 18, 25, 26);
    ctx.quadraticCurveTo(18, 18, 25, 8);
    ctx.fill();

    canvas.refresh();
  }

  createPujaItems() {
    // Kalash
    if (!this.textures.exists('kalash')) {
      const c = this.textures.createCanvas('kalash', 50, 50);
      const ctx = c.getContext();
      // Pot
      ctx.fillStyle = '#ff8f00';
      ctx.beginPath();
      ctx.arc(25, 32, 14, 0, Math.PI * 2);
      ctx.fill();
      // Coconut
      ctx.fillStyle = '#5d4037';
      ctx.beginPath();
      ctx.arc(25, 16, 8, 0, Math.PI * 2);
      ctx.fill();
      // Mango leaves
      ctx.fillStyle = '#2e7d32';
      ctx.beginPath();
      ctx.ellipse(18, 20, 7, 3, -0.6, 0, Math.PI * 2);
      ctx.ellipse(32, 20, 7, 3, 0.6, 0, Math.PI * 2);
      ctx.fill();
      c.refresh();
    }

    // Garland / Flower Offering
    if (!this.textures.exists('item_flower')) {
      const c = this.textures.createCanvas('item_flower', 44, 44);
      const ctx = c.getContext();
      ctx.fillStyle = '#ff6f00';
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = 22 + Math.cos(angle) * 10;
        const y = 22 + Math.sin(angle) * 10;
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#ffd54f';
      ctx.beginPath();
      ctx.arc(22, 22, 6, 0, Math.PI * 2);
      ctx.fill();
      c.refresh();
    }

    // Toran
    if (!this.textures.exists('toran')) {
      const c = this.textures.createCanvas('toran', 80, 40);
      const ctx = c.getContext();
      ctx.strokeStyle = '#ffd54f';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(5, 10);
      ctx.quadraticCurveTo(40, 24, 75, 10);
      ctx.stroke();
      // Hanging marigolds
      const colors = ['#e65100', '#ffd54f', '#c2185b', '#ffd54f', '#e65100'];
      colors.forEach((col, idx) => {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(16 + idx * 12, 18 + (idx === 2 ? 6 : 2), 5, 0, Math.PI * 2);
        ctx.fill();
      });
      c.refresh();
    }
  }

  createBellTextures() {
    const gemColors = ['#e53935', '#43a047', '#1e88e5', '#fdd835'];
    gemColors.forEach((color, i) => {
      const key = `bell_${i}`;
      if (this.textures.exists(key)) return;
      const c = this.textures.createCanvas(key, 64, 64);
      const ctx = c.getContext();

      // Golden Bell Dome
      const grad = ctx.createLinearGradient(16, 12, 48, 48);
      grad.addColorStop(0, '#fff59d');
      grad.addColorStop(0.5, '#fbc02d');
      grad.addColorStop(1, '#f57f17');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(32, 10);
      ctx.bezierCurveTo(42, 14, 48, 30, 50, 44);
      ctx.lineTo(14, 44);
      ctx.bezierCurveTo(16, 30, 22, 14, 32, 10);
      ctx.fill();

      // Rim
      ctx.fillStyle = '#f57f17';
      ctx.fillRect(10, 44, 44, 6);

      // Clapper
      ctx.fillStyle = '#b71c1c';
      ctx.beginPath();
      ctx.arc(32, 53, 5, 0, Math.PI * 2);
      ctx.fill();

      // Colored Gem in center
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(32, 30, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      c.refresh();
    });
  }

  createEcoTextures() {
    // Eco Basket (Wicker Catcher)
    if (!this.textures.exists('basket')) {
      const c = this.textures.createCanvas('basket', 80, 40);
      const ctx = c.getContext();
      ctx.fillStyle = '#8d6e63';
      ctx.beginPath();
      ctx.roundRect(10, 8, 60, 28, [4, 4, 12, 12]);
      ctx.fill();
      ctx.strokeStyle = '#4e342e';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Weave pattern
      ctx.strokeStyle = '#d7ccc8';
      ctx.lineWidth = 1.5;
      for (let x = 16; x <= 64; x += 8) {
        ctx.beginPath();
        ctx.moveTo(x, 10); ctx.lineTo(x, 34);
        ctx.stroke();
      }
      c.refresh();
    }

    // Plastic / Toxic items
    if (!this.textures.exists('item_plastic_cup')) {
      const c = this.textures.createCanvas('item_plastic_cup', 40, 40);
      const ctx = c.getContext();
      ctx.fillStyle = '#90caf9';
      ctx.beginPath();
      ctx.moveTo(12, 8);
      ctx.lineTo(28, 8);
      ctx.lineTo(24, 32);
      ctx.lineTo(16, 32);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#e53935';
      ctx.lineWidth = 2;
      ctx.stroke();
      c.refresh();
    }
  }

  createRhythmTextures() {
    const padColors = ['#ff7700', '#f9a825', '#c2185b', '#1b5e20'];
    padColors.forEach((col, idx) => {
      const key = `dhol_pad_${idx}`;
      if (this.textures.exists(key)) return;
      const c = this.textures.createCanvas(key, 70, 70);
      const ctx = c.getContext();

      // Drum rim
      ctx.fillStyle = '#4e342e';
      ctx.beginPath();
      ctx.arc(35, 35, 32, 0, Math.PI * 2);
      ctx.fill();

      // Drum skin
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(35, 35, 27, 0, Math.PI * 2);
      ctx.fill();

      // Golden center ring
      ctx.strokeStyle = '#ffd54f';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(35, 35, 14, 0, Math.PI * 2);
      ctx.stroke();

      c.refresh();
    });
  }

  createObstacleTextures() {
    if (!this.textures.exists('obstacle_barrier')) {
      const c = this.textures.createCanvas('obstacle_barrier', 48, 48);
      const ctx = c.getContext();
      ctx.fillStyle = '#d32f2f';
      ctx.beginPath();
      ctx.roundRect(4, 12, 40, 24, 6);
      ctx.fill();
      ctx.strokeStyle = '#ffd54f';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Warning stripes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(12, 14); ctx.lineTo(18, 14); ctx.lineTo(12, 34); ctx.lineTo(6, 34); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(24, 14); ctx.lineTo(30, 14); ctx.lineTo(24, 34); ctx.lineTo(18, 34); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(36, 14); ctx.lineTo(42, 14); ctx.lineTo(36, 34); ctx.lineTo(30, 34); ctx.fill();
      c.refresh();
    }
  }

  createParticleTextures() {
    if (!this.textures.exists('sparkle')) {
      const c = this.textures.createCanvas('sparkle', 16, 16);
      const ctx = c.getContext();
      ctx.fillStyle = '#ffd54f';
      ctx.beginPath();
      ctx.arc(8, 8, 4, 0, Math.PI * 2);
      ctx.fill();
      c.refresh();
    }

    if (!this.textures.exists('confetti')) {
      const c = this.textures.createCanvas('confetti', 12, 12);
      const ctx = c.getContext();
      ctx.fillStyle = '#ff4081';
      ctx.fillRect(2, 2, 8, 8);
      c.refresh();
    }
  }

  createGaneshaEmblemTexture() {
    if (this.textures.exists('ganesha_emblem')) return;
    const c = this.textures.createCanvas('ganesha_emblem', 100, 100);
    const ctx = c.getContext();

    // Divine halo aura
    const grad = ctx.createRadialGradient(50, 50, 10, 50, 50, 48);
    grad.addColorStop(0, 'rgba(255, 213, 79, 0.9)');
    grad.addColorStop(0.6, 'rgba(255, 119, 0, 0.5)');
    grad.addColorStop(1, 'rgba(74, 20, 140, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(50, 50, 48, 0, Math.PI * 2);
    ctx.fill();

    // Golden Crown (Mukut)
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.moveTo(50, 12);
    ctx.lineTo(62, 34);
    ctx.lineTo(38, 34);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#c2185b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Big Ears
    ctx.fillStyle = '#ff9e42';
    ctx.beginPath();
    ctx.arc(28, 44, 14, 0, Math.PI * 2);
    ctx.arc(72, 44, 14, 0, Math.PI * 2);
    ctx.fill();

    // Face / Head
    ctx.fillStyle = '#ff9e42';
    ctx.beginPath();
    ctx.arc(50, 46, 18, 0, Math.PI * 2);
    ctx.fill();

    // Trunk
    ctx.strokeStyle = '#ff9e42';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(50, 48);
    ctx.quadraticCurveTo(50, 72, 64, 70);
    ctx.stroke();

    // Tilak
    ctx.fillStyle = '#c2185b';
    ctx.beginPath();
    ctx.ellipse(50, 40, 2.5, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    c.refresh();
  }

  createExtraTextures() {
    // Sacred Coconut
    if (!this.textures.exists('item_coconut')) {
      const c = this.textures.createCanvas('item_coconut', 48, 48);
      const ctx = c.getContext();
      // Husk
      ctx.fillStyle = '#6d4c41';
      ctx.beginPath();
      ctx.ellipse(24, 24, 18, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#4e342e';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Tuft on top
      ctx.fillStyle = '#4e342e';
      ctx.beginPath();
      ctx.moveTo(24, 2); ctx.lineTo(20, 10); ctx.lineTo(28, 10);
      ctx.closePath();
      ctx.fill();
      // Sacred Tilak on coconut
      ctx.fillStyle = '#d84315';
      ctx.beginPath();
      ctx.arc(24, 24, 4, 0, Math.PI * 2);
      ctx.fill();
      c.refresh();
    }

    // Sacred Modak Thali (Offering Plate)
    if (!this.textures.exists('item_thali')) {
      const c = this.textures.createCanvas('item_thali', 60, 60);
      const ctx = c.getContext();
      // Silver/Golden Platter
      const grad = ctx.createRadialGradient(30, 30, 5, 30, 30, 28);
      grad.addColorStop(0, '#fff9c4');
      grad.addColorStop(0.6, '#ffd54f');
      grad.addColorStop(1, '#ff9800');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(30, 30, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#e65100';
      ctx.lineWidth = 2;
      ctx.stroke();
      // 3 Mini Modaks on plate
      ctx.fillStyle = '#ffffff';
      [ {x: 30, y: 20}, {x: 22, y: 34}, {x: 38, y: 34} ].forEach(pos => {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y - 7);
        ctx.bezierCurveTo(pos.x + 6, pos.y, pos.x + 6, pos.y + 6, pos.x, pos.y + 6);
        ctx.bezierCurveTo(pos.x - 6, pos.y + 6, pos.x - 6, pos.y, pos.x, pos.y - 7);
        ctx.fill();
        ctx.fillStyle = '#ff3d00';
        ctx.fillRect(pos.x - 1, pos.y - 5, 2, 2);
        ctx.fillStyle = '#ffffff';
      });
      c.refresh();
    }

    // Aarti Diya Plate
    if (!this.textures.exists('aarti_plate')) {
      const c = this.textures.createCanvas('aarti_plate', 80, 80);
      const ctx = c.getContext();
      // Golden Rim
      const grad = ctx.createRadialGradient(40, 40, 10, 40, 40, 38);
      grad.addColorStop(0, '#fff59d');
      grad.addColorStop(0.5, '#ffd54f');
      grad.addColorStop(1, '#ff6f00');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(40, 40, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#e65100';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Inner Red Velvet Circle
      ctx.fillStyle = '#c2185b';
      ctx.beginPath();
      ctx.arc(40, 40, 22, 0, Math.PI * 2);
      ctx.fill();

      // Center Diya Flame
      ctx.fillStyle = '#ffeb3b';
      ctx.beginPath();
      ctx.arc(40, 40, 8, 0, Math.PI * 2);
      ctx.fill();

      // Flame tip
      ctx.fillStyle = '#ff5722';
      ctx.beginPath();
      ctx.moveTo(40, 24);
      ctx.quadraticCurveTo(46, 36, 40, 42);
      ctx.quadraticCurveTo(34, 36, 40, 24);
      ctx.fill();

      c.refresh();
    }
  }
}
