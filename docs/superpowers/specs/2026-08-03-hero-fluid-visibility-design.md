# Hero Fluid Visibility Design

## Goal
Make the hero WebGL fluid background more visible while preserving readable hero content.

## Design
- Increase the scene's visible lighting and color intensity.
- Reduce the dark visual treatment enough to reveal the fluid effect without compromising text contrast.
- Keep the existing reduced-motion fallback and component boundaries unchanged.

## Validation
- Run ESLint.
- Visually verify the hero at desktop and mobile widths, confirming that the background is clearer and primary text remains readable.
