(() => {
  // =====================
  // Helpers
  // =====================
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const toggleDisabled = (elements, disabled) => {
    elements.forEach((el) => {
      el.classList.toggle("opacity-30", disabled);
      el.classList.toggle("pointer-events-none", disabled);
    });
  };

  const resetCheckboxes = (elements) => {
    elements.forEach((el) => {
      const input = qs("input[type='checkbox']", el);
      if (input) input.checked = false;
    });
  };

  const hasAtLeastOneValue = (form) =>
    [...new FormData(form).values()].some((value) => value && value.toString().trim() !== "");

  // =====================
  // Elements
  // =====================
  const form = qs("#form");
  if (!form) return console.warn("El elemento form no existe");

  const submitBtn = qs("button[type='submit']", form);
  const checkboxes = qsa(".checkbox");

  if (!submitBtn) return console.warn("El elemento submitBtn no existe");

  // =====================
  // UI
  // =====================
  const spinner = `
<svg fill="hsl(0, 0%, 100%)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="size-6">
  <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" />
  <path
    d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
  >
    <animateTransform
      attributeName="transform"
      type="rotate"
      dur="0.75s"
      values="0 12 12;360 12 12"
      repeatCount="indefinite"
    />
  </path>
</svg>
`;

  // =====================
  // Events
  // =====================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form));

    submitBtn.innerHTML = spinner;
    submitBtn.disabled = true;
    toggleDisabled(checkboxes, true);
    await delay(4000); //Evento de fetch
    submitBtn.innerHTML = "Desuscribir";
    submitBtn.disabled = false;
    toggleDisabled(checkboxes, false);
    resetCheckboxes(checkboxes);
    console.log("Formulario enviado:", data);
  });
})();
