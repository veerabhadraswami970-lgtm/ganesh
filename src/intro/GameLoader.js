/**
 * GameLoader Component: 21 Modaks Loader Screen displayed after video completes.
 */
import { GaneshaVisual } from './GaneshaVisual.js';
import { LoadingProgress } from './LoadingProgress.js';
import { EnterAdventureButton } from './EnterAdventureButton.js';

export function GameLoader({ onEnterAdventure, onBackToIntro }) {
  const [progress, setProgress] = React.useState(0);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    // 2.8s smooth loading progression
    const duration = 2800;
    const intervalTime = 30;
    const increment = intervalTime / duration;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 1.0) {
          clearInterval(interval);
          setIsReady(true);
          return 1.0;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return React.createElement(
    'div',
    {
      className: 'relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0c0214] via-[#1a0526] to-[#08020f] text-white overflow-hidden p-6 select-none animate-fadeIn'
    },
    // Top-Left Back to Video Button
    onBackToIntro &&
      React.createElement(
        'button',
        {
          onClick: onBackToIntro,
          className: 'absolute top-6 left-6 z-40 px-4 py-2 rounded-full bg-black/60 hover:bg-black/80 border border-amber-400/40 text-amber-300 font-semibold text-xs tracking-widest uppercase backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.8)]'
        },
        '⬅ Rewatch Video'
      ),
    // Ambient background lights
    React.createElement('div', {
      className: 'absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-600/10 blur-3xl pointer-events-none'
    }),
    React.createElement('div', {
      className: 'absolute bottom-10 w-80 h-80 rounded-full bg-purple-700/10 blur-3xl pointer-events-none'
    }),

    // Game Logo Header
    React.createElement(
      'div',
      { className: 'text-center mb-1 z-10' },
      React.createElement(
        'h1',
        {
          className: 'font-serif text-3xl md:text-4xl lg:text-5xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 drop-shadow-[0_4px_12px_rgba(242,179,61,0.4)]'
        },
        'GANESHA'
      ),
      React.createElement(
        'p',
        {
          className: 'text-xs md:text-sm tracking-[0.3em] text-neutral-300 font-semibold uppercase mt-0.5 opacity-90'
        },
        'THE 21 MODAKS'
      )
    ),

    // Center Stylized Ganesha Visual
    React.createElement(GaneshaVisual, null),

    // 21 Modak Loading Progress
    React.createElement(LoadingProgress, { progress, isComplete: isReady }),

    // Enter Adventure Button (Revealed on 100%)
    isReady && React.createElement(EnterAdventureButton, { onEnter: onEnterAdventure })
  );
}
