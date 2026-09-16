/**
 * Main game entry point and Phaser 3 configuration
 * Ganesha: The 21 Modaks
 */
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import StoryScene from './scenes/StoryScene.js';
import HUDScene from './scenes/HUDScene.js';
import ModakRunScene from './scenes/ModakRunScene.js';
import MemoryScene from './scenes/MemoryScene.js';
import PandalScene from './scenes/PandalScene.js';
import EcoScene from './scenes/EcoScene.js';
import RhythmScene from './scenes/RhythmScene.js';
import ResultScene from './scenes/ResultScene.js';
import CelebrationScene from './scenes/CelebrationScene.js';
import { init3DUI } from './ui3d/index.js';
import { initOpeningExperience } from './intro/index.js';

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-game',
  width: 900,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  backgroundColor: '#000000',
  scene: [
    BootScene,
    MenuScene,
    StoryScene,
    HUDScene,
    ModakRunScene,
    MemoryScene,
    PandalScene,
    EcoScene,
    RhythmScene,
    ResultScene,
    CelebrationScene
  ]
};

window.addEventListener('load', () => {
  // 1. Mount React Opening Experience (Intro Video -> Transition -> 21 Modaks Loader)
  initOpeningExperience();

  // 2. Initialize Phaser Game Engine
  const game = new Phaser.Game(config);
  window.game = game;

  // 3. Initialize 3D Background & UI Shell
  init3DUI(game);
});
