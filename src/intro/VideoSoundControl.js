/**
 * VideoSoundControl Component: Elegant floating control shown only if autoplay with audio is blocked by browser.
 */
export function VideoSoundControl({ onEnableSound }) {
  return React.createElement(
    'button',
    {
      onClick: onEnableSound,
      className: 'absolute bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/70 backdrop-blur-md border border-amber-400/40 text-amber-300 hover:text-white hover:bg-black/90 hover:border-amber-400 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-amber-500/20 text-xs font-semibold tracking-wider uppercase',
      'aria-label': 'Enable audio'
    },
    React.createElement('span', { className: 'text-base' }, '🔊'),
    React.createElement('span', null, 'Tap to Enable Sound')
  );
}
