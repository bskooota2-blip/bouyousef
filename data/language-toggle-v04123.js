/* BouYousef2 V041.23.0 — selects the existing three-language engine; no new translation source. */
(()=>{'use strict';
 const select=document.getElementById('languageSelect');
 if(!select)return;
 const wrap=select.closest('.lang-control');if(!wrap)return;
 const trio=document.createElement('div');trio.className='by2-lang-trio';trio.setAttribute('role','group');trio.setAttribute('aria-label','اختيار اللغة / Language / 语言');
 const languages=[['ar','ع','العربية'],['en','E','English'],['zh','中','简体中文']];
 const buttons=[];
 const sync=()=>{const code=select.value||document.documentElement.lang||'ar';buttons.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.by2Lang===code)))};
 for(const [code,label,description] of languages){
  const btn=document.createElement('button');btn.type='button';btn.className='by2-lang-btn';btn.dataset.by2Lang=code;btn.textContent=label;btn.setAttribute('aria-label',description);btn.title=description;
  btn.addEventListener('click',()=>{if(select.value!==code){select.value=code;select.dispatchEvent(new Event('change',{bubbles:true}))}sync()});trio.appendChild(btn);buttons.push(btn)
 }
 wrap.appendChild(trio);select.setAttribute('aria-hidden','true');select.tabIndex=-1;
 select.addEventListener('change',sync);document.addEventListener('by2-language-changed',sync);sync();
})();
