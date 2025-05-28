document.addEventListener('DOMContentLoaded', function() {
  // ========== SISTEMA DE RESEÑAS ==========
  const reviewForm = document.getElementById('review-form');
  const starsContainer = document.getElementById('star-rating');
  const stars = starsContainer.querySelectorAll('.star');
  
  // Cargar reseñas desde localStorage o inicializar array
  let reviews = JSON.parse(localStorage.getItem('reviews')) || [
    { name: 'Ana G.', text: 'Me encanta Pill Time, me recuerda siempre mis medicinas sin fallar.', stars: 4 },
    { name: 'Luis R.', text: 'Muy útil para mi abuelita, ya no se le olvida tomar sus pastillas.', stars: 5 },
    { name: 'María S.', text: 'La mejor app para recordatorios de medicamentos que he usado.', stars: 5 },
    { name: 'Carlos M.', text: 'Funciona bien, pero me gustaría más personalización.', stars: 3 },
    { name: 'Laura P.', text: 'Increíblemente útil para manejar múltiples medicamentos.', stars: 5 },
    { name: 'Javier L.', text: 'Simple pero efectiva, justo lo que necesitaba.', stars: 4 }
  ];

  // ========== CARRUSEL DE RESEÑAS ==========
  const reviewsTrack = document.getElementById('reviews-track');
  const prevBtn = document.getElementById('reviews-prev');
  const nextBtn = document.getElementById('reviews-next');
  let currentPosition = 0;
  let cardWidth = 320; // Valor por defecto, se actualizará después
  let visibleCards = 3; // Cantidad de cards visibles

  // Función para actualizar el carrusel
  function updateCarousel() {
    reviewsTrack.style.transform = `translateX(-${currentPosition}px)`;
    
    // Deshabilitar botones cuando no hay más elementos
    prevBtn.disabled = currentPosition === 0;
    nextBtn.disabled = currentPosition >= (reviews.length - visibleCards) * cardWidth;
  }

  // Función para crear las cards de reseñas
  function createReviewCards() {
    reviewsTrack.innerHTML = '';
    
    reviews.forEach(review => {
      const starRating = '★'.repeat(review.stars) + '☆'.repeat(5 - review.stars);
      
      const reviewCard = document.createElement('div');
      reviewCard.className = 'card flex-shrink-0';
      reviewCard.style.width = '300px';
      reviewCard.innerHTML = `
        <div class="card-body">
          <strong>${review.name}</strong>
          <div class="stars text-warning">${starRating}</div>
          <p class="mt-2">${review.text}</p>
        </div>
      `;
      
      reviewsTrack.appendChild(reviewCard);
    });

    // Actualizar el ancho de las cards después de crearlas
    if (reviewsTrack.firstChild) {
      cardWidth = reviewsTrack.firstChild.offsetWidth + 20; // Ancho + gap
    }
    
    updateCarousel();
  }

  // Eventos para las flechas del carrusel
  prevBtn.addEventListener('click', () => {
    currentPosition = Math.max(0, currentPosition - cardWidth * visibleCards);
    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    const maxPosition = (reviews.length - visibleCards) * cardWidth;
    currentPosition = Math.min(maxPosition, currentPosition + cardWidth * visibleCards);
    updateCarousel();
  });

  // ========== SISTEMA DE CALIFICACIÓN ==========
  let selectedRating = 0;

  function updateStarsUI(rating) {
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.remove('fa-regular');
        star.classList.add('fa-solid', 'selected');
      } else {
        star.classList.remove('fa-solid', 'selected');
        star.classList.add('fa-regular');
      }
    });
  }

  // Eventos para estrellas
  stars.forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.getAttribute('data-value'));
      updateStarsUI(selectedRating);
    });
    
    star.addEventListener('mouseover', () => {
      const hoverRating = parseInt(star.getAttribute('data-value'));
      updateStarsUI(hoverRating);
    });
    
    star.addEventListener('mouseout', () => {
      updateStarsUI(selectedRating);
    });
  });

  // ========== ENVÍO DE RESEÑAS ==========
  reviewForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('reviewer-name');
    const textInput = document.getElementById('review-text');
    
    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (!name || !text || selectedRating === 0) {
      alert('Por favor completa todos los campos y selecciona una calificación');
      return;
    }

    // Crear nueva reseña
    const newReview = {
      name: name,
      text: text,
      stars: selectedRating
    };

    // Agregar y guardar
    reviews.unshift(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    // Actualizar UI
    createReviewCards();
    currentPosition = 0; // Volver al inicio
    updateCarousel();
    
    // Resetear formulario
    nameInput.value = '';
    textInput.value = '';
    selectedRating = 0;
    updateStarsUI(0);
  });

  // ========== INICIALIZACIÓN ==========
  createReviewCards();

  // Actualizar cantidad de cards visibles según el ancho de pantalla
  function updateVisibleCards() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      visibleCards = 1;
    } else if (screenWidth < 992) {
      visibleCards = 2;
    } else {
      visibleCards = 3;
    }
  }

  window.addEventListener('resize', () => {
    updateVisibleCards();
    updateCarousel();
  });

  updateVisibleCards();

  // ========== ICONOS SOCIALES ==========
  document.querySelectorAll(".social-icons a").forEach(icon => {
    icon.addEventListener("click", () => {
      console.log(`Redireccionando a: ${icon.href}`);
    });
  });
});
const pill = document.getElementById('pill');
const qr = pill.querySelector('.qr-content');
const particles = pill.querySelector('.pill-particles');

pill.addEventListener('click', () => {
  pill.classList.toggle('open');
  qr.classList.toggle('d-none');

  // Mostrar pildoritas solo si se abre
  if (pill.classList.contains('open')) {
    particles.classList.remove('d-none');
    
    // Reiniciar animaciones (para poder hacer clic varias veces)
    const pills = particles.querySelectorAll('.pill-particle');
    pills.forEach(p => {
      p.style.animation = 'none';
      p.offsetHeight; // trigger reflow
      p.style.animation = '';
    });
  } else {
    particles.classList.add('d-none');
  }
});

function createPillRain(count = 30) {
  for (let i = 0; i < count; i++) {
    const pill = document.createElement('div');
    pill.classList.add('pill-rain');
    pill.textContent = '💊';

    // Posición aleatoria y tamaño
    pill.style.left = `${Math.random() * 100}vw`;
    pill.style.fontSize = `${16 + Math.random() * 20}px`;
    pill.style.animationDuration = `${2 + Math.random() * 2}s`;

    document.body.appendChild(pill);

    // Eliminar la píldora después de la animación
    pill.addEventListener('animationend', () => {
      pill.remove();
    });
  }
}

// Activar lluvia cuando se abra la píldora
pill.addEventListener('click', () => {
  if (pill.classList.contains('open')) {
    createPillRain(40); // ajusta el número de píldoras si quieres
  }
});