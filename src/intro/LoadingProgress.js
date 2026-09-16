/**
 * LoadingProgress Component: 21 Modak indicators + progressive progress bar.
 */
export function LoadingProgress({ progress, isComplete }) {
  const percent = Math.round(progress * 100);
  const totalModaks = 21;
  const illuminatedModaks = Math.floor(progress * totalModaks);

  return React.createElement(
    'div',
    { className: 'w-full max-w-md flex flex-col items-center gap-3 px-4' },
    
    // Status text
    React.createElement(
      'p',
      {
        className: 'text-xs md:text-sm font-semibold tracking-widest text-amber-300 uppercase transition-all duration-300'
      },
      isComplete ? '✨ THE ADVENTURE AWAITS ✨' : 'PREPARING THE MODAK ADVENTURE...'
    ),

    // Progress Bar Track
    React.createElement(
      'div',
      {
        className: 'w-full h-2.5 bg-black/60 rounded-full p-0.5 border border-amber-500/30 overflow-hidden shadow-inner'
      },
      React.createElement('div', {
        style: { width: `${percent}%` },
        className: 'h-full bg-gradient-to-r from-indigo-500 via-purple-500 via-amber-400 to-rose-500 rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(242,179,61,0.8)]'
      })
    ),

    // Percent label
    React.createElement(
      'span',
      { className: 'text-[11px] font-mono tracking-wider text-neutral-400' },
      `${percent}%`
    ),

    // 21 Modak Grid Indicators (3 rows of 7 modaks)
    React.createElement(
      'div',
      { className: 'grid grid-cols-7 gap-2 my-2' },
      Array.from({ length: 21 }).map((_, idx) => {
        const isIlluminated = idx < illuminatedModaks || isComplete;
        return React.createElement(
          'div',
          {
            key: idx,
            className: `w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 ${
              isIlluminated
                ? 'bg-amber-500/20 border border-amber-400 shadow-[0_0_8px_rgba(242,179,61,0.7)] scale-110'
                : 'bg-neutral-900/60 border border-neutral-800 opacity-40 scale-95'
            }`,
            title: `Modak ${idx + 1}`
          },
          React.createElement(
            'span',
            { className: `text-xs transform transition-transform ${isIlluminated ? 'scale-110' : 'grayscale opacity-50'}` },
            '🥟'
          )
        );
      })
    )
  );
}
