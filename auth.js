// ============================================================
// Login demo untuk halaman admin TEKO TUKU.
// Ganti username/password di bawah sesuai kebutuhan.
// Catatan: ini hanya proteksi sisi browser, bukan keamanan server.
// ============================================================
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "teko123";

const SESSION_KEY = "tekoAdminSession";
const REMEMBER_KEY = "tekoAdminRemember";

function isAdminLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === "1" || localStorage.getItem(REMEMBER_KEY) === "1";
}

function loginAdmin(username, password, remember) {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    if (remember) localStorage.setItem(REMEMBER_KEY, "1");
    else sessionStorage.setItem(SESSION_KEY, "1");
    return true;
  }
  return false;
}

function logoutAdmin() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  location.replace("login.html");
}
