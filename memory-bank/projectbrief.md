# Ganesha: The 21 Modaks — Project Brief & Decisions

## Project Summary
- **Game Title**: Ganesha: The 21 Modaks
- **Genre**: Festival Adventure + Mini-Games + Puzzle
- **Platform**: Web / Desktop Browser + Mobile-friendly touch controls
- **Theme**: Ganesh Chaturthi
- **Core Character**: Mushika (Ganesha's mouse companion)
- **Objective**: Complete festival challenges and collect 21 Modaks to trigger the Grand Celebration

## Fixed Architecture Decisions
1. **Zero Bundler / Build Step**: Native browser ES modules (`<script type="module">`) with Phaser 3 loaded via CDN. `package.json` for local static server metadata only.
2. **Fixed Scoring**:
   - Modak collected: +100
   - Challenge completed: +500
   - Fast completion: +100 to +300
   - Perfect challenge: +250 bonus
   - Eco-friendly action: +100
   - Mistake: -50
   - Using a hint: -25
   - Final 21-Modak completion: +2,000
   - Rating bands: 0–2,999 Festival Starter | 3,000–5,999 Bappa Helper | 6,000–8,999 Wisdom Champion | 9,000+ Vighna Vinashi
3. **Touch-Control Bug Guard**: In `ModakRunScene` and `EcoScene`, tap-to-move pointer handlers must ignore any pointerdown where `pointer.y > H - 90` (canvas height 600) so HUD ability buttons don't trigger underlying player movements.
4. **Deployment**: Verification on live public URL is part of Definition of Done.

## 5 Mini-Games
1. **Modak Run**: 3-lane obstacle dodging + modak collection
2. **Wisdom Memory**: Simon-says temple bell sequence
3. **Pandal Builder**: Drag and drop festival decorations to matching outlines
4. **Eco Sort**: Basket catcher sorting eco offerings vs plastic waste
5. **Dhol Rhythm**: 4-track rhythm tap timing matching the beat
