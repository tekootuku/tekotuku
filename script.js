const DEFAULT_PRODUCTS = [
 {id:1,name:"RAM DDR4 8GB",price:175000,category:"RAM",image:"",description:"RAM DDR4 8GB untuk komputer desktop."},
 {id:2,name:"SSD NVMe M.2 512GB",price:450000,category:"Storage",image:"",description:"Penyimpanan cepat untuk laptop dan PC."},
 {id:3,name:"Printer Canon iP2770",price:650000,category:"Printer",image:"",description:"Printer inkjet untuk kebutuhan rumah dan kantor."},
 {id:4,name:"Router WiFi",price:250000,category:"Networking",image:"",description:"Router untuk koneksi internet di rumah."},
 {id:5,name:"Adaptor 5V 2A",price:35000,category:"Aksesoris",image:"",description:"Adaptor daya 5V 2A."}
];
const DEFAULT_CATEGORIES = ["RAM","Storage","Printer","Networking","Aksesoris"];
const WHATSAPP_NUMBER = "6281234567890"; // Ganti dengan nomor WhatsApp toko, format 62xxxxxxxx
let products = JSON.parse(localStorage.getItem("tekoProducts") || "null") || DEFAULT_PRODUCTS;
let categories = JSON.parse(localStorage.getItem("tekoCategories") || "null") || DEFAULT_CATEGORIES.slice();
let cart = JSON.parse(localStorage.getItem("tekoCart") || "[]");
const rupiah = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
function saveProducts(){localStorage.setItem("tekoProducts",JSON.stringify(products))}
function allCategories(){return [...new Set([...categories,...products.map(p=>p.category).filter(Boolean)])]}
function renderCategoryFilters(){
 const values=allCategories();
 document.querySelectorAll("#category-filter").forEach(sel=>{
  const current=sel.value||"Semua";
  sel.innerHTML='<option value="Semua">Semua kategori</option>'+values.map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  sel.value=current==="Semua"||values.includes(current)?current:"Semua";
 });
}
window.addEventListener("storage",e=>{
 if(e.key==="tekoProducts"){products=JSON.parse(e.newValue||"null")||DEFAULT_PRODUCTS;renderCategoryFilters();renderProducts();renderCart()}
 if(e.key==="tekoCategories"){categories=JSON.parse(e.newValue||"null")||DEFAULT_CATEGORIES.slice();renderCategoryFilters();renderProducts()}
});
function renderProducts(){
 const q=(document.getElementById("search-input")?.value||"").toLowerCase();
 const cat=document.getElementById("category-filter")?.value||"Semua";
 const filtered=products.filter(p=>p.name.toLowerCase().includes(q)&&(cat==="Semua"||p.category===cat));
 const grid=document.getElementById("product-grid"); if(!grid)return;
 grid.innerHTML=filtered.length?filtered.map(p=>`<article class="product-card" role="button" tabindex="0" onclick="openProduct(${p.id})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openProduct(${p.id})}"><div class="product-image">${p.image?`<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" onerror="this.style.display='none'">`:'<span class="product-placeholder">▦</span>'}</div><div class="product-info"><span class="product-category">${escapeHtml(p.category)}</span><h3>${escapeHtml(p.name)}</h3><div class="price">${rupiah(p.price)}</div><button class="add-btn" onclick="event.stopPropagation();addToCart(${p.id})">+ Keranjang</button></div></article>`).join(""):'<div class="empty-state">Produk tidak ditemukan.</div>';
}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function addToCart(id){const p=products.find(x=>x.id===id);if(!p)return;const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({id:p.id,qty:1});saveCart();showToast("Produk ditambahkan ke keranjang")}
function saveCart(){localStorage.setItem("tekoCart",JSON.stringify(cart));renderCart()}
function renderCart(){
 const count=cart.reduce((s,x)=>s+x.qty,0);const countEl=document.getElementById("cart-count");if(countEl)countEl.textContent=count;
 const items=document.getElementById("cart-items");if(!items)return;
 items.innerHTML=cart.length?cart.map(x=>{const p=products.find(y=>y.id===x.id);return p?`<div class="cart-row"><div><b>${escapeHtml(p.name)}</b><small>${rupiah(p.price)} × ${x.qty}</small><div class="qty-controls"><button data-cart-action="qty-down" data-id="${x.id}">−</button>${x.qty}<button data-cart-action="qty-up" data-id="${x.id}">+</button></div></div><div class="cart-row-right"><b>${rupiah(p.price*x.qty)}</b><button class="remove-btn" data-cart-action="remove" data-id="${x.id}" aria-label="Hapus ${escapeHtml(p.name)}">Hapus</button></div></div>`:""}).join(""):'<p class="empty-state">Keranjang masih kosong.</p>';
 const total=cart.reduce((s,x)=>{const p=products.find(y=>y.id===x.id);return s+(p?p.price*x.qty:0)},0);document.getElementById("cart-total").textContent=rupiah(total);
}
function changeQty(id,d){const x=cart.find(y=>y.id===id);if(!x)return;x.qty+=d;if(x.qty<=0)cart=cart.filter(y=>y.id!==id);saveCart()}
function removeFromCart(id){const p=products.find(x=>x.id===id);cart=cart.filter(x=>x.id!==id);saveCart();showToast(p?`${p.name} dihapus dari keranjang`:"Produk dihapus dari keranjang")}
function toggleCart(){document.getElementById("cart-panel").classList.toggle("hidden");renderCart()}
function checkoutWhatsApp(){
 if(!cart.length){showToast("Keranjang masih kosong");return}
 const lines=cart.map(x=>{const p=products.find(y=>y.id===x.id);return p?`- ${p.name} (${x.qty} x ${rupiah(p.price)}) = ${rupiah(p.price*x.qty)}`:""}).filter(Boolean);
 const total=cart.reduce((s,x)=>s+(products.find(p=>p.id===x.id)?.price||0)*x.qty,0);
 const msg=`Halo TEKO TUKU, saya ingin memesan:%0A${encodeURIComponent(lines.join("\n"))}%0A%0ATotal: ${encodeURIComponent(rupiah(total))}`;
 window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`,"_blank");
}
function openProduct(id){
 const p=products.find(x=>x.id===id);if(!p)return;
 const modal=document.getElementById("product-modal");if(!modal)return;
 const imageEl=document.getElementById("detail-image");
 imageEl.innerHTML=p.image?`<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}">`:'<span class="product-placeholder">▦</span>';
 document.getElementById("detail-category").textContent=p.category;
 document.getElementById("detail-name").textContent=p.name;
 document.getElementById("detail-price").textContent=rupiah(p.price);
 document.getElementById("detail-description").textContent=p.description||"Deskripsi belum tersedia.";
 const btn=document.getElementById("detail-add");
 btn.onclick=function(ev){ev.stopPropagation();addToCart(p.id)};
 modal.classList.remove("hidden");
 document.body.style.overflow="hidden";
 document.getElementById("detail-close").focus();
}
function closeProduct(){
 const modal=document.getElementById("product-modal");if(!modal)return;
 modal.classList.add("hidden");
 document.body.style.overflow="";
}
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeProduct()});
function submitFeedback(e){
 e.preventDefault();
 const form=e.target;
 const name=document.getElementById("feedback-name").value.trim();
 const email=document.getElementById("feedback-email").value.trim();
 const message=document.getElementById("feedback-message").value.trim();
 if(!name||!message)return;
 const list=JSON.parse(localStorage.getItem("tekoFeedback")||"[]");
 list.push({name:name,email:email,message:message,date:new Date().toISOString()});
 localStorage.setItem("tekoFeedback",JSON.stringify(list));
 const text=["Kritik & Saran TEKO TUKU","Nama: "+name,"Email: "+(email||"-"),"",message].join("\n");
 window.open("https://wa.me/"+WHATSAPP_NUMBER+"?text="+encodeURIComponent(text),"_blank");
 const success=document.getElementById("feedback-success");if(success)success.classList.remove("hidden");
 form.reset();showToast("Terima kasih atas kritik dan saranmu");
}
function showToast(msg){const el=document.getElementById("toast");if(!el)return;el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),1800)}
document.getElementById("cart-items")?.addEventListener("click",e=>{
 const btn=e.target.closest("button[data-cart-action]");if(!btn)return;
 const id=Number(btn.dataset.id);
 if(btn.dataset.cartAction==="remove")removeFromCart(id);
 if(btn.dataset.cartAction==="qty-up")changeQty(id,1);
 if(btn.dataset.cartAction==="qty-down")changeQty(id,-1);
});
document.getElementById("year")?.append(new Date().getFullYear());renderCategoryFilters();renderProducts();renderCart();
