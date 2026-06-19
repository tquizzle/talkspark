# Design System: TalkSpark

## 1. Visual Theme & Atmosphere
A balanced, conversational interface with warm asymmetry and fluid spring-physics motion. The atmosphere is inviting yet thoughtful — like a well-lit coffee shop designed for deep dialogue. Density is moderate (4-5) to allow content breathing room, with confident asymmetric layouts that encourage exploration. Motion is perpetual and subtle, with micro-interactions that feel alive but never distracting from the core content: the conversation starters themselves.

## 2. Color Palette & Roles
- **Canvas White** (#F8FAFC) — Primary background surface (matches :root --theme-bg-canvas)
- **Pure Surface** (#FFFFFF) — Card and container fill (matches --theme-bg-card in light theme)
- **Charcoal Ink** (#0F172A) — Primary text, zinc-900 depth (matches --theme-text-main)
- **Muted Steel** (#64748B) — Secondary text, descriptions, metadata (matches --theme-text-muted)
- **Whisper Border** (rgba(226, 232, 240, 0.5)) — Card borders, 1px structural lines (matches --theme-border-base with 50% opacity)
- **Conversation Spark** (#4F46E5) — Single accent for CTAs, active states, focus rings (matches --theme-color-primary, indigo-600, saturation 72%)

*Note: Dark/Nord/Dracula themes modify these base values via data-theme attributes, maintaining the same structural relationships.*

## 3. Typography Rules
- **Display:** Atkinson Hyperlegible Next — Track-tight (tracking-tight), controlled scale, weight-driven hierarchy. Headlines use font-extrabold to font-black for visual weight without excessive size.
- **Body:** Atkinson Hyperlegible Next — Relaxed leading (leading-snug), 65ch max-width, neutral secondary color. Optimized for extended reading comfort.
- **Mono:** JetBrains Mono — For code snippets in admin panel, metadata, timestamps. Used sparingly for technical contexts.
- **Banned:** Inter (too generic for premium context), system UI fonts. Sans-serif exclusively — no serifs needed for this conversational interface.

## 4. Component Stylings
* **Buttons:** Flat with generous padding (px-5 py-2). Tactile -1px translate on active state. Accent fill for primary (bg-conversation-spark), ghost/outline for secondary (border-transparent hover:border-conversation-spark/50). No outer glows, no custom cursors.
* **Cards:** Generously rounded corners (rounded-2xl = 1rem). Diffused whisper shadow (shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]). Used only when elevation communicates hierarchy (featured content, modals). High-density areas use border-top dividers or negative space instead.
* **Inputs/Forms:** Label above (text-[10px] font-medium), helper text optional (text-xs), error text below (text-[10px] text-rose-500). Standard gap spacing (space-y-2). Focus ring in accent color (ring-2 ring-conversation-spark/50).
* **Loaders:** Skeletal shimmer matching exact layout dimensions (animate-pulse on bg-slate-200/50 elements). No circular spinners — skeleton reflects actual content structure.
* **Empty States:** Composed, illustrated compositions — not just "No data" text. Uses conversational prompts and gentle guidance to populate data.
* **Toggle Switches:** Sculpted, tactile feel with spring physics. Thumb has subtle shadow and scale transformation on active state.

## 5. Layout Principles
Grid-first responsive architecture with asymmetric splits for content emphasis. Strict single-column collapse below 768px. Max-width containment at 1400px (max-w-5xl). No flexbox percentage math — uses fixed spacing and flex-grow/shrink. Generous internal padding (p-6 baseline, p-8 featured). Vertical section gaps use clamp(3rem, 8vw, 6rem) for proportional scaling. Navigation uses desktop horizontal layout that collapses to clean mobile menu with preserved touch targets.

## 6. Motion & Interaction
Spring physics default: stiffness: 100, damping: 20 — premium, weighty feel on all interactive elements (buttons, toggles, links). Perpetual micro-loops: 
- Buttons: subtle scale pulse (1.0 → 1.02 → 1.0) on hover
- Cards: gentle float animation (-2px → 0 → -2px) on featured items
- Navigation items: slight lift on active state
Staggered cascade reveals for lists (50ms stagger delay). Performance: Animate exclusively via transform and opacity. Hardware-accelerated transforms only. Isolated Client Components for CPU-heavy animations (like card shuffle in RandomPage).

## 7. Anti-Patterns (Banned)
- No emojis anywhere in interface (preserves typographic purity)
- No Inter font ( Atkinson Hyperlegible Next is the designated typeface)
- No pure black (#000000) — uses Charcoal Ink (#0F172A) for depth
- No neon/outer glow shadows — all shadows use rgba values with max 20% opacity
- No oversaturated accents — Conversation Spark saturation at 72% max
- No excessive gradient text on large headers — gradients reserved for background accents only
- No custom mouse cursors — standard pointer/text/cursor defaults
- No overlapping elements — clean spatial separation always enforced via margin/padding
- No 3-column equal card layouts — max 2-column grids, preferred asymmetric or horizontal scroll
- No generic placeholder names ("John Doe", "Acme", "Nexus") — all content is real or clearly labeled as example
- No fake round numbers ("99.99%", "50%") — percentages reflect actual data or are omitted
- No AI copywriting clichés ("Elevate", "Seamless", "Unleash", "Next-Gen") — copy is human, conversational, and warm
- No filler UI text: "Scroll to explore", "Swipe down", scroll arrows, bouncing chevrons — content pulls users in naturally
- No broken Unsplash links — uses picsum.photos with deliberate parameters or SVG avatars for placeholder imagery
- No centered Hero sections — Hero content is left-aligned or split-layout to create visual tension and guide the eye