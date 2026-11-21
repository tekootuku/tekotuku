// Penanganan error sederhana untuk semua halaman TEKO TUKU.
// Menampilkan pesan ramah jika ada JavaScript error atau file gagal dimuat.
(function () {
  var shown = false;

  function showError(message) {
    if (shown) return;
    shown = true;

    var box = document.createElement("div");
    box.className = "app-error";
    box.setAttribute("role", "alert");
    box.innerHTML =
      '<div class="app-error-content">' +
      "<b>Something went wrong</b>" +
      "<span></span>" +
      '<div class="app-error-actions">' +
      '<button type="button" class="app-error-reload">Muat ulang</button>' +
      '<button type="button" class="app-error-close">Tutup</button>' +
      "</div>" +
      "</div>";

    box.querySelector("span").textContent = message;
    box.querySelector(".app-error-reload").addEventListener("click", function () {
      location.reload();
    });
    box.querySelector(".app-error-close").addEventListener("click", function () {
      box.remove();
    });

    (document.body || document.documentElement).appendChild(box);
  }

  window.addEventListener("error", function (event) {
    var target = event.target;

    // Abaikan error favicon karena tidak memengaruhi fungsi halaman.
    if (target && target !== window && target.tagName === "LINK" && /favicon/i.test(target.href || "")) {
      return;
    }

    if (target && target !== window) {
      showError("Ada file yang gagal dimuat. Periksa koneksi atau nama file, lalu muat ulang halaman.");
    } else {
      showError("Ada kesalahan pada halaman. Silakan muat ulang atau coba lagi nanti.");
    }
  }, true);

  window.addEventListener("unhandledrejection", function () {
    showError("Ada proses yang tidak selesai. Silakan muat ulang halaman.");
  });
})();
