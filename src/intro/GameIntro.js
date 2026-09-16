/**
 * Complete Cinematic Opening & 21 Modak Game Loader Orchestrator
 * Component hierarchy:
 * <GameIntro>
 *   <MouseRunScene />
 *   <MagicActivation />
 *   <NeonGaneshaReveal />
 *   <EnergyPulse />
 *   <GameTitleReveal />
 *   <LoadingScreen />
 * </GameIntro>
 */
import { MouseRunScene } from './MouseRunScene.js';
import { MagicActivation } from './MagicActivation.js';
import { NeonGaneshaReveal } from './NeonGaneshaReveal.js';
import { EnergyPulse } from './EnergyPulse.js';
import { GameTitleReveal } from './GameTitleReveal.js';
import { LoadingScreen } from './LoadingScreen.js';
import { cinematicAudio } from './CinematicAudio.js';
import { soundManager } from '../audio/SoundManager.js';

export function GameIntro({ onStartGame }) {
  const [timelineSec, setTimelineSec] = React.useState(0);
  const [loadProgress, setLoadProgress] = React.useState(0);
  const [isLoadReady, setIsLoadReady] = React.useState(false);
  const [isAudioStarted, setIsAudioStarted] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);

  // Main 12+ second cinematic timeline clock
  React.useEffect(() => {
    const startTime = performance.now();
    let animFrame = null;

    const tick = (now) => {
      const elapsed = (now - startTime) / 1000;
      setTimelineSec(elapsed);

      // Scene 7 Loading Progress starts at 12.0s
      if (elapsed >= 12.0) {
        const loadElapsed = elapsed - 12.0;
        const progress = Math.min(1.0, loadElapsed / 2.8);
        setLoadProgress(progress);
        if (progress >= 1.0) {
          setIsLoadReady(true);
        }
      }

      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  // Audio cue timeline triggers
  React.useEffect(() => {
    if (timelineSec >= 0.2 && timelineSec < 0.4) {
      cinematicAudio.playTempleWind();
    }
    if (timelineSec >= 2.0 && timelineSec < 2.2) {
      cinematicAudio.playMouseSteps();
    }
    if (timelineSec >= 4.2 && timelineSec < 4.4) {
      cinematicAudio.playMagicActivation();
    }
    if (timelineSec >= 10.0 && timelineSec < 10.2) {
      cinematicAudio.playEnergyPulse();
    }
  }, [timelineSec]);

  const handleUserInteractAudio = () => {
    if (!isAudioStarted) {
      setIsAudioStarted(true);
      soundManager.init();
      cinematicAudio.playTempleWind();
    }
  };

  const handleEnterAdventure = () => {
    soundManager.playBellChime(1046.5);
    setIsExiting(true);
    setTimeout(() => {
      if (onStartGame) onStartGame();
    }, 700);
  };

  const isFlipped = timelineSec >= 10.0 && timelineSec < 10.8;
  const showLoader = timelineSec >= 12.0;

  return React.createElement(
    'div',
    {
      onClick: handleUserInteractAudio,
      className: `fixed inset-0 w-full h-full bg-black overflow-hidden select-none z-50 transition-opacity duration-700 ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`
    },

    // SCENE 1 & 2
    React.createElement(MouseRunScene, { timelineSec }),

    // SCENE 3
    React.createElement(MagicActivation, { timelineSec }),

    // SCENE 4
    React.createElement(NeonGaneshaReveal, { timelineSec, isFlipped }),

    // SCENE 5
    React.createElement(EnergyPulse, { timelineSec }),

    // SCENE 6
    React.createElement(GameTitleReveal, { timelineSec }),

    // SCENE 7
    showLoader &&
      React.createElement(LoadingScreen, {
        loadProgress,
        isLoadReady,
        onEnterAdventure: handleEnterAdventure
      })
  );
}
