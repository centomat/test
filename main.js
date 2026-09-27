/* Lucky Shutdown - Website-Interaktionen
   ---------------------------------------------------------------------------
   Drei Bausteine, alle bewusst ohne Framework/Build:
   1. Nav-Menü (.nav-menu-btn)      - Hamburger-Knopf klappt die Seitenlinks
      unter der Kopfzeile auf/zu (Desktop wie Handy gleich).
   2. 3D-Verpackung (#box3dStage)   - ziehen zum Drehen
   3. Kartenkarussell (#carousel)   - "Rondell": ziehen/swipen dreht die Trommel,
      beim Loslassen rastet sie auf die nächste Karte ein; die Infobox darunter
      folgt der jeweils vorne stehenden Karte.
   Alle drei prüfen selbst, ob ihr Element auf der Seite existiert. */

(function navMenu() {
  var btn = document.querySelector('.nav-menu-btn');
  var menu = document.getElementById('navMenu');
  if (!btn || !menu) return;

  function isOpen() { return !menu.hidden; }
  function open() { menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
  function close() { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (isOpen()) close(); else open();
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) close();
  });
  document.addEventListener('click', function (e) {
    if (isOpen() && !menu.contains(e.target) && !btn.contains(e.target)) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) { close(); btn.focus(); }
  });
})();

(function box3d() {
  var stage = document.getElementById('box3dStage');
  var cube = document.getElementById('box3dCube');
  if (!stage || !cube) return;

  var rotX = -12, rotY = -28;
  var dragging = false, lastX = 0, lastY = 0, lastInteraction = 0;

  function apply() { cube.style.transform = 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)'; }
  function start(x, y) { dragging = true; lastX = x; lastY = y; lastInteraction = performance.now(); cube.classList.add('dragging'); }
  function move(x, y) {
    if (!dragging) return;
    rotY += (x - lastX) * 0.4;
    rotX -= (y - lastY) * 0.3;
    rotX = Math.max(-70, Math.min(70, rotX));
    lastX = x; lastY = y; lastInteraction = performance.now();
    apply();
  }
  function end() { dragging = false; cube.classList.remove('dragging'); lastInteraction = performance.now(); }

  stage.addEventListener('mousedown', function (e) { start(e.clientX, e.clientY); e.preventDefault(); });
  window.addEventListener('mousemove', function (e) { move(e.clientX, e.clientY); });
  window.addEventListener('mouseup', end);
  stage.addEventListener('touchstart', function (e) { var t = e.touches[0]; start(t.clientX, t.clientY); }, { passive: true });
  stage.addEventListener('touchmove', function (e) { var t = e.touches[0]; move(t.clientX, t.clientY); }, { passive: true });
  stage.addEventListener('touchend', end);

  function tick(ts) {
    if (!dragging && ts - lastInteraction > 1400) { rotY += 0.12; apply(); }
    requestAnimationFrame(tick);
  }
  apply();
  requestAnimationFrame(tick);
})();

(function carousel() {
  var root = document.getElementById('carousel');
  if (!root) return;
  var stage = root.querySelector('.carousel-stage');
  var drum = root.querySelector('.carousel-drum');
  var cards = Array.prototype.slice.call(drum.querySelectorAll('.carousel-card'));
  var n = cards.length;
  if (!n) return;

  var elType = root.querySelector('.carousel-type');
  var elName = root.querySelector('.carousel-name');
  var elCount = root.querySelector('.carousel-count');
  var elFn = root.querySelector('.carousel-fn');
  var elDetail = root.querySelector('.carousel-detail');
  var elMore = root.querySelector('.carousel-more');
  var prevBtn = root.querySelector('.carousel-arrow.left');
  var nextBtn = root.querySelector('.carousel-arrow.right');
  var dotsWrap = root.querySelector('.carousel-dots');

  function fillInfo(c) {
    if (elType) elType.textContent = c.dataset.type || '';
    if (elName) elName.textContent = c.dataset.name || '';
    if (elCount) {
      elCount.textContent = c.dataset.count || '';
      elCount.hidden = !c.dataset.count;
    }
    if (elFn) elFn.textContent = c.dataset.fn || '';
    if (elDetail) {
      elDetail.textContent = c.dataset.detail || '';
      elDetail.hidden = !c.dataset.detail;
    }
    if (elMore) {
      if (c.dataset.href) { elMore.href = c.dataset.href; elMore.hidden = false; }
      else { elMore.hidden = true; }
    }
  }

  if (dotsWrap) {
    cards.forEach(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Karte ' + (i + 1));
      dotsWrap.appendChild(b);
    });
  }
  var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.children) : [];
  function markActive(idx) {
    cards.forEach(function (c, i) { c.classList.toggle('is-active', i === idx); });
    dots.forEach(function (d, i) { d.setAttribute('aria-current', i === idx ? 'true' : 'false'); });
  }

  stage.setAttribute('tabindex', '0');

  // Ab 521px Breite (Laptop/Desktop) der urspruengliche 3D-Drehteller, der
  // dort einwandfrei lief; bis 520px (Handy) ein natives Scroll-Snap-
  // Karussell, weil der Drehteller auf echten iPhones zu Rendering-Bugs
  // fuehrte, die sich trotz mehrerer gezielter Fixes nicht beheben liessen.
  // Der Modus wird einmalig beim Laden festgelegt statt live beim Resize
  // umgeschaltet, um die Mechanik nicht mitten in der Sitzung umzubauen.
  if (window.matchMedia('(min-width: 521px)').matches) {
    carouselDrum();
  } else {
    carouselFlat();
  }

  // --- Laptop/Desktop: 3D-Drehteller (rotateY auf die Trommel, jede Karte
  // sitzt per rotateY/translateZ fest auf dem Kreis). --------------------
  function carouselDrum() {
    var step = 360 / n;
    var angle = 0;
    var dragging = false, lastX = 0;

    function layout() {
      var w = cards[0].getBoundingClientRect().width;
      var radius = Math.round((w / 2) / Math.sin((step / 2) * Math.PI / 180) + 26);
      // Perspektive proportional zum Radius statt fest - sonst wirkt der
      // Dreheffekt bei kleineren Karten flacher. Verhaeltnis anhand der
      // Desktop-Werte (176px Karte, radius ~256px, perspective 1150px).
      stage.style.perspective = Math.round(radius * 4.3) + 'px';
      cards.forEach(function (c, i) {
        c.style.transform = 'rotateY(' + (i * step) + 'deg) translateZ(' + radius + 'px)';
      });
    }

    function currentIndex() {
      var norm = ((-angle % 360) + 360) % 360;
      return Math.round(norm / step) % n;
    }
    function syncInfo() {
      var idx = currentIndex();
      fillInfo(cards[idx]);
      markActive(idx);
    }
    function apply() { drum.style.transform = 'rotateY(' + angle + 'deg)'; }
    function snap() {
      angle = Math.round(angle / step) * step;
      // Auf 360 Grad zurechtstutzen (optisch identisch, da rotateY(x) ===
      // rotateY(x-360)): sonst waechst "angle" bei vielen Drehungen in
      // dieselbe Richtung unbegrenzt weiter.
      angle = ((angle % 360) + 360) % 360;
      drum.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
      apply();
      syncInfo();
      setTimeout(function () { drum.style.transition = ''; }, 460);
    }
    function goTo(idx) {
      var cur = currentIndex();
      var diff = idx - cur;
      if (diff > n / 2) diff -= n;
      if (diff < -n / 2) diff += n;
      angle -= diff * step;
      snap();
    }
    function stepBy(dir) { angle -= dir * step; snap(); }

    function down(x) { dragging = true; lastX = x; drum.style.transition = ''; drum.classList.add('dragging'); }
    function mv(x) {
      if (!dragging) return;
      angle += (x - lastX) * 0.5;
      angle = ((angle % 360) + 360) % 360;
      lastX = x;
      apply();
    }
    function up() { if (!dragging) return; dragging = false; drum.classList.remove('dragging'); snap(); }

    stage.addEventListener('mousedown', function (e) { down(e.clientX); e.preventDefault(); });
    window.addEventListener('mousemove', function (e) { mv(e.clientX); });
    window.addEventListener('mouseup', up);
    stage.addEventListener('touchstart', function (e) { down(e.touches[0].clientX); }, { passive: true });
    stage.addEventListener('touchmove', function (e) { mv(e.touches[0].clientX); }, { passive: true });
    stage.addEventListener('touchend', up);

    if (prevBtn) prevBtn.addEventListener('click', function () { stepBy(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { stepBy(1); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { goTo(i); }); });

    stage.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') stepBy(-1);
      if (e.key === 'ArrowRight') stepBy(1);
    });

    window.addEventListener('resize', layout);
    window.addEventListener('ls:i18n', syncInfo);
    layout();
    apply();
    syncInfo();
  }

  // --- Handy: natives horizontales Scrollen mit CSS Scroll-Snap - das
  // Betriebssystem uebernimmt die Touch-Physik komplett selbst. Damit auch
  // die erste/letzte Karte bis zur Mitte scrollen kann, bekommt die Buehne
  // selbst links/rechts Padding in der Breite einer halben Buehne minus
  // einer halben Karte - echtes Padding auf dem Scroll-Container zaehlt
  // zuverlaessig zur Scroll-Breite, das ist der Standardtrick fuer
  // zentrierte Scroll-Snap-Karussells. ------------------------------------
  function carouselFlat() {
    var cardWidth = 0;
    var settleTimer = null;

    function layout() {
      cardWidth = cards[0].offsetWidth;
      var side = Math.max(0, Math.round((stage.clientWidth - cardWidth) / 2));
      stage.style.paddingLeft = side + 'px';
      stage.style.paddingRight = side + 'px';
      scrollToIndex(currentIndex(), false);
    }

    function centerOf(el) { return el.offsetLeft + el.offsetWidth / 2; }

    function currentIndex() {
      var target = stage.scrollLeft + stage.clientWidth / 2;
      var best = 0, bestDist = Infinity;
      cards.forEach(function (c, i) {
        var d = Math.abs(centerOf(c) - target);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      return best;
    }

    function syncInfo() {
      var idx = currentIndex();
      fillInfo(cards[idx]);
      markActive(idx);
    }

    function scrollToIndex(idx, smooth) {
      idx = Math.max(0, Math.min(n - 1, idx));
      var target = centerOf(cards[idx]) - stage.clientWidth / 2;
      stage.scrollTo({ left: target, behavior: smooth === false ? 'auto' : 'smooth' });
    }

    function onScroll() {
      syncInfo();
      // Nach Ende des (Momentum-)Scrollens noch einmal exakt zentrieren -
      // scroll-snap trifft die Mitte meist schon selbst, das ist nur ein
      // Sicherheitsnetz falls eine Momentum-Bewegung knapp daneben liegt.
      clearTimeout(settleTimer);
      settleTimer = setTimeout(function () { scrollToIndex(currentIndex(), true); }, 120);
    }
    stage.addEventListener('scroll', onScroll, { passive: true });

    // Klick-Ziehen mit der Maus: overflow-x:auto scrollt zwar per Trackpad,
    // aber ein simples Maus-Drag muss die Buehne selbst per scrollLeft
    // nachbilden - Scroll-Snap rastet beim Loslassen ganz von selbst ein,
    // egal ob die Bewegung per Touch, Rad oder scrollLeft ausgeloest wurde.
    var dragging = false, dragStartX = 0, dragStartScroll = 0, moved = false;
    function down(x) {
      dragging = true; moved = false;
      dragStartX = x; dragStartScroll = stage.scrollLeft;
      stage.classList.add('dragging');
    }
    function mv(x) {
      if (!dragging) return;
      if (Math.abs(x - dragStartX) > 3) moved = true;
      stage.scrollLeft = dragStartScroll - (x - dragStartX);
    }
    function up() {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove('dragging');
      scrollToIndex(currentIndex(), true);
    }
    stage.addEventListener('mousedown', function (e) { down(e.clientX); e.preventDefault(); });
    window.addEventListener('mousemove', function (e) { mv(e.clientX); });
    window.addEventListener('mouseup', up);
    // Klicks, die aus einem Maus-Drag entstehen, sollen keine Links/Aktionen ausloesen.
    stage.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);

    function stepBy(dir) { scrollToIndex(currentIndex() + dir, true); }
    if (prevBtn) prevBtn.addEventListener('click', function () { stepBy(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { stepBy(1); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { scrollToIndex(i, true); }); });

    stage.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') stepBy(-1);
      if (e.key === 'ArrowRight') stepBy(1);
    });

    window.addEventListener('resize', layout);
    window.addEventListener('ls:i18n', syncInfo);
    layout();
    syncInfo();
  }
})();
