/* VIORA Perfume Boutique - E-Commerce & State Management */

// Complete Brand Scent Database
export const PRODUCTS = {
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    price: 185,
    mood: 'Midnight',
    tagline: 'Deep, sensual, mysterious presence.',
    desc: 'Intimate, smoky pepper melting into deep obsidian cedarwood and aged bourbon vanilla. Calibrated specifically to react with natural body warmth for a lingering, physical embrace.',
    topNote: 'Black Pepper',
    heartNote: 'Obsidian Cedar',
    baseNote: 'Dark Vanilla',
    img: '/src/assets/viora_midnight.png',
    filter: ''
  },
  velvet: {
    id: 'velvet',
    name: 'Velvet',
    price: 195,
    mood: 'Velvet',
    tagline: 'A warm, romantic velvet kiss.',
    desc: 'A sensual embrace of luxury damask rose laced with golden amber beads and authentic Cambodian agarwood (oud). Formulated to feel like premium fabric resting against the collar.',
    topNote: 'Damask Rose',
    heartNote: 'Golden Amber',
    baseNote: 'Sensual Oud',
    img: '/src/assets/viora_velvet.png',
    filter: ''
  },
  ember: {
    id: 'ember',
    name: 'Ember',
    price: 190,
    mood: 'Ember',
    tagline: 'Toasted warm luxury warmth.',
    desc: 'Warm, toasted Spanish saffron wrapped in sweet, lingering Havana tobacco leaves and raw sandalwood blocks. Captures the glowing warmth of a candlelit study at midnight.',
    topNote: 'Toasted Saffron',
    heartNote: 'Tobacco Leaf',
    baseNote: 'Sandalwood',
    img: '/src/assets/viora_velvet.png',
    filter: 'hue-rotate(-20deg) saturate(1.2) contrast(1.1) brightness(0.65)'
  },
  eclipse: {
    id: 'eclipse',
    name: 'Eclipse',
    price: 205,
    mood: 'Eclipse',
    tagline: 'Intense shadow, cosmic illumination.',
    desc: 'An intense shadow of dry patchouli illuminated by cosmic Florentine iris and deep saddle leather. A bold statement fragrance created to disrupt and linger.',
    topNote: 'Cosmic Iris',
    heartNote: 'Raw Leather',
    baseNote: 'Dry Patchouli',
    img: '/src/assets/viora_midnight.png',
    filter: 'hue-rotate(180deg) saturate(0.5) brightness(0.55)'
  },
  solace: {
    id: 'solace',
    name: 'Solace',
    price: 180,
    mood: 'Solace',
    tagline: 'Serene white cashmeran bliss.',
    desc: 'Serene cashmere wood drifting lightly over sparkling Calabrian bergamot and dry white musk clouds. Clean, minimalist, and deeply therapeutic scent designed for quiet closeness.',
    topNote: 'Bergamot',
    heartNote: 'Cashmere Wood',
    baseNote: 'White Musk',
    img: '/src/assets/viora_midnight.png',
    filter: 'saturate(0) brightness(1.1) contrast(1.1) opacity(0.8)'
  }
};

// Initial state loaded from local storage
let cart = JSON.parse(localStorage.getItem('viora_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('viora_wishlist')) || [];

export function initStore() {
  const cartToggle = document.getElementById('cart-toggle-btn');
  const cartClose = document.getElementById('cart-close-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const wishlistToggle = document.getElementById('wishlist-toggle-btn');
  const wishlistClose = document.getElementById('wishlist-close-btn');
  const wishlistDrawer = document.getElementById('wishlist-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  
  const checkoutBtn = document.getElementById('checkout-btn');
  const checkoutOverlay = document.getElementById('checkout-overlay');
  const checkoutSuccessClose = document.getElementById('checkout-success-close-btn');

  // Toggle Drawers
  function openCart() {
    closeWishlist();
    cartDrawer.classList.add('open');
    backdrop.classList.add('active');
    renderCart();
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    if (!wishlistDrawer.classList.contains('open')) {
      backdrop.classList.remove('active');
    }
  }

  function openWishlist() {
    closeCart();
    wishlistDrawer.classList.add('open');
    backdrop.classList.add('active');
    renderWishlist();
  }

  function closeWishlist() {
    wishlistDrawer.classList.remove('open');
    if (!cartDrawer.classList.contains('open')) {
      backdrop.classList.remove('active');
    }
  }

  if (cartToggle) cartToggle.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (wishlistToggle) wishlistToggle.addEventListener('click', openWishlist);
  if (wishlistClose) wishlistClose.addEventListener('click', closeWishlist);
  if (backdrop) backdrop.addEventListener('click', () => {
    closeCart();
    closeWishlist();
  });

  // Checkout Execution
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      // Empty local cart
      cart = [];
      saveCart();
      closeCart();
      
      // Open Success Overlay
      if (checkoutOverlay) {
        checkoutOverlay.classList.add('active');
      }
    });
  }

  if (checkoutSuccessClose) {
    checkoutSuccessClose.addEventListener('click', () => {
      if (checkoutOverlay) {
        checkoutOverlay.classList.remove('active');
      }
    });
  }

  // Bind global event listeners for dynamic nodes using delegation
  document.addEventListener('click', (e) => {
    // Check for Quick Add Button
    const quickAdd = e.target.closest('.quick-add-btn');
    if (quickAdd) {
      const prodId = quickAdd.getAttribute('data-id');
      addToCart(prodId);
      openCart();
    }

    // Check for wishlist add toggle button
    const wishAdd = e.target.closest('.wishlist-add-btn');
    if (wishAdd) {
      const prodId = wishAdd.getAttribute('data-id') || document.getElementById('quickview-add-btn').getAttribute('data-id');
      if (prodId) {
        toggleWishlist(prodId);
      }
    }
  });

  // Render initial badges
  updateBadges();
}

// Cart operations
export function addToCart(id) {
  const product = PRODUCTS[id];
  if (!product) return;

  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateBadges();
  animateBadge('cart-count');
}

export function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateBadges();
  renderCart();
}

export function adjustQty(id, delta) {
  const item = cart.find(item => item.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    saveCart();
    updateBadges();
    renderCart();
  }
}

// Wishlist operations
export function toggleWishlist(id) {
  const product = PRODUCTS[id];
  if (!product) return;

  const idx = wishlist.findIndex(item => item.id === id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
  } else {
    wishlist.push(product);
  }

  saveWishlist();
  updateBadges();
  renderWishlist();
  animateBadge('wishlist-count');
}

// Local Storage saves
function saveCart() {
  localStorage.setItem('viora_cart', JSON.stringify(cart));
}

function saveWishlist() {
  localStorage.setItem('viora_wishlist', JSON.stringify(wishlist));
}

// Badge UI Updates
export function updateBadges() {
  const cartCountEl = document.getElementById('cart-count');
  const wishlistCountEl = document.getElementById('wishlist-count');

  if (cartCountEl) {
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    cartCountEl.textContent = totalQty;
    cartCountEl.style.display = totalQty > 0 ? 'flex' : 'none';
  }

  if (wishlistCountEl) {
    wishlistCountEl.textContent = wishlist.length;
    wishlistCountEl.style.display = wishlist.length > 0 ? 'flex' : 'none';
  }
}

function animateBadge(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.style.transform = 'scale(1.4)';
  setTimeout(() => {
    el.style.transform = 'scale(1)';
  }, 300);
}

// Dynamic Renders
function renderCart() {
  const container = document.getElementById('cart-drawer-content');
  const totalValEl = document.getElementById('cart-total-price');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <i data-lucide="shopping-bag" style="width: 48px; height: 48px; color: var(--accent-gold); opacity: 0.5;"></i>
        <p>Your luxurious bag is empty.</p>
        <a href="#collection" class="btn btn-secondary" style="margin-top: 24px; padding: 12px 24px; font-size: 0.65rem;" onclick="document.getElementById('cart-close-btn').click()">Browse Scents</a>
      </div>
    `;
    if (totalValEl) totalValEl.textContent = '$0.00';
    lucide.createIcons();
    return;
  }

  let cartHTML = '<div class="cart-list">';
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.qty;
    cartHTML += `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" class="cart-item-img" style="filter: ${item.filter || 'none'};">
        <div class="cart-item-info">
          <div class="cart-item-hdr">
            <div>
              <h4 class="cart-item-name">${item.name}</h4>
              <span class="cart-item-size">100ml / Haute Parfum</span>
            </div>
            <span class="cart-item-price">$${item.price * item.qty}</span>
          </div>
          
          <div class="cart-item-qty-row">
            <div class="cart-qty-ctrl">
              <button class="cart-qty-btn qty-minus" data-id="${item.id}">-</button>
              <span class="cart-qty-val">${item.qty}</span>
              <button class="cart-qty-btn qty-plus" data-id="${item.id}">+</button>
            </div>
            <button class="cart-item-remove remove-btn" data-id="${item.id}">Remove</button>
          </div>
        </div>
      </div>
    `;
  });

  cartHTML += '</div>';
  container.innerHTML = cartHTML;
  if (totalValEl) totalValEl.textContent = `$${subtotal.toFixed(2)}`;

  // Bind controls
  container.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => adjustQty(btn.getAttribute('data-id'), -1));
  });
  container.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => adjustQty(btn.getAttribute('data-id'), 1));
  });
  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.getAttribute('data-id')));
  });

  lucide.createIcons();
}

function renderWishlist() {
  const container = document.getElementById('wishlist-drawer-content');
  if (!container) return;

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="wishlist-empty">
        <i data-lucide="heart" style="width: 48px; height: 48px; color: var(--accent-gold); opacity: 0.5;"></i>
        <p>No lingering traces here yet.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  let listHTML = '<div class="cart-list">';

  wishlist.forEach(item => {
    listHTML += `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" class="cart-item-img" style="filter: ${item.filter || 'none'};">
        <div class="cart-item-info">
          <div class="cart-item-hdr">
            <div>
              <h4 class="cart-item-name">${item.name}</h4>
              <span class="cart-item-size">100ml / Scent Ritual</span>
            </div>
            <span class="cart-item-price">$${item.price}</span>
          </div>
          
          <div class="cart-item-qty-row">
            <button class="btn btn-primary quick-add-btn" data-id="${item.id}" style="padding: 6px 16px; font-size: 0.6rem; letter-spacing: 0.1em;" onclick="document.getElementById('wishlist-close-btn').click()">Add to Bag</button>
            <button class="cart-item-remove wish-remove-btn" data-id="${item.id}">Forget</button>
          </div>
        </div>
      </div>
    `;
  });

  listHTML += '</div>';
  container.innerHTML = listHTML;

  // Bind controls
  container.querySelectorAll('.wish-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleWishlist(btn.getAttribute('data-id')));
  });

  lucide.createIcons();
}
