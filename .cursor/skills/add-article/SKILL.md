---
name: add-article
description: Add a new article to the portfolio site. Use when the user wants to create, write, publish, or add a new article, blog post, or write-up to the site.
---

# Add Article

## Steps

1. **Create the file** at `src/content/articles/<slug>.md` where `<slug>` is a URL-friendly name (lowercase, hyphens, no spaces).

2. **Add required frontmatter** at the top of the file:

```markdown
---
title: "Your Article Title"
description: "A one-sentence summary for listings and meta tags."
date: 2026-03-08
tags: ["optional", "tag", "list"]
---

Your content starts here.
```

3. **Write content** in standard Markdown below the frontmatter. Raw HTML is also supported inline.

4. **Update smoke tests** in `tests/smoke.test.ts`:
   - Add `'dist/articles/<slug>/index.html'` to the `pages` array
   - Optionally add an assertion checking for the article title in the built output

5. **Verify** by running `npm test` -- this builds the site and checks all pages.

## Frontmatter Schema

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | Yes | Displayed as heading and in article cards |
| `description` | string | Yes | Shown in listings and `<meta>` description |
| `date` | date (YYYY-MM-DD) | Yes | Used for sorting (newest first) |
| `tags` | string[] | No | Rendered as badges on cards and article pages |

The schema is enforced by Zod in `src/content.config.ts`. Build will fail if required fields are missing.

## Example

File: `src/content/articles/building-ci-pipelines.md`

```markdown
---
title: "Building CI Pipelines from Scratch"
description: "A walkthrough of setting up CI/CD for mobile apps using Bitrise and GitHub Actions."
date: 2026-03-10
tags: ["ci-cd", "mobile", "devops"]
---

# Building CI Pipelines from Scratch

Setting up continuous integration doesn't have to be complicated...
```

## How It Works

- Astro content collections auto-discover `.md` files in `src/content/articles/`
- No config changes needed -- just add the file
- The dynamic route at `src/pages/articles/[...slug].astro` generates a page per article
- The articles listing at `src/pages/articles/index.astro` shows all articles sorted by date
- The main page shows the 3 most recent articles

## Deployment

Push to `main` and GitHub Actions will automatically build and deploy. The smoke tests run first -- if anything is broken, the deploy is blocked.
