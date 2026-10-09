/* ===== CAHAYA MUSTIKA - main.js =====
   Data perusahaan (nomor WhatsApp, email, alamat, maps, sosial media) ada di js/config.js */
const WA_NUMBER = String(CONFIG.whatsapp || "").replace(/\D/g, "");
const WA_MESSAGE = CONFIG.whatsappMessage;
const waUrl = (t) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t)}`;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* Isi otomatis dari config: data-cfg="email|address|phone|hours" */
$$("[data-cfg]").forEach((el) => {
  const v = CONFIG[el.dataset.cfg]; if (!v) return;
  el.textContent = v;
  if (el.tagName === "A" && el.dataset.cfg === "email") el.href = "mailto:" + v;
});
const map = $("#mapFrame"); if (map) map.src = CONFIG.mapsUrl;
const soc = $("[data-social]");
if (soc) soc.innerHTML = Object.entries(CONFIG.social).filter(([, u]) => u).map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${n[0].toUpperCase() + n.slice(1)}</a>`).join("") || "<span>Segera hadir</span>";

/* Semua tombol WhatsApp: data-wa (pesan bisa diganti lewat data-msg) */
function bindWA() {
  $$("[data-wa]").forEach((a) => {
    a.href = waUrl(a.dataset.msg || WA_MESSAGE);
    a.target = "_blank"; a.rel = "noopener";
    if ("txt" in a.dataset) a.textContent = CONFIG.phone || WA_NUMBER;
  });
}
bindWA();

/* Navbar */
const nav = $("#nav"), menu = $("#menu"), burger = $("#burger"), dd = $(".dd"), ddBtn = $(".dd-btn");
const onScroll = () => nav.classList.toggle("sc", scrollY > 8);
onScroll(); addEventListener("scroll", onScroll, { passive: true });
const closeMenu = () => { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Buka menu"); };
burger.addEventListener("click", () => {
  const o = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", o); burger.setAttribute("aria-label", o ? "Tutup menu" : "Buka menu");
});
ddBtn.addEventListener("click", (e) => { e.stopPropagation(); ddBtn.setAttribute("aria-expanded", dd.classList.toggle("open")); });
document.addEventListener("click", (e) => { if (!dd.contains(e.target)) { dd.classList.remove("open"); ddBtn.setAttribute("aria-expanded", "false"); } });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { dd.classList.remove("open"); closeMenu(); } });
addEventListener("resize", () => { if (innerWidth > 960) closeMenu(); });

/* Form kontak -> WhatsApp */
const form = $("#form");
if (form) form.addEventListener("submit", (e) => {
  e.preventDefault();
  const v = (n) => form.elements[n].value.trim();
  const err = (n, m) => { const el = form.elements[n]; el.classList.toggle("bad", !!m); el.parentElement.querySelector("small").textContent = m; return !m; };
  const a = err("nama", v("nama") ? "" : "Nama wajib diisi.");
  const b = err("wa", /^(\+?62|0)8\d{7,12}$/.test(v("wa").replace(/[\s-]/g, "")) ? "" : "Masukkan nomor WhatsApp yang valid, contoh 08123456789.");
  if (!a || !b) return;
  const t = ["Halo Cahaya Mustika, saya ingin konsultasi.", "", `Nama: ${v("nama")}`, `Perusahaan: ${v("perusahaan") || "-"}`, `WhatsApp: ${v("wa")}`, `Produk: ${v("produk")}`, `Pesan: ${v("pesan") || "-"}`].join("\n");
  window.open(waUrl(t), "_blank", "noopener");
});
$$("#yr").forEach((y) => (y.textContent = new Date().getFullYear()));

/* Slider hero (beranda): otomatis, crossfade, tanpa tombol panah */
const slides = $("[data-slides]");
if (slides) {
  const imgs = $$("img", slides), dots = $$(".dots button");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let i = 0, timer = null;
  const go = (n) => { i = (n + imgs.length) % imgs.length; imgs.forEach((im, k) => im.classList.toggle("on", k === i)); dots.forEach((d, k) => d.classList.toggle("on", k === i)); };
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
  const start = () => { stop(); if (reduce || document.hidden || imgs.length < 2) return; timer = setInterval(() => go(i + 1), 5500); };
  dots.forEach((d, k) => d.addEventListener("click", () => { go(k); start(); }));
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  start();
}

/* FAQ accordion (beberapa item boleh terbuka bersamaan) */
$$(".faq-q").forEach((b) => b.addEventListener("click", () => {
  const open = b.getAttribute("aria-expanded") === "true";
  b.setAttribute("aria-expanded", !open);
  b.parentElement.classList.toggle("open", !open);
}));
