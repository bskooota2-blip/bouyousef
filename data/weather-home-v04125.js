/* BouYousef 2 — Weather for the existing homepage. No geolocation or API keys. */
(function () {
  'use strict';
  var root = document.getElementById('by2WeatherHome');
  if (!root) return;
  var cities = [
    {key:'guangzhou',name:'غوانزو',lat:23.1291,lon:113.2644},
    {key:'shanghai',name:'شنغهاي',lat:31.2304,lon:121.4737},
    {key:'beijing',name:'بكين',lat:39.9042,lon:116.4074},
    {key:'shenzhen',name:'شينزن',lat:22.5431,lon:114.0579},
    {key:'foshan',name:'فوشان',lat:23.0215,lon:113.1214},
    {key:'yiwu',name:'إيوو',lat:29.3064,lon:120.0752},
    {key:'guilin',name:'قويلين',lat:25.2742,lon:110.2900},
    {key:'yangshuo',name:'يانغشوو',lat:24.7808,lon:110.4966},
    {key:'zhangjiajie',name:'جانغجياجيه',lat:29.1171,lon:110.4792},
    {key:'chongqing',name:'تشونغتشينغ',lat:29.5630,lon:106.5516},
    {key:'hainan',name:'جزيرة هاينان (هايكو)',lat:20.0442,lon:110.1999}
  ];
  var track = root.querySelector('#by2WeatherTrack');
  var status = root.querySelector('#by2WeatherStatus');
  var refresh = root.querySelector('#by2WeatherRefresh');
  var modal = root.querySelector('#by2WeatherDialog');
  var cards = Object.create(null);
  var dataByCity = Object.create(null);
  var inFlight = Object.create(null);
  var cacheAge = 45 * 60 * 1000;
  var openingIndex = 0;
  var stamp = 0;

  function setText(node,value){if(node) node.textContent=String(value);}
  function weatherSymbol(code,desc){
    var n=Number(code),t=String(desc||'').toLowerCase();
    if([200,386,389,392,395].indexOf(n)>=0||/thunder|عاصف|رعد/.test(t))return '⛈️';
    if([227,230,323,326,329,332,335,338,368,371,392,395].indexOf(n)>=0||/snow|ثلج/.test(t))return '❄️';
    if([143,248,260].indexOf(n)>=0||/fog|mist|ضباب/.test(t))return '🌫️';
    if(n>=176&&n!==179||/rain|drizzle|showers|مطر/.test(t))return '🌧️';
    if(n===122||/overcast/.test(t))return '☁️';
    if(n===119||/cloudy/.test(t))return '☁️';
    if(n===116||/partly/.test(t))return '🌤️';
    return '☀️';
  }
  function shortDesc(code){
    var n=Number(code);
    if([200,386,389,392,395].indexOf(n)>=0)return 'رعدية';
    if([227,230,323,326,329,332,335,338,368,371].indexOf(n)>=0)return 'ثلوج';
    if([143,248,260].indexOf(n)>=0)return 'ضباب';
    if(n>=176&&n!==179)return 'أمطار محتملة';
    if(n===122)return 'غائم جدًا';
    if(n===119)return 'غائم';
    if(n===116)return 'غائم جزئيًا';
    if(n===113)return 'صحو';
    return 'حالة الطقس';
  }
  function make(tag,cls){var el=document.createElement(tag);if(cls)el.className=cls;return el;}
  function cached(city){
    try {
      var raw=sessionStorage.getItem('by2-weather-2026-'+city.key);
      if(!raw)return null;
      var record=JSON.parse(raw);
      return record&&Date.now()-record.stamp<cacheAge&&record.data?record.data:null;
    }catch(_e){return null;}
  }
  function save(city,data){
    try {sessionStorage.setItem('by2-weather-2026-'+city.key,JSON.stringify({stamp:Date.now(),data:data}));}catch(_e){}
  }
  function normalize(data){
    var current=data&&data.current_condition&&data.current_condition[0];
    var forecasts=data&&data.weather;
    if(!current||!Array.isArray(forecasts)||forecasts.length<3||!Number.isFinite(Number(current.temp_C)))throw Error('Bad weather response');
    var items=forecasts.slice(0,3).map(function(day){
      var hourly=Array.isArray(day.hourly)?day.hourly:[];
      var middle=hourly[Math.floor(hourly.length/2)]||{};
      return {date:String(day.date||''),low:Number(day.mintempC),high:Number(day.maxtempC),code:Number(middle.weatherCode||current.weatherCode)};
    });
    return {temp:Number(current.temp_C),humidity:Number(current.humidity),wind:Number(current.windspeedKmph),code:Number(current.weatherCode),days:items};
  }
  function paint(city,message){
    var card=cards[city.key],data=dataByCity[city.key];
    if(!card)return;
    setText(card.querySelector('.by2-w-city'),city.name);
    setText(card.querySelector('.by2-w-icon'),data?weatherSymbol(data.code):message==='error'?'⚠️':'🌤️');
    setText(card.querySelector('.by2-w-temp'),data?Math.round(data.temp)+'°C':'—');
    setText(card.querySelector('.by2-w-desc'),data?shortDesc(data.code):message==='error'?'الطقس غير متاح':'جارِ التحديث…');
    card.setAttribute('aria-label',city.name+(data?'، '+Math.round(data.temp)+' درجة مئوية، افتح التفاصيل':'، '+(message==='error'?'البيانات غير متاحة':'جار تحميل الطقس')));
    card.disabled=false;
  }
  function load(city,force){
    if(inFlight[city.key])return inFlight[city.key];
    if(!force&&dataByCity[city.key])return Promise.resolve(dataByCity[city.key]);
    var prev=!force?cached(city):null;
    if(prev){dataByCity[city.key]=prev;paint(city);return Promise.resolve(prev);}
    if(!dataByCity[city.key])paint(city,'loading');
    var controller=new AbortController();
    var timer=setTimeout(function(){controller.abort();},14000);
    var url='https://wttr.in/'+encodeURIComponent(city.lat+','+city.lon)+'?format=j1';
    inFlight[city.key]=fetch(url,{signal:controller.signal,cache:'no-store'})
      .then(function(response){if(!response.ok)throw Error('Weather status '+response.status);return response.json();})
      .then(function(json){
        var result=normalize(json);
        dataByCity[city.key]=result;save(city,result);paint(city);
        stamp=Date.now();setText(status,'آخر تحديث: '+new Date(stamp).toLocaleTimeString('ar',{hour:'2-digit',minute:'2-digit'}));
        return result;
      })
      .catch(function(){if(!dataByCity[city.key])paint(city,'error');return null;})
      .finally(function(){clearTimeout(timer);delete inFlight[city.key];});
    return inFlight[city.key];
  }
  function dateLabel(date){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return 'اليوم';
    return new Intl.DateTimeFormat('ar',{weekday:'short',day:'numeric',month:'short'}).format(new Date(date+'T12:00:00'));
  }
  function openDetails(city){
    var title=modal.querySelector('#by2WeatherDialogTitle');
    var current=modal.querySelector('#by2WeatherDialogCurrent');
    var metrics=modal.querySelector('#by2WeatherDialogMetrics');
    var days=modal.querySelector('#by2WeatherDialogDays');
    setText(title,'الطقس في '+city.name);
    current.replaceChildren();metrics.replaceChildren();days.replaceChildren();
    if(typeof modal.showModal==='function'){if(!modal.open)modal.showModal();}
    else modal.setAttribute('open','');
    function line(el,value){var n=make('span');setText(n,value);el.appendChild(n);}
    function fill(data){
      if(!modal.open||!data||title.textContent!=='الطقس في '+city.name)return;
      current.replaceChildren();metrics.replaceChildren();days.replaceChildren();
      var ic=make('span','by2-w-big-icon');setText(ic,weatherSymbol(data.code));
      var info=make('div');var temp=make('span','by2-w-big-temp');setText(temp,Math.round(data.temp)+'°C');
      var description=make('div');setText(description,shortDesc(data.code));
      info.append(temp,description);current.append(ic,info);
      if(Number.isFinite(data.humidity))line(metrics,'💧 الرطوبة '+data.humidity+'٪');
      if(Number.isFinite(data.wind))line(metrics,'💨 الرياح '+data.wind+' كم/س');
      data.days.forEach(function(day){
        var box=make('div','by2-w-day'),name=make('strong'),icon=make('i'),range=make('small');
        setText(name,dateLabel(day.date));setText(icon,weatherSymbol(day.code));
        setText(range,(Number.isFinite(day.low)?Math.round(day.low):'—')+'° / '+(Number.isFinite(day.high)?Math.round(day.high):'—')+'°');
        box.append(name,icon,range);days.appendChild(box);
      });
    }
    var data=dataByCity[city.key];
    if(data)fill(data);
    else {setText(current,'جارِ تحميل بيانات الطقس…');load(city,false).then(function(result){if(result)fill(result);else if(modal.open&&title.textContent==='الطقس في '+city.name)setText(current,'تعذر تحميل الطقس حاليًا. حاول مرة أخرى لاحقًا.');});}
  }
  cities.forEach(function(city){
    var card=make('button','by2-w-card');card.type='button';
    card.setAttribute('role','listitem');
    card.innerHTML='<span class="by2-w-city"></span><span class="by2-w-icon" aria-hidden="true">🌤️</span><span class="by2-w-temp">—</span><span class="by2-w-desc">جارِ التحديث…</span>';
    cards[city.key]=card;track.append(card);paint(city,'loading');
    card.addEventListener('click',function(){openDetails(city);});
  });
  function go(step){
    openingIndex=Math.max(0,Math.min(cities.length-1,openingIndex+step));
    var card=cards[cities[openingIndex].key];
    if(card)card.scrollIntoView({behavior:'smooth',block:'nearest',inline:'start'});
    for(var i=openingIndex;i<Math.min(openingIndex+3,cities.length);i++)load(cities[i],false);
  }
  root.querySelector('#by2WeatherNext').addEventListener('click',function(){go(2);});
  root.querySelector('#by2WeatherPrev').addEventListener('click',function(){go(-2);});
  root.querySelector('#by2WeatherDialogClose').addEventListener('click',function(){if(typeof modal.close==='function')modal.close();else modal.removeAttribute('open');});
  modal.addEventListener('click',function(e){if(e.target===modal&&typeof modal.close==='function')modal.close();});
  refresh.addEventListener('click',function(){
    refresh.disabled=true;setText(status,'جارِ تحديث الطقس…');
    var active=cities.filter(function(c,index){return index<4||!!dataByCity[c.key];});
    Promise.all(active.map(function(c){return load(c,true);})).finally(function(){refresh.disabled=false;});
  });
  if('IntersectionObserver' in window){
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){if(entry.isIntersecting){var key=entry.target.dataset.city;var city=cities.find(function(c){return c.key===key;});if(city)load(city,false);}});
    },{root:track,threshold:0.2});
    cities.forEach(function(c){cards[c.key].dataset.city=c.key;observer.observe(cards[c.key]);});
  }
  cities.slice(0,4).forEach(function(c){load(c,false);});
  document.addEventListener('visibilitychange',function(){
    if(!document.hidden&&Date.now()-stamp>cacheAge)cities.slice(0,4).forEach(function(c){load(c,true);});
  });
  setInterval(function(){if(!document.hidden)cities.slice(0,4).forEach(function(c){load(c,true);});},cacheAge);
})();
