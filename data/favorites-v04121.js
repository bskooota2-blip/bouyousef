/* BouYousef 2 V041.21.0 — member-scoped Favorites. No service-role keys. */
(function(){'use strict';
 const URL='https://nzukdiswtjrxitehkkak.supabase.co';
 const KEY='sb_publishable_ZgUs-S8xlCKC62GQFZXpnQ_XwxRqwcO';
 const AUTH_KEY='bouyousef2_auth_session';
 const listeners=new Set();
 let uid=null, items=new Set(), pending={}, seq=0, syncing=false, loading=false;
 const storeKey=u=>'by2_favorites_v04121_'+u;
 const queueKey=u=>'by2_favorites_queue_v04121_'+u;
 const safeRead=(k,otherwise)=>{try{const s=localStorage.getItem(k);return s?JSON.parse(s):otherwise}catch(_){return otherwise}};
 const saved=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(_){return false}};
 const key=(city,id)=>String(city)+':'+String(id);
 const authenticated=()=>{try{const s=safeRead(AUTH_KEY,null);return s?.user?.id && s.access_token && window.BY41_IS_MEMBER ? s:null}catch(_){return null}};
 const notify=()=>{for(const fn of listeners){try{fn()}catch(e){console.error('Favorites display error',e)}}};
 const message=(t)=>{let el=document.getElementById('by2FavNotice');if(!el){el=document.createElement('div');el.id='by2FavNotice';el.setAttribute('role','status');el.setAttribute('aria-live','polite');document.body.append(el)}el.textContent=t;el.hidden=false;clearTimeout(message.timer);message.timer=setTimeout(()=>el.hidden=true,3800)};
 function loadUser(){const s=authenticated(),next=s?String(s.user.id):null;if(next===uid)return !!uid;uid=next;seq++;items=new Set();pending={};if(uid){items=new Set(safeRead(storeKey(uid),[]).filter(v=>typeof v==='string'));pending=safeRead(queueKey(uid),{});if(!pending||typeof pending!=='object'||Array.isArray(pending))pending={};}notify();if(uid&&navigator.onLine)refresh();return !!uid}
 function headers(token){return {'apikey':KEY,'Authorization':'Bearer '+token,'Content-Type':'application/json'}}
 function valid(){const s=authenticated();return s&&String(s.user.id)===uid?s:null}
 const isSaved=(city,id)=>{loadUser();return !!uid&&items.has(key(city,id))};
 function setLocal(k,add){if(add)items.add(k);else items.delete(k);pending[k]={add,at:Date.now()};saved(storeKey(uid),[...items]);saved(queueKey(uid),pending);notify()}
 function toggle(city,id){if(!loadUser()){message('سجّل الدخول أولاً لحفظ الأماكن في مفضلتك.');return}const k=key(city,id);if(!String(id||'').trim()){message('هذا المكان لا يحمل معرّفاً ثابتاً.');return}setLocal(k,!items.has(k));if(navigator.onLine)sync()}
 async function request(path,options={}){const s=valid();if(!s)throw Error('جلسة العضو غير متاحة');const r=await fetch(URL+'/rest/v1/'+path,{...options,headers:{...headers(s.access_token),...(options.headers||{})},cache:'no-store'});if(!r.ok)throw Error('Favorites HTTP '+r.status);return r.status===204?null:r.json()}
 async function refresh(){if(!uid||loading||!navigator.onLine)return;const startUid=uid,stamp=seq;loading=true;try{const rows=await request('user_favorites?select=place_id&order=created_at.asc');if(startUid!==uid||stamp!==seq)return;const fromCloud=new Set(rows.map(x=>String(x.place_id)));for(const [k,op] of Object.entries(pending)){if(op?.add)fromCloud.add(k);else fromCloud.delete(k)}items=fromCloud;saved(storeKey(uid),[...items]);notify();await sync();}catch(e){console.info('Favorites sync requires SQL setup / active connection:',e.message)}finally{loading=false}}
 async function sync(){if(syncing||!navigator.onLine||!valid())return;syncing=true;const currentUser=uid;try{for(const [k,op] of Object.entries({...pending})){if(!valid()||uid!==currentUser)break;if(!op||!Number.isFinite(op.at))continue;try{if(op.add){await request('user_favorites?on_conflict=user_id,place_id',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify({user_id:uid,place_id:k})})}else{await request('user_favorites?place_id=eq.'+encodeURIComponent(k),{method:'DELETE',headers:{Prefer:'return=minimal'}})}if(uid===currentUser && pending[k]?.at===op.at){delete pending[k];saved(queueKey(uid),pending)}}catch(e){console.info('Favorites pending synchronization:',e.message);break}}}finally{syncing=false}}
 function addHeart(card,r,city){if(!r?.id || !card)return card;const header=card.querySelector('.gz-place-main h3');if(!header)return card;const wrap=document.createElement('div');wrap.className='by2-fav-title';header.parentNode.insertBefore(wrap,header);wrap.append(header);const btn=document.createElement('button');btn.type='button';btn.className='by2-fav-heart';const update=()=>{const selected=isSaved(city,r.id);btn.textContent=selected?'♥':'♡';btn.classList.toggle('is-saved',selected);btn.setAttribute('aria-pressed',String(selected));btn.title=selected?'إزالة من المفضلة':'إضافة إلى المفضلة';btn.setAttribute('aria-label',(selected?'إزالة من المفضلة: ':'إضافة للمفضلة: ')+(r.ar||r.en||r.zh||''))};update();btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggle(city,r.id);update()});wrap.append(btn);return card}
 const subscribe=fn=>{listeners.add(fn);return()=>listeners.delete(fn)};
 window.BY2_FAVORITES={isSaved,toggle,addHeart,subscribe,refresh,sync};
 document.addEventListener('by41-auth-changed',()=>loadUser());window.addEventListener('online',()=>{loadUser();refresh()});
 window.addEventListener('storage',e=>{if(e.key===AUTH_KEY){loadUser();return}if(uid&&(e.key===storeKey(uid)||e.key===queueKey(uid))){items=new Set(safeRead(storeKey(uid),[]));pending=safeRead(queueKey(uid),{});notify()}});
})();
