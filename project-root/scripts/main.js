document.addEventListener('DOMContentLoaded', () => {
    // Навешиваем клики на все ссылки в .has-submenu (в любом уровне)
    document.querySelectorAll('.menu li.has-submenu > a').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
  
        const li = link.parentElement;
        const parentUl = li.parentElement; // может быть .menu или .submenu
  
        // Закрываем все открытые пункты только на том же уровне
        parentUl
          .querySelectorAll(':scope > li.has-submenu.open')
          .forEach(openLi => {
            if (openLi !== li) openLi.classList.remove('open');
          });
  
        // Переключаем текущее
        li.classList.toggle('open');
      });
    });
  
    // Если кликаем вне меню — полностью закрываем все подменю
    document.addEventListener('click', e => {
      if (!e.target.closest('.header__nav')) {
        document.querySelectorAll('.menu li.has-submenu.open')
          .forEach(openLi => openLi.classList.remove('open'));
      }
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelector('.catalog__slides');
    const prev   = document.querySelector('.catalog__arrow--prev');
    const next   = document.querySelector('.catalog__arrow--next');
    const slide  = document.querySelector('.catalog__slide');
    if (!slides || !prev || !next || !slide) return;
  
    const style = getComputedStyle(slides);
    const gap   = parseInt(style.gap) || 0;
    const step  = slide.offsetWidth + gap;
  
    const updateButtons = () => {
      const maxScroll = slides.scrollWidth - slides.clientWidth;
      prev.disabled = slides.scrollLeft <= 0;
      next.disabled = slides.scrollLeft >= maxScroll;
    };
  
    updateButtons();
  
    const scrollByStep = (delta) => {
      slides.scrollBy({ left: delta, behavior: 'smooth' });
      setTimeout(updateButtons, 300);
    };
  
    prev.addEventListener('click', () => scrollByStep(-step));
    next.addEventListener('click', () => scrollByStep(+step));
    slides.addEventListener('scroll', updateButtons);
  });

  document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelector('.team__slides');
    const prev   = document.querySelector('.team__arrow--prev');
    const next   = document.querySelector('.team__arrow--next');
    const slide  = document.querySelector('.team__slide');
    if (!slides || !prev || !next || !slide) return;
  
    // вычисляем размер одного «шага»: ширина слайда + gap
    const style = getComputedStyle(slides);
    const gap   = parseInt(style.gap) || 0;
    const step  = slide.offsetWidth + gap;
  
    const updateButtons = () => {
      const maxScroll = slides.scrollWidth - slides.clientWidth;
      prev.disabled = slides.scrollLeft <= 0;
      next.disabled = slides.scrollLeft >= maxScroll;
    };
  
    // сразу выставляем состояние стрелок
    updateButtons();
  
    const scrollByStep = (delta) => {
      slides.scrollBy({ left: delta, behavior: 'smooth' });
      // через пол секунды (достаточно для анимации) обновляем disabled
      setTimeout(updateButtons, 500);
    };
  
    prev.addEventListener('click', () => scrollByStep(-step));
    next.addEventListener('click', () => scrollByStep(+step));
    slides.addEventListener('scroll', updateButtons);
  });

  document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.testimonials__slider');
    const list   = document.querySelector('.testimonials__list');
    const prev   = document.querySelector('.testimonials__nav--prev');
    const next   = document.querySelector('.testimonials__nav--next');
    if (!slider || !list || !prev || !next) return;
  
    // Возвращает величину прокрутки: 
    // на мобилке — ширина одного слайда + gap,
    // на десктопе — умноженная на число видимых сразу.
    function computeStep() {
      const style = getComputedStyle(list);
      const gap = parseInt(style.columnGap) || 0;
      const slideEl = list.querySelector('.testimonial');
      const slideW = slideEl.offsetWidth;
      const full = slideW + gap;
  
      if (window.innerWidth <= 768) {
        return full;
      } else {
        // сколько целых слайдов влезает по ширине?
        const visible = Math.floor((slider.clientWidth + gap) / full) || 1;
        return full * visible;
      }
    }
  
    let step = computeStep();
  
    function updateButtons() {
      const maxScroll = list.scrollWidth - slider.clientWidth;
      prev.disabled = list.scrollLeft <= 0;
      next.disabled = list.scrollLeft >= maxScroll - 1;
      step = computeStep();
    }
  
    function scrollBy(sign) {
      list.scrollBy({ left: sign * step, behavior: 'smooth' });
      setTimeout(updateButtons, 300);
    }
  
    prev.addEventListener('click', () => scrollBy(-1));
    next.addEventListener('click', () => scrollBy( 1));
    list.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
  
    updateButtons();
  });

  document.addEventListener('DOMContentLoaded', () => {
    const burger   = document.querySelector('.header__toggle');
    const menu     = document.querySelector('.header__mobile-menu');
    const overlay  = document.querySelector('.header__mobile-overlay');
    const closeBtn = document.querySelector('.header__mobile-close');
    const subs     = document.querySelectorAll('.mobile-menu li.has-submenu > a');
  
    // Если чего-то нет — выходим, чтобы не получить TypeError
    if (!burger || !menu || !overlay || !closeBtn) return;
  
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
      // если клик пришёл **не** по фону (а по потомку), — не закрываем
      if (e.target === overlay) {
        closeMenu();
      }
    });
      
    // Подменю, если нужно
    subs.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const li = link.parentElement;
        li.classList.toggle('open');
      });
    });
  });

  document.querySelectorAll('.submenu-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const li = btn.closest('.has-submenu');
      li.classList.toggle('open');
      // Обновляем aria-label
      const expanded = li.classList.contains('open');
      btn.setAttribute('aria-label', expanded ? 'Закрыть подменю' : 'Открыть подменю');
    });
  });
  
  // Кнопка закрытия
  document.querySelector('.header__mobile-close').addEventListener('click', () => {
    document.querySelector('.header__mobile-overlay').classList.remove('open');
  });

  document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('modal-overlay');
    const btnOpen = document.querySelector('.open-modal');
    const btnClose = document.querySelector('.modal__close');
  
    btnOpen.addEventListener('click', () => {
      overlay.classList.add('open');
      // запретить прокрутку фона
      document.body.style.overflow = 'hidden';
    });
  
    btnClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', e => {
      // закрываем, только если клик по фону, а не по окну
      if (e.target === overlay) closeModal();
    });
  
    function closeModal() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.querySelector('input[name="phone"]');
    IMask(phoneInput, {
      mask: '+{7} (000) 000-00-00'
    });
  });

  document.querySelectorAll('.product-card__wishlist').forEach(button => {
    button.addEventListener('click', function() {
      this.classList.toggle('active');
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    // ***** Фильтрация карточек *****
    const filterButtons = document.querySelectorAll('.catalog-nav__btn');
    const cardsContainer = document.querySelector('.catalog-products__grid');
    const cards = cardsContainer.querySelectorAll('.product-card');
  
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // 1) Переключаем стили кнопок
        filterButtons.forEach(b => b.classList.remove('catalog-nav__btn--active'));
        btn.classList.add('catalog-nav__btn--active');
  
        // 2) Фильтруем карточки
        const filter = btn.textContent.trim();
        cards.forEach(card => {
          const cat = card.dataset.category;
          card.style.display = (filter === 'Все' || cat === filter)
            ? ''   // показываем
            : 'none'; // скрываем
        });
      });
    });
  
    // ***** Избранное (localStorage) *****
    const favButtons = document.querySelectorAll('.product-card__wishlist');
    const STORAGE_KEY = 'favorites';
  
    // прочитать текущий список избранного из storage
    function loadFavs() {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      } catch {
        return [];
      }
    }
    function saveFavs(arr) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    }
  
    let favs = loadFavs();
  
    favButtons.forEach(btn => {
      const card = btn.closest('.product-card');
      const id = card.dataset.id;
  
      // при загрузке, если уже в избранном — отметить
      if (favs.includes(id)) {
        btn.classList.add('active');
      }
  
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        if (btn.classList.contains('active')) {
          // добавить
          if (!favs.includes(id)) favs.push(id);
        } else {
          // убрать
          favs = favs.filter(x => x !== id);
        }
        saveFavs(favs);
      });
    });
  });
  
  
  
  