# Rahul's Personal Website

## Project Overview

A personal website for Rahul that prioritizes readability and content over flashy design. The site showcases his work across software, investing, and advising, along with writing, a life checklist, and an editorial "story" page. The philosophy: ship a clean, minimal V1 now, iterate over time.

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Astro 5.x | Zero JS by default, `output: 'static'` (supports `prerender = false` for server routes) |
| CMS | Tina CMS (optional) | Content lives as local markdown/JSON in `content/` — Tina is a nice-to-have editing UI, not a dependency |
| Styling | Tailwind CSS | `darkMode: 'class'`, stone color palette, custom accent colors |
| Search | Pagefind | Client-side static search, indexed at build time |
| Newsletter | Buttondown API | Custom form, serverless endpoint at `/api/subscribe` |
| Fonts | System font stack | No web fonts. Sans, serif, and mono stacks defined in tailwind.config.mjs |
| Deployment | Vercel | Astro adapter configured, not yet deployed |

## Design Language: Editorial Minimalism with Literary Warmth

This is the single most important thing to understand about this project. Every design decision flows from these principles.

### The Three Typographic Voices

1. **Serif** (Iowan Old Style / Palatino / Georgia) — headings, titles, personality. This is the voice of the author.
2. **Sans-serif** (system stack) — body text, descriptions. This is the voice of clarity.
3. **Monospace** (SFMono / Menlo) — metadata, labels, categories, dates. This is the voice of the system — always `text-xs`, `uppercase`, `tracking-wider`.

These three voices create rhythm and hierarchy without needing color or weight changes.

### Color Palette

- **Surface**: `#fafaf9` (light) / `#0c0a09` (dark) — warm stone, not cold white/black
- **Text**: Stone scale (stone-800 on light, stone-200 on dark)
- **Accent**: `#c2410c` (burnt orange, light) / `#fb923c` (warm orange, dark) — used very sparingly
- **Muted text**: stone-400 / stone-500 — for metadata, dates, secondary info

### Core Principles

1. **Subtraction as a design move.** If something can be removed without losing meaning, remove it. No borders, no cards, no badges, no pills unless they earn their place. Every element that was removed (colored status badges, tech stack pills, navigation buttons on story page) made the design better.

2. **Space is a first-class element.** Generous spacing (`mt-24` between major sections, `space-y-8` or `space-y-10` between items). White space does the work that borders and dividers try to do.

3. **Warm materials.** The stone palette, the burnt orange accent, the serif headings, the ambient light effects — everything should feel like a well-lit room with good books, not a cold SaaS dashboard.

4. **Respect for the reader.** Max prose width ~700px. 18px base font. 1.7 line-height. Animated underline links (not color-change). Content-first, always.

5. **No UI chrome unless invisible.** The story page has zero navigation buttons — just scroll. The search is a modal triggered by an icon. The theme toggle is a small icon. Navigation is clean text links. If UI must exist, make it disappear.

### Ambient Light System

The site has an ambient light effect that communicates time-of-day:
- **Light mode (daytime)**: Warm golden sunlight glow from the upper right — two layered radial gradients with golden hues (rgba 245/180/80 range). Parallax on scroll.
- **Dark mode (nighttime)**: Cool silver moonlight from the upper right — blue-silver hues (rgba 180/200/240 range).
- The `.sunlight` div is `position: fixed`, `pointer-events: none`, `z-index: 0`. It's hidden on the story page.
- CSS lives in global.css under "Ambient sunlight glow" comment.

### Animation

- `animate-fade-in`: subtle translateY(8px) + opacity, 0.5s, used on page load
- Staggered with `animation-delay` on hero elements
- Link underlines animate via `background-size` transition (0% → 100%)
- No scroll-triggered animations on regular pages (only story page had them, and they were removed for simplicity)

## Content Architecture

All content lives in `/content/` as flat files:

```
content/
├── posts/           # Markdown blog posts (frontmatter: title, publishedAt, excerpt, tags)
├── projects/        # Markdown project pages (frontmatter: title, description, category, status, startYear, endYear, url, repoUrl, logo, techStack)
├── pages/           # Markdown generic pages (now.md, etc.)
├── checklist.json   # Life checklist items with categories and done/pending state
├── story.json       # Editorial story blocks (hero, chapter, text, image, quote, divider)
└── settings.json    # Site settings (title, description, bio, socialLinks, interests)
```

Data layer: `src/lib/content.ts` reads these files using `gray-matter` + `marked`. All functions are synchronous. Types are defined there too.

## Pages

| Route | File | Description |
|---|---|---|
| `/` | `index.astro` | Hero → Manifesto (3 paragraphs) → What I Do (CSS grid) → Writing (latest 5 posts) |
| `/writing` | `writing/index.astro` | Bullet list of posts with dates |
| `/writing/[slug]` | `writing/[slug].astro` | Individual post with prose styling |
| `/projects` | `projects/index.astro` | Stacked list: title + timeline, description, optional links. Sorted active-first. |
| `/projects/[slug]` | `projects/[slug].astro` | Individual project page |
| `/story` | `story.astro` | Horizontal page-flipping editorial story. Uses `wide` and `hideFooter` on BaseLayout. |
| `/now` | `now.astro` | What Rahul is currently up to |
| `/checklist` | `checklist.astro` | Life checklist with dot-grid visualization and categorized items |
| `/rss.xml` | `rss.xml.ts` | RSS feed |
| `/api/subscribe` | `api/subscribe.ts` | Buttondown newsletter endpoint (server-rendered, `prerender = false`) |

## Key Components

- **BaseLayout.astro**: HTML shell with `<head>`, dark mode flash prevention, sunlight div, header, footer. Props: `title`, `description`, `ogImage`, `wide` (removes max-width), `hideFooter`.
- **Header.astro**: Nav links (Writing, Projects, Story, Now, Checklist) + search + theme toggle. Active page highlighted with accent color.
- **Footer.astro**: Newsletter form (Buttondown) + "Keep going." tagline + social links (RSS, GitHub, Twitter).
- **Newsletter.astro**: Custom email form with arrow submit button, "You're in." success state. Zero third-party branding.
- **ThemeToggle.astro**: Sun/moon icons, persists to localStorage, respects `prefers-color-scheme`.
- **SearchWidget.astro**: Pagefind-powered modal search.

## Story Page — Special Behavior

The story page (`/story`) is a horizontal page-flipping experience:
- Each story block = one full-viewport page
- CSS: `scroll-snap-type: x mandatory` on the scroll container, `flex: 0 0 100%` on each page
- JS: Wheel events translated to horizontal scrollLeft changes. **Scroll-snap is temporarily disabled during active scrolling** (to prevent snap from fighting incremental changes), then re-enabled after 150ms pause.
- Heights are set explicitly via JS (not CSS percentage chain) because the `animate-fade-in` transform on `<main>` breaks the chain.
- The sunlight overlay is hidden on the story page.
- No navigation UI — pure scroll only. Keyboard arrows work as invisible enhancement.
- The `<script>` must be `is:inline` to avoid Astro module bundling issues.

## "What I Do" Section (Homepage)

Uses CSS Grid for label-description alignment:
```
sm:grid sm:grid-cols-[7rem_1fr] sm:gap-x-6 sm:items-baseline
```
Labels are monospace, uppercase, tracking-wider. Descriptions are regular body text. `items-baseline` aligns the first text baseline across both columns.

## Known Issues / Pending Work

- Story page scroll may still need tuning — the snap-disable/re-enable approach needs testing
- Not yet a git repository
- Not deployed to Vercel yet
- Mobile nav has 5 items which may be crowded on small phones
- Placeholder social URLs in footer need real links
- Story page chapter cards could include dates (user agreed but not yet implemented)
- Now page design needs more thought (user deferred to later)
- Buttondown API key is in `.env` (gitignored)

## Running the Project

```bash
npm run dev      # Start dev server (usually localhost:4321)
npm run build    # Static build to dist/
```

## What NOT to Do

- **Don't add UI chrome** (borders, cards, badges, pills, buttons) without a strong reason. This site's power is in its restraint.
- **Don't use color for emphasis** — use typography (weight, size, font family) instead. Accent color is reserved for links and interactive elements.
- **Don't add third-party branding** (e.g., "Powered by X"). The site should feel handmade.
- **Don't over-engineer** — this is a personal site, not a SaaS product. Simple, flat file content. No databases. No authentication (except the Buttondown API key).
- **Don't break the three-voice system** — every piece of text should clearly belong to serif (personality), sans (clarity), or mono (system/metadata).
- **Don't add emojis** unless explicitly asked.
