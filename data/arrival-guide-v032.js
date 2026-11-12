(function(){'use strict';
const guide=document.getElementById('by3ArrivalGuide');if(!guide)return;
const photos=document.getElementById('by3AcSteps');
const faq=document.getElementById('by3AcFaq');
const controls={photos:document.getElementById('by3AcToSteps'),faq:document.getElementById('by3AcToFaq')};
const sections={photos,faq};
const sources=document.getElementById('by3AcSources');
const dialog=document.getElementById('by3AcImageDialog');
const img=document.getElementById('by3AcLargeImage');
const floatTop=document.getElementById('by3AcFloatingTop');
const hero=guide.querySelector('.by3-ac-hero');
let activeSection='none';let wasVisible=false;
const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollToEl=el=>{if(el)el.scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'});};
const scrollTop=()=>window.scrollTo({top:0,behavior:reduced()?'auto':'smooth'});
function stopVideo(){
 // Keep compatibility with any previously-created player, but do not mount or display one.
 const p=document.getElementById('by3AcVideoPlayer');if(!p)return;
 try{p.pause();p.currentTime=0;}catch(e){}
}
function closeImage(){if(dialog){if(dialog.open&&typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');}}
function refreshFloating(){
 const active=!guide.hidden&&activeSection==='photos'&&!photos.hidden;
 const threshold=hero.getBoundingClientRect().bottom+window.scrollY+280;
 floatTop.hidden=!(active&&window.scrollY>threshold);
}
function setSection(next,scroll=true){
 if(next!=='photos'&&next!=='faq')next='none';
 closeImage();stopVideo();activeSection=next;
 for(const [key,section] of Object.entries(sections)){
  const shown=key===next;section.hidden=!shown;section.setAttribute('aria-hidden',String(!shown));
  controls[key].setAttribute('aria-expanded',String(shown));
  if(key==='faq'&&!shown)section.querySelectorAll('details').forEach(d=>d.open=false);
 }
 if(sources){sources.hidden=next!=='faq';sources.setAttribute('aria-hidden',String(next!=='faq'));}
 if(next!=='photos')photos.querySelectorAll('details.by3-ac-overview').forEach(d=>d.open=false);
 refreshFloating();
 if(scroll){if(next==='none')scrollToEl(hero);else scrollToEl(sections[next]);}
}
function goHome(){setSection('none',false);stopVideo();if(typeof navigate==='function')navigate({kind:'home'});else location.hash='#home';}
controls.photos.addEventListener('click',()=>setSection('photos'));
controls.faq.addEventListener('click',()=>setSection('faq'));
for(const btn of guide.querySelectorAll('[data-ac-close]'))btn.addEventListener('click',()=>setSection('none'));
document.getElementById('by3AcBackHome').addEventListener('click',goHome);
document.getElementById('by3AcTopHome').addEventListener('click',goHome);
for(const btn of guide.querySelectorAll('[data-ac-scroll-top]'))btn.addEventListener('click',scrollTop);
for(const btn of guide.querySelectorAll('[data-ac-guide-start]'))btn.addEventListener('click',()=>setSection('none'));
floatTop.addEventListener('click',scrollTop);
guide.querySelectorAll('[data-ac-image]').forEach(btn=>btn.addEventListener('click',()=>{
 if(activeSection!=='photos')return;
 const num=btn.dataset.acImage;
 if(!/^(0[1-9]|1[01])$/.test(num))return;
 img.src='assets/arrival-guide/a1-a11/A-'+num+'.png';img.alt='صورة المستخدم المكبرة للخطوة '+Number(num);
 if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
}));
document.getElementById('by3AcCloseImage').addEventListener('click',closeImage);
dialog.addEventListener('click',event=>{if(event.target===dialog)closeImage();});
function checkRoute(){const visible=!guide.hidden;if(visible!==wasVisible){setSection('none',false);wasVisible=visible;}refreshFloating();}
new MutationObserver(checkRoute).observe(guide,{attributes:true,attributeFilter:['hidden']});
window.addEventListener('scroll',refreshFloating,{passive:true});
window.addEventListener('resize',refreshFloating,{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopVideo();});
setSection('none',false);checkRoute();
})();
