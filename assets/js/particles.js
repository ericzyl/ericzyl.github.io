/**
 * Particle Background Animation System
 * Creates a neural network-style particle animation with professional academic styling
 */

class ParticleNetwork {
  constructor(containerId = 'particle-canvas') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.canvas = document.createElement('canvas');
    this.canvas.id = containerId;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };

    // Configuration
    this.config = {
      particleCount: 80,
      particleSize: { min: 2, max: 4 },
      particleColor: 'rgba(0, 86, 179, 0.6)',
      lineColor: 'rgba(0, 86, 179, 0.2)',
      lineDistance: 150,
      speed: { min: 0.5, max: 1.5 }
    };

    this.init();
  }

  init() {
    this.setupCanvas();
    this.createParticles();
    this.setupEventListeners();
    this.animate();
  }

  setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.pointerEvents = 'none';
    document.body.insertBefore(this.canvas, document.body.firstChild);
  }

  createParticles() {
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min,
        speedX: (Math.random() - 0.5) * this.config.speed.max * 2,
        speedY: (Math.random() - 0.5) * this.config.speed.max * 2
      });
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.handleResize());
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('mouseout', () => this.handleMouseOut());
  }

  handleResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createParticles();
  }

  handleMouseMove(e) {
    this.mouse.x = e.x;
    this.mouse.y = e.y;
  }

  handleMouseOut() {
    this.mouse.x = null;
    this.mouse.y = null;
  }

  drawParticles() {
    this.particles.forEach(particle => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = this.config.particleColor;
      this.ctx.fill();
    });
  }

  drawLines() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.config.lineDistance) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = this.config.lineColor;
          this.ctx.lineWidth = 1;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  handleMouseInteraction() {
    if (this.mouse.x === null || this.mouse.y === null) return;

    this.particles.forEach(particle => {
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.mouse.radius) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (this.mouse.radius - distance) / this.mouse.radius;
        const directionX = forceDirectionX * force * 2;
        const directionY = forceDirectionY * force * 2;

        particle.x -= directionX;
        particle.y -= directionY;
      }
    });
  }

  updateParticles() {
    this.particles.forEach(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Boundary check with bounce effect
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.speedX = -particle.speedX;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.speedY = -particle.speedY;
      }
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.handleMouseInteraction();
    this.updateParticles();
    this.drawLines();
    this.drawParticles();
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize particle system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on homepage
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    new ParticleNetwork('particle-canvas');
  }
});