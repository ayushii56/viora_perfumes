/* VIORA Fragrance Brand - Sensory Finder Quiz Engine */
import { PRODUCTS, addToCart } from './store.js';

const QUIZ_QUESTIONS = [
  {
    question: "What atmosphere defines your night?",
    options: [
      { text: "A candlelit library surrounded by aged leather books", score: { midnight: 1, ember: 3 } },
      { text: "A private terrace overlooking a quiet rose garden", score: { velvet: 3, solace: 1 } },
      { text: "An underground neon gallery in Paris", score: { eclipse: 3, midnight: 1 } },
      { text: "A sun-bleached beach under a cool linen twilight", score: { solace: 3, velvet: 1 } }
    ]
  },
  {
    question: "Select your preferred lingering presence:",
    options: [
      { text: "An intimate, whisper-soft skin trace", score: { solace: 3, midnight: 1 } },
      { text: "A rich, velvet trail that commands the air", score: { velvet: 3, eclipse: 1 } },
      { text: "A warm, slow smoke signature of saffron", score: { ember: 3, velvet: 1 } },
      { text: "A deep, dark wood projection that stays forever", score: { midnight: 3, eclipse: 2 } }
    ]
  },
  {
    question: "Which sensory texture calls to you?",
    options: [
      { text: "Heavy cashmere fabric resting on skin", score: { solace: 2, velvet: 2, midnight: 1 } },
      { text: "A smooth, dark obsidian glass bead", score: { midnight: 3, eclipse: 2 } },
      { text: "Toasted spice and glowing crackling fireplace smoke", score: { ember: 3 } },
      { text: "Cool mountain mist and sparkling bergamot", score: { solace: 3 } }
    ]
  }
];

export function initQuizEngine() {
  const startBtn = document.getElementById('start-quiz-btn');
  const introBox = document.getElementById('quiz-intro-box');
  const quizWindow = document.getElementById('quiz-window');
  const resultBox = document.getElementById('quiz-result-box');
  
  const qNum = document.getElementById('quiz-q-num');
  const qText = document.getElementById('quiz-q-text');
  const optionsBox = document.getElementById('quiz-options-box');
  const progressBar = document.getElementById('quiz-progress-bar');
  
  const resultImg = document.getElementById('quiz-result-img');
  const resultTitle = document.getElementById('quiz-result-title');
  const resultDesc = document.getElementById('quiz-result-desc');
  const resultBuyBtn = document.getElementById('quiz-result-buy-btn');
  const retryBtn = document.getElementById('quiz-retry-btn');

  let currentStep = 0;
  let scores = {
    midnight: 0,
    velvet: 0,
    ember: 0,
    eclipse: 0,
    solace: 0
  };

  if (!startBtn) return;

  // Start Quiz
  startBtn.addEventListener('click', () => {
    introBox.style.display = 'none';
    quizWindow.style.display = 'flex';
    currentStep = 0;
    scores = { midnight: 0, velvet: 0, ember: 0, eclipse: 0, solace: 0 };
    renderQuestion();
  });

  // Render question card
  function renderQuestion() {
    if (currentStep >= QUIZ_QUESTIONS.length) {
      calculateResult();
      return;
    }

    const currentQ = QUIZ_QUESTIONS[currentStep];
    
    // Progress bar calculate
    const progressPercent = ((currentStep) / QUIZ_QUESTIONS.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    qNum.textContent = `Vibrancy Indicator: Step ${currentStep + 1} of ${QUIZ_QUESTIONS.length}`;
    qText.textContent = currentQ.question;
    optionsBox.innerHTML = '';

    currentQ.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option glass-panel';
      btn.textContent = opt.text;
      btn.addEventListener('click', () => {
        // Add scores
        for (const [scent, val] of Object.entries(opt.score)) {
          scores[scent] = (scores[scent] || 0) + val;
        }
        currentStep++;
        
        // Dynamic slide animation feel
        quizWindow.style.opacity = '0';
        quizWindow.style.transform = 'translateY(10px)';
        setTimeout(() => {
          renderQuestion();
          quizWindow.style.opacity = '1';
          quizWindow.style.transform = 'translateY(0)';
        }, 300);
      });
      optionsBox.appendChild(btn);
    });
  }

  // Calculate top score scent
  function calculateResult() {
    progressBar.style.width = `100%`;
    
    let topScent = 'midnight';
    let highestScore = -1;

    for (const [scent, score] of Object.entries(scores)) {
      if (score > highestScore) {
        highestScore = score;
        topScent = scent;
      }
    }

    const recScent = PRODUCTS[topScent];
    
    setTimeout(() => {
      quizWindow.style.display = 'none';
      resultBox.style.display = 'flex';
      resultBox.style.opacity = '0';
      resultBox.style.transform = 'scale(0.95)';

      // Set recommended info
      if (resultImg) {
        resultImg.src = recScent.img;
        resultImg.style.filter = recScent.filter || 'none';
      }
      if (resultTitle) resultTitle.textContent = recScent.name;
      if (resultDesc) resultDesc.textContent = recScent.desc;
      
      if (resultBuyBtn) {
        resultBuyBtn.setAttribute('data-id', recScent.id);
        resultBuyBtn.setAttribute('data-name', recScent.name);
        resultBuyBtn.setAttribute('data-price', recScent.price);
        resultBuyBtn.textContent = `Acquire Signature — $${recScent.price}`;
      }

      // Smooth unboxing result fade-in
      setTimeout(() => {
        resultBox.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        resultBox.style.opacity = '1';
        resultBox.style.transform = 'scale(1)';
      }, 50);

    }, 350);
  }

  // Retry handler
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      resultBox.style.display = 'none';
      introBox.style.display = 'flex';
    });
  }
}
