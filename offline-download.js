(()=>{'use strict';
const version='v04120', CACHE='by2-public-offline-'+version;
const section=document.querySelector('#by2OfflinePanel');if(!section)return;
const btn=section.querySelector('[data-by2-download]'),clear=section.querySelector('[data-by2-clear]'),status=section.querySelector('[data-by2-status]'),bar=section.querySelector('[data-by2-progress]'),indicator=document.querySelector('#by2OfflineBadge');
let running=false;
function notice(m){status.textContent=m;}
function net(){if(indicator){indicator.hidden=navigator.onLine;indicator.textContent='📴 تتصفح دون اتصال — بعض الخدمات تحتاج الإنترنت';}}
window.addEventListener('online',net);window.addEventListener('offline',net);net();
const base=new URL('./',document.currentScript.src);
async function register(){if(!('serviceWorker' in navigator)||!window.isSecureContext){notice('التصفح دون إنترنت يتطلب HTTPS ومتصفحاً يدعم الخدمة.');return false;}
try{await navigator.serviceWorker.register(new URL('sw.js',base).href,{scope:base.pathname});await navigator.serviceWorker.ready;return true;}catch(e){notice('تعذّر تفعيل التخزين على هذا المتصفح: '+(e.message||e));return false;}}
async function updateCount(){if(!('caches' in window))return;try{const c=await caches.open(CACHE);const k=await c.keys();if(k.length)notice('محفوظ حالياً '+k.length+' ملفاً محلياً. يمكنك إعادة التنزيل لإكمال الناقص.');}catch{}}
btn.addEventListener('click',async()=>{if(running)return;if(!navigator.onLine){notice('اتصل بالإنترنت أولاً لتنزيل الدليل.');return;}running=true;btn.disabled=true;clear.disabled=true;bar.hidden=false;bar.value=0;
try{if(!(await register()))return;const r=await fetch(new URL('offline-files-v04120.json',base),{cache:'no-store'});if(!r.ok)throw Error('تعذر جلب قائمة الملفات');const {files}=await r.json();
const cache=await caches.open(CACHE);let done=0,failed=[];
// Try bounded parallel downloads, remain same origin, never cache external content or private API responses.
let ix=0;async function worker(){while(ix<files.length){const f=files[ix++];try{const u=new URL(f,base);if(u.origin!==location.origin||!u.pathname.startsWith(base.pathname))throw Error('out of scope');
const existing=await cache.match(u.href);if(!existing){const res=await fetch(u.href,{credentials:'same-origin',cache:'reload'});if(!res.ok||res.type==='opaque')throw Error('HTTP '+res.status);if(!['basic','default'].includes(res.type))throw Error('unsafe response');await cache.put(u.href,res);}}
catch(e){failed.push(f);}done++;bar.value=Math.round(done/files.length*100);notice('تحميل الدليل: '+done+' من '+files.length+' ملف ('+bar.value+'٪)');}}
await Promise.all([worker(),worker(),worker()]);if(failed.length){notice('تم تنزيل '+(files.length-failed.length)+' ملفاً. تعذر حفظ '+failed.length+' ملفاً؛ تأكد من المساحة والاتصال ثم أعد المحاولة.');}
else{notice('اكتمل حفظ الدليل ('+files.length+' ملفاً). اختبره بوضع الطيران بعد فتحه مرة واحدة. الخرائط والمحادثات والعضوية المباشرة تحتاج إنترنت.');}
}catch(e){notice('تعذّر اكتمال التنزيل. تأكد من مساحة الجهاز: '+(e.message||e));}finally{running=false;btn.disabled=false;clear.disabled=false;}});
clear.addEventListener('click',async()=>{if(running)return;try{await caches.delete(CACHE);bar.value=0;bar.hidden=true;notice('تم حذف نسخة الدليل المحفوظة على هذا الجهاز. لم تتغير ملفات الموقع المنشورة.');}catch(e){notice('تعذّر الحذف: '+e.message);}});
if('serviceWorker' in navigator)register().then(updateCount);})();