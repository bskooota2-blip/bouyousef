بويوسف ٣ — V041.4: إصلاح عداد الأعضاء — الخطوات المطلوبة

تم إصلاح وظيفة member-count لتتحقق من جلسة Supabase Auth، ثم من قائمة مدراء محفوظة بقاعدة البيانات (بدلاً من الاعتماد على نجاح RPC الزيارات). العد يتم من Supabase Auth عبر service_role على الخادم فقط.

خطوات التفعيل التي يجب أن ينفذها مالك مشروع Supabase (لا يمكن تنفيذها داخل ملف ZIP):
1) افتح لوحة Supabase الخاصة بنفس المشروع المستخدم في الموقع.
2) SQL Editor: نفّذ ملف supabase/migrations/2026111201_member_count_admin_allowlist.sql.
3) Authentication > Users: انسخ UUID لحساب المدير الفعلي (لا تشارك كلمة المرور أو أي مفتاح سري).
4) SQL Editor: شغّل الأمر التالي بعد استبدال النص داخل الاقتباسات بمعرّف UUID الصحيح:
   insert into public.by3_admin_members(user_id) values ('YOUR-ADMIN-USER-UUID') on conflict (user_id) do nothing;
5) انشر Edge Function باسم member-count إلى مشروع Supabase نفسه من المسار supabase/functions/member-count/index.ts، باستخدام Supabase CLI وإعدادات المشروع المناسبة.
   مثال بعد الربط الصحيح للمشروع: supabase functions deploy member-count
6) تحقق في إعدادات Edge Function من توفر SUPABASE_URL وSUPABASE_SERVICE_ROLE_KEY كأسرار خادم، دون وضع المفتاح السري في GitHub أو HTML.
7) ادخل الموقع بحساب المدير واضغط «تحديث الإحصاءات». يجب أن تظهر قيمة عدد المستخدمين الفعلية؛ وقبل إكمال النشر سيظهر «يلزم تفعيل العداد».
8) اختبر بحساب غير مدير أن طلب /functions/v1/member-count يرجع 403 وليس العدد.

لم يتم نشر الوظيفة إلى Supabase، ولم يتم الاطلاع على بيانات حسابات المستخدمين. البطاقات الأربع للزيارات بقيت دون تعديل.
تنبيه: تسجيل الدخول الحالي وصفحات المدن على موقع ثابت ليست حماية حقيقية لملفات البيانات العامة؛ لا تعتبر معالجة عداد الأعضاء إصلاحًا كاملاً لحماية العضوية.
لم يتم لمس موقع بويوسف ٢ المنشور.
