# React Liquid Glass Skill

## Goal

Generate React interfaces inspired by:

- Apple Liquid Glass
- VisionOS
- iOS 26+
- Modern fintech dashboards

The UI must feel like real glass, not traditional glassmorphism.

---

# Preferred Library

Always prefer:

```bash
npm install liquid-glass-react
```

Alternative libraries:

- @ephasme/glassy
- quidlass
- @liquidglass/react

Avoid:

- Pure CSS glassmorphism
- Generic backdrop blur cards

---

# Installation

```bash
npm install liquid-glass-react
```

Import:

```tsx
import LiquidGlass from "liquid-glass-react";
```

---

# Design Principles

Liquid Glass is composed of:

- Refraction
- Blur
- Transparency
- Highlights
- Elasticity
- Edge bending

Every screen must contain visual depth.

Never place glass over a flat background.

---

# Background Rules

Always use:

- Gradient backgrounds
- Noise textures
- Images
- Dynamic colors

Avoid:

```css
background: #000;
```

because refraction becomes invisible.

---

# Sidebar

Always use:

```tsx
<LiquidGlass>
    <Sidebar />
</LiquidGlass>
```

Characteristics:

- Large radius
- Floating appearance
- Internal glow

---

# Header

Use:

```tsx
<LiquidGlass>
    <Header />
</LiquidGlass>
```

Must appear detached from the background.

---

# Floating Buttons

Use LiquidGlass.

Characteristics:

- Circular
- Floating
- Slight hover expansion

---

# Cards

Use LiquidGlass only for premium cards.

For large grids:

- Use CSS glass surfaces
- Reserve LiquidGlass for important content

---

# Border Radius

Preferred:

```css
32px
40px
48px
```

Avoid:

```css
4px
8px
12px
```

Apple-style interfaces use soft geometry.

---

# Colors

Preferred:

```css
rgba(255,255,255,0.08)
rgba(255,255,255,0.12)
rgba(255,255,255,0.15)
```

Avoid:

```css
rgba(255,255,255,0.4)
```

---

# Shadows

Use:

```css
box-shadow:
0 8px 32px rgba(0,0,0,0.15);
```

Avoid:

```css
0 0 100px
```

---

# Hover Effects

Use:

- Scale 1.02
- Increased highlight
- Slight glass distortion

Avoid:

- Large animations
- Material ripple effects

---

# Layout Hierarchy

Preferred:

Page
 ├── Glass Sidebar
 ├── Glass Header
 ├── Dashboard Cards
 ├── Floating Actions
 └── Background Gradient

---

# Performance Rules

Avoid:

- More than 10 liquid components visible simultaneously
- Nested liquid panels

Prefer:

- One liquid layer per major section

---

# Dashboard Preset

Fintech Style:

- Dark background
- Purple highlights
- Floating cards
- Liquid sidebar
- Glass buttons

Inspired by:

- Apple Wallet
- VisionOS
- Modern banking dashboards

---

# Portfolio Preset

Use:

- Dark gradient background
- Large hero section
- Floating glass navigation
- Glass project cards

Inspired by:

- Linear
- Raycast
- Apple VisionOS

---

# Never Do

Never use:

- Material 3 cards
- Sharp corners
- Flat backgrounds
- Heavy blur
- Excessive transparency

---

# Always Do

Always use:

- Refraction
- Visual depth
- Soft highlights
- Floating layers
- Large radii
- Dynamic backgrounds

Goal:

Make every generated UI look like it belongs in Apple's
Liquid Glass ecosystem.