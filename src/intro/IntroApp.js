/**
 * IntroApp Component: Orchestrates the Opening Experience state machine:
 * INTRO (Video) -> TRANSITION (Fade to Black) -> LOADING (21 Modak Loader) -> GAME (Phaser 3 Game)
 */
import { IntroVideo } from './IntroVideo.js';
import { GameLoader } from './GameLoader.js';

export function IntroApp() {
  const [stage, setStage] = React.useState('intro'); // 'intro' | 'transition' | 'loading' | 'game'
  const [fadeOpacity, setFadeOpacity] = React.useState(0);

  const handleVideoEnded = React.useCallback(() => {
    // 1. Trigger smooth fade to black (600-1000ms)
    setStage('transition');
    setFadeOpacity(1);

    setTimeout(() => {
      // 2. Switch to 21 Modak Game Loader
      setStage('loading');
      setFadeOpacity(0);
    }, 750);
  }, []);

  const handleEnterAdventure = React.useCallback(() => {
    // 3. Smooth fade & scale into main game screen
    setFadeOpacity(1);
    setTimeout(() => {
      setStage('game');
      setFadeOpacity(0);
      
      // Notify Phaser & 3D UI that intro is complete
      const gameContainer = document.getElementById('game-perspective-wrapper');
      if (gameContainer) {
        gameContainer.style.opacity = '1';
        gameContainer.style.pointerEvents = 'auto';
      }
    }, 500);
  }, []);

  return React.createElement(
    'div',
    { className: 'fixed inset-0 w-full h-full bg-black overflow-hidden z-50' },
    
    // Stage 1: Intro Video
    stage === 'intro' && React.createElement(IntroVideo, { onVideoEnded: handleVideoEnded }),

    // Stage 2: 21 Modak Game Loader
    stage === 'loading' && React.createElement(GameLoader, { onEnterAdventure: handleEnterAdventure }),

    // Black transition overlay
    React.createElement('div', {
      style: { opacity: fadeOpacity },
      className: 'fixed inset-0 bg-black pointer-events-none transition-opacity duration-700 ease-in-out z-[100]'
    })
  );
}
