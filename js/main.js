// Chimpun Callao — Demostración privada
// Preparado por Quorum Digital. Este script no transmite ni almacena datos.

(function () {
  'use strict';

  /* ---- Encabezado fijo: sombra al hacer scroll ---- */
  var header = document.getElementById('site-header');
  function onScroll() {
    if (window.scrollY > 12) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Menú móvil ---- */
  var menuToggle = document.getElementById('menu-toggle');
  var mainNav = document.getElementById('main-nav');
  var overlay = document.getElementById('mobile-nav-overlay');

  function closeMenu() {
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
    mainNav.classList.remove('open');
    overlay.classList.remove('visible');
  }
  function toggleMenu() {
    var isOpen = mainNav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    overlay.classList.toggle('visible', isOpen);
  }
  menuToggle.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);
  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* ---- Formulario de catering: validación local en español, nunca transmite datos ---- */
  var form = document.getElementById('catering-request-form');
  var confirmation = document.getElementById('form-confirmation');
  var nameInput = document.getElementById('cf-name');
  var phoneInput = document.getElementById('cf-phone');
  var errName = document.getElementById('err-name');
  var errPhone = document.getElementById('err-phone');

  function validateField(input, errorEl) {
    var valid = input.value.trim().length > 0;
    input.classList.toggle('invalid', !valid);
    errorEl.hidden = valid;
    return valid;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Solo demostración -- nunca envía ni almacena datos.

    var nameValid = validateField(nameInput, errName);
    var phoneValid = validateField(phoneInput, errPhone);

    if (!nameValid || !phoneValid) {
      var firstInvalid = !nameValid ? nameInput : phoneInput;
      firstInvalid.focus();
      return;
    }

    form.hidden = true;
    confirmation.hidden = false;
    confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // Limpia el estado de error en cuanto el usuario empieza a corregir el campo.
  nameInput.addEventListener('input', function () { validateField(nameInput, errName); });
  phoneInput.addEventListener('input', function () { validateField(phoneInput, errPhone); });
})();
