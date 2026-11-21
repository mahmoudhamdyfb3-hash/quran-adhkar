import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

const messages={
  morning:{title:'حان وقت أذكار الصباح',body:'ابدأ يومك بذكر الله وطمأنينة القلب.'},
  evening:{title:'حان وقت أذكار المساء',body:'اختم يومك بذكر الله وحفظه.'},
  quran:{title:'حان وقت ورد القرآن',body:'اقرأ ما تيسر من كتاب الله.'}
};
const cairoParts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Cairo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts().filter(part=>part.type!=='literal').map(part=>[part.type,part.value]));
const time=`${cairoParts.hour}:${cairoParts.minute}`;
let kind=process.env.FORCE_REMINDER||'';
if(!kind){
  if(cairoParts.hour==='07'&&Number(cairoParts.minute)<15)kind='morning';
  else if(cairoParts.hour==='18'&&Number(cairoParts.minute)<15)kind='evening';
  else if(cairoParts.hour==='20'&&Number(cairoParts.minute)>=30&&Number(cairoParts.minute)<45)kind='quran';
}
if(!messages[kind]){console.log(`No reminder due at Cairo time ${time}.`);process.exit(0);}
if(!process.env.FIREBASE_SERVICE_ACCOUNT)throw new Error('Missing FIREBASE_SERVICE_ACCOUNT GitHub secret.');
const serviceAccount=JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
if(!getApps().length)initializeApp({credential:cert(serviceAccount)});
const db=getFirestore();
const subscriptions=await db.collection('pushSubscriptions').where('enabled','==',true).get();
const rows=subscriptions.docs.map(doc=>({id:doc.id,token:doc.data().token})).filter(row=>row.token);
console.log(`Sending ${kind} reminder to ${rows.length} devices.`);
for(let start=0;start<rows.length;start+=500){
  const batch=rows.slice(start,start+500);
  const result=await getMessaging().sendEachForMulticast({tokens:batch.map(row=>row.token),notification:messages[kind],webpush:{notification:{tag:`quran-adhkar-${kind}`,renotify:true}}});
  await Promise.all(result.responses.map((response,index)=>{
    if(response.success)return null;
    const code=response.error?.code||'';
    if(code.includes('registration-token-not-registered')||code.includes('invalid-registration-token'))return db.collection('pushSubscriptions').doc(batch[index].id).delete();
    return null;
  }));
}

