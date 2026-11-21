# قرآن وأذكار

تطبيق عربي للقرآن الكريم والأذكار والمسبحة والأدعية.

## النشر على GitHub Pages

ارفع محتويات هذا المجلد إلى مستودع GitHub عام، ثم فعّل GitHub Pages من فرع `main` والمجلد `/(root)`.

## التنبيهات اليومية المجانية

التنبيهات تعمل بواسطة Firebase Cloud Messaging وGitHub Actions بدون Cloud Functions. اتبع [PUSH_SETUP.md](PUSH_SETUP.md) لإضافة مفتاح Firebase كسر داخل GitHub.

## ملف Android

من تبويب **Actions** اختر **Build Android APK and AAB** ثم **Run workflow**. اختر APK أو AAB أو الاثنين. يظهر التنزيل في صفحة التشغيل بعد اكتمال البناء. ملف APK قابل للتثبيت على الهاتف؛ ملف AAB يحتاج توقيع نشر قبل رفعه إلى Google Play.
