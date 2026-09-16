/**
 * 3D Scene Transitions for Ganesha: The 21 Modaks
 * CSS3 3D Cube-Rotate and Perspective Card-Flip transitions between scenes,
 * tinted with the brand gradient from theme.js.
 */
import { BRAND_COLORS } from './theme.js';

export class Transitions3D {
  constructor(gameContainer) {
    this.container = gameContainer || document.getElementById('game-container');
    this.isTransitioning = false;
  }

  /**
   * Performs a 3D Cube-Rotate transition effect
   * @param {Function} onMidpoint Callback invoked when screen is at 90deg turn to switch Phaser scene
   * @param {String} direction 'left' | 'right' | 'up' | 'down'
   */
  cubeRotate(onMidpoint, direction = 'left') {
    if (this.isTransitioning || !this.container) {
      if (onMidpoint) onMidpoint();
      return;
    }

    this.isTransitioning = true;
    const parent = this.container.parentElement;
    parent.style.perspective = '1400px';

    const duration = 500; // ms total
    const halfDuration = duration / 2;

    this.container.style.transition = `transform ${halfDuration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${halfDuration}ms ease-in`;
    this.container.style.transformOrigin = 'center center -300px';

    let rotOut = 'rotateY(-75deg) translateZ(-150px) scale(0.92)';
    let rotInStart = 'rotateY(75deg) translateZ(-150px) scale(0.92)';

    if (direction === 'right') {
      rotOut = 'rotateY(75deg) translateZ(-150px) scale(0.92)';
      rotInStart = 'rotateY(-75deg) translateZ(-150px) scale(0.92)';
    }

    // Step 1: Rotate out
    this.container.style.transform = rotOut;
    this.container.style.opacity = '0.4';

    setTimeout(() => {
      // Step 2: Midpoint - switch Phaser scene
      if (onMidpoint) onMidpoint();

      // Instantly position for rotate-in
      this.container.style.transition = 'none';
      this.container.style.transform = rotInStart;

      void this.container.offsetWidth; // Force reflow

      // Step 3: Rotate into view
      this.container.style.transition = `transform ${halfDuration}ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity ${halfDuration}ms ease-out`;
      this.container.style.transform = 'rotateY(0deg) translateZ(0px) scale(1)';
      this.container.style.opacity = '1';

      setTimeout(() => {
        this.container.style.transition = '';
        this.container.style.transform = '';
        this.container.style.transformOrigin = '';
        this.isTransitioning = false;
      }, halfDuration);
    }, halfDuration);
  }

  /**
   * Performs a 3D Perspective Card-Flip transition
   */
  cardFlip(onMidpoint) {
    if (this.isTransitioning || !this.container) {
      if (onMidpoint) onMidpoint();
      return;
    }

    this.isTransitioning = true;
    const duration = 450;
    const half = duration / 2;

    this.container.style.transition = `transform ${half}ms ease-in, opacity ${half}ms ease-in`;
    this.container.style.transform = 'perspective(1200px) rotateX(85deg) translateZ(-100px) scale(0.9)';
    this.container.style.opacity = '0.3';

    setTimeout(() => {
      if (onMidpoint) onMidpoint();

      this.container.style.transition = 'none';
      this.container.style.transform = 'perspective(1200px) rotateX(-85deg) translateZ(-100px) scale(0.9)';

      void this.container.offsetWidth;

      this.container.style.transition = `transform ${half}ms cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity ${half}ms ease-out`;
      this.container.style.transform = 'perspective(1200px) rotateX(0deg) translateZ(0px) scale(1)';
      this.container.style.opacity = '1';

      setTimeout(() => {
        this.container.style.transition = '';
        this.container.style.transform = '';
        this.isTransitioning = false;
      }, half);
    }, half);
  }
}
