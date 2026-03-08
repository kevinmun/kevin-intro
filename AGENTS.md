# AGENTS.md — AI Agent Guidance

This file is the authoritative reference for AI agents working on this codebase.
Follow these conventions to maintain architectural alignment when extending the site.

## Project Overview

- **Framework**: Astro.js v5, static output, vanilla JS only
- **Purpose**: Tech portfolio site with a markdown-based articles CMS
- **Deployment**: GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`)
- **No frontend frameworks** — do not add React, Vue, Svelte, or any UI framework dependency

## Directory Structure

```
src/
├── layouts/
│   └── BaseLayout.astro        # HTML shell — every page must use this
├── components/
│   ├── Header.astro            # Site nav (Home / Articles)
│   ├── Footer.astro            # Site footer
│   ├── Hero.astro              # Landing hero section
│   ├── About.astro             # Bio and career summary
│   └── ArticleCard.astro       # Article preview card
├── pages/
│   ├── index.astro             # Main portfolio page
│   └── articles/
│       ├── index.astro         # Articles listing
│       └── [...slug].astro     # Dynamic route per article
├── content/
│   └── articles/               # Drop .md files here to publish
├── content.config.ts           # Content collection schema (Zod)
└── styles/
    └── global.css              # Design tokens, reset, typography

tests/
└── smoke.test.ts               # Build verification tests (Vitest)

public/                         # Static assets copied to dist/ as-is
.github/workflows/deploy.yml    # CI pipeline: test → build → deploy
```

## Conventions

### Pages and Layouts

- Every page must import and wrap content in `BaseLayout.astro`.
- `BaseLayout` accepts `title` (required) and `description` (optional) props.
- New pages go in `src/pages/` — Astro uses file-based routing.

### Internal Links

Normalize `BASE_URL` with a trailing slash before concatenating paths:

```astro
const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
// then: href={`${base}articles/`}
```

### Components

- Place reusable components in `src/components/`.
- Use scoped `<style>` blocks inside each component — never write component
  styles in `global.css`.

### Styling

- All design tokens (colors, spacing, fonts, widths, radius) are CSS custom
  properties defined in `:root` inside `src/styles/global.css`.
- Reference tokens via `var(--color-accent)`, `var(--space-md)`, etc.
- Do not hardcode color values or spacing — always use design tokens.
- Global styles, resets, and typography rules belong in `global.css`.

Available token prefixes:
- `--color-*` — palette (bg, surface, text, text-muted, accent, border)
- `--font-*` — font stacks (body, mono)
- `--width-*` — layout widths (content: 720px, wide: 960px)
- `--space-*` — spacing scale (xs, sm, md, lg, xl, 2xl)
- `--radius` — border radius

### Articles (CMS)

Articles are Markdown files in `src/content/articles/`. Adding a new article
requires only creating a `.md` file and pushing — no config changes needed.

Required frontmatter:

```yaml
---
title: "Article Title"
description: "A short summary."
date: 2026-03-08
tags: ["optional", "tag", "list"]
---
```

The content collection schema is defined in `src/content.config.ts` using Zod.
Only modify this file when adding or changing frontmatter fields.

### Testing

- Smoke tests live in `tests/smoke.test.ts` and run via `npm test` (Vitest).
- Tests build the site in `beforeAll`, then verify `dist/` output.
- Checks include: page existence, expected content, navigation links, header/footer presence.
- When adding a new page, add its `dist/` path to the `pages` array in the test file.

### Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) runs three jobs
in sequence:

1. **test** — `npm ci` then `npm test` (build + smoke tests)
2. **build** — `npm ci` then `npm run build`, uploads `dist/` as artifact
3. **deploy** — deploys artifact to GitHub Pages

Tests gate deployment. A failing test blocks the build and deploy jobs.

## Extending the Site

| Task | Where | Notes |
|------|-------|-------|
| Add a page | `src/pages/*.astro` | Import and use `BaseLayout` |
| Add a component | `src/components/*.astro` | Scoped styles, use design tokens |
| Add an article | `src/content/articles/*.md` | Include required frontmatter |
| Add a content collection | `src/content.config.ts` + `src/content/<name>/` | Create a dynamic route in `src/pages/` |
| Add a global style | `src/styles/global.css` | Use design tokens |
| Add a static asset | `public/` | Copied to `dist/` root at build time |
| Add a smoke test | `tests/smoke.test.ts` | Add path to `pages` array, add assertions |
