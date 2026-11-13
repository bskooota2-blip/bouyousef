/* V041.19.0 – photo guide navigation only */
(function(){'use strict';
for(const root of document.querySelectorAll('.by-v041-guide')){
 const cards=[...root.querySelectorAll('[data-v041-step]')],buttons=[...root.querySelectorAll('[data-v041-jump]')],count=root.querySelector('[data-v041-current]'),dialog=root.querySelector('.by-v041-dialog'),big=dialog.querySelector('img');let current=1,lastFocus=null;
 const setStep=(n,scroll=false)=>{n=Math.max(1,Math.min(cards.length,n));current=n;cards.forEach((c,i)=>c.hidden=i!==n-1);buttons.forEach(b=>{if(Number(b.dataset.v041Jump)===n)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});count.textContent=String(n);if(scroll)root.querySelector('.by-v041-progress').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});};
 root.addEventListener('click',e=>{const jump=e.target.closest('[data-v041-jump]'),prev=e.target.closest('[data-v041-prev]'),next=e.target.closest('[data-v041-next]'),enlarge=e.target.closest('[data-v041-image]');if(jump){setStep(Number(jump.dataset.v041Jump),true)}else if(prev)setStep(current-1,true);else if(next)setStep(current+1,true);else if(enlarge){lastFocus=enlarge;const src=enlarge.querySelector('img');big.src=src.src;big.alt=src.alt;if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');}});
 const close=()=>{if(typeof dialog.close==='function'&&dialog.open)dialog.close();else dialog.removeAttribute('open')};dialog.querySelector('.by-v041-close').addEventListener('click',close);dialog.addEventListener('click',e=>{if(e.target===dialog)close()});dialog.addEventListener('close',()=>{big.removeAttribute('src');lastFocus?.focus()});setStep(1);
}
})();
