document.addEventListener("DOMContentLoaded", () => {
  // 1. SCROLL SUAVE DEL MENÚ
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if(target) {
        window.scrollTo({
          top: target.offsetTop - 70, // Ajuste por el header fijo
          behavior: 'smooth'
        });
      }
    });
  });

  // 2. ACORDEÓN DE FAQ
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isOpen = answer.style.maxHeight;
      
      // Cerrar todas
      document.querySelectorAll('.faq-answer').forEach(ans => {
        ans.style.maxHeight = null;
        ans.previousElementSibling.style.color = 'var(--color-text)';
      });

      // Abrir la seleccionada si estaba cerrada
      if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + "px";
        question.style.color = 'var(--color-primary)';
      }
    });
  });

  // 3. FILTROS DE PORTAFOLIO (Lógica inicial)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remover clase active
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
});