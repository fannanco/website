const downloadBtn = document.getElementById('downloadBtn');
const panel = document.getElementById('downloadPanel');
const progressBar = document.getElementById('progressBar');
const progressValue = document.getElementById('progressValue');
const retryBtn = document.getElementById('retryBtn');
const openFakeBtn = document.getElementById('openFakeBtn');

let timer;

function startDemoDownload() {
  clearInterval(timer);
  panel.hidden = false;
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });

  let progress = 0;
  progressBar.style.width = '0%';
  progressValue.textContent = '0%';

  timer = setInterval(() => {
    progress += Math.max(1, Math.floor(Math.random() * 5));
    if (progress >= 100) {
      progress = 100;
      clearInterval(timer);
    }
    progressBar.style.width = progress + '%';
    progressValue.textContent = progress + '%';
  }, 170);
}

downloadBtn.addEventListener('click', startDemoDownload);
retryBtn.addEventListener('click', startDemoDownload);
openFakeBtn.addEventListener('click', () => {
  alert('هذه نسخة عرض للصفحة. عند رفع ملف APK الحقيقي سنربط هذا الزر بالملف مباشرة.');
});