/* VIORA - Canvas Smoke Particle Engine */

export function initSmokeEngine() {
  const canvas = document.getElementById('smoke-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let particles = [];
  
  // High-density scaling
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Smoke particle class
  class SmokeParticle {
    constructor() {
      this.reset();
      // Start randomly positioned vertically for initial fill
      this.y = Math.random() * canvas.height;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 100;
      this.size = Math.random() * 120 + 80; // Large cloud sizes
      this.speedY = -(Math.random() * 0.4 + 0.15); // Slow upward speed
      this.speedX = Math.random() * 0.2 - 0.1; // Very gentle drift
      this.alpha = 0; // Starts invisible
      this.maxAlpha = Math.random() * 0.08 + 0.02; // Very faint, ambient glow
      this.fadeInSpeed = 0.005;
      this.fadeOutY = canvas.height * 0.1; // Fade out completely in the top 10%
      this.spin = Math.random() * Math.PI * 2;
      this.spinSpeed = (Math.random() * 0.002 - 0.001);
      this.waveFreq = Math.random() * 0.002 + 0.001;
      this.waveAmplitude = Math.random() * 1.5 + 0.5;
    }

    update(time) {
      this.y += this.speedY;
      // Sideways sine-wave wiggle
      this.x += this.speedX + Math.sin(this.y * this.waveFreq) * (this.waveAmplitude * 0.1);
      this.spin += this.spinSpeed;

      // Handle opacity lifecycle
      if (this.y > canvas.height) {
        // Just born / rising from bottom
        this.alpha = 0;
      } else if (this.y < this.fadeOutY) {
        // Fading out as it nears top
        this.alpha = Math.max(0, this.alpha - 0.002);
      } else if (this.alpha < this.maxAlpha) {
        // Normal fade in
        this.alpha = Math.min(this.maxAlpha, this.alpha + this.fadeInSpeed);
      }

      // Recycle if it floats off screen
      if (this.y < -this.size || this.x < -this.size || this.x > canvas.width + this.size) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.spin);

      // Draw soft cloud-like radial gradient
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
      
      // Let the color adjust if light theme is active
      const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
      const color = isLightTheme ? '242, 235, 224' : '197, 168, 128'; // Warm ivory vs soft gold smoke
      const opacityFactor = isLightTheme ? 0.35 : 0.45;

      grad.addColorStop(0, `rgba(${color}, ${opacityFactor})`);
      grad.addColorStop(0.3, `rgba(${color}, 0.15)`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Populate particles
  const particleCount = 28; // Optimized for performance and visual density
  for (let i = 0; i < particleCount; i++) {
    particles.push(new SmokeParticle());
  }

  // Main render loop
  function animate(timestamp) {
    // Clear with transparent layer to maintain layout background gradients
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update(timestamp);
      particles[i].draw();
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animate(0);

  // Return clean-up handler
  return {
    destroy: () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    }
  };
}
