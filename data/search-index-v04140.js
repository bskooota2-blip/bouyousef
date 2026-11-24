/* V041.40: shared search for the current public city catalogs. */
'use strict';
(()=>{
 const norm=v=>String(v??'').normalize('NFKC').toLowerCase().replace(/[\u064b-\u065f\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[\p{P}\p{S}]+/gu,' ').replace(/\s+/g,' ').trim();
 const fields=['ar','en','zh','addressZh','addressEn','addressAr','metro','note','region','features','signatureDrink','sourceCategory','subtype','cafeTags','searchAliases','filterCategories','v0313Tags'];
 const sectionTitle=id=>(sections.find(s=>s.id===id)||{}).ar||id;
 function records(slug){
  const result=[],seen=new Set();
  cities.forEach((c,i)=>{
   if(slug&&slug!==c.slug)return;
   const items=c.slug==='guangzhou'?window.BY3_GUANGZHOU?.items:window.BY3_OTHER_CITIES?.cities?.[c.slug]?.items;
   for(const r of items||[]){
    if(!r||!r.ar||!r.section||r.excludeFromListing||r.section==='manager')continue;
    const views=c.slug==='guangzhou'&&Array.isArray(r.sections)&&r.sections.length?[...new Set(r.sections)]:[r.section];
    for(const section of views){
     if(section==='manager')continue;
     const key=c.slug+'|'+section+'|'+r.id;if(seen.has(key))continue;seen.add(key);
     const names=norm([r.ar,r.en,r.zh,r.searchAliases].flat(Infinity).filter(v=>typeof v==='string').join(' '));
     const sec=sections.find(s=>s.id===section)||{};
     const search=norm(fields.map(k=>r[k]).flat(Infinity).concat(c.ar,c.en,zhCity[i],sec.ar,sec.en,sec.zh).filter(v=>typeof v==='string').join(' '));
     result.push({type:'place',city:i,slug:c.slug,section,id:String(r.id),name:r.ar,ar:r.ar,en:r.en||'',zh:r.zh||'',description:r.note||r.features||r.signatureDrink||'',names,search});
    }
   }
  });return result;
 }
 function matches(row,q){const terms=norm(q).split(' ').filter(Boolean);return terms.length>0&&terms.every(t=>row.search.includes(t));}
 function score(row,q){const query=norm(q),terms=query.split(' ').filter(Boolean),name=norm(row.name||row.ar);return (row.type==='place'?10:0)+(name===query?90:0)+(name.startsWith(query)?30:0)+(terms.every(t=>(row.names||name).includes(t))?45:0);}
 function find(q,slug){return records(slug).filter(r=>matches(r,q)).sort((a,b)=>score(b,q)-score(a,q));}
 window.BY2_SEARCH_INDEX={norm,records,matches,score,find};
})();
