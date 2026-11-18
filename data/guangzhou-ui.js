'use strict';
/* V009: shared V006 navigation, Guangzhou records only. No new data for other cities. */
(()=>{
 const store=window.BY3_GUANGZHOU;
 if(!store||!Array.isArray(store.items))return;
 const bySection=(id)=>store.items.filter(r=>r.section===id||(Array.isArray(r.sections)&&r.sections.includes(id)));
 const subtypeFor=(r,id)=>r.subtypeBySection&&Object.prototype.hasOwnProperty.call(r.subtypeBySection,id)?r.subtypeBySection[id]:r.subtype;
 const baseSearch=searchNow;
 let selectedFilter='الكل',selectedCafeTag='الكل',localSearch='',pageSize=12,highlighted='',lastSection='';
 const ui={
 ar:{all:'الكل',search:'ابحث داخل القسم...',found:'عدد الأماكن',copyName:'نسخ الاسم الصيني',copyAddress:'نسخ العنوان الصيني',copyDidi:'نسخ الوجهة لـ DiDi',amap:'فتح البحث في AMAP',metro:'المترو',address:'العنوان الصيني',addressEn:'العنوان الإنجليزي',note:'ملاحظات',more:'عرض المزيد',copied:'تم نسخ النص',unavailable:'تعذر النسخ آليًا',missing:'المعلومة غير متوفرة في المصدر',info:'معلومات غوانزو',searchMatches:'نتائج مطابقة داخل غوانزو',newLabel:'✨ جديد',noResult:'لا توجد نتائج مطابقة'},
 en:{all:'All',search:'Search within this section...',found:'Places',copyName:'Copy Chinese name',copyAddress:'Copy Chinese address',copyDidi:'Copy for DiDi',amap:'Search AMAP',metro:'Metro',address:'Chinese address',addressEn:'English address',note:'Notes',more:'Show more',copied:'Copied',unavailable:'Could not copy automatically',missing:'Not provided in source',info:'About Guangzhou',searchMatches:'Matching places in Guangzhou',newLabel:'✨ New',noResult:'No matching results'},
 zh:{all:'全部',search:'搜索本栏目...',found:'地点数量',copyName:'复制中文名称',copyAddress:'复制中文地址',copyDidi:'复制目的地用于滴滴',amap:'高德地图搜索',metro:'地铁',address:'中文地址',addressEn:'英文地址',note:'备注',more:'查看更多',copied:'已复制',unavailable:'无法自动复制',missing:'原始资料未提供',info:'广州介绍',searchMatches:'广州匹配地点',newLabel:'✨ 新增',noResult:'没有匹配结果'}
 };
 function name(r){return lang==='en'?(r.en||r.ar):lang==='zh'?(r.zh||r.ar):r.ar}
  // V041 – Opening-year label, only for verified record-level dates.
  function openingText(r){
    const year=Number(r.openingYear);
    if(!Number.isInteger(year)||year<1000||year>new Date().getFullYear())return '';
    const kind=r.openingKind||'opened';
    const shown=lang==='ar'?String(year).replace(/[0-9]/g,c=>'٠١٢٣٤٥٦٧٨٩'[Number(c)]):String(year);
    if(lang==='zh')return kind==='phased'?shown+'年起分阶段开放':kind==='trial'?shown+'年试运营':kind==='founded'?shown+'年创立':kind==='renovated'?shown+'年翻新':shown+'年开业';
    const labels=lang==='en'?{opened:'Opened in ',phased:'Opened in phases from ',trial:'Trial opening in ',founded:'Founded in ',renovated:'Renovated in '}:{opened:'افتُتح عام ',phased:'بدأ افتتاحه عام ',trial:'بدأ التشغيل عام ',founded:'تأسس عام ',renovated:'جُدّد عام '};
    return (labels[kind]||labels.opened)+shown;
  }
 function element(tag,cls,text){const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined&&text!==null)x.textContent=text;return x}
 function clean(text){return String(text||'').normalize('NFKC').toLowerCase().replace(/[ً-ٰٟ]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,' ').trim()}
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
  // Metro cards: show only the known station name, line number and confirmed exit.
  // Preserve the complete source field r.metro without rewriting source data.
  function metroCompact(raw){
    const original=String(raw||'').trim();
    if(!original||/^(?:تحقق|محطتان)/.test(original))return '';
    // Remove guidance, routes, distances and verification notes from visible text.
    let value=original.split(/[؛;]/,1)[0].trim();
    value=value.replace(/\([^()]*?(?:تحقق|راجع|يحتاج|بحسب|قد يلزم|نحو|verify|أقرب|متر|المول)[^()]*\)/gi,'').trim();
    // Station names may appear in English followed by a Chinese name in parentheses.
    let station='';
    const chineseFirst=value.match(/^([\u3400-\u9fff]+站)(?:\s*\(([^)]*)\))?/);
    if(chineseFirst){
      station=chineseFirst[1]+(chineseFirst[2]&&!/(?:الخط|المخرج|line|exit)/i.test(chineseFirst[2])?' ('+chineseFirst[2]+')':'');
    }else{
      const prefix=value.split(/\s+[–—-]\s+|\s+\b(?:Lines?|Exits?|L\d)\b|\s+الخط(?:ان)?\b|\s+المخرج\b|\s+المخارج\b/i)[0].trim();
      station=prefix.replace(/\s*\((?:Lines?|Exits?|الخط|المخرج)[^)]*\)/gi,'').trim();
      // Support bilingual station names separated by an en dash.
      const bilingual=value.match(/^(.+?)\s+[–—]\s+([\u3400-\u9fff]+站)/);
      if(bilingual)station=bilingual[1].trim()+' ('+bilingual[2]+')';
    }
    station=station.replace(/\s*\([^)]*?(?:الخط|المخرج|Line|Exit)[^)]*\)/gi,'').trim();
    // Strip incidental descriptive fragments; do not invent an unconfirmed station.
    if(!station||/(?:تحقق|راجع|المسافة|محطتان|أقرب محطة|مخرج عبر)/.test(station))return '';
    station=station.replace(/\s*[-–—]\s*$/,'').replace(/\s*\([^)]*$/,'').trim();
    let line='';
    const arabic=value.match(/(?:الخط(?:ان)?|خط\s*المترو)\s*([0-9٠-٩]+(?:\s*(?:و|\/|،|,|&|and)\s*[0-9٠-٩]+)*)/i);
    const english=value.match(/\bLines?\s*([0-9]+(?:\s*(?:\/|,|&|and)\s*[0-9]+)*)/i);
    const shorthand=value.match(/\bL([0-9]+(?:\/L?[0-9]+)*)/i);
    const apm=/\bAPM\b/i.test(original);
    let rawLine=arabic?.[1]||english?.[1]||shorthand?.[1]||'';
    if(rawLine){
      const digits=(rawLine.match(/[0-9٠-٩]+/g)||[]).map(x=>x.replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d))).filter(Boolean);
      const key=Array.from(new Set(digits)).join('/');
      line=lang==='en'?'Line '+key:lang==='zh'?'地铁'+key+'号线':'الخط '+key;
    }else if(apm){line='APM';}
    let exit='';
    const exitMatch=original.match(/(?:المخرج|المخارج|مخرج|Exits?)\s*([A-Z0-9]+(?:\s*(?:أو|or|\/|,|،)\s*[A-Z0-9]+)*)/i);
    if(exitMatch){
      const val=exitMatch[1].replace(/\s*(?:أو|or|،|,)\s*/gi,'/').replace(/\s*\/\s*/g,'/').trim();
      // A stated but explicitly unconfirmed exit should not be presented as certain.
      const unconfirmed=/(?:يحتاج تأكيد|غير مؤكد|راجع المخرج|تأكد من المخرج|verify)/i.test(original);
      if(!unconfirmed)exit=lang==='en'?'Exit '+val:lang==='zh'?val+'号出口':'المخرج '+val;
    }
    return [station,line,exit].filter(Boolean).join(' — ');
  }
 function openedIn2025or2026(r){
  const year=Number(r.openingYear),kind=String(r.openingKind||'opened');
  return (year===2025||year===2026)&&['opened','phased','trial'].includes(kind)&&Boolean(r.openingSourceUrl||r.openingVerified===true);
 }
 function appendEnglishNewBadge(heading,r){
  const openingBadge=openedIn2025or2026(r);
  let additionBadge=false;
  if(r.englishNewBadge&&r.new&&/^\d{4}-\d{2}-\d{2}$/.test(String(r.addedOn||''))){
   const insertedAt=Date.parse(r.addedOn+'T00:00:00Z'),age=Date.now()-insertedAt;
   additionBadge=Number.isFinite(insertedAt)&&age>=0&&age<30*86400000;
  }
  if(!openingBadge&&!additionBadge)return;
  const badge=element('span','gz-english-new-badge','✨ NEW');
  badge.style.cssText='display:inline-flex;align-items:center;margin-inline-start:7px;padding:2px 8px;border-radius:9px;background:#d9f7ff;border:1px solid #6ad9ee;color:#075a83;font-size:.65em;font-weight:900;line-height:1.5;white-space:nowrap;vertical-align:middle;direction:ltr';
  badge.setAttribute('aria-label',openingBadge?'Opened in '+r.openingYear:'New');
  heading.append(badge);
 }
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
  // V041.23.7: Keep the source data untouched; compact Guangzhou cards display
  // only place names (AR/EN/ZH), verified opening year, compact metro and actions.
  const suffixText=r.titleSuffixAr?' ('+r.titleSuffixAr+')':'';const arabicTitle=(lang==='ar'&&suffixText&&r.ar.endsWith(suffixText))?r.ar.slice(0,-suffixText.length):name(r);const heading=element('h3','',arabicTitle);if(lang==='ar'&&r.titleSuffixAr){const suffix=element('small','gz-title-suffix',suffixText);suffix.style.cssText='font-size:.64em;font-weight:700;color:#536f80;white-space:nowrap;margin-inline-start:6px;display:inline';heading.append(suffix)}const opening=openingText(r);if(opening){
    const year=element('small','by2-opening-year','🗓️ '+opening);
    year.style.cssText='display:inline-flex;align-items:center;gap:4px;vertical-align:middle;max-width:100%;border:1px solid #9ed5fa;border-radius:9px;background:#eff9ff;padding:3px 9px;margin-inline-start:9px;margin-block:3px;color:#075b96;font-size:.7em;font-weight:750;line-height:1.55;white-space:normal';
    year.setAttribute('aria-label',opening);
    if(r.openingSourceUrl)year.title=opening+' — '+r.openingSourceUrl;
    heading.append(year);
  }appendEnglishNewBadge(heading,r);main.append(heading);
  if(r.en&&r.en!==name(r))addP(main,'gz-en',r.en);
  if(r.zh&&r.zh!==name(r))addP(main,'gz-zh',r.zh);
  if(r.metro){const shortMetro=metroCompact(r.metro);if(shortMetro)addP(main,'gz-info gz-metro-compact','🚇 '+m.metro+': '+shortMetro);}
  // Display the verified products and indicative size for the new underground markets
  // using the existing compact card text style; all other cards remain unchanged.
  if(r.section==='markets'&&r.guideGroup==='underground'&&r.marketContent){
    const marketText=lang==='en'?(r.marketContentEn||r.marketContent):lang==='zh'?(r.marketContentZh||r.marketContent):r.marketContent;
    const marketSize=lang==='en'?(r.sizeEn||r.size):lang==='zh'?(r.sizeZh||r.size):r.size;
    const contentsLabel=lang==='en'?'Products: ':lang==='zh'?'商品：':'التخصص: ';
    const sizeLabel=lang==='en'?'Size: ':lang==='zh'?'规模：':'الحجم: ';
    addP(main,'gz-info gz-underground-products','🛍️ '+contentsLabel+marketText);
    if(marketSize)addP(main,'gz-info gz-underground-size','📏 '+sizeLabel+marketSize);
  }
  article.append(actionsWrap,main);return window.BY2_FAVORITES.addHeart(article,r,'guangzhou');
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
  const activeSectionId=state.section||'markets';if(lastSection!==activeSectionId){selectedFilter='الكل';selectedCafeTag='الكل';localSearch='';pageSize=12;lastSection=activeSectionId}
  const sectionMeta=sections.find(s=>s.id===activeSectionId)||sections[0];
  const source=bySection(activeSectionId),filterNames=[...new Set(source.map(r=>subtypeFor(r,activeSectionId)).filter(Boolean))];
  const by3Target=window.BY3_GLOBAL_TARGET;
  if(by3Target&&by3Target.city===0&&by3Target.section===activeSectionId){selectedFilter='الكل';selectedCafeTag='الكل';localSearch='';pageSize=Math.max(12,bySection(activeSectionId).findIndex(r=>String(r.id)===String(by3Target.id))+1);highlighted=by3Target.id;}

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
  const controls=element('div','gz-controls'),input=element('input');input.type='search';input.placeholder=m.search;input.value=localSearch;input.setAttribute('aria-label',m.search);input.addEventListener('input',()=>{localSearch=input.value;pageSize=12;updateGrid()});
  controls.append(input);const pills=element('div','gz-pills');
  for(const filter of ['الكل',...filterNames,'❤️ المفضلة']){const pill=element('button','gz-pill'+(selectedFilter===filter?' active':'')+(filter==='❤️ المفضلة'?' by2-fav-pill':''));pill.type='button';pill.setAttribute('aria-pressed',String(selectedFilter===filter));pill.append(element('span','gz-filter-icon',(filter==='❤️ المفضلة'?'♥':filterIcon(filter))),element('span','gz-filter-label',filter==='الكل'?m.all:(window.BY2_L10N?.term(filter)||filter)));pill.addEventListener('click',()=>{selectedFilter=filter;selectedCafeTag='الكل';pageSize=12;renderListings()});pills.append(pill)}
  controls.append(pills);
  if(activeSectionId==='dining'&&selectedFilter==='الكافيهات'){
   const tagWrap=element('div','gz-cafe-tag-wrap');tagWrap.append(element('div','gz-cafe-tag-heading','☕ أنواع الكافيهات'));
   const tags=element('div','gz-cafe-tags');
   [['الكل','☕ الكل'],['سياحي','📸 كافيه سياحي'],['إطلالة','🌆 ذو إطلالة'],['تراثي','🏛️ تراثي'],['طبيعة','🌿 وسط الطبيعة'],['مبتكر','🧪 مشروبات مبتكرة'],['تقديم مميز','🎨 تقديم مميز']].forEach(([key,label])=>{
    const b=element('button','gz-pill gz-cafe-pill'+(selectedCafeTag===key?' active':''),label);b.type='button';b.setAttribute('aria-pressed',String(selectedCafeTag===key));b.addEventListener('click',()=>{selectedCafeTag=key;pageSize=12;renderListings()});tags.append(b);
   });tagWrap.append(tags);controls.append(tagWrap);
  }
  // 2026-11-17: children-only sub-filter for Guangzhou clothing markets.
  if(activeSectionId==='markets'&&selectedFilter==='أهم أسواق الملابس'){
    const tagWrap=element('div','gz-cafe-tag-wrap');
    tagWrap.append(element('div','gz-cafe-tag-heading',lang==='en'?"🧒 Children's clothing markets":lang==='zh'?'🧒 童装市场':'🧒 تخصص أسواق الملابس'));
    const tags=element('div','gz-cafe-tags');
    for(const [key,label] of [['الكل',lang==='en'?'All':lang==='zh'?'全部':'الكل'],['ملابس الأطفال',lang==='en'?"Children's clothing":lang==='zh'?'童装':'ملابس الأطفال']]){
      const btn=element('button','gz-pill gz-cafe-pill'+(selectedCafeTag===key?' active':''),(key==='الكل'?'▦ ':'🧒 ')+label);
      btn.type='button';btn.setAttribute('aria-pressed',String(selectedCafeTag===key));
      btn.addEventListener('click',()=>{selectedCafeTag=key;pageSize=12;renderListings()});tags.append(btn);
    }
    tagWrap.append(tags);controls.append(tagWrap);
  }
  panel.append(controls);
  const counter=element('p','gz-count'),grid=element('div','gz-grid'),pager=element('div','gz-pagination');panel.append(counter,grid,pager);box.append(panel);
  if(activeSectionId==='information'){controls.hidden=true;counter.hidden=true;buildGuangzhouInformation(grid);return;}
  function updateGrid(){const q=clean(localSearch);const filtered=source.filter(r=>(selectedFilter==='الكل'||(selectedFilter==='❤️ المفضلة'&&window.BY2_FAVORITES.isSaved('guangzhou',r.id))||subtypeFor(r,activeSectionId)===selectedFilter)&&(selectedCafeTag==='الكل'||(activeSectionId==='markets'&&selectedFilter==='أهم أسواق الملابس'?((Array.isArray(r.marketTags)&&r.marketTags.includes(selectedCafeTag))||/ملابس الأطفال|童装/.test(String(r.ar||'')+' '+String(r.zh||''))):(Array.isArray(r.cafeTags)&&r.cafeTags.includes(selectedCafeTag))))&&(!q||[r.ar,r.en,r.zh,r.addressZh,r.addressEn,r.metro,r.note,r.subtype,r.addressAr,...(r.searchAliases||[])].some(v=>clean(v).includes(q))));
   counter.textContent=m.found+': '+filtered.length;grid.replaceChildren();pager.replaceChildren();filtered.slice(0,pageSize).forEach(r=>grid.append(recordCard(r)));
   if(!filtered.length)grid.append(element('div','gz-empty',selectedFilter==='❤️ المفضلة'?(window.BY2_L10N?.term('لم تقم بإضافة أماكن إلى المفضلة بعد ❤️')||'لم تقم بإضافة أماكن إلى المفضلة بعد ❤️'):m.noResult));
   if(filtered.length>pageSize){const b=element('button','','شاهد المزيد'+' ('+(filtered.length-pageSize)+')');b.type='button';b.addEventListener('click',()=>{pageSize+=12;updateGrid()});pager.append(b)}
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
 window.BY2_FAVORITES.subscribe(()=>{if(state.kind==='section'&&state.city===0)renderListings()});
 searchNow=function(){baseSearch();if(!window.BY3_GUANGZHOU)return;const term=clean(document.getElementById('searchInput').value);if(!term||term.length<2)return;
  const matches=store.items.filter(r=>[r.ar,r.en,r.zh,r.addressZh,r.addressEn,r.metro,r.subtype,r.addressAr,...(r.searchAliases||[])].some(v=>clean(v).includes(term))).slice(0,32);
  const out=document.getElementById('searchResults');if(matches.length){const heading=element('p','',ui[lang].searchMatches+' ('+matches.length+(matches.length===32?'+':'')+')');out.append(heading)}
  matches.forEach(r=>{const b=element('button','',name(r)+' — '+(sections.find(s=>s.id===r.section)||{}).ar);b.type='button';b.addEventListener('click',()=>{search(false);highlighted=r.id;navigate({kind:'section',city:0,section:r.section});});out.append(b)});
 };
 document.getElementById('searchInput').addEventListener('input',()=>searchNow());
 renderRoute();
})();
