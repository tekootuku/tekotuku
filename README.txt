WEBSITE TEKO TUKU

CARA MENJALANKAN
1. Ekstrak file ZIP ini.
2. Buka index.html untuk melihat halaman toko.
3. Buka admin.html untuk mengelola produk.

CARA MENAMBAH PRODUK
1. Buka admin.html.
2. Isi nama produk, harga angka (contoh 175000), kategori, dan URL gambar jika ada.
3. Klik Simpan produk.
4. Kembali ke index.html dan muat ulang halaman.

PENGATURAN WHATSAPP
Buka script.js, cari:
const WHATSAPP_NUMBER = "6281234567890";
Ganti dengan nomor WhatsApp toko. Gunakan format 62 diikuti nomor tanpa angka 0 di depan.

PENTING
- Produk dan keranjang disimpan di LocalStorage browser.
- Perubahan dari halaman admin hanya tersimpan di browser/perangkat yang sama.
- GitHub Pages hanya hosting statis. Agar semua pengunjung melihat produk yang sama, perlu database online dan sistem admin yang aman.
- Halaman admin contoh ini tidak memakai login. Jangan menganggapnya aman untuk pengelolaan toko publik.
- Gambar dapat ditambahkan dengan URL gambar langsung yang bisa diakses publik.
