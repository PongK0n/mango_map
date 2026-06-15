---
target: home/index.html
total_score: 22
p0_count: 0
p1_count: 2
timestamp: 2026-06-03T09-18-40Z
slug: home-index-html
---
# MIANG MAP Design Critique

An honest, design-director review of the MIANG MAP codebase and visual surfaces (`index.html`, `home/index.html`, `map/index.html`, `travel_package/index.html`).

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Navigation states are clear; but map marker filters and Supabase actions lack loaders, relying on thread-blocking alerts. |
| 2 | Match System / Real World | 3 | Good local Thai copy, but Map popups and form fields leak technical terminology ("Latitude", "Rating 5.0", "Facebook Link URL"). |
| 3 | User Control and Freedom | 2 | The JavaScript redirect loader screen (2.5s) traps users in a history loop. Modals lack ESC key or outside-click dismiss. |
| 4 | Consistency and Standards | 1 | **Major Failure:** Extreme visual mismatch between pages. Home is dark forest green; Map is pure black and tech blue; Packages is light gray/white with Google colors. |
| 5 | Error Prevention | 2 | Users can book travel dates in the past. Forms have no constraint guards on dates or password strength. |
| 6 | Recognition Rather Than Recall | 3 | Leaflet map uses 4 different marker colors with no visible legend, forcing the user to memorize or click every pin to find categories. |
| 7 | Flexibility and Efficiency | 2 | Nav links and modal actions are not keyboard accessible. No search/autocomplete for map locations. |
| 8 | Aesthetic and Minimalist Design | 2 | Home page has pulsing background blobs, identical card grids, and a metric box. Packages page has intense gradients and heavy cards. |
| 9 | Error Recovery | 2 | Forms use basic browser alerts for error messages, which block user interaction and feel unrefined. |
| 10 | Help and Documentation | 2 | Briefly explains carbon footprint on the packages page, but map view lacks contextual help or guides. |
| **Total** | | **22/40** | **Acceptable (Significant improvements needed)** |

## Anti-Patterns Verdict

Does this look AI-generated?

- **LLM Assessment**: Yes. Several default templates and styling patterns scream "AI generated":
  - **Visual Inconsistency**: The project suffers from severe split-personality disorder. It looks like three different prompts were run independently: one for a moody dark home page, one for a standard black/blue Leaflet map, and one for a light-colored SaaS landing page.
  - **Identical Card Grids**: The home page uses a repeating 4-card grid for "attractions" with identical structures (icon + title + description) that feels like boilerplate scaffolding.
  - **Hero-Metric Stat Box**: The carbon box has a large `-50%` value with a tiny label and supporting text in a grid container—the standard SaaS landing page layout.
  - **Gradient Text and Glows**: The loader page uses a bright blue gradient with text clipping, and primary buttons use bright green glowing box-shadows.

- **Deterministic Scan**:
  - `side-tab` (Side-tab accent border): Found in `home/index.html` (line 140, `.hamburger-link.active`) and `map/index.html` (line 128, `.hamburger-link.active`).
  - `dark-glow` (Colored glow on dark page): Found in `home/index.html` (line 335, button box-shadow).
  - `side-tab` (Side-tab accent border): Found in `map/index.html` (line 128, `.hamburger-link.active`).
  - `single-font` (Single font family): Found in `travel_package/index.html` (line 12).
  - `flat-type-hierarchy` (Flat typography scale): Found in `travel_package/index.html` (line 88).
  - `single-font` (Single font family): Found in `index.html` (line 9).

- **Visual Overlays**: No reliable browser overlay is running since this is a static codebase run without a dev server. Fallback static code analysis was used instead.

## Overall Impression
The copywriting and concept of "MIANG MAP" (a low-carbon highland village archive) are beautiful, but the visual execution falls apart across pages. It feels like three separate templates stitched together. The single biggest opportunity is to **unify the design system**—bring the dark forest theme, custom typography, and organic styling of the homepage to the map and packages pages.

## What's Working
1. **Typography Pairing (on Home page)**: The Barlow + Sarabun pairing on the home page works well. It balances Lanna culture and modern signage legibility.
2. **Local Voice**: The Thai copy is specific, using local concepts like "Miang tea leaf" and "shade-grown arabica coffee" instead of greenwashing buzzwords.

## Priority Issues

### [P1] Theme Mismatch and Visual Inconsistency across pages
- **Why it matters**: Severe inconsistency ruins user trust. Phi (our target user) will feel like they've been redirected to a third-party scam site when clicking "Map" or "Packages" due to the completely different styles.
- **Fix**: Apply the Forest Floor (`#0f1410`) theme, Ancient Grove green accents, glassmorphic headers, and card designs from `home/index.html` to both `map/index.html` and `travel_package/index.html` (and styles.css). Eliminate all standard blue (`#1a73e8`) and red (`#ff6b6b`) accents.
- **Suggested command**: `/impeccable colorize`

### [P1] Map Usability: Missing Legend and Stacking Mobile Navbar
- **Why it matters**: Users cannot tell what pins represent without clicking them first. On mobile, stacking the navbar vertically covers a huge portion of the Leaflet map, making it nearly unusable.
- **Fix**: Create a floating, toggleable legend explaining the marker colors. Optimize the mobile navigation to be a compact, scrollable row or a clean floating action menu.
- **Suggested command**: `/impeccable adapt`

### [P2] Inefficient Map Duplication in Packages Page
- **Why it matters**: The packages page initializes a Leaflet map and queries Supabase for locations in the background, even though the map is hidden. This slows down the page and wastes bandwidth.
- **Fix**: Remove Leaflet map initialization from the packages page, or refactor the packages page as an overlay drawer directly inside `map/index.html` so the code is consolidated.
- **Suggested command**: `/impeccable distill`

### [P2] AI Slop Patterns and Absolute Bans
- **Why it matters**: Element details like gradient text (on loader), pulsing background blobs, identical card grids, and image scale hover zooms give the site a generic, low-quality "AI-generated" feel.
- **Fix**: Remove gradient text and blue loader colors. Vary card grid layouts (e.g. asymmetrical story flow). Stop image hover scaling (`transform: scale(1.05)`) on `.story-img`.
- **Suggested command**: `/impeccable quieter`

### [P2] Poor Accessibility and Modals UX
- **Why it matters**: Modals trap users who rely on keyboard controls (cannot dismiss with ESC). The redirect page's low contrast text is unreadable for low-vision visitors.
- **Fix**: Listen for ESC keys to close modals, fix contrast on redirect buttons, and swap browser alerts for smooth, modern toast notifications.
- **Suggested command**: `/impeccable harden`

## Persona Red Flags

### Jordan (Confused First-Timer)
- **Red Flag - Redirect Loop**: Landed on `index.html` and got stuck on a spinning wheel that redirected after 2.5 seconds. Clicking "back" in the browser immediately redirected them forward again, trapping them.
- **Red Flag - Mystery Pins**: Opened the map and saw blue, orange, green, and black markers but had no idea what they meant until clicking each one.
- **Red Flag - Jargon-Heavy Forms**: Opened the "Edit Location" modal and saw inputs labeled "Latitude", "Longitude", and "Facebook Link URL" in plain English, which felt confusing and clinical.

### Casey (Distracted Mobile User)
- **Red Flag - Screen Coverage**: On mobile, the Map page navigation stack occupies almost 40% of the viewport, squeezing the map.
- **Red Flag - Tiny Targets**: Pin clusters are extremely close and difficult to tap with a single thumb.
- **Red Flag - Battery Drain**: The packages overlay hides the map but leaves it running, causing mobile battery drain and heat.

### Phi (Eco-Conscious Escapist - Project Specific)
- **Red Flag - Tonal Disconnect**: Expecting a calm, highland sanctuary vibe, they click "Packages" and are greeted by high-contrast blue, green, and yellow corporate stripes that look like Google Slides.
- **Red Flag - Static Stats**: Sees the "-50%" carbon reduction claim but cannot see how it updates based on their choices or how they can actively contribute.

## Minor Observations
- Supabase credentials (URL and API Key) are copy-pasted in multiple files, raising maintenance concerns if keys ever change.
- Text sizes on mobile headings clamp down, but body text line heights remain tight, making Sarabun Thai text look cramped on small screens.
