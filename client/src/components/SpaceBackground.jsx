import { useEffect, useRef } from "react";

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

export default function SpaceBackground({ darkMode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let animationFrameId;

    const stars = [];
    const shootingStars = [];
    const explosions = [];
    const birds = [];

    const state = {
      width: window.innerWidth,
      height: window.innerHeight,
      mouseX: window.innerWidth / 2,
      mouseY: window.innerHeight / 2
    };

    function resizeCanvas() {
      state.width = window.innerWidth;
      state.height = window.innerHeight;
      canvas.width = state.width;
      canvas.height = state.height;
    }

    function createStars() {
      stars.length = 0;
      const total = Math.floor((state.width * state.height) / 8000);

      for (let i = 0; i < total; i += 1) {
        stars.push({
          x: Math.random() * state.width,
          y: Math.random() * state.height,
          radius: randomRange(0.6, 1.8),
          alpha: randomRange(0.2, 0.95),
          twinkleSpeed: randomRange(0.0015, 0.01),
          offset: Math.random() * 10
        });
      }
    }

    function spawnShootingStar() {
      shootingStars.push({
        x: Math.random() * state.width,
        y: randomRange(-100, state.height * 0.4),
        length: randomRange(80, 160),
        speedX: randomRange(4, 8),
        speedY: randomRange(3, 6),
        life: 1,
        decay: randomRange(0.005, 0.012)
      });
    }

    function spawnExplosion(x, y) {
      const particles = [];
      const count = 28;

      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = randomRange(1, 4.2);

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: randomRange(0.018, 0.03),
          size: randomRange(1.2, 2.8)
        });
      }

      explosions.push({ particles });
    }

    const clouds = [];

    function createClouds() {
      clouds.length = 0;
      const total = Math.max(4, Math.floor(state.width / 360));

      for (let i = 0; i < total; i += 1) {
        clouds.push({
          x: Math.random() * state.width,
          y: randomRange(state.height * 0.08, state.height * 0.48),
          width: randomRange(120, 240),
          height: randomRange(34, 66),
          speed: randomRange(0.12, 0.34),
          alpha: randomRange(0.2, 0.42)
        });
      }
    }

    function createBirds() {
      birds.length = 0;
      const total = Math.max(5, Math.floor(state.width / 300));

      for (let i = 0; i < total; i += 1) {
        birds.push({
          x: randomRange(-120, state.width + 80),
          y: randomRange(state.height * 0.12, state.height * 0.5),
          speed: randomRange(0.28, 0.72),
          wing: randomRange(5, 10),
          phase: Math.random() * Math.PI * 2,
          alpha: randomRange(0.35, 0.58)
        });
      }
    }

    function drawBackground(time) {
      context.clearRect(0, 0, state.width, state.height);

      const gradient = context.createRadialGradient(
        state.width * 0.25,
        state.height * 0.2,
        50,
        state.width * 0.5,
        state.height * 0.5,
        state.width * 0.9
      );

      if (darkMode) {
        gradient.addColorStop(0, "#121212");
        gradient.addColorStop(0.35, "#070707");
        gradient.addColorStop(1, "#000000");
      } else {
        gradient.addColorStop(0, "#d8eeff");
        gradient.addColorStop(0.48, "#b6dcff");
        gradient.addColorStop(1, "#8ec7ff");
      }

      context.fillStyle = gradient;
      context.fillRect(0, 0, state.width, state.height);

      if (!darkMode) {
        const sunX = state.width * 0.82;
        const sunY = state.height * 0.2;

        const sunGlow = context.createRadialGradient(sunX, sunY, 20, sunX, sunY, 150);
        sunGlow.addColorStop(0, "rgba(255, 245, 196, 0.95)");
        sunGlow.addColorStop(1, "rgba(255, 245, 196, 0)");
        context.fillStyle = sunGlow;
        context.beginPath();
        context.arc(sunX, sunY, 150, 0, Math.PI * 2);
        context.fill();

        clouds.forEach((cloud) => {
          cloud.x += cloud.speed;
          if (cloud.x - cloud.width > state.width + 80) {
            cloud.x = -cloud.width - 80;
          }

          context.fillStyle = `rgba(255, 255, 255, ${cloud.alpha})`;
          context.beginPath();
          context.ellipse(cloud.x, cloud.y, cloud.width * 0.5, cloud.height * 0.5, 0, 0, Math.PI * 2);
          context.ellipse(
            cloud.x - cloud.width * 0.26,
            cloud.y + 4,
            cloud.width * 0.32,
            cloud.height * 0.38,
            0,
            0,
            Math.PI * 2
          );
          context.ellipse(
            cloud.x + cloud.width * 0.22,
            cloud.y + 2,
            cloud.width * 0.34,
            cloud.height * 0.42,
            0,
            0,
            Math.PI * 2
          );
          context.fill();
        });

        birds.forEach((bird) => {
          bird.x += bird.speed;
          if (bird.x > state.width + 140) {
            bird.x = -140;
            bird.y = randomRange(state.height * 0.1, state.height * 0.5);
          }

          const wingLift = Math.sin(time * 0.01 + bird.phase) * 2.4;
          context.strokeStyle = `rgba(30, 57, 90, ${bird.alpha})`;
          context.lineWidth = 1.35;
          context.beginPath();
          context.moveTo(bird.x - bird.wing, bird.y + wingLift);
          context.quadraticCurveTo(bird.x, bird.y - 4, bird.x + bird.wing, bird.y + wingLift);
          context.stroke();
        });
      }

      if (darkMode) {
        stars.forEach((star) => {
          const pulse = Math.sin(time * star.twinkleSpeed + star.offset) * 0.35 + 0.65;
          context.beginPath();
          context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          context.fillStyle = `rgba(255, 255, 255, ${star.alpha * pulse})`;
          context.fill();
        });
      }

      if (darkMode) {
        shootingStars.forEach((meteor, index) => {
          meteor.x += meteor.speedX;
          meteor.y += meteor.speedY;
          meteor.life -= meteor.decay;

          const tailX = meteor.x - meteor.length;
          const tailY = meteor.y - meteor.length * 0.6;

          const lineGradient = context.createLinearGradient(
            meteor.x,
            meteor.y,
            tailX,
            tailY
          );

          lineGradient.addColorStop(0, `rgba(255, 255, 255, ${meteor.life})`);
          lineGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

          context.strokeStyle = lineGradient;
          context.lineWidth = 2;
          context.beginPath();
          context.moveTo(meteor.x, meteor.y);
          context.lineTo(tailX, tailY);
          context.stroke();

          if (meteor.life <= 0 || meteor.x > state.width + 200 || meteor.y > state.height + 200) {
            shootingStars.splice(index, 1);
          }
        });
      }

      explosions.forEach((explosion, explosionIndex) => {
        explosion.particles.forEach((particle, particleIndex) => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vx *= 0.98;
          particle.vy *= 0.98;
          particle.life -= particle.decay;

          context.beginPath();
          context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          const particleTone = darkMode ? "255, 255, 255" : "35, 35, 35";
          context.fillStyle = `rgba(${particleTone}, ${Math.max(particle.life, 0)})`;
          context.fill();

          if (particle.life <= 0) {
            explosion.particles.splice(particleIndex, 1);
          }
        });

        if (!explosion.particles.length) {
          explosions.splice(explosionIndex, 1);
        }
      });

      if (darkMode && Math.random() < 0.0035) {
        spawnShootingStar();
      }

      animationFrameId = requestAnimationFrame(drawBackground);
    }

    function handleClick(event) {
      spawnExplosion(event.clientX, event.clientY);
      if (darkMode && Math.random() < 0.16) {
        spawnShootingStar();
      }
    }

    function handleResize() {
      resizeCanvas();
      createStars();
      createClouds();
      createBirds();
    }

    resizeCanvas();
    createStars();
    createClouds();
    createBirds();
    animationFrameId = requestAnimationFrame(drawBackground);

    window.addEventListener("resize", handleResize);
    window.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
    };
  }, [darkMode]);

  return <canvas ref={canvasRef} className="space-canvas" aria-hidden="true" />;
}
