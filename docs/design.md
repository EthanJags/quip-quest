# QuipQuest — Dark Neo-Bauhaus Design System

## Philosophy

Bold geometric minimalism meets dark-mode energy. Inspired by the Bauhaus school's commitment to functional clarity and primary-color drama, adapted for a modern game UI with a dark base that makes vivid colors pop.

No rounded corners. No gradients. No shadows. Just geometry, color, and typography.

---

## Color Palette

| Token           | Value     | Usage                                    |
| --------------- | --------- | ---------------------------------------- |
| `--color-bg`    | `#0B0B13` | Page background — near-black indigo      |
| `--color-bg-raised` | `#12121E` | Elevated surfaces (navbar, footer)  |
| `--color-bg-card` | `#16162A` | Card backgrounds                       |
| `--color-surface` | `#1E1E3A` | Interactive surfaces, hover states     |
| `--color-primary` | `#FF3A3A` | Primary actions, red accents           |
| `--color-blue`  | `#3A7DFF` | Secondary actions, info states           |
| `--color-yellow`| `#FFD600` | Highlights, 1st place, host badges       |
| `--color-text`  | `#F0EBE3` | Primary text — warm off-white            |
| `--color-text-muted` | `#7A7A9E` | Secondary text, labels              |
| `--color-text-dim` | `#4A4A6A` | Tertiary text, disabled              |
| `--color-border`| `#2A2A4A` | Structural borders                       |
| `--color-border-strong` | `#3A3A5A` | Emphasized borders               |

## Typography

| Style          | Font          | Size  | Weight | Extras                        |
| -------------- | ------------- | ----- | ------ | ----------------------------- |
| Display        | Syne          | 48px+ | 800    | Uppercase, letter-spacing 0.05em |
| Heading XL     | Syne          | 32px  | 700    | Uppercase, letter-spacing 0.03em |
| Heading LG     | Geist Sans    | 24px  | 600    |                               |
| Body           | Geist Sans    | 16px  | 400    |                               |
| Label/Caption  | Geist Sans    | 11px  | 600    | Uppercase, letter-spacing 0.12em |
| Mono (codes)   | Geist Mono    | —     | 700    | Game codes, scores, timers    |

### CSS Classes

- `.heading-display` — Syne, 48px, 800wt, uppercase
- `.heading-xl` — Syne, 32px, 700wt, uppercase
- `.heading-lg` — 24px, 600wt
- `.label-caps` — 11px, 600wt, uppercase, wide tracking
- `.font-display` — Syne font family

## Components

### Buttons (`.btn`)

All buttons: no border-radius, uppercase text, 600 weight, 2px border, letter-spacing 0.08em.

| Variant       | Class          | Fill       | Border     | Text       |
| ------------- | -------------- | ---------- | ---------- | ---------- |
| Primary       | `.btn-primary` | `primary`  | `primary`  | white      |
| Blue          | `.btn-blue`    | `blue`     | `blue`     | white      |
| Outline       | `.btn-outline` | transparent| `border`   | `text`     |
| Ghost         | `.btn-ghost`   | transparent| transparent| `text-dim` |
| Danger        | `.btn-danger`  | transparent| `primary`  | `primary`  |

Hover: fill/stroke inversion. Active: scale 0.97. Disabled: 50% opacity.

### Inputs (`.input-field`)

- No border-radius
- 2px border (border color)
- Dark bg-card background
- Placeholder: text-dim
- Focus: border transitions to text color

### Cards

- `.card-elevated` — bg-card, 2px border, padding 32px
- `.card-accent` — adds 3px left border in primary red

### Select (`.select-field`)

- No border-radius
- 2px border, dark background
- Custom dropdown appearance

### Progress Bar

- `.progress-track` — 8px tall, bg-raised, no radius
- `.progress-fill` — colored fill, transition on width

### Divider (`.divider`)

- 2px solid border-color line

### Overlay (`.overlay`)

- Fixed fullscreen, bg-bg/80 with backdrop blur

## Animations

| Class              | Effect                                |
| ------------------ | ------------------------------------- |
| `.anim-fade-up`    | Fade in + translate up 20px, 0.5s     |
| `.anim-fade-in`    | Opacity 0→1, 0.3s                     |
| `.anim-slide-left` | Slide from right 30px, 0.4s           |
| `.anim-slow-spin`  | Continuous rotation, 25s              |
| `.anim-float`      | Gentle Y oscillation, 8s              |
| `.anim-pulse-geo`  | Scale 1↔1.15 + rotate 45°, pulsing   |
| `.anim-count-pulse`| Scale 1↔1.05, subtle emphasis         |
| `.anim-shimmer`    | Left-to-right shine sweep             |

## Layout

- Max content width: 480px (mobile-first)
- Page padding: 24px
- Card padding: 32px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64

## Background

The `BauhausBackground` component renders CSS-only geometric shapes:
- Large red circle (top-right) with radial gradient fade
- Yellow triangle (bottom-left) with float animation
- Blue square (center-left) with slow spin
- Small accent shapes scattered
- Red horizontal line accent

All at low opacity to create depth without distraction.

## Grain Texture

A full-screen `::after` pseudo-element on `body` applies an SVG noise texture (feTurbulence) at 3% opacity for tactile warmth.

## Scrollbar

Custom dark scrollbar: bg-raised track, border-strong thumb, primary on hover.

## Principles

1. **No rounded corners** — all elements are rectangular
2. **No shadows** — depth comes from border and color contrast
3. **No gradients** — flat fills only (except radial on background shapes)
4. **Primary colors dominate** — red, blue, yellow on dark base
5. **Geometry as decoration** — squares, circles, triangles as accents
6. **Typography creates hierarchy** — Syne display vs Geist body
7. **Snappy transitions** — 150ms ease-in-out, not floaty
