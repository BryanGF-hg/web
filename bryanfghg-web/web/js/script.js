/**
 * Formulario de contacto (web/index.html)
 * Lee los datos con querySelector y muestra el agradecimiento dentro de #mensaje-exito.
 */
document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("#form-contacto");
  const aviso = document.querySelector("#mensaje-exito");
  if (!formulario || !aviso) return;

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    // Datos de contacto, leídos con querySelector
    const contacto = {
      nombre: document.querySelector("#nombre").value.trim(),
      email: document.querySelector("#email").value.trim(),
      mensaje: document.querySelector("#mensaje").value.trim(),
    };

    // required no detecta campos con solo espacios
    if (!contacto.nombre || !contacto.email || !contacto.mensaje) {
      aviso.classList.add("es-error");
      aviso.textContent = "Por favor, rellena todos los campos.";
      aviso.hidden = false;
      return;
    }

    // TODO: aquí se enviaría `contacto` a un servicio (Formspree, EmailJS, tu API...).
    // Ahora mismo los datos solo se usan para mostrar el mensaje; no salen del navegador.

    // textContent / nodos de texto: lo que escriba la persona nunca se interpreta como HTML
    const nombre = document.createElement("strong");
    nombre.textContent = contacto.nombre;
    const detalle = document.createElement("small");
    detalle.textContent = `Te responderemos a ${contacto.email}.`;

    aviso.classList.remove("es-error");
    aviso.replaceChildren("Muchas gracias, ", nombre, ", nos pondremos en contacto en breve.", detalle);
    aviso.hidden = false;
    formulario.reset();
  });

  // Al volver a escribir, el aviso anterior desaparece
  formulario.addEventListener("input", () => { aviso.hidden = true; });
});
