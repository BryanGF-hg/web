/* =========================================================
   BRYAN GLOT FONG — WEB PERSONAL
   Interacciones sin dependencias externas.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  const navList = document.querySelector("site-nav nav ul");
  const navLinks = [
    ...document.querySelectorAll('site-nav nav a[href^="#"]')
  ];

  const sectionIds = [
    "centro-topping",
    "centro-capa1",
    "centro-capa_madre",
    "centro-plato"
  ];

  const pageSections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  /* =======================================================
     1. TEMA CLARO / OSCURO
     ======================================================= */

  const getSavedTheme = () => {
    try {
      return localStorage.getItem("bryan-web-theme");
    } catch (error) {
      return null;
    }
  };

  const saveTheme = (theme) => {
    try {
      localStorage.setItem("bryan-web-theme", theme);
    } catch (error) {
      // La web continúa funcionando aunque localStorage esté bloqueado.
    }
  };

  const savedTheme = getSavedTheme();

  if (savedTheme === "light" || savedTheme === "dark") {
    root.dataset.theme = savedTheme;
  } else if (!root.dataset.theme) {
    root.dataset.theme = "light";
  }

  const updateThemeButton = (button) => {
    const isLight = root.dataset.theme === "light";

    button.textContent = isLight
      ? "☾ Modo oscuro"
      : "☀ Modo claro";

    button.setAttribute(
      "aria-label",
      isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro"
    );

    button.setAttribute("aria-pressed", String(!isLight));
  };

  if (navList && !navList.querySelector(".theme-toggle-item")) {
    const themeItem = document.createElement("li");
    themeItem.className = "theme-toggle-item";

    const themeButton = document.createElement("button");
    themeButton.type = "button";
    themeButton.className = "theme-toggle";
    themeButton.setAttribute("aria-pressed", "false");

    /*
     * Estilos locales para el botón:
     * no dependemos de que nav-modular.js conozca esta clase.
     */
    Object.assign(themeButton.style, {
      padding: "8px 11px",
      color: "var(--tinta)",
      background: "var(--menta-tenue)",
      border: "2px solid var(--borde)",
      borderRadius: "4px",
      fontFamily: "var(--font-mono)",
      fontSize: "11px",
      fontWeight: "700",
      cursor: "pointer"
    });

    themeItem.appendChild(themeButton);
    navList.appendChild(themeItem);

    updateThemeButton(themeButton);

    themeButton.addEventListener("click", () => {
      const nextTheme =
        root.dataset.theme === "light" ? "dark" : "light";

      root.dataset.theme = nextTheme;
      saveTheme(nextTheme);
      updateThemeButton(themeButton);
    });
  }

  /* =======================================================
     2. APARICIÓN PROGRESIVA DE ELEMENTOS
     ======================================================= */

  const revealItems = document.querySelectorAll(
    [
      ".secciones-contenedor > section",
      ".centro > div",
      "#centro-capa1 article"
    ].join(", ")
  );

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealItems.forEach((item, index) => {
      item.classList.add("js-reveal");

      if (item.matches("#centro-capa1 article")) {
        item.style.transitionDelay = `${(index % 3) * 70}ms`;
      }

      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => {
      item.classList.add("is-visible");
    });
  }

  /* =======================================================
     3. NAVEGACIÓN Y SECCIÓN ACTIVA
     ======================================================= */

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.hash === `#${id}`;

      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.hash.slice(1);

      if (sectionIds.includes(id)) {
        setActiveLink(id);
      }
    });
  });

  if (
    "IntersectionObserver" in window &&
    pageSections.length > 0
  ) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio
          );

        if (visibleEntries[0]) {
          setActiveLink(visibleEntries[0].target.id);
        }
      },
      {
        threshold: [0.15, 0.35, 0.6],
        rootMargin: "-15% 0px -55% 0px"
      }
    );

    pageSections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  /* =======================================================
     4. FORMULARIO DE CONTACTO
     ======================================================= */

  const contactForm = document.getElementById("form-contacto");
  const successMessage = document.getElementById("mensaje-exito");

  if (contactForm && successMessage) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) {
        return;
      }

      /*
       * IMPORTANTE:
       * Este formulario todavía no envía correos ni guarda datos.
       * Para eso hace falta conectarlo a un backend o servicio
       * de formularios. Aquí solo se muestra una confirmación
       * visual para la versión de demostración.
       */

      successMessage.classList.remove("es-error");
      successMessage.replaceChildren();

      const title = document.createElement("strong");
      title.textContent = "Formulario validado.";

      const detail = document.createElement("small");
      detail.textContent =
        "La interfaz funciona, pero todavía no hay un servicio conectado para enviar el mensaje.";

      successMessage.append(title, detail);
      successMessage.hidden = false;

      contactForm.reset();
    });
  }

  /* =======================================================
     5. ACTUALIZACIÓN DEL AÑO
     ======================================================= */

  const yearElements = document.querySelectorAll("[data-current-year]");

  yearElements.forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

/* Copiar datos del footer */
const copyButtons = document.querySelectorAll(".boton-copiar");

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const originalText = button.textContent;
    const textToCopy = button.dataset.copy;

    try {
      await navigator.clipboard.writeText(textToCopy);

      button.textContent = "✓";
      button.classList.add("copiado");

    } catch (error) {
      button.textContent = "Error!";
    }

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove("copiado");
    }, 1800);
  });
});
  
});
