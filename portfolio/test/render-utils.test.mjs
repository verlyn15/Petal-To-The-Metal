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

test('renderAttrs escapes values and omits only nullish attributes', () => {
  assert.equal(
    renderAttrs({
      class: 'project & proof',
      title: `Jayrald's \"work\"`,
      count: 0,
      active: false,
      absent: null,
      unknown: undefined,
    }),
    ' class="project &amp; proof" title="Jayrald&#39;s &quot;work&quot;" count="0" active="false"',
  );
});
