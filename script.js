const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let points = [];
const totalPoints = 45;
let pointer = { x: 0, y: 0, prevY: 0, active: false };

function initLine() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  points = [];
  const spacing = canvas.width / (totalPoints - 1);
  const midY = canvas.height / 2;
  for (let i = 0; i < totalPoints; i++) {
    points.push({
      x: i * spacing,
      y: midY,
      targetY: midY,
      vy: 0
    });
  }
}

function animate() {
  ctx.fillStyle = '#050508';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const midY = canvas.height / 2;

  ctx.strokeStyle = '#ff6b6b';
  ctx.lineWidth = 2.5;
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#ff6b6b';
  ctx.beginPath();

  for (let i = 0; i < totalPoints; i++) {
    let p = points[i];

    if (pointer.active && Math.abs(pointer.x - p.x) < 45) {
      let distanceY = pointer.y - midY;
      p.targetY = midY + (distanceY * 0.4);
    } else {
      p.targetY = midY;
    }

    let ay = (p.targetY - p.y) * 0.15;
    p.vy += ay;
    p.vy *= 0.88;
    p.y += p.vy;

    if (i === 0) {
      ctx.moveTo(p.x, p.y);
    } else {
      let xc = (p.x + points[i - 1].x) / 2;
      let yc = (p.y + points[i - 1].y) / 2;
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
  }

  ctx.lineTo(canvas.width, midY);
  ctx.stroke();
  ctx.shadowBlur = 0;

  requestAnimationFrame(animate);
}

function track(clientX, clientY) {
  pointer.x = clientX;
  pointer.y = clientY;
}

window.addEventListener('touchstart', (e) => {
  pointer.active = true;
  track(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  track(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });

window.addEventListener('touchend', () => pointer.active = false);

window.addEventListener('mousedown', (e) => {
  pointer.active = true;
  track(e.clientX, e.clientY);
});

window.addEventListener('mousemove', (e) => {
  if (pointer.active) track(e.clientX, e.clientY);
});

window.addEventListener('mouseup', () => pointer.active = false);
window.addEventListener('resize', initLine);

initLine();
animate();
