const DEFAULT_PRODUCTS = [
 {id:1,name:"RAM DDR4 8GB",price:175000,category:"RAM",image:"",description:"RAM DDR4 8GB untuk komputer desktop."},
 {id:2,name:"SSD NVMe M.2 512GB",price:450000,category:"Storage",image:"",description:"Penyimpanan cepat untuk laptop dan PC."},
 {id:3,name:"Printer Canon iP2770",price:650000,category:"Printer",image:"",description:"Printer inkjet untuk kebutuhan rumah dan kantor."},
 {id:4,name:"Router WiFi",price:250000,category:"Networking",image:"",description:"Router untuk koneksi internet di rumah."},
 {id:5,name:"Adaptor 5V 2A",price:35000,category:"Aksesoris",image:"",description:"Adaptor daya 5V 2A."}
];
const WHATSAPP_NUMBER = "6281234567890"; // Ganti dengan nomor WhatsApp toko, format 62xxxxxxxx
let products = JSON.parse(localStorage.getItem("tekoProducts") || "null") || DEFAULT_PRODUCTS;
let cart = JSON.parse(localStorage.getItem("tekoCart") || "[]");
const rupiah = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
function saveProducts(){localStorage.setItem("tekoProducts",JSON.stringify(products))}
function renderProducts(){
 const q=(document.getElementById("search-input")?.value||"").toLowerCase();
 const cat=document.getElementById("category-filter")?.value||"Semua";
 const filtered=products.filter(p=>p.name.toLowerCase().includes(q)&&(cat==="Semua"||p.category===cat));
 const grid=document.getElementById("product-grid"); if(!grid)return;
 grid.innerHTML=filtered.length?filtered.map(p=>`<article class="product-card"><div class="product-image">${p.image?`<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" onerror="this.style.display='none'">`:'<span class="product-placeholder">▦</span>'}</div><div class="product-info"><span class="product-category">${escapeHtml(p.category)}</span><h3>${escapeHtml(p.name)}</h3><div class="price">${rupiah(p.price)}</div><button class="add-btn" onclick="addToCart(${p.id})">+ Keranjang</button></div></article>`).join(""):'<div class="empty-state">Produk tidak ditemukan.</div>';
}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function addToCart(id){const p=products.find(x=>x.id===id);if(!p)return;const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({id:p.id,qty:1});saveCart();showToast("Produk ditambahkan ke keranjang")}
function saveCart(){localStorage.setItem("tekoCart",JSON.stringify(cart));renderCart()}
function renderCart(){
 const count=cart.reduce((s,x)=>s+x.qty,0);const countEl=document.getElementById("cart-count");if(countEl)countEl.textContent=count;
 const items=document.getElementById("cart-items");if(!items)return;
 items.innerHTML=cart.length?cart.map(x=>{const p=products.find(y=>y.id===x.id);return p?`<div class="cart-row"><div><b>${escapeHtml(p.name)}</b><small>${rupiah(p.price)} × ${x.qty}</small><div class="qty-controls"><button onclick="changeQty(${x.id},-1)">−</button>${x.qty}<button onclick="changeQty(${x.id},1)">+</button></div></div><b>${rupiah(p.price*x.qty)}</b></div>`:""}).join(""):'<p class="empty-state">Keranjang masih kosong.</p>';
 const total=cart.reduce((s,x)=>{const p=products.find(y=>y.id===x.id);return s+(p?p.price*x.qty:0)},0);document.getElementById("cart-total").textContent=rupiah(total);
}
function changeQty(id,d){const x=cart.find(y=>y.id===id);if(!x)return;x.qty+=d;if(x.qty<=0)cart=cart.filter(y=>y.id!==id);saveCart()}
function toggleCart(){document.getElementById("cart-panel").classList.toggle("hidden");renderCart()}
function checkoutWhatsApp(){
 if(!cart.length){showToast("Keranjang masih kosong");return}
 const lines=cart.map(x=>{const p=products.find(y=>y.id===x.id);return p?`- ${p.name} (${x.qty} x ${rupiah(p.price)}) = ${rupiah(p.price*x.qty)}`:""}).filter(Boolean);
 const total=cart.reduce((s,x)=>s+(products.find(p=>p.id===x.id)?.price||0)*x.qty,0);
 const msg=`Halo TEKO TUKU, saya ingin memesan:%0A${encodeURIComponent(lines.join("\n"))}%0A%0ATotal: ${encodeURIComponent(rupiah(total))}`;
 window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`,"_blank");
}
function showToast(msg){const el=document.getElementById("toast");if(!el)return;el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),1800)}
document.getElementById("year")?.append(new Date().getFullYear());renderProducts();renderCart();
