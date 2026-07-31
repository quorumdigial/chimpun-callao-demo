// Chimpun Callao — Demostración privada
// Preparado por Quorum Digital. Este script no transmite ni almacena datos.

(function () {
  'use strict';

  /* ---- Configuración del sitio (constantes fáciles de editar/reemplazar) ----
     Diego y Gimena pueden agregar futuros episodios de la Mini-serie SIN pedirle
     al desarrollador que modifique el sitio cada vez. Solo necesitan:
       1. Subir el nuevo episodio a su canal de YouTube.
       2. Agregarlo a su lista de reproducción pública "Mini-serie Chimpun Callao".
       3. Reordenar la lista en YouTube si quieren que el episodio más reciente
          aparezca primero.
     Una vez que YOUTUBE_PLAYLIST_ID de abajo tenga el ID real de esa lista de
     reproducción, agregar episodios nuevos en YouTube NO requiere editar ni volver
     a publicar este sitio. El embed de YouTube es público: no usa ni expone
     ninguna clave de API en este frontend. */
  var SITE_CONFIG = {
    YOUTUBE_PLAYLIST_ID: 'REPLACE_WITH_PLAYLIST_ID',
    YOUTUBE_CHANNEL_URL: 'https://www.youtube.com/@REPLACE_WITH_CHANNEL_HANDLE',
    YOUTUBE_PLAYLIST_URL: 'https://www.youtube.com/playlist?list=REPLACE_WITH_PLAYLIST_ID',

    /* Hero background cooking video -- OFF by default on purpose: the real file
       (video/chimpun-hero-cooking.mp4) has not been provided yet. While this is
       false, the <video> element in index.html is never given a <source>, so the
       browser never requests video/chimpun-hero-cooking.mp4 and the existing
       ceviche photo underneath is the only visible hero background.
       Flip this to true only after the real video has been added to video/ --
       that is the single switch that makes the browser start requesting/playing it. */
    ENABLE_HERO_VIDEO: false,
    HERO_VIDEO_SRC: 'video/chimpun-hero-cooking.mp4',

    /* Menú — vista previa animada por categoría (ventana modal) ----
       Ninguno de estos platos, descripciones o precios ha sido confirmado por el
       restaurante todavía -- son marcadores de posición explícitos, nunca ofertas
       reales. TODO(restaurante/Quorum Digital): reemplazar MENU_PREVIEW_ROWS con los
       platos, descripciones y precios reales de cada categoría en cuanto el
       restaurante los confirme. Las claves de MENU_CATEGORIES deben seguir
       coincidiendo con los atributos data-category de las tarjetas en index.html. */
    MENU_CATEGORIES: {
      'menu-del-dia': 'Menú del Día',
      'a-la-parrilla': 'A la Parrilla',
      'mariscos': 'Mariscos',
      'comida-criolla': 'Comida Criolla',
      'chifa': 'Chifa'
    },
    MENU_PREVIEW_LABEL: 'Vista Previa del Menú',
    MENU_PREVIEW_ROWS: [
      { name: 'Plato 01 — Información Pendiente', desc: 'Descripción y precio pendientes de recibir.' },
      { name: 'Plato 02 — Información Pendiente', desc: 'Descripción y precio pendientes de recibir.' },
      { name: 'Plato 03 — Información Pendiente', desc: 'Descripción y precio pendientes de recibir.' }
    ],
    MENU_PREVIEW_NOTICE: 'El menú completo, los platos y los precios serán añadidos cuando el restaurante proporcione la información final.'
  };

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
    document.body.classList.remove('nav-open');
  }
  function toggleMenu() {
    var isOpen = mainNav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    overlay.classList.toggle('visible', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
  }
  menuToggle.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);
  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
  // Cierra el menú móvil con la tecla Escape, sin importar qué elemento tenga el foco.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      closeMenu();
      menuToggle.focus();
    }
  });

  /* ---- Formulario de catering: validación local en español, nunca transmite datos ----
     Este formulario vive solo en catering/index.html -- el resto de las páginas
     (index.html, quienessomos/index.html) no lo tienen, así que todo este bloque se
     protege con "if (form)" para no lanzar errores de consola en esas páginas. */
  var form = document.getElementById('catering-request-form');
  if (form) {
    var confirmation = document.getElementById('form-confirmation');
    var nameInput = document.getElementById('cf-name');
    var phoneInput = document.getElementById('cf-phone');
    var errName = document.getElementById('err-name');
    var errPhone = document.getElementById('err-phone');

    var validateField = function (input, errorEl) {
      var valid = input.value.trim().length > 0;
      input.classList.toggle('invalid', !valid);
      errorEl.hidden = valid;
      return valid;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Solo demostración -- nunca envía ni almacena datos.

      var nameValid = validateField(nameInput, errName);
      var phoneValid = validateField(phoneInput, errPhone);

      if (!nameValid || !phoneValid) {
        var firstInvalid = !nameValid ? nameInput : phoneInput;
        firstInvalid.focus();
        return;
      }
      confirmation.hidden = false;
      confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // Limpia el estado de error en cuanto el usuario empieza a corregir el campo.
    nameInput.addEventListener('input', function () { validateField(nameInput, errName); });
    phoneInput.addEventListener('input', function () { validateField(phoneInput, errPhone); });
  }

  /* ---- Reproductor de la Mini-serie (lista de reproducción de YouTube) ----
     Muestra el embed real de YouTube en cuanto SITE_CONFIG.YOUTUBE_PLAYLIST_ID se
     reemplace por un ID real; mientras tanto muestra un estado de marcador de
     posición profesional. No requiere clave de API de YouTube. */
  var playerHost = document.getElementById('mini-serie-player');
  var youtubeLink = document.getElementById('mini-serie-youtube-link');
  var playlistConfigured = !!(SITE_CONFIG.YOUTUBE_PLAYLIST_ID &&
    SITE_CONFIG.YOUTUBE_PLAYLIST_ID.indexOf('REPLACE_WITH') === -1);

  if (playerHost) {
    if (playlistConfigured) {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/videoseries?list=' + encodeURIComponent(SITE_CONFIG.YOUTUBE_PLAYLIST_ID);
      iframe.title = 'Mini-serie de Chimpun Callao — lista de reproducción de YouTube';
      iframe.loading = 'lazy';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      playerHost.appendChild(iframe);
    } else {
      playerHost.classList.add('player-placeholder');
      playerHost.setAttribute('role', 'img');
      playerHost.setAttribute('aria-label', 'Video de la Mini-serie próximamente — lista de reproducción de YouTube pendiente de configurar');
      var placeholderInner = document.createElement('div');
      placeholderInner.className = 'player-placeholder-inner';
      placeholderInner.innerHTML =
        '<span class="player-placeholder-icon" aria-hidden="true">▶</span>' +
        '<p>Muy pronto: la Mini-serie en YouTube</p>' +
        '<p class="placeholder-note">Este espacio mostrará automáticamente la lista de reproducción en cuanto se configure el ID real en SITE_CONFIG.</p>';
      playerHost.appendChild(placeholderInner);
    }
  }

  if (youtubeLink) {
    youtubeLink.href = playlistConfigured ? SITE_CONFIG.YOUTUBE_PLAYLIST_URL : SITE_CONFIG.YOUTUBE_CHANNEL_URL;
  }

  /* ---- Video de fondo del hero ----
     Solo intenta cargar/reproducir el video si SITE_CONFIG.ENABLE_HERO_VIDEO es true
     (es decir, una vez que exista el archivo real) Y el visitante no pidió reduced-motion.
     Mientras ENABLE_HERO_VIDEO sea false (el estado por defecto hoy), este bloque NUNCA
     agrega una <source>, por lo que el navegador jamás solicita
     video/chimpun-hero-cooking.mp4 y la foto de ceviche existente (la capa .hero-photo,
     detrás del elemento <video>) sigue siendo el único fondo visible, sin cambios.

     Cuando el video real esté disponible y esta bandera pase a true, el <video>:
       - usa autoplay + muted + loop + playsinline (sin controles visibles)
       - se posiciona en toda el área del hero con object-fit: cover
       - usa la foto de ceviche actual como poster (imagen mientras carga)
       - si el archivo falla al cargar o reproducirse, vuelve a ocultarse
         automáticamente y dejará ver de nuevo la foto de ceviche de fondo (capa
         .hero-photo, que nunca se elimina del DOM) -- así el hero jamás se queda
         en blanco ni roto por un archivo de video defectuoso. */
  var heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var showStaticPhotoOnly = function () {
      heroVideo.style.display = 'none'; // .hero-photo underneath remains the only visible background
    };

    if (SITE_CONFIG.ENABLE_HERO_VIDEO && !prefersReducedMotion) {
      heroVideo.addEventListener('error', showStaticPhotoOnly);
      heroVideo.addEventListener('stalled', showStaticPhotoOnly);

      var source = document.createElement('source');
      source.src = SITE_CONFIG.HERO_VIDEO_SRC;
      source.type = 'video/mp4';
      heroVideo.appendChild(source);
      heroVideo.muted = true; // required by browsers for autoplay to be allowed
      heroVideo.setAttribute('autoplay', '');
      heroVideo.load();
      heroVideo.play().catch(function () {
        /* Autoplay blocked by the browser -- the ceviche poster/photo underneath
           already shows through, so no further fallback handling is needed here. */
      });
    } else {
      showStaticPhotoOnly(); // covers both "disabled" and "prefers-reduced-motion" cases
    }
  }

  /* ---- Vista previa de categoría de menú (modal reutilizable) ----
     Las cinco tarjetas de categoría en la sección "Una Probada de Nuestro Menú" son
     activadores de un único modal reutilizable: su encabezado y contenido se
     actualizan según la categoría seleccionada, sin duplicar el marcado del modal por
     categoría. Todo el contenido de los platos es marcador de posición explícito
     (ver SITE_CONFIG.MENU_PREVIEW_ROWS arriba) hasta que el restaurante confirme el
     menú real. Este bloque se protege con comprobaciones de existencia de elementos
     para no lanzar errores si esta sección no está presente en una página. */
  var menuCategoryCards = document.querySelectorAll('.menu-category[data-category]');
  var menuModalBackdrop = document.getElementById('menu-preview-modal-backdrop');
  var menuModal = document.getElementById('menu-preview-modal');
  var menuModalTitle = document.getElementById('menu-preview-modal-title');
  var menuModalRows = document.getElementById('menu-preview-modal-rows');
  var menuModalNotice = document.getElementById('menu-preview-modal-notice');
  var menuModalCloseIcon = document.getElementById('menu-preview-modal-close');
  var menuModalCloseBtn = document.getElementById('menu-preview-modal-close-btn');

  if (menuCategoryCards.length && menuModalBackdrop && menuModal && menuModalTitle &&
      menuModalRows && menuModalNotice && menuModalCloseIcon && menuModalCloseBtn) {

    var MENU_MODAL_CLOSE_MS = 360; // must match the .closing transition duration in CSS
    var MENU_CARD_PRESS_MS = 180; // must match .is-pressed transition duration in CSS
    // Explicit per-row delays (ms after the modal begins, i.e. after 'open' is added)
    // rather than a flat multiplier, per the requested ~340 / ~470 / ~600ms schedule.
    var MENU_MODAL_ROW_DELAYS_MS = [340, 470, 600];

    var menuModalOpen = false;
    var menuModalClosingTimer = null;
    var lastMenuTrigger = null;

    var menuPrefersReducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var populateMenuModal = function (categoryKey) {
      var categoryName = SITE_CONFIG.MENU_CATEGORIES[categoryKey] || '';
      menuModalTitle.textContent = categoryName;
      menuModalNotice.textContent = SITE_CONFIG.MENU_PREVIEW_NOTICE;

      menuModalRows.innerHTML = '';
      SITE_CONFIG.MENU_PREVIEW_ROWS.forEach(function (row, index) {
        var li = document.createElement('li');
        li.className = 'menu-preview-modal-row';
        // Restrained stagger only when motion is allowed -- otherwise every row uses
        // its default (no) animation-delay, and the CSS reduced-motion rule plus the
        // site-wide 0.01ms duration override make the reveal effectively instant.
        if (!menuPrefersReducedMotion) {
          var delay = MENU_MODAL_ROW_DELAYS_MS[index];
          if (delay === undefined) {
            delay = MENU_MODAL_ROW_DELAYS_MS[MENU_MODAL_ROW_DELAYS_MS.length - 1] + (index - MENU_MODAL_ROW_DELAYS_MS.length + 1) * 90;
          }
          li.style.animationDelay = delay + 'ms';
        }

        var name = document.createElement('p');
        name.className = 'menu-preview-modal-row-name';
        name.textContent = row.name;

        var desc = document.createElement('p');
        desc.className = 'menu-preview-modal-row-desc';
        desc.textContent = row.desc;

        li.appendChild(name);
        li.appendChild(desc);
        menuModalRows.appendChild(li);
      });
    };

    var getMenuModalFocusable = function () {
      return menuModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    };

    var onMenuModalKeydown = function (e) {
      if (e.key === 'Escape') {
        closeMenuModal();
        return;
      }
      if (e.key !== 'Tab') return;

      var focusable = getMenuModalFocusable();
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    var onMenuModalBackdropClick = function (e) {
      // Only the backdrop itself closes the modal -- clicks on modal content must
      // never close it (e.target will be inside .menu-preview-modal, not the backdrop).
      if (e.target === menuModalBackdrop) {
        closeMenuModal();
      }
    };

    function openMenuModal(trigger) {
      var categoryKey = trigger.getAttribute('data-category');
      if (!categoryKey || !SITE_CONFIG.MENU_CATEGORIES[categoryKey]) return;

      if (menuModalClosingTimer) {
        clearTimeout(menuModalClosingTimer);
        menuModalClosingTimer = null;
      }

      lastMenuTrigger = trigger;
      populateMenuModal(categoryKey);

      // Brief, noticeable pressed feedback on the selected card -- removed shortly
      // after so the card is never left permanently changed once the modal is open.
      trigger.classList.add('is-pressed');
      window.setTimeout(function () { trigger.classList.remove('is-pressed'); }, MENU_CARD_PRESS_MS);

      // Reveal the modal in its CLOSED/initial state first -- 'open' not yet added,
      // 'closing' removed in case this reopens a modal that was still mid-close.
      menuModalBackdrop.classList.remove('open', 'closing');
      menuModalBackdrop.hidden = false;

      // Two nested requestAnimationFrame calls guarantee the browser actually paints
      // that initial state on its own frame before 'open' is applied. A single forced
      // reflow (reading offsetHeight) was tried in an earlier round and was not
      // reliable enough -- occasionally the browser coalesced the "reveal" and "open"
      // style changes into one recalc and the transition appeared to skip straight to
      // its end state instead of animating (reported as "barely noticeable"/"skipped").
      // This is a rendering-correctness fix, not a timing delay: the two frames add
      // roughly 32ms at 60fps, not an arbitrary wait.
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          menuModalBackdrop.classList.add('open');
          document.body.classList.add('menu-preview-modal-open');
          menuModalOpen = true;

          document.addEventListener('keydown', onMenuModalKeydown);
          menuModalBackdrop.addEventListener('click', onMenuModalBackdropClick);

          // Move focus into the modal once the entrance is underway. Deferred one
          // more tick: when the trigger is a focusable element (tabindex="0"), the
          // browser's own "focus the clicked element" default action can otherwise
          // run after this and pull focus right back to the card.
          window.setTimeout(function () { menuModal.focus(); }, 0);
        });
      });
    }

    function closeMenuModal() {
      if (!menuModalOpen) return;
      menuModalOpen = false;

      menuModalBackdrop.classList.remove('open');
      menuModalBackdrop.classList.add('closing');
      document.body.classList.remove('menu-preview-modal-open');
      document.removeEventListener('keydown', onMenuModalKeydown);
      menuModalBackdrop.removeEventListener('click', onMenuModalBackdropClick);

      var closeDuration = menuPrefersReducedMotion ? 0 : MENU_MODAL_CLOSE_MS;
      var triggerToRestore = lastMenuTrigger;
      menuModalClosingTimer = window.setTimeout(function () {
        menuModalBackdrop.hidden = true;
        menuModalBackdrop.classList.remove('closing');
        menuModalClosingTimer = null;
        if (triggerToRestore) {
          triggerToRestore.focus();
        }
      }, closeDuration);
    }

    menuCategoryCards.forEach(function (card) {
      card.addEventListener('click', function () {
        openMenuModal(card);
      });
      // Native <button> elements get Enter/Space for free, but these cards are
      // role="button" divs, so Enter and Space are wired up explicitly per the
      // standard ARIA button keyboard pattern. Space is prevented to stop the page
      // from scrolling while the card is focused.
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          openMenuModal(card);
        }
      });
    });

    menuModalCloseIcon.addEventListener('click', closeMenuModal);
    menuModalCloseBtn.addEventListener('click', closeMenuModal);
  }
})();
