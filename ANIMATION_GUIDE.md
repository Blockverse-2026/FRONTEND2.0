# BlockVerse Animation Style Guide & System Documentation

## Overview
This document outlines the animation system for the BlockVerse application, detailing the design philosophy, implementation details, performance optimizations, and usage guidelines.

## 1. Design Philosophy
The BlockVerse aesthetic is **Cyberpunk / Glitch / Hacker**. Animations should feel:
- **Digital & Raw**: Use glitch effects, pixel displacement, and scanlines.
- **Responsive**: UI elements should react instantly to interaction.
- **Smooth yet Twitchy**: Base movements should be 60fps smooth, punctuated by sharp, calculated "glitch" interruptions.
- **Depth-aware**: Use parallax and layering to create a sense of deep cyberspace.

## 2. Core Animation Components

### 2.1 GlitchText
The `GlitchText` component is the primary typographic element.
- **Idle State**: Subtle chromatic aberration (Cyan/Gold offset) with low opacity (40%).
- **Hover State**:
  - Opacity increases to 100%.
  - Additional "Magenta" layer appears with a pulse effect.
  - Motion blur (blur-sm) applies during glitch spikes.
- **Implementation**: Uses Tailwind custom animations (`animate-glitch`) and CSS `clip-path`.
- **Optimization**: Uses `will-change-transform` to promote layers to their own compositor layers.

### 2.2 CyberBackground (Canvas)
A high-performance HTML5 Canvas background.
- **Parallax**: Grid and particles move based on mouse position with smooth easing (lerp 0.05).
- **Motion Blur**: Implemented via a semi-transparent trail effect (`rgba(5,5,5,0.4)` clear) instead of full frame clearing.
- **LOD (Level of Detail)**:
  - **Desktop**: 40px grid, 30 particles.
  - **Mobile (<768px)**: 60px grid, 10 particles.
- **Glitch Effects**: Randomly triggers horizontal shifts, color inversion, and noise strips.

### 2.3 NeonButton
Interactive buttons with holographic feel.
- **Hover**: Scale up (1.05x), scanline sweep, glow intensification.
- **Tap**: Scale down (0.95x).
- **Tech**: Framer Motion `whileHover` and `whileTap`.

## 3. Global Animations (Tailwind Config)

### Keyframes
- **`glitch`**: 2.5s loop.
  - Mixes smooth stillness with sudden 1-frame offsets and skews.
  - Includes `filter: blur(2px)` during high-velocity shifts for motion blur.
- **`scanline`**: 8s linear loop moving a gradient from top to bottom.
- **`float`**: 6s ease-in-out loop for hovering elements.

### Timing Functions
- **Pulse**: `cubic-bezier(0.4, 0, 0.6, 1)` for a heartbeat rhythm.
- **Transitions**: Generally `duration-300` for UI state changes.

## 4. Performance & Optimization Strategy

1.  **Canvas Optimization**:
    - Use `requestAnimationFrame` for the render loop.
    - Limit heavy operations (like `getImageData` for glitches) to random, infrequent intervals.
    - Pre-calculate constants (width/height).
2.  **CSS/Tailwind**:
    - Prefer `transform` and `opacity` changes over `top/left` or `width/height` to avoid reflows.
    - Use `will-change` sparingly on complex moving elements (e.g., glitch layers).
3.  **LOD System**:
    - Dynamically adjust particle counts and grid density based on `window.innerWidth`.
    - Reduce effect frequency on smaller screens.

## 5. Testing Requirements

- **Devices**:
  - Desktop (High-end): Full particle count, max blur.
  - Laptop (Mid-range): Smooth 60fps required.
  - Mobile: Reduced particle count, larger grid, touch responsiveness.
- **Browser Compatibility**:
  - Chrome/Edge: Full support (V8 engine handles Canvas well).
  - Firefox: Verify `filter: blur()` performance.
  - Safari: Check `clip-path` rendering.

## 6. Future Improvements
- **Web Audio Sync**: Tie glitch intensity to the audio waveform from `GlitchAudioSystem`.
- **Post-Processing**: Add a global RGB split shader (WebGL) if standard Canvas becomes too limiting.
