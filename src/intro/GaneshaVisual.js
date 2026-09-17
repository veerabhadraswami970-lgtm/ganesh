/**
 * GaneshaVisual Component: Stylized sacred Ganesha Idol image with glowing divine halo.
 */
export function GaneshaVisual() {
  return React.createElement(
    'div',
    { className: 'relative flex items-center justify-center my-4' },
    // Soft glowing ambient halo
    React.createElement('div', {
      className: 'absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-amber-500/30 via-orange-500/25 to-pink-500/30 blur-2xl animate-pulse pointer-events-none'
    }),
    // Glowing border ring container
    React.createElement(
      'div',
      {
        className: 'relative p-1 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-500 shadow-[0_0_35px_rgba(242,179,61,0.6)] animate-idol-float transition-transform duration-500 hover:scale-105'
      },
      React.createElement('img', {
        src: './src/assets/branding/ganesha-idol.jpg',
        alt: 'Lord Ganesha Idol',
        className: 'relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-xl object-cover drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]'
      })
    )
  );
}
