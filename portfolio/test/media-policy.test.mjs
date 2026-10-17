import assert from 'node:assert/strict';
import test from 'node:test';

import {
  applyMediaAction,
  decideMediaAction,
  initProjectMedia,
} from '../js/media.js';
import { projects } from '../js/projects.js';
import { initNavigation } from '../js/site.js';
import { renderHomePage } from '../scripts/render-site.mjs';

class FakeEventTarget {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? new Set();
    listeners.add(listener);
    this.listeners.set(type, listeners);
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }

  dispatch(type, event = {}) {
    for (const listener of this.listeners.get(type) ?? []) {
      listener({ type, target: this, ...event });
    }
  }
}

class FakeClassList {
  constructor(...values) {
    this.values = new Set(values);
  }

  add(...values) {
    values.forEach((value) => this.values.add(value));
  }

  remove(...values) {
    values.forEach((value) => this.values.delete(value));
  }

  contains(value) {
    return this.values.has(value);
  }

  toggle(value, force) {
    const next = force ?? !this.contains(value);
    next ? this.add(value) : this.remove(value);
    return next;
  }
}

class FakeElement extends FakeEventTarget {
  constructor() {
    super();
    this.attributes = new Map();
    this.classList = new FakeClassList();
    this.dataset = {};
    this.hidden = false;
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  removeAttribute(name) {
    this.attributes.delete(name);
  }
}

class FakeIntersectionObserver {
  static instances = [];

  constructor(callback) {
    this.callback = callback;
    this.observed = new Set();
    this.disconnectCalls = 0;
    FakeIntersectionObserver.instances.push(this);
  }

  observe(target) {
    this.observed.add(target);
  }

  disconnect() {
    this.disconnectCalls += 1;
    this.observed.clear();
  }

  emit(target, isIntersecting) {
    this.callback([{ target, isIntersecting }]);
  }
}

class FakeMediaQuery extends FakeEventTarget {
  constructor(matches = false) {
    super();
    this.matches = matches;
  }

  addListener(listener) {
    this.addEventListener('change', listener);
  }

  removeListener(listener) {
    this.removeEventListener('change', listener);
  }
}

function createMediaFixture({ play = () => Promise.resolve(), reducedMotion = false } = {}) {
  FakeIntersectionObserver.instances = [];

  const documentRoot = new FakeEventTarget();
  documentRoot.visibilityState = 'visible';
  documentRoot.documentElement = { classList: new FakeClassList() };

  const frame = new FakeElement();
  frame.dataset.projectMedia = '';
  frame.ownerDocument = documentRoot;

  const toggle = new FakeElement();
  toggle.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.dataset.openLabel = 'Open media';
  toggle.dataset.closeLabel = 'Close media';
  toggle.textContent = 'Open media';
  toggle.focusCalls = 0;
  toggle.focus = () => {
    toggle.focusCalls += 1;
  };

  const fallback = new FakeElement();
  fallback.hidden = true;

  const video = new FakeElement();
  video.muted = false;
  video.controls = false;
  video.currentTime = 7;
  video.pauseCalls = 0;
  video.playCalls = 0;
  video.pause = () => {
    video.pauseCalls += 1;
  };
  video.play = () => {
    video.playCalls += 1;
    return play();
  };
  video.closest = () => frame;

  frame.querySelector = (selector) => {
    if (selector === '[data-project-video]') return video;
    if (selector === '[data-media-toggle]') return toggle;
    if (selector === '[data-media-fallback]') return fallback;
    return null;
  };

  const root = documentRoot;
  root.ownerDocument = documentRoot;
  root.querySelectorAll = (selector) =>
    selector === '[data-project-media]' ? [frame] : [];

  const mediaQuery = new FakeMediaQuery(reducedMotion);
  const teardown = () => initProjectMedia(root, {
    IntersectionObserver: FakeIntersectionObserver,
    matchMedia: () => mediaQuery,
  });

  return {
    documentRoot,
    fallback,
    frame,
    mediaQuery,
    root,
    start: teardown,
    toggle,
    video,
  };
}

function openAndIntersect(fixture) {
  fixture.toggle.dispatch('click');
  const observer = FakeIntersectionObserver.instances.at(-1);
  observer.emit(fixture.frame, true);
  return observer;
}

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
}

test('media policy plays only an eligible visible preview', () => {
  assert.equal(
    decideMediaAction({
      reducedMotion: false,
      intersecting: true,
      documentVisible: true,
      failed: false,
    }),
    'play',
  );
});

test('media policy pauses offscreen and hidden-document previews', () => {
  const baseline = {
    reducedMotion: false,
    documentVisible: true,
    failed: false,
  };

  assert.equal(decideMediaAction({ ...baseline, intersecting: false }), 'pause');
  assert.equal(
    decideMediaAction({
      ...baseline,
      intersecting: true,
      documentVisible: false,
    }),
    'pause',
  );
});

test('media policy never autoplays when reduced motion is requested', () => {
  assert.equal(
    decideMediaAction({
      reducedMotion: true,
      intersecting: true,
      documentVisible: true,
      failed: false,
    }),
    'pause',
  );
});

test('reduced-motion manual playback pauses offscreen and does not auto-resume', async () => {
  const fixture = createMediaFixture({ reducedMotion: true });
  const teardown = fixture.start();
  const observer = openAndIntersect(fixture);
  await flushPromises();

  assert.equal(fixture.video.playCalls, 0);

  fixture.video.dispatch('play');
  observer.emit(fixture.frame, true);
  assert.equal(fixture.video.pauseCalls, 0);

  observer.emit(fixture.frame, false);
  assert.equal(fixture.video.pauseCalls, 1);

  observer.emit(fixture.frame, true);
  await flushPromises();
  assert.equal(fixture.video.playCalls, 0);
  teardown();
});

test('eligible opened media is muted before playback and pauses offscreen', async () => {
  const fixture = createMediaFixture();
  const teardown = fixture.start();
  const observer = openAndIntersect(fixture);
  await flushPromises();

  assert.equal(fixture.toggle.hidden, false);
  assert.equal(fixture.video.muted, true);
  assert.equal(fixture.video.playCalls, 1);
  assert.equal(fixture.video.controls, true);

  observer.emit(fixture.frame, false);
  assert.equal(fixture.video.pauseCalls, 1);
  teardown();
});

test('hidden documents pause an opened preview', async () => {
  const fixture = createMediaFixture();
  const teardown = fixture.start();
  openAndIntersect(fixture);
  await flushPromises();

  fixture.documentRoot.visibilityState = 'hidden';
  fixture.documentRoot.dispatch('visibilitychange');

  assert.equal(fixture.video.pauseCalls, 1);
  teardown();
});

test('rejected play promises produce a visible fallback without rejecting', async () => {
  const fixture = createMediaFixture({
    play: () => Promise.reject(new Error('playback blocked')),
  });

  const result = await applyMediaAction(fixture.video, 'play');

  assert.equal(result, 'fallback');
  assert.equal(fixture.frame.classList.contains('project-media--fallback'), true);
  assert.equal(fixture.fallback.hidden, false);
  assert.equal(fixture.video.dataset.mediaFailed, 'true');
});

test('media errors produce fallback content and stop playback', async () => {
  const fixture = createMediaFixture();
  const teardown = fixture.start();
  openAndIntersect(fixture);
  await flushPromises();

  fixture.fallback.dispatch('load');
  assert.equal(
    fixture.frame.classList.contains('project-media--still-ready'),
    true,
  );
  fixture.video.dispatch('error');
  await flushPromises();

  assert.equal(fixture.frame.classList.contains('project-media--fallback'), true);
  assert.equal(fixture.fallback.hidden, false);
  assert.equal(fixture.video.pauseCalls, 1);
  teardown();
});

test('recognizes a fallback still that loaded before initialization', () => {
  const fixture = createMediaFixture();
  fixture.fallback.complete = true;
  fixture.fallback.naturalWidth = 1280;

  const teardown = fixture.start();

  assert.equal(
    fixture.frame.classList.contains('project-media--still-ready'),
    true,
  );
  teardown();
});

test('reconciles video readiness and failure that occur before initialization', async () => {
  const readyFixture = createMediaFixture();
  readyFixture.video.readyState = 2;
  const teardownReady = readyFixture.start();
  assert.equal(
    readyFixture.frame.classList.contains('project-media--ready'),
    true,
  );
  teardownReady();

  const failedFixture = createMediaFixture();
  failedFixture.video.error = { code: 4 };
  const teardownFailed = failedFixture.start();
  await flushPromises();
  assert.equal(
    failedFixture.frame.classList.contains('project-media--fallback'),
    true,
  );
  teardownFailed();
});

test('a stale play promise does not duplicate pause work', async () => {
  let finishPlay;
  const fixture = createMediaFixture({
    play: () =>
      new Promise((resolve) => {
        finishPlay = resolve;
      }),
  });
  const teardown = fixture.start();
  const observer = openAndIntersect(fixture);

  observer.emit(fixture.frame, false);
  assert.equal(fixture.video.pauseCalls, 1);

  finishPlay();
  await flushPromises();
  assert.equal(fixture.video.pauseCalls, 1);
  teardown();
});

test('repeated intersection signals do not duplicate play or pause work', async () => {
  const fixture = createMediaFixture();
  const teardown = fixture.start();
  const observer = openAndIntersect(fixture);
  observer.emit(fixture.frame, true);
  observer.emit(fixture.frame, true);
  await flushPromises();

  assert.equal(fixture.video.playCalls, 1);

  observer.emit(fixture.frame, false);
  observer.emit(fixture.frame, false);
  assert.equal(fixture.video.pauseCalls, 1);
  teardown();
});

test('media teardown is idempotent and removes observer work', () => {
  const fixture = createMediaFixture();
  const teardown = fixture.start();
  const observer = FakeIntersectionObserver.instances.at(-1);

  teardown();
  teardown();

  assert.equal(observer.disconnectCalls, 1);
  assert.equal(fixture.documentRoot.listeners.get('visibilitychange')?.size ?? 0, 0);
  assert.equal(fixture.mediaQuery.listeners.get('change')?.size ?? 0, 0);
});

test('Escape closes inline media, disables controls, and restores toggle focus', async () => {
  const fixture = createMediaFixture();
  const teardown = fixture.start();
  openAndIntersect(fixture);
  await flushPromises();

  fixture.documentRoot.dispatch('keydown', { key: 'Escape' });

  assert.equal(fixture.toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(fixture.video.controls, false);
  assert.equal(fixture.video.currentTime, 0);
  assert.equal(fixture.toggle.focusCalls, 1);
  teardown();
});

function createNavigationFixture({ mobile = true } = {}) {
  const root = new FakeEventTarget();
  root.documentElement = { classList: new FakeClassList() };
  root.defaultView = {
    matchMedia: () => new FakeMediaQuery(mobile),
  };

  const button = new FakeElement();
  button.hidden = true;
  button.setAttribute('aria-expanded', 'false');
  button.focusCalls = 0;
  button.focus = () => {
    button.focusCalls += 1;
  };

  const menu = new FakeElement();
  const link = new FakeElement();
  menu.querySelectorAll = (selector) => (selector === 'a' ? [link] : []);

  root.querySelector = (selector) => {
    if (selector === '[data-nav-toggle]') return button;
    if (selector === '#primary-navigation') return menu;
    return null;
  };

  return { button, link, menu, root };
}

test('enhanced navigation closes on Escape and restores focus', () => {
  const fixture = createNavigationFixture();
  const teardown = initNavigation(fixture.root);

  assert.equal(fixture.button.hidden, false);
  assert.equal(fixture.menu.hidden, true);

  fixture.button.dispatch('click');
  assert.equal(fixture.button.getAttribute('aria-expanded'), 'true');
  assert.equal(fixture.menu.hidden, false);

  fixture.root.dispatch('keydown', { key: 'Escape' });
  assert.equal(fixture.button.getAttribute('aria-expanded'), 'false');
  assert.equal(fixture.menu.hidden, true);
  assert.equal(fixture.button.focusCalls, 1);

  teardown();
  teardown();
});

test('enhanced navigation leaves primary links visible on larger screens', () => {
  const fixture = createNavigationFixture({ mobile: false });
  const teardown = initNavigation(fixture.root);

  assert.equal(fixture.button.hidden, true);
  assert.equal(fixture.menu.hidden, false);
  teardown();
});

test('renders accessible capture-pending media without unconditional autoplay', () => {
  const html = renderHomePage();

  assert.doesNotMatch(html, /<video[^>]*\sautoplay(?:\s|=|>)/i);
  assert.match(html, /<script\s+type="module"\s+src="js\/site\.js"><\/script>/i);

  for (const project of projects) {
    const controlsId = `media-${project.slug}`;
    const videoPattern = new RegExp(
      `<video[^>]+data-project-video[^>]+muted[^>]+loop[^>]+playsinline[^>]+preload="metadata"[^>]+poster="${project.media.poster}"[^>]+width="1280"[^>]+height="720"`,
      'i',
    );

    assert.match(html, videoPattern, `${project.slug} video policy`);
    assert.ok(html.includes(`src="${project.media.video}"`), `${project.slug} video`);
    assert.ok(html.includes(`src="${project.media.stills[0]}"`), `${project.slug} fallback still`);
    assert.match(
      html,
      new RegExp(
        `<button[^>]+data-media-toggle[^>]+aria-expanded="false"[^>]+aria-controls="${controlsId}"`,
        'i',
      ),
      `${project.slug} inline toggle`,
    );
  }

  assert.match(html, /Project media capture pending/i);
  assert.match(html, /<figcaption[^>]*>[^<]*Project media preview/i);
});

test('renders no-JavaScript navigation links with an opt-in disclosure button', () => {
  const html = renderHomePage();

  assert.match(
    html,
    /<button[^>]+class="nav-toggle"[^>]+data-nav-toggle[^>]+aria-expanded="false"[^>]+aria-controls="primary-navigation"[^>]+hidden/i,
  );
  assert.match(
    html,
    /<nav[^>]+aria-label="Primary"[^>]+id="primary-navigation"[^>]+class="primary-nav"/i,
  );
  assert.doesNotMatch(html, /<nav[^>]+id="primary-navigation"[^>]+hidden/i);
});
