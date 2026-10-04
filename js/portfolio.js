/* Portofolio: DATA + tampilan.
   Kategori filter berdasarkan TEMPAT/LOKASI penggunaan digital signage (bukan jenis produk),
   agar pengunjung bisa mencari inspirasi penerapan sesuai tempat mereka: Mall, Cafe, Restaurant,
   Hotel, Perkantoran, Kampus. "Semua" menampilkan seluruh portofolio tanpa batas; setiap
   kategori tempat menampilkan maksimal 3 foto yang benar-benar relevan.

   Field "category" diisi hanya jika konteks gambar/judul jelas menunjukkan tempat tersebut.
   Item yang konteksnya tidak jelas untuk tempat manapun (category: null) tetap tampil di "Semua",
   tapi tidak dipaksakan masuk ke kategori tempat tertentu.

   Edit daftar PORTFOLIO di bawah untuk mengganti/menambah proyek. Taruh foto asli di
   assets/images/portfolio/ lalu ubah nilai img. */
const PORTFOLIO = [
  /* MALL */
  { category: "mall", title: "Digital Signage Koridor Mall", desc: "Kios digital berdiri di koridor pusat perbelanjaan untuk menampilkan promosi dan informasi bagi pengunjung.", img: "assets/images/portfolio/mall-corridor.png" },
  { category: "mall", title: "Retail Digital Signage untuk Toko", desc: "Layar promosi vertikal di area toko untuk menampilkan produk dan penawaran secara menarik.", img: "assets/images/portfolio/mall-retail.png" },
  { category: "mall", title: "Display Promosi untuk Atrium Mall", desc: "Layar promosi dan kios direktori di atrium mall untuk menyampaikan informasi dan penawaran kepada pengunjung secara lebih menarik.", img: "assets/images/portfolio/mall-atrium.png" },
  /* CAFE */
  { category: "cafe", title: "Digital Menu Board untuk Cafe", desc: "Menu board digital di area kasir untuk menampilkan daftar menu dan harga yang mudah diperbarui.", img: "assets/images/portfolio/cafe-menu.png" },
  { category: "cafe", title: "Display Promosi untuk Coffee Shop", desc: "Layar promosi dan menu di area bar kopi untuk menampilkan menu andalan dan penawaran terbaru.", img: "assets/images/portfolio/coffee-shop-promo.png" },
  { category: "cafe", title: "Digital Menu untuk Bakery", desc: "Menu digital di area etalase bakery yang membantu pelanggan melihat pilihan roti dan harga dengan mudah.", img: "assets/images/portfolio/bakery-menu.png" },
  /* RESTAURANT */
  { category: "restaurant", title: "Digital Menu Board untuk Restaurant", desc: "Menu board digital di area kasir restoran untuk menampilkan makanan, minuman, dan harga yang mudah diperbarui.", img: "assets/images/portfolio/restaurant-menu-board.png" },
  { category: "restaurant", title: "Display Promosi untuk Food Court", desc: "Layar menu di setiap gerai food court untuk membantu pengunjung memilih makanan dengan cepat.", img: "assets/images/portfolio/food-court-display.png" },
  { category: "restaurant", title: "Display Menu untuk Fast Food", desc: "Layar menu dan promo paket di area pemesanan untuk mempercepat pelanggan menentukan pilihan.", img: "assets/images/portfolio/fast-food-display.png" },
  /* HOTEL */
  { category: "hotel", title: "Display Informasi Lobby Hotel", desc: "Layar informasi di lobby hotel untuk menyambut tamu dan menampilkan layanan serta informasi sekitar.", img: "assets/images/portfolio/hotel-lobby.png" },
  { category: "hotel", title: "Digital Wayfinding untuk Hotel", desc: "Layar petunjuk arah di koridor hotel untuk membantu tamu menemukan kamar dan fasilitas.", img: "assets/images/portfolio/hotel-wayfinding.png" },
  { category: "hotel", title: "Display Informasi Ruang Konferensi", desc: "Layar besar di ruang konferensi hotel untuk menampilkan acara, jadwal, dan informasi sponsor.", img: "assets/images/portfolio/hotel-conference.png" },
  /* PERKANTORAN */
  { category: "perkantoran", title: "Smart Display untuk Ruang Meeting", desc: "Smart display yang mendukung presentasi, rapat, dan kolaborasi tim secara lebih interaktif dan efektif.", img: "assets/images/portfolio/room-meeting.png" },
  { category: "perkantoran", title: "Digital Signage untuk Lobby Kantor", desc: "Solusi digital signage untuk menyampaikan informasi, pengumuman, dan konten visual kepada karyawan maupun pengunjung di area lobby perkantoran.", img: "assets/images/portfolio/lobby.png" },
  { category: "perkantoran", title: "Display Informasi untuk Area Resepsionis", desc: "Display digital di area resepsionis yang membantu menyampaikan informasi dan identitas perusahaan kepada tamu yang datang.", img: "assets/images/portfolio/reception.png" },
  /* Dinonaktifkan agar Semua = 18 (gambar tampak seperti bandara, bukan salah satu dari 6 tempat). Hapus tanda komentar untuk menampilkannya lagi:
  { category: null, title: "Display Informasi Publik", desc: "Kios informasi digital di area publik untuk membantu pengunjung menemukan arah dan informasi.", img: "assets/images/solutions/public.png" } */
  /* KAMPUS */
  { category: "kampus", title: "Interactive Display untuk Ruang Kelas Kampus", desc: "Interactive display di ruang kelas kampus membantu dosen menyampaikan materi perkuliahan secara visual dan mudah diikuti mahasiswa.", img: "assets/images/portfolio/materi-kampus.png" },
  { category: "kampus", title: "Smart Display untuk Ruang Kuliah", desc: "Smart display di ruang kuliah yang mendukung diskusi dan latihan bersama antara dosen dan mahasiswa secara lebih interaktif.", img: "assets/images/portfolio/diskusi-kampus.png" },
  { category: "kampus", title: "Digital Signage untuk Area Kampus", desc: "Digital signage di lobby kampus untuk menyampaikan informasi akademik, pengumuman, dan jadwal kegiatan kepada mahasiswa serta pengunjung.", img: "assets/images/portfolio/campus-lobby.png" },
];

/* Daftar kategori tempat (urutan tetap, selalu tampil walau item masih 0). */
const PF_CATS = [
  { key: "", label: "Semua" },
  { key: "mall", label: "Mall" },
  { key: "cafe", label: "Cafe" },
  { key: "restaurant", label: "Restaurant" },
  { key: "hotel", label: "Hotel" },
  { key: "perkantoran", label: "Perkantoran" },
  { key: "kampus", label: "Kampus" }
];
const PF_MAX_PER_CAT = 3;

(function () {
  const pf = document.getElementById("pf"), chipsBox = document.getElementById("pfChips"), lb = document.getElementById("lb");
  if (!pf) return;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const labelOf = (key) => (PF_CATS.find((c) => c.key === key) || {}).label || "";
  chipsBox.innerHTML = PF_CATS.map((c) => `<button data-v="${esc(c.key)}">${esc(c.label)}</button>`).join("");
  const render = (key) => {
    [...chipsBox.children].forEach((b) => b.classList.toggle("on", b.dataset.v === key));
    let list = key ? PORTFOLIO.filter((x) => x.category === key) : PORTFOLIO.slice();
    if (key) list = list.slice(0, PF_MAX_PER_CAT);
    pf.innerHTML = list.length
      ? list.map((x) => `<article class="pfc" role="button" tabindex="0" data-img="${x.img}" data-t="${esc(x.title)}" aria-label="Lihat foto ${esc(x.title)}">
      <div class="pfc-img"><img src="${x.img}" alt="${esc(x.title)}" loading="lazy"></div>
      <div class="pfc-b"><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p></div></article>`).join("")
      : `<p class="empty">Belum ada contoh portofolio untuk kategori ini. Hubungi kami untuk melihat studi kasus lainnya.</p>`;
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
