import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { contacts, projects } from '../js/projects.js';

const expectedTitle = 'Jayrald Tajanlangit — Full-stack and mobile engineer';
const expectedDescription =
  'Portfolio of Jayrald Tajanlangit, a full-stack and mobile engineer building reliable web, mobile, data, and AI-enabled products.';
const rendererUrl = new URL('../scripts/render-site.mjs', import.meta.url);
const rendererExists = existsSync(rendererUrl);
const renderer = rendererExists ? await import(rendererUrl.href) : null;
const committedHtml = readFileSync(
  fileURLToPath(new URL('../index.html', import.meta.url)),
  'utf8',
);
const globalCss = readFileSync(
  fileURLToPath(new URL('../css/global.css', import.meta.url)),
  'utf8',
);
const homeCss = readFileSync(
  fileURLToPath(new URL('../css/home.css', import.meta.url)),
  'utf8',
);
const renderedHtml = renderer?.renderHomePage?.() ?? committedHtml;

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function countMatches(value, pattern) {
  return [...value.matchAll(pattern)].length;
}

function assertMetadata(html) {
  assert.equal(countMatches(html, /<title>/gi), 1);
  assert.match(html, new RegExp(`<title>${escapeRegExp(expectedTitle)}</title>`));

  assert.equal(countMatches(html, /<meta\s+name="description"/gi), 1);
  assert.match(
    html,
    new RegExp(`<meta\\s+name="description"\\s+content="${escapeRegExp(expectedDescription)}"`),
  );

  for (const [property, content] of [
    ['og:title', expectedTitle],
    ['og:description', expectedDescription],
    ['og:type', 'website'],
  ]) {
    assert.equal(
      countMatches(html, new RegExp(`<meta\\s+property="${property}"`, 'gi')),
      1,
      property,
    );
    assert.match(
      html,
      new RegExp(
        `<meta\\s+property="${property}"\\s+content="${escapeRegExp(content)}"`,
        'i',
      ),
    );
  }
}

test('exports a homepage renderer and commits its exact output', () => {
  assert.equal(rendererExists, true, 'scripts/render-site.mjs must exist');
  assert.equal(typeof renderer?.renderHomePage, 'function');
  assert.equal(committedHtml, renderedHtml);
});

test('renders unique recruiter-facing metadata and one primary heading', () => {
  assertMetadata(renderedHtml);
  assert.equal(countMatches(renderedHtml, /<h1(?:\s|>)/gi), 1);
  assert.match(renderedHtml, /Full-stack and mobile engineer/i);
});

test('renders semantic navigation and the approved homepage landmarks', () => {
  assert.match(renderedHtml, /<a\s+class="skip-link"\s+href="#main">/i);
  assert.match(renderedHtml, /<header\s+class="site-header"/i);
  assert.match(renderedHtml, /<nav\s+aria-label="Primary"/i);
  assert.match(renderedHtml, /<main\s+id="main"/i);
  assert.match(renderedHtml, /<footer\s+class="site-footer"/i);

  for (const [id, heading] of [
    ['work', 'Selected Work'],
    ['capabilities', 'Capabilities'],
    ['about', 'About'],
    ['contact', 'Contact'],
  ]) {
    assert.match(
      renderedHtml,
      new RegExp(`<section[^>]+id="${id}"[\\s\\S]*?<h2[^>]*>${heading}</h2>`, 'i'),
      `${heading} landmark`,
    );
  }
});

test('resets native figure margins so the 375px layout stays within the viewport', () => {
  assert.match(globalCss, /figure\s*\{[^}]*margin:\s*0\s*;/s);
});

test('keeps project titles and mobile navigation at least 44 by 44 pixels', () => {
  assert.match(
    homeCss,
    /\.project-title-link\s*\{[^}]*min-inline-size:\s*44px\s*;[^}]*min-block-size:\s*44px\s*;/s,
  );
  assert.match(
    globalCss,
    /@media \(max-width: 47\.99rem\)[\s\S]*?\.primary-nav a\s*\{[^}]*min-inline-size:\s*44px\s*;[^}]*min-block-size:\s*44px\s*;/,
  );
});

test('renders all five project titles and case-study links in approved order', () => {
  let previousIndex = -1;

  for (const project of projects) {
    const href = `projects/${project.slug}.html`;
    const linkPattern = new RegExp(
      `<a[^>]+href="${escapeRegExp(href)}"[^>]*>[\\s\\S]*?${escapeRegExp(project.title)}[\\s\\S]*?</a>`,
      'i',
    );
    const match = renderedHtml.match(linkPattern);

    assert.ok(match, `${project.title} case-study link`);
    assert.ok(match.index > previousIndex, `${project.title} order`);
    previousIndex = match.index;
    assert.ok(renderedHtml.includes(project.summary), `${project.title} static summary`);
  }
});

test('renders factual project dossier fields without fabricated media', () => {
  for (const project of projects) {
    for (const fact of [project.role, project.challenge, project.repositoryStatus]) {
      assert.ok(renderedHtml.includes(fact), `${project.title}: ${fact}`);
    }

    for (const technology of project.technologies) {
      assert.ok(renderedHtml.includes(technology), `${project.title}: ${technology}`);
    }
  }

  assert.doesNotMatch(renderedHtml, /assets\/(?:images\/projects|videos)\//i);
  assert.match(renderedHtml, /Project media pending documented capture/i);
});

test('renders verified contact actions and meaningful portrait text', () => {
  for (const url of [
    `mailto:${contacts.email}`,
    contacts.github,
    contacts.linkedin,
  ]) {
    assert.ok(renderedHtml.includes(`href="${url}"`), url);
  }

  assert.match(
    renderedHtml,
    /<img[^>]+src="assets\/pp\/583917390_25203520672616248_2951040891851883210_n\.jpg"[^>]+alt="Portrait of Jayrald Tajanlangit"[^>]+width="864"[^>]+height="852"/i,
  );
});

test('omits unsupported legacy content and inert actions', () => {
  for (const excluded of [
    'BookSphere',
    'RideGauge',
    'Automated Video Captioning',
    'Balayan',
    'PlantDito',
    '12+ Products',
    '4 Teams Led',
    '98% Success',
    'Writing',
    'Timeline',
    'glitch',
  ]) {
    assert.equal(
      renderedHtml.toLocaleLowerCase().includes(excluded.toLocaleLowerCase()),
      false,
      excluded,
    );
  }

  assert.doesNotMatch(renderedHtml, /href\s*=\s*["']#["']/i);
  assert.doesNotMatch(renderedHtml, /<(?:button|a)[^>]*>\s*(?:Read|View)\s*(?:→|&rarr;)?\s*<\//i);
});
