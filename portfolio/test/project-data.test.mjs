import assert from 'node:assert/strict';
import test from 'node:test';

import { contacts, getProject, projects, site } from '../js/projects.js';

const expectedSlugs = [
  'maistra',
  'skyfire',
  'bulk-buying-companion',
  'pulso',
  'sige',
];

const excludedClaims = [
  'BookSphere',
  'RideGauge',
  'Automated Video Captioning',
  'Balayan',
  'PlantDito',
];

test('publishes exactly the five approved projects in recruiter-facing order', () => {
  assert.deepEqual(
    projects.map(({ slug }) => slug),
    expectedSlugs,
  );
  assert.equal(new Set(projects.map(({ slug }) => slug)).size, projects.length);
});

test('exposes complete typed project records', () => {
  for (const project of projects) {
    for (const field of [
      'slug',
      'title',
      'summary',
      'role',
      'ownership',
      'repositoryStatus',
      'challenge',
      'contribution',
      'architecture',
    ]) {
      assert.equal(typeof project[field], 'string', `${project.slug}.${field}`);
      assert.notEqual(project[field].trim(), '', `${project.slug}.${field}`);
    }

    assert.ok(
      ['public', 'private', 'team'].includes(project.repositoryStatus),
      `${project.slug}.repositoryStatus`,
    );

    for (const field of ['technologies', 'decisions', 'workflow']) {
      assert.ok(Array.isArray(project[field]), `${project.slug}.${field}`);
      assert.ok(project[field].length > 0, `${project.slug}.${field}`);
      assert.ok(
        project[field].every((value) => typeof value === 'string' && value.trim()),
        `${project.slug}.${field} entries`,
      );
    }

    assert.equal(typeof project.media, 'object', `${project.slug}.media`);
    assert.equal(
      project.media.poster,
      `assets/images/projects/${project.slug}/poster.webp`,
    );
    assert.equal(project.media.video, `assets/videos/${project.slug}.webm`);
    assert.deepEqual(project.media.stills.slice(0, 2), [
      `assets/images/projects/${project.slug}/still-01.webp`,
      `assets/images/projects/${project.slug}/still-02.webp`,
    ]);
    assert.ok([2, 3].includes(project.media.stills.length));
  }
});

test('publishes only verified HTTPS source actions', () => {
  const expectedSources = new Map([
    [
      'maistra',
      'https://github.com/Francismarcnikko123/mAIstra/tree/judge0-integration',
    ],
    ['pulso', 'https://github.com/jayraldtajanlangit/Pulso'],
    ['sige', 'https://github.com/jayraldtajanlangit/sige'],
  ]);

  for (const project of projects) {
    if (expectedSources.has(project.slug)) {
      assert.equal(project.sourceUrl, expectedSources.get(project.slug));
      assert.match(project.sourceUrl, /^https:\/\//);
    } else {
      assert.equal(project.sourceUrl, null, `${project.slug} has no public source action`);
    }
  }

  assert.equal(getProject('maistra'), projects[0]);
  assert.equal(getProject('not-a-project'), undefined);
});

test('exports the approved contact and site identity details', () => {
  assert.deepEqual(contacts, {
    email: 'jayraldtajanlangit123@gmail.com',
    github: 'https://github.com/jayraldtajanlangit',
    linkedin: 'https://www.linkedin.com/in/jayrald-tajanlangit-b8646a280/',
  });

  assert.equal(site.name, 'Jayrald Tajanlangit');
  assert.equal(site.positioning, 'Full-stack and mobile engineer');
  assert.equal(typeof site.location, 'string');
  assert.notEqual(site.location.trim(), '');
});

test('omits excluded projects, invented metrics, and unsupported history', () => {
  const serialized = JSON.stringify({ projects, site });

  for (const claim of excludedClaims) {
    assert.doesNotMatch(serialized, new RegExp(claim, 'i'));
  }

  for (const project of projects) {
    for (const unsupportedField of ['metrics', 'statistics', 'history', 'timeline']) {
      assert.equal(unsupportedField in project, false, `${project.slug}.${unsupportedField}`);
    }
  }
});
