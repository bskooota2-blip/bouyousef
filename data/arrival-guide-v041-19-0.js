/* BouYousef 2 V041.19.3 – put the NEXT PHOTO in the viewport, not the index. */
(function(){'use strict';
for(const root of document.querySelectorAll('.by-v041-guide')){
 const cards=[...root.querySelectorAll('[data-v041-step]')];
 const buttons=[...root.querySelectorAll('[data-v041-jump]')];
 const count=root.querySelector('[data-v041-current]');
 const dialog=root.querySelector('.by-v041-dialog');
 if(!cards.length || !count || !dialog) continue;
 const big=dialog.querySelector('img');let current=1,lastFocus=null,seq=0;
 const revealPhoto=async(card,token)=>{
   const image=card.querySelector('.by-v041-enlarge img');
   if(!image) return;
   image.loading='eager';
   try{if(!image.complete && image.decode) await image.decode();}catch(e){}
   if(token!==seq) return;
   requestAnimationFrame(()=>requestAnimationFrame(()=>{
     if(token!==seq)return;
     // Scroll directly to the photo's top, not to the progress bar or card title.
     // Get a stable top after the image has decoded so lazy loading cannot shift it.
     const top=image.getBoundingClientRect().top + window.scrollY;
     const sticky=document.querySelector('header.sticky, .sticky-header, [data-sticky-header]');
     const pad=sticky ? Math.min(140,sticky.getBoundingClientRect().height+12) : 14;
     window.scrollTo({top:Math.max(0,top-pad),behavior:'instant'});
   }));
 };
 const setStep=(number,scroll=false)=>{
   const n=Math.max(1,Math.min(cards.length,number));
   const active=document.activeElement;
   if(active instanceof HTMLElement && root.contains(active) && active.closest('[data-v041-step]'))active.blur();
   current=n;
   cards.forEach((c,i)=>c.hidden=i!==n-1);
   buttons.forEach(b=>{if(Number(b.dataset.v041Jump)===n)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});
   count.textContent=String(n);
   seq++;
   if(scroll)revealPhoto(cards[n-1],seq);
 };
 root.addEventListener('click',e=>{
   const jump=e.target.closest('[data-v041-jump]');
   const prev=e.target.closest('[data-v041-prev]');
   const next=e.target.closest('[data-v041-next]');
   const enlarge=e.target.closest('[data-v041-image]');
   if(jump){e.preventDefault();setStep(Number(jump.dataset.v041Jump),true)}
   else if(prev){e.preventDefault();setStep(current-1,true)}
   else if(next){e.preventDefault();setStep(current+1,true)}
   else if(enlarge){lastFocus=enlarge;const image=enlarge.querySelector('img');big.src=image.src;big.alt=image.alt;if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');}
 });
 const close=()=>{if(typeof dialog.close==='function'&&dialog.open)dialog.close();else dialog.removeAttribute('open')};
 dialog.querySelector('.by-v041-close').addEventListener('click',close);
 dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
 dialog.addEventListener('close',()=>{big.removeAttribute('src');lastFocus?.focus({preventScroll:true})});
 setStep(1);
}
})();
