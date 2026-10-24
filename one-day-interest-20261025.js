(function(){
 'use strict';
 var configs={
  compound:{code:'DAY25-COMPOUND',title:'سكيت قريب من منطقتك',body:'خروجة سكيت ورولر في ٦ أكتوبر. اسأل عن أول كلاس برايفت ٣٠٠ جنيه بالمعدات؛ الفريق يؤكد المدرب والميعاد.',en:'Skateboard and roller in 6 October. Ask about the EGP300 private class with gear. Coach and time require confirmation.'},
  weekend:{code:'DAY25-WEEKEND',title:'خروجة سكيت للعيلة',body:'خروجة فيها حركة للأطفال والأهالي. اسأل عن أول كلاس برايفت ٣٠٠ جنيه بالمعدات؛ الحجز والتوافر يتأكدان مع الفريق.',en:'Ask about a family skate outing and the EGP300 private class with gear. Availability requires confirmation.'},
  camp_search:{code:'DAY25-CAMP-SEARCH',title:'مهتم بكامب سكيت؟',body:'سجّل اهتمامك بكامب سكيت ورولر مقترح للأطفال. السعر والأيام والساعات لم تُعتمد؛ لا يوجد حجز أو دفع أو ميعاد مؤكد في هذه الصفحة.',en:'Register interest in a proposed children’s skate camp. No price, dates or hours are confirmed. This is not a booking or sale.'},
  camp_pmax:{code:'DAY25-CAMP-PMAX',title:'مهتم بكامب سكيت؟',body:'سجّل اهتمامك بكامب سكيت ورولر مقترح للأطفال. السعر والأيام والساعات لم تُعتمد؛ لا يوجد حجز أو دفع أو ميعاد مؤكد في هذه الصفحة.',en:'Register interest in a proposed children’s skate camp. No price, dates or hours are confirmed. This is not a booking or sale.'},
  corporate:{code:'DAY25-CORPORATE',title:'اسأل عن يوم لفريق الشركة',body:'مهتم بخروجة سكيت للكبار مع فريق الشركة؟ اسأل عن إمكانية التنظيم والعدد والتوقيت. البرنامج والسعر والتوافر يحتاجون تأكيدًا؛ لا يوجد عرض مجموعات مضمون.',en:'Ask about a team day for adults. Group capacity, programme, price and availability require confirmation.'},
  info:{code:'DAY25-INFO-WHATSAPP',title:'اسألنا عن كلاس السكيت',body:'استفسر على واتساب عن كلاس السكيت أو الرولر، المعدات والمواعيد. أول كلاس برايفت ٣٠٠ جنيه بالمعدات. الفريق يؤكد المدرب والتوافر؛ لا نعد برد فوري.',en:'Ask on WhatsApp about skateboard or roller classes and availability. First private class EGP300 with gear; no immediate-response promise.'},
  outing:{code:'DAY25-OUTING',title:'بديل مختلف لخروجة الأطفال',body:'جرّبوا السكيت والرولر في ٦ أكتوبر. إحنا سكيت بارك، مش ترامبولين. اسأل عن الدخول أو أول كلاس ٣٠٠ جنيه بالمعدات؛ التأجير منفصل عن الدخول.',en:'A skatepark alternative for a family outing, not a trampoline park. Ask about entry or the EGP300 class with gear. Entry and rental are separate.'},
  gift:{code:'DAY25-GIFT-INTEREST',title:'مهتم تهدي حصة سكيت؟',body:'اسأل أو سجّل اهتمامك بفكرة حصة سكيت هدية. لا نبيع قسائم في هذه الصفحة؛ الإتاحة والسعر والصلاحية وشروط الاستخدام لم تُعتمد بعد. لا يوجد دفع أو شراء أو حجز مؤكد.',en:'Ask or register interest in a skate-class gift idea. Vouchers are not sold here. Availability, price and terms are not confirmed.'}
 };
 var key=new URLSearchParams(location.search).get('idea');
 if(!Object.prototype.hasOwnProperty.call(configs,key)){document.getElementById('whatsapp').className='';document.getElementById('copy').textContent='اختار نوع الاستفسار من الروابط أدناه؛ لا يوجد حجز تلقائي.';return;}
 var c=configs[key], message=c.code+' | Google '+key+'\nأهلًا إيجي سكيت بارك، '+(key.indexOf('camp_')===0?'مهتم بتفاصيل كامب سكيت مقترح عندما يتم اعتمادها، ده استفسار مش حجز.':key==='gift'?'عايز أسأل عن فكرة حصة سكيت هدية وهل متاحة فعلًا؛ ده اهتمام فقط مش شراء.':key==='corporate'?'عايز أسأل عن إمكانية يوم لفريق الشركة للكبار؛ ياريت تأكيد البرنامج والتوافر قبل أي اتفاق.':'عايز أستفسر عن السكيت أو الرولر والمواعيد والتوافر قبل الزيارة.');
 document.title=c.title+' | EGY Skatepark';
 document.getElementById('title').textContent=c.title;
 document.getElementById('copy').textContent=c.body;
 document.getElementById('english').textContent=c.en;
 var wa=document.getElementById('whatsapp');
 wa.href='https://wa.me/201026189811?text='+encodeURIComponent(message);
 wa.hidden=false;
 wa.addEventListener('click',function(){if(typeof window.gtag==='function')window.gtag('event','whatsapp_click',{source_code:c.code,campaign_id:'one_day_20261025_'+key,intent_stage:'whatsapp_open_only',link_url:'https://wa.me/201026189811',transport_type:'beacon'});});
})();
