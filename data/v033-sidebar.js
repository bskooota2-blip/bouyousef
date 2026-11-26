(function(){'use strict';
const authUrl="https://nzukdiswtjrxitehkkak.supabase.co";
const publicKey="sb_publishable_ZgUs-S8xlCKC62GQFZXpnQ_XwxRqwcO";
const storeKey='bouyousef2_auth_session';
const $=id=>document.getElementById(id);
let session=null;
let mode='login';
let refreshInProgress=false;
const message=(txt,isError=false)=>{const el=$('by33AuthStatus');el.textContent=txt;el.classList.toggle('error',isError)};
function readableError(e){const v=String(e?.message||e||'');if(/invalid login credentials|invalid_grant/i.test(v))return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';if(/email not confirmed/i.test(v))return 'يرجى تأكيد البريد الإلكتروني أولًا.';if(/too many|rate limit|429/i.test(v))return 'محاولات كثيرة، يرجى إعادة المحاولة لاحقًا.';if(/network|failed to fetch/i.test(v))return 'تعذر الاتصال بخدمة الحسابات؛ تحقق من اتصال الإنترنت.';return 'تعذر إكمال العملية. '+v.slice(0,180)}
async function api(path,method='GET',payload=null,token=null){const headers={'apikey':publicKey,'Content-Type':'application/json'};if(token)headers.Authorization='Bearer '+token;const r=await fetch(authUrl+path,{method,headers,cache:'no-store',body:payload===null?undefined:JSON.stringify(payload)});const text=await r.text();let data;try{data=text?JSON.parse(text):{}}catch(_){data={message:text}}if(!r.ok)throw Error(data?.msg||data?.error_description||data?.message||data?.error||('HTTP '+r.status));return data;}
// Use the current in-memory authenticated session, never a stale localStorage copy.
window.BY41_EDITORIAL_TOKEN=()=>session?.access_token||null;
window.BY41_FETCH_GZ_MANAGER=()=>session?.access_token?api('/rest/v1/rpc/get_guangzhou_manager_centers_v1','POST',{},session.access_token):Promise.reject(new Error('يلزم تسجيل دخول المدير'));
function persist(s){try{if(s)localStorage.setItem(storeKey,JSON.stringify(s));else localStorage.removeItem(storeKey)}catch(_){}}
function displaySession(s){session=s||null;window.BY41_IS_MEMBER=Boolean(session?.access_token && session?.user);document.dispatchEvent(new CustomEvent('by41-auth-changed',{detail:{authenticated:window.BY41_IS_MEMBER}}));resetMembersPanel();const member=$('by33Member');member.hidden=!session;$('by33GuestContent').hidden=!!session;$('by33Admin').hidden=true;const label=$('by33SidebarLoginLabel');if(label){label.setAttribute('data-i18n','nav_login');label.textContent=document.documentElement.lang==='en'?'Sign in':document.documentElement.lang==='zh'?'登录':'تسجيل الدخول';}if(session){$('by33MemberEmail').textContent=session.user?.email||'عضو مسجّل';loadAdminStats();}else{$('by33MemberEmail').textContent='';$('by33AdminStats').replaceChildren();} }
function selectMode(m){mode=m;$('by33LoginForm').hidden=m!=='login';$('by33SignupForm').hidden=m!=='signup';$('by33RecoverForm').hidden=m!=='recover';$('by33ShowLogin').classList.toggle('is-active',m==='login');$('by33ShowSignup').classList.toggle('is-active',m==='signup');$('by33ShowLogin').setAttribute('aria-pressed',String(m==='login'));$('by33ShowSignup').setAttribute('aria-pressed',String(m==='signup'));message('');}
async function restore(){let saved=null;try{saved=JSON.parse(localStorage.getItem(storeKey)||'null')}catch(_){}if(!saved?.refresh_token){persist(null);displaySession(null);return}if(refreshInProgress)return;refreshInProgress=true;try{const renewed=await api('/auth/v1/token?grant_type=refresh_token','POST',{refresh_token:saved.refresh_token});if(!renewed?.access_token)throw Error('Invalid refresh');persist(renewed);displaySession(renewed)}catch(e){persist(null);displaySession(null);console.warn('BouYousef account refresh unavailable:',e.message)}finally{refreshInProgress=false}}
async function loadAdminStats(){if(!session?.access_token)return;const admin=$('by33Admin');admin.hidden=true;$('by33ShowMembers').hidden=true;resetMembersPanel();const target=$('by33AdminStats');target.replaceChildren();try{const data=await api('/rest/v1/rpc/get_visit_dashboard_v2','POST',{},session.access_token);if(!session)return;const x=Array.isArray(data)?data[0]:data;if(!x||!['today','week','month','total'].every(k=>typeof x[k]==='number'))return;admin.hidden=false;$('by33ShowMembers').hidden=false;const grid=document.createElement('div');grid.className='by33-statgrid';[['اليوم',x.today],['الأسبوع',x.week],['الشهر',x.month],['الإجمالي',x.total]].forEach(([k,v])=>{const el=document.createElement('div');el.className='by33-stat';const t=document.createElement('span');t.textContent=k;const n=document.createElement('strong');n.textContent=String(v);el.append(t,n);grid.append(el)});target.append(grid);const memberCard=document.createElement('div');memberCard.className='by33-stat';const mt=document.createElement('span');mt.textContent='الأعضاء المسجلون';const mn=document.createElement('strong');mn.textContent='—';memberCard.append(mt,mn);grid.append(memberCard);try{const count=await api('/functions/v1/member-count','GET',null,session.access_token);if(session?.access_token&&Number.isSafeInteger(count?.count)&&count.count>=0)mn.textContent=String(count.count);else mn.textContent='يلزم تفعيل العداد';}catch(err){mn.textContent='يلزم تفعيل العداد';memberCard.title='يجب نشر وظيفة member-count وتفعيل صلاحية المدير في Supabase';console.info('Member-count endpoint not ready:',err.message)}}catch(e){console.info('Admin-only statistics unavailable for this account:',e.message);admin.hidden=true}}
// V041.34: admin-only member directory. The edge function separately verifies allowlist permissions.
let membersCurrentPage=1;
let membersLoading=false;
function resetMembersPanel(){
  const panel=$('by33MembersPanel');if(!panel)return;
  panel.hidden=true;$('by33ShowMembers').setAttribute('aria-expanded','false');
  $('by33MembersRows').replaceChildren();$('by33MembersStatus').textContent='';
  $('by33MembersPrev').disabled=true;$('by33MembersNext').disabled=true;
  $('by33MembersPageLabel').textContent='';membersCurrentPage=1;
}
const dateOf=value=>{if(!value)return '—';const d=new Date(value);return Number.isFinite(d.getTime())?new Intl.DateTimeFormat('ar-KW',{year:'numeric',month:'2-digit',day:'2-digit'}).format(d):'—'};
async function loadMembersPage(page){
  if(membersLoading||!session?.access_token||$('by33Admin').hidden)return;
  membersLoading=true;
  const token=session.access_token;
  const status=$('by33MembersStatus');status.textContent='جارٍ تحميل بيانات الأعضاء...';
  $('by33MembersPrev').disabled=true;$('by33MembersNext').disabled=true;
  try{
    const response=await api('/functions/v1/member-directory?page='+encodeURIComponent(page),'GET',null,token);
    if(session?.access_token!==token||$('by33MembersPanel').hidden)return;
    if(!Array.isArray(response?.users))throw Error('invalid_response');
    const tbody=$('by33MembersRows');tbody.replaceChildren();
    for(const [i,u] of response.users.entries()){
      const tr=document.createElement('tr');
      const name=String(u.name||[u.first_name,u.last_name].filter(Boolean).join(' ')).trim()||'غير مسجل';
      const values=[String((page-1)*100+i+1),name,u.email||'—',dateOf(u.created_at),u.last_sign_in_at?dateOf(u.last_sign_in_at):'—',typeof u.email_confirmed==='boolean'?(u.email_confirmed?'مؤكد':'غير مؤكد'):'—'];
      values.forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.append(td)});
      tbody.append(tr);
    }
    membersCurrentPage=page;
    status.textContent=response.users.length?'تُعرض بيانات الأعضاء للمدير فقط.':'لا يوجد أعضاء في هذه الصفحة.';
    $('by33MembersPageLabel').textContent='صفحة '+page;
    $('by33MembersPrev').disabled=page<=1;
    $('by33MembersNext').disabled=!response.has_more;
  }catch(e){
    if(session?.access_token===token&&!$('by33MembersPanel').hidden){
      status.textContent='تعذر عرض الأعضاء. تأكد من اتصال وظيفة member-directory في Supabase ومن صلاحية المدير. ('+String(e.message).slice(0,90)+')';
    }
  }finally{membersLoading=false;}
}
$('by33ShowMembers').addEventListener('click',()=>{
  const panel=$('by33MembersPanel');panel.hidden=!panel.hidden;
  $('by33ShowMembers').setAttribute('aria-expanded',String(!panel.hidden));
  if(!panel.hidden)loadMembersPage(1);
});
$('by33CloseMembers').addEventListener('click',resetMembersPanel);
$('by33MembersPrev').addEventListener('click',()=>loadMembersPage(Math.max(1,membersCurrentPage-1)));
$('by33MembersNext').addEventListener('click',()=>loadMembersPage(membersCurrentPage+1));
$('by33ShowLogin').addEventListener('click',()=>selectMode('login'));
$('by33ShowSignup').addEventListener('click',()=>selectMode('signup'));
$('by33ForgotPassword').addEventListener('click',()=>{selectMode('recover');$('by33RecoverForm').elements.email.value=$('by33LoginForm').elements.email.value||''});
$('by33RecoverBack').addEventListener('click',()=>selectMode('login'));
$('by33LoginForm').addEventListener('submit',async e=>{e.preventDefault();const f=e.currentTarget;if(!f.reportValidity())return;const d=new FormData(f);message('جارٍ تسجيل الدخول...');try{const result=await api('/auth/v1/token?grant_type=password','POST',{email:String(d.get('email')).trim(),password:d.get('password')});if(!result.access_token)throw Error('لم تُنشأ جلسة');f.elements.password.value='';persist(result);displaySession(result);message('تم تسجيل الدخول بنجاح.')}catch(err){message(readableError(err),true)}});
$('by33SignupForm').addEventListener('submit',async e=>{e.preventDefault();const f=e.currentTarget;if(!f.reportValidity())return;const d=new FormData(f);if(d.get('password')!==d.get('confirm')){message('كلمتا المرور غير متطابقتين.',true);return}message('جارٍ إنشاء الحساب...');try{const result=await api('/auth/v1/signup','POST',{email:String(d.get('email')).trim(),password:d.get('password'),data:{first_name:String(d.get('first')).trim(),last_name:String(d.get('last')).trim()}});f.elements.password.value='';f.elements.confirm.value='';if(result.access_token){persist(result);displaySession(result);message('تم إنشاء الحساب وتسجيل الدخول بنجاح.')}else{selectMode('login');message('تم إرسال طلب التسجيل. تحقق من بريدك الإلكتروني إذا كانت خدمة تأكيد البريد مفعلة.')}}catch(err){message(readableError(err),true)}});
$('by33RecoverForm').addEventListener('submit',async e=>{e.preventDefault();const f=e.currentTarget;if(!f.reportValidity())return;message('جارٍ إرسال طلب الاستعادة...');const email=String(new FormData(f).get('email')).trim();const redirect=new URL('reset-password.html',document.baseURI).href;try{await api('/auth/v1/recover?redirect_to='+encodeURIComponent(redirect),'POST',{email});message('إذا كان البريد مسجّلًا وكانت إعدادات البريد ورابط العودة مفعّلة، ستصلك رسالة لاستعادة كلمة المرور.')}catch(err){message('تعذر طلب رابط الاستعادة: '+readableError(err),true)}});
$('by33Signout').addEventListener('click',async()=>{const old=session;session=null;persist(null);displaySession(null);message('تم تسجيل الخروج من هذه الصفحة.');if(old?.access_token){try{await api('/auth/v1/logout','POST',{},old.access_token)}catch(e){console.warn('Server logout unavailable; local session cleared',e.message)}}});
$('by33RefreshStats').addEventListener('click',loadAdminStats);
document.querySelectorAll('[data-by33-home]').forEach(b=>b.addEventListener('click',()=>{location.hash='#home'}));
// Updates: source file is intentionally editable by next versions.
const all=(window.BY33_UPDATES||[]).filter(x=>x&&/^\d{4}-\d{2}-\d{2}$/.test(x.date)&&x.id&&x.title&&x.category);const ids=new Set();const unique=all.filter(x=>{if(ids.has(x.id))return false;ids.add(x.id);return true}).sort((a,b)=>b.date.localeCompare(a.date));
const cats=[...new Set(unique.map(x=>x.category))];let active='الكل';
function renderUpdates(){const filter=$('by33UpdateFilters'),wrap=$('by33UpdateCards');filter.replaceChildren();wrap.replaceChildren();['الكل',...cats].forEach(name=>{const btn=document.createElement('button');btn.type='button';btn.textContent=name;btn.className=name===active?'is-active':'';btn.setAttribute('aria-pressed',String(name===active));btn.addEventListener('click',()=>{active=name;renderUpdates()});filter.append(btn)});const visible=unique.filter(x=>active==='الكل'||x.category===active);$('by33UpdateCount').textContent='عدد التحديثات: '+visible.length;visible.forEach(u=>{const card=document.createElement('article');card.className='by33-update';const meta=document.createElement('div');meta.className='by33-update-meta';meta.textContent=u.date+(u.city?' · '+u.city:'')+' · '+u.category;const head=document.createElement('h2');head.textContent=u.title;const desc=document.createElement('p');desc.textContent=u.description||'';card.append(meta,head,desc);if(/^#(service\/(arrival|login|updates)|city\/[a-z-]+\/[a-z-]+)$/.test(u.target||'')){const link=document.createElement('a');link.href=u.target;link.textContent='عرض القسم';card.append(link)}wrap.append(card)})}
renderUpdates();selectMode('login');displaySession(null);restore();
})();