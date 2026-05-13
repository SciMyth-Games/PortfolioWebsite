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
  navItems.forEach(link => link.addEventListener('click', e => { const t = document.querySelector(link.getAttribute('href')); if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); } }));
});
