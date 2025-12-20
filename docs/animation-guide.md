# BlockVerse Animation Guide

This is a quick, friendly guide to the animations used in BlockVerse. Keep it light, smooth, and readable.

## What We Use
- Glitch text for headings (`src/components/GlitchText.jsx`)
- Neon buttons with hover/tap motion (`src/components/NeonButton.jsx`)
- Canvas background with grid/particles (`src/components/CyberBackground.jsx`)
- Shooting stars on the dashboard (`src/components/MeteorShower.jsx`)

## Style Tips
- Use neon cyan and gold accents.
- Prefer opacity and transform changes over layout shifts.
- Keep motion subtle by default; add “pop” on hover.

## Common Effects
- Glitch: light chromatic offset, brief jitter.
- Scanline overlay: thin lines moving vertically.
- Float: slow up/down for emphasis.
- Meteors: diagonal stars, occasional curves, no lingering trails.

## Performance Basics
- Canvas updates via `requestAnimationFrame`.
- Avoid heavy operations in tight loops.
- Reduce density on small screens.

## Where It Shows Up
- Login: glow and scanline
- Dashboard: animated counters, meteors
- Rounds: motion on buttons and cards

## Quick Customize
- Colors: tweak in `src/index.css`
- Speeds: adjust durations/intervals in each component
- Density: reduce counts for mobile

## Notes
- Keep animations consistent across pages.
- Aim for smooth 60fps with minimal distraction.
