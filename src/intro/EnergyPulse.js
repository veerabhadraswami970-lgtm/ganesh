/**
 * SCENE 5: Energy Pulse
 * 10-11s: Powerful shockwave energy pulse, expanding circular light wave, sparkling aura
 */
export function EnergyPulse({ timelineSec }) {
  const showPulse = timelineSec >= 9.8 && timelineSec < 11.5;
  if (!showPulse) return null;

  return React.createElement(
    'div',
    { className: 'absolute inset-0 pointer-events-none flex items-center justify-center' },

    // Primary Golden Shockwave
    React.createElement('div', {
      className: 'absolute w-[500px] h-[500px] rounded-full border-4 border-amber-300 shadow-[0_0_60px_#f2b33d] animate-ping',
      style: { animationDuration: '1.2s' }
    }),

    // Secondary Cyan/Violet Shockwave
    React.createElement('div', {
      className: 'absolute w-[650px] h-[650px] rounded-full border-2 border-cyan-400 shadow-[0_0_50px_#00e5ff] animate-ping',
      style: { animationDuration: '1.6s', animationDelay: '0.2s' }
    }),

    // Divine Aura Glow Flash
    React.createElement('div', {
      className: 'absolute inset-0 bg-radial from-amber-400/20 via-purple-600/10 to-transparent animate-pulse pointer-events-none'
    })
  );
}
