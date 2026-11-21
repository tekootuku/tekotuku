const defaults=[{id:1,name:"RAM DDR4 8GB",price:175000,category:"RAM",image:"",description:"RAM DDR4 8GB untuk komputer desktop."},{id:2,name:"SSD NVMe M.2 512GB",price:450000,category:"Storage",image:"",description:"Penyimpanan cepat untuk laptop dan PC."},{id:3,name:"Printer Canon iP2770",price:650000,category:"Printer",image:"",description:"Printer inkjet untuk kebutuhan rumah dan kantor."},{id:4,name:"Router WiFi",price:250000,category:"Networking",image:"",description:"Router untuk koneksi internet di rumah."},{id:5,name:"Adaptor 5V 2A",price:35000,category:"Aksesoris",image:"",description:"Adaptor daya 5V 2A."}];
const DEFAULT_CATEGORIES=["RAM","Storage","Printer","Networking","Aksesoris"];
let products=JSON.parse(localStorage.getItem("tekoProducts")||"null")||defaults;
let categories=JSON.parse(localStorage.getItem("tekoCategories")||"null")||DEFAULT_CATEGORIES.slice();
const $=id=>document.getElementById(id);const rupiah=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
function save(){localStorage.setItem("tekoProducts",JSON.stringify(products));render()}
function saveCategories(){localStorage.setItem("tekoCategories",JSON.stringify(categories))}
function allCategories(){return [...new Set([...categories,...products.map(p=>p.category).filter(Boolean)])]}
function safe(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderCategoryOptions(selected=""){
 const options=allCategories();
 $("category").innerHTML='<option value="">Pilih kategori</option>'+options.map(c=>`<option value="${safe(c)}"${c===selected?" selected":""}>${safe(c)}</option>`).join("");
}
function renderCategories(){
 const list=$("category-list");
 list.innerHTML=categories.length?categories.map((c,i)=>`<span class="category-item">${safe(c)}<button type="button" onclick="deleteCategory(${i})" aria-label="Hapus kategori ${safe(c)}">✕</button></span>`).join(""):'<p class="muted-note">Belum ada kategori.</p>';
}
function addCategory(e){
 e.preventDefault();
 const input=$("new-category");const name=input.value.trim();
 if(!name)return;
 if(categories.some(c=>c.toLowerCase()===name.toLowerCase())){alert("Kategori itu sudah ada.");return}
 categories.push(name);saveCategories();input.value="";renderCategories();renderCategoryOptions($("category").value);
}
function deleteCategory(index){
 const name=categories[index];if(name===undefined)return;
 if(products.some(p=>p.category===name)){alert(`Kategori "${name}" masih dipakai produk. Ubah kategori produk tersebut terlebih dahulu.`);return}
 if(!confirm(`Hapus kategori "${name}"?`))return;
 categories.splice(index,1);saveCategories();renderCategories();renderCategoryOptions($("category").value);
}
function render(){$("admin-products").innerHTML=products.map(p=>`<tr><td><b>${safe(p.name)}</b></td><td>${safe(p.category)}</td><td>${rupiah(p.price)}</td><td><button class="small-btn" onclick="editProduct(${p.id})">Edit</button><button class="small-btn danger" onclick="deleteProduct(${p.id})">Hapus</button></td></tr>`).join("")||'<tr><td colspan="4">Belum ada produk.</td></tr>'}
$("product-form").addEventListener("submit",e=>{e.preventDefault();const id=Number($("product-id").value);const p={id:id||Date.now(),name:$("name").value.trim(),price:Number($("price").value),category:$("category").value,image:$("image").value.trim(),description:$("description").value.trim()};if(!p.name||p.price<0||!p.category)return;if(id)products=products.map(x=>x.id===id?p:x);else products.push(p);save();resetForm();alert("Produk berhasil disimpan.")});
$("category-form").addEventListener("submit",addCategory);
function editProduct(id){const p=products.find(x=>x.id===id);if(!p)return;renderCategoryOptions(p.category);$("product-id").value=p.id;$("name").value=p.name;$("price").value=p.price;$("category").value=p.category;$("image").value=p.image||"";$("description").value=p.description||"";$("save-button").textContent="Perbarui produk";window.scrollTo({top:0,behavior:"smooth"})}
function deleteProduct(id){if(confirm("Hapus produk ini?")){products=products.filter(x=>x.id!==id);save();renderCategoryOptions($("category").value)}}
function resetForm(){$("product-form").reset();$("product-id").value="";$("save-button").textContent="Simpan produk";renderCategoryOptions("")}
renderCategories();renderCategoryOptions();render();
