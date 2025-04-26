document.addEventListener('DOMContentLoaded', () => {
  // ========== ПОДМЕНЮ в хэдере ==========
  document.querySelectorAll('.menu li.has-submenu > a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const li = link.parentElement;
      const parentUl = li.parentElement;

      parentUl
        .querySelectorAll(':scope > li.has-submenu.open')
        .forEach(openLi => {
          if (openLi !== li) openLi.classList.remove('open');
        });

      li.classList.toggle('open');
    });
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.header__nav')) {
      document.querySelectorAll('.menu li.has-submenu.open')
        .forEach(openLi => openLi.classList.remove('open'));
    }
  });

  // ========== КНОПКА-бургер и моб.меню ==========
  const burger   = document.querySelector('.header__toggle');
  const menu     = document.querySelector('.header__mobile-menu');
  const overlay  = document.querySelector('.header__mobile-overlay');
  const closeBtn = document.querySelector('.header__mobile-close');

  if (burger && menu && overlay && closeBtn) {
    function openMenu() {
      menu.classList.add('open');
      overlay.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
    }
    function closeMenu() {
      menu.classList.remove('open');
      overlay.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
    }
    burger.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeMenu();
    });

    // Подменю внутри моб.меню
    document.querySelectorAll('.mobile-menu li.has-submenu > a').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        link.parentElement.classList.toggle('open');
      });
    });
    document.querySelectorAll('.submenu-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const li = btn.closest('.has-submenu');
        const expanded = li.classList.toggle('open');
        btn.setAttribute('aria-label', expanded ? 'Закрыть подменю' : 'Открыть подменю');
      });
    });
  }

  // ========== СЛАЙДЕРЫ ==========
  function initHorizontalSlider(containerSel, prevSel, nextSel, itemSel, gapProp = 'gap', columnGap = false) {
    const slides = document.querySelector(containerSel);
    const prev   = document.querySelector(prevSel);
    const next   = document.querySelector(nextSel);
    const example = document.querySelector(itemSel);
    if (!slides || !prev || !next || !example) return;

    const getGap = () => {
      const style = getComputedStyle(slides);
      return parseInt(style[ gapProp ]) || 0;
    };

    const computeStep = () => {
      const g = getGap();
      const w = example.offsetWidth + g;
      if (columnGap) {
        if (window.innerWidth <= 768) return w;
        const visible = Math.floor((slides.clientWidth + g) / w) || 1;
        return w * visible;
      }
      return w;
    };

    let step = computeStep();

    const updateButtons = () => {
      const maxScroll = slides.scrollWidth - slides.clientWidth;
      prev.disabled = slides.scrollLeft <= 0;
      next.disabled = slides.scrollLeft >= (maxScroll - (columnGap ? 1 : 0));
      step = computeStep();
    };

    const scrollBy = delta => {
      slides.scrollBy({ left: delta, behavior: 'smooth' });
      setTimeout(updateButtons, 500);
    };

    prev.addEventListener('click', () => scrollBy(-step));
    next.addEventListener('click', () => scrollBy(+step));
    slides.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);

    updateButtons();
  }

  initHorizontalSlider('.catalog__slides', '.catalog__arrow--prev', '.catalog__arrow--next', '.catalog__slide');
  initHorizontalSlider('.team__slides', '.team__arrow--prev', '.team__arrow--next', '.team__slide');
  initHorizontalSlider('.testimonials__list', '.testimonials__nav--prev', '.testimonials__nav--next', '.testimonial', 'columnGap', true);

  // ========== МОДАЛКА ==========
  const overlayModal = document.getElementById('modal-overlay');
  const modalClose   = document.querySelector('.modal__close');

  if (overlayModal && modalClose) {
    // все кнопки-триггеры открытия
    const triggers = document.querySelectorAll(
      '.open-modal, .catalog__btn, .testimonials__cta, .testimonials__cta--mobile, .contact__button'
    );
    triggers.forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        overlayModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    // закрытие
    function closeModal() {
      overlayModal.classList.remove('open');
      document.body.style.overflow = '';
    }
    modalClose.addEventListener('click', closeModal);
    overlayModal.addEventListener('click', e => {
      if (e.target === overlayModal) closeModal();
    });
  }

  // ========== Маска для телефона ==========
  const phoneInput = document.querySelector('input[name="phone"]');
  if (phoneInput && window.IMask) {
    IMask(phoneInput, { mask: '+{7} (000) 000-00-00' });
  }

  // ========== ФИЛЬТРАЦИЯ ТОВАРОВ ==========
  const filterButtons = document.querySelectorAll('.catalog-nav__btn');
  const cards = document.querySelectorAll('.catalog-products__grid .product-card');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('catalog-nav__btn--active'));
      btn.classList.add('catalog-nav__btn--active');
      const filter = btn.textContent.trim();
      cards.forEach(card => {
        const cat = card.dataset.category;
        card.style.display = (filter === 'Все' || cat === filter) ? '' : 'none';
      });
    });
  });

  // ========== ИЗБРАННОЕ ==========
  const STORAGE_KEY = 'favorites';
  function loadFavs() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }
  function saveFavs(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  const favSet = new Set(loadFavs());
  document.querySelectorAll('.product-card__wishlist').forEach(button => {
    const card = button.closest('.product-card');
    const id = card.dataset.id;
    const img = button.querySelector('.heart-icon');
    const outlineSrc = img.dataset.outline;
    const filledSrc  = img.dataset.filled;

    if (favSet.has(id)) {
      button.classList.add('active');
      img.src = filledSrc;
    }

    button.addEventListener('click', () => {
      const isActive = button.classList.toggle('active');
      img.src = isActive ? filledSrc : outlineSrc;

      if (isActive) favSet.add(id);
      else favSet.delete(id);

      saveFavs(Array.from(favSet));
    });
  });
});
