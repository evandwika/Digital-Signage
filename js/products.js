/* Katalog produk, solusi (beranda), dan detail artikel. Data ada di js/data.js (dibuat oleh build.py). */
(function () {
  const BASE = document.body.dataset.base || "";
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const bucket = (s) => String(s);
  /* Gambar produk: pakai path persis dari js/data.js (p.img). Ekstensi tidak diubah. */
  const imgSrc = (p) => BASE + p.img;
  const card = (p) => `<article class="pcard">
    <a class="pimg" href="${BASE}product-detail/${p.id}.html" data-name="${esc(p.name)}"><img src="${imgSrc(p)}" alt="${esc(p.name)}" loading="lazy" decoding="async"></a>
    <div class="pb"><span class="pbrand">${p.brand}</span><h3>${esc(p.name)}</h3>
    <a class="btn btn-o" href="${BASE}product-detail/${p.id}.html">Lihat Detail</a></div></article>`;
  const ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const BRANDS = ["Samsung", "LG", "Hikvision"];
  const group = (list) => BRANDS.map((b) => {
    const it = list.filter((p) => p.brand === b); if (!it.length) return "";
    const k = b.toLowerCase();
    return `<section class="bsec" aria-label="${b}"><div class="bhd"><h2 class="bname bn-${k}">${b.toUpperCase()}</h2><a class="bmore" href="${BASE}products/${k}.html">Lihat Semua ${ARROW}</a></div>
      <div class="pgrid">${it.map((p) => card(p)).join("")}</div></section>`;
  }).join("");
  const EMPTY = `<div class="empty"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M8.5 11h5"/></svg><h3>Produk tidak ditemukan</h3><p>Coba gunakan kata kunci lain.</p><button type="button" class="btn btn-o" data-reset>Reset pencarian</button></div>`;
  const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");

  /* Fallback gambar: bila file gagal dimuat, tampilkan latar netral + nama produk (bukan ikon rusak) */
  const fallback = (im) => {
    if (im.dataset.fb) return; im.dataset.fb = "1";
    const box = im.closest(".pimg, .pdimg"); if (!box) return;
    const name = box.dataset.name || im.alt || "";
    im.outerHTML = `<span class="imgfb" role="img" aria-label="${esc(name)}">${esc(name)}</span>`;
  };
  document.addEventListener("error", (e) => { if (e.target && e.target.tagName === "IMG") fallback(e.target); }, true);

  /* Halaman detail: gambar sama dengan kartu (diambil dari data, berdasarkan nama file halaman) */
  const pdImg = document.querySelector(".pdimg img");
  if (pdImg) {
    const pid = location.pathname.split("/").pop().replace(/\.html?$/, ""), p = (window.PRODUCTS || []).find((x) => x.id === pid);
    if (p) { pdImg.parentNode.dataset.name = p.name; pdImg.src = imgSrc(p); }
    if (pdImg.complete && pdImg.naturalWidth === 0 && pdImg.getAttribute("src")) fallback(pdImg);
  }

  /* ---- Katalog ---- */
  const grid = document.getElementById("grid");
  if (grid) {
    const d = grid.dataset, all = window.PRODUCTS;
    const show = (list) => {
      grid.innerHTML = list.length ? list.map((p) => card(p)).join("") : `<p class="empty">Produk tidak ditemukan. Ubah filter atau hubungi kami untuk rekomendasi.</p>`;
      bindWA();
    };
    if (d.featured) show(d.featured.split(",").map((id) => all.find((p) => p.id === id)).filter(Boolean));
    else if (d.related) { const c = all.find((p) => p.id === d.related); show(all.filter((p) => p.brand === c.brand && p.id !== c.id).slice(0, 2)); }
    else if (d.brand) { grid.innerHTML = all.filter((p) => p.brand === d.brand).map((p) => card(p)).join(""); }
    else {
      const q = document.getElementById("q"), fs = document.getElementById("fs"), fc = document.getElementById("fc"), count = document.getElementById("count"), rst = document.getElementById("reset");
      const chips = [...document.querySelectorAll("#brandChips button")];
      if (matchMedia("(max-width:640px)").matches) q.placeholder = "Cari produk atau brand...";
      let brand = new URLSearchParams(location.search).get("brand") || "";
      const run = () => {
        chips.forEach((c) => { const on = c.dataset.v === brand; c.classList.toggle("on", on); c.setAttribute("aria-pressed", on); });
        const t = q.value.trim().toLowerCase(), toks = t.split(/\s+/).filter(Boolean);
        const list = all.filter((p) => {
          if ((brand && p.brand !== brand) || (fs.value && String(p.size) !== fs.value) || (fc.value && p.cat !== fc.value)) return false;
          const plain = `${p.name} ${p.brand} ${p.cat} ${p.resl} ${p.size}`.toLowerCase(), compact = norm(plain);
          return toks.every((k) => plain.includes(k) || compact.includes(norm(k)));
        });
        const active = !!(brand || t || fs.value || fc.value);
        rst.hidden = !active;
        count.textContent = active ? `Menampilkan ${list.length} dari ${all.length} produk` : `${all.length} produk dari 3 brand`;
        grid.innerHTML = list.length ? group(list) : EMPTY;
      };
      const reset = () => { q.value = fs.value = fc.value = ""; brand = ""; run(); };
      chips.forEach((c) => c.addEventListener("click", () => { brand = c.dataset.v; run(); }));
      [q, fs, fc].forEach((el) => el.addEventListener("input", run));
      rst.addEventListener("click", reset);
      grid.addEventListener("click", (e) => { if (e.target.closest("[data-reset]")) reset(); });
      document.getElementById("filters").addEventListener("submit", (e) => { e.preventDefault(); run(); grid.scrollIntoView({ behavior: "smooth", block: "start" }); });
      run();
    }
  }

  /* ---- Solusi (beranda) ---- */
  const sol = document.getElementById("solutions");
  if (sol) sol.innerHTML = window.SOLUTIONS.map((x) => `<article class="solc"><img src="${BASE}${x.img}" alt="${esc(x.title)}" loading="lazy"><div class="sol-t"><h3>${x.title}</h3><p>${x.desc}</p></div></article>`).join("");

  /* ---- Artikel: data dari window.ARTICLES (js/data.js) ---- */
  const ART_ARROW = " →";
  const blocks = (list) => list.map((b) => {
    if (typeof b === "string") return `<p>${b}</p>`;
    if (b.h) return `<h2>${b.h}</h2>`;
    if (b.ul) return `<ul>${b.ul.map((i) => `<li>${i}</li>`).join("")}</ul>`;
    if (b.tip) return `<aside class="atip"><strong>Tips</strong><p>${b.tip}</p></aside>`;
    if (b.table) return `<div class="atable"><table><thead><tr>${b.table.head.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead><tbody>${b.table.rows.map((r) => `<tr>${r.map((c, i) => i ? `<td>${c}</td>` : `<th scope="row">${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    return "";
  }).join("");

  const ag = document.getElementById("artgrid");
  if (ag) ag.innerHTML = window.ARTICLES.map((a) => `<article class="acard">
    <a class="athumb" href="article-detail.html?a=${a.id}" tabindex="-1" aria-hidden="true"><img src="${a.img}" alt="" loading="lazy"></a>
    <div class="abody"><div class="ameta"><span class="acat">${a.cat}</span><time>${a.date}</time></div>
    <h3><a href="article-detail.html?a=${a.id}">${a.title}</a></h3><p>${a.excerpt}</p>
    <a class="abtn" href="article-detail.html?a=${a.id}">Baca Selengkapnya${ART_ARROW}</a></div></article>`).join("");

  /* ---- Detail artikel ---- */
  const art = document.getElementById("art");
  if (art) {
    const a = window.ARTICLES.find((x) => x.id === new URLSearchParams(location.search).get("a")) || window.ARTICLES[0];
    document.title = a.title + " | Cahaya Mustika Indonesia";
    const bc = document.getElementById("artCrumb"); if (bc) bc.textContent = a.title;
    art.innerHTML = `<header class="ahd"><div class="ameta"><span class="acat">${a.cat}</span><time>${a.date}</time></div><h1>${a.title}</h1><p class="aintro">${a.intro}</p></header>
      <figure class="ahero"><img src="${BASE}${a.img}" alt="${esc(a.title)}"></figure>
      <div class="abodytxt">${blocks(a.body)}<section class="aconc"><h2>Kesimpulan</h2><p>${a.conclusion}</p></section></div>`;
  }
})();
