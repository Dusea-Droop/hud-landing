// ============================================
// 1. БУРГЕР-МЕНЮ
// ============================================
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    nav.classList.toggle('active');
  });

  document.querySelectorAll('.nav__list a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
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
// 5. СКРОЛЛ ШАПКИ
// ============================================
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (header) {
    if (window.pageYOffset > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
});

console.log('🚀 HUDStudio — сайт готов!');