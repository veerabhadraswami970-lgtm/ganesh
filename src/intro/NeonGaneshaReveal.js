/**
 * SCENE 4: Neon Ganesha Line-Art Reveal
 * 6-10s: Continuous SVG stroke drawing of Lord Ganesha
 * Sequence: Crown -> Forehead/Tilak -> Ears & Trunk -> Tusk & Ornaments -> Joyful Accent Dots
 */
export function NeonGaneshaReveal({ timelineSec, isFlipped }) {
  const showGanesha = timelineSec >= 5.5;
  if (!showGanesha) return null;

  // Ganesha Neon Line drawing progress: 5.5s to 9.8s -> 0.0 to 1.0
  const ganeshaDrawPct = Math.min(1, Math.max(0, (timelineSec - 5.5) / 4.0));
  const strokeDashOffset = 1500 * (1 - ganeshaDrawPct);

  return React.createElement(
    'div',
    {
      className: 'absolute inset-0 flex flex-col items-center justify-center pointer-events-none'
    },
    React.createElement(
      'svg',
      {
        viewBox: '0 0 512 512',
        className: 'w-72 h-72 md:w-84 md:h-84 drop-shadow-[0_0_35px_rgba(242,179,61,0.75)]',
        style: {
          transform: isFlipped ? 'perspective(800px) rotateY(180deg)' : 'perspective(800px) rotateY(0deg)',
          transition: 'transform 0.8s cubic-bezier(0.18, 0.89, 0.32, 1.28)'
        }
      },
      // Gradient & Glow Filter
      React.createElement(
        'defs',
        null,
        React.createElement(
          'linearGradient',
          { id: 'neonGaneshaGrad', x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
          React.createElement('stop', { offset: '0%', stopColor: '#3b2fd4' }),
          React.createElement('stop', { offset: '25%', stopColor: '#00e5ff' }),
          React.createElement('stop', { offset: '50%', stopColor: '#a63bd6' }),
          React.createElement('stop', { offset: '75%', stopColor: '#f2b33d' }),
          React.createElement('stop', { offset: '100%', stopColor: '#e8547a' })
        ),
        React.createElement(
          'filter',
          { id: 'neonGlow', x: '-25%', y: '-25%', width: '150%', height: '150%' },
          React.createElement('feGaussianBlur', { stdDeviation: '7', result: 'blur' }),
          React.createElement('feMerge', null,
            React.createElement('feMergeNode', { in: 'blur' }),
            React.createElement('feMergeNode', { in: 'SourceGraphic' })
          )
        )
      ),

      // Animated Stroke Group
      React.createElement(
        'g',
        {
          filter: 'url(#neonGlow)',
          strokeDasharray: '1500',
          strokeDashoffset: `${strokeDashOffset}`,
          style: { transition: 'stroke-dashoffset 0.1s linear' }
        },
        // Crown / Mukut
        React.createElement('path', {
          d: 'M 256 60 Q 280 110 256 160 Q 232 110 256 60 Z',
          fill: 'none',
          stroke: 'url(#neonGaneshaGrad)',
          strokeWidth: '10',
          strokeLinecap: 'round'
        }),
        React.createElement('path', {
          d: 'M 220 140 Q 256 120 292 140',
          fill: 'none',
          stroke: 'url(#neonGaneshaGrad)',
          strokeWidth: '9',
          strokeLinecap: 'round'
        }),
        // Ears, Face & Sweeping Trunk
        React.createElement('path', {
          d: 'M 220 160 C 130 150 90 240 150 310 C 190 350 240 300 246 220 C 250 170 262 170 266 220 C 272 300 240 370 270 410 C 295 440 350 430 360 380 C 370 330 320 320 310 350',
          fill: 'none',
          stroke: 'url(#neonGaneshaGrad)',
          strokeWidth: '12',
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        }),
        React.createElement('path', {
          d: 'M 292 160 C 382 150 422 240 362 310',
          fill: 'none',
          stroke: 'url(#neonGaneshaGrad)',
          strokeWidth: '12',
          strokeLinecap: 'round'
        }),
        // Eye & Sacred Tilak
        React.createElement('ellipse', {
          cx: '230',
          cy: '200',
          rx: '6',
          ry: '10',
          fill: '#f2b33d',
          transform: 'rotate(-15 230 200)'
        }),
        React.createElement('path', {
          d: 'M 256 165 L 256 195',
          fill: 'none',
          stroke: '#e8547a',
          strokeWidth: '6',
          strokeLinecap: 'round'
        }),
        React.createElement('circle', { cx: '256', cy: '155', r: '4', fill: '#f2b33d' }),
        // Sacred Left Tusk
        React.createElement('path', {
          d: 'M 225 285 Q 200 290 190 280',
          fill: 'none',
          stroke: '#ffffff',
          strokeWidth: '8',
          strokeLinecap: 'round'
        })
      ),

      // 4 Accent Divine Dots
      ganeshaDrawPct >= 0.9 &&
        React.createElement(
          'g',
          { transform: 'translate(0, 460)', className: 'animate-bounce' },
          React.createElement('circle', { cx: '196', cy: '0', r: '10', fill: '#e8547a' }),
          React.createElement('circle', { cx: '236', cy: '0', r: '10', fill: '#f2b33d' }),
          React.createElement('circle', { cx: '276', cy: '0', r: '10', fill: '#00e5ff' }),
          React.createElement('circle', { cx: '316', cy: '0', r: '10', fill: '#a63bd6' })
        )
    )
  );
}
