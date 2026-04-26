document.addEventListener("DOMContentLoaded", () => {
  
  // 1. SCROLL SUAVE
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if(target) {
        window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
      }
    });
  });

  // 2. ACORDEÓN FAQ
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

  // 3. FILTROS DE PORTAFOLIO
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
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 4. SLIDER ANTES/DESPUÉS
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

  // 5. VISOR DE IMÁGENES (LIGHTBOX)
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeLightbox = document.querySelector('.close-lightbox');
  const prevBtn = document.getElementById('prev-img');
  const nextBtn = document.getElementById('next-img');
  let currentImgIndex = 0;
  let visibleImages = [];

  // Actualizar array de imágenes visibles basado en filtros
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
    document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
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

  // Navegación con teclado
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
      if (e.key === 'Escape') hideLightbox();
      if (e.key === 'ArrowLeft') prevBtn.click();
      if (e.key === 'ArrowRight') nextBtn.click();
    }
  });

  // 6. MODALES DE PLANES (B2B)
  const planData = {
    esencial: {
      title: "Paquete Esencial",
      price: "30€",
      msg: "Hola Gabriel, me interesa agendar el Paquete Esencial de Fotografía.",
      includes: [
        "1 a 2 horas de cobertura fotográfica en la propiedad",
        "Técnica HDR avanzada para exposición perfecta",
        "2 fotografías por espacio (ángulos principales)",
        "Entrega en 48 horas hábiles",
        "Asesoramiento para preparación del inmueble"
      ]
    },
    estrella: {
      title: "Paquete Estrella",
      price: "45€",
      msg: "Hola Gabriel, me interesa agendar el Paquete Estrella (Fotos + Video Reel).",
      includes: [
        "Todo lo del paquete Esencial",
        "Grabación de Video Recorrido en formato vertical",
        "Edición optimizada para Reels de Instagram y TikTok",
        "Música en tendencia y transiciones dinámicas",
        "Entrega simultánea de fotos y video"
      ]
    },
    premium: {
      title: "Premium Asesor",
      price: "60€",
      msg: "Hola Gabriel, me interesa el Paquete Premium Asesor para mi marca personal.",
      includes: [
        "Todo lo del paquete Estrella",
        "Grabación del asesor presentando la propiedad en cámara",
        "Captura de audio profesional (Micrófonos inalámbricos DJI)",
        "Edición final estilo reportaje inmobiliario",
        "Dirección de cámara y apoyo con el guion el día de la sesión"
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
      
      // Llenar datos
      modalTitle.textContent = data.title;
      modalPrice.textContent = data.price;
      
      modalIncludes.innerHTML = '';
      data.includes.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        modalIncludes.appendChild(li);
      });

      // Crear link de Whatsapp dinámico
      const phone = "584123590065";
      const encodedMsg = encodeURIComponent(data.msg);
      modalBtn.href = `https://wa.me/${phone}?text=${encodedMsg}`;

      // Mostrar modal
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
