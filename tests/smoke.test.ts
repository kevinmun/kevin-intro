import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { describe, it, expect, beforeAll } from 'vitest';

const pages = [
  'dist/index.html',
  'dist/articles/index.html',
  'dist/articles/hello-world/index.html',
];

beforeAll(() => {
  // Run astro build in a clean env so vitest's Vite context doesn't override BASE_URL
  execSync('npx astro build', {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' },
  });
});

describe('build output', () => {
  it('produces a dist/ directory', () => {
    expect(existsSync('dist')).toBe(true);
  });

  it('generates the index page with expected sections', () => {
    const html = readFileSync('dist/index.html', 'utf-8');
    expect(html).toContain('</html>');
    expect(html).toContain('Kevin Mun');
    expect(html).toContain('About');
    expect(html).toContain('Recent Articles');
  });

  it('generates the articles listing page', () => {
    const path = 'dist/articles/index.html';
    expect(existsSync(path)).toBe(true);
    const html = readFileSync(path, 'utf-8');
    expect(html).toContain('Articles');
  });

  it('generates the sample article page', () => {
    const path = 'dist/articles/hello-world/index.html';
    expect(existsSync(path)).toBe(true);
    const html = readFileSync(path, 'utf-8');
    expect(html).toContain('Hello World');
  });

  it('includes navigation on every page', () => {
    for (const page of pages) {
      const html = readFileSync(page, 'utf-8');
      expect(html).toContain('>Home</a>');
      expect(html).toContain('>Articles</a>');
    }
  });

  it('includes header and footer on every page', () => {
    for (const page of pages) {
      const html = readFileSync(page, 'utf-8');
      expect(html).toContain('<header');
      expect(html).toContain('<footer');
    }
  });
});
