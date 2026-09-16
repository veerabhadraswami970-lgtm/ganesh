/**
 * Cinematic Opening Sound FX Synthesizer using Web Audio API
 * Produces temple wind, bell chimes, mouse scurrying, magic beam ignition, energy pulse, and fanfare.
 */
import { soundManager } from '../audio/SoundManager.js';

export class CinematicAudio {
  constructor() {
    this.ambientGain = null;
  }

  playTempleWind() {
    soundManager.init();
    if (!soundManager.ctx || soundManager.muted) return;
    const ctx = soundManager.ctx;
    const now = ctx.currentTime;

    try {
      // Pink noise / filtered wind
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 1.8;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, now);
      filter.frequency.exponentialRampToValueAtTime(140, now + 3);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 3);
    } catch (e) {}
  }

  playMouseSteps() {
    soundManager.init();
    if (!soundManager.ctx || soundManager.muted) return;
    const ctx = soundManager.ctx;

    try {
      for (let i = 0; i < 12; i++) {
        const t = ctx.currentTime + i * 0.14;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400 + Math.random() * 100, t);
        osc.frequency.exponentialRampToValueAtTime(120, t + 0.04);

        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.05);
      }
    } catch (e) {}
  }

  playMagicActivation() {
    soundManager.init();
    if (!soundManager.ctx || soundManager.muted) return;
    const ctx = soundManager.ctx;
    const now = ctx.currentTime;

    try {
      const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      chords.forEach((freq, idx) => {
        const start = now + idx * 0.15;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, start + 0.8);

        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.9);
      });
    } catch (e) {}
  }

  playEnergyPulse() {
    soundManager.init();
    if (!soundManager.ctx || soundManager.muted) return;
    const ctx = soundManager.ctx;
    const now = ctx.currentTime;

    try {
      // Sub bass boom
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 1.2);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);

      // Shimmer overlay
      soundManager.playBellChime(1567.98);
    } catch (e) {}
  }
}

export const cinematicAudio = new CinematicAudio();
