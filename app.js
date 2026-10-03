const CONFIG = window.VIBEX_CONFIG || {};
const APK_URL = CONFIG.apkUrl || '';
const FEEDBACK_ENDPOINT = CONFIG.feedbackEndpoint || '';

const downloadBtn = document.getElementById('downloadBtn');
const panel = document.getElementById('download');
const progressBar = document.getElementById('progressBar');
const progressValue = document.getElementById('progressValue');
const retryBtn = document.getElementById('retryBtn');
const openBtn = document.getElementById('openBtn');
const installHelpBtn = document.getElementById('installHelpBtn');
const installHelp = document.getElementById('installHelp');
const downloadTitle = document.getElementById('downloadTitle');
const downloadSub = document.getElementById('downloadSub');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navMenu');
const sendFeedbackBtn = document.getElementById('sendFeedbackBtn');
const feedbackNotice = document.getElementById('feedbackNotice');
const deviceInfo = document.getElementById('deviceInfo');

function setProgress(value){
  const v = Math.max(0, Math.min(100, value));
  progressBar.style.width = v + '%';
  progressValue.textContent = v + '%';
}
function markStep(step,status){
  step.classList.remove('active','done');
  if(status) step.classList.add(status);
}
function showPanel(){
  panel.hidden = false;
  panel.scrollIntoView({behavior:'smooth',block:'start'});
}
function fakePrep(){
  setProgress(0);
  let v=0;
  const t=setInterval(()=>{
    v += 8;
    if(v>=72){clearInterval(t);v=72;}
    setProgress(v);
  },90);
}
function beginDownload(){
  showPanel();
  openBtn.disabled = true;
  markStep(step1,'active'); markStep(step2,''); markStep(step3,'');
  if(!APK_URL){
    downloadTitle.textContent = 'ملف APK غير مربوط بعد';
    downloadSub.textContent = 'جهزنا الصفحة بالكامل. أضف رابط ملف APK داخل config.js وسيصبح زر التحميل فعليًا.';
    fakePrep();
    setTimeout(()=>setProgress(100),900);
    return;
  }
  downloadTitle.textContent='جاري تنزيل VibeX ...';
  downloadSub.textContent='سيبدأ تنزيل ملف APK الآن.';
  setProgress(100);
  markStep(step1,'done'); markStep(step2,'active');
  openBtn.disabled=false;
  const a=document.createElement('a');
  a.href=APK_URL;
  a.download='';
  a.rel='noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}
downloadBtn.addEventListener('click',beginDownload);
retryBtn.addEventListener('click',beginDownload);
openBtn.addEventListener('click',()=>{
  if(APK_URL) window.location.href=APK_URL;
});
installHelpBtn.addEventListener('click',()=>{
  installHelp.hidden=!installHelp.hidden;
  if(!installHelp.hidden) installHelp.scrollIntoView({behavior:'smooth',block:'start'});
});
menuBtn.addEventListener('click',()=>{
  navMenu.hidden=!navMenu.hidden;
  menuBtn.setAttribute('aria-expanded', String(!navMenu.hidden));
});
document.querySelectorAll('#navMenu a').forEach(a=>a.addEventListener('click',()=>{navMenu.hidden=true;menuBtn.setAttribute('aria-expanded','false');}));

const ua = navigator.userAgent || '';
const platform = navigator.userAgentData?.platform || navigator.platform || 'غير معروف';
deviceInfo.textContent = `${platform} • ${ua}`;

sendFeedbackBtn.addEventListener('click', async ()=>{
  const type=document.getElementById('issueType').value.trim();
  const description=document.getElementById('issueDescription').value.trim();
  const image=document.getElementById('issueImage').files[0];
  feedbackNotice.hidden=false;
  feedbackNotice.className='feedback-notice';
  if(!type || !description){
    feedbackNotice.classList.add('error');
    feedbackNotice.textContent='اختر نوع المشكلة واكتب وصفًا قبل الإرسال.';
    return;
  }
  if(!FEEDBACK_ENDPOINT){
    feedbackNotice.classList.add('error');
    feedbackNotice.textContent='واجهة الملاحظات جاهزة، لكن لم يتم ربط خادم استقبال الملاحظات بعد. أضف feedbackEndpoint داخل config.js.';
    return;
  }
  try{
    sendFeedbackBtn.disabled=true;
    const data=new FormData();
    data.append('type',type);
    data.append('description',description);
    data.append('userAgent',ua);
    data.append('platform',platform);
    data.append('appVersion', CONFIG.version || '0.9.0-beta');
    if(image) data.append('image',image);
    const response=await fetch(FEEDBACK_ENDPOINT,{method:'POST',body:data});
    if(!response.ok) throw new Error('HTTP '+response.status);
    feedbackNotice.classList.add('ok');
    feedbackNotice.textContent='تم إرسال الملاحظة بنجاح. شكرًا لمساعدتنا في تحسين VibeX.';
    document.getElementById('issueDescription').value='';
    document.getElementById('issueImage').value='';
  }catch(err){
    feedbackNotice.classList.add('error');
    feedbackNotice.textContent='تعذر إرسال الملاحظة الآن. حاول مرة أخرى لاحقًا.';
  }finally{
    sendFeedbackBtn.disabled=false;
  }
});