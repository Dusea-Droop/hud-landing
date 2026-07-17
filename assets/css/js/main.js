// ============================================
// 1. БУРГЕР-МЕНЮ
// ============================================
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    burger.classList.toggle('active');
  });

  document.querySelectorAll('.nav__list a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      burger.classList.remove('active');
    });
  });
}

// ============================================
// 2. АНИМАЦИЯ ЦИФР
// ============================================
function animateNumbers() {
  const statItems = document.querySelectorAll('.stats__item');
  
  statItems.forEach((item) => {
    const target = parseInt(item.dataset.count) || 0;
    const numberElement = item.querySelector('.stats__number');
    if (!numberElement) return;
    
    let current = 0;
    const increment = Math.ceil(target / 50);
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      numberElement.textContent = current + (target === 100 ? '%' : '');
    }, 20);
  });
}

const statsSection = document.querySelector('.stats');
if (statsSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumbers();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(statsSection);
}

// ============================================
// 3. ФОРМА
// ============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const project = document.getElementById('project').value.trim();
    const contact = document.getElementById('contact').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if (!name || !project || !contact) {
      alert('⚠️ Пожалуйста, заполните все обязательные поля!');
      return;
    }
    
    alert(`✅ Спасибо, ${name}! Ваша заявка принята.\n\nМы свяжемся с вами в ближайшее время.`);
    contactForm.reset();
  });
}

// ============================================
// 4. ПЛАВНАЯ ПРОКРУТКА
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// 5. СКРЫВАЮЩИЙСЯ HEADER (скролл вниз → скрыть, вверх → показать)
// ============================================
(function() {
  const header = document.getElementById('header');
  if (!header) return;
  
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  function updateHeader() {
    const currentScrollY = window.scrollY;
    
    // В самом верху — всегда показываем
    if (currentScrollY < 10) {
      header.classList.remove('hidden');
      header.classList.add('at-top');
      header.classList.remove('scrolled');
      lastScrollY = currentScrollY;
      return;
    }
    
    // Убираем at-top, если не в самом верху
    header.classList.remove('at-top');
    
    // Добавляем класс scrolled при скролле
    if (currentScrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // ОСНОВНАЯ ЛОГИКА: скролл вниз → скрыть, вверх → показать
    if (currentScrollY > lastScrollY) {
      // Скролл вниз — скрываем header
      header.classList.add('hidden');
    } else {
      // Скролл вверх — показываем header
      header.classList.remove('hidden');
    }
    
    lastScrollY = currentScrollY;
  }
  
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeader();
        ticking = false;
      });
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', onScroll, { passive: true });
  setTimeout(updateHeader, 100);
})();

// ============================================
// 6. КНОПКА "НАВЕРХ"
// ============================================
const backToTop = document.getElementById('backToTop');

if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// 7. КОНСТРУКТОР ЦЕНЫ
// ============================================
(function() {
  const builder = document.getElementById('priceBuilder');
  if (!builder) return;

  // Все группы опций
  const optionGroups = builder.querySelectorAll('.builder__group');
  const totalPriceEl = document.getElementById('totalPrice');
  const basePriceEl = document.getElementById('basePrice');
  const extrasPriceEl = document.getElementById('extrasPrice');
  const finalPriceEl = document.getElementById('finalPrice');

  // Функция для подсчёта цены
  function calculatePrice() {
    let basePrice = 0;
    let extrasPrice = 0;

    optionGroups.forEach(group => {
      const activeOptions = group.querySelectorAll('.builder__option.active');
      if (!activeOptions.length) return;

      // Для групп с множественным выбором (multi) — суммируем все активные
      const isMulti = group.classList.contains('builder__group--multi');
      
      activeOptions.forEach(option => {
        const price = parseInt(option.dataset.price) || 0;
        
        // Первая группа (количество элементов) — это базовая цена
        const label = group.querySelector('.builder__label');
        if (label && label.textContent.includes('Количество элементов')) {
          basePrice = price;
        } else {
          extrasPrice += price;
        }
      });
    });

    const total = basePrice + extrasPrice;

    // Обновляем UI
    basePriceEl.textContent = `$${basePrice}`;
    extrasPriceEl.textContent = `+$${extrasPrice}`;
    finalPriceEl.textContent = `$${total}`;
    totalPriceEl.textContent = `$${total}`;

    return total;
  }

  // Обработка клика по опциям
  optionGroups.forEach(group => {
    const options = group.querySelectorAll('.builder__option');
    const isMulti = group.classList.contains('builder__group--multi');

    options.forEach(option => {
      option.addEventListener('click', function() {
        if (isMulti) {
          // Множественный выбор — переключаем класс
          this.classList.toggle('active');
        } else {
          // Одиночный выбор — убираем у всех, ставим у текущей
          options.forEach(opt => opt.classList.remove('active'));
          this.classList.add('active');
        }
        calculatePrice();
      });
    });
  });

  // Запускаем расчёт при загрузке
  calculatePrice();
})();

console.log('🚀 HUDStudio — сайт готов!');