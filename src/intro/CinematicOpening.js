/**
 * Cinematic Opening Animation & 21 Modak Game Loader for GANESHA: THE 21 MODAKS
 * 
 * SEQUENCE TIMELINE:
 * 0-2s:  Scene 1 - Dark Cinematic Temple Atmosphere (Dust particles, stone floor, ambient wind & bell)
 * 2-4s:  Scene 2 - Mushika The Mouse Arrives (Fast scurrying footsteps, tail bob, low tracking camera)
 * 4-6s:  Scene 3 - Magic Activation (Golden spark, electric blue, purple, pink, orange neon energy trails)
 * 6-10s: Scene 4 - Neon Ganesha Reveal (Continuous neon line-art drawing crown, ears, trunk, tilak & dots)
 * 10-11s: Scene 5 - Energy Pulse & 3D Flip (Shockwave pulse, 3D perspective spin, settling forward)
 * 11-12s: Scene 6 - Game Title Reveal (GANESHA: THE 21 MODAKS with golden particle shimmer)
 * 12s+:  Scene 7 - Interactive 21 Modak Loader (Progress bar 0->100%, 21 Modak lights, "ENTER THE ADVENTURE" button)
 */
import { cinematicAudio } from './CinematicAudio.js';
import { soundManager } from '../audio/SoundManager.js';

export function CinematicOpening({ onStartGame }) {
  const [timelineSec, setTimelineSec] = React.useState(0);
  const [loadProgress, setLoadProgress] = React.useState(0);
  const [isLoadReady, setIsLoadReady] = React.useState(false);
  const [isAudioStarted, setIsAudioStarted] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);

  // Main Animation Sequence Timer
  React.useEffect(() => {
    const startTime = performance.now();
    let animFrame = null;

    const tick = (now) => {
      const elapsed = (now - startTime) / 1000;
      setTimelineSec(elapsed);

      // Loading stage progress (from second 12.0 onward, lasts ~3 seconds)
      if (elapsed >= 12.0) {
        const loadElapsed = elapsed - 12.0;
        const p = Math.min(1.0, loadElapsed / 2.8);
        setLoadProgress(p);
        if (p >= 1.0) {
          setIsLoadReady(true);
        }
      }

      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  // Audio trigger points during cinematic timeline
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

  // Scene timing helpers
  const showTemple = timelineSec >= 0.5;
  const showMouse = timelineSec >= 1.8 && timelineSec < 5.5;
  const showMagicTrails = timelineSec >= 4.0;
  const showGaneshaDraw = timelineSec >= 5.5;
  const showPulse = timelineSec >= 9.8 && timelineSec < 11.2;
  const showTitle = timelineSec >= 10.8;
  const showLoader = timelineSec >= 12.0;

  // Mouse position calculation (Scene 2: moves from -100px to center 50%)
  const mouseProgress = Math.min(1, Math.max(0, (timelineSec - 2.0) / 1.8));
  const mouseX = -120 + mouseProgress * (window.innerWidth / 2 + 120);

  // Ganesha Neon Line drawing progress (Scene 4: 5.5s to 9.8s -> 0.0 to 1.0)
  const ganeshaDrawPct = Math.min(1, Math.max(0, (timelineSec - 5.5) / 4.0));
  const strokeDashOffset = 1500 * (1 - ganeshaDrawPct);

  return React.createElement(
    'div',
    {
      onClick: handleUserInteractAudio,
      className: `fixed inset-0 w-full h-full bg-black overflow-hidden select-none z-50 transition-opacity duration-700 ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`
    },

    // =========================================================================
    // SCENE 1: Ancient Indian Temple Environment & Low-angle Stone Floor
    // =========================================================================
    React.createElement('div', {
      className: `absolute inset-0 transition-opacity duration-1000 ${
        showTemple ? 'opacity-100' : 'opacity-0'
      }`,
      style: {
        background: 'radial-gradient(ellipse at 50% 85%, #2a0845 0%, #110224 50%, #000000 90%)'
      }
    }),

    // Distant Temple Pillars & Archway silhouettes
    React.createElement(
      'div',
      {
        className: `absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          showTemple ? 'opacity-40' : 'opacity-0'
        }`
      },
      // Left Pillar
      React.createElement('div', {
        className: 'absolute left-8 bottom-0 w-24 h-5/6 bg-gradient-to-t from-[#3b1261] to-transparent border-r border-amber-500/20'
      }),
      // Right Pillar
      React.createElement('div', {
        className: 'absolute right-8 bottom-0 w-24 h-5/6 bg-gradient-to-t from-[#3b1261] to-transparent border-l border-amber-500/20'
      }),
      // Floor Stone Tiles Perspective Grid
      React.createElement('div', {
        className: 'absolute bottom-0 w-full h-48 bg-gradient-to-t from-amber-500/10 via-purple-900/10 to-transparent border-t border-amber-500/20 shadow-[0_-20px_50px_rgba(242,179,61,0.15)]'
      })
    ),

    // Floating Golden Dust Particles
    React.createElement(
      'div',
      { className: 'absolute inset-0 pointer-events-none overflow-hidden' },
      Array.from({ length: 24 }).map((_, i) => {
        const delay = (i * 0.3) % 4;
        const left = `${(i * 17) % 100}%`;
        const top = `${(i * 23) % 90}%`;
        return React.createElement('div', {
          key: i,
          style: { left, top, animationDelay: `${delay}s` },
          className: 'absolute w-1.5 h-1.5 rounded-full bg-amber-400 blur-[0.5px] animate-pulse opacity-60'
        });
      })
    ),

    // =========================================================================
    // SCENE 2: Mushika (The Mouse) Running Across Floor to Center
    // =========================================================================
    showMouse &&
      React.createElement(
        'div',
        {
          style: {
            left: `${mouseX}px`,
            bottom: '75px',
            transform: `scale(${mouseProgress < 0.95 ? '1' : '1.15'})`
          },
          className: 'absolute z-30 flex items-center transition-transform duration-100 pointer-events-none'
        },
        // Mouse Mascot Graphics + Motion Blur Shadow
        React.createElement('div', {
          className: 'absolute -bottom-2 -left-3 w-16 h-4 rounded-full bg-black/70 blur-sm'
        }),
        React.createElement('img', {
          src: './src/assets/branding/ganesha-logo.svg',
          alt: 'Mushika',
          className: `w-14 h-14 object-contain ${
            mouseProgress < 0.95 ? 'animate-bounce drop-shadow-[0_0_12px_rgba(242,179,61,0.8)]' : 'drop-shadow-[0_0_20px_rgba(0,229,255,1)]'
          }`
        })
      ),

    // =========================================================================
    // SCENE 3: Magic Activation (Swirling Neon Energy Beams)
    // =========================================================================
    showMagicTrails &&
      React.createElement(
        'div',
        { className: 'absolute inset-0 pointer-events-none flex items-center justify-center' },
        // Radiant Energy Rings
        React.createElement('div', {
          className: 'absolute w-64 h-64 rounded-full border border-cyan-400/40 animate-ping'
        }),
        React.createElement('div', {
          className: 'absolute w-80 h-80 rounded-full border border-purple-500/40 animate-pulse'
        }),
        React.createElement('div', {
          className: 'absolute w-96 h-96 rounded-full border border-pink-500/30 animate-spin',
          style: { animationDuration: '6s' }
        })
      ),

    // =========================================================================
    // SCENE 4 & 5: Neon Ganesha Line-Art Reveal + 3D Energy Pulse
    // =========================================================================
    showGaneshaDraw &&
      React.createElement(
        'div',
        {
          className: `absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-700 ${
            showPulse ? 'scale-110 rotate-1 drop-shadow-[0_0_40px_rgba(242,179,61,1)]' : 'scale-100'
          }`
        },
        // Neon SVG Canvas with Stroke Animation
        React.createElement(
          'svg',
          {
            viewBox: '0 0 512 512',
            className: 'w-72 h-72 md:w-84 md:h-84 drop-shadow-[0_0_30px_rgba(242,179,61,0.7)]',
            style: {
              transform: showPulse ? 'perspective(800px) rotateY(180deg)' : 'perspective(800px) rotateY(0deg)',
              transition: 'transform 0.8s cubic-bezier(0.18, 0.89, 0.32, 1.28)'
            }
          },
          // Gradient Definitions
          React.createElement(
            'defs',
            null,
            React.createElement(
              'linearGradient',
              { id: 'neonGaneshaGrad', x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
              React.createElement('stop', { offset: '0%', stopColor: '#3b2fd4' }),
              React.createElement('stop', { offset: '25%', stopColor: '#00e5ff' }),
              React.createElement('stop', { offset: '50%', stopColor: '#a63bd6' }),
              React.createElement('stop', { offset: '75%', stopColor: '#f2b33d' }),
              React.createElement('stop', { offset: '100%', stopColor: '#e8547a' })
            ),
            React.createElement(
              'filter',
              { id: 'neonGlow', x: '-20%', y: '-20%', width: '140%', height: '140%' },
              React.createElement('feGaussianBlur', { stdDeviation: '6', result: 'blur' }),
              React.createElement('feMerge', null,
                React.createElement('feMergeNode', { in: 'blur' }),
                React.createElement('feMergeNode', { in: 'SourceGraphic' })
              )
            )
          ),
          // Stroke group with animated stroke-dashoffset
          React.createElement(
            'g',
            {
              filter: 'url(#neonGlow)',
              strokeDasharray: '1500',
              strokeDashoffset: `${strokeDashOffset}`,
              style: { transition: 'stroke-dashoffset 0.1s linear' }
            },
            // Crown
            React.createElement('path', {
              d: 'M 256 60 Q 280 110 256 160 Q 232 110 256 60 Z',
              fill: 'none',
              stroke: 'url(#neonGaneshaGrad)',
              strokeWidth: '10',
              strokeLinecap: 'round'
            }),
            React.createElement('path', {
              d: 'M 220 140 Q 256 120 292 140',
              fill: 'none',
              stroke: 'url(#neonGaneshaGrad)',
              strokeWidth: '9',
              strokeLinecap: 'round'
            }),
            // Ears & Trunk
            React.createElement('path', {
              d: 'M 220 160 C 130 150 90 240 150 310 C 190 350 240 300 246 220 C 250 170 262 170 266 220 C 272 300 240 370 270 410 C 295 440 350 430 360 380 C 370 330 320 320 310 350',
              fill: 'none',
              stroke: 'url(#neonGaneshaGrad)',
              strokeWidth: '12',
              strokeLinecap: 'round',
              strokeLinejoin: 'round'
            }),
            React.createElement('path', {
              d: 'M 292 160 C 382 150 422 240 362 310',
              fill: 'none',
              stroke: 'url(#neonGaneshaGrad)',
              strokeWidth: '12',
              strokeLinecap: 'round'
            }),
            // Eye & Tilak
            React.createElement('ellipse', {
              cx: '230',
              cy: '200',
              rx: '6',
              ry: '10',
              fill: '#f2b33d',
              transform: 'rotate(-15 230 200)'
            }),
            React.createElement('path', {
              d: 'M 256 165 L 256 195',
              fill: 'none',
              stroke: '#e8547a',
              strokeWidth: '6',
              strokeLinecap: 'round'
            }),
            React.createElement('circle', { cx: '256', cy: '155', r: '4', fill: '#f2b33d' }),
            // Tusk
            React.createElement('path', {
              d: 'M 225 285 Q 200 290 190 280',
              fill: 'none',
              stroke: '#ffffff',
              strokeWidth: '8',
              strokeLinecap: 'round'
            })
          ),
          // 4 Accent Dots Beneath Logo
          ganeshaDrawPct >= 0.9 &&
            React.createElement(
              'g',
              { transform: 'translate(0, 460)', className: 'animate-bounce' },
              React.createElement('circle', { cx: '196', cy: '0', r: '10', fill: '#e8547a' }),
              React.createElement('circle', { cx: '236', cy: '0', r: '10', fill: '#f2b33d' }),
              React.createElement('circle', { cx: '276', cy: '0', r: '10', fill: '#00e5ff' }),
              React.createElement('circle', { cx: '316', cy: '0', r: '10', fill: '#a63bd6' })
            )
        )
      ),

    // =========================================================================
    // SCENE 6: Game Title Reveal
    // =========================================================================
    showTitle &&
      React.createElement(
        'div',
        {
          className: `absolute top-12 md:top-16 w-full text-center z-20 transition-all duration-700 ${
            showTitle ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'
          }`
        },
        React.createElement(
          'h1',
          {
            className: 'font-serif text-3xl md:text-5xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 drop-shadow-[0_4px_16px_rgba(242,179,61,0.6)]'
          },
          'GANESHA'
        ),
        React.createElement(
          'p',
          {
            className: 'text-xs md:text-sm tracking-[0.35em] text-neutral-300 font-bold uppercase mt-1 drop-shadow-md'
          },
          'THE 21 MODAKS'
        )
      ),

    // =========================================================================
    // SCENE 7: Interactive 21 Modak Loader Screen
    // =========================================================================
    showLoader &&
      React.createElement(
        'div',
        {
          className: 'absolute bottom-8 md:bottom-12 w-full flex flex-col items-center justify-center z-30 px-4 transition-all duration-700 animate-fadeIn'
        },
        // Preparing status
        React.createElement(
          'p',
          {
            className: 'text-xs md:text-sm font-semibold tracking-widest text-amber-300 uppercase mb-2 drop-shadow-sm'
          },
          isLoadReady ? '✨ THE ADVENTURE AWAITS ✨' : 'Preparing Your Modak Adventure...'
        ),

        // Glowing Progress Bar (0% -> 100%)
        React.createElement(
          'div',
          {
            className: 'w-full max-w-sm h-3 bg-black/80 rounded-full p-0.5 border border-amber-500/40 overflow-hidden shadow-inner'
          },
          React.createElement('div', {
            style: { width: `${Math.round(loadProgress * 100)}%` },
            className: 'h-full bg-gradient-to-r from-indigo-500 via-purple-500 via-amber-400 to-rose-500 rounded-full transition-all duration-150 ease-out shadow-[0_0_15px_rgba(242,179,61,0.9)]'
          })
        ),

        // 21 Small Modak Grid Indicators (3 rows of 7 = 21)
        React.createElement(
          'div',
          { className: 'grid grid-cols-7 gap-2 my-3' },
          Array.from({ length: 21 }).map((_, idx) => {
            const isIlluminated = idx < Math.floor(loadProgress * 21) || isLoadReady;
            return React.createElement(
              'div',
              {
                key: idx,
                className: `w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 ${
                  isIlluminated
                    ? 'bg-amber-500/20 border border-amber-400 shadow-[0_0_10px_rgba(242,179,61,0.8)] scale-110'
                    : 'bg-neutral-900/60 border border-neutral-800 opacity-40 scale-95'
                }`
              },
              React.createElement(
                'span',
                {
                  className: `text-xs transform transition-transform ${
                    isIlluminated ? 'scale-110' : 'grayscale opacity-40'
                  }`
                },
                '🥟'
              )
            );
          })
        ),

        // Subtitle
        React.createElement(
          'p',
          { className: 'text-[11px] md:text-xs text-neutral-400 tracking-wider font-medium' },
          '21 Modaks • One Divine Adventure'
        ),

        // Enter Adventure Button (revealed at 100%)
        isLoadReady &&
          React.createElement(
            'button',
            {
              onClick: handleEnterAdventure,
              className: 'mt-4 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-pink-600 text-white font-extrabold text-sm md:text-base tracking-widest uppercase border-2 border-yellow-300 shadow-[0_0_25px_rgba(242,179,61,0.7)] hover:shadow-[0_0_35px_rgba(232,84,122,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse cursor-pointer pointer-events-auto'
            },
            React.createElement(
              'span',
              { className: 'flex items-center gap-2' },
              'ENTER THE ADVENTURE',
              React.createElement('span', null, '➔')
            )
          )
      )
  );
}
