const themeToggle = document.getElementById('theme-toggle');
const generateBtn = document.getElementById('generate-lotto');
const lottoContainer = document.getElementById('lotto-container');

// 테마 로직
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

// 로또 로직
function generateLottoNumbers() {
  const numbers = [];
  while (numbers.length < 6) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers.sort((a, b) => a - b);
}

function displayLottoSets() {
  lottoContainer.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const set = generateLottoNumbers();
    const row = document.createElement('div');
    row.className = 'lotto-row';
    
    set.forEach(num => {
      const ball = document.createElement('div');
      ball.className = 'ball';
      ball.textContent = num;
      row.appendChild(ball);
    });
    
    lottoContainer.appendChild(row);
  }
}

generateBtn.addEventListener('click', displayLottoSets);
