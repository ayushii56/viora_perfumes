/* VIORA Perfume Boutique - Interactive FX & Custom Cursor Engine */
import { PRODUCTS } from './store.js';

export function initInteractions() {
  initCustomCursor();
  initHeroTilt();
  initScentVisualizer();
  initSpotlightTracking();
  initQuickViewModal();
  initScrollReveals();
  initSearch();
}

// 1. Fluid Custom Cursor Glow System
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const glow = document.getElementById('custom-cursor-glow');
  if (!cursor || !glow) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  const lerpFactor = 0.15; // Smooth lag factor

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    
    // Move small pointer instantly
    cursor.style.left = `${targetX}px`;
    cursor.style.top = `${targetY}px`;
  });

  // Lerp loop for outer glowing ring to create elastic lag
  function updateGlowPosition() {
    currentX += (targetX - currentX) * lerpFactor;
    currentY += (targetY - currentY) * lerpFactor;

    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;

    requestAnimationFrame(updateGlowPosition);
  }
  updateGlowPosition();

  // Hover states expanding the cursor
  const interactiveSelectors = 'a, button, .fragrance-card, .selector-option, .quiz-option, .nav-btn';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      cursor.style.transform = 'translate(-50%, -50%) scale(0.5)';
      cursor.style.backgroundColor = 'transparent';
      glow.style.width = '65px';
      glow.style.height = '65px';
      glow.style.borderColor = 'var(--accent-gold-hover)';
      glow.style.backgroundColor = 'rgba(197, 168, 128, 0.05)';
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.backgroundColor = 'var(--accent-gold)';
      glow.style.width = '40px';
      glow.style.height = '40px';
      glow.style.borderColor = 'var(--accent-gold)';
      glow.style.backgroundColor = 'var(--gold-glow)';
    }
  });
}

// 2. 3D Interactive Perfume Bottle Tilt
function initHeroTilt() {
  const hero = document.getElementById('hero');
  const bottle = document.getElementById('hero-bottle');
  if (!hero || !bottle) return;

  hero.addEventListener('mousemove', (e) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Normalised coordinate offset from screen center (-1 to 1)
    const offsetX = (e.clientX - width / 2) / (width / 2);
    const offsetY = (e.clientY - height / 2) / (height / 2);

    // Apply rotation parameters
    const maxRotateY = 12; // Degrees
    const maxRotateX = 8;
    const maxTranslateX = 15; // px

    const rotateY = offsetX * maxRotateY;
    const rotateX = -offsetY * maxRotateX;
    const translateX = offsetX * maxTranslateX;

    bottle.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateX(${translateX}px)`;
    bottle.style.transition = 'transform 0.1s ease-out'; // Snappy tracking
  });

  // Smooth reset when leaving hero bounds
  hero.addEventListener('mouseleave', () => {
    bottle.style.transform = 'rotateY(0deg) rotateX(0deg) translateX(0px)';
    bottle.style.transition = 'transform 1s ease';
  });
}

// 3. Trigonometric Soundwave Scent Visualizer
function initScentVisualizer() {
  const canvas = document.getElementById('visualizer-canvas');
  const wrapper = document.getElementById('soundwave-glow-container');
  if (!canvas || !wrapper) return;

  const ctx = canvas.getContext('2d');
  let animId;
  let waveColor = 'rgba(197, 168, 128, 0.4)'; // Gold pulse start
  let targetColor = 'rgba(197, 168, 128, 0.4)';
  
  // Track speed
  let lastMouseTime = Date.now();
  let lastMouseX = 0;
  let lastMouseY = 0;
  let mouseSpeed = 0;
  let currentSpeed = 0.5; // Lerp speed indicator

  function resize() {
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Speed calculation
  wrapper.addEventListener('mousemove', (e) => {
    const now = Date.now();
    const dT = now - lastMouseTime;
    if (dT === 0) return;

    const dX = e.clientX - lastMouseX;
    const dY = e.clientY - lastMouseY;
    const dist = Math.sqrt(dX * dX + dY * dY);

    mouseSpeed = Math.min(dist / dT, 8); // Cap speed spikes
    lastMouseTime = now;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  // Wave render loops
  let phase1 = 0;
  let phase2 = Math.PI / 4;
  let phase3 = Math.PI / 2;

  function renderWave(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Speed decay and smoothing
    currentSpeed += (mouseSpeed - currentSpeed) * 0.05;
    mouseSpeed = Math.max(0.1, mouseSpeed - 0.02); // Gradual return to rest

    // Shift phases
    phase1 += 0.02 * (1 + currentSpeed * 0.8);
    phase2 += 0.015 * (1 + currentSpeed * 0.5);
    phase3 += 0.01 * (1 + currentSpeed * 0.3);

    // Color Lerp (Smooth transitioning between RGBs)
    waveColor = targetColor;

    // Draw three interlocking waves
    drawSineWave(1.8, 0.008, phase1, waveColor, 3);
    drawSineWave(1.2, 0.015, phase2, waveColor.replace('0.4', '0.2').replace('0.35', '0.15'), 1.5);
    drawSineWave(0.8, 0.004, phase3, waveColor.replace('0.4', '0.1').replace('0.35', '0.08'), 1);

    animId = requestAnimationFrame(renderWave);
  }

  function drawSineWave(ampMult, freq, phase, color, lineWidth) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    const baseAmplitude = 30 * ampMult;
    const activeAmplitude = baseAmplitude + (currentSpeed * 25);
    const midY = canvas.height / 2;

    for (let x = 0; x < canvas.width; x++) {
      const sine = Math.sin(x * freq + phase);
      // Fade amplitude near borders so it doesn't clip
      const fadeFactor = Math.sin((x / canvas.width) * Math.PI);
      const y = midY + sine * activeAmplitude * fadeFactor;

      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }

  renderWave(0);

  // Bind Scent option selectors
  const selectors = document.querySelectorAll('[data-visual-scent]');
  const mainGlowBottle = document.getElementById('visualizer-glow-bottle');
  const mainGlowReflection = document.getElementById('visualizer-glow-reflection');

  selectors.forEach(sel => {
    sel.addEventListener('click', () => {
      // Toggle active states
      selectors.forEach(s => s.classList.remove('active'));
      sel.classList.add('active');

      const scentId = sel.getAttribute('data-visual-scent');
      const glowColor = sel.getAttribute('data-glow-color');
      const product = PRODUCTS[scentId];

      targetColor = glowColor;

      // Immersive mood shifts
      wrapper.style.boxShadow = `inset 0 0 50px ${glowColor}, 0 10px 40px rgba(0,0,0,0.4)`;
      wrapper.style.borderColor = glowColor.replace('0.45', '0.3').replace('0.35', '0.2');

      // Shift scent bottle graphics
      if (mainGlowBottle && mainGlowReflection && product) {
        mainGlowBottle.style.transform = 'scale(0.85) rotate(-3deg)';
        mainGlowBottle.style.opacity = '0';
        mainGlowReflection.style.opacity = '0';

        setTimeout(() => {
          mainGlowBottle.src = product.img;
          mainGlowBottle.style.filter = product.filter || 'none';
          
          mainGlowReflection.src = product.img;
          mainGlowReflection.style.filter = product.filter ? `${product.filter} blur(4px) opacity(0.15)` : 'blur(4px) opacity(0.15)';

          mainGlowBottle.style.transform = 'scale(1) rotate(0deg)';
          mainGlowBottle.style.opacity = '1';
          mainGlowReflection.style.opacity = '0.15';
        }, 300);
      }
    });
  });
}

// 4. Centered Best Seller Spotlight Lens Tracking
function initSpotlightTracking() {
  const spotlightFrame = document.getElementById('spotlight-frame');
  const lens = document.getElementById('spotlight-lens');
  const bottle = document.getElementById('spotlight-bottle');
  
  if (!spotlightFrame || !lens || !bottle) return;

  function trackSpotlight(e) {
    const rect = spotlightFrame.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert coordinates to percentages
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    // Shift Spotlight overlay radial highlight
    lens.style.background = `radial-gradient(circle 180px at ${xPercent}% ${yPercent}%, transparent 100%, rgba(10, 10, 10, 0.96) 100%)`;

    // Add physical wiggle to bottle
    const offsetX = (x - rect.width / 2) / (rect.width / 2);
    const offsetY = (y - rect.height / 2) / (rect.height / 2);
    bottle.style.transform = `scale(1.02) rotateY(${offsetX * 8}deg) rotateX(${-offsetY * 8}deg)`;
  }

  // Bind triggers
  spotlightFrame.addEventListener('mousemove', trackSpotlight);

  // Restore defaults when leaving spotlight area
  spotlightFrame.addEventListener('mouseleave', () => {
    lens.style.background = `radial-gradient(circle 180px at 50% 50%, transparent 100%, rgba(10, 10, 10, 0.96) 100%)`;
    bottle.style.transform = `scale(1) rotateY(0deg) rotateX(0deg)`;
  });
}

// 5. Immersive Product Quick View Modals
function initQuickViewModal() {
  const modal = document.getElementById('quickview-overlay');
  const closeModal = document.getElementById('quickview-close-btn');
  const viewStoryBtns = document.querySelectorAll('.view-story-btn');
  
  const qImg = document.getElementById('quickview-image');
  const qMood = document.getElementById('quickview-mood');
  const qTitle = document.getElementById('quickview-title');
  const qPrice = document.getElementById('quickview-price');
  const qDesc = document.getElementById('quickview-desc');
  const qTop = document.getElementById('quickview-note-top');
  const qHeart = document.getElementById('quickview-note-heart');
  const qBase = document.getElementById('quickview-note-base');
  const qAddBtn = document.getElementById('quickview-add-btn');
  
  if (!modal || !closeModal) return;

  function openQuickview(prodId) {
    const product = PRODUCTS[prodId];
    if (!product) return;

    // Fill details
    qImg.src = product.img;
    qImg.style.filter = product.filter || 'none';
    qMood.textContent = product.mood;
    qTitle.textContent = `${product.name} Haute Parfum`;
    qPrice.textContent = `$${product.price}`;
    qDesc.textContent = product.desc;
    qTop.textContent = product.topNote;
    qHeart.textContent = product.heartNote;
    qBase.textContent = product.baseNote;

    qAddBtn.setAttribute('data-id', product.id);
    qAddBtn.setAttribute('data-name', product.name);
    qAddBtn.setAttribute('data-price', product.price);
    
    // Add custom cursor triggers inside modal
    modal.classList.add('active');
  }

  viewStoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      openQuickview(id);
    });
  });

  closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

// 6. Smooth Scroll Reveal Animations
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.15, // Reveal when 15% visible
    rootMargin: '0px 0px -40px 0px' // Slightly earlier triggers
  });

  reveals.forEach(el => observer.observe(el));
}

// 7. Mini Boutique Search Engine
function initSearch() {
  const searchToggle = document.getElementById('search-toggle-btn');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose = document.getElementById('search-close-btn');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (!searchToggle || !searchOverlay || !searchClose) return;

  searchToggle.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    setTimeout(() => searchInput.focus(), 150);
  });

  searchClose.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '';
  });

  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
      searchOverlay.classList.remove('active');
    }
  });

  // Scent search logic
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    searchResults.innerHTML = '';

    if (query.length < 2) return;

    // Search against key notes and database
    const matchingProducts = Object.values(PRODUCTS).filter(p => {
      return p.name.toLowerCase().includes(query) ||
             p.desc.toLowerCase().includes(query) ||
             p.topNote.toLowerCase().includes(query) ||
             p.heartNote.toLowerCase().includes(query) ||
             p.baseNote.toLowerCase().includes(query);
    });

    if (matchingProducts.length === 0) {
      searchResults.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-secondary); text-align: center; width: 100%;">No matches found for "${query}"</p>`;
      return;
    }

    matchingProducts.forEach(p => {
      const div = document.createElement('div');
      div.className = 'glass-panel';
      div.style.padding = '16px';
      div.style.display = 'flex';
      div.style.justifyContent = 'space-between';
      div.style.alignItems = 'center';
      div.style.cursor = 'pointer';

      div.innerHTML = `
        <div style="display: flex; gap: 16px; align-items: center;">
          <img src="${p.img}" alt="${p.name}" style="width: 40px; height: 40px; object-fit: contain; filter: ${p.filter || 'none'}">
          <div>
            <h4 style="font-size: 1.1rem;">${p.name}</h4>
            <span style="font-size: 0.65rem; color: var(--text-secondary); text-transform: uppercase;">${p.topNote} &bull; ${p.heartNote} &bull; ${p.baseNote}</span>
          </div>
        </div>
        <span style="font-family: var(--font-serif); font-size: 1.2rem; color: var(--accent-gold);">$${p.price}</span>
      `;

      // Clicking result goes to story quick view!
      div.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
        
        // Open quick view
        const modal = document.getElementById('quickview-overlay');
        const qImg = document.getElementById('quickview-image');
        const qMood = document.getElementById('quickview-mood');
        const qTitle = document.getElementById('quickview-title');
        const qPrice = document.getElementById('quickview-price');
        const qDesc = document.getElementById('quickview-desc');
        const qTop = document.getElementById('quickview-note-top');
        const qHeart = document.getElementById('quickview-note-heart');
        const qBase = document.getElementById('quickview-note-base');
        const qAddBtn = document.getElementById('quickview-add-btn');

        qImg.src = p.img;
        qImg.style.filter = p.filter || 'none';
        qMood.textContent = p.mood;
        qTitle.textContent = `${p.name} Haute Parfum`;
        qPrice.textContent = `$${p.price}`;
        qDesc.textContent = p.desc;
        qTop.textContent = p.topNote;
        qHeart.textContent = p.heartNote;
        qBase.textContent = p.baseNote;

        qAddBtn.setAttribute('data-id', p.id);
        qAddBtn.setAttribute('data-name', p.name);
        qAddBtn.setAttribute('data-price', p.price);

        modal.classList.add('active');
      });

      searchResults.appendChild(div);
    });
  });
}
