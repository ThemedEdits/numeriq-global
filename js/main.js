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
  const hamburger    = document.getElementById('hamburger');
  const navLinksEl   = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');

  const closeMenu = () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    hamburger.classList.add('open');
    mobileOverlay.classList.add('active');
    navLinksEl.classList.add('open');
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
  const tabBtns     = document.querySelectorAll('.tab-btn');
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


  /* ─── SMOOTH ANCHOR SCROLL ──────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ─── BACK TO TOP ───────────────────────── */
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ─── CONTACT FORM ──────────────────────── */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
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


  /* ─── HERO PARALLAX ─────────────────────── */
  const heroImg = document.querySelector('.hero-img');
  if (heroImg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      heroImg.style.transform = `scale(1) translateY(${window.scrollY * 0.22}px)`;
    }, { passive: true });
  }


  /* ─── CUSTOM CURSOR (desktop only) ─────── */
  if (window.innerWidth > 1024 && !('ontouchstart' in window)) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
      position:fixed;width:8px;height:8px;border-radius:50%;
      background:#00A86B;pointer-events:none;z-index:9999;
      transition:transform .15s ease,opacity .15s ease;
      transform:translate(-50%,-50%);opacity:0;
    `;
    const ring = document.createElement('div');
    ring.style.cssText = `
      position:fixed;width:32px;height:32px;border-radius:50%;
      border:1px solid rgba(0,168,107,.45);pointer-events:none;z-index:9998;
      transition:transform .35s ease,opacity .2s ease,width .25s,height .25s;
      transform:translate(-50%,-50%);opacity:0;
    `;
    document.body.appendChild(cursor);
    document.body.appendChild(ring);

    document.addEventListener('mousemove', e => {
      cursor.style.left = ring.style.left = e.clientX + 'px';
      cursor.style.top  = ring.style.top  = e.clientY + 'px';
      cursor.style.opacity = ring.style.opacity = '1';
    });

    document.querySelectorAll('a, button, .service-card, .tab-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1.8)';
        ring.style.width = ring.style.height = '48px';
        ring.style.borderColor = 'rgba(0,168,107,.7)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.width = ring.style.height = '32px';
        ring.style.borderColor = 'rgba(0,168,107,.45)';
      });
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = ring.style.opacity = '0';
    });
  }

});