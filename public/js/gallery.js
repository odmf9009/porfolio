// Carrusel de capturas de cada app + visor ampliado (<dialog>).
// Sin JavaScript cada miniatura es un enlace normal a la imagen grande.
(function () {
  var dlg = document.getElementById('lightbox');
  var canModal = dlg && typeof dlg.showModal === 'function';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Carrusel dentro de cada tarjeta ----------
  document.querySelectorAll('[data-shots]').forEach(function (box) {
    var track = box.querySelector('.shots__track');
    var prev = box.querySelector('.shots__nav--prev');
    var next = box.querySelector('.shots__nav--next');

    function sync() {
      var max = track.scrollWidth - track.clientWidth;
      var overflow = max > 4;
      prev.hidden = !overflow || track.scrollLeft <= 2;
      next.hidden = !overflow || track.scrollLeft >= max - 2;
    }
    function step(dir) {
      var slide = track.querySelector('.shots__slide');
      var w = slide ? slide.getBoundingClientRect().width + 10 : 140;
      track.scrollBy({ left: dir * w * 2, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    prev.addEventListener('click', function () { step(-1); });
    next.addEventListener('click', function () { step(1); });
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    track.querySelectorAll('img').forEach(function (img) { img.addEventListener('load', sync); });
    sync();

    // Clic en una miniatura -> visor ampliado
    if (!canModal) return;
    box.querySelectorAll('.shots__open').forEach(function (link, i) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        openViewer(box, i, link);
      });
    });
  });

  if (!canModal) return;

  // ---------- Visor ampliado ----------
  var img = document.getElementById('lightboxImg');
  var count = document.getElementById('lightboxCount');
  var stage = dlg.querySelector('.lightbox__stage');
  var state = { items: [], index: 0, trigger: null };

  function load(i) {
    var item = state.items[i];
    if (!item) return;
    img.src = item.src;
    img.alt = item.alt;
    count.textContent = i + 1 + ' / ' + state.items.length;
  }
  function show(i) {
    var n = state.items.length;
    state.index = (i + n) % n; // da la vuelta al llegar al final
    load(state.index);
    // precarga las vecinas para que pasar de una a otra sea instantáneo
    [state.index + 1, state.index - 1].forEach(function (j) {
      var item = state.items[(j + n) % n];
      if (item) new Image().src = item.src;
    });
  }
  function openViewer(box, index, trigger) {
    state.items = Array.prototype.map.call(box.querySelectorAll('.shots__open'), function (a) {
      var im = a.querySelector('img');
      return { src: a.getAttribute('href'), alt: im ? im.alt : '' };
    });
    state.trigger = trigger;
    var single = state.items.length < 2;
    dlg.querySelectorAll('.lightbox__nav').forEach(function (b) { b.hidden = single; });
    show(index);
    document.documentElement.classList.add('is-locked');
    dlg.showModal();
  }

  dlg.querySelector('.lightbox__close').addEventListener('click', function () { dlg.close(); });
  dlg.querySelector('.lightbox__nav--prev').addEventListener('click', function () { show(state.index - 1); });
  dlg.querySelector('.lightbox__nav--next').addEventListener('click', function () { show(state.index + 1); });

  // Clic fuera de la imagen (en el fondo o en el espacio vacío) cierra
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg || e.target === stage) dlg.close();
  });
  // Flechas del teclado (Esc ya lo cierra el propio <dialog>)
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); show(state.index + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); show(state.index - 1); }
  });
  // Deslizar con el dedo
  var startX = null;
  stage.addEventListener('pointerdown', function (e) { startX = e.clientX; });
  stage.addEventListener('pointerup', function (e) {
    if (startX === null) return;
    var dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) show(state.index + (dx < 0 ? 1 : -1));
  });
  stage.addEventListener('pointercancel', function () { startX = null; });

  dlg.addEventListener('close', function () {
    document.documentElement.classList.remove('is-locked');
    img.removeAttribute('src');
    if (state.trigger) state.trigger.focus(); // devuelve el foco a la miniatura pulsada
  });
})();
