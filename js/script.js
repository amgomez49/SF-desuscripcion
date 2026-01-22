class UnsubscribeForm {
  constructor({
    formSelector = "#form",
    checkboxSelector = ".checkbox",
    messageSelector = "#form-message",
    lottieSelector = "dotlottie-wc",
    lottiePreloaderSelector = "#lottie-preloader",
  } = {}) {
    // DOM
    this.form = document.querySelector(formSelector);
    if (!this.form) {
      console.warn("Form no encontrado");
      return;
    }

    this.submitBtn = this.form.querySelector("button[type='submit']");
    if (!this.submitBtn) {
      console.warn("Botón submit no encontrado");
      return;
    }

    this.checkboxes = [...document.querySelectorAll(checkboxSelector)];
    this.formMessage = document.querySelector(messageSelector);
    this.lottieIcon = document.querySelector(lottieSelector);
    this.lottiePreloader = document.querySelector(lottiePreloaderSelector);

    // UI
    this.SPINNER = `
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

    this.init();
  }

  // ============================================================
  // Init
  // ============================================================
  init() {
    this.initLottie();
    this.bindEvents();
  }

  // ============================================================
  // Helpers
  // ============================================================
  toggleDisabled(elements, disabled) {
    elements.forEach((el) => {
      el.classList.toggle("opacity-30", disabled);
      el.classList.toggle("pointer-events-none", disabled);
    });
  }

  resetCheckboxes() {
    this.checkboxes.forEach((el) => {
      const checkbox = el.querySelector("input[type='checkbox']");
      if (checkbox) checkbox.checked = false;
    });
  }

  setButtonLoading(isLoading) {
    this.submitBtn.innerHTML = isLoading ? this.SPINNER : "Desuscribir";
    this.submitBtn.disabled = isLoading;
  }

  async callApi(ms, result = true, payload = null) {
    console.log("Payload enviado:", payload);
    return new Promise((resolve) => {
      setTimeout(() => resolve(result), ms);
    });
  }

  // ============================================================
  // Modal
  // ============================================================
  showFormMessage({ title, description, icon }) {
    if (!this.formMessage) return;

    this.formMessage.classList.remove("invisible", "opacity-0");

    const iconEl = this.formMessage.querySelector("#modal-icon");
    const titleEl = this.formMessage.querySelector("#modal-title");
    const descriptionEl = this.formMessage.querySelector("#modal-description");

    if (iconEl) iconEl.src = `./assets/${icon}.gif`;
    if (titleEl) titleEl.innerHTML = title;
    if (descriptionEl) descriptionEl.innerHTML = description;

    this.initModalClose();
  }

  initModalClose() {
    const overlay = this.formMessage;
    const modal = overlay?.querySelector("#modal-content");
    const closeBtn = overlay?.querySelector("#close-message");

    if (!overlay) return;

    const close = () => overlay.classList.add("invisible", "opacity-0");

    overlay.addEventListener("click", (e) => {
      if (!modal || !modal.contains(e.target)) close();
    });

    closeBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      close();
    });
  }

  // ============================================================
  // Lottie
  // ============================================================
  initLottie() {
    if (!this.lottieIcon?.dotLottie || !this.lottiePreloader) return;

    this.lottieIcon.dotLottie.addEventListener("load", () => {
      this.lottiePreloader.remove();
    });
  }

  // ============================================================
  // Events
  // ============================================================
  bindEvents() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(this.form));
    let message;

    try {
      this.setButtonLoading(true);
      this.toggleDisabled(this.checkboxes, true);

      const success = await this.callApi(2000, true, data);
      if (!success) throw new Error();

      message = {
        title: "Desuscripción confirmada",
        description:
          "Tu correo fue eliminado correctamente de nuestra lista. Ya no recibirás más comunicaciones.",
        icon: "unsubscribe-success",
      };

      this.resetCheckboxes();
    } catch {
      message = {
        title: "No se pudo completar la desuscripción",
        description:
          "Ocurrió un problema al procesar tu solicitud. Por favor, intentá nuevamente más tarde o contactanos si el problema persiste.",
        icon: "unsubscribe-error",
      };
    } finally {
      this.setButtonLoading(false);
      this.toggleDisabled(this.checkboxes, false);
      this.showFormMessage(message);
    }
  }
}

new UnsubscribeForm();
