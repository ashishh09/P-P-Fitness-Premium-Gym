/**
 * P&P FITNESS — Premium Gym Website Vanilla JavaScript
 * Handles Navigation, Mobile Drawer, Gallery Filtering, Lightbox,
 * WhatsApp Pre-filled Links, Scroll Reveals, Active States, and Forms.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Sticky Navigation & Header States ---
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('backToTopBtn');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Header sticky shadow & background
    if (scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Back to Top click
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // --- 2. Mobile Hamburger Menu & Drawer ---
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileNav = (open) => {
    const shouldOpen = open !== undefined ? open : !mobileNavDrawer.classList.contains('open');
    if (shouldOpen) {
      hamburgerBtn?.classList.add('active');
      mobileNavDrawer?.classList.add('open');
      mobileNavOverlay?.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      hamburgerBtn?.classList.remove('active');
      mobileNavDrawer?.classList.remove('open');
      mobileNavOverlay?.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  hamburgerBtn?.addEventListener('click', () => toggleMobileNav());
  mobileNavOverlay?.addEventListener('click', () => toggleMobileNav(false));

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileNav(false);
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileNavDrawer?.classList.contains('open')) {
        toggleMobileNav(false);
      }
      if (lightboxModal?.classList.contains('active')) {
        closeLightbox();
      }
    }
  });

  // --- 3. Smooth Scrolling with Offset ---
  const internalNavLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  internalNavLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- 4. Active Navigation State on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-link');

  const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        desktopLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
        mobileNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // --- 5. Gallery Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = '';
          item.classList.remove('is-hidden');
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          item.classList.add('is-hidden');
          setTimeout(() => {
            if (item.classList.contains('is-hidden')) {
              item.style.display = 'none';
            }
          }, 200);
        }
      });
    });
  });

  // --- 6. Gallery Lightbox Modal ---
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');

  let currentGalleryIndex = 0;
  const visibleGalleryItems = () => Array.from(galleryItems).filter(item => !item.classList.contains('is-hidden') && item.style.display !== 'none');

  const openLightbox = (index) => {
    const items = visibleGalleryItems();
    if (!items.length) return;
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;

    currentGalleryIndex = index;
    const targetItem = items[index];
    const imgSrc = targetItem.getAttribute('data-src') || targetItem.querySelector('img')?.src;
    const title = targetItem.getAttribute('data-title') || '';
    const category = targetItem.getAttribute('data-category-label') || '';

    if (lightboxImg) lightboxImg.src = imgSrc;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCategory) lightboxCategory.textContent = category;

    lightboxModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightboxModal?.classList.remove('active');
    document.body.style.overflow = '';
  };

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const items = visibleGalleryItems();
      const index = items.indexOf(item);
      openLightbox(index !== -1 ? index : 0);
    });
  });

  lightboxCloseBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  const showNextImage = (e) => {
    if (e) e.stopPropagation();
    const items = visibleGalleryItems();
    if (!items.length) return;
    currentGalleryIndex = (currentGalleryIndex + 1) % items.length;
    openLightbox(currentGalleryIndex);
  };

  const showPrevImage = (e) => {
    if (e) e.stopPropagation();
    const items = visibleGalleryItems();
    if (!items.length) return;
    currentGalleryIndex = (currentGalleryIndex - 1 + items.length) % items.length;
    openLightbox(currentGalleryIndex);
  };

  lightboxNextBtn?.addEventListener('click', showNextImage);
  lightboxPrevBtn?.addEventListener('click', showPrevImage);

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal?.classList.contains('active')) return;
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  // --- 7. Quick Contact Form / WhatsApp Forwarding ---
  const contactForm = document.getElementById('contactForm');
  const formToast = document.getElementById('formToast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('formName');
      const phoneInput = document.getElementById('formPhone');
      const goalInput = document.getElementById('formGoal');
      const timeInput = document.getElementById('formTime');
      const messageInput = document.getElementById('formMessage');

      const name = nameInput?.value.trim();
      const phone = phoneInput?.value.trim();
      const goal = goalInput?.value || 'General Fitness';
      const time = timeInput?.value || 'Flexible';
      const message = messageInput?.value.trim() || '';

      // Non-blocking inline validation
      if (!name || !phone) {
        if (formToast) {
          formToast.style.borderColor = '#FF4444';
          formToast.style.background = '#301010';
          formToast.style.color = '#FFAAAA';
          formToast.innerHTML = '⚠️ Please provide both your Name and Phone Number.';
          formToast.classList.add('show');
        }
        return;
      }

      // Build WhatsApp message
      const textMessage = `Hello P&P Fitness,\n\nI would like to enquire about gym membership & training.\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n🎯 Fitness Goal: ${goal}\n⏰ Preferred Time: ${time}\n💬 Note: ${message || 'Looking forward to connecting with the team.'}`;

      const encodedMessage = encodeURIComponent(textMessage);
      const whatsappUrl = `https://wa.me/919356560838?text=${encodedMessage}`;

      // Show actionable success toast with direct WhatsApp button
      if (formToast) {
        formToast.style.borderColor = '#2ECC71';
        formToast.style.background = '#1A3E26';
        formToast.style.color = '#E8F8F0';
        formToast.innerHTML = `
          <div style="display:flex; flex-direction:column; gap:8px;">
            <span>✓ <strong>Inquiry formatted successfully!</strong> Connecting you with P&P Fitness team on WhatsApp:</span>
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm" style="align-self: flex-start; text-decoration: none;">
              Click here if chat didn't open automatically →
            </a>
          </div>
        `;
        formToast.classList.add('show');
      }

      // Trigger navigation safely via dynamic link click
      const tempLink = document.createElement('a');
      tempLink.href = whatsappUrl;
      tempLink.target = '_blank';
      tempLink.rel = 'noopener noreferrer';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);

      // Reset form fields
      contactForm.reset();
    });
  }

  // --- 8. Animated Section Reveal on Scroll ---
  const revealItems = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('revealed'));
  }
});
