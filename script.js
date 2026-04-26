document.addEventListener("DOMContentLoaded", () => {
  
  // 1. MENÚ MÓVIL (HAMBURGUESA)
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');
  const siteHeader = document.getElementById('main-header');

  if (mobileBtn && mainNav) {
    mobileBtn.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });

    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
      });
    });
  }

  // 2. ANIMACIONES DE REVELADO AL HACER SCROLL
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, { root: null, threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
  revealElements.forEach(el => revealObserver.observe(el));

  // 3. HEADER DINÁMICO PC
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // 4. SCROLL SUAVE DEL MENÚ
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if(target) {
        window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
      }
    });
  });

  // 5. CLONAR TESTIMONIOS PARA CARRUSEL INFINITO
  const testimonialTrack = document.getElementById('testimonial-track');
  if (testimonialTrack) {
    // Clonamos el contenido exacto de las tarjetas y lo pegamos al final
    // para crear un efecto de "rueda" perfecta y sin fin.
    const clone = testimonialTrack.innerHTML;
    testimonialTrack.innerHTML += clone;
  }

  // 6. ACORDEÓN FAQ
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isOpen = answer.style.maxHeight;
      document.querySelectorAll('.faq-answer').forEach(ans => ans.style.maxHeight = null);
      document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('active'));
      if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + "px";
        question.classList.add('active');
      }
    });
  });

  // 7. FILTROS DE PORTAFOLIO
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        if(filter === 'todos' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
          setTimeout(() => item.classList.add('active'), 50);
        } else {
          item.style.display = 'none';
          item.classList.remove('active');
        }
      });
    });
  });

  // 8. SLIDER ANTES/DESPUÉS
  const container = document.getElementById('ba-container');
  const sliderHandle = document.getElementById('slider-handle');
  const beforeWrapper = document.getElementById('img-before-wrap');
  let isDragging = false;

  if (container && sliderHandle && beforeWrapper) {
    const updateSlider = (e) => {
      if (!isDragging) return;
      const rect = container.getBoundingClientRect();
      let x = (e.type.includes('mouse') ? e.pageX : e.touches[0].pageX) - rect.left;
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;
      let percentage = (x / rect.width) * 100;
      sliderHandle.style.left = `${percentage}%`;
      beforeWrapper.style.width = `${percentage}%`;
    };
    sliderHandle.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', updateSlider);
    sliderHandle.addEventListener('touchstart', () => isDragging = true);
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', updateSlider);
  }

  // 9. VISOR DE IMÁGENES (LIGHTBOX)
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeLightbox = document.querySelector('.close-lightbox');
  const prevBtn = document.getElementById('prev-img');
  const nextBtn = document.getElementById('next-img');
  let currentImgIndex = 0;
  let visibleImages = [];

  function updateVisibleImages() {
    visibleImages = Array.from(document.querySelectorAll('.gallery-item'))
      .filter(item => item.style.display !== 'none')
      .map(item => item.querySelector('img').src);
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      updateVisibleImages();
      const clickedSrc = e.currentTarget.querySelector('img').src;
      currentImgIndex = visibleImages.indexOf(clickedSrc);
      showLightbox(clickedSrc);
    });
  });

  function showLightbox(src) {
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
    setTimeout(() => lightbox.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
  }

  function hideLightbox() {
    lightbox.classList.remove('active');
    setTimeout(() => { lightbox.style.display = 'none'; }, 300);
    document.body.style.overflow = 'auto';
  }

  closeLightbox.addEventListener('click', hideLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) hideLightbox();
  });

  prevBtn.addEventListener('click', () => {
    currentImgIndex = (currentImgIndex > 0) ? currentImgIndex - 1 : visibleImages.length - 1;
    lightboxImg.src = visibleImages[currentImgIndex];
  });

  nextBtn.addEventListener('click', () => {
    currentImgIndex = (currentImgIndex < visibleImages.length - 1) ? currentImgIndex + 1 : 0;
    lightboxImg.src = visibleImages[currentImgIndex];
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
      if (e.key === 'Escape') hideLightbox();
      if (e.key === 'ArrowLeft') prevBtn.click();
      if (e.key === 'ArrowRight') nextBtn.click();
    }
  });

  // 10. MODALES DE PLANES
  const planData = {
    esencial: {
      title: "Paquete Esencial",
      price: "30€",
      msg: "Hola Gabriel, me interesa agendar el Paquete Esencial de Fotografía.",
      includes: [
        "Cobertura fotográfica profesional de la propiedad",
        "Técnica HDR/Flambient para exposición perfecta",
        "2 fotografías por espacio principal",
        "Asesoramiento para preparación del inmueble"
      ]
    },
    estrella: {
      title: "Paquete Estrella",
      price: "45€",
      msg: "Hola Gabriel, me interesa agendar el Paquete Estrella (Fotos + Video).",
      includes: [
        "Todo lo del paquete Esencial",
        "Grabación de Video Recorrido en formato vertical",
        "Edición optimizada para Reels de Instagram y TikTok",
        "Transiciones dinámicas y música en tendencia"
      ]
    },
    premium: {
      title: "Premium Asesor",
      price: "60€",
      msg: "Hola Gabriel, me interesa el Paquete Premium Asesor para mi marca personal.",
      includes: [
        "Todo lo del paquete Estrella",
        "Grabación tuya presentando la propiedad frente a cámara",
        "Captura de audio profesional con micrófonos DJI",
        "Dirección de cámara el día de la sesión"
      ]
    }
  };

  const modal = document.getElementById('plan-modal');
  const closeModal = document.querySelector('.close-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalPrice = document.getElementById('modal-price');
  const modalIncludes = document.getElementById('modal-includes');
  const modalBtn = document.getElementById('modal-btn');
  const openModalBtns = document.querySelectorAll('.open-modal');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const planId = btn.getAttribute('data-plan');
      const data = planData[planId];
      
      modalTitle.textContent = data.title;
      modalPrice.textContent = data.price;
      
      modalIncludes.innerHTML = '';
      data.includes.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        modalIncludes.appendChild(li);
      });

      const phone = "584123590065";
      const encodedMsg = encodeURIComponent(data.msg);
      modalBtn.href = `https://wa.me/${phone}?text=${encodedMsg}`;

      modal.style.display = 'flex';
      setTimeout(() => modal.classList.add('active'), 10);
      document.body.style.overflow = 'hidden';
    });
  });

  closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
    document.body.style.overflow = 'auto';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal.click();
  });
});
