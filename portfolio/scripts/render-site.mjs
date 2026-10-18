import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { contacts, projects, site } from '../js/projects.js';
import { escapeHtml, renderAttrs } from './render-utils.mjs';

const pageTitle = `${site.name} — ${site.positioning}`;
const pageDescription =
  'Portfolio of Jayrald Tajanlangit, a full-stack and mobile engineer building reliable web, mobile, data, and AI-enabled products.';

function projectPlatform(project) {
  if (project.platform) return project.platform;

  if (project.technologies.includes('Flutter') || project.technologies.includes('Mobile application')) {
    return 'Mobile application';
  }

  return 'Web application';
}

function renderProjectMedia(project, pathPrefix = '') {
  const mediaId = `media-${project.slug}`;
  const captionId = `${mediaId}-caption`;
  const [fallbackStill] = project.media.stills;

  return `<figure class="project-media project-media--${escapeHtml(project.media.orientation)}" data-project-media>
              <div class="project-media-stage"${renderAttrs({
                id: mediaId,
                style: `--media-aspect: ${project.media.aspect}`,
              })}>
                <video data-project-video muted loop playsinline preload="metadata"${renderAttrs({
                  poster: `${pathPrefix}${project.media.poster}`,
                  width: project.media.width,
                  height: project.media.height,
                  'aria-describedby': captionId,
                })}>
                  <source${renderAttrs({ src: `${pathPrefix}${project.media.video}`, type: 'video/webm' })}>
                </video>
                <img class="project-media-fallback" data-media-fallback${renderAttrs({
                  src: `${pathPrefix}${fallbackStill.src}`,
                  alt: fallbackStill.alt,
                  width: project.media.width,
                  height: project.media.height,
                  loading: 'lazy',
                  hidden: true,
                })}>
                <span class="project-media-label">${escapeHtml(project.media.label)}</span>
              </div>
              <button class="media-toggle" type="button" data-media-toggle aria-expanded="false"${renderAttrs({
                'aria-controls': mediaId,
                'data-open-label': 'Open media',
                'data-close-label': 'Close media',
                hidden: true,
              })}>Open media</button>
              <figcaption${renderAttrs({ id: captionId })}>${escapeHtml(project.media.caption)}</figcaption>
            </figure>`;
}

function renderProject(project, index) {
  const chapter = String(index + 1).padStart(2, '0');
  const caseStudyHref = `projects/${project.slug}.html`;
  const sourceAction = project.sourceUrl
    ? `<a class="text-link project-source"${renderAttrs({ href: project.sourceUrl })}>View source repository</a>`
    : '<span class="project-source project-source--unavailable">Source repository not public</span>';

  return `
        <article class="project-chapter" data-reveal-project${renderAttrs({ id: `project-${project.slug}` })}>
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
        <p class="eyebrow" data-intro-reveal="eyebrow">Portfolio / ${escapeHtml(site.location)}</p>
        <h1 id="hero-title" data-intro-reveal="headline"><span>Full-stack and mobile</span> engineer.</h1>
        <p class="hero-intro" data-intro-reveal="intro">I build web and mobile products from interface to data layer, with practical AI integration where it serves the workflow.</p>
        <div class="hero-notes" aria-label="Professional focus">
          <p><span>Focus</span> Product engineering across frontend, backend, and mobile.</p>
          <p><span>Availability</span> Open to full-stack and mobile engineering opportunities.</p>
        </div>
        <a class="button-link" href="#work">Review selected work <span aria-hidden="true">↓</span></a>
      </div>

      <figure class="portrait" data-intro-reveal="portrait">
        <img src="assets/pp/583917390_25203520672616248_2951040891851883210_n.jpg" alt="Portrait of Jayrald Tajanlangit" width="864" height="852">
        <figcaption>
          <span>Jayrald Tajanlangit</span>
          <span>Full-stack / mobile</span>
        </figcaption>
      </figure>
    </section>

    <section class="work-section shell" id="work" aria-labelledby="work-title">
      <header class="section-heading section-heading--wide" data-reveal-group>
        <p class="eyebrow">Selected record / 2026</p>
        <h2 id="work-title">Selected Work</h2>
        <p>Five products spanning full-stack web systems, mobile collaboration, realtime data, and carefully scoped AI features.</p>
      </header>
${projectChapters}
    </section>

    <section class="capabilities-section" id="capabilities" aria-labelledby="capabilities-title">
      <div class="shell capabilities-layout" data-reveal-group>
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

    <section class="about-section shell" id="about" aria-labelledby="about-title" data-reveal-group>
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
      <div class="shell contact-layout" data-reveal-group>
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

function renderSystemFlow(project) {
  return project.systemFlow
    .map(
      ([label, detail], index) => `<li>
                <span class="system-flow-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>${escapeHtml(label)}</h3>
                  <p>${escapeHtml(detail)}</p>
                </div>
              </li>`,
    )
    .join('\n');
}

function renderDecisionLedger(project) {
  return project.decisionLedger
    .map(
      ({ decision, why, tradeoff }) => `<tr>
                  <th scope="row">${escapeHtml(decision)}</th>
                  <td data-label="Why">${escapeHtml(why)}</td>
                  <td data-label="Tradeoff">${escapeHtml(tradeoff)}</td>
                </tr>`,
    )
    .join('\n');
}

function renderWorkflow(project) {
  return project.media.stills
    .map(
      (still, index) => {
        const step = project.workflow[index] ?? still.caption;
        return `<li class="workflow-entry">
                <div class="workflow-copy">
                  <p class="workflow-index">${String(index + 1).padStart(2, '0')} / ${String(project.media.stills.length).padStart(2, '0')}</p>
                  <h3>${escapeHtml(step)}</h3>
                </div>
                <figure class="workflow-media" data-capture-state="available">
                  <div class="workflow-media-stage">
                    <img${renderAttrs({
                      src: `../${still.src}`,
                      alt: still.alt,
                      width: project.media.width,
                      height: project.media.height,
                      loading: 'lazy',
                    })}>
                  </div>
                  <figcaption>${escapeHtml(still.caption)}</figcaption>
                </figure>
              </li>`;
      },
    )
    .join('\n');
}

function renderStackIndex(project) {
  return `<dl class="stack-index">
              <div>
                <dt>Product surface</dt>
                <dd>${escapeHtml(project.platform)}</dd>
              </div>
              <div>
                <dt>Implementation</dt>
                <dd>${project.technologies.map(escapeHtml).join(' · ')}</dd>
              </div>
            </dl>`;
}

export function renderCaseStudy(project, nextProject) {
  if (!project || !nextProject) {
    throw new TypeError('renderCaseStudy requires a project and nextProject');
  }

  const title = `${project.title} — Case study — ${site.name}`;
  const source = project.sourceUrl
    ? `<a class="button-link" href="${escapeHtml(project.sourceUrl)}">Open source repository <span aria-hidden="true">↗</span></a>`
    : '<p class="repository-private">No public source link is available for this project.</p>';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(project.summary)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(project.summary)}">
  <meta property="og:type" content="article">
  <meta name="theme-color" content="#F3EFE7">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&amp;family=IBM+Plex+Sans:wght@400;500;600&amp;family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/tokens.css">
  <link rel="stylesheet" href="../css/global.css">
  <link rel="stylesheet" href="../css/case-study.css">
</head>
<body class="case-page case-page--${escapeHtml(project.slug)}">
  <a class="skip-link" href="#main">Skip to main content</a>

  <header class="site-header" id="top">
    <div class="shell site-header-inner">
      <a class="site-name" href="../index.html" aria-label="${escapeHtml(site.name)}, home">
        <span class="site-monogram" aria-hidden="true">JT</span>
        <span>${escapeHtml(site.name)}</span>
      </a>
      <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="primary-navigation" hidden>Menu</button>
      <nav aria-label="Primary" id="primary-navigation" class="primary-nav">
        <a href="../index.html#work">Work</a>
        <a href="../index.html#about">About</a>
        <a href="../index.html#contact">Contact</a>
        <a href="${escapeHtml(contacts.github)}">GitHub</a>
        <a href="${escapeHtml(contacts.linkedin)}">LinkedIn</a>
      </nav>
    </div>
  </header>

  <main id="main">
    <article class="case-study">
      <header class="case-hero shell">
        <a class="case-back" href="../index.html#project-${escapeHtml(project.slug)}"><span aria-hidden="true">←</span> Back to selected work</a>
        <div class="case-title-block" data-intro-reveal="headline">
          <p class="eyebrow">Project folio / ${escapeHtml(project.folio)}</p>
          <h1>${escapeHtml(project.title)}</h1>
          <p class="case-deck"><span>Purpose</span>${escapeHtml(project.summary)}</p>
        </div>
        <dl class="case-dossier" aria-label="Project dossier" data-intro-reveal="intro">
          <div><dt>Role</dt><dd>${escapeHtml(project.role)}</dd></div>
          <div><dt>Platform</dt><dd>${escapeHtml(project.platform)}</dd></div>
          <div><dt>Ownership</dt><dd>${escapeHtml(project.ownership)}</dd></div>
          <div><dt>Stack</dt><dd>${project.technologies.map(escapeHtml).join(' · ')}</dd></div>
        </dl>
        <div class="case-lead-media" data-intro-reveal="portrait">
          ${renderProjectMedia(project, '../')}
        </div>
      </header>

      <section class="case-section case-section--problem shell" aria-labelledby="problem-title" data-reveal-group>
        <header class="case-section-heading">
          <p class="case-section-number">01</p>
          <h2 id="problem-title">Problem</h2>
        </header>
        <div class="case-prose">
          <p class="case-lede">${escapeHtml(project.challenge)}</p>
          <p>${escapeHtml(project.architecture)}</p>
        </div>
      </section>

      <section class="case-section shell" aria-labelledby="contribution-title" data-reveal-group>
        <header class="case-section-heading">
          <p class="case-section-number">02</p>
          <h2 id="contribution-title">My contribution</h2>
        </header>
        <div class="case-prose contribution-note">
          <p class="case-lede">${escapeHtml(project.contribution)}</p>
          <p><strong>Ownership boundary.</strong> ${escapeHtml(project.ownership)}</p>
        </div>
      </section>

      <section class="case-section case-section--system" aria-labelledby="system-title" data-reveal-group>
        <div class="shell">
          <header class="case-section-heading">
            <p class="case-section-number">03</p>
            <h2 id="system-title">System view</h2>
          </header>
          <ol class="system-flow">
${renderSystemFlow(project)}
          </ol>
        </div>
      </section>

      <section class="case-section shell" aria-labelledby="decisions-title" data-reveal-group>
        <header class="case-section-heading">
          <p class="case-section-number">04</p>
          <h2 id="decisions-title">Decision ledger</h2>
        </header>
        <div class="decision-table-wrap">
          <table class="decision-ledger">
            <thead><tr><th>Decision</th><th>Why</th><th>Tradeoff</th></tr></thead>
            <tbody>
${renderDecisionLedger(project)}
            </tbody>
          </table>
        </div>
      </section>

      <section class="case-section case-section--workflow shell" aria-labelledby="workflow-title" data-reveal-group>
        <header class="case-section-heading">
          <p class="case-section-number">05</p>
          <h2 id="workflow-title">Workflow record</h2>
        </header>
        <p class="capture-disclosure">${escapeHtml(project.media.disclosure)}</p>
        <ol class="workflow-list">
${renderWorkflow(project)}
        </ol>
      </section>

      <section class="case-section shell" aria-labelledby="stack-title" data-reveal-group>
        <header class="case-section-heading">
          <p class="case-section-number">06</p>
          <h2 id="stack-title">Stack index</h2>
        </header>
        ${renderStackIndex(project)}
      </section>

      <section class="case-section case-section--repository shell" aria-labelledby="repository-title" data-reveal-group>
        <header class="case-section-heading">
          <p class="case-section-number">07</p>
          <h2 id="repository-title">Repository disclosure</h2>
        </header>
        <div class="repository-copy">
          <p>${escapeHtml(project.repositoryDisclosure)}</p>
          ${source}
        </div>
      </section>

      <nav class="next-project" aria-label="Next case study">
        <a class="shell" href="${escapeHtml(nextProject.slug)}.html">
          <span class="eyebrow">Next project / ${escapeHtml(nextProject.folio)}</span>
          <strong>${escapeHtml(nextProject.title)}</strong>
          <span aria-hidden="true">→</span>
        </a>
      </nav>
    </article>
  </main>

  <footer class="site-footer">
    <div class="shell site-footer-inner">
      <p>© 2026 ${escapeHtml(site.name)}</p>
      <p>${escapeHtml(site.positioning)} · ${escapeHtml(site.location)}</p>
      <a href="#top">Back to top <span aria-hidden="true">↑</span></a>
    </div>
  </footer>
  <script type="module" src="../js/site.js"></script>
</body>
</html>
`;
}

const modulePath = fileURLToPath(import.meta.url);
const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';

if (modulePath === invokedPath) {
  await mkdir(new URL('../projects/', import.meta.url), { recursive: true });
  await writeFile(new URL('../index.html', import.meta.url), renderHomePage(), 'utf8');
  await Promise.all(
    projects.map((project, index) => {
      const nextProject = projects[(index + 1) % projects.length];
      return writeFile(
        new URL(`../projects/${project.slug}.html`, import.meta.url),
        renderCaseStudy(project, nextProject),
        'utf8',
      );
    }),
  );
}
