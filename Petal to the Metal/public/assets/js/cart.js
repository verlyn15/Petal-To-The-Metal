document.querySelectorAll('[data-quantity-step]').forEach((button) => {
  button.addEventListener('click', () => {
    const input = button.closest('.quantity-control').querySelector('input');
    const next = Number(input.value) + Number(button.dataset.quantityStep);
    input.value = String(Math.max(Number(input.min || 1), Math.min(Number(input.max || 99), next)));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
});
