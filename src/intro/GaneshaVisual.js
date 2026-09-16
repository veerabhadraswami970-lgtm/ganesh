/**
 * GaneshaVisual Component: Stylized static/subtle glowing Ganesha logo.
 */
export function GaneshaVisual() {
  return React.createElement(
    'div',
    { className: 'relative flex items-center justify-center my-3' },
    // Soft glowing halo
    React.createElement('div', {
      className: 'absolute w-44 h-44 rounded-full bg-gradient-to-tr from-purple-700/30 via-amber-500/20 to-pink-500/30 blur-2xl animate-pulse pointer-events-none'
    }),
    // Center logo image
    React.createElement('img', {
      src: './src/assets/branding/ganesha-logo.svg',
      alt: 'Lord Ganesha',
      className: 'relative w-32 h-32 md:w-36 md:h-36 object-contain drop-shadow-[0_0_25px_rgba(242,179,61,0.5)] transition-transform duration-700 hover:scale-105'
    })
  );
}
