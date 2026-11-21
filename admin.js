const STORAGE_KEY = "tekoTukuProducts";

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
function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}
function rupiah(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}

let products = loadProducts();

const form = document.getElementById("product-form");
const idInput = document.getElementById("product-id");
const nameInput = document.getElementById("product-name");
const priceInput = document.getElementById("product-price");
const categoryInput = document.getElementById("product-category");
const imageInput = document.getElementById("product-image");
const descriptionInput = document.getElementById("product-description");

function renderAdminProducts() {
  const tbody = document.getElementById("admin-product-list");
  document.getElementById("admin-empty").classList.toggle("hidden", products.length > 0);

  tbody.innerHTML = products.map(product => `
    <tr>
      <td>${escapeHTML(product.name)}</td>
      <td>${escapeHTML(product.category)}</td>
      <td>${rupiah(Number(product.price))}</td>
      <td>
        <div class="table-actions">
          <button type="button" data-edit="${escapeHTML(product.id)}">Edit</button>
          <button type="button" class="delete" data-delete="${escapeHTML(product.id)}">Hapus</button>
        </div>
      </td>
    </tr>
  `).join("");

  tbody.querySelectorAll("[data-edit]").forEach(button =>
    button.addEventListener("click", () => editProduct(button.dataset.edit)));
  tbody.querySelectorAll("[data-delete]").forEach(button =>
    button.addEventListener("click", () => deleteProduct(button.dataset.delete)));
}

function resetForm() {
  form.reset();
  idInput.value = "";
  document.getElementById("form-title").textContent = "Tambah produk";
  document.getElementById("save-button").textContent = "Simpan produk";
  document.getElementById("cancel-edit").classList.add("hidden");
}

function editProduct(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  idInput.value = product.id;
  nameInput.value = product.name;
  priceInput.value = product.price;
  categoryInput.value = product.category;
  imageInput.value = product.image || "";
  descriptionInput.value = product.description || "";
  document.getElementById("form-title").textContent = "Edit produk";
  document.getElementById("save-button").textContent = "Simpan perubahan";
  document.getElementById("cancel-edit").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteProduct(id) {
  const product = products.find(p => p.id === id);
  if (!product || !confirm(`Hapus produk "${product.name}"?`)) return;
  products = products.filter(p => p.id !== id);
  saveProducts();
  renderAdminProducts();
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const name = nameInput.value.trim();
  const price = Number(priceInput.value);
  if (!name || !Number.isFinite(price) || price < 0) {
    alert("Periksa kembali nama dan harga produk.");
    return;
  }

  const productData = {
    id: idInput.value || `p-${Date.now()}`,
    name,
    price,
    category: categoryInput.value,
    image: imageInput.value.trim() || "https://placehold.co/500x350/eaf1ff/14264f?text=Produk",
    description: descriptionInput.value.trim()
  };

  if (idInput.value) {
    products = products.map(p => p.id === idInput.value ? productData : p);
  } else {
    products.push(productData);
  }

  saveProducts();
  resetForm();
  renderAdminProducts();
  alert("Produk berhasil disimpan di browser ini.");
});

document.getElementById("cancel-edit").addEventListener("click", resetForm);

document.getElementById("reset-products").addEventListener("click", () => {
  if (!confirm("Pulihkan daftar contoh produk? Produk yang sekarang akan diganti.")) return;
  products = [...defaultProducts];
  saveProducts();
  resetForm();
  renderAdminProducts();
});

renderAdminProducts();
