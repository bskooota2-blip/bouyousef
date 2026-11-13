/* BouYousef 2 optional, user-triggered public static offline cache v041.20.0 */
const OFFLINE_CACHE='by2-public-offline-v04120';
const SCOPE=new URL(self.registration.scope);
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
const request=event.request;if(request.method!=='GET')return;
const u=new URL(request.url);
if(u.origin!==SCOPE.origin||!u.pathname.startsWith(SCOPE.pathname))return;
// Never intercept auth, API, admin, password-reset or Supabase traffic.
if(/(^|\/)(api|auth|supabase|admin)(\/|$)/i.test(u.pathname)||/reset-password/i.test(u.pathname))return;
const lookup=new URL(u.pathname,SCOPE.origin).href;
event.respondWith((async()=>{
const cache=await caches.open(OFFLINE_CACHE);
// Network first for regular online requests, offline uses only explicitly downloaded public files.
try{const network=await fetch(request);return network;}catch(err){const cached=await cache.match(lookup)||await cache.match(request,{ignoreSearch:true})||(request.mode==='navigate'&&u.pathname===SCOPE.pathname?await cache.match(new URL('index.html',SCOPE).href):null);if(cached)return cached;
if(request.mode==='navigate'){return new Response('<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>بويوسف ٢ — دون إنترنت</title><body style="font-family:system-ui;padding:30px;text-align:center"><h2>أنت دون اتصال بالإنترنت</h2><p>لم تُحفظ هذه الصفحة على جهازك. افتح الموقع عند توفر الإنترنت واضغط «تحميل دليل الصين للاستخدام دون إنترنت».</p></body></html>',{headers:{'Content-Type':'text/html; charset=utf-8'},status:503});}
throw err;}
})());
});