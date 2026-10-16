/**
 * Miguel García - Interactive Landing Page Logic
 * Features:
 * - Dynamic i18n Language Switcher (EN by default, ES toggle) with localStorage persistence
 * - Floating WhatsApp radar bubble & synced localized messages
 * - Interactive Sector / Industry filters
 * - Header scroll spy & sticky elevation
 * - One-click email copy with localized toast
 * - Responsive mobile menu navigation
 */

let currentLang = 'en';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Language Initialization (Default: English)
  const savedLang = localStorage.getItem('miguel_portfolio_lang');
  currentLang = savedLang === 'es' ? 'es' : 'en';
  applyLanguage(currentLang);

  // Language Switcher Buttons
  const langBtns = document.querySelectorAll('[data-set-lang]');
  langBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLang = btn.getAttribute('data-set-lang');
      if (targetLang && targetLang !== currentLang) {
        currentLang = targetLang;
        applyLanguage(currentLang);
        localStorage.setItem('miguel_portfolio_lang', currentLang);
      }
    });
  });

  // 2. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      menuToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    // Close menu when clicking any nav item
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  // 3. Sticky Header elevation on scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 4. Active Nav Link on Scroll Spy
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links .nav-link');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNavOnScroll);

  // 5. Sector & Market Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sectorCards = document.querySelectorAll('.sector-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      sectorCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 6. Copy Email to Clipboard with Toast Notification
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  function showToast(message) {
    if (!toast) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'engmiguelgarcia@gmail.com';
      navigator.clipboard.writeText(email)
        .then(() => {
          const dict = translations[currentLang] || translations.en;
          showToast(currentLang === 'es' ? `¡Correo copiado: ${email}!` : `Email copied: ${email}!`);
          const copyLabel = copyEmailBtn.querySelector('.copy-label');
          if (copyLabel) {
            const originalText = copyLabel.textContent;
            copyLabel.textContent = dict.copiedLabel || 'Copied!';
            setTimeout(() => {
              copyLabel.textContent = originalText;
            }, 2000);
          }
        })
        .catch(() => {
          showToast(`Email: ${email}`);
        });
    });
  }

  // 7. Dynamic Footer Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

/**
 * Apply selected language throughout the DOM
 * @param {string} lang - 'en' or 'es'
 */
function applyLanguage(lang) {
  if (typeof translations === 'undefined') return;
  const dict = translations[lang] || translations.en;

  // 1. Update HTML lang attribute
  document.documentElement.lang = lang;

  // 2. Update Document Title & Meta Description
  if (dict.pageTitle) {
    document.title = dict.pageTitle;
  }
  const metaDesc = document.getElementById('docDesc');
  if (metaDesc && dict.metaDescription) {
    metaDesc.setAttribute('content', dict.metaDescription);
  }

  // 3. Update Elements with data-i18n
  const translatableElements = document.querySelectorAll('[data-i18n]');
  translatableElements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      // If content contains HTML tags (like <strong> or <i class...>), use innerHTML
      if (dict[key].includes('<') && dict[key].includes('>')) {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // 4. Update Inputs & Textareas with data-i18n-placeholder
  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElements.forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  // 5. Update Language Switcher UI (active button styling)
  const langBtns = document.querySelectorAll('[data-set-lang]');
  langBtns.forEach(btn => {
    if (btn.getAttribute('data-set-lang') === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // 6. Update WhatsApp URLs with localized greeting message
  const waGreeting = encodeURIComponent(dict.floatingWaGreeting || 'Hi Miguel, I saw your portfolio and would like to connect.');
  const waUrl = `https://wa.me/573144433323?text=${waGreeting}`;

  const floatingWa = document.getElementById('floatingWaLink');
  if (floatingWa) {
    floatingWa.setAttribute('href', waUrl);
    floatingWa.setAttribute('aria-label', dict.floatingWaTooltip || 'Chat on WhatsApp');
  }

  const contactWaAction = document.getElementById('contactWaAction');
  if (contactWaAction) {
    contactWaAction.setAttribute('href', waUrl);
  }

  const navWaLink = document.getElementById('navWaLink');
  if (navWaLink) {
    navWaLink.setAttribute('href', waUrl);
    navWaLink.setAttribute('title', dict.floatingWaTooltip || 'Chat on WhatsApp');
  }
}

/**
 * Contact Form Submission Handler: pre-fills default email client
 */
function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('userName').value.trim();
  const subjectSelect = document.getElementById('userSubject').value;
  const message = document.getElementById('userMessage').value.trim();

  const isEs = currentLang === 'es';
  const mailSubject = encodeURIComponent(
    isEs ? `[Contacto Web] ${subjectSelect} - ${name}` : `[Web Inquiry] ${subjectSelect} - ${name}`
  );
  const mailBody = encodeURIComponent(
    isEs
      ? `Hola Miguel,\n\nMi nombre/empresa: ${name}\nMotivo: ${subjectSelect}\n\nDetalles del mensaje:\n${message}\n\nQuedo a la espera de tu respuesta.`
      : `Hello Miguel,\n\nMy name/company: ${name}\nTopic: ${subjectSelect}\n\nMessage details:\n${message}\n\nLooking forward to speaking with you.`
  );

  window.location.href = `mailto:engmiguelgarcia@gmail.com?subject=${mailSubject}&body=${mailBody}`;
}
