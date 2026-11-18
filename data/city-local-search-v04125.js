/* Dedicated search at the top of every city in BouYousef 2.
   Reads existing city catalogs; no modifications to listings or membership gates. */
'use strict';
(()=>{
 const root=document.getElementById('by2CityLocalSearch');
 if(!root || !window.BY3_GUANGZHOU || !window.BY3_OTHER_CITIES || typeof cities==='undefined')return;
 const form=root.querySelector('form'),input=root.querySelector('input'),list=root.querySelector('.by2-city-search-results'),status=root.querySelector('.by2-city-search-status'),clear=root.querySelector('.by2-city-search-clear'),heading=root.querySelector('.by2-city-search-heading');
 const normalize=value=>String(value??'').normalize('NFKC').toLocaleLowerCase().replace(/[\u064b-\u065f\u0670]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,' ').trim();
 const idx=new Map(cities.map((c,i)=>[c.slug,i]));
 const grouped=new Map(cities.map(c=>[c.slug,[]]));
 function add(slug,record){
   if(!record || !record.ar || !record.section || !grouped.has(slug))return;
   if(record.excludeFromListing)return;
   const sectionIds=(slug==='guangzhou'&&Array.isArray(record.sections)&&record.sections.length)?[...new Set(record.sections)]:[record.section];
   const fields=['ar','en','zh','addressZh','addressEn','addressAr','metro','note','region','features','signatureDrink','sourceCategory','subtype'];
   const text=fields.map(k=>record[k]).concat(record.cafeTags,record.searchAliases).flat().filter(v=>typeof v==='string').join(' ');
   sectionIds.forEach(section=>grouped.get(slug).push({id:String(record.id),ar:record.ar,en:record.en||'',zh:record.zh||'',section,search:normalize(text+' '+((sections.find(x=>x.id===section)||{}).ar||''))}));
 }
 (window.BY3_GUANGZHOU.items||[]).forEach(r=>add('guangzhou',r));
 Object.entries(window.BY3_OTHER_CITIES.cities||{}).forEach(([slug,data])=>(data.items||[]).forEach(r=>add(slug,r)));
 let currentSlug='';
 const active=()=>{
   const route=typeof stateFromHash==='function'?stateFromHash():null;
   if(!route || !['city','section'].includes(route.kind))return null;
   return cities[route.city]||null;
 };
 function sync(){
   const city=active();root.hidden=!city;
   if(!city)return;
   if(currentSlug!==city.slug){currentSlug=city.slug;input.value='';list.replaceChildren();status.textContent='';}
   heading.textContent='🔎 البحث داخل '+city.ar+' فقط';
   input.placeholder='ابحث عن سوق أو مطعم أو فندق أو مكان سياحي في '+city.ar+'…';
 }
 function node(tag,cls,value){const e=document.createElement(tag);if(cls)e.className=cls;if(value!==undefined)e.textContent=value;return e;}
 function render(){
   sync();const city=active();if(!city)return;
   list.replaceChildren();const terms=normalize(input.value).split(' ').filter(Boolean);
   if(!terms.length){status.textContent='اكتب اسم المكان بالعربية أو الإنجليزية أو الصينية للبحث في هذه المدينة فقط.';return;}
   const seen=new Set();const hits=(grouped.get(city.slug)||[]).filter(r=>terms.every(t=>r.search.includes(t))).filter(r=>{
     const key=r.id+'|'+r.section;if(seen.has(key))return false;seen.add(key);return true;
   }).sort((a,b)=>Number(normalize(b.ar).startsWith(normalize(input.value)))-Number(normalize(a.ar).startsWith(normalize(input.value))));
   status.textContent=hits.length?'عدد النتائج في '+city.ar+': '+hits.length+(hits.length>100?' (تُعرض أول 100 نتيجة)':''):'لا توجد نتائج مطابقة داخل '+city.ar+'.';
   hits.slice(0,100).forEach(r=>{
     const card=node('div','by2-city-search-result'),info=node('div','by2-city-search-result-info'),name=node('strong','',r.ar),sec=sections.find(s=>s.id===r.section);
     info.append(name,node('small','',(sec?.ar||r.section)+(r.en?' · '+r.en:'')));
     if(r.zh)info.append(node('small','',r.zh));
     const open=node('button','by2-city-search-open','عرض المكان');open.type='button';
     open.addEventListener('click',()=>{
       const ci=idx.get(city.slug),target={kind:'section',city:ci,section:r.section};
       if(!window.BY41_IS_MEMBER && typeof window.BY41_SHOW_GATE==='function'){
         window.BY41_SHOW_GATE(urlFor(target));return;
       }
       window.BY3_GLOBAL_TARGET={city:ci,section:r.section,id:r.id};window.BY3_GLOBAL_SCROLL_ID=r.id;
       if(location.hash===urlFor(target))renderRoute('navigate');else navigate(target);
     });
     card.append(info,open);list.append(card);
   });
 }
 form.addEventListener('submit',e=>{e.preventDefault();render()});
 input.addEventListener('input',render);
 clear.addEventListener('click',()=>{input.value='';render();input.focus()});
 window.addEventListener('hashchange',sync);window.addEventListener('popstate',sync);
 // Hash navigation is often via history.pushState (no hashchange event).
 const cityHeading=document.getElementById('selectedCityTitle');
 if(cityHeading)new MutationObserver(sync).observe(cityHeading,{childList:true,characterData:true,subtree:true});
 sync();
})();
