# Rahul's Personal Website

## Project Overview

A personal website for Rahul (rahul.wiki) that prioritizes readability and content over flashy design. The site showcases his work across software, investing, and advising, along with writing, a life checklist, and an editorial "story" page. The philosophy: ship a clean, minimal V1 now, iterate over time.

**Live site**: https://rahul.wiki
**Repo**: https://github.com/thesaaspreneur/personal_website
**CI/CD**: Vercel auto-deploys on every push to `main`

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Astro 5.x | Zero JS by default, `output: 'static'` (supports `prerender = false` for server routes) |
| CMS | Tina CMS (optional) | Content lives as local markdown/JSON in `content/` — Tina is a nice-to-have visual editing UI, not a dependency. Site works perfectly without it. Keep it installed. |
| Styling | Tailwind CSS | `darkMode: 'class'`, stone color palette, custom accent colors |
| Search | Pagefind | Client-side static search, indexed at build time |
| Newsletter | Buttondown API | Custom form, serverless endpoint at `/api/subscribe` with rate limiting, CSRF protection, email validation |
| Fonts | System font stack | No web fonts. Sans, serif, and mono stacks defined in tailwind.config.mjs |
| Deployment | Vercel | Connected to GitHub, auto-deploys on push. Domain: rahul.wiki (DNS via Spaceship) |

## How We Make Design Decisions

This is critical context for anyone continuing work on this project. Rahul has given creative authority to Claude for structural and design decisions, but Rahul has strong taste and will push back on anything that doesn't feel right. The working dynamic:

1. **Rahul proposes an idea** (often inspired by sites he admires — Amie.so, Daylight Computer, etc.)
2. **Claude evaluates it against the design language** — will it add or subtract from the aesthetic?
3. **Claude builds it and presents it** — always with an honest opinion on whether it works
4. **Rahul tests and gives visceral feedback** — "this is beautiful" or "this is really shitty" or "you added buttons and shit like that, I didn't want that"
5. **We iterate until it feels right** — sometimes this means removing what was just added

Key patterns in how decisions have gone:
- **Subtraction wins.** Every time we've removed something (About page, navigation buttons on story, tech stack pills on projects, three-dot dividers), the design got better.
- **Rahul prefers feeling over function.** He cares about how the page *feels* more than whether every feature is present. A page with perfect spacing and typography beats a page with every feature crammed in.
- **Copy matters deeply.** The manifesto text, the "hello humans/agents" greeting, the "Keep going." footer tagline — these were carefully chosen. Don't change copy without asking.
- **If it looks like a SaaS dashboard, it's wrong.** No cards with shadows. No colored badges. No pill-shaped tags. No feature grids.
- **Honest opinions are valued.** When Claude said "the three dots don't add much" or "this risks looking like a coffee stain," Rahul appreciated the honesty. Don't be a yes-machine.

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

1. **Subtraction as a design move.** If something can be removed without losing meaning, remove it. No borders, no cards, no badges, no pills unless they earn their place. Every element that was removed (colored status badges, tech stack pills, navigation buttons on story page, About page, three-dot dividers) made the design better.

2. **Space is a first-class element.** Generous spacing (`mt-24` between major sections, `space-y-8` or `space-y-10` between items). White space does the work that borders and dividers try to do.

3. **Warm materials.** The stone palette, the burnt orange accent, the serif headings, the ambient light effects — everything should feel like a well-lit room with good books, not a cold SaaS dashboard.

4. **Respect for the reader.** Max prose width ~700px. 18px base font. 1.7 line-height. Animated underline links (not color-change). Content-first, always.

5. **No UI chrome unless invisible.** The story page has zero navigation buttons — just scroll. The search is a modal triggered by an icon. The theme toggle is a small icon. Navigation is clean text links. If UI must exist, make it disappear.

### Ambient Light System (Day/Night)

The site has an ambient light effect that communicates time-of-day — this was a major design investment:

- **Light mode (daytime)**: Warm golden sunlight glow from the upper right — two layered radial gradients with golden hues (rgba 245/180/80 range, up to 22% opacity). Parallax on scroll.
- **Dark mode (nighttime)**: Cool silver moonlight from the upper right — blue-silver hues (rgba 180/200/240 range).
- The `.sunlight` div is `position: fixed`, `pointer-events: none`, `z-index: 0`. It's hidden on the story page.
- CSS lives in global.css under "Ambient sunlight glow" comment.

**Important context on light mode visibility**: Getting the sunlight visible on a near-white background was hard. We went through multiple iterations — the opacity had to be pushed to 22% at the core with golden (not burnt orange) hues because warm-on-white has almost no contrast. The gradient needed to be large (100% width, 140% height) and positioned to actually touch the content area. Dark mode was easy — warm/cool on black pops naturally.

**Design inspiration**: Rahul referenced Daylight Computer (daylightcomputer.com) as a site that communicates warmth well.

### Day/Night Theme Transition

When toggling between light and dark mode, the transition is animated:
- **Color sweep**: A translucent wave of color sweeps across the viewport — warm golden for sunrise (→ light), cool silver for nightfall (→ dark).
- **Celestial body**: A small geometric sun (14px golden disc with glow) or moon (14px silver crescent with glow) arcs across the viewport during the transition.
- **Smooth color change**: All background, text, and border colors transition smoothly over 0.7s using the `.theme-transitioning` class.
- **The sunlight/moonlight glow crossfades** between golden and silver over 0.9s.
- CSS for transitions lives in global.css under "Day/Night transition" comment.
- JS lives in ThemeToggle.astro — creates sweep + celestial elements, adds/removes transitioning class.
- **Design principle**: The celestial bodies are geometric and minimal (CSS-only, no images). If they ever feel "cute" or "weather app-like," they should be removed. They're meant to be a brief, delightful detail, not a spectacle.

### Animation

- `animate-fade-in`: subtle translateY(8px) + opacity, 0.5s, used on page load (defined in tailwind.config.mjs)
- Staggered with `animation-delay` on hero elements (0.1s, 0.2s, 0.3s, 0.4s)
- Link underlines animate via `background-size` transition (0% → 100%)
- Theme transitions: color sweep + celestial arc + smooth color crossfade
- No scroll-triggered animations on regular pages

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

Data layer: `src/lib/content.ts` reads these files using `gray-matter` + `marked`. All functions are synchronous. Types are defined there too. Projects are sorted active-first, then by startYear descending.

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

- **BaseLayout.astro**: HTML shell with `<head>`, dark mode flash prevention, sunlight div with scroll parallax, header, footer. Props: `title`, `description`, `ogImage`, `wide` (removes max-width), `hideFooter`.
- **Header.astro**: Nav links (Writing, Projects, Story, Now, Checklist) + search + theme toggle. Active page highlighted with accent color.
- **Footer.astro**: Newsletter form (Buttondown) + "Keep going." tagline + social links (RSS, GitHub, Twitter).
- **Newsletter.astro**: Custom email form with arrow submit button, "You're in." success state, 5-second cooldown after submission. Zero third-party branding.
- **ThemeToggle.astro**: Sun/moon icons, persists to localStorage, respects `prefers-color-scheme`. Triggers day/night transition animation (sweep + celestial body + smooth color crossfade).
- **SearchWidget.astro**: Pagefind-powered modal search (Cmd+K to open).

## Story Page — Special Behavior

The story page (`/story`) is a horizontal page-flipping experience:
- Each story block = one full-viewport page
- CSS: `scroll-snap-type: x mandatory` on the scroll container, `flex: 0 0 100%` on each page
- JS: Wheel events translated to horizontal scrollLeft changes. **Scroll-snap is temporarily disabled during active scrolling** (to prevent snap from fighting incremental changes), then re-enabled after 150ms pause. This is the key insight — mandatory snap fights incremental scrollLeft changes, so you must disable snap during wheel interaction.
- Heights are set explicitly via JS (not CSS percentage chain) because the `animate-fade-in` transform on `<main>` breaks the height chain by creating a new stacking context.
- The sunlight overlay is hidden on the story page.
- No navigation UI — pure scroll only. Keyboard arrows work as invisible enhancement.
- The `<script>` must be `is:inline` to avoid Astro module bundling issues.
- **Known issue**: Story page scroll has been difficult to get working reliably. The snap-disable/re-enable approach is the latest attempt. May still need debugging.

## "What I Do" Section (Homepage)

Uses CSS Grid for label-description alignment:
```
sm:grid sm:grid-cols-[7rem_1fr] sm:gap-x-6 sm:items-baseline
```
Labels are monospace, uppercase, tracking-wider, with `leading-[1.7]` to match body text line-height. Descriptions are regular body text. `items-baseline` aligns the first text baseline across both columns.

**History**: This went through multiple iterations. Manual `sm:pt-1` padding hacks didn't work. The final solution is CSS Grid with `items-baseline` and matching line-height on the labels.

## Security

A security audit was performed. Key protections in place:

- **Subscribe endpoint** (`/api/subscribe.ts`): Rate limiting (5 req/IP/60s), email regex validation + 254 char max, CSRF via Origin header check, API key guard, generic error messages (no Buttondown internals leaked).
- **Security headers** (`vercel.json`): X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy blocking camera/mic/geo.
- **Client-side**: 5-second form cooldown after submission.
- **Gitignore**: Covers `.env` and all `.env.*` variants (except `.env.example`).
- **No secrets in git history**: Verified with `git log --all --full-history -p -- .env`.
- **Content rendering**: `marked.parse()` output used via `set:html` is not sanitized (acceptable for single-author site where all content is author-controlled, but should be addressed if CMS editing is opened to others).

## Known Issues / Pending Work

- **Story page scroll** may still need tuning — the snap-disable/re-enable approach needs more testing across browsers
- **Day/night theme transition** (sweep + celestial body) is newly built and needs Rahul's review
- Mobile nav has 5 items which may be crowded on small phones
- Placeholder social URLs in footer need real links
- Story page chapter cards could include dates (user agreed but not yet implemented)
- Now page design needs more thought (user deferred to later)
- Buttondown API key is in `.env` (gitignored) and set in Vercel dashboard

## Design Decisions History (for context)

These are decisions that were made through iteration and feedback. Understanding WHY helps avoid re-litigating them:

1. **About page was killed.** The homepage IS the about page. The manifesto and "What I Do" sections replaced it.
2. **Blog was renamed to "Writing."** Feels more personal, less corporate.
3. **Projects went from cards → grid with filters → simple bullet list → stacked blocks.** Each simplification improved it. Current design: title + timeline on line 1, description on line 2, optional links on line 3. No cards, no borders, no badges.
4. **Story page had buttons, counters, and scroll hints — all removed.** User explicitly said "you added buttons and shit like that. I didn't want that." Pure scroll is the only navigation.
5. **"Tell me yours." closing line on homepage was removed.** User said it "doesn't make sense."
6. **Three-dot dividers on homepage were removed.** User said they "don't really change much."
7. **Substack was replaced with Buttondown.** Substack only has a read API. Buttondown has full read/write, allowing a custom form with zero third-party branding.
8. **Sunlight glow on light mode required golden hues, not burnt orange.** Burnt orange at any opacity on near-white looks like a stain. Golden (rgba 245/180/80) reads as warm light.
9. **Dark mode moonlight uses cool blue-silver, not warm amber.** Different time of day = different temperature. The user loved this metaphor ("same window, different light").
10. **The "What I Do" section uses CSS Grid, not flexbox.** Flexbox couldn't align baselines properly across different font sizes.

## Running the Project

```bash
npm run dev      # Start dev server (usually localhost:4321)
npm run build    # Static build to dist/
vercel --prod    # Manual deploy to production
```

Pushing to `main` auto-deploys via Vercel's GitHub integration.

## What NOT to Do

- **Don't add UI chrome** (borders, cards, badges, pills, buttons) without a strong reason. This site's power is in its restraint.
- **Don't use color for emphasis** — use typography (weight, size, font family) instead. Accent color is reserved for links and interactive elements.
- **Don't add third-party branding** (e.g., "Powered by X"). The site should feel handmade.
- **Don't over-engineer** — this is a personal site, not a SaaS product. Simple, flat file content. No databases. No authentication (except the Buttondown API key).
- **Don't break the three-voice system** — every piece of text should clearly belong to serif (personality), sans (clarity), or mono (system/metadata).
- **Don't add emojis** unless explicitly asked.
- **Don't change Rahul's copy** (manifesto, hero text, taglines) without asking. These were carefully chosen.
- **Don't propose adding things** — propose removing things. The default should be "do we need this?" not "what can we add?"
- **Don't use `innerHTML` or unsanitized DOM insertion** for any user-facing content. Use `.textContent` for dynamic text.
