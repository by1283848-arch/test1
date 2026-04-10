const themeToggle = document.getElementById('theme-toggle');
const spinBtn = document.getElementById('spin-btn');
const maxNumberInput = document.getElementById('max-number');
const rouletteStrip = document.getElementById('roulette-strip');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const soundToggle = document.getElementById('sound-toggle');
const languageToggle = document.getElementById('language-toggle');
const revealBtn = document.getElementById('reveal-btn');
const resultCover = document.getElementById('result-cover');
const pageTitle = document.getElementById('page-title');
const pageDescription = document.getElementById('page-description');

// Sound setup
const spinSound = new Audio('sound/Triple_Seven_Strike.mp3');
spinSound.loop = true;
let isMuted = localStorage.getItem('muted') === 'true';

// Initialize sound icon and state
function updateSoundState() {
  if (isMuted) {
    soundToggle.innerHTML = '<i data-lucide="volume-x"></i>';
    spinSound.pause();
  } else {
    soundToggle.innerHTML = '<i data-lucide="volume-2"></i>';
  }
  lucide.createIcons();
}

updateSoundState();

soundToggle.addEventListener('click', () => {
  isMuted = !isMuted;
  localStorage.setItem('muted', isMuted);
  if (isMuted) {
    spinSound.pause();
  } else {
    spinSound.play().catch(e => console.log("Playback blocked", e));
  }
  updateSoundState();
});

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
      console.error(`Error: ${err.message}`);
    });
    fullscreenBtn.innerHTML = '<i data-lucide="minimize"></i>';
  } else {
    document.exitFullscreen();
    fullscreenBtn.innerHTML = '<i data-lucide="maximize"></i>';
  }
  lucide.createIcons();
});

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
const spinDuration = 6500;
let isSpinning = false;
let pendingWinner = null;
const rouletteContainer = document.querySelector('.roulette-container');
const resultSpotlight = document.getElementById('result-spotlight');
const resultSpotlightValue = document.getElementById('result-spotlight-value');

const translations = {
  ko: {
    meta: {
      title: '선물의 주인공 | 랜덤 숫자 추첨',
      description: '현대적인 대시보드 스타일의 랜덤 숫자 추첨기, 선물의 주인공을 찾아보세요.'
    },
    brand: { logo: '선물의 주인공' },
    roulette: {
      titlePlaceholder: '추첨 제목 입력...',
      spotlightLabel: '당첨 번호'
    },
    buttons: {
      spin: '주인공 찾기',
      reveal: '결과 보기'
    },
    range: {
      label: '참여 인원 설정',
      unit: '명'
    },
    features: {
      fair: { title: '100% 공정', body: '랜덤 알고리즘' },
      speed: { title: '원클릭 추첨', body: '간편한 사용법' }
    },
    guide: {
      label: '서비스 안내',
      q1: '어떻게 사용하나요?',
      a1: '인원수를 입력하고 버튼을 누르세요.',
      q2: '결과가 공정한가요?',
      a2: '모든 번호는 동일 확률로 추출됩니다.'
    },
    contact: {
      label: '비즈니스 제휴',
      emailPlaceholder: '이메일 주소',
      messagePlaceholder: '제휴 제안 내용을 입력해 주세요...',
      submit: '제안 제출하기'
    },
    community: { label: '커뮤니티' },
    controls: { languageToggle: 'EN' }
  },
  en: {
    meta: {
      title: 'Gift Winner | Random Number Draw',
      description: 'A modern dashboard-style random number picker to find the winner fast and fairly.'
    },
    brand: { logo: 'Gift Winner' },
    roulette: {
      titlePlaceholder: 'Enter draw title...',
      spotlightLabel: 'Winning Number'
    },
    buttons: {
      spin: 'Pick the Winner',
      reveal: 'Show Result'
    },
    range: {
      label: 'Participant Range',
      unit: 'people'
    },
    features: {
      fair: { title: '100% Fair', body: 'Random algorithm' },
      speed: { title: 'One-Click Draw', body: 'Simple to use' }
    },
    guide: {
      label: 'How It Works',
      q1: 'How do I use it?',
      a1: 'Enter the participant count and press the button.',
      q2: 'Is the result fair?',
      a2: 'Every number is selected with equal probability.'
    },
    contact: {
      label: 'Business Inquiries',
      emailPlaceholder: 'Email address',
      messagePlaceholder: 'Tell us about your partnership proposal...',
      submit: 'Send Proposal'
    },
    community: { label: 'Community' },
    controls: { languageToggle: 'KO' }
  }
};

function getTranslation(locale, key) {
  return key.split('.').reduce((value, part) => value?.[part], translations[locale]);
}

function applyTranslations(locale) {
  document.documentElement.lang = locale;
  pageTitle.textContent = translations[locale].meta.title;
  pageDescription.setAttribute('content', translations[locale].meta.description);

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = getTranslation(locale, element.dataset.i18n);
    if (value) element.textContent = value;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    const value = getTranslation(locale, element.dataset.i18nPlaceholder);
    if (value) element.setAttribute('placeholder', value);
  });

  languageToggle.textContent = translations[locale].controls.languageToggle;
}

function detectInitialLanguage() {
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage === 'ko' || savedLanguage === 'en') return savedLanguage;
  return navigator.language?.toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

let currentLanguage = detectInitialLanguage();
applyTranslations(currentLanguage);

languageToggle.addEventListener('click', () => {
  currentLanguage = currentLanguage === 'ko' ? 'en' : 'ko';
  localStorage.setItem('language', currentLanguage);
  applyTranslations(currentLanguage);
});

function setStripOffset(offset) {
  rouletteStrip.style.transform = `translate(${offset}px, -50%)`;
}

function resetRevealState() {
  pendingWinner = null;
  revealBtn.hidden = true;
  revealBtn.disabled = true;
  rouletteContainer.classList.remove('awaiting-reveal');
  rouletteStrip.classList.remove('revealing');
  resultCover.hidden = true;
  resultCover.classList.remove('reveal');
  resultSpotlight.hidden = true;
  resultSpotlight.classList.remove('show');
  resultSpotlightValue.textContent = '';
}

function revealWinner() {
  if (!pendingWinner) return;

  const winner = pendingWinner;
  pendingWinner = null;
  revealBtn.hidden = true;
  revealBtn.disabled = true;
  rouletteContainer.classList.remove('awaiting-reveal');
  resultCover.hidden = true;
  resultSpotlightValue.textContent = winner.textContent;
  resultSpotlight.hidden = false;
  resultSpotlight.classList.remove('show');
  void resultSpotlight.offsetWidth;
  resultSpotlight.classList.add('show');

  winner.classList.add('winner');
  winner.classList.add('win-animation');
  document.querySelector('.bento-main').classList.add('confetti-glow');
  createConfetti();
  spinBtn.disabled = false;

  setTimeout(() => {
    resultCover.classList.remove('reveal');
    resultSpotlight.classList.remove('show');
    resultSpotlight.hidden = true;
    resultSpotlightValue.textContent = '';
    document.querySelector('.bento-main').classList.remove('confetti-glow');
  }, 2200);
}

revealBtn.addEventListener('click', revealWinner);

spinBtn.addEventListener('click', () => {
  if (isSpinning) return;
  const maxNum = parseInt(maxNumberInput.value) || 100;
  const clampedMax = Math.min(Math.max(maxNum, 1), 1000);
  maxNumberInput.value = clampedMax;
  isSpinning = true;
  spinBtn.disabled = true;
  resetRevealState();

  rouletteStrip.style.transition = 'none';
  setStripOffset(0);
  rouletteStrip.innerHTML = '';
  resultCover.hidden = false;
  
  const itemWidth = 120;
  document.documentElement.style.setProperty('--roulette-item-width', `${itemWidth}px`);
  const totalItems = 90 + Math.floor(Math.random() * 31);
  const winningIndex = totalItems - (8 + Math.floor(Math.random() * 15));
  const winningNumber = Math.floor(Math.random() * clampedMax) + 1;

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

  setTimeout(() => {
    rouletteContainer.classList.add('spinning');
    rouletteStrip.style.transition = `transform ${spinDuration / 1000}s linear`;

    const winner = document.getElementById('winner-item');
    const marker = rouletteContainer.querySelector('.roulette-marker');
    const markerRect = marker.getBoundingClientRect();
    const winnerRect = winner.getBoundingClientRect();
    const markerCenter = markerRect.left + (markerRect.width / 2);
    const winnerCenter = winnerRect.left + (winnerRect.width / 2);
    const offset = markerCenter - winnerCenter;

    setStripOffset(offset);
  }, 50);

  setTimeout(() => {
    rouletteContainer.classList.remove('spinning');
    pendingWinner = document.getElementById('winner-item');
    revealBtn.hidden = false;
    revealBtn.disabled = false;
    isSpinning = false;
  }, spinDuration + 100);
});
