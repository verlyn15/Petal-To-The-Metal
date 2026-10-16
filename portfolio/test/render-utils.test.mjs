import assert from 'node:assert/strict';
import test from 'node:test';

import { escapeHtml, renderAttrs } from '../scripts/render-utils.mjs';

test('escapeHtml neutralizes markup and ampersands', () => {
  assert.equal(
    escapeHtml('<script>alert("x")</script> & safe'),
    '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; safe',
  );
});

test('escapeHtml encodes double and single quotes and stringifies values', () => {
  assert.equal(escapeHtml(`Jayrald's \"portfolio\"`), 'Jayrald&#39;s &quot;portfolio&quot;');
  assert.equal(escapeHtml(0), '0');
  assert.equal(escapeHtml(false), 'false');
});

test('renderAttrs escapes values and omits nullish attributes', () => {
  assert.equal(
    renderAttrs({
      class: 'project & proof',
      title: `Jayrald's \"work\"`,
      count: 0,
      absent: null,
      unknown: undefined,
    }),
    ' class="project &amp; proof" title="Jayrald&#39;s &quot;work&quot;" count="0"',
  );
});

test('renderAttrs uses presence semantics for media boolean attributes', () => {
  assert.equal(
    renderAttrs({
      muted: true,
      loop: false,
      autoplay: false,
      controls: true,
      playsinline: true,
    }),
    ' muted controls playsinline',
  );

  assert.throws(
    () => renderAttrs({ autoplay: 'false' }),
    { name: 'TypeError', message: /Boolean attribute/ },
  );
});

test('renderAttrs rejects malformed attribute names', () => {
  for (const name of ['bad name', 'title="unsafe"', '<script', 'data-value/onload']) {
    assert.throws(
      () => renderAttrs({ [name]: 'value' }),
      { name: 'TypeError', message: /Invalid attribute name/ },
    );
  }
});
