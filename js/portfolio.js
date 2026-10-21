/* Portofolio: DATA + tampilan.
   Tidak ada filter kategori tempat (Mall/Cafe/dsb) lagi: seluruh proyek ditampilkan
   sekaligus di bawah label "Semua Proyek".

   Edit daftar PORTFOLIO di bawah untuk mengganti/menambah proyek. Taruh foto asli di
   assets/images/portfolio/ lalu ubah nilai img. */
const PORTFOLIO = [
  { title: "Interactive Display untuk Ruang Kelas Kampus", desc: "Interactive display di ruang kelas kampus membantu dosen menyampaikan materi perkuliahan secara visual dan mudah diikuti mahasiswa.", img: "assets/images/portfolio/materi-kampus.webp" },
  { title: "Smart Display untuk Ruang Kuliah", desc: "Smart display di ruang kuliah yang mendukung diskusi dan latihan bersama antara dosen dan mahasiswa secara lebih interaktif.", img: "assets/images/portfolio/diskusi-kampus.webp" },
  { title: "Digital Signage untuk Area Kampus", desc: "Digital signage di lobby kampus untuk menyampaikan informasi akademik, pengumuman, dan jadwal kegiatan kepada mahasiswa serta pengunjung.", img: "assets/images/portfolio/campus-lobby.webp" },
  { title: "Smart Display untuk Ruang Meeting", desc: "Smart display yang mendukung presentasi, rapat, dan kolaborasi tim secara lebih interaktif dan efektif.", img: "assets/images/portfolio/room-meeting.webp" },
  { title: "Digital Signage untuk Lobby Kantor", desc: "Solusi digital signage untuk menyampaikan informasi, pengumuman, dan konten visual kepada karyawan maupun pengunjung di area lobby perkantoran.", img: "assets/images/portfolio/lobby.webp" },
  { title: "Display Informasi untuk Area Resepsionis", desc: "Display digital di area resepsionis yang membantu menyampaikan informasi dan identitas perusahaan kepada tamu yang datang.", img: "assets/images/portfolio/reception.webp" },
];

(function () {
  const pf = document.getElementById("pf"), lb = document.getElementById("lb");
  if (!pf) return;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const render = () => {
    pf.innerHTML = PORTFOLIO.length
      ? PORTFOLIO.map((x) => `<article class="pfc" role="button" tabindex="0" data-img="${x.img}" data-t="${esc(x.title)}" aria-label="Lihat foto ${esc(x.title)}">
      <div class="pfc-img"><img src="${x.img}" alt="${esc(x.title)}" loading="lazy"></div>
      <div class="pfc-b"><h2>${esc(x.title)}</h2><p>${esc(x.desc)}</p></div></article>`).join("")
      : `<p class="empty">Belum ada contoh portofolio. Hubungi kami untuk melihat studi kasus lainnya.</p>`;
  };
  const open = (b) => {
    let im = lb.querySelector("img"); if (!im) { im = document.createElement("img"); lb.insertBefore(im, lb.querySelector("p")); } im.src = b.dataset.img; im.alt = b.dataset.t; lb.querySelector("p").textContent = b.dataset.t; lb.showModal();
  };
  pf.addEventListener("click", (e) => { const b = e.target.closest("[data-img]"); if (b) open(b); });
  pf.addEventListener("keydown", (e) => { if (e.key !== "Enter" && e.key !== " ") return; const b = e.target.closest("[data-img]"); if (b) { e.preventDefault(); open(b); } });
  lb.querySelector(".lbx").addEventListener("click", () => lb.close());
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  render();
})();
