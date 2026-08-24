// LocalStorage Database Schema
const DEFAULT_PRODUCTS = [
  {
    id: '1',
    title: 'Whole Hard Body Chicken',
    price: 120,
    desc: 'Freshly dressed whole farm chicken. Healthy and flavorful.',
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '2',
    title: 'Live Broiler Chicken',
    price: 110,
    desc: 'Large live farm-reared chicken ready for pickup.',
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: '3',
    title: 'Chicken Braai Pack (2kg)',
    price: 150,
    desc: 'Assorted fresh cuts: thighs, drumsticks, and wings.',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=600'
  }
];

const PHONE_NUMBER = "27799493258"; // Witbank Contact Number

// Database Utilities
function getStoredProducts() {
  const data = localStorage.getItem('buyzana_products');
  return data ? JSON.parse(data) : DEFAULT_PRODUCTS;
}

function saveProducts(products) {
  localStorage.setItem('buyzana_products', JSON.stringify(products));
}

function getStoredLogo() {
  return localStorage.getItem('buyzana_logo') || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=200';
}

function saveLogo(url) {
  localStorage.setItem('buyzana_logo', url);
}

// Render Products to Front-End
function renderProducts() {
  const grid = document.getElementById('productGrid');
  const products = getStoredProducts();

  grid.innerHTML = products.map(p => {
    const waText = encodeURIComponent(`Hello Buy Zana Chicken, I would like to order: ${p.title} - R${p.price}`);
    return `
      <div class="product-card">
        <img src="${p.image}" alt="${p.title}" class="product-img">
        <div class="product-info">
          <h3 class="product-title">${p.title}</h3>
          <p class="product-desc">${p.desc}</p>
          <div class="product-bottom">
            <span class="price">R ${parseFloat(p.price).toFixed(2)}</span>
            <a href="https://wa.me/${PHONE_NUMBER}?text=${waText}" target="_blank" class="btn-whatsapp">
              Order WhatsApp
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Load Logo
function renderLogo() {
  const logoUrl = getStoredLogo();
  document.getElementById('siteLogo').src = logoUrl;
}

// Admin Modal Logic
const modal = document.getElementById('adminModal');
const adminToggleBtn = document.getElementById('adminToggleBtn');
const closeBtn = document.getElementById('closeAdminModal');

adminToggleBtn.onclick = () => modal.classList.add('active');
closeBtn.onclick = () => modal.classList.remove('active');

// Admin PIN Authentication
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const pin = document.getElementById('pinInput').value;
  if(pin === '1234') { // Admin PIN
    document.getElementById('adminLoginView').classList.add('hidden');
    document.getElementById('adminDashboardView').classList.remove('hidden');
    renderAdminProducts();
  } else {
    alert('Incorrect Admin PIN. Default is 1234');
  }
});

// Admin Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  };
});

// Render Editable Prices in Admin Panel
function renderAdminProducts() {
  const container = document.getElementById('adminProductList');
  const products = getStoredProducts();

  container.innerHTML = products.map(p => `
    <div class="admin-item-row">
      <span><strong>${p.title}</strong></span>
      <div>
        R <input type="number" value="${p.price}" step="0.01" onchange="updatePrice('${p.id}', this.value)">
        <button class="btn-secondary" style="color:red; margin-left: 8px;" onclick="deleteProduct('${p.id}')">&times;</button>
      </div>
    </div>
  `).join('');
}

window.updatePrice = (id, newPrice) => {
  const products = getStoredProducts();
  const index = products.findIndex(p => p.id === id);
  if(index !== -1) {
    products[index].price = parseFloat(newPrice);
    saveProducts(products);
    renderProducts();
  }
};

window.deleteProduct = (id) => {
  if(confirm('Are you sure you want to delete this product?')) {
    let products = getStoredProducts();
    products = products.filter(p => p.id !== id);
    saveProducts(products);
    renderProducts();
    renderAdminProducts();
  }
};

// Generic Drag and Drop File Handler
function setupDragAndDrop(areaId, inputId, previewId, callback) {
  const area = document.getElementById(areaId);
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  area.onclick = () => input.click();

  area.ondragover = (e) => { e.preventDefault(); area.classList.add('active'); };
  area.ondragleave = () => area.classList.remove('active');
  
  area.ondrop = (e) => {
    e.preventDefault();
    area.classList.remove('active');
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  };

  input.onchange = () => {
    if (input.files.length) handleFile(input.files[0]);
  };

  function handleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgData = e.target.result;
      preview.innerHTML = `<img src="${imgData}" alt="Upload Preview">`;
      callback(imgData);
    };
    reader.readAsDataURL(file);
  }
}

// Logo Drag & Drop Setup
let currentLogoData = null;
setupDragAndDrop('logoDragArea', 'logoFileInput', 'logoPreviewContainer', (dataUrl) => {
  currentLogoData = dataUrl;
  saveLogo(dataUrl);
  renderLogo();
  alert('Logo updated successfully!');
});

// New Product Photo Setup
let currentProductPhotoData = null;
setupDragAndDrop('productDragArea', 'productFileInput', 'productPreviewContainer', (dataUrl) => {
  currentProductPhotoData = dataUrl;
});

// Add New Product
document.getElementById('addProductForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('newTitle').value;
  const price = document.getElementById('newPrice').value;
  const desc = document.getElementById('newDesc').value;

  const newProduct = {
    id: Date.now().toString(),
    title,
    price: parseFloat(price),
    desc,
    image: currentProductPhotoData || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=600'
  };

  const products = getStoredProducts();
  products.push(newProduct);
  saveProducts(products);

  renderProducts();
  renderAdminProducts();

  // Reset form
  e.target.reset();
  document.getElementById('productPreviewContainer').innerHTML = '';
  currentProductPhotoData = null;
  alert('New Product added successfully!');
});

// Initial Setup
renderLogo();
renderProducts();