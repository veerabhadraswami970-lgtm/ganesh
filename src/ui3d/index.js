/**
 * 3D UI Bridge Coordinator for Ganesha: The 21 Modaks
 * Integrates 3D loader, ambient Three.js background, 3D card tilt & selector,
 * and 3D screen transitions with Phaser game events.
 */
import { BRAND_COLORS, injectThemeCSSVariables } from './theme.js';
import { Loader3D } from './loader.js';
import { Background3D } from './background3d.js';
import { Menu3D } from './menu3d.js';
import { Transitions3D } from './transitions3d.js';

class UI3DManager {
  constructor() {
    this.game = null;
    this.loader = null;
    this.background = null;
    this.menu3d = null;
    this.transitions = null;
    this.isInitialized = false;
  }

  init(game) {
    if (this.isInitialized) return;
    this.isInitialized = true;
    this.game = game;

    // Inject CSS variables from theme.js
    injectThemeCSSVariables();

    const gameContainer = document.getElementById('game-container');
    const bgCanvas = document.getElementById('three-bg-canvas');

    // 1. Initialize 3D Background Layer
    if (bgCanvas) {
      this.background = new Background3D(bgCanvas);
    }

    // 2. Initialize 3D Menu & Transitions
    this.menu3d = new Menu3D({ container: gameContainer, game: this.game });
    this.transitions = new Transitions3D(gameContainer);

    // 3. Initialize 3D Loader
    this.loader = new Loader3D({
      container: document.body,
      onComplete: () => {
        // When user taps "TAP TO BEGIN", transition cleanly into game
        if (this.background) {
          this.background.setMode('menu');
        }
      }
    });

    // 4. Wire Global Game Events
    this.wireGameEvents();
  }

  wireGameEvents() {
    if (!this.game) return;

    // Listen to asset loader progress events dispatched from BootScene
    this.game.events.on('loader:progress', (pct) => {
      if (this.loader) {
        this.loader.setProgress(pct);
      }
    });

    // Listen to Scene Changes to throttle background & trigger transitions
    this.game.events.on('scene:change', (sceneKey) => {
      if (this.background) {
        if (sceneKey.includes('Run') || sceneKey.includes('Memory') || sceneKey.includes('Pandal') || sceneKey.includes('Eco') || sceneKey.includes('Rhythm')) {
          this.background.setMode('gameplay');
        } else {
          this.background.setMode('menu');
        }
      }
    });

    // Expose open mini-game selector
    window.open3DMiniGameSelector = (onSelect) => {
      if (this.menu3d) {
        this.menu3d.showMiniGameSelector(onSelect);
      }
    };

    // Expose open Global Leaderboard
    window.open3DLeaderboard = () => {
      if (this.menu3d) {
        this.menu3d.showLeaderboardModal();
      }
    };

    // Expose 3D Cube Scene Transition
    window.transition3DScene = (onMidpoint, dir = 'left') => {
      if (this.transitions) {
        this.transitions.cubeRotate(onMidpoint, dir);
      } else if (onMidpoint) {
        onMidpoint();
      }
    };
  }
}

export const ui3d = new UI3DManager();

export function init3DUI(game) {
  ui3d.init(game);
  return ui3d;
}
