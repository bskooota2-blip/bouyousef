'use strict';
/* V009: shared V006 navigation, Guangzhou records only. No new data for other cities. */
(()=>{
 const store=window.BY3_GUANGZHOU;
 if(!store||!Array.isArray(store.items))return;
 const bySection=(id)=>store.items.filter(r=>r.section===id||(Array.isArray(r.sections)&&r.sections.includes(id)));
 const subtypeFor=(r,id)=>r.subtypeBySection&&Object.prototype.hasOwnProperty.call(r.subtypeBySection,id)?r.subtypeBySection[id]:r.subtype;
 const baseSearch=searchNow;
 let selectedFilter='الكل',selectedCafeTag='الكل',localSearch='',pageSize=32,highlighted='',lastSection='';
 const ui={
 ar:{all:'الكل',search:'ابحث داخل القسم...',found:'عدد الأماكن',copyName:'نسخ الاسم الصيني',copyAddress:'نسخ العنوان الصيني',copyDidi:'نسخ الوجهة لـ DiDi',amap:'فتح البحث في AMAP',metro:'المترو',address:'العنوان الصيني',addressEn:'العنوان الإنجليزي',note:'ملاحظات',more:'عرض المزيد',copied:'تم نسخ النص',unavailable:'تعذر النسخ آليًا',missing:'المعلومة غير متوفرة في المصدر',info:'معلومات غوانزو',searchMatches:'نتائج مطابقة داخل غوانزو',newLabel:'✨ جديد',noResult:'لا توجد نتائج مطابقة'},
 en:{all:'All',search:'Search within this section...',found:'Places',copyName:'Copy Chinese name',copyAddress:'Copy Chinese address',copyDidi:'Copy for DiDi',amap:'Search AMAP',metro:'Metro',address:'Chinese address',addressEn:'English address',note:'Notes',more:'Show more',copied:'Copied',unavailable:'Could not copy automatically',missing:'Not provided in source',info:'About Guangzhou',searchMatches:'Matching places in Guangzhou',newLabel:'✨ New',noResult:'No matching results'},
 zh:{all:'全部',search:'搜索本栏目...',found:'地点数量',copyName:'复制中文名称',copyAddress:'复制中文地址',copyDidi:'复制目的地用于滴滴',amap:'高德地图搜索',metro:'地铁',address:'中文地址',addressEn:'英文地址',note:'备注',more:'查看更多',copied:'已复制',unavailable:'无法自动复制',missing:'原始资料未提供',info:'广州介绍',searchMatches:'广州匹配地点',newLabel:'✨ 新增',noResult:'没有匹配结果'}
 };
 function name(r){return lang==='en'?(r.en||r.ar):lang==='zh'?(r.zh||r.ar):r.ar}
 function element(tag,cls,text){const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined&&text!==null)x.textContent=text;return x}
 function clean(text){return String(text||'').normalize('NFKC').toLowerCase().replace(/[ً-ٰٟ]/g,'').replace(/\s+/g,' ').trim()}
 function copyValue(value){const msg=ui[lang];if(!value)return;function notify(ok){const t=element('div','gz-copynote',ok?msg.copied:msg.unavailable);const root=document.querySelector('#gzListing .gz-controls')||document.body;root.append(t);setTimeout(()=>t.remove(),2200)}
  if(navigator.clipboard && window.isSecureContext){navigator.clipboard.writeText(value).then(()=>notify(true)).catch(()=>fallback())}else fallback();
  function fallback(){const el=document.createElement('textarea');el.value=value;el.style.position='fixed';el.style.opacity='0';document.body.append(el);el.focus();el.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}el.remove();notify(ok)}
 }
 function addP(parent,className,text){if(!text)return;parent.append(element('p',className,text))}
 function filterIcon(filter){if(filter==='الكل')return '▦';const x=String(filter).toLowerCase();
  if(/نسائي|نساء|سيدات/.test(x))return '👗';if(/رجال|رجالي/.test(x))return '👔';if(/أطفال/.test(x))return '🧒';if(/جينز/.test(x))return '👖';if(/تصفي/.test(x))return '🏷️';if(/أقمشة|خامات/.test(x))return '🧵';
  if(/ملابس|أزياء/.test(x))return '👕';if(/سوق|أسواق|جملة/.test(x))return '🏪';if(/مجمع|مول|تجارية/.test(x))return '🛍️';
  if(/كافيه|مقهى/.test(x))return '☕';if(/عرب/.test(x))return '🥙';if(/ترك/.test(x))return '🥘';if(/هند|باكستان/.test(x))return '🍛';if(/إيران/.test(x))return '🍢';if(/بيتزا/.test(x))return '🍕';if(/مخبز|مخابز/.test(x))return '🥐';if(/كافيه|قهوة/.test(x))return '☕';if(/آسيوي|حلال/.test(x))return '🍜';if(/مطعم/.test(x))return '🍽️';
  if(/5 نجوم/.test(x))return '🌟';if(/4 نجوم/.test(x))return '⭐';if(/3 نجوم/.test(x))return '🏨';if(/فنادق/.test(x))return '🛏️';if(/مطار/.test(x))return '✈️';if(/قطار/.test(x))return '🚆';if(/سراديب|أنفاق/.test(x))return '🏬';if(/سياح/.test(x))return '📸';return '📍'}
 function sectionIcon(sectionId){return sectionId==='markets'?'🏪':sectionId==='malls'?'🛍️':sectionId==='dining'?'☕':sectionId==='tourism'?'📸':sectionId==='hotels'?'🏨':sectionId==='transport'?'🚌':sectionId==='mosques'?'🕌':'ℹ️'}
 function recordCard(r){const m=ui[lang],article=element('article','gz-place');article.id='place-'+r.id;article.dataset.placeId=r.id;if(r.id===highlighted)article.classList.add('highlight');
  const actionsWrap=element('div','gz-place-actions');
  const actions=element('div','gz-buttons');
  function addAction(icon,label,value,cssClass){if(!value)return;const btn=element('button','gz-action '+(cssClass||''));btn.type='button';btn.title=label;btn.setAttribute('aria-label',label);if(cssClass==='gz-action-didi'){const img=element('img','gz-action-icon by3-didi-image');img.src='assets/didi-taxi-approved.png';img.style.cssText='display:block!important;width:27px!important;height:27px!important;min-width:27px!important;max-width:27px!important;max-height:27px!important;object-fit:contain!important;flex:0 0 27px!important;margin:0 auto!important;padding:0!important;border:0!important;background:transparent!important';img.alt='';img.setAttribute('aria-hidden','true');btn.append(img)}else btn.append(element('span','gz-action-icon',icon));btn.append(element('span','gz-action-label',cssClass==='gz-action-copy'?(lang==='en'?'Copy':lang==='zh'?'复制':'نسخ'):cssClass==='gz-action-didi'?'DiDi':'AMAP'));btn.addEventListener('click',()=>copyValue(value));actions.append(btn)}
  const target=r.addressZh||r.zh||r.en||r.ar;
  if(r.subtype==='الكافيهات'&&r.zh&&/[\u3400-\u9fff]/.test(r.zh))addAction('⧉',m.copyName,r.zh,'gz-action-copy');
  if(r.subtype==='الكافيهات'&&r.addressZh)addAction('⧉',m.copyAddress,r.addressZh,'gz-action-copy');
  if(r.subtype!=='الكافيهات')addAction('⧉',r.addressZh?m.copyAddress:r.zh?m.copyName:(lang==='ar'?'نسخ اسم المكان':lang==='en'?'Copy place name':'复制地点名称'),target,'gz-action-copy');
  if(target){addAction('◔',m.copyDidi,target,'gz-action-didi');const anchor=element('a','gz-amap gz-action gz-action-amap');anchor.href='https://uri.amap.com/search?keyword='+encodeURIComponent(target)+'&city='+encodeURIComponent('广州');anchor.target='_blank';anchor.rel='noopener noreferrer';anchor.title=m.amap;anchor.setAttribute('aria-label',m.amap);anchor.append(element('span','gz-action-icon','➤'),element('span','gz-action-label','AMAP'));actions.append(anchor)}
  actionsWrap.append(actions);
  const main=element('div','gz-place-main');
  const top=element('div','gz-place-top');
  top.append(element('span','gz-tag',subtypeFor(r,state.section)||r.sourceCategory||''));
  if(r.new)top.append(element('span','gz-tag',m.newLabel));
  if(r.addedText)top.append(element('span','gz-tag',r.addedText));
  if(r.cafeTags)r.cafeTags.forEach(tag=>top.append(element('span','gz-tag gz-cafe-badge',({'سياحي':'📸 سياحي','إطلالة':'🌆 ذو إطلالة','تراثي':'🏛️ تراثي','طبيعة':'🌿 وسط الطبيعة','مبتكر':'🧪 مشروبات مبتكرة','تقديم مميز':'🎨 تقديم مميز'})[tag]||tag)));
  main.append(top);
  main.append(element('h3','',name(r)));
  if(r.en&&r.en!==name(r))addP(main,'gz-en',r.en);
  if(r.zh&&r.zh!==name(r))addP(main,'gz-zh',r.zh);
  if(r.addressZh)addP(main,'gz-info','📍 '+m.address+': '+r.addressZh);
  if(r.addressEn)addP(main,'gz-info','📍 '+m.addressEn+': '+r.addressEn);
  if(r.addressAr)addP(main,'gz-info','📍 '+(lang==='en'?'Arabic address':lang==='zh'?'阿拉伯语地址':'العنوان العربي')+': '+r.addressAr);
  if(r.metro)addP(main,'gz-info','🚇 '+m.metro+': '+r.metro);
  if(r.note)addP(main,'gz-info','ℹ️ '+m.note+': '+r.note);
  if(r.contact)addP(main,'gz-info','☎️ '+r.contact);
  if(r.sourceCaution)addP(main,'gz-info','⚠️ '+r.sourceCaution);
  if(r.features)addP(main,'gz-info',r.features);
  if(r.signatureDrink)addP(main,'gz-info gz-special-drink','☕ المشروب المميز: '+r.signatureDrink);
  if(r.nearby)addP(main,'gz-info',r.nearby);
  const side=element('div','gz-place-side',sectionIcon(r.section));
  article.append(actionsWrap,main,side);return article;
 }
 function currentListing(){return document.getElementById('gzListing')}
function buildGuangzhouInformation(box){
  const infoData={
    lead:'تشتهر غوانزو بكونها عاصمة التجارة والاستيراد في جنوب الصين ومهد المطبخ الكانتوني، وتحيط بها مدن صناعية وسياحية كبرى يسهل الوصول إليها عبر شبكة قطارات سريعة ومترو متكاملة.',
    features:[
      ['🛒','الأسواق التجارية ومعرض كانتون','تشتهر غوانزو بمعرض كانتون الدولي للاستيراد والتصدير، وأسواق الجملة المتخصصة للملابس والإلكترونيات والجلود، ومنطقة شياوبي التي تضم مكاتب الشحن والمطاعم الحلال.'],
      ['🏙️','المعالم المعمارية الحديثة','برج كانتون الذي يبلغ ارتفاعه نحو 600 متر، ودار أوبرا غوانزو التي صممتها زها حديد، والرحلات الليلية في نهر اللؤلؤ.'],
      ['🕌','المعالم التاريخية والإسلامية','مسجد هوايشينغ التاريخي، وجزيرة شاميان ذات الطراز الأوروبي، وقاعة أسلاف عشيرة تشن. مسجد هوايشينغ مختلف عن مسجد سعد بن أبي وقاص.'],
      ['🌳','الترفيه والطبيعة','تُعرف غوانزو بمدينة الزهور، وتضم مرافق تشيميلونغ الترفيهية وحديقة السفاري.'],
      ['🥟','المطبخ الكانتوني','تشتهر غوانزو بأطباق الديم سوم المطهوة على البخار والمأكولات البحرية الطازجة.']
    ],
    cities:[
      ['فوشان','Foshan','الأثاث والمفروشات والسيراميك والرخام.','خط غوانغفو للمترو أو سيارة مع سائق','Xilang (西塱) نقطة ربط للمترو','نحو ساعة بالمترو إلى وسط فوشان، بحسب الوجهة. قد تكون بعض الوجهات أقرب.'],
      ['دونغقوان','Dongguan','الإلكترونيات والألعاب والصناعات المختلفة.','قطار سريع أو بين المدن','Guangzhou East أو Guangzhou South حسب المحطة المقصودة','تقريبًا 20–60 دقيقة في العديد من خدمات القطارات، ويختلف حسب المحطة.'],
      ['شينزن','Shenzhen','التكنولوجيا والإلكترونيات وأسواق الهواتف.','القطار السريع','Guangzhou South → Shenzhen North','حوالي 30–55 دقيقة لبعض القطارات.'],
      ['تشوهاي','Zhuhai','السياحة الساحلية وبوابة العبور إلى ماكاو.','قطار بين المدن','Guangzhou South → Zhuhai','غالبًا نحو 60–90 دقيقة، وتوجد خدمات أسرع أو أبطأ.'],
      ['هونغ كونغ','Hong Kong','التسوق والسياحة والمركز المالي.','قطار سريع عابر للحدود','Guangzhou South → Hong Kong West Kowloon','نحو 47–80 دقيقة لبعض الرحلات؛ تُضاف إجراءات الحدود.'],
      ['إيوو','Yiwu','أسواق الجملة والهدايا والإكسسوارات والسلع الصغيرة.','القطار أو الطائرة عند توفر رحلات مناسبة','Guangzhou South أو مطار Guangzhou Baiyun بحسب الحجز','لا توجد مدة ثابتة معتمدة؛ راجع جدول الرحلة المحددة.']
    ],
    tips:[
      ['🚄','القطار السريع','وسيلة عملية للتنقل بين المدن؛ راجع الجداول واحجز مسبقًا عند الحاجة عبر 12306 أو Trip.com باستخدام بيانات جواز السفر.'],
      ['🚌','الباصات السياحية','قد تتوفر حافلات إلى بعض المدن المجاورة؛ تحقّق من نقطة الانطلاق والجدول قبل السفر.'],
      ['🚙','السيارة الخاصة','قد تناسب زيارة معارض الأثاث المتباعدة في فوشان؛ المقصود سيارة مع سائق عند الحاجة.']
    ]
  };
  const container=element('div','gz-info-detail');container.dir='rtl';container.lang='ar';
  if(lang!=='ar')container.append(element('div','gz-info-lang-note',lang==='en'?'The city information below is currently available in Arabic only.':'下方城市介绍目前仅提供阿拉伯语。'));
  container.append(element('div','gz-info-intro',infoData.lead));
  const layout=element('div','gz-info-layout');const nearbyCol=element('div','gz-info-column');const highlightsCol=element('div','gz-info-column');
  function panel(parent,icon,title){const p=element('section','gz-info-panel-block');p.append(element('h3','gz-info-title',icon+' '+title));parent.append(p);return p}
  const highlights=panel(highlightsCol,'⭐','أولاً: أهم ما تشتهر به غوانزو');const feats=element('div','gz-feature-list');
  infoData.features.forEach(([icon,title,description])=>{const item=element('article','gz-feature');item.append(element('span','gz-feature-icon',icon));const body=element('div');body.append(element('h4','',title),element('p','',description));item.append(body);feats.append(item)});highlights.append(feats);
  const near=panel(nearbyCol,'🚄','ثانيًا: المدن المحيطة ووسائل الوصول');
  const table=element('table','gz-cities-table');const thead=element('thead');const hrow=element('tr');['المدينة','بماذا تشتهر؟','المواصلات','نقطة الانطلاق','المدة التقريبية'].forEach(c=>hrow.append(element('th','',c)));thead.append(hrow);table.append(thead);const tbody=element('tbody');
  const mobile=element('div','gz-info-cards-mobile');
  infoData.cities.forEach(([ar,en,known,mode,departure,duration])=>{
    const tr=element('tr');const city=element('td');city.append(document.createTextNode(ar),element('small','',en));tr.append(city);[known,mode,departure,duration].forEach(v=>tr.append(element('td','',v)));tbody.append(tr);
    const item=element('article','gz-near-city');item.append(element('h4','',ar+' — '+en));const dl=element('dl');[['تشتهر بـ: ',known],['المواصلات: ',mode],['نقطة الانطلاق: ',departure],['المدة: ',duration]].forEach(([label,value])=>{const row=element('div');row.append(element('dt','',label),element('dd','',value));dl.append(row)});item.append(dl);mobile.append(item);
  });table.append(tbody);near.append(table,mobile);
  const tips=panel(nearbyCol,'💡','نصائح سريعة للتنقل');const grid=element('div','gz-tip-grid');infoData.tips.forEach(([icon,title,description])=>{const item=element('article','gz-tip');item.append(element('span','tip-icon',icon),element('h4','',title),element('p','',description));grid.append(item)});tips.append(grid);
  layout.append(highlightsCol,nearbyCol);container.append(layout);
  container.append(element('div','gz-info-caveat','تنبيه: المدد تقديرية لبعض الخدمات وليست مواعيد مضمونة. وقت الوصول الفعلي يعتمد على المحطات والوجهة والخدمة المختارة، ولا يشمل الانتقال من الفندق أو الإجراءات الحدودية. تحقّق من 12306 أو جهة التشغيل قبل السفر.'));
  box.append(container);
}

 function renderListings(){const box=currentListing(),m=ui[lang];if(!box)return;
  box.replaceChildren();box.lang=lang;box.dir=lang==='ar'?'rtl':'ltr';
  const active=(state.kind==='section'&&state.city===0);if(!active)return;
  const activeSectionId=state.section||'markets';if(lastSection!==activeSectionId){selectedFilter='الكل';selectedCafeTag='الكل';localSearch='';pageSize=32;lastSection=activeSectionId}
  const sectionMeta=sections.find(s=>s.id===activeSectionId)||sections[0];
  const source=bySection(activeSectionId),filterNames=[...new Set(source.map(r=>subtypeFor(r,activeSectionId)).filter(Boolean))];
  const by3Target=window.BY3_GLOBAL_TARGET;
  if(by3Target&&by3Target.city===0&&by3Target.section===activeSectionId){selectedFilter='الكل';selectedCafeTag='الكل';localSearch='';pageSize=Math.max(32,bySection(activeSectionId).findIndex(r=>String(r.id)===String(by3Target.id))+1);highlighted=by3Target.id;}

  const panel=element('div','gz-panel');
  const head=element('div','gz-panel-head');
  const titleWrap=element('div','gz-panel-title-wrap');
  titleWrap.append(element('div','gz-section-title',(lang==='ar'?'غوانزو / ':'Guangzhou / ')+(sectionMeta?sectionMeta[lang]:'') ));
  titleWrap.append(element('div','gz-section-count',(lang==='ar'?'عدد الأماكن: ':lang==='en'?'Places: ':'地点数量：')+source.length));
  const icon=element('div','gz-panel-icon',sectionIcon(activeSectionId));
  head.append(titleWrap,icon);panel.append(head);
  const tools=element('div','gz-section-tools');
  const returns=element('div','gz-return-buttons');
  const backCity=element('button','',lang==='ar'?'العودة لأقسام المدينة':lang==='en'?'Back to city sections':'返回城市栏目');backCity.type='button';backCity.addEventListener('click',()=>{window.scrollTo({top:document.getElementById('citySectionsArea').offsetTop-24,behavior:'smooth'})});
  const homeBtn=element('button','',lang==='ar'?'العودة إلى الرئيسية':lang==='en'?'Back to home':'返回首页');homeBtn.type='button';homeBtn.addEventListener('click',()=>navigate({kind:'home'}));
  returns.append(backCity,homeBtn);tools.append(returns);panel.append(tools);
  const controls=element('div','gz-controls'),input=element('input');input.type='search';input.placeholder=m.search;input.value=localSearch;input.setAttribute('aria-label',m.search);input.addEventListener('input',()=>{localSearch=input.value;pageSize=32;updateGrid()});
  controls.append(input);const pills=element('div','gz-pills');
  for(const filter of ['الكل',...filterNames]){const pill=element('button','gz-pill'+(selectedFilter===filter?' active':''));pill.type='button';pill.setAttribute('aria-pressed',String(selectedFilter===filter));pill.append(element('span','gz-filter-icon',filterIcon(filter)),element('span','gz-filter-label',filter==='الكل'?m.all:filter));pill.addEventListener('click',()=>{selectedFilter=filter;selectedCafeTag='الكل';pageSize=32;renderListings()});pills.append(pill)}
  controls.append(pills);
  if(activeSectionId==='dining'&&selectedFilter==='الكافيهات'){
   const tagWrap=element('div','gz-cafe-tag-wrap');tagWrap.append(element('div','gz-cafe-tag-heading','☕ أنواع الكافيهات'));
   const tags=element('div','gz-cafe-tags');
   [['الكل','☕ الكل'],['سياحي','📸 كافيه سياحي'],['إطلالة','🌆 ذو إطلالة'],['تراثي','🏛️ تراثي'],['طبيعة','🌿 وسط الطبيعة'],['مبتكر','🧪 مشروبات مبتكرة'],['تقديم مميز','🎨 تقديم مميز']].forEach(([key,label])=>{
    const b=element('button','gz-pill gz-cafe-pill'+(selectedCafeTag===key?' active':''),label);b.type='button';b.setAttribute('aria-pressed',String(selectedCafeTag===key));b.addEventListener('click',()=>{selectedCafeTag=key;pageSize=32;renderListings()});tags.append(b);
   });tagWrap.append(tags);controls.append(tagWrap);
  }
  panel.append(controls);
  const counter=element('p','gz-count'),grid=element('div','gz-grid'),pager=element('div','gz-pagination');panel.append(counter,grid,pager);box.append(panel);
  if(activeSectionId==='information'){controls.hidden=true;counter.hidden=true;buildGuangzhouInformation(grid);return;}
  function updateGrid(){const q=clean(localSearch);const filtered=source.filter(r=>(selectedFilter==='الكل'||subtypeFor(r,activeSectionId)===selectedFilter)&&(selectedCafeTag==='الكل'||(Array.isArray(r.cafeTags)&&r.cafeTags.includes(selectedCafeTag)))&&(!q||[r.ar,r.en,r.zh,r.addressZh,r.addressEn,r.metro,r.note,r.subtype,r.addressAr,...(r.searchAliases||[])].some(v=>clean(v).includes(q))));
   counter.textContent=m.found+': '+filtered.length;grid.replaceChildren();pager.replaceChildren();filtered.slice(0,pageSize).forEach(r=>grid.append(recordCard(r)));
   if(!filtered.length)grid.append(element('div','gz-empty',m.noResult));
   if(filtered.length>pageSize){const b=element('button','',m.more+' ('+(filtered.length-pageSize)+')');b.type='button';b.addEventListener('click',()=>{pageSize+=32;updateGrid()});pager.append(b)}
   if(highlighted){const hit=box.querySelector('#place-'+highlighted);if(hit){if(window.BY3_GLOBAL_TARGET&&window.BY3_GLOBAL_TARGET.city===0){window.BY3_GLOBAL_TARGET=null;hit.classList.add('by3-search-highlight');}requestAnimationFrame(()=>hit.scrollIntoView({block:'center',behavior:'smooth'}));highlighted=''}}
  }
  updateGrid();
 }
 window.renderGuangzhouSection=function(){const area=document.getElementById('sectionContentArea');if(!area)return;let listing=currentListing();if(!listing){listing=element('div','gz-listing');listing.id='gzListing';area.append(listing)}
  const active=(state.kind==='section'&&state.city===0);
  listing.hidden=!active;
  const construction=area.querySelector('.construction-box');if(construction)construction.hidden=active;
  if(active){renderListings()}
 };
 searchNow=function(){baseSearch();if(!window.BY3_GUANGZHOU)return;const term=clean(document.getElementById('searchInput').value);if(!term||term.length<2)return;
  const matches=store.items.filter(r=>[r.ar,r.en,r.zh,r.addressZh,r.addressEn,r.metro,r.subtype,r.addressAr,...(r.searchAliases||[])].some(v=>clean(v).includes(term))).slice(0,32);
  const out=document.getElementById('searchResults');if(matches.length){const heading=element('p','',ui[lang].searchMatches+' ('+matches.length+(matches.length===32?'+':'')+')');out.append(heading)}
  matches.forEach(r=>{const b=element('button','',name(r)+' — '+(sections.find(s=>s.id===r.section)||{}).ar);b.type='button';b.addEventListener('click',()=>{search(false);highlighted=r.id;navigate({kind:'section',city:0,section:r.section});});out.append(b)});
 };
 document.getElementById('searchInput').addEventListener('input',()=>searchNow());
 renderRoute();
})();
