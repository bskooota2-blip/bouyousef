/* BouYousef V041.22.0: UI translations, retain factual source text. */
(function(){'use strict';
 const dic={
 'الكل':['All','全部'],'❤️ المفضلة':['❤️ Favorites','❤️ 收藏'],'المفضلة':['Favorites','收藏'],'عدد الأماكن':['Places','地点数量'],'ابحث داخل القسم...':['Search this section...','搜索本栏目...'],
 'العودة لأقسام المدينة':['Back to city sections','返回城市栏目'],'العودة إلى الرئيسية':['Back to home','返回首页'],
 'عرض المزيد':['Show more','显示更多'],'لم تقم بإضافة أماكن إلى المفضلة بعد ❤️':['No saved places yet ❤️','还没有收藏地点 ❤️'],
 'لا توجد مواقع في هذا القسم ضمن النسخة المصدر.':['No places listed in this category.','此栏目暂无地点。'],
 'لا توجد أماكن موثقة حاليًا لهذا التصنيف.':['No verified places in this category.','此分类暂无已核实地点。'],
 'الأسواق':['Markets','市场'],'المجمعات التجارية':['Shopping malls','购物中心'],'المطاعم والكافيهات':['Restaurants & cafés','餐厅与咖啡馆'],
 'الأماكن السياحية':['Attractions','旅游景点'],'الفنادق':['Hotels','酒店'],'المواصلات':['Transport','交通'],'المساجد':['Mosques','清真寺'],'معلومات المدينة':['City information','城市介绍'],
 'المطاعم العربية':['Arabic restaurants','阿拉伯餐厅'],'المطاعم التركية':['Turkish restaurants','土耳其餐厅'],'المطاعم الهندية':['Indian restaurants','印度餐厅'],
 'المطاعم الهندية والباكستانية':['Indian & Pakistani restaurants','印度及巴基斯坦餐厅'],'المطاعم الإيرانية':['Iranian restaurants','伊朗餐厅'],
 'المطاعم الأوروبية':['European restaurants','欧洲餐厅'],'المطاعم الأمريكية':['American restaurants','美式餐厅'],'المطاعم الصينية الحلال':['Halal Chinese restaurants','清真中餐'],
 'المطاعم الآسيوية الحلال':['Halal Asian restaurants','清真亚洲餐厅'],'المأكولات البحرية':['Seafood','海鲜'],'البيتزا':['Pizza','披萨'],
 'الكافيهات':['Cafés','咖啡馆'],'المخابز':['Bakeries','面包店'],'5 نجوم':['5 stars','五星'],'4 نجوم':['4 stars','四星'],'3 نجوم':['3 stars','三星'],
 'غير مصنفة':['Unrated','未评级'],'المطارات':['Airports','机场'],'محطات القطارات':['Train stations','火车站'],
 'نسائي':['Women','女装'],'رجالي':['Men','男装'],'أطفال':['Children','童装'],'تصفيات':['Clearance','清仓'],'جينز':['Jeans','牛仔'],
 'أنواع الكافيهات':['Café types','咖啡馆类型'],'أنواع المخابز':['Bakery types','面包店类型'],
 'العنوان الصيني':['Chinese address','中文地址'],'العنوان الإنجليزي':['English address','英文地址'],'المنطقة / وصف الموقع (عنوان غير تفصيلي)':['Area / location description (not a full address)','区域/位置描述（非详细地址）'],
 'المترو':['Metro','地铁'],'البضائع':['Products','商品'],'تم النسخ':['Copied','已复制'],
 'ملاحظات':['Notes','备注'],'المنطقة':['Area','地区'],'نسخ الاسم والعنوان الصيني':['Copy Chinese name and address','复制中文名称和地址'],
 'نسخ الوجهة لـ DiDi':['Copy destination for DiDi','复制滴滴目的地'],'البحث عن الوجهة في AMAP':['Search in AMAP','在高德地图搜索'],'البحث في AMAP':['Search in AMAP','在高德地图搜索'],
 'تسجيل الدخول':['Sign in','登录'],'إضافة إلى المفضلة':['Add to favorites','加入收藏'],'إزالة من المفضلة':['Remove from favorites','取消收藏']
 };
 const safe=()=>['en','zh'].includes(window.lang)?window.lang:(document.documentElement.lang||'ar');
 window.BY2_L10N={language:safe,term:(text)=>{const l=safe();return l==='ar'?String(text||''):(dic[String(text||'').trim()]||[])[l==='en'?0:1]||String(text||'')},
 label:(ar,en,zh)=>safe()==='en'?en:safe()==='zh'?zh:ar,
 place:(record)=>{const l=safe();return (l==='en'?record.en:l==='zh'?record.zh:record.ar)||record.ar||record.en||record.zh||''},
 announceMissing:(node)=>{if(safe()==='ar'||!node)return;node.lang='ar';node.dir='rtl';node.classList.add('by2-original-arabic');node.title=safe()==='en'?'Original Arabic description':'原始阿拉伯语描述';}};
})();