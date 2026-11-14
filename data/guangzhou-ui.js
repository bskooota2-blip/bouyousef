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
  top.append(element('span','gz-tag',window.BY2_L10N?.term(subtypeFor(r,state.section)||r.sourceCategory||'')||(subtypeFor(r,state.section)||r.sourceCategory||'')));
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
  article.append(actionsWrap,main,side);return window.BY2_FAVORITES.addHeart(article,r,'guangzhou');
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
  const infoTranslation={"en":{"lead":"Guangzhou is a major center for trade and imports in southern China and a birthplace of Cantonese cuisine. Nearby industrial and tourist cities are connected by high-speed trains and an extensive metro network.","features":[["Wholesale markets and the Canton Fair","Guangzhou is known for the Canton Fair, its wholesale clothing, electronics and leather markets, and the Xiaobei area with freight offices and halal restaurants."],["Modern architecture","Highlights include the approximately 600-meter Canton Tower, the Zaha Hadid-designed Guangzhou Opera House, and evening cruises on the Pearl River."],["Historic and Islamic landmarks","Notable sites include historic Huaisheng Mosque, European-style Shamian Island and the Chen Clan Ancestral Hall. Huaisheng Mosque is distinct from Saad bin Abi Waqqas Mosque."],["Leisure and nature","Known as the City of Flowers, Guangzhou also features Chimelong attractions and a safari park."],["Cantonese cuisine","Guangzhou is famous for steamed dim sum and fresh seafood."]],"cities":[["Foshan","Furniture, home furnishings, ceramics and marble.","Guangfo Metro Line or car with driver","Xilang (西塱) metro interchange","Around one hour by metro to central Foshan, depending on the destination; some places are closer."],["Dongguan","Electronics, toys and manufacturing.","High-speed or intercity train","Guangzhou East or Guangzhou South, depending on the destination station","About 20–60 minutes on many train services; varies by station."],["Shenzhen","Technology, electronics and phone markets.","High-speed train","Guangzhou South → Shenzhen North","About 30–55 minutes on some trains."],["Zhuhai","Coastal tourism and a gateway to Macau.","Intercity train","Guangzhou South → Zhuhai","Often around 60–90 minutes; faster and slower services also run."],["Hong Kong","Shopping, tourism and finance.","Cross-border high-speed train","Guangzhou South → Hong Kong West Kowloon","About 47–80 minutes on some services, plus border procedures."],["Yiwu","Wholesale gifts, accessories and small commodities.","Train or flight, subject to suitable services","Guangzhou South or Guangzhou Baiyun Airport, depending on booking","No fixed journey time is given; check your particular booking."]],"tips":[["High-speed rail","Convenient for intercity travel. Check timetables and book ahead when needed through 12306 or Trip.com using passport details."],["Intercity buses","Buses may serve some nearby cities. Verify departure points and schedules before traveling."],["Private car","A car with driver may be helpful for visiting widely spaced furniture showrooms in Foshan."]],"head1":"First: What Guangzhou is known for","head2":"Second: Nearby cities and how to get there","head3":"Quick travel tips","table":["City","Known for","Transport","Departure point","Approximate duration"],"mobile":["Known for: ","Transport: ","Departure point: ","Duration: "],"caveat":"Note: The times shown are estimates for selected services, not guaranteed schedules. Actual travel time depends on stations, destinations and the service used; hotel transfers and border formalities are excluded. Check 12306 or the operator before traveling."},"zh":{"lead":"广州是中国南方重要的商贸与进口中心，也是粤菜文化的重要发源地。周边有多个工业与旅游城市，可通过高速铁路和地铁网络便捷往来。","features":[["批发市场与广交会","广州以中国进出口商品交易会（广交会）、服装、电子产品和皮具批发市场闻名。小北地区还有货运服务公司和清真餐厅。"],["现代建筑","主要景点包括约600米高的广州塔、由扎哈·哈迪德设计的广州大剧院，以及珠江夜游。"],["历史与伊斯兰文化景点","知名景点有历史悠久的怀圣寺、欧式风情的沙面岛以及陈家祠。怀圣寺与先贤清真寺并非同一座清真寺。"],["休闲与自然","广州素有“花城”之称，拥有长隆系列主题景区及野生动物世界。"],["粤菜","广州以蒸制点心和新鲜海鲜等粤式美食闻名。"]],"cities":[["佛山","家具、家居用品、陶瓷和大理石。","广佛地铁或配司机的汽车","西塱（西塱）地铁换乘站","乘地铁到佛山市中心约一小时，具体取决于目的地；部分地点更近。"],["东莞","电子产品、玩具和各类制造业。","高铁或城际列车","广州东站或广州南站，视目的地车站而定","不少列车约需20—60分钟，具体取决于车站。"],["深圳","科技、电子产品和手机市场。","高铁","广州南站 → 深圳北站","部分列车约需30—55分钟。"],["珠海","滨海旅游及前往澳门的门户。","城际列车","广州南站 → 珠海站","通常约60—90分钟，也有更快或更慢的车次。"],["香港","购物、旅游及金融中心。","跨境高铁","广州南站 → 香港西九龙站","部分车次约47—80分钟，另需考虑通关手续。"],["义乌","礼品、配饰和小商品批发市场。","火车或合适的航班","根据预订从广州南站或广州白云机场出发","无统一的固定时间，请查询实际班次。"]],"tips":[["高速铁路","城际出行的便利选择。按需提前通过12306或Trip.com查询班次，并使用护照信息预订。"],["城际巴士","部分周边城市可能有巴士服务；出行前请确认乘车地点及班次。"],["包车出行","在佛山参观分布较广的家具展厅时，配司机的汽车可能更方便。"]],"head1":"一、广州特色","head2":"二、周边城市及交通方式","head3":"出行小贴士","table":["城市","特色","交通方式","出发地点","大约时间"],"mobile":["特色：","交通：","出发地点：","时间："],"caveat":"提示：所列时间仅为部分服务的估算，并非保证的时刻表。实际行程取决于车站、目的地和班次，且不包含酒店接驳及过关手续。出发前请查询12306或运营商信息。"}};
  const localized=infoTranslation[lang];
  if(localized){infoData.lead=localized.lead;infoData.features=infoData.features.map((x,i)=>[x[0],...localized.features[i]]);infoData.cities=infoData.cities.map((x,i)=>[localized.cities[i][0],x[1],...localized.cities[i].slice(1)]);infoData.tips=infoData.tips.map((x,i)=>[x[0],...localized.tips[i]]);}
  const container=element('div','gz-info-detail');container.dir=lang==='ar'?'rtl':'ltr';container.lang=lang;
  container.append(element('div','gz-info-intro',infoData.lead));
  const layout=element('div','gz-info-layout');const nearbyCol=element('div','gz-info-column');const highlightsCol=element('div','gz-info-column');
  function panel(parent,icon,title){const p=element('section','gz-info-panel-block');p.append(element('h3','gz-info-title',icon+' '+title));parent.append(p);return p}
  const highlights=panel(highlightsCol,'⭐',localized?localized.head1:'أولاً: أهم ما تشتهر به غوانزو');const feats=element('div','gz-feature-list');
  infoData.features.forEach(([icon,title,description])=>{const item=element('article','gz-feature');item.append(element('span','gz-feature-icon',icon));const body=element('div');body.append(element('h4','',title),element('p','',description));item.append(body);feats.append(item)});highlights.append(feats);
  const near=panel(nearbyCol,'🚄',localized?localized.head2:'ثانيًا: المدن المحيطة ووسائل الوصول');
  const table=element('table','gz-cities-table');const thead=element('thead');const hrow=element('tr');(localized?localized.table:['المدينة','بماذا تشتهر؟','المواصلات','نقطة الانطلاق','المدة التقريبية']).forEach(c=>hrow.append(element('th','',c)));thead.append(hrow);table.append(thead);const tbody=element('tbody');
  const mobile=element('div','gz-info-cards-mobile');
  infoData.cities.forEach(([ar,en,known,mode,departure,duration])=>{
    const tr=element('tr');const city=element('td');city.append(document.createTextNode(ar),element('small','',en));tr.append(city);[known,mode,departure,duration].forEach(v=>tr.append(element('td','',v)));tbody.append(tr);
    const item=element('article','gz-near-city');item.append(element('h4','',ar+' — '+en));const dl=element('dl');[[localized?localized.mobile[0]:'تشتهر بـ: ',known],[localized?localized.mobile[1]:'المواصلات: ',mode],[localized?localized.mobile[2]:'نقطة الانطلاق: ',departure],[localized?localized.mobile[3]:'المدة: ',duration]].forEach(([label,value])=>{const row=element('div');row.append(element('dt','',label),element('dd','',value));dl.append(row)});item.append(dl);mobile.append(item);
  });table.append(tbody);near.append(table,mobile);
  const tips=panel(nearbyCol,'💡',localized?localized.head3:'نصائح سريعة للتنقل');const grid=element('div','gz-tip-grid');infoData.tips.forEach(([icon,title,description])=>{const item=element('article','gz-tip');item.append(element('span','tip-icon',icon),element('h4','',title),element('p','',description));grid.append(item)});tips.append(grid);
  layout.append(highlightsCol,nearbyCol);container.append(layout);
  container.append(element('div','gz-info-caveat',localized?localized.caveat:'تنبيه: المدد تقديرية لبعض الخدمات وليست مواعيد مضمونة. وقت الوصول الفعلي يعتمد على المحطات والوجهة والخدمة المختارة، ولا يشمل الانتقال من الفندق أو الإجراءات الحدودية. تحقّق من 12306 أو جهة التشغيل قبل السفر.'));
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
  for(const filter of ['الكل',...filterNames,'❤️ المفضلة']){const pill=element('button','gz-pill'+(selectedFilter===filter?' active':'')+(filter==='❤️ المفضلة'?' by2-fav-pill':''));pill.type='button';pill.setAttribute('aria-pressed',String(selectedFilter===filter));pill.append(element('span','gz-filter-icon',(filter==='❤️ المفضلة'?'♥':filterIcon(filter))),element('span','gz-filter-label',filter==='الكل'?m.all:(window.BY2_L10N?.term(filter)||filter)));pill.addEventListener('click',()=>{selectedFilter=filter;selectedCafeTag='الكل';pageSize=32;renderListings()});pills.append(pill)}
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
  function updateGrid(){const q=clean(localSearch);const filtered=source.filter(r=>(selectedFilter==='الكل'||(selectedFilter==='❤️ المفضلة'&&window.BY2_FAVORITES.isSaved('guangzhou',r.id))||subtypeFor(r,activeSectionId)===selectedFilter)&&(selectedCafeTag==='الكل'||(Array.isArray(r.cafeTags)&&r.cafeTags.includes(selectedCafeTag)))&&(!q||[r.ar,r.en,r.zh,r.addressZh,r.addressEn,r.metro,r.note,r.subtype,r.addressAr,...(r.searchAliases||[])].some(v=>clean(v).includes(q))));
   counter.textContent=m.found+': '+filtered.length;grid.replaceChildren();pager.replaceChildren();filtered.slice(0,pageSize).forEach(r=>grid.append(recordCard(r)));
   if(!filtered.length)grid.append(element('div','gz-empty',selectedFilter==='❤️ المفضلة'?(window.BY2_L10N?.term('لم تقم بإضافة أماكن إلى المفضلة بعد ❤️')||'لم تقم بإضافة أماكن إلى المفضلة بعد ❤️'):m.noResult));
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
 window.BY2_FAVORITES.subscribe(()=>{if(state.kind==='section'&&state.city===0)renderListings()});
 searchNow=function(){baseSearch();if(!window.BY3_GUANGZHOU)return;const term=clean(document.getElementById('searchInput').value);if(!term||term.length<2)return;
  const matches=store.items.filter(r=>[r.ar,r.en,r.zh,r.addressZh,r.addressEn,r.metro,r.subtype,r.addressAr,...(r.searchAliases||[])].some(v=>clean(v).includes(term))).slice(0,32);
  const out=document.getElementById('searchResults');if(matches.length){const heading=element('p','',ui[lang].searchMatches+' ('+matches.length+(matches.length===32?'+':'')+')');out.append(heading)}
  matches.forEach(r=>{const b=element('button','',name(r)+' — '+(sections.find(s=>s.id===r.section)||{}).ar);b.type='button';b.addEventListener('click',()=>{search(false);highlighted=r.id;navigate({kind:'section',city:0,section:r.section});});out.append(b)});
 };
 document.getElementById('searchInput').addEventListener('input',()=>searchNow());
 renderRoute();
})();
