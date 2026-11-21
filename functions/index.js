const {onSchedule}=require('firebase-functions/v2/scheduler');
const {initializeApp}=require('firebase-admin/app');
const {getFirestore}=require('firebase-admin/firestore');
const {getMessaging}=require('firebase-admin/messaging');
initializeApp();
async function sendReminder(title,body){const db=getFirestore();const docs=await db.collection('pushSubscriptions').where('enabled','==',true).get();const rows=docs.docs.map(doc=>({id:doc.id,token:doc.data().token})).filter(row=>row.token);for(let i=0;i<rows.length;i+=500){const batch=rows.slice(i,i+500);const result=await getMessaging().sendEachForMulticast({tokens:batch.map(row=>row.token),notification:{title,body},webpush:{notification:{icon:'/icon-192.png',badge:'/icon-192.png'}}});await Promise.all(result.responses.map((response,index)=>{if(response.success)return null;const code=response.error?.code||'';if(code.includes('registration-token-not-registered')||code.includes('invalid-registration-token'))return db.collection('pushSubscriptions').doc(batch[index].id).delete();return null;}));}}
exports.morningReminder=onSchedule({schedule:'0 7 * * *',timeZone:'Africa/Cairo',region:'europe-west1'},()=>sendReminder('حان وقت أذكار الصباح','ابدأ يومك بذكر الله وطمأنينة القلب.'));
exports.eveningReminder=onSchedule({schedule:'0 18 * * *',timeZone:'Africa/Cairo',region:'europe-west1'},()=>sendReminder('حان وقت أذكار المساء','اختم يومك بذكر الله وحفظه.'));
exports.quranReminder=onSchedule({schedule:'30 20 * * *',timeZone:'Africa/Cairo',region:'europe-west1'},()=>sendReminder('حان وقت ورد القرآن','اقرأ ما تيسر من كتاب الله.'));
