/**
 * Mounts the React Opening Experience
 */
import { IntroApp } from './IntroApp.js';

export function initOpeningExperience() {
  const rootEl = document.getElementById('intro-root');
  if (rootEl && typeof ReactDOM !== 'undefined') {
    if (ReactDOM.createRoot) {
      const root = ReactDOM.createRoot(rootEl);
      root.render(React.createElement(IntroApp));
    } else {
      ReactDOM.render(React.createElement(IntroApp), rootEl);
    }
  }
}
