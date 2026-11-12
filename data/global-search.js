/* V020 - global index from existing verified source files, no new records. */
'use strict';
(()=>{
 const btn=document.getElementById('by3GlobalSearchTrigger'),layer=document.getElementById('by3GlobalSearchLayer');
 const input=document.getElementById('by3GlobalSearchInput'),resultBox=document.getElementById('by3GlobalSearchResults'),count=document.getElementById('by3GlobalSearchCount');
 const closeBtn=document.getElementById('by3GlobalSearchClose');
 if(!btn||!layer||!window.BY3_GUANGZHOU||!window.BY3_OTHER_CITIES)return;
 const norm=v=>String(v??'').normalize('NFKC').toLocaleLowerCase().replace(/[\u064b-\u065f\u0670]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,' ').trim();
 const data=[];
 const cityIndex={};cities.forEach((c,i)=>{cityIndex[c.slug]=i;});
 const sectionTitle=id=>(sections.find(s=>s.id===id)||{}).ar||id;
 const has=v=>typeof v==='string' && !!v.trim();
 const combined=(v)=>Array.isArray(v)?v.join(' '):v;
 const addRecord=(r,i)=>{
  if(!r||!has(r.ar)||!r.section)return;
  const body=[r.ar,r.en,r.zh,r.addressZh,r.addressEn,r.addressAr,r.metro,r.note,r.region,r.features,r.signatureDrink,r.sourceCategory,r.subtype,combined(r.cafeTags),combined(r.searchAliases)].filter(has).join(' ');
  // Multiple section results reference the same underlying Guangzhou record ID.
  const views=i===0&&Array.isArray(r.sections)?[...new Set(r.sections)]:[r.section];
  views.forEach(section=>data.push({type:'place',city:i,section,id:String(r.id),name:r.ar,en:r.en||'',zh:r.zh||'',description:r.note||r.features||r.signatureDrink||'',search:norm(body+' '+cities[i].ar+' '+cities[i].en+' '+sectionTitle(section))}));
 };
 (window.BY3_GUANGZHOU.items||[]).forEach(r=>addRecord(r,0));
 Object.entries(window.BY3_OTHER_CITIES.cities||{}).forEach(([slug,db])=>{const i=cityIndex[slug];if(i===undefined)return;(db.items||[]).filter(r=>!((slug==='guilin'||slug==='yangshuo'||slug==='zhangjiajie'||slug==='chongqing'||slug==='hainan'||slug==='shanghai'||slug==='beijing')&&r.excludeFromListing)).forEach(r=>addRecord(r,i));});
 cities.forEach((c,i)=>{data.push({type:'city',city:i,name:c.ar,en:c.en,search:norm([c.ar,c.en,zhCity[i]].join(' '))});
   sections.forEach(s=>data.push({type:'section',city:i,section:s.id,name:s.ar,en:s.en,search:norm([c.ar,c.en,zhCity[i],s.ar,s.en,s.zh].join(' '))}));});
 serviceIds.forEach(id=>{data.push({type:'service',service:id,name:locales.ar['nav_'+id],en:locales.en['nav_'+id],search:norm([locales.ar['nav_'+id],locales.en['nav_'+id],locales.zh['nav_'+id]].join(' '))});});
 let priorFocus=null;
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 function open(){priorFocus=document.activeElement;layer.hidden=false;btn.setAttribute('aria-expanded','true');document.body.classList.add('by3-search-modal-open');input.focus();render();}
 function close(){layer.hidden=true;btn.setAttribute('aria-expanded','false');document.body.classList.remove('by3-search-modal-open');(priorFocus?.isConnected?priorFocus:btn).focus();}
 function findMatches(q){const terms=norm(q).split(' ').filter(Boolean);if(!terms.length)return [];
  return data.filter(d=>terms.every(term=>d.search.includes(term))).sort((a,b)=>{
   const score=d=>(d.type==='place'?10:0)+(norm(d.name).startsWith(norm(q))?30:0)+(norm(d.name)===norm(q)?90:0);
   return score(b)-score(a);
  });
 }
 function render(){const q=input.value.trim();resultBox.replaceChildren();if(!q){count.textContent='اكتب كلمة للبحث في المدن والأماكن والمطاعم والفنادق وغيرها.';return;}
  const matches=findMatches(q);count.textContent=matches.length?'عدد النتائج: '+matches.length+(matches.length>150?' — تُعرض أول 150 نتيجة':''):'لا توجد نتائج مطابقة.';
  if(!matches.length){resultBox.append(el('div','by3-global-search-empty','جرّب اسمًا آخر بالعربية أو الإنجليزية أو الصينية.'));return;}
  matches.slice(0,150).forEach(d=>{
   const card=el('article','by3-global-result'),body=el('div','by3-global-result-main');
   body.append(el('strong','',d.name));const where=d.type==='service'?'خدمات الموقع':d.type==='city'?'المدن':cities[d.city].ar+(d.type==='place'?' — '+sectionTitle(d.section):' — الأقسام');
   body.append(el('small','',where));if(d.type==='place'&&d.en)body.append(el('small','',d.en));if(d.type==='place'&&d.zh)body.append(el('small','',d.zh));if(d.description)body.append(el('p','',d.description.slice(0,160)));
   const jump=el('button','',d.type==='place'?'الانتقال إلى الموقع':'الانتقال');jump.type='button';jump.addEventListener('click',()=>{
    const dest=d.type==='service'?{kind:'service',service:d.service}:d.type==='city'?{kind:'city',city:d.city}:{kind:'section',city:d.city,section:d.section};
    window.BY3_GLOBAL_TARGET=d.type==='place'?{city:d.city,section:d.section,id:d.id}:null;window.BY3_GLOBAL_SCROLL_ID=d.type==='place'?d.id:null;
    close();if(location.hash===urlFor(dest)){renderRoute('navigate');}else{navigate(dest);}
   });card.append(body,jump);resultBox.append(card);
  });
 }
 btn.addEventListener('click',open);closeBtn.addEventListener('click',close);layer.addEventListener('click',e=>{if(e.target===layer)close()});
 document.getElementById('by3GlobalSearchForm').addEventListener('submit',e=>{e.preventDefault();render()});input.addEventListener('input',render);
 document.addEventListener('keydown',e=>{if(layer.hidden)return;if(e.key==='Escape'){e.preventDefault();close();}if(e.key==='Tab'){
  const items=[...layer.querySelectorAll('input,button')].filter(n=>!n.disabled);const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 }});
 window.BY3_GLOBAL_SEARCH_STATS={places:data.filter(d=>d.type==='place').length,cities:cities.length};
})();
