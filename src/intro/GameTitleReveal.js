/**
 * SCENE 6: Game Title Reveal
 * 11-12s: Fade in from darkness with golden glowing letters & particle shimmer
 * Title: GANESHA - THE 21 MODAKS
 */
export function GameTitleReveal({ timelineSec }) {
  const showTitle = timelineSec >= 10.8;
  if (!showTitle) return null;

  return React.createElement(
    'div',
    {
      className:
        'absolute top-12 md:top-16 w-full text-center z-20 transition-all duration-700 opacity-100 translate-y-0 scale-100'
    },
    // Primary Title
    React.createElement(
      'h1',
      {
        className:
          'font-serif text-3xl md:text-5xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 drop-shadow-[0_4px_18px_rgba(242,179,61,0.7)]'
      },
      'GANESHA'
    ),
    // Subtitle
    React.createElement(
      'p',
      {
        className:
          'text-xs md:text-sm tracking-[0.35em] text-neutral-300 font-bold uppercase mt-1 drop-shadow-md'
      },
      'THE 21 MODAKS'
    )
  );
}
