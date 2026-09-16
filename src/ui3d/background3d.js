/**
 * 3D Ambient Festival Background for Ganesha: The 21 Modaks
 * Three.js (r160) ambient background behind Phaser 2D game canvas.
 * Low-poly diyas, floating marigold petals, glowing brand dust particles,
 * desktop mouse & mobile gyroscope parallax, auto-pauses/throttles during active mini-games.
 */
import { BRAND_COLORS, getGradient } from './theme.js';

export class Background3D {
  constructor(canvasElement) {
    this.canvas = canvasElement || document.getElementById('three-bg-canvas');
    this.mode = 'menu'; // 'menu', 'gameplay', 'paused'
    this.targetMouse = { x: 0, y: 0 };
    this.mouse = { x: 0, y: 0 };
    this.animationFrameId = null;

    this.init();
  }

  init() {
    if (typeof THREE === 'undefined' || !this.canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.fog = new THREE.FogExp2(0x000000, 0.08);

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 7);

    // WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Ambient & Point Lighting in brand colors
    const ambientLight = new THREE.AmbientLight(0x1a092b, 1.2);
    this.scene.add(ambientLight);

    this.diyaLight1 = new THREE.PointLight(0xf2b33d, 2.0, 12);
    this.diyaLight1.position.set(-3.5, -1.8, 2);
    this.scene.add(this.diyaLight1);

    this.diyaLight2 = new THREE.PointLight(0xe8547a, 2.0, 12);
    this.diyaLight2.position.set(3.5, -1.8, 2);
    this.scene.add(this.diyaLight2);

    this.centerGlow = new THREE.PointLight(0x3b2fd4, 1.5, 14);
    this.centerGlow.position.set(0, 2, 1);
    this.scene.add(this.centerGlow);

    // Create 3D Objects
    this.createDiyas();
    this.createFloatingPetals();
    this.createDustParticles();

    // Mouse Parallax Listener
    this.onMouseMove = (e) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      this.targetMouse.x = (e.clientX - halfW) / halfW;
      this.targetMouse.y = (e.clientY - halfH) / halfH;
    };
    window.addEventListener('mousemove', this.onMouseMove, { passive: true });

    // Gyroscope Parallax Listener for Mobile
    this.onDeviceOrientation = (e) => {
      if (!window.__gyroPermissionGranted && !e.gamma) return;
      const gamma = e.gamma || 0; // Left-to-right [-90, 90]
      const beta = e.beta || 0;   // Front-to-back [-180, 180]
      this.targetMouse.x = Math.max(-1, Math.min(1, gamma / 30));
      this.targetMouse.y = Math.max(-1, Math.min(1, (beta - 45) / 30));
    };
    window.addEventListener('deviceorientation', this.onDeviceOrientation, { passive: true });

    // Resize Listener
    this.onResize = () => {
      if (!this.renderer || !this.camera) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };
    window.addEventListener('resize', this.onResize);

    // Start Loop
    this.clock = new THREE.Clock();
    this.animate();
  }

  createDiyas() {
    this.diyas = [];

    const diyaPositions = [
      { x: -3.8, y: -2.0, z: 0, col: 0xf2b33d },
      { x: 3.8, y: -2.0, z: 0, col: 0xe8547a },
      { x: -4.5, y: 1.5, z: -2, col: 0xa63bd6 },
      { x: 4.5, y: 1.5, z: -2, col: 0x00e5ff }
    ];

    diyaPositions.forEach((pos) => {
      const diyaGroup = new THREE.Group();

      // Low-poly clay base
      const baseGeom = new THREE.CylinderGeometry(0.35, 0.15, 0.18, 12);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x3e1808,
        roughness: 0.8,
        metalness: 0.1
      });
      const baseMesh = new THREE.Mesh(baseGeom, baseMat);
      diyaGroup.add(baseMesh);

      // Golden Rim
      const rimGeom = new THREE.TorusGeometry(0.35, 0.04, 8, 16);
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0xf2b33d,
        roughness: 0.3,
        metalness: 0.8,
        emissive: 0xf2b33d,
        emissiveIntensity: 0.2
      });
      const rimMesh = new THREE.Mesh(rimGeom, rimMat);
      rimMesh.rotation.x = Math.PI / 2;
      rimMesh.position.y = 0.08;
      diyaGroup.add(rimMesh);

      // Diya Flame
      const flameGeom = new THREE.ConeGeometry(0.12, 0.32, 8);
      const flameMat = new THREE.MeshBasicMaterial({
        color: pos.col,
        transparent: true,
        opacity: 0.95
      });
      const flameMesh = new THREE.Mesh(flameGeom, flameMat);
      flameMesh.position.y = 0.25;
      diyaGroup.add(flameMesh);

      diyaGroup.position.set(pos.x, pos.y, pos.z);
      this.scene.add(diyaGroup);

      this.diyas.push({ group: diyaGroup, flame: flameMesh, basePos: { ...pos } });
    });
  }

  createFloatingPetals() {
    this.petals = [];
    const petalCount = 28;

    const brandColors = [0xe8547a, 0xf2b33d, 0xa63bd6, 0x00e5ff];

    for (let i = 0; i < petalCount; i++) {
      // Curved oval petal geometry
      const geom = new THREE.PlaneGeometry(0.25, 0.35, 4, 4);
      const pos = geom.attributes.position;
      for (let j = 0; j < pos.count; j++) {
        const x = pos.getX(j);
        pos.setZ(j, -Math.abs(x) * 0.15);
      }
      geom.computeVertexNormals();

      const col = brandColors[Math.floor(Math.random() * brandColors.length)];
      const mat = new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 0.35,
        roughness: 0.4,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geom, mat);
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 6 - 1;
      mesh.position.set(x, y, z);

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      this.scene.add(mesh);

      this.petals.push({
        mesh,
        rotSpeed: {
          x: (Math.random() - 0.5) * 1.2,
          y: (Math.random() - 0.5) * 1.5,
          z: (Math.random() - 0.5) * 0.8
        },
        driftSpeed: {
          x: Math.sin(i) * 0.2,
          y: -(Math.random() * 0.3 + 0.15),
          z: Math.cos(i) * 0.15
        }
      });
    }
  }

  createDustParticles() {
    const particleCount = 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const brandColorsRgb = [
      new THREE.Color(BRAND_COLORS.indigo),
      new THREE.Color(BRAND_COLORS.violet),
      new THREE.Color(BRAND_COLORS.amber),
      new THREE.Color(BRAND_COLORS.coral),
      new THREE.Color(BRAND_COLORS.cyan)
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      const col = brandColorsRgb[Math.floor(Math.random() * brandColorsRgb.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    this.dust = new THREE.Points(geometry, pMat);
    this.scene.add(this.dust);
  }

  setMode(mode) {
    this.mode = mode; // 'menu', 'gameplay', 'results', 'paused'
    if (this.canvas) {
      if (mode === 'gameplay') {
        this.canvas.style.opacity = '0.35'; // Subtly dimmed during 2D action
      } else {
        this.canvas.style.opacity = '1.0';
      }
    }
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // Skip heavy renders if paused
    if (this.mode === 'paused') return;

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Smooth Mouse / Gyro Parallax Lerp
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

    if (this.camera) {
      this.camera.position.x = this.mouse.x * 0.8;
      this.camera.position.y = -this.mouse.y * 0.5;
      this.camera.lookAt(0, 0, 0);
    }

    // Flame Flicker
    if (this.diyas) {
      this.diyas.forEach((diya, i) => {
        const flicker = Math.sin(time * 8 + i * 2) * 0.08 + Math.cos(time * 12 + i) * 0.04;
        diya.flame.scale.set(1 + flicker, 1 + flicker * 1.5, 1 + flicker);
        diya.group.position.y = diya.basePos.y + Math.sin(time * 1.5 + i) * 0.06;
      });
    }

    if (this.diyaLight1) {
      this.diyaLight1.intensity = 2.0 + Math.sin(time * 10) * 0.4;
    }
    if (this.diyaLight2) {
      this.diyaLight2.intensity = 2.0 + Math.cos(time * 9) * 0.4;
    }

    // Floating Petals Animation
    if (this.petals && this.mode !== 'gameplay') {
      this.petals.forEach((p) => {
        p.mesh.rotation.x += p.rotSpeed.x * delta;
        p.mesh.rotation.y += p.rotSpeed.y * delta;
        p.mesh.rotation.z += p.rotSpeed.z * delta;

        p.mesh.position.x += p.driftSpeed.x * delta;
        p.mesh.position.y += p.driftSpeed.y * delta;
        p.mesh.position.z += p.driftSpeed.z * delta;

        // Wrap around bounds
        if (p.mesh.position.y < -4.5) {
          p.mesh.position.y = 4.5;
          p.mesh.position.x = (Math.random() - 0.5) * 12;
        }
      });
    }

    // Gentle Dust Float
    if (this.dust) {
      this.dust.rotation.y = time * 0.03;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  dispose() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('deviceorientation', this.onDeviceOrientation);
    window.removeEventListener('resize', this.onResize);

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
  }
}
