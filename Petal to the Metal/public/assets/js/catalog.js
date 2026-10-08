document.querySelectorAll('[data-catalog-filter]').forEach((select) => {
  select.addEventListener('change', () => select.form.requestSubmit());
});
