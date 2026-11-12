/* =========================================================
   BRYAN GLOT FONG — WEB PERSONAL
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = [...document.querySelectorAll('site-nav nav a[href^="#"]')];
  const sectionIds = ["centro-topping", "centro-capa1", "centro-capa_madre", "centro-plato"];
  const pageSections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  /* =======================================================
     1. APARICIÓN PROGRESIVA DE ELEMENTOS
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
     2. NAVEGACIÓN Y SECCIÓN ACTIVA
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
      const visibleEntries = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visibleEntries[0]) setActiveLink(visibleEntries[0].target.id);
    }, { threshold: [0.15, 0.35, 0.6], rootMargin: "-15% 0px -55% 0px" });

    pageSections.forEach((section) => sectionObserver.observe(section));
  }

  /* =======================================================
     3. FORMULARIO DE CONTACTO (Simulación de envío)
     ======================================================= */
  const contactForm = document.getElementById("form-contacto");
  const successMessage = document.getElementById("mensaje-exito");

  if (contactForm && successMessage) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      const submitBtn = contactForm.querySelector("button[type=submit]");
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando...";

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
     4. AÑO DINÁMICO
     ======================================================= */
  document.querySelectorAll("[data-current-year]").forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });

  /* =======================================================
     5. COPIAR DATOS DEL FOOTER
     ======================================================= */
  const copyButtons = document.querySelectorAll(".boton-copiar");

  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const originalText = button.innerHTML;
      const textToCopy = button.dataset.copy;

      try {
        await navigator.clipboard.writeText(textToCopy);
        button.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
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
