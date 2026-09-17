/**
 * SCENE 1 & 2: Dark Cinematic Temple Intro & Mushika Arrival
 * 0-2s: Dark Screen -> Ancient temple reveal, dust particles, low lighting, pillars
 * 2-4s: Stylized Mushika mouse running across stone floor toward center with footsteps
 */
export function MouseRunScene({ timelineSec }) {
  const showTemple = timelineSec >= 0.4;
  const showMouse = timelineSec >= 1.8 && timelineSec < 5.5;

  // Mouse trajectory: enters from left (-120px) to center (50%)
  const mouseProgress = Math.min(1, Math.max(0, (timelineSec - 2.0) / 1.8));
  const mouseX = -120 + mouseProgress * (window.innerWidth / 2 + 120);

  return React.createElement(
    'div',
    { className: 'absolute inset-0 pointer-events-none' },

    // SCENE 1: Ambient Temple Background
    React.createElement('div', {
      className: `absolute inset-0 transition-opacity duration-1000 ${
        showTemple ? 'opacity-100' : 'opacity-0'
      }`,
      style: {
        background: 'radial-gradient(ellipse at 50% 85%, #2a0845 0%, #110224 50%, #000000 90%)'
      }
    }),

    // Temple Pillars & Low Angle Stone Floor Grid
    React.createElement(
      'div',
      {
        className: `absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          showTemple ? 'opacity-40' : 'opacity-0'
        }`
      },
      // Left Pillar Silhouette
      React.createElement('div', {
        className: 'absolute left-8 bottom-0 w-24 h-5/6 bg-gradient-to-t from-[#3b1261] to-transparent border-r border-amber-500/20'
      }),
      // Right Pillar Silhouette
      React.createElement('div', {
        className: 'absolute right-8 bottom-0 w-24 h-5/6 bg-gradient-to-t from-[#3b1261] to-transparent border-l border-amber-500/20'
      }),
      // Temple Floor Stone Tiles
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

    // SCENE 2: Mushika Mouse Running
    showMouse &&
      React.createElement(
        'div',
        {
          style: {
            left: `${mouseX}px`,
            bottom: '75px',
            transform: `scale(${mouseProgress < 0.95 ? '1' : '1.15'})`
          },
          className: 'absolute z-30 flex items-center transition-transform duration-100'
        },
        // Ground Shadow
        React.createElement('div', {
          className: 'absolute -bottom-2 -left-3 w-16 h-4 rounded-full bg-black/70 blur-sm'
        }),
        // Stylized Mushika Mascot
        React.createElement('img', {
          src: './src/assets/branding/ganesha-idol.jpg',
          alt: 'Mushika',
          className: `w-14 h-14 object-cover rounded-full ${
            mouseProgress < 0.95
              ? 'animate-bounce drop-shadow-[0_0_12px_rgba(242,179,61,0.8)]'
              : 'drop-shadow-[0_0_20px_rgba(0,229,255,1)]'
          }`
        })
      )
  );
}
