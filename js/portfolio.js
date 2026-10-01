/* Portofolio: DATA + tampilan. Edit daftar PORTFOLIO di bawah untuk mengganti proyek.
   Gambar sementara memakai foto di assets/images/solutions/. Ganti dengan foto proyek asli: taruh file di assets/images/portfolio/ lalu ubah nilai img. */
const PORTFOLIO = [ // item pertama tampil sebagai project utama (lebih besar)
  { cat: "Video Wall", title: "Video Wall", img: "assets/images/solutions/videowall.png" },
  { cat: "Retail Display", title: "Retail Digital Signage", img: "assets/images/solutions/retail.png" },
  { cat: "Corporate Display", title: "Corporate Display", img: "assets/images/solutions/corporate.png" },
  { cat: "Digital Menu Board", title: "Digital Menu Board", img: "assets/images/solutions/digitalmenu.png" },
  { cat: "Public Information", title: "Public Information Display", img: "assets/images/solutions/public.png" },
  { cat: "Hospitality", title: "Hospitality Display", img: "assets/images/solutions/hospitality.png" }
];

(function () {
  const pf = document.getElementById("pf"), chipsBox = document.getElementById("pfChips"), lb = document.getElementById("lb");
  if (!pf) return;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const cats = ["", ...new Set(PORTFOLIO.map((x) => x.cat))];
  chipsBox.innerHTML = cats.map((c) => `<button data-v="${esc(c)}">${c || "Semua"}</button>`).join("");
  const render = (cat) => {
    [...chipsBox.children].forEach((b) => b.classList.toggle("on", b.dataset.v === cat));
    pf.classList.toggle("flat", !!cat);
    pf.innerHTML = PORTFOLIO.filter((x) => !cat || x.cat === cat).map((x) => `<article class="pfc" role="button" tabindex="0" data-img="${x.img}" data-t="${esc(x.title)}" aria-label="Lihat foto ${esc(x.title)}">
      <img src="${x.img}" alt="${esc(x.title)}" loading="lazy">
      <div class="pfo"><div class="pfo-t"><span class="pill">${x.cat}</span><h3>${x.title}</h3></div><span class="go">Lihat Foto <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div></article>`).join("");
  };
  chipsBox.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) render(b.dataset.v); });
  const open = (b) => {
    let im = lb.querySelector("img"); if (!im) { im = document.createElement("img"); lb.insertBefore(im, lb.querySelector("p")); } im.src = b.dataset.img; im.alt = b.dataset.t; lb.querySelector("p").textContent = b.dataset.t; lb.showModal();
  };
  pf.addEventListener("click", (e) => { const b = e.target.closest("[data-img]"); if (b) open(b); });
  pf.addEventListener("keydown", (e) => { if (e.key !== "Enter" && e.key !== " ") return; const b = e.target.closest("[data-img]"); if (b) { e.preventDefault(); open(b); } });
  lb.querySelector(".lbx").addEventListener("click", () => lb.close());
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  render("");
})();
