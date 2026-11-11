/* Efectos básicos sin librerías externas y sin modificar el contenido del HTML. */
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const navList = document.querySelector("nav ul");
  const navLinks = [...document.querySelectorAll('nav a[href^="#"]')];
  const sectionIds = ["centro-topping", "centro-capa1", "centro-capa_madre", "centro-plato"];
  const pageSections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  // Alternancia de tema claro/oscuro. El tema elegido se guarda en este navegador.
  if (navList) {
    const themeItem = document.createElement("li");
    themeItem.className = "theme-toggle-item";

    const themeButton = document.createElement("button");
    themeButton.type = "button";
    themeButton.className = "theme-toggle";
    themeButton.setAttribute("aria-pressed", "false");
    themeItem.appendChild(themeButton);
    navList.appendChild(themeItem);

    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem("bryan-web-theme");
    } catch (error) {
      // La web sigue funcionando aunque el navegador bloquee localStorage.
    }

    if (savedTheme === "light" || savedTheme === "dark") {
      root.dataset.theme = savedTheme;
    }

    const updateThemeButton = () => {
      const lightMode = root.dataset.theme === "light";
      themeButton.textContent = lightMode ? "☾ Modo oscuro" : "☀ Modo claro";
      themeButton.setAttribute("aria-label", lightMode ? "Cambiar a modo oscuro" : "Cambiar a modo claro");
      themeButton.setAttribute("aria-pressed", String(lightMode));
    };

    updateThemeButton();
    themeButton.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
      root.dataset.theme = nextTheme;
      try {
        localStorage.setItem("bryan-web-theme", nextTheme);
      } catch (error) {
        // El cambio de tema funciona también sin almacenamiento local.
      }
      updateThemeButton();
    });
  }

  // Aparición suave al entrar en pantalla. Si no hay IntersectionObserver, no oculta nada.
  const revealItems = document.querySelectorAll(
    ".secciones-contenedor > section, .centro > div, #centro-capa1 article"
  );
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

  // Resalta en el menú el apartado que se está viendo.
  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const active = link.hash === `#${id}`;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.hash.slice(1);
      if (sectionIds.includes(id)) setActiveLink(id);
    });
  });

  if ("IntersectionObserver" in window && pageSections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visibleEntries[0]) setActiveLink(visibleEntries[0].target.id);
    }, { threshold: [0.15, 0.35, 0.6], rootMargin: "-15% 0px -55% 0px" });

    pageSections.forEach((section) => sectionObserver.observe(section));
  }
});
