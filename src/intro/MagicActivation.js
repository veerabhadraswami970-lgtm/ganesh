/**
 * SCENE 3: Magic Activation
 * 4-6s: Golden particle activation and vibrant glowing neon energy lines
 * Colors: Electric blue (#00e5ff), Purple (#a63bd6), Pink (#e8547a), Orange (#f2853d), Golden Yellow (#f2b33d)
 */
export function MagicActivation({ timelineSec }) {
  const showMagicTrails = timelineSec >= 4.0;
  if (!showMagicTrails) return null;

  return React.createElement(
    'div',
    { className: 'absolute inset-0 pointer-events-none flex items-center justify-center' },

    // Central Divine Golden Spark
    React.createElement('div', {
      className: 'absolute w-6 h-6 rounded-full bg-amber-300 shadow-[0_0_30px_#f2b33d] animate-ping'
    }),

    // Electric Blue Neon Wave
    React.createElement('div', {
      className: 'absolute w-64 h-64 rounded-full border-2 border-cyan-400/60 shadow-[0_0_20px_#00e5ff] animate-ping',
      style: { animationDuration: '2s' }
    }),

    // Purple Divine Energy Ring
    React.createElement('div', {
      className: 'absolute w-80 h-80 rounded-full border border-purple-500/50 shadow-[0_0_25px_#a63bd6] animate-pulse',
      style: { animationDuration: '3s' }
    }),

    // Neon Pink Swirling Energy Ring
    React.createElement('div', {
      className: 'absolute w-96 h-96 rounded-full border-2 border-dashed border-pink-500/40 shadow-[0_0_30px_#e8547a] animate-spin',
      style: { animationDuration: '5s' }
    }),

    // Golden Yellow Orbital Lines
    React.createElement('div', {
      className: 'absolute w-[440px] h-[440px] rounded-full border border-amber-400/30 animate-spin',
      style: { animationDuration: '8s', animationDirection: 'reverse' }
    })
  );
}
