'use strict';
(function(){
 const DB=window.BY3_OTHER_CITIES?.cities||{};
 const labels={markets:'الأسواق',malls:'المجمعات التجارية',dining:'المطاعم والكافيهات',tourism:'الأماكن السياحية',hotels:'الفنادق',transport:'المواصلات',mosques:'المساجد',information:'معلومات المدينة'};
 const icons={markets:'🏪',malls:'🛍️',dining:'🍽️',tourism:'🏞️',hotels:'🏨',transport:'🚆',mosques:'🕌',information:'ℹ️'};
 const make=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;};
 const normalize=v=>String(v||'').toLocaleLowerCase().trim();
 const available=v=>typeof v==='string' && !!v.trim() && !/^(?:null|undefined|nan|n\/a|غير موثق)$/i.test(v.trim());
 let filter='الكل',regionFilter='الكل',searchTerm='',max=32,lastKey='';
 let beijingDiningGroup='الكل'; // parent filter matches Guangzhou's single-row cuisine categories
 function copy(v,button){
  if(!v)return;
  const ok=()=>{button.textContent='✓ تم النسخ';setTimeout(()=>button.textContent=button.dataset.label,1800)};
  if(navigator.clipboard?.writeText)navigator.clipboard.writeText(v).then(ok,()=>prompt('انسخ النص:',v));
  else prompt('انسخ النص:',v);
 }
 function button(txt,click,cls){const b=make('button',cls||'',txt);b.type='button';b.addEventListener('click',click);return b;}
 function filterIcon(f){
  const x=String(f||'').toLowerCase();
  if(f==='الكل')return '▦';
  if(/نسائي|نساء|سيدات/.test(x))return '👗';
  if(/رجال|رجالي/.test(x))return '👔';
  if(/أطفال/.test(x))return '🧒';
  if(/أقمشة|خامات/.test(x))return '🧵';
  if(/أثاث|مفروشات/.test(x))return '🛋️';
  if(/إلكترون|هواتف/.test(x))return '📱';
  if(/سوق|أسواق|جملة/.test(x))return '🏪';
  if(/مجمع|مول/.test(x))return '🛍️';
  if(/عرب/.test(x))return '🥙';
  if(/ترك/.test(x))return '🥘';
  if(/هند|باكستان/.test(x))return '🍛';
  if(/إيران/.test(x))return '🍢';
  if(/بيتزا/.test(x))return '🍕';
  if(/مخبز|مخابز/.test(x))return '🥐';
  if(/المطاعم الصينية/.test(x))return '🥢';
  if(/دلائل عامة|غير محدد/.test(x))return '🔎';
  if(/غير مصنفة/.test(x))return '🏨';
  if(/المطارات/.test(x))return '✈️';
  if(/محطات القطارات/.test(x))return '🚆';
  if(/تصنيف فوربس/.test(x))return '🌟';
  if(/كافيه|قهوة/.test(x))return '☕';
  if(/حلال|آسيوي/.test(x))return '🍜';
  if(/مطعم/.test(x))return '🍽️';
  if(/5 نجوم/.test(x))return '🌟';
  if(/4 نجوم/.test(x))return '⭐';
  if(/3 نجوم|فندق/.test(x))return '🏨';
  if(/مطار/.test(x))return '✈️';
  if(/قطار/.test(x))return '🚆';
  return '📍';
 }
 function place(r){
  const article=make('article','gz-place by3-place');article.id='place-'+r.id;
  const content=make('div','gz-place-main by3-place-main');
  content.append(make('h3','gz-place-name',r.ar));
  if(available(r.en))content.append(make('p','gz-en',r.en));
  if(available(r.zh))content.append(make('p','gz-zh',r.zh));
  if(available(r.sourceCategory))content.append(make('span','gz-tag',r.sourceCategory));
  if(available(r.addressZh))content.append(make('p','gz-info','📍 العنوان الصيني: '+r.addressZh));
  if(available(r.addressEn))content.append(make('p','gz-info','📍 العنوان الإنجليزي: '+r.addressEn));
  if(available(r.metro))content.append(make('p','gz-info','🚇 المترو: '+r.metro));
  if(available(r.note))content.append(make('p','gz-info','ℹ️ '+r.note));
  const actions=make('div','gz-place-actions by3-place-actions');
  function action(label,symbol,value,cls){
   if(!available(value))return;
   const b=button('',()=>copy(value,b),'gz-action '+(cls||''));
   b.dataset.label=label;
   b.setAttribute('aria-label',label);
   b.title=label;
   if(cls==='gz-action-didi'){const img=make('img','gz-action-icon by3-didi-image');img.src='assets/didi-taxi-approved.png';img.style.cssText='display:block!important;width:27px!important;height:27px!important;min-width:27px!important;max-width:27px!important;max-height:27px!important;object-fit:contain!important;flex:0 0 27px!important;margin:0 auto!important;padding:0!important;border:0!important;background:transparent!important';img.alt='';img.setAttribute('aria-hidden','true');b.append(img);}else b.append(make('span','gz-action-icon',symbol));b.append(make('span','gz-action-label',label==='نسخ الاسم والعنوان الصيني'?'نسخ':label));
   actions.append(b);
  }
  // V038.1: a single copy control retains both pieces of Chinese information.
  const copyParts=[r.zh,r.addressZh].filter(available);
  const copyText=[...new Set(copyParts.map(v=>v.trim()))].join('\n');
  action('نسخ الاسم والعنوان الصيني','⧉',copyText,'gz-action-copy');
  const dest=[r.addressZh,r.zh,r.en,r.ar].find(available);
  if(available(dest)){
   action('نسخ الوجهة لـ DiDi','🚕',dest,'gz-action-didi');
   const a=make('a','gz-action gz-action-amap');
   a.target='_blank';a.rel='noopener noreferrer';a.href='https://uri.amap.com/search?keyword='+encodeURIComponent(dest);
   a.setAttribute('aria-label','البحث في AMAP');a.title='البحث في AMAP';
   a.append(make('span','gz-action-icon','📍'),make('span','gz-action-label','AMAP'));
   actions.append(a);
  }
  const beijingDiningIcon=cityCode==='北京'&&r.section==='dining' ? (/مخابز|الحلويات التقليدية/.test(String(r.subtype||''))?'🥐':/كافيه/.test(String(r.subtype||''))?'☕':'🍽️') : null;
  const side=make('div','gz-place-side by3-place-side',beijingDiningIcon||icons[r.section]||'📍');
  article.append(side,content,actions);return article;
 }

 // V022: Shenzhen-only cards share Guangzhou's DOM class layout and CSS.
 // V027.1: Only Yangshuo and Zhangjiajie distinguish full Chinese addresses from locality descriptions.
 function preciseChineseAddress(raw,name){
  if(!available(raw))return false;
  const a=String(raw).trim();
  if(!/[\u3400-\u9fff]/.test(a))return false;
  if(a===String(name||'').trim())return false;
  // A county/district/town/city name alone is not a street address.
  if(/^(?:[\u3400-\u9fff]{1,12}(?:市|区|县|镇|乡|街道|村)|[\u3400-\u9fff]{1,10}山)$/.test(a))return false;
  // Require a verifiable street/number, building or venue descriptor, not an area name.
  return /(?:路|街|巷|大道|号|弄|栋|楼|广场|机场|车站|大厦|中心|园区)/.test(a) && (/[0-9０-９]/.test(a)||a.length>=13);
 }
 function copyVerified(value,button){
  if(!value)return;
  const original=button.innerHTML;
  const succeeded=()=>{button.innerHTML='<span class="gz-action-icon">✓</span><span class="gz-action-label">تم النسخ</span>';setTimeout(()=>{button.innerHTML=original},1500)};
  if(navigator.clipboard?.writeText)navigator.clipboard.writeText(value).then(succeeded,()=>prompt('انسخ النص:',value));
  else prompt('انسخ النص:',value);
 }
 function shenzhenPlace(r,cityCode){
  const shanghaiDining=cityCode==='上海'&&r.section==='dining';
  const article=make('article','gz-place by3-place'+(shanghaiDining?' by3-shanghai-dining':''));article.id='place-'+r.id;article.dataset.placeId=r.id;
  const actionsWrap=make('div','gz-place-actions by3-place-actions'),actions=make('div','gz-buttons');
  // Force one left-to-right row (Copy, DiDi, AMAP) across legacy city-specific styles.
  actions.style.setProperty('direction','ltr','important');
  actions.style.setProperty('flex-direction','row','important');
  actions.style.setProperty('flex-wrap','nowrap','important');
  const scopedChineseOnly=cityCode==='阳朔'||cityCode==='张家界'||cityCode==='重庆'||cityCode==='海南'||cityCode==='上海'||cityCode==='北京';
  const fullChineseAddress=(cityCode==='上海'||cityCode==='北京')
   ? (preciseChineseAddress(r.addressZh,r.zh) && /[0-9０-９]/.test(String(r.addressZh||'')) && /(?:路|街|巷|弄|道|号)/.test(String(r.addressZh||'')))
   : preciseChineseAddress(r.addressZh,r.zh);
  const addCopy=(label,value,icon)=>{if(!available(value))return;const b=button('',()=>scopedChineseOnly?copyVerified(value,b):copy(value,b),'gz-action gz-action-copy');b.dataset.label=label;b.title=label;b.setAttribute('aria-label',label);b.append(make('span','gz-action-icon',icon),make('span','gz-action-label','نسخ'));actions.append(b);};
  // V038.1: one visible copy button, without losing either original copy value.
  const nameEligible=(cityCode!=='上海'&&cityCode!=='北京')||/[\u3400-\u9fff]/.test(String(r.zh||''));
  const addressEligible=(!scopedChineseOnly || fullChineseAddress)&&String(r.addressZh||'').trim()!==String(r.zh||'').trim();
  const copyValues=[nameEligible?r.zh:null,addressEligible?r.addressZh:null].filter(available);
  const combinedChineseCopy=[...new Set(copyValues.map(v=>v.trim()))].join('\n');
  if(combinedChineseCopy)addCopy('نسخ الاسم والعنوان الصيني',combinedChineseCopy,'⧉');
  // Prefer the actual Chinese place name unless a full Chinese address is known.
  const destination=shanghaiDining ? (fullChineseAddress?[String(r.zh||'').trim(),String(r.addressZh||'').trim()].filter(available).join(' ') : [r.zh,r.en,r.ar].find(available)) : (cityCode==='上海'||cityCode==='北京')?[r.zh,fullChineseAddress?r.addressZh:null,r.en,r.ar].find(available):(scopedChineseOnly?[fullChineseAddress?r.addressZh:null,r.zh,r.en,r.ar].find(available):[r.addressZh,r.zh,r.en,r.ar].find(available));
  if(destination){const b=button('',()=>scopedChineseOnly?copyVerified(destination,b):copy(destination,b),'gz-action gz-action-didi');b.dataset.label='DiDi';b.title='نسخ الوجهة لـ DiDi';b.setAttribute('aria-label','نسخ الوجهة لـ DiDi');const img=make('img','gz-action-icon by3-didi-image');img.src='assets/didi-taxi-approved.png';img.style.cssText='display:block!important;width:27px!important;height:27px!important;min-width:27px!important;max-width:27px!important;max-height:27px!important;object-fit:contain!important;flex:0 0 27px!important;margin:0 auto!important;padding:0!important;border:0!important;background:transparent!important';img.alt='';img.setAttribute('aria-hidden','true');b.append(img,make('span','gz-action-label','DiDi'));actions.append(b);
   const a=make('a','gz-amap gz-action gz-action-amap');a.href='https://uri.amap.com/search?keyword='+encodeURIComponent(destination)+'&city='+encodeURIComponent(cityCode||'深圳');a.target='_blank';a.rel='noopener noreferrer';a.title='البحث عن الوجهة في AMAP (ليس عنوانًا مؤكدًا)';a.setAttribute('aria-label',a.title);a.append(make('span','gz-action-icon','➤'),make('span','gz-action-label','AMAP'));actions.append(a);}
  actionsWrap.append(actions);
  const main=make('div','gz-place-main by3-place-main'),top=make('div','gz-place-top');
  if(available(r.subtype)&&!(shanghaiDining&&r.subtype==='المخابز'))top.append(make('span','gz-tag',r.subtype));else if(available(r.sourceCategory))top.append(make('span','gz-tag',r.sourceCategory));else top.append(make('span','gz-tag',labels[r.section]||r.section));main.append(top);
  main.append(make('h3','',r.ar||r.en||r.zh));
  if(available(r.en))main.append(make('p','gz-en',r.en));
  if(available(r.zh))main.append(make('p','gz-zh',r.zh));
  if(available(r.addressZh))main.append(make('p','gz-info',scopedChineseOnly&&!fullChineseAddress?'📍 المنطقة / وصف الموقع (عنوان غير تفصيلي): '+r.addressZh:'📍 العنوان الصيني: '+r.addressZh));
  if(available(r.addressEn))main.append(make('p','gz-info','📍 العنوان الإنجليزي: '+r.addressEn));
  if(available(r.metro))main.append(make('p','gz-info','🚇 المترو: '+r.metro));
  if(cityCode==='上海'&&r.section==='markets'&&Array.isArray(r.undergroundGoods)&&r.undergroundGoods.length)main.append(make('p','gz-info','🛍️ البضائع: '+r.undergroundGoods.join(' · ')));
  if(available(r.note))main.append(make('p','gz-info','ℹ️ '+r.note));
  if(available(r.region))main.append(make('p','gz-info','🗺️ المنطقة: '+r.region));
  if(available(r.sourceCaution)&&!(cityCode==='上海'&&r.section==='dining'))main.append(make('p','gz-info','⚠️ '+r.sourceCaution));
  const beijingDiningIcon=cityCode==='北京'&&r.section==='dining' ? (/مخابز|الحلويات التقليدية/.test(String(r.subtype||''))?'🥐':/كافيه/.test(String(r.subtype||''))?'☕':'🍽️') : null;
  // V038: presentation-only icon choice; no record fields or category values are changed.
  const type=String(r.subtype||r.sourceCategory||'');
  const displayIcon=beijingDiningIcon || (r.section==='dining' ?
    (/مخبز|مخابز|حلويات/.test(type)?'🥐':/كافيه|مقهى|قهوة/.test(type)?'☕':/بيتزا/.test(type)?'🍕':'🍽️') :
    (r.section==='transport' ? (/مطار|طيران/.test(type)?'✈️':/قطار|مترو/.test(type)?'🚆':'🚌') : (icons[r.section]||'📍')));
  const side=make('div','gz-place-side by3-place-side',displayIcon);
  article.append(actionsWrap,main,side);return article;
 }
 function info(box,city,records){
  const c=DB[city.slug],root=make('div','gz-info-detail');root.dir='rtl';root.lang='ar';
  if(typeof lang!=='undefined' && lang!=='ar')root.append(make('p','gz-info-lang-note','معلومات المدينة متاحة بالعربية حاليًا.'));
  root.append(make('div','gz-info-intro',c.intro));
  const layout=make('div','gz-info-layout'),nearCol=make('div','gz-info-column'),highCol=make('div','gz-info-column');
  const panel=(parent,icon,title)=>{const n=make('section','gz-info-panel-block');n.append(make('h3','gz-info-title',icon+' '+title));parent.append(n);return n;};
  const highlights=panel(highCol,'⭐','أولاً: أهم ما تشتهر به '+city.ar),features=make('div','gz-feature-list');
  (c.features||[]).forEach(([ic,title,desc])=>{const item=make('article','gz-feature'),body=make('div');body.append(make('h4','',title),make('p','',desc));item.append(make('span','gz-feature-icon',ic),body);features.append(item);});
  highlights.append(features);
  const near=panel(nearCol,'🚄','ثانيًا: المدن المحيطة ووسائل الوصول');
  const table=make('table','gz-cities-table'),thead=make('thead'),heads=make('tr');
  ['المدينة','بماذا تشتهر؟','المواصلات','نقطة الانطلاق','المدة التقريبية'].forEach(v=>heads.append(make('th','',v)));
  thead.append(heads);table.append(thead);const tbody=make('tbody'),mobile=make('div','gz-info-cards-mobile');
  (c.nearby||[]).forEach(([ar,en,known,mode,departure,duration])=>{
   const tr=make('tr'),td=make('td');td.append(document.createTextNode(ar),make('small','',en));tr.append(td);
   [known,mode,departure,duration].forEach(v=>tr.append(make('td','',v)));tbody.append(tr);
   const item=make('article','gz-near-city');item.append(make('h4','',ar+' — '+en));const dl=make('dl');
   [['تشتهر بـ: ',known],['المواصلات: ',mode],['نقطة الانطلاق: ',departure],['المدة: ',duration]].forEach(([label,val])=>{const line=make('div');line.append(make('dt','',label),make('dd','',val));dl.append(line);});item.append(dl);mobile.append(item);
  });table.append(tbody);near.append(table,mobile);
  const tips=panel(nearCol,'💡','نصائح سريعة للتنقل'),tipGrid=make('div','gz-tip-grid');
  (c.tips||[]).forEach(([ic,title,desc])=>{const item=make('article','gz-tip');item.append(make('span','tip-icon',ic),make('h4','',title),make('p','',desc));tipGrid.append(item);});tips.append(tipGrid);
  layout.append(highCol,nearCol);root.append(layout);
  const count=records.length, zhMiss=records.filter(r=>!r.zh).length, addressMiss=records.filter(r=>!r.addressZh).length, metroMiss=records.filter(r=>!r.metro).length;
  const messages=[];
  if(count===0)messages.push('لا توجد قوائم أماكن مستخرجة من V385 لهذه المدينة؛ المعلومات العامة هنا ليست بديلًا عن دليل الأماكن.');
  else {messages.push('قوائم الأماكن المنقولة: '+count+' سجلًا؛ ليست جميع العناوين متحققة ميدانيًا.');if(zhMiss)messages.push('أسماء صينية غير متوفرة: '+zhMiss+'.');if(addressMiss)messages.push('عناوين صينية تفصيلية غير متوفرة: '+addressMiss+'.');if(metroMiss)messages.push('بيانات مترو غير متوفرة: '+metroMiss+'.');}
  messages.push('لم تُعتمد مدد زمنية ثابتة من دون جدول رحلة محدد. تحقق من وسائل النقل والعناوين قبل الزيارة.');
  root.append(make('div','gz-info-caveat','تنبيه: '+messages.join(' ')));box.append(root);
 }

 window.renderOtherCitiesSection=function(){
  const area=document.getElementById('sectionContentArea');if(!area)return;
  let wrapper=document.getElementById('by3OtherListing');
  if(!wrapper){wrapper=make('div','gz-listing');wrapper.id='by3OtherListing';area.append(wrapper);}
  const active=state.kind==='section'&&state.city!==0;
  wrapper.hidden=!active;
  // Never override the Guangzhou renderer's construction state.
  const construction=area.querySelector('.construction-box');if(construction && state.city!==0)construction.hidden=active;
  if(!active)return;
  const city=cities[state.city],record=DB[city.slug],rows=record?.items||[],id=state.section||'markets',key=city.slug+'/'+id;
  if(key!==lastKey){filter='الكل';beijingDiningGroup='الكل';regionFilter='الكل';searchTerm='';max=32;lastKey=key;}if(city.slug==='yiwu'||city.slug==='guilin'||city.slug==='yangshuo'||city.slug==='zhangjiajie'||city.slug==='chongqing'||city.slug==='hainan'||city.slug==='shanghai'||city.slug==='beijing')searchTerm='';
  const relevant=rows.filter(x=>x.section===id && !(x.excludeFromListing && (city.slug==='guilin'||city.slug==='yangshuo'||city.slug==='zhangjiajie'||city.slug==='chongqing'||city.slug==='hainan'||city.slug==='shanghai'||city.slug==='beijing')));
  const globalTarget=window.BY3_GLOBAL_TARGET;
  if(globalTarget&&globalTarget.city===state.city&&globalTarget.section===id){
   filter='الكل';beijingDiningGroup='الكل';regionFilter='الكل';searchTerm='';
   const destinationRecord=relevant.find(x=>String(x.id)===String(globalTarget.id));
   if(city.slug==='beijing'&&id==='dining'&&destinationRecord){
    beijingDiningGroup=/مخابز|الحلويات التقليدية/.test(String(destinationRecord.subtype||''))?'المخابز':/كافيه/.test(String(destinationRecord.subtype||''))?'الكافيهات':String(destinationRecord.subtype||'الكل');
    const groupItems=relevant.filter(x=>beijingDiningGroup==='المخابز'?/مخابز|الحلويات التقليدية/.test(String(x.subtype||'')):beijingDiningGroup==='الكافيهات'?/كافيه/.test(String(x.subtype||'')):x.subtype===beijingDiningGroup);
    max=Math.max(32,groupItems.findIndex(x=>x.id===destinationRecord.id)+1);
   }else{const index=relevant.findIndex(x=>String(x.id)===String(globalTarget.id));max=Math.max(32,index+1);}
  }

  wrapper.replaceChildren();const panel=make('div','gz-panel');
  const header=make('div','gz-panel-head'),heading=make('div','gz-panel-title-wrap');
  heading.append(make('div','gz-section-title',city.ar+' / '+(labels[id]||id)),make('div','gz-section-count','عدد الأماكن: '+relevant.length));
  header.append(heading,make('div','gz-panel-icon',icons[id]||'📍'));panel.append(header);
  const nav=make('div','gz-section-tools'),ret=make('div','gz-return-buttons');
  ret.append(button('العودة لأقسام المدينة',()=>navigate({kind:'city',city:state.city})),button('العودة إلى الرئيسية',()=>navigate({kind:'home'})));
  nav.append(ret);panel.append(nav);
  if(id==='information'){const content=make('div',(city.slug==='shenzhen'||city.slug==='foshan'||city.slug==='yiwu'||city.slug==='guilin'||city.slug==='yangshuo'||city.slug==='zhangjiajie'||city.slug==='chongqing'||city.slug==='hainan'||city.slug==='shanghai'||city.slug==='beijing'||city.slug==='yangshuo')?'gz-shenzhen-information':'gz-grid gz-other-information-grid');panel.append(content);if(record)info(content,city,rows);else content.append(make('p','gz-empty','لا توجد معلومات من المصدر.'));wrapper.append(panel);return;}
  const tools=make('div','gz-controls'),input=make('input');input.type='search';input.value=searchTerm;input.placeholder='ابحث داخل القسم...';if(city.slug!=='yiwu' && city.slug!=='guilin' && city.slug!=='yangshuo' && city.slug!=='zhangjiajie' && city.slug!=='chongqing' && city.slug!=='hainan' && city.slug!=='shanghai' && city.slug!=='beijing')tools.append(input);
  const beijingDining=city.slug==='beijing'&&id==='dining';
  const groupPills=beijingDining?make('div','gz-pills by3-beijing-primary'):null;
  const pills=make('div','gz-pills');
  if(beijingDining){tools.classList.add('by3-beijing-dining-controls');groupPills.setAttribute('aria-label','تصنيفات المطاعم والكافيهات والمخابز — على نمط غوانزو');pills.classList.add('by3-beijing-secondary');pills.setAttribute('aria-label','أنواع الكافيهات أو المخابز');tools.append(groupPills,pills);}
  else if(!((city.slug==='shanghai'||city.slug==='beijing')&&id==='mosques'))tools.append(pills);
  const regionPills=city.slug==='hainan'?make('div','gz-pills by3-hainan-regions'):null; if(regionPills)tools.prepend(regionPills);panel.append(tools);
  const counter=make('p','gz-count'),grid=make('div','gz-grid'),pager=make('div','gz-pagination');panel.append(counter,grid,pager);wrapper.append(panel);
  const shenzhen=city.slug==='shenzhen'||city.slug==='foshan'||city.slug==='yiwu'||city.slug==='guilin'||city.slug==='yangshuo'||city.slug==='zhangjiajie'||city.slug==='chongqing'||city.slug==='hainan'||city.slug==='shanghai'||city.slug==='yangshuo'||city.slug==='beijing';
  const subtypes=city.slug==='shanghai'&&id==='mosques'?[]:[...new Set(relevant.map(r=>r.subtype).filter(Boolean))];if(city.slug==='beijing' && id==='mosques')subtypes.splice(0,subtypes.length);if(city.slug==='shanghai'&&id==='dining'){const order=['المطاعم العربية','المطاعم التركية','المطاعم الهندية والباكستانية','المطاعم الإيرانية','المطاعم الآسيوية الحلال','المطاعم الأوروبية','البيتزا','المأكولات البحرية','الكافيهات','المخابز'];subtypes.splice(0,subtypes.length,...order);}if(city.slug==='beijing'&&id==='hotels'){const order=['5 نجوم','4 نجوم','3 نجوم','غير مصنفة'];subtypes.sort((a,b)=>order.indexOf(a)-order.indexOf(b));}if(city.slug==='beijing'&&id==='transport'){const order=['المطارات','محطات القطارات','المترو والمواصلات الأخرى'];subtypes.sort((a,b)=>order.indexOf(a)-order.indexOf(b));}if((city.slug==='guilin'||city.slug==='yangshuo'||city.slug==='zhangjiajie'||city.slug==='chongqing'||city.slug==='hainan'||city.slug==='shanghai')&&id==='hotels'){const order=['5 نجوم','4 نجوم','3 نجوم','غير مصنفة'];subtypes.sort((a,b)=>order.indexOf(a)-order.indexOf(b));}
  if(shenzhen){panel.classList.add('v022-shenzhen-panel');input.setAttribute('aria-label','البحث في قسم '+(labels[id]||id));}

  function paint(){
   if(regionPills){regionPills.replaceChildren();const availableRegions=[...new Set(relevant.map(r=>r.region).filter(Boolean))];['الكل',...availableRegions].forEach(reg=>{const b=button((reg==='الكل'?'🏝️ ':'📍 ')+reg,()=>{regionFilter=reg;filter='الكل';max=32;paint()},'gz-pill'+(regionFilter===reg?' active':''));b.setAttribute('aria-pressed',String(regionFilter===reg));regionPills.append(b)})}
   pills.replaceChildren();
   let matches;
   if(beijingDining){
    // Guangzhou parity: restaurants by cuisine at the first level; cafes and bakeries
    // reveal their own tags only when selected. All categories are data-driven.
    const isBakery=r=>/مخابز|الحلويات التقليدية/.test(String(r.subtype||''));
    const isCafe=r=>!isBakery(r)&&/كافيه/.test(String(r.subtype||''));
    const isRestaurant=r=>!isBakery(r)&&!isCafe(r);
    const tagsOf=r=>[r.subtype,...(Array.isArray(r.v0313Tags)?r.v0313Tags:[])];
    const cuisineOrder=['المطاعم العربية','المطاعم التركية','المطاعم الهندية','المطاعم الهندية والباكستانية','المطاعم الإيرانية','المطاعم الصينية الحلال','المطاعم الآسيوية الحلال','المطاعم الأوروبية','المطاعم الأمريكية','المأكولات البحرية','البيتزا'];
    const availableCuisine=[...new Set(relevant.filter(isRestaurant).map(r=>r.subtype).filter(Boolean))].sort((a,b)=>{
     const ia=cuisineOrder.indexOf(a),ib=cuisineOrder.indexOf(b);return (ia<0?999:ia)-(ib<0?999:ib)||a.localeCompare(b,'ar');
    });
    const groupOrder=['الكل',...availableCuisine,...(relevant.some(isCafe)?['الكافيهات']:[]),...(relevant.some(isBakery)?['المخابز']:[])];
    if(!groupOrder.includes(beijingDiningGroup))beijingDiningGroup='الكل';
    const labelOf=g=>g==='الكل'?'الكل':g;
    groupPills.replaceChildren();
    for(const g of groupOrder){
     const btn=button('',()=>{beijingDiningGroup=g;filter='الكل';max=32;paint()},'gz-pill'+(beijingDiningGroup===g?' active':''));
     btn.setAttribute('aria-pressed',String(beijingDiningGroup===g));
     btn.append(make('span','gz-filter-icon',g==='المأكولات البحرية'?'🦐':filterIcon(g)),make('span','gz-filter-label',labelOf(g)));
     groupPills.append(btn);
    }
    const groupItems=relevant.filter(r=>beijingDiningGroup==='الكل'||(beijingDiningGroup==='المخابز'?isBakery(r):beijingDiningGroup==='الكافيهات'?isCafe(r):r.subtype===beijingDiningGroup));
    const tagChoices=beijingDiningGroup==='الكافيهات'?
     [['الكافيهات السياحية','📸 كافيه سياحي'],['الكافيهات ذات الإطلالات','🌆 ذو إطلالة'],['الكافيهات التاريخية','🏛️ تراثي'],['الكافيهات المميزة','✨ مميز']]:
     beijingDiningGroup==='المخابز'?
     [['المخابز المميزة','🥐 مخبز مميز'],['المخابز السياحية','🏛️ مخبز سياحي']]:[];
    const tagOptions=tagChoices.filter(([id])=>groupItems.some(r=>tagsOf(r).includes(id)));
    if(!tagOptions.some(([id])=>id===filter))filter='الكل';
    pills.hidden=!tagChoices.length;
    pills.replaceChildren();
    if(tagChoices.length){
     const heading=make('div','gz-cafe-tag-heading',beijingDiningGroup==='الكافيهات'?'☕ أنواع الكافيهات':'🥐 أنواع المخابز');
     pills.append(heading);
     const tags=make('div','gz-cafe-tags');
     for(const [id,label] of [['الكل','☕ الكل'],...tagOptions]){
      const btn=button(label,()=>{filter=id;max=32;paint()},'gz-pill gz-cafe-pill'+(filter===id?' active':''));
      btn.setAttribute('aria-pressed',String(filter===id));tags.append(btn);
     }
     if(beijingDiningGroup==='المخابز'&&tags.firstElementChild)tags.firstElementChild.textContent='🥐 الكل';
     pills.append(tags);
    }
    matches=groupItems.filter(r=>(filter==='الكل'||tagsOf(r).includes(filter))&&(!searchTerm||[r.ar,r.en,r.zh,r.addressZh,r.addressEn,r.note,r.metro].some(t=>normalize(t).includes(normalize(searchTerm)))));
   }else{
    ((city.slug==='shanghai'||city.slug==='beijing')&&id==='mosques'?[]:['الكل',...subtypes]).forEach(f=>pills.append((()=>{const b=button('',()=>{filter=f;max=32;paint()},'gz-pill'+(filter===f?' active':''));b.setAttribute('aria-pressed',String(filter===f));b.append(make('span','gz-filter-icon',city.slug==='shanghai'&&id==='markets'&&f==='الأنفاق والسراديب'?'🚇':filterIcon(f)),make('span','gz-filter-label',f));return b})()));
    matches=relevant.filter(r=>(filter==='الكل'||r.subtype===filter||(city.slug==='beijing'&&Array.isArray(r.v0313Tags)&&r.v0313Tags.includes(filter)))&&(city.slug!=='hainan'||regionFilter==='الكل'||r.region===regionFilter)&&(!searchTerm||[r.ar,r.en,r.zh,r.addressZh,r.addressEn,r.note,r.metro].some(t=>normalize(t).includes(normalize(searchTerm)))));
   }
   counter.textContent='عدد الأماكن: '+matches.length;grid.replaceChildren();pager.replaceChildren();
   matches.slice(0,max).forEach(x=>grid.append(shenzhen?shenzhenPlace(x,city.slug==='foshan'?'佛山':city.slug==='yiwu'?'义乌':city.slug==='guilin'?'桂林':city.slug==='yangshuo'?'阳朔':city.slug==='zhangjiajie'?'张家界':city.slug==='chongqing'?'重庆':city.slug==='hainan'?'海南':city.slug==='shanghai'?'上海':city.slug==='beijing'?'北京':'深圳'):place(x)));
   if(globalTarget&&window.BY3_GLOBAL_TARGET===globalTarget){const hit=[...grid.querySelectorAll('.by3-place')].find(el=>el.id==='place-'+globalTarget.id);if(hit){window.BY3_GLOBAL_TARGET=null;hit.classList.add('by3-search-highlight');requestAnimationFrame(()=>requestAnimationFrame(()=>hit.scrollIntoView({block:'center',behavior:'smooth'})));}}
   if(!matches.length)grid.append(make('p','gz-empty',city.slug==='shanghai'&&id==='dining'?'لا توجد أماكن موثقة حاليًا لهذا التصنيف.':'لا توجد مواقع في هذا القسم ضمن النسخة المصدر.'));
   if(max<matches.length)pager.append(button('عرض المزيد ('+(matches.length-max)+')',()=>{max+=32;paint()}));
  }
  if(city.slug!=='yiwu' && city.slug!=='guilin' && city.slug!=='yangshuo' && city.slug!=='zhangjiajie' && city.slug!=='chongqing' && city.slug!=='hainan' && city.slug!=='shanghai' && city.slug!=='beijing')input.addEventListener('input',()=>{searchTerm=input.value;max=32;paint()});paint();
 };
})();
