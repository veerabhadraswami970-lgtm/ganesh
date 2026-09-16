/**
 * Mounts the React Opening Experience
 */
import { GameIntro } from './GameIntro.js';

export function initOpeningExperience() {
  const rootEl = document.getElementById('intro-root');
  if (!rootEl || typeof ReactDOM === 'undefined') return;

  const handleStartGame = () => {
    // Reveal Phaser game and 3D UI
    const gameWrapper = document.getElementById('game-perspective-wrapper');
    if (gameWrapper) {
      gameWrapper.style.opacity = '1';
      gameWrapper.style.pointerEvents = 'auto';
    }
    // Clean up intro root
    rootEl.style.display = 'none';
  };

  if (ReactDOM.createRoot) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(React.createElement(GameIntro, { onStartGame: handleStartGame }));
  } else {
    ReactDOM.render(React.createElement(GameIntro, { onStartGame: handleStartGame }), rootEl);
  }
}
