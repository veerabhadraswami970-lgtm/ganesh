/**
 * Theme & Color Palette for Ganesha: The 21 Modaks
 * Single source of truth for the continuous-line gradient branding:
 * Indigo (#3b2fd4) -> Violet/Magenta (#a63bd6) -> Amber/Gold (#f2b33d) -> Coral/Rose (#e8547a) + Cyan (#00e5ff)
 */

export const BRAND_COLORS = {
  indigo: '#3b2fd4',
  violet: '#a63bd6',
  amber: '#f2b33d',
  coral: '#e8547a',
  cyan: '#00e5ff',
  black: '#000000',
  darkBg: '#08040f',
  cardBg: '#12081f',
  goldGlow: 'rgba(242, 179, 61, 0.4)',
  violetGlow: 'rgba(166, 59, 214, 0.4)',
  coralGlow: 'rgba(232, 84, 122, 0.4)'
};

export const BRAND_STOPS = [
  { pos: 0.0, color: BRAND_COLORS.indigo },
  { pos: 0.25, color: BRAND_COLORS.cyan },
  { pos: 0.5, color: BRAND_COLORS.violet },
  { pos: 0.75, color: BRAND_COLORS.amber },
  { pos: 1.0, color: BRAND_COLORS.coral }
];

export const FOUR_ACCENT_DOTS = [
  { name: 'coral', color: BRAND_COLORS.coral },
  { name: 'gold', color: BRAND_COLORS.amber },
  { name: 'cyan', color: BRAND_COLORS.cyan },
  { name: 'magenta', color: BRAND_COLORS.violet }
];

/**
 * Helper to interpolate brand gradient at ratio t (0.0 to 1.0)
 * Returns a hex string or THREE.Color compatible string
 */
export function getGradient(t) {
  const clamped = Math.max(0, Math.min(1, t));
  for (let i = 0; i < BRAND_STOPS.length - 1; i++) {
    const s1 = BRAND_STOPS[i];
    const s2 = BRAND_STOPS[i + 1];
    if (clamped >= s1.pos && clamped <= s2.pos) {
      const localT = (clamped - s1.pos) / (s2.pos - s1.pos);
      return interpolateHex(s1.color, s2.color, localT);
    }
  }
  return BRAND_STOPS[BRAND_STOPS.length - 1].color;
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function interpolateHex(hex1, hex2, factor) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  const r = Math.round(c1.r + factor * (c2.r - c1.r));
  const g = Math.round(c1.g + factor * (c2.g - c1.g));
  const b = Math.round(c1.b + factor * (c2.b - c1.b));
  return rgbToHex(r, g, b);
}

/**
 * Injects CSS variables onto :root to guarantee style.css and JS stay in sync
 */
export function injectThemeCSSVariables() {
  const root = document.documentElement;
  root.style.setProperty('--brand-indigo', BRAND_COLORS.indigo);
  root.style.setProperty('--brand-violet', BRAND_COLORS.violet);
  root.style.setProperty('--brand-amber', BRAND_COLORS.amber);
  root.style.setProperty('--brand-coral', BRAND_COLORS.coral);
  root.style.setProperty('--brand-cyan', BRAND_COLORS.cyan);
  root.style.setProperty('--brand-black', BRAND_COLORS.black);
  root.style.setProperty('--brand-dark-bg', BRAND_COLORS.darkBg);
  root.style.setProperty('--brand-card-bg', BRAND_COLORS.cardBg);
  root.style.setProperty('--brand-gradient', `linear-gradient(135deg, ${BRAND_COLORS.indigo} 0%, ${BRAND_COLORS.violet} 35%, ${BRAND_COLORS.amber} 70%, ${BRAND_COLORS.coral} 100%)`);
  root.style.setProperty('--brand-gradient-h', `linear-gradient(90deg, ${BRAND_COLORS.indigo}, ${BRAND_COLORS.cyan}, ${BRAND_COLORS.violet}, ${BRAND_COLORS.amber}, ${BRAND_COLORS.coral})`);
}
