const url = '123_Maple_Street_Lease_Agreement.pdf';
const container = document.getElementById('pdf-container');
const arrowBack = document.getElementById('arrow-back');
const arrowNext = document.getElementById('arrow-next');

const STATES = ['normal', 'stacked', 'glow', 'stacked', 'normal'];
let currentState = 0;
let animating = true;

async function renderPDF() {
  const pdf = await pdfjsLib.getDocument(url).promise;
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 0.7 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext('2d');
    await page.render({ canvasContext: context, viewport }).promise;
    const pageDiv = document.createElement('div');
    pageDiv.className = 'page';
    pageDiv.style.setProperty('--i', i - 1);
    pageDiv.appendChild(canvas);
    container.appendChild(pageDiv);
  }
  container.className = 'normal';
  animateSequence();
}

function animateSequence() {
  setTimeout(() => {
    container.className = 'stacked';
    setTimeout(() => {
      container.className = 'glow';
      applyGlowToPages(() => {
        container.className = 'stacked';
        setTimeout(() => {
          container.className = 'normal';
          setTimeout(() => {
            animating = false;
            showArrows();
          }, 400);
        }, 1100);
      });
    }, 1200);
  }, 1400);
}

function applyGlowToPages(callback) {
  const pages = Array.from(document.querySelectorAll('.page'));
  const delay = 90; // ms between each page's glow
  pages.forEach((page, idx) => {
    setTimeout(() => {
      page.classList.add('glow-active');
      setTimeout(() => {
        page.classList.remove('glow-active');
        if (idx === pages.length - 1 && callback) {
          setTimeout(callback, 200);
        }
      }, 350);
    }, idx * delay);
  });
}

function showArrows() {
  arrowBack.style.display = 'flex';
  arrowNext.style.display = 'flex';
}

function hideArrows() {
  arrowBack.style.display = 'none';
  arrowNext.style.display = 'none';
}

function goToState(idx) {
  if (animating) return;
  currentState = idx;
  const state = STATES[currentState];
  if (state === 'glow') {
    container.className = 'glow';
    animating = true;
    applyGlowToPages(() => {
      animating = false;
    });
  } else {
    container.className = state;
  }
}

arrowNext.addEventListener('click', () => {
  if (animating) return;
  if (currentState < STATES.length - 1) {
    goToState(currentState + 1);
  }
});

arrowBack.addEventListener('click', () => {
  if (animating) return;
  if (currentState > 0) {
    goToState(currentState - 1);
  }
});

renderPDF(); 