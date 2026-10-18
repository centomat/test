/* Lucky Shutdown - Website-Interaktionen
   ---------------------------------------------------------------------------
   Zwei Bausteine, alle bewusst ohne Framework/Build:
   1. Nav-Menü (.nav-menu-btn)      - Hamburger-Knopf klappt die Seitenlinks
      unter der Kopfzeile auf/zu (Desktop wie Handy gleich).
   2. 3D-Verpackung (#box3dStage)   - ziehen zum Drehen
   Beide prüfen selbst, ob ihr Element auf der Seite existiert. */

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
