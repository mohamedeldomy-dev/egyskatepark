/* Intent preparation only. No storage, PII, message text or form values in Analytics. */
(function(){
 'use strict';
 var form=document.getElementById('visit-request');
 if(!form)return;
 var intent=document.body.getAttribute('data-visit-intent');
 var intents={visit:{code:'VISIT-01',label:'زيارة للبارك'},class:{code:'CLASS-01',label:'كلاس تدريب'},birthday:{code:'PARTY-01',label:'عيد ميلاد'}};
 if(!Object.prototype.hasOwnProperty.call(intents,intent))return;
 var query=new URLSearchParams(location.search);
 var sources={youtube:'YT',google:'G',tiktok:'TT'};
 var media={paid_video:'P',cpc:'P',organic_video:'O',organic:'O'};
 var source=query.get('utm_source'),medium=query.get('utm_medium');
 var knownSource=Object.prototype.hasOwnProperty.call(sources,source)&&Object.prototype.hasOwnProperty.call(media,medium);
 var code=intents[intent].code+(knownSource?'-'+sources[source]+'-'+media[medium]:'-U');
 function value(name){var field=form.elements[name];return field?String(field.value||'').trim():'';}
 form.addEventListener('invalid',function(event){
  var field=event.target;
  if(typeof field.setCustomValidity!=='function')return;
  field.setCustomValidity(field.name==='age'?'اختار الفئة العمرية.':field.name==='activity'?'اختار النشاط المناسب.':'راجع القيمة المكتوبة في الخانة.');
 },true);
 form.addEventListener('input',function(event){if(typeof event.target.setCustomValidity==='function')event.target.setCustomValidity('');});
 form.addEventListener('change',function(event){if(typeof event.target.setCustomValidity==='function')event.target.setCustomValidity('');});
 form.addEventListener('submit',function(event){
  event.preventDefault();
  if(form.reportValidity&&!form.reportValidity())return;
  var message='أهلًا إيجي سكيت بارك، عايز أسأل عن '+intents[intent].label+' ('+code+').';
  [['visitor','نوع الزيارة'],['activity','النشاط'],['age','الفئة العمرية'],['people','عدد المشاركين'],['equipment','المعدات']].forEach(function(pair){var v=value(pair[0]);if(v)message+='\n'+pair[1]+': '+v;});
  var date=value('day');
  if(/^\d{4}-\d{2}-\d{2}$/.test(date))message+='\nاليوم المفضل: '+date;
  message+='\nبرجاء تأكيد المتاح والسعر الإجمالي والموعد قبل الزيارة.';
  if(typeof window.gtag==='function')window.gtag('event','whatsapp_click',{link_url:'https://wa.me/201026189811',page:location.pathname,intent_type:intent,source_code:code,intent_stage:'whatsapp_open_only',transport_type:'beacon'});
  window.open('https://wa.me/201026189811?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');
 });
})();
