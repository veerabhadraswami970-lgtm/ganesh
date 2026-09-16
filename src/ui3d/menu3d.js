/**
 * 3D UI & Card Tilt Component for Ganesha: The 21 Modaks
 * CSS3 3D transforms (perspective, preserve-3d, rotateX/Y, translateZ),
 * glowing gradient borders from theme.js, 3D button press depths, 
 * mini-game selector 3D cards, and 3D HUD badges.
 */
import { BRAND_COLORS, getGradient } from './theme.js';
import { CHALLENGES } from '../data/challenges.js';
import { gameState } from '../data/scoring.js';
import { soundManager } from '../audio/SoundManager.js';

export class Menu3D {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('game-container');
    this.game = options.game || null;
    this.activeCards = [];
  }

  /**
   * Binds interactive 3D perspective tilt to any container/card element
   */
  bindTiltEffect(cardEl, maxTilt = 15, maxScale = 1.05) {
    if (!cardEl) return;

    let isHovered = false;

    const onPointerMove = (e) => {
      const rect = cardEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      cardEl.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(12px) scale3d(${maxScale}, ${maxScale}, ${maxScale})`;
    };

    const onPointerEnter = () => {
      isHovered = true;
      cardEl.style.transition = 'transform 0.1s ease-out, box-shadow 0.2s ease-out';
      cardEl.classList.add('card-3d-active');
    };

    const onPointerLeave = () => {
      isHovered = false;
      cardEl.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease-out';
      cardEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)';
      cardEl.classList.remove('card-3d-active');
    };

    cardEl.addEventListener('mousemove', onPointerMove);
    cardEl.addEventListener('mouseenter', onPointerEnter);
    cardEl.addEventListener('mouseleave', onPointerLeave);

    // Touch tilt support for mobile
    cardEl.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = cardEl.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -maxTilt;
        const rotateY = ((x - centerX) / centerX) * maxTilt;
        cardEl.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(10px) scale3d(${maxScale}, ${maxScale}, ${maxScale})`;
      }
    }, { passive: true });

    cardEl.addEventListener('touchend', onPointerLeave);
  }

  /**
   * Opens a 3D Mini-Game Selector Modal overlay with 3D tilt cards
   */
  showMiniGameSelector(onSelectChallenge) {
    // Remove existing modal if any
    const existing = document.getElementById('modal-3d-selector');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'modal-3d-selector';
    modal.className = 'modal-3d-overlay';

    const cardsHtml = CHALLENGES.map((ch, idx) => {
      const gradient = getGradient(idx / (CHALLENGES.length - 1));
      return `
        <div class="challenge-card-3d" data-index="${idx}" data-scene="${ch.key}">
          <div class="card-3d-glow" style="background: radial-gradient(circle at center, ${gradient}44 0%, transparent 70%);"></div>
          <div class="card-3d-inner">
            <div class="card-3d-badge">CHALLENGE ${idx + 1}</div>
            <div class="card-3d-icon">${ch.icon}</div>
            <h3 class="card-3d-title">${ch.title}</h3>
            <p class="card-3d-subtitle">${ch.subtitle}</p>
            <div class="card-3d-modaks">🥟 ${ch.targetModaks} Modaks</div>
            <p class="card-3d-desc">${ch.description}</p>
            <button class="card-3d-play-btn" style="border-color: ${gradient};">
              <span>PLAY NOW ➔</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    modal.innerHTML = `
      <div class="modal-3d-content">
        <div class="modal-3d-header">
          <h2 class="modal-3d-title">SELECT FESTIVAL CHALLENGE</h2>
          <p class="modal-3d-sub">Gather all 21 Sacred Modaks for Lord Ganesha's Grand Aarti</p>
        </div>

        <div class="challenge-grid-3d" id="challenge-grid-3d">
          ${cardsHtml}
        </div>

        <button class="modal-3d-close-btn" id="modal-3d-close">
          <span>✕ RETURN TO MENU</span>
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    // Bind 3D tilt to each card
    const cardEls = modal.querySelectorAll('.challenge-card-3d');
    cardEls.forEach((cardEl) => {
      this.bindTiltEffect(cardEl, 14, 1.04);

      cardEl.addEventListener('click', () => {
        const sceneKey = cardEl.getAttribute('data-scene');
        const idx = parseInt(cardEl.getAttribute('data-index'), 10);
        soundManager.playBellChime(1046.5);
        modal.classList.add('fade-out');
        setTimeout(() => {
          modal.remove();
          if (onSelectChallenge) onSelectChallenge(sceneKey, idx);
        }, 300);
      });
    });

    const closeBtn = modal.querySelector('#modal-3d-close');
    closeBtn.addEventListener('click', () => {
      soundManager.playDholThump(120);
      modal.classList.add('fade-out');
      setTimeout(() => modal.remove(), 300);
    });
  }

  /**
   * Applies 3D Pop/Flip animation on HUD elements when score or modaks change
   */
  animateHUDValueChange(element) {
    if (!element) return;
    element.classList.remove('hud-badge-flip');
    void element.offsetWidth; // Trigger reflow
    element.classList.add('hud-badge-flip');
  }
}
