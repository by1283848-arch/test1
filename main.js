const themeToggle = document.getElementById('theme-toggle');
const spinBtn = document.getElementById('spin-btn');
const maxNumberInput = document.getElementById('max-number');
const rouletteStrip = document.getElementById('roulette-strip');
const fullscreenBtn = document.getElementById('fullscreen-btn');

// Theme Logic
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
  document.documentElement.setAttribute('data-theme', currentTheme);
  themeToggle.innerHTML = currentTheme === 'dark' ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
}

themeToggle.addEventListener('click', () => {
  let theme = document.documentElement.getAttribute('data-theme');
  if (theme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    themeToggle.innerHTML = '<i data-lucide="moon"></i>';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    themeToggle.innerHTML = '<i data-lucide="sun"></i>';
  }
  lucide.createIcons();
});

// Fullscreen Logic
fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable full-screen mode: ${err.message}`);
    });
    fullscreenBtn.innerHTML = '<i data-lucide="minimize"></i>';
  } else {
    document.exitFullscreen();
    fullscreenBtn.innerHTML = '<i data-lucide="maximize"></i>';
  }
  lucide.createIcons();
});

// Update icon on esc key
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    fullscreenBtn.innerHTML = '<i data-lucide="maximize"></i>';
    lucide.createIcons();
  }
});

// Confetti Effect
function createConfetti() {
  const container = document.querySelector('.bento-main');
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    const x = Math.random() * container.offsetWidth;
    const y = -20;
    const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
    
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.backgroundColor = color;
    particle.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    container.appendChild(particle);
    
    const animation = particle.animate([
      { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${(Math.random() - 0.5) * 200}px, ${container.offsetHeight}px) rotate(${Math.random() * 1000}deg)`, opacity: 0 }
    ], {
      duration: 1000 + Math.random() * 2000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    animation.onfinish = () => particle.remove();
  }
}

// Roulette Logic
let isSpinning = false;

spinBtn.addEventListener('click', () => {
  if (isSpinning) return;
  
  const maxNum = parseInt(maxNumberInput.value) || 100;
  const clampedMax = Math.min(Math.max(maxNum, 1), 1000);
  maxNumberInput.value = clampedMax;

  isSpinning = true;
  spinBtn.disabled = true;

  // Reset Strip
  const rouletteContainer = document.querySelector('.roulette-container');
  rouletteStrip.style.transition = 'none';
  rouletteStrip.style.transform = 'translateX(0)';
  rouletteStrip.innerHTML = '';
  
  const itemWidth = 100;
  const totalItems = 60; // Numbers to show in the strip
  const winningIndex = totalItems - 10; // The winning number will be near the end
  const winningNumber = Math.floor(Math.random() * clampedMax) + 1;

  // Generate Items
  for (let i = 0; i < totalItems; i++) {
    const item = document.createElement('span');
    item.classList.add('roulette-item');
    if (i === winningIndex) {
      item.textContent = winningNumber;
      item.id = 'winner-item';
    } else {
      item.textContent = Math.floor(Math.random() * clampedMax) + 1;
    }
    rouletteStrip.appendChild(item);
  }

  // Trigger Animation
  setTimeout(() => {
    rouletteContainer.classList.add('spinning');
    rouletteStrip.style.transition = 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)';
    // Center the item: offset so that item center is at container center
    // Container center is at 0 (since strip starts at left: 50%)
    // To center i-th item, its center (i*100 + 50) must be at 0.
    const offset = -(winningIndex * itemWidth + 50);
    rouletteStrip.style.transform = `translateX(${offset}px)`;
  }, 50);

  setTimeout(() => {
    rouletteContainer.classList.remove('spinning');
    const winner = document.getElementById('winner-item');
    winner.classList.add('winner');
    winner.classList.add('win-animation');
    document.querySelector('.bento-main').classList.add('confetti-glow');
    
    createConfetti();

    setTimeout(() => {
      isSpinning = false;
      spinBtn.disabled = false;
      document.querySelector('.bento-main').classList.remove('confetti-glow');
    }, 2000);
  }, 4100);
});
