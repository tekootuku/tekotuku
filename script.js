// Ganti dengan nomor WhatsApp toko. Gunakan format 62 tanpa tanda + atau angka 0 di depan.
const STORE_WHATSAPP = "6281234567890";
const STORAGE_KEY = "tekoTukuProducts";
const CART_KEY = "tekoTukuCart";

const defaultProducts = [
  { id: "p1", name: "RAM DDR4 8GB", price: 175000, category: "RAM", image: "https://placehold.co/500x350/eaf1ff/14264f?text=RAM+DDR4", description: "Memori desktop untuk kebutuhan komputasi harian." },
  { id: "p2", name: "SSD NVMe 512GB", price: 450000, category: "SSD", image: "https://placehold.co/500x350/eaf1ff/14264f?text=SSD+NVMe", description: "Penyimpanan cepat untuk laptop dan PC kompatibel." },
  { id: "p3", name: "Printer Canon iP2770", price: 650000, category: "Printer", image: "https://placehold.co/500x350/eaf1ff/14264f?text=Printer", description: "Printer untuk kebutuhan cetak sehari-hari." },
  { id: "p4", name: "Router WiFi", price: 250000, category: "Router", image: "https://placehold.co/500x350/eaf1ff/14264f?text=Router+WiFi", description: "Perangkat jaringan untuk koneksi internet di rumah." },
  { id: "p5", name: "Adaptor 5V 2A", price: 35000, category: "Aksesoris", image: "https://placehold.co/500x350/eaf1ff/14264f?text=Adaptor+5V", description: "Adaptor daya 5 volt 2 ampere." }
];

function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
      return [...defaultProducts];
    }
    return JSON.parse(saved);
  } catch {
    return [...defaultProducts];
  }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function rupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0
  }).format(value);
}

let products = loadProducts();
let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
let activeCategory = "Semua";

const productList = document.getElementById("product-list");
const categoryList = document.getElementById("category-list");
const searchInput = document.getElementById("search-input");
const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");

function renderCategories() {
  const categories = ["Semua", ...new Set(products.map(p => p.category))];
  categoryList.innerHTML = categories.map(category => `
    <button class="category-btn ${category === activeCategory ? "active" : ""}"
      data-category="${escapeHTML(category)}">${escapeHTML(category)}</button>
  `).join("");

  categoryList.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      renderCategories();
      renderProducts();
    });
  });
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(product => {
    const matchesCategory = activeCategory === "Semua" || product.category === activeCategory;
    const matchesSearch = (product.name + " " + product.category + " " + (product.description || "")).toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  document.getElementById("empty-products").classList.toggle("hidden", filtered.length > 0);
  productList.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img src="${escapeHTML(product.image || "https://placehold.co/500x350?text=Produk")}"
          alt="${escapeHTML(product.name)}" onerror="this.src='https://placehold.co/500x350?text=Foto+Produk'">
      </div>
      <div class="product-info">
        <span class="product-category">${escapeHTML(product.category)}</span>
        <h3>${escapeHTML(product.name)}</h3>
        <p>${escapeHTML(product.description || "Produk pilihan TEKO TUKU.")}</p>
        <div class="product-price">${rupiah(Number(product.price))}</div>
        <button class="btn btn-primary" data-add="${escapeHTML(product.id)}">Tambah ke keranjang</button>
      </div>
    </article>
  `).join("");

  productList.querySelectorAll("[data-add]").forEach(button => {
    button.addEventListener("click", () => addToCart(button.dataset.add));
  });
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ id, quantity: 1 });
  saveCart();
  renderCart();
}

function changeQuantity(id, amount) {
  const item = cart.find(p => p.id === id);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter(p => p.id !== id);
  saveCart();
  renderCart();
}

function renderCart() {
  let total = 0;
  let count = 0;
  const validCart = cart.filter(item => products.some(p => p.id === item.id));
  cart = validCart;

  if (!cart.length) {
    cartList.innerHTML = '<p class="empty">Keranjang masih kosong. Yuk, pilih produk!</p>';
  } else {
    cartList.innerHTML = cart.map(item => {
      const product = products.find(p => p.id === item.id);
      const subtotal = Number(product.price) * item.quantity;
      total += subtotal;
      count += item.quantity;
      return `
        <div class="cart-row">
          <div>
            <div class="cart-name">${escapeHTML(product.name)}</div>
            <div class="cart-sub">${rupiah(subtotal)}</div>
          </div>
          <div class="qty-control">
            <button data-minus="${escapeHTML(item.id)}" aria-label="Kurangi">−</button>
            <strong>${item.quantity}</strong>
            <button data-plus="${escapeHTML(item.id)}" aria-label="Tambah">+</button>
          </div>
        </div>
      `;
    }).join("");
  }

  cartList.querySelectorAll("[data-minus]").forEach(button =>
    button.addEventListener("click", () => changeQuantity(button.dataset.minus, -1)));
  cartList.querySelectorAll("[data-plus]").forEach(button =>
    button.addEventListener("click", () => changeQuantity(button.dataset.plus, 1)));

  cartTotal.textContent = rupiah(total);
  cartCount.textContent = count;
  saveCart();
}

function checkout() {
  if (!cart.length) {
    alert("Keranjang masih kosong. Silakan pilih produk terlebih dahulu.");
    return;
  }
  if (!/^[0-9]{9,15}$/.test(STORE_WHATSAPP)) {
    alert("Nomor WhatsApp toko belum benar. Silakan atur STORE_WHATSAPP di script.js.");
    return;
  }

  let total = 0;
  let message = "Halo TEKO TUKU, saya ingin memesan:%0A%0A";
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    const subtotal = Number(product.price) * item.quantity;
    total += subtotal;
    message += `- ${product.name} x ${item.quantity}: ${rupiah(subtotal)}%0A`;
  });
  message += `%0ATotal: ${rupiah(total)}%0A%0AMohon info ketersediaan dan cara pembayaran.`;
  window.open(`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(decodeURIComponent(message))}`, "_blank");
}

searchInput.addEventListener("input", renderProducts);
document.getElementById("checkout-button").addEventListener("click", checkout);
document.getElementById("year").textContent = new Date().getFullYear();

renderCategories();
renderProducts();
renderCart();
