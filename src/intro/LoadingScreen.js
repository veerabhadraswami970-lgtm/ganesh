/**
 * SCENE 7: Loading Screen & 21 Modak Loader
 * 12s+: Interactive loading screen with progress bar (0% -> 100%),
 * 21 individual modak indicators lighting up, "21 Modaks • One Divine Adventure",
 * and the animated "ENTER THE ADVENTURE →" button.
 */
export function LoadingScreen({ loadProgress, isLoadReady, onEnterAdventure }) {
  return React.createElement(
    'div',
    {
      className:
        'absolute bottom-8 md:bottom-12 w-full flex flex-col items-center justify-center z-30 px-4 transition-all duration-700 animate-fadeIn'
    },
    // Status Text
    React.createElement(
      'p',
      {
        className:
          'text-xs md:text-sm font-semibold tracking-widest text-amber-300 uppercase mb-2 drop-shadow-sm'
      },
      isLoadReady ? '✨ THE ADVENTURE AWAITS ✨' : 'Preparing Your Modak Adventure...'
    ),

    // Glowing Progress Bar (0% -> 100%)
    React.createElement(
      'div',
      {
        className:
          'w-full max-w-sm h-3 bg-black/80 rounded-full p-0.5 border border-amber-500/40 overflow-hidden shadow-inner'
      },
      React.createElement('div', {
        style: { width: `${Math.round(loadProgress * 100)}%` },
        className:
          'h-full bg-gradient-to-r from-indigo-500 via-purple-500 via-amber-400 to-rose-500 rounded-full transition-all duration-150 ease-out shadow-[0_0_15px_rgba(242,179,61,0.9)]'
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

    // Divine Adventure Tagline
    React.createElement(
      'p',
      { className: 'text-[11px] md:text-xs text-neutral-400 tracking-wider font-medium' },
      '21 Modaks • One Divine Adventure'
    ),

    // ENTER THE ADVENTURE Button (smoothly revealed at 100%)
    isLoadReady &&
      React.createElement(
        'button',
        {
          onClick: onEnterAdventure,
          className:
            'mt-4 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-pink-600 text-white font-extrabold text-sm md:text-base tracking-widest uppercase border-2 border-yellow-300 shadow-[0_0_25px_rgba(242,179,61,0.7)] hover:shadow-[0_0_35px_rgba(232,84,122,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse cursor-pointer pointer-events-auto'
        },
        React.createElement(
          'span',
          { className: 'flex items-center gap-2' },
          'ENTER THE ADVENTURE',
          React.createElement('span', null, '→')
        )
      )
  );
}
