/* BouYousef 3 V037: isolated exhibitions UI - no changes to other services. */
(function(){
 const page=document.getElementById('by37ExhibitionsPage');if(!page)return;
 const data=window.BY3_EXHIBITIONS_2026||[];
 const city=document.getElementById('by37City'),month=document.getElementById('by37Month'),kind=document.getElementById('by37Category'),query=document.getElementById('by37Search'),rows=document.getElementById('by37Rows'),cards=document.getElementById('by37Cards'),count=document.getElementById('by37Count');
 const collator=new Intl.Collator('ar');
 const currentDate=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const toDate=n=>n+'T00:00:00';
 const normal=s=>String(s||'').toLowerCase().normalize('NFKC').replace(/[\u064b-\u065f]/g,'').trim();
 function status(d){return currentDate>d.end?'انتهى':currentDate<d.start?'قادم':'جارٍ الآن'}
 function opt(select,values,label){select.append(new Option(label,''));values.forEach(v=>select.append(new Option(v,v)))}
 opt(city,[...new Set(data.map(e=>e.city))].sort(collator.compare),'كل المدن');opt(kind,[...new Set(data.map(e=>e.category))].sort(collator.compare),'كل الأنشطة');
 const months=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];month.append(new Option('كل الشهور',''));months.forEach((m,i)=>month.append(new Option(m,String(i+1).padStart(2,'0'))));
 const e=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n};
 function source(d){const a=e('a','by37-link','المصدر / موقع المعرض');a.href=d.source;a.target='_blank';a.rel='noopener noreferrer';return a}
 function render(){const q=normal(query.value);const result=data.filter(d=>(!city.value||d.city===city.value)&&(!kind.value||d.category===kind.value)&&(!month.value||d.start.slice(5,7)===month.value||d.end.slice(5,7)===month.value)&&(!q||[d.title,d.category,d.city,d.venue].some(x=>normal(x).includes(q))));rows.replaceChildren();cards.replaceChildren();result.forEach((d,i)=>{const tr=e('tr');let td=e('td','',String(i+1));tr.append(td);for(const v of [d.category,d.start,d.end,d.city]){td=e('td','',v);tr.append(td)}td=e('td');td.append(e('div','by37-title',d.title),e('div','by37-venue',d.venue||'الموقع الدقيق غير مؤكد'),e('span','by37-status '+(d.verification==='مراجعة'?'review':''),d.verification==='مراجعة'?'موعد بحاجة لإعادة تأكيد':'موعد منشور'),e('span','by37-status',status(d)),source(d));tr.append(td);rows.append(tr);
 const c=e('article','by37-card');c.append(e('div','by37-status',String(i+1)+' · '+status(d)),e('h3','',d.title));[['المحتوى',d.category],['المدينة',d.city],['البداية',d.start],['النهاية',d.end],['المكان',d.venue||'غير مؤكد']].forEach(([k,v])=>{const p=e('p');p.append(e('strong','',k+': '),document.createTextNode(v));c.append(p)});c.append(e('span','by37-status '+(d.verification==='مراجعة'?'review':''),d.verification==='مراجعة'?'الموعد بحاجة إلى تأكيد':'موعد منشور'),e('div'),source(d));cards.append(c)});if(!result.length){const p=e('div','by37-noresults','لا توجد معارض مطابقة للفلاتر المحددة.');cards.append(p);const tr=e('tr');const td=e('td','',p.textContent);td.colSpan=6;tr.append(td);rows.append(tr)}count.textContent='عدد النتائج: '+result.length+' من '+data.length+' فعالية مدرجة';}
 [city,month,kind].forEach(el=>el.addEventListener('change',render));query.addEventListener('input',render);document.getElementById('by37Reset').addEventListener('click',()=>{city.value='';month.value='';kind.value='';query.value='';render()});const homeAction=()=>{if(typeof navigate==='function')navigate({kind:'home'});else location.hash='#home'};
 document.getElementById('by37Home').addEventListener('click',homeAction);
 document.getElementById('by37BottomHome').addEventListener('click',homeAction);
 const floatTop=document.getElementById('by37FloatingTop');
 const exhibitionTop=()=>Math.max(0,page.getBoundingClientRect().top+window.scrollY-16);
 const scrollToExhibitionTop=()=>window.scrollTo({top:exhibitionTop(),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 document.getElementById('by37BottomTop').addEventListener('click',scrollToExhibitionTop);
 floatTop.addEventListener('click',scrollToExhibitionTop);
 // Only one floating control; invisible outside exhibitions and near its beginning.
 const syncFloating=()=>{floatTop.hidden=page.hidden||window.scrollY<=exhibitionTop()+230};
 window.addEventListener('scroll',syncFloating,{passive:true});
 window.addEventListener('resize',syncFloating,{passive:true});
 new MutationObserver(syncFloating).observe(page,{attributes:true,attributeFilter:['hidden']});
 window.by37ExhibitionsRender=render;render();syncFloating();
})();
