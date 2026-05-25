/* VIORA Paris Haute Fragrance - Central Application Coordinator */
import { initSmokeEngine } from './scripts/particles.js';
import { initStore } from './scripts/store.js';
import { initQuizEngine } from './scripts/quiz.js';
import { initInteractions } from './scripts/interactions.js';

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Slow Preloader Sequence
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('fade-out');
      }, 1500); // Allow luxury scale logo reveal to play out
    });

    // Fallback if load event already fired or delayed
    setTimeout(() => {
      if (!preloader.classList.contains('fade-out')) {
        preloader.classList.add('fade-out');
      }
    }, 2800);
  }

  // 2. Initialize Core Sub-Systems
  initSmokeEngine();
  initStore();
  initQuizEngine();
  initInteractions();

  // Initialize Lucide Icons vectors
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 3. Sticky Navbar on Scroll
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('sticky');
      } else {
        navbar.classList.remove('sticky');
      }
    });
  }

  // 4. Dark & Light Luxury Theme Toggle
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');

  if (themeBtn && themeIcon) {
    // Check local storage theme
    const storedTheme = localStorage.getItem('viora_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', storedTheme);
    updateThemeIcon(storedTheme);

    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('viora_theme', nextTheme);
      updateThemeIcon(nextTheme);

      // Flash custom cursor to indicate change
      const cursor = document.getElementById('custom-cursor');
      if (cursor) {
        cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
        setTimeout(() => {
          cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 300);
      }
    });
  }

  function updateThemeIcon(theme) {
    if (theme === 'light') {
      themeIcon.setAttribute('data-lucide', 'sun');
    } else {
      themeIcon.setAttribute('data-lucide', 'moon');
    }
    // Re-create icons to reflect changes
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // 5. Intercept Newsletter Form Submission
  const newsForm = document.getElementById('newsletter-form');
  if (newsForm) {
    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsForm.querySelector('.newsletter-input').value;
      newsForm.reset();

      // Premium success feedback modal / alert
      const alertDiv = document.createElement('div');
      alertDiv.className = 'glass-panel reveal revealed';
      alertDiv.style.position = 'fixed';
      alertDiv.style.bottom = '30px';
      alertDiv.style.right = '30px';
      alertDiv.style.padding = '20px 30px';
      alertDiv.style.zIndex = '10002';
      alertDiv.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';
      alertDiv.style.borderColor = 'var(--accent-gold)';
      alertDiv.style.transition = 'all 0.5s ease';

      alertDiv.innerHTML = `
        <h4 style="color: var(--accent-gold); font-size: 1.1rem; margin-bottom: 6px;">Inner Circle Activated</h4>
        <p style="font-size: 0.75rem; color: var(--text-primary);">An invite has been dispatched to ${email}.</p>
      `;

      document.body.appendChild(alertDiv);
      setTimeout(() => {
        alertDiv.style.opacity = '0';
        alertDiv.style.transform = 'translateY(20px)';
        setTimeout(() => alertDiv.remove(), 500);
      }, 4000);
    });
  }

  // 6. Intercept Contact Form Inquiry
  const contactForm = document.getElementById('footer-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('input[type="text"]').value;
      contactForm.reset();

      // Show stylized boutique acknowledgment
      const alertDiv = document.createElement('div');
      alertDiv.className = 'glass-panel reveal revealed';
      alertDiv.style.position = 'fixed';
      alertDiv.style.bottom = '30px';
      alertDiv.style.right = '30px';
      alertDiv.style.padding = '20px 30px';
      alertDiv.style.zIndex = '10002';
      alertDiv.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';
      alertDiv.style.borderColor = 'var(--accent-gold)';
      alertDiv.style.transition = 'all 0.5s ease';

      alertDiv.innerHTML = `
        <h4 style="color: var(--accent-gold); font-size: 1.1rem; margin-bottom: 6px;">Inquiry Received</h4>
        <p style="font-size: 0.75rem; color: var(--text-primary);">A scent consultant will wire you shortly, ${name}.</p>
      `;

      document.body.appendChild(alertDiv);
      setTimeout(() => {
        alertDiv.style.opacity = '0';
        alertDiv.style.transform = 'translateY(20px)';
        setTimeout(() => alertDiv.remove(), 500);
      }, 4000);
    });
  }
});
