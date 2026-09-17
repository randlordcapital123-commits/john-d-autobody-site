/* =========================================================
   JOHN D AUTOBODY - MAIN SCRIPT
   All data is stored in localStorage. No cloud, no external DB.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- STORAGE KEYS ---------- */
  const STORE_KEY = 'jda_data_v1';
  const AUTH_KEY  = 'jda_auth_v1';
  const PASS_KEY  = 'jda_pass_v1';
  const DEFAULT_PASS = 'admin123';

  /* ---------- PLACEHOLDER IMAGES (used only as defaults, can be replaced) ---------- */
  const PH = {
    hero:  'https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=1600&q=80',
    about: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    logo:  'data:image/svg+xml;utf8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%23ff6a1a"/><stop offset="1" stop-color="%23ffa229"/></linearGradient></defs><rect width="100" height="100" rx="22" fill="url(%23g)"/><text x="50" y="62" font-family="Arial,sans-serif" font-size="42" font-weight="900" fill="white" text-anchor="middle">JD</text></svg>'
    ),
    service1: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=900&q=80',
    service2: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
    service3: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80',
    service4: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
    service5: 'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?auto=format&fit=crop&w=900&q=80',
    service6: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
    g1: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80',
    g2: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80',
    g3: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80',
    g4: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
    g5: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
    g6: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=900&q=80'
  };

  /* ---------- DEFAULT DATA ---------- */
  const DEFAULT_DATA = {
    business: {
      name: 'John D Autobody',
      tagline: 'Panel Beating & Car Care',
      phone: '+27 73 828 0529',
      whatsapp: '27738280529',
      email: 'info@johndautobody.co.za',
      address: '1039, Soweto, South Africa',
      hours: 'Mon - Fri: 07:30 - 18:00',
      heroSub: 'Expert panel beating, spray painting, dent removal, car wash and valet detailing, done right the first time. Quality workmanship, honest prices, fast turnaround.',
      aboutText: 'John D Autobody is a proudly local workshop based in Soweto, South Africa. For over 15 years we have been repairing, respraying and restoring vehicles of every make and model, from minor scratches to full accident damage. Our team combines old-school craftsmanship with modern spray-booth technology, so your car leaves looking showroom-fresh.'
    },
    images: {
      logo: PH.logo,
      hero: PH.hero,
      about: PH.about
    },
    services: [
      { id: 's1', name: 'Panel Beating', price: 'From R2 500', desc: 'Accident damage repair, chassis straightening and full panel replacement by certified panel beaters.', image: PH.service1 },
      { id: 's2', name: 'Spray Painting', price: 'From R1 800', desc: 'Professional spray booth respray with exact colour matching and a durable, high-gloss finish.', image: PH.service2 },
      { id: 's3', name: 'Dent & Scratch Removal', price: 'From R450', desc: 'Paintless dent removal and scratch polishing to bring your paintwork back to life.', image: PH.service3 },
      { id: 's4', name: 'Car Wash & Valet', price: 'From R120', desc: 'Full exterior wash, hand dry, interior vacuum and dashboard treatment for a showroom shine.', image: PH.service4 },
      { id: 's5', name: 'Interior Deep Clean', price: 'From R650', desc: 'Steam cleaning, carpet shampoo, seat extraction and odour removal for a fresh cabin.', image: PH.service5 },
      { id: 's6', name: 'Laundry & Ironing', price: 'From R80/kg', desc: 'Wash, dry, fold and iron service for overalls, workwear and household laundry.', image: PH.service6 }
    ],
    gallery: [
      { id: 'g1', image: PH.g1 },
      { id: 'g2', image: PH.g2 },
      { id: 'g3', image: PH.g3 },
      { id: 'g4', image: PH.g4 },
      { id: 'g5', image: PH.g5 },
      { id: 'g6', image: PH.g6 }
    ]
  };

  /* ---------- STATE ---------- */
  let data = loadData();

  /* ---------- UTILITIES ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
  function uid(prefix) { return (prefix || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

  /* ---------- STORAGE ---------- */
  function loadData() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return deepClone(DEFAULT_DATA);
      const parsed = JSON.parse(raw);
      // merge with defaults for safety
      return {
        business: Object.assign({}, DEFAULT_DATA.business, parsed.business || {}),
        images:   Object.assign({}, DEFAULT_DATA.images,   parsed.images   || {}),
        services: Array.isArray(parsed.services) ? parsed.services : deepClone(DEFAULT_DATA.services),
        gallery:  Array.isArray(parsed.gallery)  ? parsed.gallery  : deepClone(DEFAULT_DATA.gallery)
      };
    } catch (e) {
      return deepClone(DEFAULT_DATA);
    }
  }

  function saveData() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(data));
    } catch (e) {
      showToast('Storage full. Try smaller images.', true);
    }
  }

  function getPassword() {
    return localStorage.getItem(PASS_KEY) || DEFAULT_PASS;
  }
  function setPassword(pw) {
    localStorage.setItem(PASS_KEY, pw);
  }
  function isLoggedIn() {
    return sessionStorage.getItem(AUTH_KEY) === 'yes';
  }
  function setLoggedIn(v) {
    if (v) sessionStorage.setItem(AUTH_KEY, 'yes');
    else sessionStorage.removeItem(AUTH_KEY);
  }

  /* ---------- WHATSAPP LINKS ---------- */
  function waLink(message) {
    const num = (data.business.whatsapp || '27738280529').replace(/\D/g, '');
    return 'https://wa.me/' + num + '?text=' + encodeURIComponent(message || 'Hi John D Autobody, I would like a quote please.');
  }
  function telLink() {
    const raw = (data.business.phone || '+27738280529').replace(/[^\d+]/g, '');
    return 'tel:' + raw;
  }
  function mailLink() {
    return 'mailto:' + (data.business.email || 'info@johndautobody.co.za');
  }

  /* ---------- TOAST ---------- */
  let toastTimer;
  function showToast(msg, isError) {
    const t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.toggle('error', !!isError);
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* ---------- IMAGE COMPRESSION ---------- */
  function compressImage(file, maxDim, quality) {
    maxDim = maxDim || 1400;
    quality = quality || 0.82;
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        return reject(new Error('Not an image'));
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > height && width > maxDim) {
            height = Math.round(height * (maxDim / width));
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round(width * (maxDim / height));
            height = maxDim;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          try {
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(dataUrl);
          } catch (err) { reject(err); }
        };
        img.onerror = () => reject(new Error('Image load failed'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('File read failed'));
      reader.readAsDataURL(file);
    });
  }

  /* =========================================================
     PUBLIC RENDER
     ========================================================= */
  function renderBusiness() {
    const b = data.business;
    const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || ''; };

    setText('brandName', b.name);
    setText('brandTag', b.tagline);
    setText('topAddress', b.address);
    setText('topHours', b.hours);
    setText('heroSub', b.heroSub);
    setText('aboutText', b.aboutText);
    setText('cPhone', b.phone);
    setText('cWhatsNum', b.phone);
    setText('cAddress', b.address);
    setText('cHours', b.hours);
    setText('footerName', b.name);
    setText('footerTag', b.tagline);
    setText('fAddress', b.address);
    setText('fPhoneP', b.phone);
    setText('fEmailP', b.email);
    setText('fHoursP', b.hours);
    setText('fbName', b.name);

    const topPhone = document.getElementById('topPhone');
    if (topPhone) topPhone.href = telLink();

    // update page title
    document.title = b.name + ' | Panel Beating, Spray Painting & Car Care in Soweto';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', b.name + ' in Soweto - panel beating, spray painting, dent removal, car wash, valet detailing and laundry. Call or WhatsApp ' + b.phone + '.');
  }

  function renderImages() {
    const setImg = (id, src) => { const el = document.getElementById(id); if (el && src) el.src = src; };
    setImg('brandLogo', data.images.logo);
    setImg('footerLogo', data.images.logo);
    setImg('heroBg', data.images.hero);
    setImg('aboutImage', data.images.about);

    // favicon
    const fav = document.getElementById('favicon');
    if (fav && data.images.logo) fav.href = data.images.logo;
  }

  function renderContactLinks() {
    const wa = waLink('Hi John D Autobody, I would like to enquire about your services please.');
    ['heroWhats', 'cWhats', 'fWhats', 'floatWa', 'mobWhats', 'customQuote'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.href = wa;
    });

    ['heroCall', 'aboutQuote', 'fCall', 'mobCall'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.href = telLink();
    });

    const cCall = document.getElementById('cCall');
    if (cCall) cCall.href = telLink();

    const fMail = document.getElementById('fMail');
    if (fMail) fMail.href = mailLink();
  }

  function renderServices() {
    const grid = $('#servicesGrid');
    if (!grid) return;

    if (!data.services.length) {
      grid.innerHTML = '<div class="gallery-empty">No services added yet.</div>';
      return;
    }

    grid.innerHTML = data.services.map(s => {
      const msg = 'Hi John D Autobody, I would like to enquire about *' + s.name + '* (' + (s.price || 'price on request') + '). Please send me a quote.';
      return `
        <article class="service-card reveal">
          <div class="service-media">
            <img src="${escapeHtml(s.image)}" alt="${escapeHtml(s.name)}" loading="lazy">
            ${s.price ? `<span class="service-price">${escapeHtml(s.price)}</span>` : ''}
          </div>
          <div class="service-body">
            <h3>${escapeHtml(s.name)}</h3>
            <p>${escapeHtml(s.desc || '')}</p>
            <a class="service-wa" href="${waLink(msg)}" target="_blank" rel="noopener">
              <svg class="icon"><use href="#i-whatsapp"/></svg> Enquire On WhatsApp
            </a>
          </div>
        </article>
      `;
    }).join('');

    // fill contact form select
    const sel = $('#cfService');
    if (sel) {
      sel.innerHTML = '<option value="">Select a service</option>' +
        data.services.map(s => `<option value="${escapeHtml(s.name)}">${escapeHtml(s.name)}</option>`).join('') +
        '<option value="Other">Other / Custom job</option>';
    }

    observeReveals();
  }

  function renderGallery() {
    const grid = $('#galleryGrid');
    if (!grid) return;

    if (!data.gallery.length) {
      grid.innerHTML = '<div class="gallery-empty">No gallery images yet.</div>';
      return;
    }

    grid.innerHTML = data.gallery.map((g, i) => `
      <div class="gallery-item reveal" data-index="${i}">
        <img src="${escapeHtml(g.image)}" alt="John D Autobody project ${i + 1}" loading="lazy">
      </div>
    `).join('');

    $$('.gallery-item', grid).forEach(el => {
      el.addEventListener('click', () => openLightbox(parseInt(el.dataset.index, 10)));
    });

    observeReveals();
  }

  function renderAll() {
    renderBusiness();
    renderImages();
    renderContactLinks();
    renderServices();
    renderGallery();
  }

  /* =========================================================
     MOBILE NAV
     ========================================================= */
  function initNav() {
    const ham = $('#hamburger');
    const links = $('#navLinks');
    if (!ham || !links) return;

    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      links.classList.toggle('open');
    });

    $$('.nav-link, .nav-admin', links).forEach(a => {
      a.addEventListener('click', () => {
        ham.classList.remove('open');
        links.classList.remove('open');
      });
    });

    // scrolled state
    const nav = $('#nav');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }, { passive: true });

    // active link on scroll
    const sections = ['home', 'about', 'services', 'gallery', 'contact'];
    window.addEventListener('scroll', () => {
      let current = 'home';
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 140) current = id;
      });
      $$('.nav-link').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });
    }, { passive: true });
  }

  /* =========================================================
     REVEAL ON SCROLL
     ========================================================= */
  let revealObserver;
  function observeReveals() {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal').forEach(el => el.classList.add('in'));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            revealObserver.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    }
    $$('.reveal:not(.in)').forEach(el => revealObserver.observe(el));
  }

  /* =========================================================
     COUNTERS
     ========================================================= */
  function initCounters() {
    const stats = $$('.stat strong[data-count]');
    if (!stats.length) return;

    const animate = (el) => {
      const target = parseFloat(el.dataset.count) || 0;
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.floor(target * eased);
        el.textContent = val.toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString() + suffix;
      };
      requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) {
      stats.forEach(animate);
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animate(e.target);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    stats.forEach(s => obs.observe(s));
  }

  /* =========================================================
     LIGHTBOX
     ========================================================= */
  let lbIndex = 0;
  function openLightbox(i) {
    if (!data.gallery.length) return;
    lbIndex = i;
    const lb = $('#lightbox');
    const img = $('#lbImg');
    img.src = data.gallery[lbIndex].image;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    const lb = $('#lightbox');
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function navLightbox(dir) {
    if (!data.gallery.length) return;
    lbIndex = (lbIndex + dir + data.gallery.length) % data.gallery.length;
    $('#lbImg').src = data.gallery[lbIndex].image;
  }
  function initLightbox() {
    $('#lbClose').addEventListener('click', closeLightbox);
    $('#lbPrev').addEventListener('click', (e) => { e.stopPropagation(); navLightbox(-1); });
    $('#lbNext').addEventListener('click', (e) => { e.stopPropagation(); navLightbox(1); });
    $('#lightbox').addEventListener('click', (e) => { if (e.target.id === 'lightbox') closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!$('#lightbox').classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navLightbox(-1);
      if (e.key === 'ArrowRight') navLightbox(1);
    });
  }

  /* =========================================================
     CONTACT FORM -> WHATSAPP
     ========================================================= */
  function initContactForm() {
    const form = $('#contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#cfName').value.trim();
      const phone = $('#cfPhone').value.trim();
      const service = $('#cfService').value;
      const msg = $('#cfMsg').value.trim();

      let text = 'Hi John D Autobody,%0A%0A';
      text += 'Name: ' + name + '%0A';
      text += 'Phone: ' + phone + '%0A';
      if (service) text += 'Service: ' + service + '%0A';
      if (msg) text += 'Details: ' + msg + '%0A';
      text += '%0APlease send me a quote.';

      const num = (data.business.whatsapp || '27738280529').replace(/\D/g, '');
      const url = 'https://wa.me/' + num + '?text=' + text;
      window.open(url, '_blank');
      showToast('Opening WhatsApp...');
    });
  }

  /* =========================================================
     ADMIN PANEL
     ========================================================= */
  function openAdmin() {
    $('#adminOverlay').classList.add('open');
    $('#adminOverlay').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (isLoggedIn()) {
      showDashboard();
    } else {
      showLogin();
    }
  }

  function closeAdmin() {
    $('#adminOverlay').classList.remove('open');
    $('#adminOverlay').setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showLogin() {
    $('#adminLogin').classList.remove('hidden');
    $('#adminDash').classList.add('hidden');
    $('#adminLogout').classList.add('hidden');
    $('#loginError').textContent = '';
    $('#loginPass').value = '';
    setTimeout(() => $('#loginPass').focus(), 100);
  }

  function showDashboard() {
    $('#adminLogin').classList.add('hidden');
    $('#adminDash').classList.remove('hidden');
    $('#adminLogout').classList.remove('hidden');
    renderAdminServices();
    renderAdminGallery();
    fillBusinessForm();
    fillBrandingPreviews();
  }

  /* ---------- ADMIN TABS ---------- */
  function initAdminTabs() {
    const tabs = $$('#adminTabs button');
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        $$('.panel').forEach(p => p.classList.add('hidden'));
        const panel = document.getElementById('panel-' + btn.dataset.tab);
        if (panel) panel.classList.remove('hidden');
      });
    });
  }

  /* ---------- LOGIN ---------- */
  function initLogin() {
    $('#loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const pass = $('#loginPass').value;
      if (pass === getPassword()) {
        setLoggedIn(true);
        showDashboard();
        showToast('Welcome back!');
      } else {
        $('#loginError').textContent = 'Incorrect password. Please try again.';
        $('#loginPass').value = '';
      }
    });

    $('#adminLogout').addEventListener('click', () => {
      setLoggedIn(false);
      showLogin();
      showToast('Logged out');
    });

    $('#adminClose').addEventListener('click', closeAdmin);
    $('#navAdmin').addEventListener('click', openAdmin);
    $('#footerAdmin').addEventListener('click', openAdmin);
  }

  /* ---------- ADMIN SERVICES ---------- */
  function renderAdminServices() {
    const list = $('#serviceAdminList');
    if (!list) return;

    if (!data.services.length) {
      list.innerHTML = '<div class="gallery-empty">No services yet. Click "Add Service" to start.</div>';
      return;
    }

    list.innerHTML = data.services.map(s => `
      <div class="admin-row" data-id="${s.id}">
        <img src="${escapeHtml(s.image)}" alt="">
        <div class="admin-row-info">
          <h4>${escapeHtml(s.name)}</h4>
          <p>${escapeHtml((s.desc || '').slice(0, 90))}${(s.desc || '').length > 90 ? '...' : ''}</p>
          ${s.price ? `<span class="price">${escapeHtml(s.price)}</span>` : ''}
        </div>
        <div class="admin-row-actions">
          <button class="row-btn" data-act="edit" data-id="${s.id}" title="Edit">
            <svg class="icon"><use href="#i-edit"/></svg>
          </button>
          <button class="row-btn danger" data-act="del" data-id="${s.id}" title="Delete">
            <svg class="icon"><use href="#i-trash"/></svg>
          </button>
        </div>
      </div>
    `).join('');

    $$('#serviceAdminList .row-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (btn.dataset.act === 'edit') editService(id);
        else if (btn.dataset.act === 'del') deleteService(id);
      });
    });
  }

  let editingServiceId = null;
  let pendingServiceImage = null;

  function initServiceForm() {
    const form = $('#serviceForm');
    const addBtn = $('#addServiceBtn');
    const cancelBtn = $('#cancelService');

    addBtn.addEventListener('click', () => {
      editingServiceId = null;
      pendingServiceImage = null;
      form.reset();
      $('#svcId').value = '';
      const dz = form.querySelector('.dropzone');
      const prev = dz.querySelector('.dz-preview');
      prev.classList.remove('show');
      prev.src = '';
      form.classList.remove('hidden');
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => $('#svcName').focus(), 250);
    });

    cancelBtn.addEventListener('click', () => {
      form.classList.add('hidden');
      form.reset();
      editingServiceId = null;
      pendingServiceImage = null;
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#svcName').value.trim();
      const price = $('#svcPrice').value.trim();
      const desc = $('#svcDesc').value.trim();
      if (!name) return;

      if (editingServiceId) {
        const s = data.services.find(x => x.id === editingServiceId);
        if (s) {
          s.name = name;
          s.price = price;
          s.desc = desc;
          if (pendingServiceImage) s.image = pendingServiceImage;
        }
        showToast('Service updated');
      } else {
        data.services.push({
          id: uid('svc'),
          name, price, desc,
          image: pendingServiceImage || PH.service1
        });
        showToast('Service added');
      }

      saveData();
      form.classList.add('hidden');
      form.reset();
      editingServiceId = null;
      pendingServiceImage = null;
      renderAdminServices();
      renderServices();
    });
  }

  function editService(id) {
    const s = data.services.find(x => x.id === id);
    if (!s) return;
    editingServiceId = id;
    pendingServiceImage = null;

    $('#svcName').value = s.name || '';
    $('#svcPrice').value = s.price || '';
    $('#svcDesc').value = s.desc || '';

    const form = $('#serviceForm');
    const dz = form.querySelector('.dropzone');
    const prev = dz.querySelector('.dz-preview');
    if (s.image) {
      prev.src = s.image;
      prev.classList.add('show');
    } else {
      prev.classList.remove('show');
    }

    form.classList.remove('hidden');
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function deleteService(id) {
    if (!confirm('Delete this service? This cannot be undone.')) return;
    data.services = data.services.filter(s => s.id !== id);
    saveData();
    renderAdminServices();
    renderServices();
    showToast('Service deleted');
  }

  /* ---------- DROPZONES ---------- */
  function initDropzones() {
    $$('.dropzone').forEach(dz => {
      const input = dz.querySelector('input[type="file"]');
      const preview = dz.querySelector('.dz-preview');
      const type = dz.dataset.drop;

      dz.addEventListener('click', () => input.click());

      ['dragenter', 'dragover'].forEach(ev => {
        dz.addEventListener(ev, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dz.classList.add('dragover');
        });
      });
      ['dragleave', 'drop'].forEach(ev => {
        dz.addEventListener(ev, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dz.classList.remove('dragover');
        });
      });

      dz.addEventListener('drop', async (e) => {
        const files = Array.from(e.dataTransfer.files || []);
        await handleFiles(files, type, preview);
      });

      input.addEventListener('change', async () => {
        const files = Array.from(input.files || []);
        await handleFiles(files, type, preview);
        input.value = '';
      });
    });
  }

  async function handleFiles(files, type, preview) {
    if (!files.length) return;

    if (type === 'gallery') {
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        try {
          const dataUrl = await compressImage(file, 1400, 0.8);
          data.gallery.push({ id: uid('gal'), image: dataUrl });
        } catch (err) { console.warn(err); }
      }
      saveData();
      renderAdminGallery();
      renderGallery();
      showToast(files.length + ' image(s) added to gallery');
      return;
    }

    // single-image dropzones
    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    try {
      const dataUrl = await compressImage(file, type === 'logo' ? 500 : 1600, type === 'logo' ? 0.9 : 0.82);

      if (type === 'service') {
        pendingServiceImage = dataUrl;
        if (preview) { preview.src = dataUrl; preview.classList.add('show'); }
        showToast('Image ready. Click "Save Service" to apply.');
      } else if (type === 'logo') {
        data.images.logo = dataUrl;
        saveData();
        renderImages();
        fillBrandingPreviews();
        showToast('Logo updated');
      } else if (type === 'hero') {
        data.images.hero = dataUrl;
        saveData();
        renderImages();
        fillBrandingPreviews();
        showToast('Hero image updated');
      } else if (type === 'about') {
        data.images.about = dataUrl;
        saveData();
        renderImages();
        fillBrandingPreviews();
        showToast('About image updated');
      }
    } catch (err) {
      showToast('Could not read that image', true);
    }
  }

  /* ---------- ADMIN GALLERY ---------- */
  function renderAdminGallery() {
    const wrap = $('#galleryAdmin');
    if (!wrap) return;

    if (!data.gallery.length) {
      wrap.innerHTML = '<div class="gallery-empty" style="grid-column:1/-1;">No images yet. Drop some above.</div>';
      return;
    }

    wrap.innerHTML = data.gallery.map((g, i) => `
      <div class="gal-admin-item">
        <img src="${escapeHtml(g.image)}" alt="">
        <button data-i="${i}" title="Delete">
          <svg class="icon"><use href="#i-trash"/></svg>
        </button>
      </div>
    `).join('');

    $$('#galleryAdmin button').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.i, 10);
        if (!confirm('Delete this gallery image?')) return;
        data.gallery.splice(i, 1);
        saveData();
        renderAdminGallery();
        renderGallery();
        showToast('Image removed');
      });
    });
  }

  /* ---------- BRANDING PREVIEWS ---------- */
  function fillBrandingPreviews() {
    const map = {
      logo: data.images.logo,
      hero: data.images.hero,
      about: data.images.about
    };
    Object.keys(map).forEach(key => {
      const dz = document.querySelector('.dropzone[data-drop="' + key + '"]');
      if (!dz) return;
      const prev = dz.querySelector('.dz-preview');
      if (map[key]) {
        prev.src = map[key];
        prev.classList.add('show');
      } else {
        prev.classList.remove('show');
      }
    });
  }

  /* ---------- BUSINESS FORM ---------- */
  function fillBusinessForm() {
    const b = data.business;
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
    set('bizName', b.name);
    set('bizTagline', b.tagline);
    set('bizPhone', b.phone);
    set('bizWhatsapp', b.whatsapp);
    set('bizEmail', b.email);
    set('bizAddress', b.address);
    set('bizHours', b.hours);
    set('bizHeroSub', b.heroSub);
    set('bizAbout', b.aboutText);
  }

  function initBusinessForm() {
    const form = $('#businessForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      data.business = {
        name: $('#bizName').value.trim() || DEFAULT_DATA.business.name,
        tagline: $('#bizTagline').value.trim(),
        phone: $('#bizPhone').value.trim(),
        whatsapp: $('#bizWhatsapp').value.replace(/\D/g, '') || '27738280529',
        email: $('#bizEmail').value.trim(),
        address: $('#bizAddress').value.trim(),
        hours: $('#bizHours').value.trim(),
        heroSub: $('#bizHeroSub').value.trim(),
        aboutText: $('#bizAbout').value.trim()
      };
      saveData();
      renderBusiness();
      renderContactLinks();
      renderServices();
      renderGallery();
      showToast('Business info saved');
    });
  }

  /* ---------- SECURITY ---------- */
  function initSecurity() {
    const form = $('#passwordForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const current = $('#pwCurrent').value;
      const next = $('#pwNew').value;
      const confirm = $('#pwConfirm').value;

      if (current !== getPassword()) {
        showToast('Current password is incorrect', true);
        return;
      }
      if (next.length < 4) {
        showToast('New password must be at least 4 characters', true);
        return;
      }
      if (next !== confirm) {
        showToast('New passwords do not match', true);
        return;
      }
      setPassword(next);
      form.reset();
      showToast('Password updated successfully');
    });

    $('#resetAll').addEventListener('click', () => {
      if (!confirm('Reset everything to default? All your services, images and info will be lost.')) return;
      if (!confirm('Are you absolutely sure? This cannot be undone.')) return;
      localStorage.removeItem(STORE_KEY);
      localStorage.removeItem(PASS_KEY);
      data = loadData();
      renderAll();
      renderAdminServices();
      renderAdminGallery();
      fillBusinessForm();
      fillBrandingPreviews();
      showToast('Everything reset to default');
    });
  }

  /* =========================================================
     INIT
     ========================================================= */
  function init() {
    // year in footer
    const yr = document.getElementById('year');
    if (yr) yr.textContent = new Date().getFullYear();

    renderAll();
    initNav();
    initContactForm();
    initLightbox();
    initCounters();
    observeReveals();

    // admin
    initAdminTabs();
    initLogin();
    initServiceForm();
    initDropzones();
    initBusinessForm();
    initSecurity();

    // keyboard: close admin with Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && $('#adminOverlay').classList.contains('open')) {
        if (!$('#lightbox').classList.contains('open')) closeAdmin();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();