document.addEventListener('DOMContentLoaded', () => {

  // ── Soft Floating Dots ──
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, dots = [];
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);

    class Dot {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * w; this.y = Math.random() * h;
        this.size = Math.random() * 2.5 + 1;
        this.speedX = (Math.random() - 0.5) * 0.12;
        this.speedY = (Math.random() - 0.5) * 0.08;
        this.opacity = Math.random() * 0.12 + 0.03;
        this.hue = Math.random() > 0.5 ? '26,107,90' : '232,123,53';
      }
      update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x < -10 || this.x > w + 10 || this.y < -10 || this.y > h + 10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.hue},${this.opacity})`;
        ctx.fill();
      }
    }
    for (let i = 0; i < 40; i++) dots.push(new Dot());
    const animate = () => { ctx.clearRect(0, 0, w, h); dots.forEach(d => { d.update(); d.draw(); }); requestAnimationFrame(animate); };
    animate();
  }

  // ── Scroll Reveal ──
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── Sticky Nav ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 80), { passive: true });

  // ── Mobile Menu ──
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  hamburger.addEventListener('click', () => { hamburger.classList.toggle('open'); navLinks.classList.toggle('open'); });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { hamburger.classList.remove('open'); navLinks.classList.remove('open'); }));

  // ── Active Nav ──
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');
  const updateNav = () => {
    const y = window.scrollY + 200;
    sections.forEach(s => { if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) navItems.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + s.id)); });
  };
  window.addEventListener('scroll', updateNav, { passive: true }); updateNav();

  // ── Smooth Scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const t = document.querySelector(targetId);
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── Portfolio Filtering (Panels) ──
  const categoryPanels = document.querySelectorAll('.category-panel');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  categoryPanels.forEach(panel => {
    panel.addEventListener('click', () => {
      // Toggle active class on panels
      categoryPanels.forEach(p => p.classList.remove('active'));
      panel.classList.add('active');

      const target = panel.getAttribute('data-target');

      // Filter cards
      portfolioCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (cat === target) {
          card.style.display = 'block';
          // Force a reflow to make transition work
          void card.offsetWidth;
          card.classList.add('visible'); // Add scroll reveal visibility class
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // ── Lightbox Gallery ──
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  let currentImages = [];
  let currentIndex = 0;

  const openLightbox = (imagesList, index) => {
    currentImages = imagesList;
    currentIndex = index;
    updateLightbox();
    if (lightbox) {
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden'; // Prevents background scroll
    }
  };

  const updateLightbox = () => {
    if (!lightboxImg || !currentImages[currentIndex]) return;
    const src = currentImages[currentIndex].getAttribute('src');
    const alt = currentImages[currentIndex].getAttribute('alt') || 'Project Image';
    lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = alt;
  };

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  // Setup click listeners for each portfolio card
  document.querySelectorAll('.portfolio-card').forEach(card => {
    // Find all images within this card (thumbnail + screenshots)
    const images = Array.from(card.querySelectorAll('img'));
    
    images.forEach((img, idx) => {
      img.addEventListener('click', () => {
        openLightbox(images, idx);
      });
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  
  if (prevBtn) prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateLightbox();
  });

  if (nextBtn) nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateLightbox();
  });

  // Close lightbox on clicking outside the image
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content')) closeLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeVideoModal();
    }
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      updateLightbox();
    }
    if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % currentImages.length;
      updateLightbox();
    }
  });
  // ── Video Walkthrough Modal ──
  const videoModal = document.getElementById('video-modal');
  const modalIframe = document.getElementById('modal-iframe');
  const modalVideo = document.getElementById('modal-video');
  const videoCloseBtn = document.querySelector('.video-modal-close');

  const openVideoModal = (videoSrc, isShort = false) => {
    if (!videoModal) return;
    if (isShort) {
      videoModal.classList.add('is-short');
    } else {
      videoModal.classList.remove('is-short');
    }

    const isLocal = videoSrc.endsWith('.mp4') || videoSrc.startsWith('Projects/');
    if (isLocal) {
      if (modalIframe) {
        modalIframe.style.display = 'none';
        modalIframe.src = '';
      }
      if (modalVideo) {
        modalVideo.src = videoSrc;
        modalVideo.style.display = 'block';
        modalVideo.play().catch(err => console.log('Autoplay blocked:', err));
      }
    } else {
      if (modalVideo) {
        modalVideo.style.display = 'none';
        modalVideo.src = '';
      }
      if (modalIframe) {
        modalIframe.src = `https://www.youtube.com/embed/${videoSrc}?autoplay=1&rel=0&modestbranding=1&color=white`;
        modalIframe.style.display = 'block';
      }
    }

    videoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeVideoModal = () => {
    if (!videoModal) return;
    videoModal.classList.remove('open');
    videoModal.classList.remove('is-short');
    if (modalIframe) {
      modalIframe.src = '';
      modalIframe.style.display = 'none';
    }
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.src = '';
      modalVideo.style.display = 'none';
    }
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.portfolio-btn.video').forEach(btn => {
    const videoId = btn.getAttribute('data-video-id');
    const isShort = btn.getAttribute('data-is-short') === 'true';
    if (videoId) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openVideoModal(videoId, isShort);
      });
    }
  });
  if (videoCloseBtn) videoCloseBtn.addEventListener('click', closeVideoModal);

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });
  }
});
