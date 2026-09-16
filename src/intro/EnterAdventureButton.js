/**
 * EnterAdventureButton Component: Premium golden action button revealed when loading completes.
 */
export function EnterAdventureButton({ onEnter }) {
  return React.createElement(
    'button',
    {
      onClick: onEnter,
      className: 'relative group px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-pink-600 text-white font-extrabold text-sm md:text-base tracking-widest uppercase border-2 border-yellow-300 shadow-[0_0_25px_rgba(242,179,61,0.6)] hover:shadow-[0_0_35px_rgba(232,84,122,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse mt-3',
      'aria-label': 'Enter the 21 Modaks Adventure'
    },
    React.createElement('span', { className: 'relative z-10 flex items-center gap-2' },
      'ENTER THE ADVENTURE',
      React.createElement('span', { className: 'transition-transform duration-300 group-hover:translate-x-1.5' }, '➔')
    )
  );
}
