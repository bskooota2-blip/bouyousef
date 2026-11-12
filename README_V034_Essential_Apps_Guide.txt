README V034 — التطبيقات المهمة — بويوسف ٣
تاريخ العمل: 11 نوفمبر 2026
نسخة الأساس: BouYousef3_V033_4_Guangzhou_Taikoo_Li_Added.zip
اسم الناتج: BouYousef3_V034_Essential_Apps_Guide.zip

نطاق العمل:
- أنشئت صفحة «تطبيقات مهمة» مستقلة داخل الموقع بثلاث بطاقات للتطبيقات Alipay (支付宝)، WeChat (微信)، AMap Global (高德地图).
- روابط App Store وGoogle Play معرّفة لكل تطبيق من صفحات الناشرين الأصلية.
- لكل تطبيق شاشة مواضيع مستقلة، ولا يفتح شرح تلقائيًا عند دخول الصفحة.
- أُضيفت شروحات عربية وأزرار الرجوع إلى التطبيق والتطبيقات والرئيسية والأعلى، ودعم سجل المتصفح.
- أُضيفت 55 صورة تعليمية أصلية بتنسيق SVG يمكن تكبيرها، موسومة بأنها رسوم توضيحية وليست صورًا حقيقية لشاشات التطبيقات.
- موضوع eSIM يشرح مزودًا خارجيًا مثل Airalo. لم تتأكد خدمة ثابتة لشراء eSIM داخل Alipay، لذا لا ينسب الموقع الخدمة إليه.
- بيانات الشرح التفصيلية بالعربية، مع توضيح ذلك عند تبديل لغة الواجهة. لا تُعرض على أنها ترجمة كاملة.

روابط التحميل التي تم التحقق من أصل صفحاتها عن طريق البحث:
Alipay iPhone: https://apps.apple.com/kw/app/alipay-simplify-your-life/id333206289
Alipay Android: https://play.google.com/store/apps/details?id=com.eg.android.AlipayGphone
WeChat iPhone: https://apps.apple.com/kw/app/wechat/id414478124
WeChat Android: https://play.google.com/store/apps/details?id=com.tencent.mm
AMap iPhone: https://apps.apple.com/kw/app/amap-global/id461703208
AMap Android: https://play.google.com/store/apps/details?id=com.autonavi.minimap
ملاحظة: التوفر يعتمد على منطقة متجر حساب الهاتف ويمكن أن يتغير؛ لم نجرب التنزيل على جهاز فعلي.

روابط فيديوهات يوتيوب المختارة:
Alipay شرح عربي (2025): https://www.youtube.com/watch?v=4iL6qCuzPHw
Airalo تثبيت eSIM فيديو رسمي (2024، بالإنجليزية): https://www.youtube.com/watch?v=heXr_GN2tiM
WeChat وAMap: لا توجد روابط يوتيوب معتمدة، لأن نتائج البحث لم تسمح بتأكيد ملاءمة شرح آمن ومحدث؛ لم نضع روابط وهمية.

مصادر إرشادية:
- https://www.trip.com/guide/payments/how-to-add-card-to-alipay.html
- https://arabic.shanghai.gov.cn/ar-UsefulApps/20260812/c587e873e99e408192c37a1aa1e0638f.html
- https://en.hainan.gov.cn/englishsite/LEditor/202506/fc48f25890f34802b6a3be5cfe006e2f.shtml
- https://www.airalo.com/help/getting-started-with-airalo/E8DFWD88SHUX/how-do-i-purchase-an-esim/5MSXY5KUQ8LQ
- https://www.airalo.com/help/getting-started-with-airalo/E8DFWD88SHUX/how-do-i-install-an-esim-on-my-ios-device/3Z7U0CAC64GF
- https://www.airalo.com/help/getting-started-with-airalo/E8DFWD88SHUX/how-do-i-install-and-start-using-an-esim-on-my-android-device/4SGRQMOETA5F

الصور والهوية:
- الرسوم تعليمية أصلية وليست لقطات رسمية. جرى إنشاء 55 رسمًا محليًا قابلًا للتكبير.
- الرموز الكبيرة للتطبيقات تمثيلات توضيحية محلية وليست ملفات الشعارات الرسمية؛ تعذر استيراد الأيقونات الأصلية مع إثبات الإذن/المصدر إلى ZIP. لم ندعِ بأنها شعارات رسمية.
- جميع الصور المضافة محلية ولا تعتمد على الإنترنت، وملفات التطبيقات الأصلية للموقع بقيت في ZIP.

الاختبارات:
- الكمبيوتر (Chromium عرض 1440): فتح 3 بطاقات، فتح دليل Alipay، 5 خطوات، تكبير الرسم وإغلاقه، الرجوع إلى التطبيق ثم القائمة.
- الهاتف (Chromium عرض 390): السيناريو نفسه، دون تمرير أفقي في شاشة التطبيقات الرئيسية.
- لم تظهر أخطاء JavaScript خلال اختبار واجهة التطبيقات.
- فحص صياغة JavaScript الجديد والكود الأساسي بواسطة node --check: ناجح.
- فتح الملف المحلي file:// عبر Chromium: محجوب بإعدادات بيئة الاختبار؛ استخدم اختبار بديلًا بتحميل HTML وJavaScript في المتصفح.
- التحقق من عمل روابط المتاجر داخل الأجهزة والنشر الفعلي وملاءمة كل لقطة شاشة رسمية: لم يُنفذ؛ لا ندعي نجاح ذلك.
- البحث العام العائم لم يتغير؛ أدخلت مطابقة أسماء التطبيقات إلى بحث الشريط القديم فقط.
- بقية ملفات الموقع: لم يُغيّر من الملفات الأصلية سوى index.html (إضافة نقطة الدخول للمحتوى والمسارات)، أما الملفات الجديدة فمحصورة في data/essential-apps* وassets/essential-apps* وملف التقرير. لم تُغيّر ملفات المدن والبيانات والتسجيل وبطاقة الدخول ووسائطها.

نتيجة المطابقة:
عدد ملفات الأساس: 165
الملفات الأصلية المتغيرة: ['index.html']
الملفات الأصلية المحذوفة: []
عدد الملفات الجديدة قبل إضافة هذا التقرير: 61
ملفات الأصل المتعلقة ببطاقة دخول الصين محفوظة دون تغيير: 32

قيود معروفة:
- لا تتوفر داخل ZIP لقطات أصلية موثقة أو الشعارات الرسمية؛ جميع الصور المصممة موسومة بأنها توضيحية.
- فيديوهات WeChat وAMap غير مضافة لعدم تثبيت ملاءمتها.
- لم يُختبر الرابط الخارجي على هاتف فعلي، ولم يُجرَ اختبار file:// مباشر في البيئة الحالية.
- يجب مراجعة تغيّر قوائم التطبيقات حسب بلد المستخدم وأي متطلبات أهلية عمرية / مصرفية.

تظل النسخة خاضعة لمراجعة المستخدم قبل اعتمادها النهائي.
