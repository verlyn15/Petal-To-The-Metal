const htmlEntities = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const booleanAttributes = new Set([
  'allowfullscreen',
  'async',
  'autofocus',
  'autoplay',
  'checked',
  'controls',
  'default',
  'defer',
  'disabled',
  'formnovalidate',
  'hidden',
  'inert',
  'ismap',
  'itemscope',
  'loop',
  'multiple',
  'muted',
  'nomodule',
  'novalidate',
  'open',
  'playsinline',
  'readonly',
  'required',
  'reversed',
  'selected',
]);

const attributeNamePattern = /^[A-Za-z][A-Za-z0-9:._-]*$/;

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => htmlEntities[character]);
}

export function renderAttrs(attributes) {
  const rendered = [];

  for (const [name, value] of Object.entries(attributes)) {
    if (!attributeNamePattern.test(name)) {
      throw new TypeError(`Invalid attribute name: ${name}`);
    }

    if (value === null || value === undefined) {
      continue;
    }

    if (booleanAttributes.has(name.toLowerCase())) {
      if (value === false) {
        continue;
      }

      if (value !== true) {
        throw new TypeError(`Boolean attribute ${name} must be true or false`);
      }

      rendered.push(` ${name}`);
      continue;
    }

    rendered.push(` ${name}="${escapeHtml(value)}"`);
  }

  return rendered.join('');
}
