(function(){'use strict';
const $=id=>document.getElementById(id),qr=$('by41WechatModal'),gate=$('by41MemberGate');let resume=null;let lastFocus=null;
function show(el){if(!el)return;lastFocus=document.activeElement;el.hidden=false;el.querySelector('button')?.focus();}
function close(el){if(!el)return;el.hidden=true;lastFocus?.focus?.();}
document.addEventListener('click',event=>{if(event.target.closest('[data-by41-wechat]')){show(qr);return;}const copy=event.target.closest('[data-by41-copy]');if(copy){const value=copy.dataset.by41Copy||'';if(navigator.clipboard?.writeText){navigator.clipboard.writeText(value).then(()=>{copy.title='تم النسخ'}).catch(()=>{window.prompt('انسخ البيانات:',value)})}else{window.prompt('انسخ البيانات:',value)}return;}if(event.target.closest('[data-by41-close]')){close(event.target.closest('.by41-modal'));return;}if(event.target.classList.contains('by41-modal'))close(event.target);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){close(qr);close(gate)}});
function member(){return Boolean(window.BY41_IS_MEMBER)}
function isProtectedHash(hash){return /^#city\/[^/]+\/[^/]+/.test(hash)||/^#service\/(arrival|apps|exchange|store)(?:\/|$)/.test(hash)}
function openGate(hash){if(member())return false;resume=hash;show(gate);return true}
window.BY41_SHOW_GATE=openGate;
$('by41GateLogin')?.addEventListener('click',()=>{close(gate);location.hash='#service/login';document.getElementById('by33ShowSignup')?.click()});
// Only interface gating. Static site public source assets remain publicly accessible.
const initial=()=>{if(!member()&&isProtectedHash(location.hash)){const intended=location.hash;location.hash='#home';openGate(intended)}};
document.addEventListener('by41-auth-changed',evt=>{document.body.classList.toggle('by41-guest-preview',!evt.detail.authenticated);if(evt.detail.authenticated&&resume){const to=resume;resume=null;close(gate);location.hash=to}else if(!evt.detail.authenticated){initial()}});
// Block clicks from guest users on gated section cards and nav links before navigation.
document.addEventListener('click',e=>{if(member())return;const anchor=e.target.closest('a[href^="#service/"]');if(anchor&&isProtectedHash(anchor.getAttribute('href'))){e.preventDefault();e.stopImmediatePropagation();openGate(anchor.getAttribute('href'));return;}const nav=e.target.closest('[data-section]');if(nav&&['arrival','apps','exchange','store'].includes(nav.dataset.section)){e.preventDefault();e.stopImmediatePropagation();openGate('#service/'+nav.dataset.section);return;}const section=e.target.closest('[data-section-id]');if(section&&location.hash.startsWith('#city/')){e.preventDefault();e.stopImmediatePropagation();openGate(location.hash+'/'+section.dataset.sectionId);return;}},true);
window.addEventListener('hashchange',()=>{if(!member()&&isProtectedHash(location.hash)){const wanted=location.hash;history.replaceState(history.state,'','#home');openGate(wanted);if(typeof window.renderRoute==='function')window.renderRoute('navigate')}});
setTimeout(initial,0);
})();
