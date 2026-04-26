document.addEventListener("DOMContentLoaded", () => {
  
  // 1. SCROLL SUAVE DEL MENÚ
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if(target) {
        window.scrollTo({
          top: target.offsetTop - 70, 
          behavior: 'smooth'
        });
      }
    });
  });

  // 2. ACORDEÓN DE FAQ MEJORADO
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isOpen = answer.style.maxHeight;
      
      // Cerrar todas
      document.querySelectorAll('.faq-answer').forEach(ans => {
        ans.style.maxHeight = null;
      });
      document.querySelectorAll('.faq-question').forEach(q => {
        q.classList.remove('active');
      });

      // Abrir la seleccionada si estaba cerrada
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

  // 4. SLIDER ANTES Y DESPUÉS
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
});
