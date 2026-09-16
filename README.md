# Ganesha: The 21 Modaks 🌸

A vibrant festival adventure browser game celebrating **Ganesh Chaturthi**. Players guide **Mushika** (Ganesha's mouse companion) through 5 varied mini-game challenges to collect **21 sacred Modaks** and unlock the grand festival celebration!

---

## 🎮 Gameplay & Mini-Games

1. **Modak Run (Agility)**: 3-lane obstacle dodging and modak collection.
2. **Wisdom Memory (Memory)**: Simon-says sacred temple bell sequence.
3. **Pandal Builder (Puzzle)**: Drag-and-drop festive decoration placement into glowing target outlines.
4. **Eco Sort (Sorting)**: Catch organic offerings in the wicker basket while avoiding plastic waste.
5. **Dhol Rhythm (Rhythm)**: 4-track Nashik Dhol beat timing challenge.

### 🌟 Divine Abilities
- 💡 **Wisdom Hint (-25 pts)**: Reveals a hint for the current challenge.
- ✨ **Vighnaharta**: Temporarily clears/eases obstacles (8-10s cooldown).
- 🛡 **Ganesha's Blessing**: Passive divine grace that auto-saves your first mistake.

---

## 🎯 Scoring & Ratings

- **Modak Collected**: +100
- **Challenge Completed**: +500
- **Fast Completion**: +100 to +300
- **Perfect Challenge (No Mistakes)**: +250
- **Eco-friendly Action**: +100
- **Mistake**: -50
- **Hint Used**: -25
- **Final 21-Modak Completion**: +2,000

### Rating Bands
- `0–2,999`: **Festival Starter**
- `3,000–5,999`: **Bappa Helper**
- `6,000–8,999`: **Wisdom Champion**
- `9,000+`: **Vighna Vinashi**

---

## 🚀 Running Locally (Zero Build Step)

This game runs entirely on vanilla ES modules and Phaser 3 via CDN. No compilation or bundler is required.

To test locally with any static server:
```bash
# Using npx serve or python
npx -y serve . -p 8080
# or
python -m http.server 8080
```
Open `http://localhost:8080` in your browser.

---

## 🎨 3D Animated Visuals & Branding System

- **3D Animated Loader**: Full-screen Three.js WebGL experience with an emissive continuous-line Ganesha emblem, 140+ drifting brand particles, 4-stage accent dots linked to real asset loading, and Web Audio gesture activation.
- **Continuous-Line Brand Palette**: Indigo (`#3b2fd4`) $\rightarrow$ Cyan (`#00e5ff`) $\rightarrow$ Violet/Magenta (`#a63bd6`) $\rightarrow$ Amber/Gold (`#f2b33d`) $\rightarrow$ Coral/Rose (`#e8547a`) on pure black.
- **3D Ambient Background**: Three.js canvas featuring floating diyas with flickering point lights, petals, golden dust, and mouse/gyroscope parallax responsiveness.
- **3D Mini-Game Selector & Tilt Cards**: CSS3 3D perspective (`perspective: 1200px`, `preserve-3d`) card tilt effects and 3D button depths.
- **3D Scene Transitions**: Smooth 3D Cube-Rotate and Perspective Card-Flip transitions between scenes.

---

## 🛠 Tech Stack & Tools Disclosed

- **2D Game Engine**: Phaser 3 (CDN, native ES6 modules)
- **3D Visual & UI Layer**: Three.js r160 (CDN) + CSS3 3D Transforms
- **Audio Synthesizer**: Custom Web Audio API synthesizer (Nashik dhol thumps, tuned temple chimes, fireworks, victory fanfare)
- **Zero Build Step**: Native browser ES modules loaded directly via `index.html` (no bundler required)
- **AI Tooling Disclosure**: Google Antigravity IDE (Agentic scaffolding & pair programming)
