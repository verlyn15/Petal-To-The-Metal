const htmlEntities = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => htmlEntities[character]);
}

export function renderAttrs(attributes) {
  return Object.entries(attributes)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([name, value]) => ` ${name}="${escapeHtml(value)}"`)
    .join('');
}
