---
name: MIANG MAP
description: Community tourism platform for Ban Pa Miang — a low-carbon highland village in Lampang, Thailand
colors:
  forest-floor: "#0f1410"
  forest-floor-deep: "#0b0d0c"
  forest-floor-raised: "#1b2318"
  highland-tea-leaf: "#40c057"
  ancient-grove: "#2b8a3e"
  ancient-grove-deep: "#1b4332"
  morning-mist-accent: "#d3f9d8"
  ridge-fog: "#868e96"
  overcast-text: "#d1d5db"
  glass-surface: "rgba(15, 20, 16, 0.7)"
  glass-border: "rgba(255, 255, 255, 0.1)"
  ink-white: "#ffffff"
typography:
  display:
    fontFamily: "'Barlow', 'Sarabun', sans-serif"
    fontSize: "clamp(2.2rem, 5vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "0px"
  headline:
    fontFamily: "'Barlow', 'Sarabun', sans-serif"
    fontSize: "clamp(1.8rem, 3vw, 2.5rem)"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "-0.5px"
  title:
    fontFamily: "'Sarabun', 'Barlow', sans-serif"
    fontSize: "1.35rem"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "'Sarabun', 'Barlow', sans-serif"
    fontSize: "1.05rem"
    fontWeight: 300
    lineHeight: 1.8
  label:
    fontFamily: "'Barlow', sans-serif"
    fontSize: "0.9rem"
    fontWeight: 600
    letterSpacing: "0.5px"
rounded:
  sm: "4px"
  md: "8px"
  lg: "16px"
  xl: "20px"
  pill: "50px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "60px"
  xxl: "100px"
components:
  button-primary:
    backgroundColor: "{colors.highland-tea-leaf}"
    textColor: "{colors.ink-white}"
    rounded: "{rounded.md}"
    padding: "14px 30px"
  button-primary-hover:
    backgroundColor: "{colors.ancient-grove}"
  button-secondary:
    backgroundColor: "rgba(255,255,255,0.08)"
    textColor: "{colors.ink-white}"
    rounded: "{rounded.md}"
    padding: "14px 30px"
  button-secondary-hover:
    backgroundColor: "rgba(255,255,255,0.15)"
  card-surface:
    backgroundColor: "rgba(255,255,255,0.03)"
    textColor: "{colors.overcast-text}"
    rounded: "{rounded.lg}"
    padding: "30px"
  nav-glass:
    backgroundColor: "rgba(15,20,16,0.85)"
    textColor: "{colors.ink-white}"
    height: "80px"
---

# Design System: MIANG MAP

## 1. Overview

**Creative North Star: "The Highland Keeper's Archive"**

This is a visual system built like a worn field notebook found in a forest ranger's cabin: hand-stitched pages, pressed leaves, ink stamps, hand-written coordinates. Everything in this system feels discovered rather than manufactured. The dark forest floor background is not a "dark mode" choice — it is the forest at dusk, the ground you walk on. The green accent is not a brand color in the marketing-department sense; it is the color of a Miang tea leaf held up to the light. Authenticity is the aesthetic doctrine here, not modernity.

The system carries both Thai and English content with equal weight. Typography must support both scripts legibly without one feeling like a translation of the other. Sarabun handles Thai; Barlow handles headlines and Latin text. The pairing is functional before it is aesthetic — that too is in the spirit of the archive.

This system explicitly rejects: neon colors and aggressive motion (this village is unhurried), generic AI landing page conventions (cream backgrounds, tracking-heavy eyebrow labels on every section, floating emoji icon cards, hero-metric stat boxes), corporate eco-tourism polish (stock photography, greenwashing buzzwords), and any generic Tourism Authority brochure register.

**Key Characteristics:**
- Forest-floor dark as the surface — not dark mode, but the forest itself
- Green accent used with restraint: it earns its appearance through purpose, not decoration
- Glassmorphism as structural necessity (nav and overlays), not as aesthetic fashion
- Bilingual-first: Thai and English given equal typographic respect
- Motion is quiet: state-change feedback and gentle entrances; no choreography for its own sake
- Depth is hover-activated: surfaces are flat at rest; shadows and elevation respond to interaction

## 2. Colors: The Miang Palette

A palette built from the forest floor up: near-black ground, deep forest green for structural identity, highland tea-leaf green as the living accent, fog and overcast for neutral prose.

### Primary
- **Highland Tea Leaf** (`#40c057`): The living accent. The color of a fresh Miang tea leaf held to the light. Used for primary actions, active states, brand text highlights, and hover feedback. Never as a background color at large scale; its rarity is its power.
- **Ancient Grove** (`#2b8a3e`): The settled, mature version of the brand green. Used in gradient combinations with Highland Tea Leaf, hover states on primary buttons, and deep green overlays.
- **Ancient Grove Deep** (`#1b4332`): Near-black dark green. Section overlays, deep gradient terminations, background tints for green-toned areas.

### Neutral
- **Forest Floor** (`#0f1410`): The primary page background. This is the forest at dusk, not a dark mode. The near-imperceptible green tint distinguishes it from generic tech-dark.
- **Forest Floor Deep** (`#0b0d0c`): Footer and deepest recessed areas. Slightly more compressed than Forest Floor to create subtle layering without shadows.
- **Forest Floor Raised** (`#1b2318`): Slightly lifted surface for cards and containers. Works without shadows at rest.
- **Ridge Fog** (`#868e96`): Muted secondary text, metadata, labels on dark surfaces.
- **Overcast Text** (`#d1d5db`): Standard body text and secondary content on dark backgrounds. Contrast verified at ≥4.5:1 against Forest Floor.
- **Morning Mist Accent** (`#d3f9d8`): Very light green, used for green-on-dark badge text, carbon point labels, and accent copy. Warm yet cool; it reads as mountain air.
- **Ink White** (`#ffffff`): Primary heading and high-emphasis text. Used for h1–h3 and navigation items.

### Named Rules
**The Tea Leaf Restraint Rule.** Highland Tea Leaf (`#40c057`) appears only on interactive and active elements — primary buttons, active nav states, highlight icons. It is prohibited as a background at large scale. If it covers more than 15% of any view, it has lost its power.

**The Forest Tint Rule.** All neutral dark surfaces carry a trace of green (the `#0f1410` base has perceptible green channels). Never use a neutral gray (`#111111`, `#1a1a1a`) as a background color; it reads as tech-dark, not forest.

## 3. Typography

**Display/Headline Font:** Barlow (weights 700, 800) — with Sarabun as companion for Thai scripts
**Body Font:** Sarabun (weights 300, 400, 500) — with Barlow as companion for Latin content
**Label Font:** Barlow (weight 600)

**Character:** Barlow at heavy weights carries the confident, upright energy of outdoor signage — legible from a distance, direct. Sarabun handles Thai text with clarity at body sizes, where letter spacing and line height need room to breathe. The pairing is functional and unassuming: two workhorse faces, neither competing for personality over the photography and content.

### Hierarchy
- **Display** (800, `clamp(2.2rem, 5vw, 3.5rem)`, line-height 1.25): Hero headings. Mix Sarabun for Thai text. Max 6rem ceiling.
- **Headline** (800, `clamp(1.8rem, 3vw, 2.5rem)`, line-height 1.3, tracking -0.5px): Section titles, major content blocks.
- **Title** (700, `1.35rem`, line-height 1.4): Card headings, story section h3, subsection leaders.
- **Body** (300–400, `1.05rem`, line-height 1.8): Prose content. Sarabun at 300 for Thai text; Barlow at 400 for Latin. Max line length 65–75ch.
- **Label** (600, `0.9rem`, tracking 0.5px): Navigation items, badge text, captions, carbon point labels. Short strings only; never body-length label copy.

### Named Rules
**The Dual-Script Rule.** Thai text always uses Sarabun; Latin headings always use Barlow. Both must be declared in the font-family stack. Never use a Latin-only font for a Thai-language block.

**The Weight Contrast Rule.** Hierarchy is achieved through weight contrast (300 body vs. 800 display) before scale. A flat-weight scale at varying sizes reads as indecision; this system uses a ≥2x weight gap between body and display.

## 4. Elevation

This system is hover-activated. Surfaces are flat at rest; depth appears only as a response to interaction or structural necessity. The dark background is the ground-zero layer. Glassmorphism with `backdrop-filter: blur()` is used exclusively for floating elements that need to separate from the background (navigation bar, modal overlays) — not as decoration on static cards.

### Shadow Vocabulary
- **Interaction Rise** (`0 15px 35px rgba(0,0,0,0.4)`): Cards on hover. Appears as the card lifts; absent at rest.
- **Primary Action Glow** (`0 8px 24px rgba(64,192,87,0.3)`): Primary buttons at rest. Intensifies to `0 12px 30px rgba(64,192,87,0.5)` on hover. Green glow only on green-primary actions.
- **Nav Ambient** (`0 4px 30px rgba(0,0,0,0.4)`): Fixed navigation bar. Structural; always present to separate the fixed element from content scrolling beneath.
- **Media Shadow** (`0 20px 40px rgba(0,0,0,0.5)`): Large image containers. Applied to story media frames to anchor photography against the dark background.

### Named Rules
**The Flat-At-Rest Rule.** Static cards and containers have no shadow at rest. The shadow vocabulary above applies on `:hover` or to floating/fixed elements only. A page where everything has a shadow at rest is a page where nothing feels interactive.

**The Green Glow Rule.** Box-shadow glows using the brand green (`rgba(64,192,87,N)`) are reserved for primary CTA buttons only. Applying the green glow to cards, containers, or arbitrary elements cheapens the primary action's distinctiveness.

## 5. Components

### Buttons
- **Shape:** Gently rounded (8px radius); confident without being pill-shaped
- **Primary:** Gradient from Highland Tea Leaf to Ancient Grove (`135deg, #40c057 0%, #2b8a3e 100%`), white text, green ambient glow at rest, rises 3px with deeper glow on hover. Padding 14px 30px. Font: Barlow 700 16px.
- **Secondary / Ghost:** Semi-transparent dark (`rgba(255,255,255,0.08)`), white text, `1px solid rgba(255,255,255,0.15)` border, `backdrop-filter: blur(8px)`. Brightens to `rgba(255,255,255,0.15)` on hover, rises 3px. Same padding as primary.
- **Nav Button:** No background, uppercase Barlow 600 15px, 0.5px tracking. Active state shows Highland Tea Leaf text + 3px underline. Subtle background tint on hover.

### Cards / Containers
- **Corner Style:** 16px radius (rounded-lg)
- **Background:** `rgba(255,255,255,0.03)` at rest — barely perceptible on Forest Floor
- **Border:** `1px solid rgba(255,255,255,0.08)` at rest; transitions to `rgba(64,192,87,0.3)` on hover
- **Shadow Strategy:** None at rest. On hover: 15px rise + `0 15px 35px rgba(0,0,0,0.4)`.
- **Accent Reveal:** 4px top border gradient (Highland Tea Leaf → Ancient Grove) fades in on hover via `opacity` transition
- **Internal Padding:** 30px
- **Backdrop:** `backdrop-filter: blur(8px)` on glass-surface variants

### Navigation
- **Style:** Fixed glassmorphism bar; `rgba(15,20,16,0.85)` background, `backdrop-filter: blur(12px)`, `1px solid rgba(255,255,255,0.1)` bottom border, 80px height
- **Nav text:** Barlow 600, uppercase, 15px, 0.5px tracking, `#ccc` default
- **Active:** Highland Tea Leaf text + 3px bottom underline indicator
- **Hover:** White text, `rgba(255,255,255,0.05)` background
- **Mobile:** Slides-in hamburger menu (260px wide, full-height sidebar), `translateX(-100%)` → `translateX(0)` transition at `cubic-bezier(0.4, 0, 0.2, 1)`. Backdrop blur on overlay.

### Hero Section
- **Layout:** Full-viewport height (90vh), background image with gradient overlay `linear-gradient(135deg, rgba(15,20,16,0.55), rgba(27,67,50,0.40))`
- **Content:** Centered, max-width 900px, stacked: badge chip → h1 → body → CTA pair
- **Badge Chip:** `rgba(64,192,87,0.2)` background, Morning Mist Accent text, `1px solid rgba(64,192,87,0.4)` border, 50px radius, 6px 16px padding, Barlow 600 14px uppercase
- **Entrance:** Single `fadeInUp` animation (opacity + translateY), 1s ease-out, no stagger

### Story Media Block
- **Layout:** 1fr 1fr grid; media right, text left
- **Image Container:** 16px radius, `aspect-ratio: 4/3`, `overflow: hidden`, `1px solid rgba(255,255,255,0.1)` border
- **Overlay:** Bottom gradient `rgba(15,20,16,0.9)` → transparent, 30px padding, white caption text
- **Image hover:** `transform: scale(1.05)` on the image within the container at 0.5s ease — exception to the no-image-hover rule because the overlay context makes the scale reveal the caption, not just animate for its own sake

### Low-Carbon Feature Box
- **Layout:** Two-column grid (1.2fr 0.8fr), `rgba(43,138,62,0.15)` background gradient, `1px solid rgba(64,192,87,0.2)` border, 20px radius
- **Stats panel:** Dark inset `rgba(15,20,16,0.6)`, `backdrop-filter: blur(10px)`, centered stat value at 3.5rem 800 Highland Tea Leaf

## 6. Do's and Don'ts

### Do:
- **Do** use Forest Floor (`#0f1410`) as the page background; it has an imperceptible green tint that distinguishes it from generic tech-dark.
- **Do** apply Highland Tea Leaf (`#40c057`) to interactive elements: primary buttons, active nav indicators, highlight icons, and carbon point icons.
- **Do** use Barlow 800 for all display headings; use Sarabun for all Thai-language body text and Thai headings.
- **Do** verify all body text contrast at ≥4.5:1 against its background. Overcast Text (`#d1d5db`) on Forest Floor passes; any lighter gray does not.
- **Do** apply glassmorphism (`backdrop-filter: blur()`) only to floating/fixed structural elements: the navigation bar and modal overlays. Not to static cards.
- **Do** include Sarabun in every font-family stack that will render Thai text.
- **Do** use `text-wrap: balance` on h1–h3 for bilingual content where line-break behavior is less predictable.
- **Do** keep animations quiet: `ease-out` curves, `opacity + translateY` entrances, `@media (prefers-reduced-motion: reduce)` fallbacks on every animation.
- **Do** use card hover feedback via background, border-color, and shadow transitions — not by scaling or moving the card image.

### Don't:
- **Don't** use neon colors, high-saturation gradients, or aggressive motion. This brand is unhurried; design that shouts is a category error.
- **Don't** use cream, sand, beige, or warm-neutral backgrounds (`L 0.84–0.97, C < 0.06, hue 40–100`). That is the generic AI aesthetic; it contradicts the forest identity.
- **Don't** apply the green glow (`rgba(64,192,87,N)`) to cards, section boxes, or decorative elements. Reserve it for primary CTA buttons only.
- **Don't** use `border-left` stripes as a card accent. The 3px Highland Tea Leaf left border on the active hamburger menu link is a functional navigation indicator — do not replicate this pattern as decoration on cards or callouts.
- **Don't** use gradient text (`background-clip: text` + gradient). All text uses a solid color from the palette.
- **Don't** build identical card grids: same-sized cards with icon + heading + paragraph repeated across all cards. Vary card content structure, or use a story layout instead.
- **Don't** use tracked uppercase eyebrow labels above every section (e.g., small caps "ABOUT", "PROCESS", "PRICING"). Badges and chips are used sparingly as contextual indicators, not as section scaffolding.
- **Don't** use numbered section markers (01 / 02 / 03) unless the content is genuinely a sequential process with order that carries meaning.
- **Don't** use any of the following copy: "seamless," "world-class," "next-generation," "sustainable travel experience," "cutting-edge," "game-changer." Describe what the village literally offers.
- **Don't** use a Latin-only font (Barlow alone) for blocks of Thai text. Thai requires Sarabun at body sizes to remain legible.
