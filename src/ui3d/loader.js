/**
 * 3D Animated Loader Screen for Ganesha: The 21 Modaks
 * Three.js (r160) continuous-line Ganesha emblem, 4-stage accent dots, 
 * brand gradient particles (Indigo -> Violet -> Amber -> Coral),
 * real asset loading progress, Web Audio activation & device orientation request.
 */
import { BRAND_COLORS, FOUR_ACCENT_DOTS, getGradient } from './theme.js';
import { soundManager } from '../audio/SoundManager.js';

export class Loader3D {
  constructor(options = {}) {
    this.container = options.container || document.body;
    this.onComplete = options.onComplete || (() => {});
    this.progress = 0;
    this.isReady = false;
    this.hasUserStarted = false;
    this.animationFrameId = null;

    this.initDOM();
    this.initThree();
  }

  isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  initDOM() {
    this.domRoot = document.createElement('div');
    this.domRoot.id = 'loader3d-root';
    this.domRoot.className = 'loader3d-overlay';
    this.domRoot.innerHTML = `
      <div class="loader3d-canvas-wrapper" id="loader3d-canvas-wrap"></div>
      
      <div class="loader3d-ui" id="loader3d-ui">
        <div class="loader3d-title-wrap">
          <h1 class="loader3d-title">GANESHA</h1>
          <p class="loader3d-subtitle">THE 21 MODAKS</p>
        </div>

        <!-- 4 Accent Dots Progress Indicator -->
        <div class="loader3d-dots" id="loader3d-dots">
          <div class="loader3d-dot dot-coral" id="dot-0" title="25%"></div>
          <div class="loader3d-dot dot-gold" id="dot-1" title="50%"></div>
          <div class="loader3d-dot dot-cyan" id="dot-2" title="75%"></div>
          <div class="loader3d-dot dot-magenta" id="dot-3" title="100%"></div>
        </div>

        <!-- Real Progress Bar -->
        <div class="loader3d-progress-track">
          <div class="loader3d-progress-bar" id="loader3d-bar"></div>
        </div>
        <div class="loader3d-percent" id="loader3d-percent">Invoking Blessings... 0%</div>

        <!-- Tap to Begin Button -->
        <button class="loader3d-begin-btn" id="loader3d-begin-btn">
          <span>✨ TAP TO BEGIN FESTIVAL ✨</span>
        </button>
      </div>

      <!-- Fallback spinner if WebGL is unavailable -->
      <div class="loader3d-fallback" id="loader3d-fallback" style="display: none;">
        <img src="src/assets/branding/ganesha-idol.jpg" alt="Ganesha Idol" class="loader3d-fallback-logo rounded-2xl shadow-lg" />
        <div class="loader3d-spinner"></div>
      </div>
    `;

    this.container.appendChild(this.domRoot);

    this.barEl = this.domRoot.querySelector('#loader3d-bar');
    this.percentEl = this.domRoot.querySelector('#loader3d-percent');
    this.beginBtn = this.domRoot.querySelector('#loader3d-begin-btn');
    this.dots = [
      this.domRoot.querySelector('#dot-0'),
      this.domRoot.querySelector('#dot-1'),
      this.domRoot.querySelector('#dot-2'),
      this.domRoot.querySelector('#dot-3')
    ];

    this.beginBtn.addEventListener('click', () => this.handleBeginClick());
    this.beginBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.handleBeginClick();
    });
  }

  initThree() {
    if (!this.isWebGLAvailable() || typeof THREE === 'undefined') {
      console.warn('WebGL or Three.js not available, showing CSS fallback');
      const fb = this.domRoot.querySelector('#loader3d-fallback');
      if (fb) fb.style.display = 'flex';
      return;
    }

    const wrap = this.domRoot.querySelector('#loader3d-canvas-wrap');
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene, Camera, Renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 8);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    wrap.appendChild(this.renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xf2b33d, 2.5, 50);
    pointLight.position.set(2, 4, 5);
    this.scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xa63bd6, 2.0, 50);
    pointLight2.position.set(-3, -2, 4);
    this.scene.add(pointLight2);

    // Group for Centerpiece
    this.centerGroup = new THREE.Group();
    this.scene.add(this.centerGroup);

    this.createGaneshaMesh();
    this.createParticleCloud();

    // Window Resize Handler
    this.resizeHandler = () => {
      if (!this.renderer || !this.camera) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };
    window.addEventListener('resize', this.resizeHandler);

    // Start Render Loop
    this.clock = new THREE.Clock();
    this.animate();
  }

  createGaneshaMesh() {
    // High quality canvas texture of the Ganesha line art
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Gradient stroke matching branding
    const grad = ctx.createLinearGradient(150, 100, 850, 900);
    grad.addColorStop(0.0, '#3b2fd4'); // Indigo
    grad.addColorStop(0.25, '#00e5ff'); // Cyan
    grad.addColorStop(0.5, '#a63bd6'); // Violet/Magenta
    grad.addColorStop(0.75, '#f2b33d'); // Amber/Gold
    grad.addColorStop(1.0, '#e8547a'); // Coral

    ctx.clearRect(0, 0, 1024, 1024);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 24;
    ctx.shadowColor = '#f2b33d';

    // Scale up paths to 1024x1024
    ctx.save();
    ctx.scale(2, 2);

    // Mukut / Crown
    ctx.strokeStyle = grad;
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.moveTo(256, 60);
    ctx.quadraticCurveTo(280, 110, 256, 160);
    ctx.quadraticCurveTo(232, 110, 256, 60);
    ctx.stroke();

    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(220, 140);
    ctx.quadraticCurveTo(256, 120, 292, 140);
    ctx.stroke();

    // Left Ear to Trunk Swoop
    ctx.lineWidth = 13;
    ctx.beginPath();
    ctx.moveTo(220, 160);
    ctx.bezierCurveTo(130, 150, 90, 240, 150, 310);
    ctx.bezierCurveTo(190, 350, 240, 300, 246, 220);
    ctx.bezierCurveTo(250, 170, 262, 170, 266, 220);
    ctx.bezierCurveTo(272, 300, 240, 370, 270, 410);
    ctx.bezierCurveTo(295, 440, 350, 430, 360, 380);
    ctx.bezierCurveTo(370, 330, 320, 320, 310, 350);
    ctx.stroke();

    // Right Ear Arc
    ctx.beginPath();
    ctx.moveTo(292, 160);
    ctx.bezierCurveTo(382, 150, 422, 240, 362, 310);
    ctx.stroke();

    // Sacred Eye & Tilak
    ctx.fillStyle = '#f2b33d';
    ctx.beginPath();
    ctx.ellipse(230, 200, 6, 10, -0.26, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#e8547a';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(256, 165);
    ctx.lineTo(256, 195);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(256, 155, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#f2b33d';
    ctx.fill();

    // Sacred Tusk
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(225, 285);
    ctx.quadraticCurveTo(200, 290, 190, 280);
    ctx.stroke();

    ctx.restore();

    // Create 3D Mesh with Curved Plane and Emissive Material
    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;

    // Curved plane geometry for high fidelity depth
    const geom = new THREE.PlaneGeometry(3.6, 3.6, 32, 32);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Subtle parabolic curve
      const z = -(x * x + y * y) * 0.05;
      pos.setZ(i, z);
    }
    geom.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      emissive: new THREE.Color(0xf2b33d),
      emissiveMap: texture,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.4,
      side: THREE.DoubleSide
    });

    this.ganeshaMesh = new THREE.Mesh(geom, mat);
    this.ganeshaMesh.position.set(0, 0.4, 0);
    this.centerGroup.add(this.ganeshaMesh);

    // Back glow ring
    const ringGeom = new THREE.RingGeometry(1.6, 2.0, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x3b2fd4,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    this.ringMesh = new THREE.Mesh(ringGeom, ringMat);
    this.ringMesh.position.set(0, 0.4, -0.3);
    this.centerGroup.add(this.ringMesh);
  }

  createParticleCloud() {
    const particleCount = 140;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    this.particleSpeeds = [];

    const brandColorsRgb = [
      new THREE.Color(BRAND_COLORS.indigo),
      new THREE.Color(BRAND_COLORS.violet),
      new THREE.Color(BRAND_COLORS.amber),
      new THREE.Color(BRAND_COLORS.coral),
      new THREE.Color(BRAND_COLORS.cyan)
    ];

    for (let i = 0; i < particleCount; i++) {
      // Swirling cylinder distribution
      const radius = 1.2 + Math.random() * 2.6;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 4.0 + 0.4;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      const col = brandColorsRgb[Math.floor(Math.random() * brandColorsRgb.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      scales[i] = Math.random() * 0.08 + 0.03;

      this.particleSpeeds.push({
        angleSpeed: (Math.random() * 0.4 + 0.2) * (Math.random() < 0.5 ? 1 : -1),
        yVelocity: (Math.random() - 0.5) * 0.3,
        radius: radius,
        baseAngle: angle
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    pGrad.addColorStop(0.3, 'rgba(242, 179, 61, 0.8)');
    pGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 32, 32);

    const pTexture = new THREE.CanvasTexture(pCanvas);

    const pMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, pMat);
    this.scene.add(this.particles);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const delta = this.clock ? this.clock.getDelta() : 0.016;
    const elapsedTime = this.clock ? this.clock.getElapsedTime() : 0;

    // Centerpiece rotation & bobbing
    if (this.centerGroup) {
      this.centerGroup.rotation.y = Math.sin(elapsedTime * 0.7) * 0.25;
      this.centerGroup.rotation.x = Math.cos(elapsedTime * 0.5) * 0.1;
      this.centerGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.12;
    }

    if (this.ringMesh) {
      this.ringMesh.rotation.z += delta * 0.4;
    }

    // Particle Swirl
    if (this.particles && this.particleSpeeds) {
      const positions = this.particles.geometry.attributes.position.array;
      for (let i = 0; i < this.particleSpeeds.length; i++) {
        const p = this.particleSpeeds[i];
        p.baseAngle += p.angleSpeed * delta;

        positions[i * 3] = Math.cos(p.baseAngle) * p.radius;
        positions[i * 3 + 1] += p.yVelocity * delta;
        positions[i * 3 + 2] = Math.sin(p.baseAngle) * p.radius;

        // Wrap Y bounds
        if (positions[i * 3 + 1] > 2.8) positions[i * 3 + 1] = -2.0;
        if (positions[i * 3 + 1] < -2.0) positions[i * 3 + 1] = 2.8;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  /**
   * Updates real progress from Phaser / BootScene (0.0 to 1.0)
   */
  setProgress(value) {
    this.progress = Math.max(0, Math.min(1, value));
    const percent = Math.round(this.progress * 100);

    if (this.barEl) {
      this.barEl.style.width = `${percent}%`;
    }

    if (this.percentEl) {
      this.percentEl.innerText = this.progress >= 1.0 ? 'Blessings Received • 100%' : `Invoking Blessings... ${percent}%`;
    }

    // Update 4-stage accent dots
    // Dot 0 (Coral >= 25%), Dot 1 (Gold >= 50%), Dot 2 (Cyan >= 75%), Dot 3 (Magenta >= 100%)
    if (this.dots) {
      if (this.progress >= 0.25) this.dots[0].classList.add('active');
      if (this.progress >= 0.50) this.dots[1].classList.add('active');
      if (this.progress >= 0.75) this.dots[2].classList.add('active');
      if (this.progress >= 1.00) this.dots[3].classList.add('active');
    }

    if (this.progress >= 1.0 && !this.isReady) {
      this.isReady = true;
      this.showBeginButton();
    }
  }

  showBeginButton() {
    if (this.beginBtn) {
      this.beginBtn.classList.add('visible');
    }
  }

  async handleBeginClick() {
    if (this.hasUserStarted) return;
    this.hasUserStarted = true;

    // 1. Resume Web Audio context immediately on user gesture
    soundManager.init();
    soundManager.playBellChime(1046.5);

    // 2. Request iOS Device Orientation permission if applicable
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          window.__gyroPermissionGranted = true;
        }
      } catch (err) {
        console.log('DeviceOrientation permission notice:', err);
      }
    }

    // 3. Scale-and-fade exit transition
    this.exitLoader();
  }

  exitLoader() {
    if (this.domRoot) {
      this.domRoot.classList.add('fade-out');
    }

    // Tween camera forward & scale down centerpiece
    if (this.centerGroup) {
      const startTime = performance.now();
      const duration = 650;

      const exitAnim = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const ease = t * t;

        if (this.camera) this.camera.position.z = 8 + ease * 4;
        if (this.centerGroup) this.centerGroup.scale.set(1 - ease * 0.4, 1 - ease * 0.4, 1 - ease * 0.4);

        if (t < 1) {
          requestAnimationFrame(exitAnim);
        } else {
          this.dispose();
          if (this.onComplete) this.onComplete();
        }
      };
      requestAnimationFrame(exitAnim);
    } else {
      setTimeout(() => {
        this.dispose();
        if (this.onComplete) this.onComplete();
      }, 650);
    }
  }

  dispose() {
    // Stop render loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }

    // Dispose Geometries and Materials
    if (this.scene) {
      this.scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    }

    // Clean up Three.js Renderer and WebGL Context
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer = null;
    }

    // Remove Loader DOM root completely
    if (this.domRoot && this.domRoot.parentNode) {
      this.domRoot.parentNode.removeChild(this.domRoot);
      this.domRoot = null;
    }
  }
}
