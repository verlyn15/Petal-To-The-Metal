import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { contacts, projects, site } from '../js/projects.js';
import { escapeHtml, renderAttrs } from './render-utils.mjs';

const pageTitle = `${site.name} — ${site.positioning}`;
const pageDescription =
  'Portfolio of Jayrald Tajanlangit, a full-stack and mobile engineer building reliable web, mobile, data, and AI-enabled products.';

function projectPlatform(project) {
  if (project.technologies.includes('Flutter') || project.technologies.includes('Mobile application')) {
    return 'Mobile application';
  }

  return 'Web application';
}

function renderProjectMedia(project) {
  const mediaId = `media-${project.slug}`;
  const captionId = `${mediaId}-caption`;

  return `<figure class="project-media project-media--pending" data-project-media>
              <div class="project-media-stage"${renderAttrs({ id: mediaId })}>
                <video data-project-video muted loop playsinline preload="metadata"${renderAttrs({
                  poster: project.media.poster,
                  width: 1280,
                  height: 720,
                  'aria-describedby': captionId,
                })}>
                  <source${renderAttrs({ src: project.media.video, type: 'video/webm' })}>
                </video>
                <img class="project-media-fallback" data-media-fallback${renderAttrs({
                  src: project.media.stills[0],
                  alt: `Still preview of ${project.title}`,
                  width: 1280,
                  height: 720,
                  loading: 'lazy',
                  hidden: true,
                })}>
                <div class="project-media-pending" role="img"${renderAttrs({
                  'aria-label': `${project.title} project media capture pending`,
                })}>
                  <span>${escapeHtml(project.title)}</span>
                  <strong>Project media capture pending</strong>
                </div>
              </div>
              <button class="media-toggle" type="button" data-media-toggle aria-expanded="false"${renderAttrs({
                'aria-controls': mediaId,
                'data-open-label': 'Open media',
                'data-close-label': 'Close media',
                hidden: true,
              })}>Open media</button>
              <figcaption${renderAttrs({ id: captionId })}>Project media preview — documented capture pending.</figcaption>
            </figure>`;
}

function renderProject(project, index) {
  const chapter = String(index + 1).padStart(2, '0');
  const caseStudyHref = `projects/${project.slug}.html`;
  const sourceAction = project.sourceUrl
    ? `<a class="text-link project-source"${renderAttrs({ href: project.sourceUrl })}>View source repository</a>`
    : '<span class="project-source project-source--unavailable">Source repository not public</span>';

  return `
        <article class="project-chapter"${renderAttrs({ id: `project-${project.slug}` })}>
          <header class="project-heading">
            <p class="project-number" aria-hidden="true">${chapter}</p>
            <div>
              <p class="eyebrow">Project ${chapter}</p>
              <h3>
                <a class="project-title-link"${renderAttrs({ href: caseStudyHref })}>
                  ${escapeHtml(project.title)}<span aria-hidden="true"> ↗</span>
                </a>
              </h3>
              <p class="project-summary">${escapeHtml(project.summary)}</p>
            </div>
          </header>

          <div class="project-layout">
            ${renderProjectMedia(project)}

            <div class="project-record">
              <dl class="dossier" aria-label="Project dossier">
                <div class="dossier-row">
                  <dt>Role</dt>
                  <dd>${escapeHtml(project.role)}</dd>
                </div>
                <div class="dossier-row">
                  <dt>Platform</dt>
                  <dd>${projectPlatform(project)}</dd>
                </div>
                <div class="dossier-row dossier-row--stack">
                  <dt>Stack</dt>
                  <dd>${project.technologies.map(escapeHtml).join(' · ')}</dd>
                </div>
                <div class="dossier-row dossier-row--challenge">
                  <dt>Technical challenge</dt>
                  <dd>${escapeHtml(project.challenge)}</dd>
                </div>
                <div class="dossier-row">
                  <dt>Repository status</dt>
                  <dd class="repository-status">${escapeHtml(project.repositoryStatus)}</dd>
                </div>
              </dl>
              <div class="project-actions">
                <a class="button-link"${renderAttrs({ href: caseStudyHref })}>Open case study <span aria-hidden="true">→</span></a>
                ${sourceAction}
              </div>
            </div>
          </div>
        </article>`;
}

export function renderHomePage() {
  const projectChapters = projects.map(renderProject).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(pageDescription)}">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(pageDescription)}">
  <meta property="og:type" content="website">
  <meta name="theme-color" content="#F3EFE7">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&amp;family=IBM+Plex+Sans:wght@400;500;600&amp;family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/global.css">
  <link rel="stylesheet" href="css/home.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to main content</a>

  <header class="site-header" id="top">
    <div class="shell site-header-inner">
      <a class="site-name" href="index.html" aria-label="${escapeHtml(site.name)}, home">
        <span class="site-monogram" aria-hidden="true">JT</span>
        <span>${escapeHtml(site.name)}</span>
      </a>
      <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="primary-navigation" hidden>Menu</button>
      <nav aria-label="Primary" id="primary-navigation" class="primary-nav">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <a href="${escapeHtml(contacts.github)}">GitHub</a>
        <a href="${escapeHtml(contacts.linkedin)}">LinkedIn</a>
      </nav>
    </div>
  </header>

  <main id="main">
    <section class="hero shell" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow">Portfolio / ${escapeHtml(site.location)}</p>
        <h1 id="hero-title"><span>Full-stack and mobile</span> engineer.</h1>
        <p class="hero-intro">I build web and mobile products from interface to data layer, with practical AI integration where it serves the workflow.</p>
        <div class="hero-notes" aria-label="Professional focus">
          <p><span>Focus</span> Product engineering across frontend, backend, and mobile.</p>
          <p><span>Availability</span> Open to full-stack and mobile engineering opportunities.</p>
        </div>
        <a class="button-link" href="#work">Review selected work <span aria-hidden="true">↓</span></a>
      </div>

      <figure class="portrait">
        <img src="assets/pp/583917390_25203520672616248_2951040891851883210_n.jpg" alt="Portrait of Jayrald Tajanlangit" width="864" height="852">
        <figcaption>
          <span>Jayrald Tajanlangit</span>
          <span>Full-stack / mobile</span>
        </figcaption>
      </figure>
    </section>

    <section class="work-section shell" id="work" aria-labelledby="work-title">
      <header class="section-heading section-heading--wide">
        <p class="eyebrow">Selected record / 2026</p>
        <h2 id="work-title">Selected Work</h2>
        <p>Five products spanning full-stack web systems, mobile collaboration, realtime data, and carefully scoped AI features.</p>
      </header>
${projectChapters}
    </section>

    <section class="capabilities-section" id="capabilities" aria-labelledby="capabilities-title">
      <div class="shell capabilities-layout">
        <header class="section-heading">
          <p class="eyebrow">Working range</p>
          <h2 id="capabilities-title">Capabilities</h2>
        </header>
        <ol class="capability-list">
          <li>
            <span>01</span>
            <div><h3>Full-stack web</h3><p>Interface architecture, application workflows, REST services, and transactional backend behavior.</p></div>
          </li>
          <li>
            <span>02</span>
            <div><h3>Mobile development</h3><p>Flutter product foundations, state management, authentication, device features, and mobile-first interaction.</p></div>
          </li>
          <li>
            <span>03</span>
            <div><h3>Backend and data</h3><p>Supabase, Django, relational data, realtime updates, and coherent state across multi-step workflows.</p></div>
          </li>
          <li>
            <span>04</span>
            <div><h3>AI integration</h3><p>Service-backed code execution, on-device recognition, and conversational product features with clear boundaries.</p></div>
          </li>
        </ol>
      </div>
    </section>

    <section class="about-section shell" id="about" aria-labelledby="about-title">
      <header class="section-heading">
        <p class="eyebrow">Profile</p>
        <h2 id="about-title">About</h2>
      </header>
      <div class="about-copy">
        <p class="about-lede">I work across the seams of a product: the interface people use, the state that keeps it dependable, and the services that make it useful.</p>
        <p>My projects include instructor review tools, reservation systems, realtime mobile communities, collaborative buying workflows, and an accountability coach. I document individual ownership clearly when the work was built with a team.</p>
      </div>
    </section>

    <section class="contact-section" id="contact" aria-labelledby="contact-title">
      <div class="shell contact-layout">
        <header class="section-heading">
          <p class="eyebrow">Start a conversation</p>
          <h2 id="contact-title">Contact</h2>
        </header>
        <div class="contact-copy">
          <p>For full-stack, mobile, or product engineering opportunities, email me directly or review the code behind the public work.</p>
          <ul class="contact-list">
            <li><span>Email</span><a href="mailto:${escapeHtml(contacts.email)}">${escapeHtml(contacts.email)}</a></li>
            <li><span>GitHub</span><a href="${escapeHtml(contacts.github)}">github.com/jayraldtajanlangit</a></li>
            <li><span>LinkedIn</span><a href="${escapeHtml(contacts.linkedin)}">Jayrald Tajanlangit</a></li>
          </ul>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="shell site-footer-inner">
      <p>© 2026 ${escapeHtml(site.name)}</p>
      <p>${escapeHtml(site.positioning)} · ${escapeHtml(site.location)}</p>
      <a href="#top">Back to top <span aria-hidden="true">↑</span></a>
    </div>
  </footer>
  <script type="module" src="js/site.js"></script>
</body>
</html>
`;
}

const modulePath = fileURLToPath(import.meta.url);
const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';

if (modulePath === invokedPath) {
  await writeFile(new URL('../index.html', import.meta.url), renderHomePage(), 'utf8');
}
