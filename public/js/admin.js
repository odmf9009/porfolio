// Confirmación antes de enviar formularios marcados con data-confirm
document.querySelectorAll('form[data-confirm]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    if (!window.confirm(form.getAttribute('data-confirm'))) e.preventDefault();
  });
});

// Autogenerar slug a partir del nombre (solo si el slug está vacío) en el formulario
const nameInput = document.querySelector('input[name="name"]');
const slugInput = document.querySelector('input[name="slug"]');
if (nameInput && slugInput) {
  nameInput.addEventListener('input', () => {
    if (slugInput.dataset.touched) return;
    slugInput.value = nameInput.value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  });
  slugInput.addEventListener('input', () => (slugInput.dataset.touched = '1'));
}
