/* ══════════════════════════════════════════════
   BLOG PAGE — blog.js
══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {


  /* ─── BACK TO TOP ─────────────────────────── */
  document.getElementById('backToTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ════════════════════════════════════════
     BLOG FILTERING + SEARCH + PAGINATION
  ════════════════════════════════════════ */
  const CARDS_PER_PAGE = 6;

  const allCards = Array.from(document.querySelectorAll('.blog-card'));
  const filterTabs = document.querySelectorAll('.filter-tab');
  const searchInput = document.getElementById('blogSearch');
  const noResults = document.getElementById('noResults');
  const blogGrid = document.getElementById('blogGrid');
  const pagePrev = document.getElementById('pagePrev');
  const pageNext = document.getElementById('pageNext');
  const pageNumbersEl = document.getElementById('pageNumbers');

  let currentCategory = 'all';
  let currentSearch = '';
  let currentPage = 1;

  /* ── Filter logic ── */
  const getVisible = () => allCards.filter(card => {
    const cat = card.dataset.category || '';
    const title = card.querySelector('.blog-card-title')?.textContent.toLowerCase() || '';
    const excerpt = card.querySelector('.blog-card-excerpt')?.textContent.toLowerCase() || '';
    const matchCat = currentCategory === 'all' || cat === currentCategory;
    const matchSearch = !currentSearch || title.includes(currentSearch) || excerpt.includes(currentSearch);
    return matchCat && matchSearch;
  });

  /* ── Render page ── */
  const renderPage = () => {
    const visible = getVisible();
    const total = visible.length;
    const totalPages = Math.max(1, Math.ceil(total / CARDS_PER_PAGE));
    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * CARDS_PER_PAGE;
    const end = start + CARDS_PER_PAGE;

    /* Show/hide cards with staggered animation */
    allCards.forEach(card => {
      card.style.display = 'none';
      card.style.animationDelay = '0s';
    });

    const pageCards = visible.slice(start, end);
    pageCards.forEach((card, i) => {
      card.style.display = '';
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.animation = 'none';
      /* Force reflow */
      void card.offsetWidth;
      card.style.animation = `cardIn .45s ease ${i * 0.06}s forwards`;
    });

    /* No results */
    noResults.style.display = total === 0 ? 'block' : 'none';

    /* Pagination */
    renderPagination(totalPages);
  };

  /* ── Pagination buttons ── */
  const renderPagination = (totalPages) => {
    pageNumbersEl.innerHTML = '';

    if (totalPages <= 1) {
      document.getElementById('pagination').style.visibility = 'hidden';
      return;
    }
    document.getElementById('pagination').style.visibility = 'visible';

    pagePrev.disabled = currentPage === 1;
    pageNext.disabled = currentPage === totalPages;

    const addBtn = (num) => {
      const btn = document.createElement('button');
      btn.className = 'page-num' + (num === currentPage ? ' active' : '');
      btn.textContent = num;
      btn.addEventListener('click', () => { currentPage = num; renderPage(); scrollToGrid(); });
      pageNumbersEl.appendChild(btn);
    };

    const addEllipsis = () => {
      const span = document.createElement('span');
      span.className = 'page-ellipsis';
      span.textContent = '…';
      pageNumbersEl.appendChild(span);
    };

    /* Show: 1 … prev cur next … last */
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) addBtn(i);
    } else {
      addBtn(1);
      if (currentPage > 3) addEllipsis();
      const rangeStart = Math.max(2, currentPage - 1);
      const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
      for (let i = rangeStart; i <= rangeEnd; i++) addBtn(i);
      if (currentPage < totalPages - 2) addEllipsis();
      addBtn(totalPages);
    }
  };

  const scrollToGrid = () => {
    blogGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  pagePrev?.addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; renderPage(); scrollToGrid(); }
  });
  pageNext?.addEventListener('click', () => {
    const total = getVisible().length;
    const totalPages = Math.ceil(total / CARDS_PER_PAGE);
    if (currentPage < totalPages) { currentPage++; renderPage(); scrollToGrid(); }
  });

  /* ── Category filter ── */
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.dataset.category;
      currentPage = 1;
      renderPage();
    });
  });

  /* ── Search ── */
  let searchTimer;
  searchInput?.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      currentSearch = searchInput.value.trim().toLowerCase();
      currentPage = 1;
      renderPage();
    }, 250);
  });

  document.querySelector('.search-btn')?.addEventListener('click', () => {
    currentSearch = searchInput?.value.trim().toLowerCase() || '';
    currentPage = 1;
    renderPage();
  });

  /* ── Initial render ── */
  renderPage();

});

const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

const onScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);

  // Back to top
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 500);
};

window.addEventListener('scroll', onScroll, { passive: true });
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

/* ─── SCROLL REVEAL ─────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('revealed');
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  if (!el.closest('.hero')) revealObserver.observe(el);
});

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

/* ─── SMOOTH ANCHOR SCROLL FOR TOC ─────── */
document.querySelectorAll('.toc-link, .breadcrumb a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('navbar')?.offsetHeight || 90;
    const targetY = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    const startY = window.scrollY;
    const dist = targetY - startY;
    const dur = Math.min(600 + Math.abs(dist) * 0.15, 1200);
    const start = performance.now();
    const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const step = now => {
      const p = Math.min((now - start) / dur, 1);
      window.scrollTo(0, startY + dist * ease(p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
});