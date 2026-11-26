/* V020 - global index from existing verified source files, no new records. */
'use strict';
(()=>{
 const btn=document.getElementById('by3GlobalSearchTrigger'),layer=document.getElementById('by3GlobalSearchLayer');
 const input=document.getElementById('by3GlobalSearchInput'),resultBox=document.getElementById('by3GlobalSearchResults'),count=document.getElementById('by3GlobalSearchCount');
 const closeBtn=document.getElementById('by3GlobalSearchClose');
 if(!btn||!layer||!window.BY3_GUANGZHOU||!window.BY3_OTHER_CITIES)return;
 const index=window.BY2_SEARCH_INDEX;if(!index)return;
 const norm=index.norm;
 const data=[];
 cities.forEach((c,i)=>{data.push({type:'city',city:i,name:c.ar,en:c.en,search:norm([c.ar,c.en,zhCity[i]].join(' '))});
   sections.filter(s=>s.id!=='manager').forEach(s=>data.push({type:'section',city:i,section:s.id,name:s.ar,en:s.en,search:norm([c.ar,c.en,zhCity[i],s.ar,s.en,s.zh].join(' '))}));});
 serviceIds.forEach(id=>{data.push({type:'service',service:id,name:locales.ar['nav_'+id],en:locales.en['nav_'+id],search:norm([locales.ar['nav_'+id],locales.en['nav_'+id],locales.zh['nav_'+id]].join(' '))});});
 let priorFocus=null;
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 function open(){priorFocus=document.activeElement;layer.hidden=false;btn.setAttribute('aria-expanded','true');document.body.classList.add('by3-search-modal-open');input.focus();render();}
 function close(){layer.hidden=true;btn.setAttribute('aria-expanded','false');document.body.classList.remove('by3-search-modal-open');(priorFocus?.isConnected?priorFocus:btn).focus();}
 function findMatches(q){return index.unique([...index.records(),...data].filter(d=>index.matches(d,q)).sort((a,b)=>index.score(b,q)-index.score(a,q)));}
 const language=()=>window.BY2_L10N?.language()||'ar';
 const msg=(ar,en,zh)=>language()==='en'?en:language()==='zh'?zh:ar;
 const displayCity=i=>language()==='en'?cities[i].en:language()==='zh'?zhCity[i]:cities[i].ar;
 const displaySection=id=>{const sec=sections.find(s=>s.id===id);return sec?.[language()]||id};
 function render(){const q=input.value.trim();resultBox.replaceChildren();if(!q){count.textContent=msg('اكتب كلمة للبحث في المدن والأماكن والمطاعم والفنادق وغيرها.','Search cities, markets, restaurants, hotels and more.','搜索城市、市场、餐厅、酒店等。');return;}
  const matches=findMatches(q);count.textContent=matches.length?(matches.length>150?msg('نتائج مطابقة — خصّص البحث لعرض المزيد.','Matching results — refine your search to see more.','匹配结果，请缩小搜索范围。'):msg('نتائج مطابقة','Matching results','匹配结果')):msg('لا توجد نتائج مطابقة.','No matching results.','没有匹配结果。');
  if(!matches.length){resultBox.append(el('div','by3-global-search-empty',msg('جرّب اسمًا آخر بالعربية أو الإنجليزية أو الصينية.','Try a different name in Arabic, English or Chinese.','试试阿拉伯语、英语或中文名称。')));return;}
  matches.slice(0,150).forEach(d=>{
   const card=el('article','by3-global-result'),body=el('div','by3-global-result-main');
   body.append(el('strong','',d.type==='place'?(language()==='en'?(d.en||d.name):language()==='zh'?(d.zh||d.name):d.name):d.type==='city'?displayCity(d.city):d.type==='section'?displaySection(d.section):d.type==='service'?(locales[language()]?.['nav_'+d.service]||d.name):d.name));const where=d.type==='service'?msg('خدمات الموقع','Site services','网站服务'):d.type==='city'?msg('المدن','Cities','城市'):displayCity(d.city)+(d.type==='place'?' — '+displaySection(d.section):' — '+msg('الأقسام','Sections','栏目'));
   body.append(el('small','',where));if(d.type==='place'&&d.en)body.append(el('small','',d.en));if(d.type==='place'&&d.zh)body.append(el('small','',d.zh));if(d.description)body.append(el('p','',d.description.slice(0,160)));if(d.worthVisit)body.append(el('small','by50-worth','💎 يستحق الزيارة'));if(d.recommended)body.append(el('small','by43-label','⭐ من أهم الأماكن'));if(d.editorialNote)body.append(el('p','by43-note-text','📝 '+d.editorialNote));
   const jump=el('button','',d.type==='place'?msg('الانتقال إلى الموقع','Go to place','查看地点'):msg('الانتقال','Open','打开'));jump.type='button';jump.addEventListener('click',()=>{
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
 document.addEventListener('by43-editorial-changed',()=>{if(!layer.hidden)render()});
 window.BY3_GLOBAL_SEARCH_STATS={places:index.records().length,cities:cities.length};
})();
