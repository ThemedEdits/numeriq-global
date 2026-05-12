/* ══════════════════════════════════════════════
   NUMERIQ GLOBAL — MAIN JAVASCRIPT
══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── PRELOADER ─────────────────────────── */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
      // Trigger hero text animations after preloader hides
      document.querySelectorAll('.hero .reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('revealed'), i * 130);
      });
      // Trigger hero logo slide-in
      const heroLogo = document.querySelector('.hero-logo-img');
      if (heroLogo) {
        setTimeout(() => heroLogo.classList.add('logo-revealed'), 300);
      }
    }, 1400);
  });
  document.body.style.overflow = 'hidden';


  /* ─── NAVBAR SCROLL ─────────────────────── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // Active link highlight
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });

    // Back to top
    document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 500);
  };

  window.addEventListener('scroll', onScroll, { passive: true });


  /* ─── HAMBURGER MENU (circle-expand) ────── */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');

  const closeMenu = () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
    mobileOverlay.classList.remove('active');
    navbar.classList.remove('menu-open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    hamburger.classList.add('open');
    mobileOverlay.classList.add('active');
    navLinksEl.classList.add('open');
    navbar.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  };

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Clicking the overlay background closes menu
  mobileOverlay.addEventListener('click', (e) => {
    // Only close if click is on the overlay itself, not the nav links
    if (!navLinksEl.contains(e.target)) closeMenu();
  });

  document.querySelectorAll('.nav-link, .nav-cta-btn').forEach(l => {
    l.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });


  /* ─── SCROLL REVEAL ─────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('revealed');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    if (!el.closest('.hero')) revealObserver.observe(el);
  });


  /* ─── STAT COUNTER ──────────────────────── */
  let statsDone = false;
  const countUp = (el, target, duration = 1600) => {
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    };
    requestAnimationFrame(update);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsDone) {
      statsDone = true;
      document.querySelectorAll('.stat-num').forEach(el => countUp(el, parseInt(el.dataset.target)));
    }
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);


  /* ─── SERVICES TABS ─────────────────────── */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  // Init: hide operations tab cards
  serviceCards.forEach(card => {
    if (card.dataset.category === 'operations') card.style.display = 'none';
  });

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.tab;
      serviceCards.forEach(card => {
        const show = card.dataset.category === category;
        card.style.display = show ? '' : 'none';
        if (show) {
          card.classList.remove('revealed');
          setTimeout(() => card.classList.add('revealed'), 30);
        }
      });
    });
  });


  /* ─── CUSTOM EASED SCROLL (WordPress-style) ─
       Cubic ease-in-out: starts slow, accelerates,
       then decelerates softly into the target.
    ────────────────────────────────────────────── */
  const easedScrollTo = (targetY, duration = 1100) => {
    // If already animating, cancel
    if (window._scrollRAF) cancelAnimationFrame(window._scrollRAF);

    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    // Cubic ease-in-out
    const easing = (t) =>
      t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easing(progress);

      window.scrollTo(0, startY + distance * ease);

      if (progress < 1) {
        window._scrollRAF = requestAnimationFrame(step);
      } else {
        window._scrollRAF = null;
      }
    };

    window._scrollRAF = requestAnimationFrame(step);
  };

  /* Anchor links */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      // Always use the SCROLLED navbar height (smaller, collapsed state)
      // so the offset is consistent whether nav is transparent or white.
      // We read it from the CSS padding values directly to avoid measuring
      // the live (possibly tall) navbar at click time.
      const navH = (() => {
        // Temporarily force scrolled class to measure collapsed height
        const wasScrolled = navbar.classList.contains('scrolled');
        if (!wasScrolled) navbar.classList.add('scrolled');
        const h = navbar.offsetHeight;
        if (!wasScrolled) navbar.classList.remove('scrolled');
        return h;
      })();

      const offset = navH;
      const targetY = target.getBoundingClientRect().top + window.scrollY - offset;
      const dist = Math.abs(targetY - window.scrollY);
      const dur = Math.min(900 + dist * 0.18, 1400);
      easedScrollTo(targetY, dur);
    });
  });

  /* Back to top */
  document.getElementById('backToTop').addEventListener('click', () => {
    const dist = window.scrollY;
    const dur = Math.min(900 + dist * 0.18, 1400);
    easedScrollTo(0, dur);
  });


  /* ─── CONTACT FORM ──────────────────────── */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {

    // --- helpers ---
    const showFieldError = (input, msg) => {
      const group = input.closest('.form-group');
      input.classList.add('input-error');
      const err = group.querySelector('.field-error');
      if (err) { err.textContent = msg; err.classList.add('visible'); }
    };
    const clearFieldError = (input) => {
      const group = input.closest('.form-group');
      input.classList.remove('input-error');
      const err = group.querySelector('.field-error');
      if (err) { err.textContent = ''; err.classList.remove('visible'); }
    };

    // Show/hide form-level toast
    let toastEl = form.querySelector('.form-toast');
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'form-toast';
      form.insertBefore(toastEl, form.querySelector('button[type="submit"]'));
    }
    const showToast = (msg, type = 'error') => {
      const icon = type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check';
      toastEl.className = `form-toast toast-${type} visible`;
      toastEl.innerHTML = `<i class="fa-solid ${icon}"></i><span>${msg}</span>`;
      setTimeout(() => toastEl.classList.remove('visible'), 5000);
    };

    // Clear errors on input
    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => clearFieldError(field));
    });

    // --- validation ---
    const validate = () => {
      let valid = true;

      const firstName = form.querySelector('[name="firstName"]');
      const lastName = form.querySelector('[name="lastName"]');
      const email = form.querySelector('[name="email"]');
      const message = form.querySelector('[name="message"]');
      const service = form.querySelector('[name="service"]');

      if (!firstName.value.trim()) {
        showFieldError(firstName, 'First name is required.'); valid = false;
      }
      if (!lastName.value.trim()) {
        showFieldError(lastName, 'Last name is required.'); valid = false;
      }
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim()) {
        showFieldError(email, 'Email address is required.'); valid = false;
      } else if (!emailRe.test(email.value.trim())) {
        showFieldError(email, 'Please enter a valid email address.'); valid = false;
      }
      if (!service.value) {
        // highlight the select trigger
        const wrapper = form.querySelector('.custom-select-wrapper');
        const err = wrapper.querySelector('.field-error');
        const trigger = wrapper.querySelector('.select-trigger');
        if (trigger) trigger.style.borderColor = '#e03131';
        if (err) { err.textContent = 'Please select a service.'; err.classList.add('visible'); }
        valid = false;
      }
      if (!message.value.trim()) {
        showFieldError(message, 'Please tell us about your needs.'); valid = false;
      }

      return valid;
    };

    // --- submit ---
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // clear any previous toast
      toastEl.classList.remove('visible');

      if (!validate()) {
        showToast('Please fix the errors above before sending.', 'error');
        // scroll to first error
        const firstErr = form.querySelector('.input-error, .select-trigger[style*="border"]');
        if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      setTimeout(() => {
        form.style.display = 'none';
        formSuccess.classList.add('show');
      }, 1600);
    });
  }


  /* ─── FOOTER YEAR ───────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});



/* ─── CUSTOM SELECT DROPDOWN ─────────────── */
const customSelect = document.getElementById('customSelect');
const selectTrigger = customSelect.querySelector('.select-trigger');
const selectValue = customSelect.querySelector('.select-value');
const selectIcon = customSelect.querySelector('.select-icon');
const options = customSelect.querySelectorAll('.dropdown-option');
const hiddenInput = document.getElementById('service');

// Toggle dropdown on trigger click
selectTrigger.addEventListener('click', (e) => {
  e.stopPropagation();
  customSelect.classList.toggle('open');

  // Change icon animation
  if (customSelect.classList.contains('open')) {
    selectIcon.style.transform = 'rotate(180deg)';
  } else {
    selectIcon.style.transform = 'rotate(0deg)';
  }
});

// Handle option selection
options.forEach(option => {
  option.addEventListener('click', () => {
    const value = option.getAttribute('data-value');
    const text = option.querySelector('.option-text').textContent;

    // Update display
    selectValue.textContent = text;
    selectValue.classList.remove('placeholder');

    // Update hidden input
    hiddenInput.value = value;

    // Update selected class
    options.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');

    // Close dropdown
    customSelect.classList.remove('open');
    selectIcon.style.transform = 'rotate(0deg)';
  });
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!customSelect.contains(e.target)) {
    customSelect.classList.remove('open');
    selectIcon.style.transform = 'rotate(0deg)';
  }
});

// Keyboard navigation
customSelect.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && customSelect.classList.contains('open')) {
    customSelect.classList.remove('open');
    selectIcon.style.transform = 'rotate(0deg)';
  }
});

