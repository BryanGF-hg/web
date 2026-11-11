document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const navList = document.querySelector("site-nav nav ul");
  const navLinks = [...document.querySelectorAll('site-nav nav a[href^="#"]')];
  const sectionIds = ["centro-topping", "centro-capa1", "centro-capa_madre", "centro-plato"];
  const pageSections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  /* =======================================================
     1. TEMA CLARO / OSCURO
     ======================================================= */
  const getSavedTheme = () => { try { return localStorage.getItem("bryan-web-theme"); } catch { return null; } };
  const saveTheme = (theme) => { try { localStorage.setItem("bryan-web-theme", theme); } catch {} };

  const savedTheme = getSavedTheme();
  if (savedTheme === "light" || savedTheme === "dark") {
    root.dataset.theme = savedTheme;
  } else if (!root.dataset.theme) {
    root.dataset.theme = "light";
  }

  const updateThemeButton = (button) => {
    const isLight = root.dataset.theme === "light";
    button.textContent = isLight ? "☾ Modo oscuro" : "☀ Modo claro";
    button.setAttribute("aria-label", isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro");
    button.setAttribute("aria-pressed", String(!isLight));
  };

  if (navList && !navList.querySelector(".theme-toggle-item")) {
    const themeItem = document.createElement("li");
    themeItem.className = "theme-toggle-item";
    const themeButton = document.createElement("button");
    themeButton.type = "button";
    themeButton.className = "theme-toggle";

    themeItem.appendChild(themeButton);
    navList.appendChild(themeItem);
    updateThemeButton(themeButton);

    themeButton.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
      root.dataset.theme = nextTheme;
      saveTheme(nextTheme);
      updateThemeButton(themeButton);
    });
  }

  /* =======================================================
     2. APARICIÓN PROGRESIVA
     ======================================================= */
  const revealItems = document.querySelectorAll(".secciones-contenedor > section, .centro > div, #centro-capa1 article");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    revealItems.forEach((item, index) => {
      item.classList.add("js-reveal");
      if (item.matches("#centro-capa1 article")) {
        item.style.transitionDelay = `${(index % 3) * 70}ms`;
      }
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  /* =======================================================
     3. NAVEGACIÓN Y SECCIÓN ACTIVA
     ======================================================= */
  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.hash === `#${id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.hash.slice(1);
      if (sectionIds.includes(id)) setActiveLink(id);
    });
  });

  if ("IntersectionObserver" in window && pageSections.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visibleEntries[0]) setActiveLink(visibleEntries[0].target.id);
    }, { threshold: [0.15, 0.35, 0.6], rootMargin: "-15% 0px -55% 0px" });

    pageSections.forEach(section => sectionObserver.observe(section));
  }

  /* =======================================================
     4. FORMULARIO DE CONTACTO (Con simulación de envío)
     ======================================================= */
  const contactForm = document.getElementById("form-contacto");
  const successMessage = document.getElementById("mensaje-exito");

  if (contactForm && successMessage) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Validación nativa HTML5
      if (!contactForm.reportValidity()) return;

      const submitBtn = contactForm.querySelector("button[type=submit]");
      const originalText = submitBtn.innerHTML;

      // Estado de carga
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando...";

      // Simulamos un tiempo de espera de red (1.5 segundos)
      setTimeout(() => {
        successMessage.classList.remove("es-error");
        successMessage.replaceChildren();

        const title = document.createElement("strong");
        title.textContent = "¡Mensaje preparado!";

        const detail = document.createElement("small");
        detail.textContent = "La interfaz funciona. Conecta este formulario a un servicio (como Formspree) para enviarlo de verdad.";

        successMessage.append(title, detail);
        successMessage.hidden = false;

        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1500);
    });
  }

  /* =======================================================
     5. AÑO DINÁMICO
     ======================================================= */
  document.querySelectorAll("[data-current-year]").forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });

  /* =======================================================
     6. COPIAR DATOS DEL FOOTER
     ======================================================= */
  const copyButtons = document.querySelectorAll(".boton-copiar");

  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const originalText = button.innerHTML; // Guardamos el SVG original
      const textToCopy = button.dataset.copy;

      try {
        await navigator.clipboard.writeText(textToCopy);
        button.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>`; // Checkmark
        button.style.background = "var(--menta)";
        button.style.color = "var(--tinta)";
      } catch (error) {
        button.textContent = "Err";
      }

      setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = "";
        button.style.color = "";
      }, 1800);
    });
  });
});
