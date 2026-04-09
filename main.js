const themeToggle = document.getElementById('theme-toggle');
const spinBtn = document.getElementById('spin-btn');
const maxNumberInput = document.getElementById('max-number');
const resultDisplay = document.getElementById('result-number');

// Theme Logic
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
  document.documentElement.setAttribute('data-theme', currentTheme);
  themeToggle.textContent = currentTheme === 'dark' ? '라이트 모드' : '다크 모드';
}

themeToggle.addEventListener('click', () => {
  let theme = document.documentElement.getAttribute('data-theme');
  if (theme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    themeToggle.textContent = '다크 모드';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    themeToggle.textContent = '라이트 모드';
  }
});

// Roulette Logic
let isSpinning = false;

spinBtn.addEventListener('click', () => {
  if (isSpinning) return;
  
  const maxNum = parseInt(maxNumberInput.value) || 100;
  const clampedMax = Math.min(Math.max(maxNum, 1), 100);
  maxNumberInput.value = clampedMax;

  isSpinning = true;
  spinBtn.disabled = true;
  resultDisplay.classList.add('spinning');

  let duration = 2000; // 2 seconds
  let startTime = Date.now();
  
  const spinInterval = setInterval(() => {
    const tempRandom = Math.floor(Math.random() * clampedMax) + 1;
    resultDisplay.textContent = tempRandom;
    
    if (Date.now() - startTime >= duration) {
      clearInterval(spinInterval);
      const finalResult = Math.floor(Math.random() * clampedMax) + 1;
      resultDisplay.textContent = finalResult;
      resultDisplay.classList.remove('spinning');
      isSpinning = false;
      spinBtn.disabled = false;
    }
  }, 50);
});
