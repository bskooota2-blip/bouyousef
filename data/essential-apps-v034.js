'use strict';
/* Scoped essential-apps guide V034, self-contained. Does not alter city data. */
(()=>{
  const all=window.BY3_ESSENTIAL_APPS;
  const mount=document.getElementById('by34AppMount');
  const page=document.getElementById('by34EssentialAppsPage');
  if(!all||!mount||!page)return;
  const meta={ar:{intro:'تطبيقات تساعدك في الصين — التنزيل والتسجيل والدفع والملاحة',home:'🏠 العودة إلى الرئيسية',apps:'↩️ التطبيقات المهمة',up:'⬆️ العودة للأعلى',step:'الخطوة',open:'عرض الدليل',image:'تكبير لقطة الشاشة',introNote:'أزلنا الرسوم غير الواقعية. تتوفر خطوات نصية وروابط لأدلة تعرض صورًا حقيقية على مواقع مصادرها؛ لم نحفظ أي صورة دون ترخيص واضح.',guide:'دليل الخطوات',topics:'اختر الشرح المطلوب',ios:'🍎 تحميل للآيفون',android:'▶ تحميل للأندرويد',sources:'مراجع وروابط رسمية',videos:'فيديوهات تم التحقق من وجودها',none:'لم يُحدد فيديو موثوق مناسب للإصدار الحالي؛ الشرح النصي متاح.',title:'📱 التطبيقات المهمة'},en:{intro:'China travel apps: setup, payments and navigation',home:'🏠 Home',apps:'↩️ All apps',up:'⬆️ Top',step:'Step',open:'Open guide',image:'Zoom real screenshot',introNote:'Unrealistic illustrations were removed. Text guides and links to externally hosted real screenshots are provided; no unlicensed screenshots were republished.',guide:'Step guide',topics:'Choose a guide',ios:'🍎 App Store',android:'▶ Google Play',sources:'Official resources',videos:'Verified videos',none:'No verified current video selected. Text guides are available.',title:'📱 Essential apps'},zh:{intro:'中国旅行常用应用：注册、支付与导航',home:'🏠 返回首页',apps:'↩️ 所有应用',up:'⬆️ 返回顶部',step:'步骤',open:'查看指南',image:'放大真实截图',introNote:'已移除非真实示意图。提供文字说明及原始资料中的真实截图链接；未转载未经许可的图片。',guide:'步骤指南',topics:'选择指南',ios:'🍎 App Store',android:'▶ Google Play',sources:'参考资料',videos:'已核验的视频',none:'暂无已核验的适用视频，提供文字步骤。',title:'📱 常用应用'}};
  let lastState='',modal=null;
  function mk(tag,cls,content){let x=document.createElement(tag);if(cls)x.className=cls;if(content!==undefined)x.textContent=content;return x}
  function btn(label,callback,cls=''){let b=mk('button','by34-btn '+cls,label);b.type='button';b.addEventListener('click',callback);return b}
  function link(label,url){const a=mk('a','by34-btn',label);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a}
  function currentLanguage(){try{return ['ar','en','zh'].includes(lang)?lang:'ar'}catch{return 'ar'}}
  function localText(l){return meta[l]||meta.ar}
  function goHome(){navigate({kind:'home'})}
  function goApps(){navigate({kind:'service',service:'apps'})}
  function goApp(id){navigate({kind:'service',service:'apps',app:id})}
  function goTopic(id,topic){navigate({kind:'service',service:'apps',app:id,topic})}
  function top(){window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
  function toolbar(l,appId){let bar=mk('nav','by34-toolbar');bar.setAttribute('aria-label','العودة والتصفح');bar.append(btn(localText(l).home,goHome));if(appId)bar.append(btn(localText(l).apps,goApps));bar.append(btn(localText(l).up,top));return bar}
  function hero(title,description){const h=mk('header','by34-hero');h.append(mk('h1','',title),mk('p','',description));return h}
  function downloads(parent,app,l){const d=mk('div','by34-link-grid');d.append(link(localText(l).ios,app.ios),link(localText(l).android,app.android));parent.append(d)}
  function identity(a,id){const head=mk('div','by34-app-head');const img=mk('img','by34-app-logo');img.src='assets/essential-apps/'+id+'-illustrative-symbol.svg';img.alt='رمز توضيحي للتطبيق وليس الشعار الرسمي';head.append(img);const names=mk('div','');names.append(mk('h2','',a.ar),mk('p','by34-english',a.en),mk('p','by34-chinese',a.zh));head.append(names);return head}
  function warning(s){return mk('p','by34-note by34-warning',s)}
  function sources(root,a,l){if(!a.sources?.length)return;root.append(mk('h2','by34-subhead',localText(l).sources));const list=mk('div','by34-link-grid');a.sources.forEach(([title,url])=>list.append(link('🔗 '+title,url)));root.append(list)}
  function videos(root,a,l){root.append(mk('h2','by34-subhead',localText(l).videos));if(!a.videos.length){root.append(warning(localText(l).none));return}const list=mk('div','by34-videos');a.videos.forEach(v=>{const card=mk('article','by34-video-card');card.append(link('🎬 '+v.title,v.url),mk('p','',v.note));list.append(card)});root.append(list)}
  function langNotice(l){if(l!=='ar')mount.append(warning(l==='en'?'Detailed guides are currently available in Arabic only; section labels are localized.':'详细操作说明目前仅提供阿拉伯语；部分导航标签已翻译。'))}
  function renderIndex(l){mount.append(hero(localText(l).title,localText(l).intro));mount.append(toolbar(l));langNotice(l);const grid=mk('div','by34-app-grid');for(const [id,a] of Object.entries(all)){const c=mk('article','by34-card');c.append(identity(a,id),mk('p','',a.sub));downloads(c,a,l);const row=mk('div','by34-link-grid');row.append(btn('📖 '+localText(l).open,()=>goApp(id),'primary'));c.append(row);grid.append(c)}mount.append(grid,warning(localText(l).introNote));}
  function renderApp(id,l){const a=all[id];if(!a)return renderIndex(l);mount.append(hero(a.ar+' – '+a.en,a.sub),toolbar(l,id));langNotice(l);const c=mk('article','by34-card');c.append(identity(a,id));downloads(c,a,l);mount.append(c);mount.append(mk('h2','by34-subhead',localText(l).topics));const choices=mk('div','by34-topic-grid');a.topics.forEach(t=>{const b=mk('button','by34-topic',t[1]);b.type='button';b.addEventListener('click',()=>goTopic(id,t[0]));choices.append(b)});mount.append(choices,warning(localText(l).introNote));videos(mount,a,l);sources(mount,a,l);}
  function openModal(src,alt){if(!modal){modal=mk('div','by34-modal');modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','تكبير لقطة الشاشة');const close=btn('✕ إغلاق الصورة',()=>{modal.hidden=true;document.body.style.overflow=''},'');const im=mk('img','');im.id='by34ModalImage';modal.append(close,im);modal.addEventListener('click',e=>{if(e.target===modal){modal.hidden=true;document.body.style.overflow=''}});document.body.append(modal)}const im=modal.querySelector('img');im.src=src;im.alt=alt;modal.hidden=false;document.body.style.overflow='hidden';modal.querySelector('button').focus()}
  // V034.1: Source-backed real-screen references; never claim external screenshots are local assets.
  const realGuideRefs={
    wechat:[['دليل حكومة شنغهاي المصور (2026) — تسجيل ويشات والمحادثات','https://english.shanghai.gov.cn/en-Individuals-MobileandInternet-Popularapps/20260826/ec599fbd5c7a4b5f907230f09eb28eb3.html']],
    amap:[['دليل AMAP الخارجي المصور — أمثلة شاشات حقيقية (راجع اختلاف الإصدارات)','https://dev.chinasurvival.com/en/guides/how-to-use-amap']]
  };
  function renderTopic(id,tid,l){
    const a=all[id],t=a?.topics.find(t=>t[0]===tid);
    if(!a||!t)return renderApp(id,l);
    mount.append(hero(t[1],a.ar+' — '+a.en),toolbar(l,id));langNotice(l);
    mount.append(warning(localText(l).introNote));
    if(id==='alipay'&&tid==='esim')mount.append(warning('شراء eSIM هنا موضّح عبر مزود مستقل. لا توجد خدمة موثقة ثابتة لشراء eSIM داخل Alipay نفسه.'));
    const list=mk('div','by34-step-list');
    t[2].forEach(([title,body],i)=>{
      const c=mk('article','by34-step');
      const topLine=mk('div','by34-step-top');
      topLine.append(mk('span','by34-step-num',String(i+1)),mk('h3','',title));
      c.append(topLine,mk('p','',body));
      // No fabricated application interface; steps lacking licensed screenshots remain text-only.
      list.append(c);
    });
    mount.append(list);
    const references=realGuideRefs[id]||[];
    if(references.length){
      mount.append(mk('h2','by34-subhead','📷 لقطات حقيقية على مواقع مصادرها'));
      mount.append(warning('هذه الروابط تفتح أدلة مصورة أصلية خارج بويوسف ٢. لم ننسخ الصور إلى الموقع بسبب عدم ثبوت إذن إعادة نشرها. قد تختلف الواجهة الحالية عن بعض الصور القديمة.'));
      const links=mk('div','by34-link-grid');references.forEach(([name,url])=>links.append(link('↗ '+name,url)));mount.append(links);
    }
    if(tid==='esim'&&a.sources)sources(mount,a,l);
    const foot=mk('div','by34-bottom');
    foot.append(btn(localText(l).up,top),btn('↩️ '+a.ar,()=>goApp(id)),btn(localText(l).apps,goApps),btn(localText(l).home,goHome));mount.append(foot);
  }
  window.by34Render=function(s){if(s.kind==='service'&&s.service==='apps'&&s.app==='alipay'&&s.topic==='register'){history.replaceState(history.state,'','#service/apps/alipay');s.topic=null;}if(s.kind!=='service'||s.service!=='apps'){if(modal&&!modal.hidden){modal.hidden=true;document.body.style.overflow=''}return}const l=currentLanguage();const key=[s.app||'',s.topic||'',l].join(':');if(lastState===key)return;lastState=key;mount.replaceChildren();if(!s.app)renderIndex(l);else if(s.topic)renderTopic(s.app,s.topic,l);else renderApp(s.app,l);document.documentElement.style.scrollBehavior='';};
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal&&!modal.hidden){modal.hidden=true;document.body.style.overflow=''}});
  // Re-render initially if the app guide is loaded via a direct URL.
  if(typeof state!=='undefined')window.by34Render(state);
  window.addEventListener('hashchange',()=>{if(!location.hash.startsWith('#service/apps'))lastState=''});
})();
