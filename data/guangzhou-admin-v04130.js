/* BouYousef2 V041.30: Guangzhou manager-only private directory.
   The static site contains NO private records; Supabase enforces manager authorization. */
(function(){'use strict';
 let request=0, records=[];
 window.BY41_MANAGER_ALLOWED=false;
 const sectionRoute=()=>typeof state!=='undefined'&&state.kind==='section'&&state.city===0&&state.section==='manager';
 function text(tag,cls,value){const e=document.createElement(tag);if(cls)e.className=cls;e.textContent=String(value||'');return e;}
 function copy(v){if(!v)return;navigator.clipboard?.writeText(v).catch(()=>{});}
 function action(label,onClick){const b=text('button','by41-private-action',label);b.type='button';b.addEventListener('click',onClick);return b;}
 window.BY41_RENDER_GZ_MANAGER=function(){
   const area=document.getElementById('sectionContentArea');if(!area||!sectionRoute())return;
   if(window.BY41_MANAGER_ALLOWED!==true){area.hidden=true;return;}
   area.hidden=false;
   const placeholder=area.querySelector('.construction-box');if(placeholder)placeholder.hidden=true;
   const listing=document.getElementById('gzListing')||document.createElement('div');
   listing.id='gzListing';listing.className='gz-listing by41-private-listing';listing.hidden=false;
   listing.replaceChildren();if(!listing.isConnected)area.append(listing);
   const heading=text('h3','by41-private-heading','🔐 المدير – مراكز العلاج الطبيعي والتدليك – غوانزو');
   const note=text('p','by41-private-note','تظهر هذه القائمة للمدير المعتمد فقط. تضم مراكز تدليك تقليدي وتوينا؛ ولا يُفترض أن جميعها تقدم علاجًا طبيعيًا طبيًا مرخّصًا. تأكد من الخدمات والعناوين قبل الزيارة.');
   const cards=document.createElement('div');cards.className='by41-private-grid';
   records.forEach(r=>{
     const item=document.createElement('article');item.className='by41-private-place';
     item.append(text('h4','',r.name_ar||r.name_zh),text('p','by41-private-english',r.name_en),text('p','by41-private-chinese',r.name_zh));
     item.append(text('p','',r.area_ar||'غوانزو'),text('p','by41-private-address',r.address_zh));
     item.append(text('p','',r.services_ar));
     if(r.note_ar)item.append(text('p','by41-private-caution',r.note_ar));
     const tools=document.createElement('div');tools.className='by41-private-actions';
     const target=r.address_zh||r.name_zh;
     tools.append(action('نسخ الاسم الصيني',()=>copy(r.name_zh)),action('نسخ العنوان',()=>copy(target)));
     tools.append(action('AMAP',()=>window.open('https://uri.amap.com/search?keyword='+encodeURIComponent(target),'_blank','noopener,noreferrer')));
     tools.append(action('DiDi – نسخ الوجهة',()=>copy(target)));
     item.append(tools);cards.append(item);
   });
   listing.append(heading,note,cards);
 };
 function redraw(){if(typeof createCards==='function')createCards();if(sectionRoute())window.BY41_RENDER_GZ_MANAGER();}
 async function updateAuth(){
   const ticket=++request;records=[];window.BY41_MANAGER_ALLOWED=false;
   // Clear contents immediately on logout/account switch.
   const l=document.getElementById('gzListing');if(l&&sectionRoute())l.replaceChildren();
   redraw();
   if(window.BY41_IS_MEMBER!==true||typeof window.BY41_FETCH_GZ_MANAGER!=='function')return;
   try{
     const result=await window.BY41_FETCH_GZ_MANAGER();
     if(ticket!==request||window.BY41_IS_MEMBER!==true)return;
     if(!result||result.is_admin!==true||!Array.isArray(result.centers))return;
     records=result.centers;window.BY41_MANAGER_ALLOWED=true;
     redraw();
   }catch(_){/* The server denies unauthorized users; no manager card or data. */}
 }
 document.addEventListener('by41-auth-changed',updateAuth);
 updateAuth();
})();
