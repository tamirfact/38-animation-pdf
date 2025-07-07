const url = 'p4.pdf';
const container = document.getElementById('pdf-container');
const playBtn = document.getElementById('play-btn');
const logoOverlay = document.getElementById('logo-overlay');
const topBar = document.getElementById('top-bar');
let isAnimating = false;

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
  if (isAnimating) return;
  isAnimating = true;
  playBtn.disabled = true;
  playBtn.style.opacity = 0.6;
  topBar.classList.add('top-bar-up');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('glow-active'));
  setTimeout(() => {
    container.className = 'stacked';
    setTimeout(() => {
      container.className = 'glow';
      showLogoOverlay();
      applyGlowToPages();
    }, 1200);
  }, 1400);
}

function showLogoOverlay() {
  logoOverlay.classList.add('logo-overlay-visible');
}
function hideLogoOverlay() {
  logoOverlay.classList.remove('logo-overlay-visible');
}

function applyGlowToPages() {
  const pages = Array.from(document.querySelectorAll('.page'));
  const delay = 90; // ms between each page's glow
  pages.forEach((page, idx) => {
    setTimeout(() => {
      page.classList.add('glow-active');
      setTimeout(() => {
        page.classList.remove('glow-active');
        if (idx === pages.length - 1) {
          setTimeout(() => {
            container.className = 'stacked';
            hideLogoOverlay();
            setTimeout(() => {
              container.className = 'normal';
              isAnimating = false;
              playBtn.disabled = false;
              playBtn.style.opacity = 1;
              topBar.classList.remove('top-bar-up');
            }, 1100);
          }, 200);
        }
      }, 350);
    }, idx * delay);
  });
}

playBtn.addEventListener('click', animateSequence);

renderPDF(); 