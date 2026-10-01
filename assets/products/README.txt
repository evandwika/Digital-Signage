GAMBAR PRODUK
=============
Gambar yang dipakai situs adalah file PNG di assets/products/<brand>/ :
  samsung/samsung1.png, samsung2.png, samsung3.png
  lg/lg1.png, lg2.png, lg3.png
  hikvision/hikvision1.png, hikvision2.png, hikvision3.png

Path gambar ditentukan oleh kolom "img" tiap produk di js/data.js. Kartu produk, halaman brand,
dan halaman detail semua memakai path itu apa adanya (ekstensi tidak diubah otomatis).

Untuk mengganti gambar: timpa file PNG dengan nama yang sama, atau ubah kolom "img" di js/data.js
dan samakan atribut src gambar di product-detail/<id>.html.
File .svg lama tetap disimpan sebagai arsip dan tidak dipakai kartu produk.
Saran: rasio 3:2 (mis. 1536 x 1024). Gambar tidak di-crop (object-fit: contain).
