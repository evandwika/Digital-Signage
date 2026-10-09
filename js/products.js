/* Katalog produk, solusi (beranda), dan detail artikel. Data ada di js/data.js (dibuat oleh build.py). */
(function () {
  const BASE = document.body.dataset.base || "";
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const bucket = (s) => String(s);
  /* Gambar produk: pakai path persis dari js/data.js (p.img). Ekstensi tidak diubah. */
  const imgSrc = (p) => BASE + p.img;
  /* Produk tanpa foto (series baru & accessories): placeholder konsisten dengan fallback gambar existing */
  const media = (p) => p.img ? `<img src="${imgSrc(p)}" alt="${esc(p.name)}" loading="lazy" decoding="async">` : `<span class="imgfb" role="img" aria-label="${esc(p.name)}">${esc(p.name)}</span>`;
  /* Logo brand (gambar PNG), menggantikan badge teks berwarna di atas nama produk */
  const BRAND_LOGO_IMG = {
    Samsung: "assets/logo/brands/samsung.png",
    LG: "assets/logo/brands/lg.png",
    Hikvision: "assets/logo/brands/hikvision.png"
  };
  const brandLogo = (b) => BRAND_LOGO_IMG[b]
    ? `<span class="pbrand-logo"><img src="${BASE + BRAND_LOGO_IMG[b]}" alt="${esc(b)}" class="blogo blogo-${b.toLowerCase()}" loading="lazy" decoding="async"></span>`
    : `<span class="pbrand">${esc(b)}</span>`;
  const card = (p) => `<article class="pcard">
    <a class="pimg" href="${BASE}product-detail/${p.id}.html" data-name="${esc(p.name)}">${media(p)}</a>
    <div class="pb">${brandLogo(p.brand)}${p.type === "accessory" && p.acat ? `<span class="pacat">${esc(p.acat)}</span>` : ""}<h3>${esc(p.name)}</h3>${p.desc ? `<p class="pdesc">${esc(p.desc)}</p>` : ""}
    <a class="btn btn-o" href="${BASE}product-detail/${p.id}.html">Lihat Detail</a></div></article>`;
  const ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const BRANDS = ["Samsung", "LG", "Hikvision"];
  const group = (list) => BRANDS.map((b) => {
    const it = list.filter((p) => p.brand === b); if (!it.length) return "";
    const k = b.toLowerCase();
    return `<section class="bsec" aria-label="${b}"><div class="bhd"><h2 class="bname bn-${k}">${b.toUpperCase()}</h2><a class="bmore" data-b="${b}" href="${BASE}products.html#${k}">Lihat Semua ${ARROW}</a></div>
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
    if (p && p.img) { pdImg.parentNode.dataset.name = p.name; pdImg.src = imgSrc(p); }
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
    if (d.featured) show(d.featured.split(",").map((id) => all.find((p) => p.id === id)).filter(Boolean).map((p) => ({ ...p, desc: p.desc ? p.desc.split(", dirancang")[0].replace(/\.$/, "") + "." : p.desc })));
    else if (d.related) {
      /* Terkait: series yang sama dulu, lalu produk sejenis (display/aksesori) dari brand yang sama */
      const c = all.find((p) => p.id === d.related), same = all.filter((p) => p.brand === c.brand && p.id !== c.id);
      const rel = [...same.filter((p) => p.series === c.series), ...same.filter((p) => p.series !== c.series && p.type === c.type)];
      show(rel.slice(0, 2));
    }
    else if (d.brand) {
      /* Halaman brand lama dipertahankan hanya untuk kompatibilitas: arahkan ke katalog terpadu */
      location.replace(BASE + "products.html#" + d.brand.toLowerCase());
    }
    else {
      const q = document.getElementById("q"), fs = document.getElementById("fs"), fc = document.getElementById("fc"), count = document.getElementById("count"), rst = document.getElementById("reset");
      const chips = [...document.querySelectorAll("#brandChips button")];
      const block = document.getElementById("seriesBlock"), nav = document.getElementById("seriesNav"), lbl = document.getElementById("seriesLabel");
            if (matchMedia("(max-width:640px)").matches) q.placeholder = "Cari produk atau brand...";

      /* Series per brand: dari window.SERIES + series tak terdaftar (fallback, produk tidak hilang) */
      const seriesFor = (brand) => {
        const items = all.filter((p) => p.brand === brand), reg = ((window.SERIES || {})[brand] || []).slice();
        items.forEach((p) => { const id = p.series || "other"; if (!reg.some((x) => x.id === id)) reg.push({ id, name: id === "other" ? "Lainnya" : id }); });
        return reg.filter((x) => items.some((p) => (p.series || "other") === x.id));
      };
      let brand = BRANDS[0], series = "", want = "";
      /* State dari URL: #samsung, #samsung/qmc, #hikvision/accessories (juga ?brand=LG dari tautan lama) */
      const readState = () => {
        let parts = []; try { parts = decodeURIComponent(location.hash.replace(/^#/, "")).toLowerCase().split("/"); } catch (e) {}
        const legacy = (new URLSearchParams(location.search).get("brand") || "").toLowerCase();
        brand = BRANDS.find((b) => b.toLowerCase() === parts[0]) || BRANDS.find((b) => b.toLowerCase() === legacy) || BRANDS[0];
        const list = seriesFor(brand);
        series = (list.find((x) => x.id === parts[1]) || list[0] || { id: "" }).id;
        want = list.some((x) => x.id === parts[1]) ? parts[1] : "";
      };
      /* Seri tampil menurun dalam satu halaman; tautan #brand/seri menggulir ke seri tersebut */
      const toSeries = () => { const el = want && document.getElementById("series-" + want); if (el) el.scrollIntoView({ block: "start" }); };
      let skip = false;
      const setHash = (h) => { if (location.hash === "#" + h) return; skip = true; location.hash = h; };

      /* Pill "Pilih Seri Produk": hanya menggulir ke seri terkait. Tidak ada state aktif/biru permanen; warna biru hanya lewat :hover (CSS). */
      nav.addEventListener("click", (e) => {
        const b = e.target.closest("button[data-s]"); if (!b) return;
        const el = document.getElementById("series-" + b.dataset.s); if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" }); setHash(brand.toLowerCase() + "/" + b.dataset.s);
      });
      const run = () => {
        const t = q.value.trim().toLowerCase(), toks = t.split(/\s+/).filter(Boolean), searching = !!t;
        const list = seriesFor(brand);
        chips.forEach((c) => { const on = !searching && c.dataset.v === brand; c.classList.toggle("on", on); c.setAttribute("aria-pressed", on); });
        const extra = (p) => (!fs.value || String(p.size) === fs.value) && (!fc.value || p.cat === fc.value);
        const active = !!(t || fs.value || fc.value);
        rst.hidden = !active;
        if (searching) {
          /* Pencarian lintas brand & series (perilaku existing) */
          const res = all.filter((p) => {
            if (!extra(p)) return false;
            const plain = `${p.name} ${p.brand} ${p.cat} ${p.acat || ""} ${p.model || ""} ${p.resl || ""} ${p.size || ""}`.toLowerCase(), compact = norm(plain);
            return toks.every((k) => plain.includes(k) || compact.includes(norm(k)));
          });
          block.hidden = true;
          count.textContent = `Menampilkan ${res.length} dari ${all.length} produk`;
          grid.innerHTML = res.length ? group(res) : EMPTY;
          return;
        }
        if (!list.length) { block.hidden = true; grid.innerHTML = EMPTY; return; }
        let shown = 0, total = 0; const present = [];
        const html = list.map((cur) => {
          const inSeries = all.filter((p) => p.brand === brand && (p.series || "other") === cur.id), res = inSeries.filter(extra);
          total += inSeries.length; shown += res.length;
          if (!res.length) return "";
          present.push(cur);
          const sizes = [...new Set(inSeries.filter((p) => p.size).map((p) => p.size))].sort((a, b) => a - b).map((n) => n + '"').join(", ");
          const info = cur.id === "accessories" ? `${inSeries.length} aksesori ${esc(brand)}. Kompatibilitas dengan model display tertentu perlu dikonfirmasi.` : `${inSeries.length} model tersedia${sizes ? " dengan pilihan ukuran " + sizes : ""}.`;
          return `<section class="sgroup" id="series-${esc(cur.id)}" aria-label="${esc(brand + " " + cur.name)}"><div class="shead"><h2>${esc(brand + " " + cur.name)}</h2><p>${info}</p></div><div class="pgrid">${res.map((p) => card(p)).join("")}</div></section>`;
        }).join("");
        count.textContent = active ? `Menampilkan ${shown} dari ${total} produk` : "";
        grid.removeAttribute("role"); grid.removeAttribute("aria-labelledby");
        grid.innerHTML = html || EMPTY;
        lbl.textContent = "Pilih Seri Produk " + brand;
        nav.innerHTML = present.map((x) => `<button type="button" data-s="${esc(x.id)}" aria-controls="series-${esc(x.id)}">${esc(x.name.toUpperCase())}</button>`).join("");
        block.hidden = !present.length;
      };
      const reset = () => { q.value = fs.value = fc.value = ""; run(); };
      const go = (b, s) => { q.value = ""; brand = b; const l = seriesFor(b); series = (l.find((x) => x.id === s) || l[0] || { id: "" }).id; setHash(s ? b.toLowerCase() + "/" + series : b.toLowerCase()); run(); };
      chips.forEach((c) => c.addEventListener("click", () => go(c.dataset.v)));
      [q, fs, fc].forEach((el) => el.addEventListener("input", run));
      rst.addEventListener("click", reset);
      grid.addEventListener("click", (e) => {
        if (e.target.closest("[data-reset]")) { reset(); return; }
        const m = e.target.closest(".bmore"); if (m) { e.preventDefault(); fs.value = fc.value = ""; go(m.dataset.b); }
      });
      document.getElementById("filters").addEventListener("submit", (e) => { e.preventDefault(); run(); grid.scrollIntoView({ behavior: "smooth", block: "start" }); });
      /* Tautan navbar/footer ke #brand saat sudah di halaman ini: reset pencarian & tampilkan brand tsb */
      window.addEventListener("hashchange", () => { if (skip) { skip = false; return; } q.value = fs.value = fc.value = ""; readState(); run(); toSeries(); });
      readState(); run(); toSeries();
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
  /* Listing: tanpa gambar, hanya 4 artikel non-Retail. Data (termasuk img & artikel Retail) tetap utuh untuk halaman detail. */
  const LIST_MAX = 4, LIST_HIDE = ["Retail"];
  if (ag) ag.innerHTML = window.ARTICLES.filter((a) => !LIST_HIDE.includes(a.cat)).slice(0, LIST_MAX).map((a) => `<article class="acard">
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
