/**
 * Miguel García - Interactive Landing Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      menuToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  // 2. Sticky Header elevation on scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 3. Active Nav Link on Scroll Spy
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

  // 4. Sector & Market Filter Tabs
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

  // 5. Copy Email to Clipboard with Toast Notification
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
          showToast(`¡Correo copiado: ${email}!`);
          const copyLabel = copyEmailBtn.querySelector('.copy-label');
          if (copyLabel) {
            const originalText = copyLabel.textContent;
            copyLabel.textContent = '¡Copiado!';
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

  // 6. Year in Footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});

// Contact Form Submission Handler: opens user email client with subject & body
function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('userName').value.trim();
  const subjectSelect = document.getElementById('userSubject').value;
  const message = document.getElementById('userMessage').value.trim();

  const mailSubject = encodeURIComponent(`[Contacto Web] ${subjectSelect} - ${name}`);
  const mailBody = encodeURIComponent(
    `Hola Miguel,\n\nMi nombre/empresa: ${name}\nMotivo: ${subjectSelect}\n\nDetalles del mensaje:\n${message}\n\nQuedo a la espera de tu respuesta.`
  );

  window.location.href = `mailto:engmiguelgarcia@gmail.com?subject=${mailSubject}&body=${mailBody}`;
}
