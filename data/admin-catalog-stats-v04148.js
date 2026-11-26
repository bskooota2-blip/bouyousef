/* V041.48: catalog counts only in the server-verified administrator account UI. */
(()=>{'use strict';
 const panel=document.getElementById('by48CatalogStats');
 if(!panel)return;
 const fields=[['markets','الأسواق'],['malls','المجمعات'],['dining','المطاعم والكافيهات'],['tourism','السياحة'],['hotels','الفنادق'],['transport','المواصلات'],['mosques','المساجد']];
 const el=(tag,txt,cls)=>{const n=document.createElement(tag);if(txt!==undefined)n.textContent=String(txt);if(cls)n.className=cls;return n};
 function refresh(){
  panel.hidden=true;panel.replaceChildren();
  const editor=window.BY43_EDITORIAL,index=window.BY2_SEARCH_INDEX;
  if(window.BY41_IS_MEMBER!==true||editor?.role()!=='admin'||!index)return;
  // Only public, searchable places. Each city/ID is unique in the total;
  // a record in multiple sections is counted once per section.
  const all=index.records();
  const rows=cities.map(c=>{
   const records=all.filter(r=>r.slug===c.slug),unique=index.unique(records);
   return {name:c.ar,total:unique.length,counts:fields.map(([id])=>index.unique(records.filter(r=>r.section===id)).length),recommended:unique.filter(r=>r.recommended).length,notes:unique.filter(r=>r.editorialNote).length};
  });
  const sum=k=>rows.reduce((a,r)=>a+r[k],0),bySection=fields.map((_,i)=>rows.reduce((a,r)=>a+r.counts[i],0));
  panel.append(el('h3','📊 إحصاءات دليل المدن'));
  const summary=el('div',undefined,'by48-summary');
  const stat=(label,value)=>{const d=el('div',undefined,'by48-stat');d.append(el('span',label),el('strong',value));summary.append(d)};
  stat('المدن',rows.length);stat('إجمالي الأماكن',sum('total'));fields.forEach((f,i)=>stat(f[1],bySection[i]));stat('أهم الأماكن',sum('recommended'));stat('أماكن عليها ملاحظات',sum('notes'));
  panel.append(summary);
  const scroll=el('div',undefined,'by48-scroll'),table=el('table'),head=el('thead'),body=el('tbody'),foot=el('tfoot');
  function row(parent,values,heading=false){const r=el('tr');values.forEach(v=>{const cell=el(heading?'th':'td',v);if(heading)cell.scope='col';r.append(cell)});parent.append(r)}
  row(head,['المدينة','إجمالي الأماكن',...fields.map(f=>f[1]),'أهم الأماكن','الملاحظات'],true);
  rows.forEach(r=>row(body,[r.name,r.total,...r.counts,r.recommended,r.notes]));row(foot,['الإجمالي',sum('total'),...bySection,sum('recommended'),sum('notes')]);
  table.append(head,body,foot);scroll.append(table);panel.append(scroll,el('p','الإجمالي يحسب المكان مرة واحدة، وقد يظهر المكان في أكثر من قسم. لا تشمل هذه الإحصاءات السجلات المخفية أو بطاقة المدير الخاصة.'));
  panel.hidden=false;
 }
 document.addEventListener('by43-editorial-changed',refresh);
 document.addEventListener('by41-auth-changed',refresh);
 document.addEventListener('DOMContentLoaded',refresh);
 refresh();
})();
