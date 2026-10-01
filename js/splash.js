/* Splash screen untuk SEMUA halaman. Dimuat di <head> (sinkron) agar tampil sebelum halaman digambar.
   Ubah durasi di MIN_MS (waktu tampil minimum) dan MAX_MS (batas maksimum). */
(function () {
  var MIN_MS = 900, MAX_MS = 1600;
  var root = document.documentElement;
  // Terapkan tema tersimpan lebih awal agar tidak ada kilatan warna
  try { var t = localStorage.getItem("cm-theme"); if (t === "dark") root.dataset.theme = "dark"; } catch (e) {}
  var base = document.currentScript.src.replace(/js\/splash\.js.*$/, "");
  var el = document.createElement("div");
  el.id = "splash"; el.setAttribute("aria-hidden", "true");
  el.innerHTML = '<div class="splash-in"><img src="' + base + 'assets/logo/' + (root.dataset.theme === "dark" ? "logo-white" : "logo") + '.png" alt="Cahaya Mustika Indonesia"><p>Digital Signage &amp; Office Equipment</p><span class="bar"></span></div>';
  root.appendChild(el);
  var start = Date.now(), done = false;
  function hide() {
    if (done) return; done = true;
    el.classList.add("out");
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 700);
  }
  function whenReady() { setTimeout(hide, Math.max(0, MIN_MS - (Date.now() - start))); }
  if (document.readyState === "complete") whenReady(); else window.addEventListener("load", whenReady);
  setTimeout(hide, MAX_MS);
  // Tombol Back/Forward (halaman dari cache): jangan tampilkan splash yang macet
  window.addEventListener("pageshow", function (e) { if (e.persisted) hide(); });
})();
