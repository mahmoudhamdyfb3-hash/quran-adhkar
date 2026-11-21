# تشغيل التنبيهات اليومية مجانًا

لا تحتاج إلى Firebase Blaze أو Cloud Functions. ترسل GitHub Actions ثلاثة تنبيهات يومية عبر Firebase Cloud Messaging.

## الخطوات

1. ارفع محتويات هذا المجلد إلى مستودع GitHub **عام**.
2. من Firebase Console: Project settings → Service accounts → Generate new private key. نزّل ملف JSON واحتفظ به لنفسك.
3. من GitHub: Settings → Secrets and variables → Actions → New repository secret.
4. الاسم: `FIREBASE_SERVICE_ACCOUNT`، والقيمة: محتوى ملف JSON كاملًا.
5. افتح تبويب Actions في GitHub وفعّل تشغيل workflows إن طلب ذلك.

سيعمل التنبيه تلقائيًا يوميًا بتوقيت القاهرة: ٧:٠٠ صباحًا، ٦:٠٠ مساءً، و٨:٣٠ مساءً. لا ترفع ملف المفتاح إلى GitHub أو تشاركه في المحادثة.
