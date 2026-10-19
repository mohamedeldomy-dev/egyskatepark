/* Intent preparation only. No storage, PII, message text or form values in Analytics. */
(function(){
 'use strict';
 var form=document.getElementById('visit-request');
 if(!form)return;
 // Existing Google Ads website directions action. Only fire on an actual Maps click.
 // Google-hosted call/directions actions are separate and cannot be fabricated here.
 if(typeof window.gtag==='function')window.gtag('config','AW-11333738787');
 if(typeof document.addEventListener==='function')document.addEventListener('click',function(event){
  var link=event.target&&event.target.closest?event.target.closest('a[href]'):null;
  if(!link)return;
  var href=link.getAttribute('href')||'';
  if(/^https:\/\/(maps\.app\.goo\.gl\/|(?:www\.)?google\.com\/maps)/i.test(href)&&typeof window.gtag==='function'){
   window.gtag('event','conversion',{send_to:'AW-11333738787/pGdoCM3xvoAaEKPCrJwq',transport_type:'beacon'});
  }
 });
 var intent=document.body.getAttribute('data-visit-intent');
 var intents={visit:{code:'VISIT-01',label:'زيارة للبارك'},class:{code:'CLASS-01',label:'كلاس تدريب'},birthday:{code:'PARTY-01',label:'عيد ميلاد'},offpeak:{code:'OFFPEAK-01',label:'عرض ساعتين بـ١٠٠ جنيه، الاثنين–الأربعاء، داخل٢–٥ عصرًا، آخر دخول٣ عصرًا؛ الدخول فقط والتأجير والتدريب منفصلان'}};
 if(!Object.prototype.hasOwnProperty.call(intents,intent))return;
 var query=new URLSearchParams(location.search);
 var sources={youtube:'YT',google:'G',tiktok:'TT',pmax:'PM',maps:'MAP',instagram:'IG'};
 var channelNames={youtube:'YouTube',google:'Google',tiktok:'TikTok',pmax:'Google PMax',maps:'Google Maps',instagram:'Instagram'};
 var media={paid_video:'P',cpc:'P',organic_video:'O',organic:'O'};
 var source=query.get('utm_source'),medium=query.get('utm_medium');
 var knownSource=Object.prototype.hasOwnProperty.call(sources,source)&&Object.prototype.hasOwnProperty.call(media,medium);
 var creativeMap={class_a:{intent:'class',suffix:'A'},class_b:{intent:'class',suffix:'B'},visit_a:{intent:'visit',suffix:'A'},visit_b:{intent:'visit',suffix:'B'},return_a:{intent:'visit',suffix:'R-A',returning:true},return_b:{intent:'visit',suffix:'R-B',returning:true}};
 var creative=query.get('utm_content');
 var variant=Object.prototype.hasOwnProperty.call(creativeMap,creative)&&creativeMap[creative].intent===intent?creativeMap[creative]:null;
 var code=intents[intent].code+(knownSource?'-'+sources[source]+'-'+media[medium]:'-U')+(variant?'-'+variant.suffix:'');
 if(variant&&variant.returning&&form.elements.visitor)form.elements.visitor.value='راجع ألعب';
 function value(name){var field=form.elements[name];return field?String(field.value||'').trim():'';}
 function cairoDay(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Cairo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
 function offpeakExpired(){return intent==='offpeak'&&cairoDay()>'2026-11-01';}
 if(offpeakExpired()){var offerStatus=document.getElementById('offer-status');if(offerStatus)offerStatus.textContent='انتهت تجربة عرض ساعتين بـ١٠٠ جنيه يوم١ نوفمبر٢٠٢٦. تواصل لمعرفة الأسعار الحالية.';var submitButton=form.querySelector&&form.querySelector('button[type=submit]');if(submitButton)submitButton.disabled=true;}
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
  if(offpeakExpired())return;
  var message=(knownSource?channelNames[source]+' - '+(intent==='class'?'أول كلاس':intent==='birthday'?'عيد ميلاد':'أول زيارة')+'\n':'')+'أهلًا إيجي سكيت بارك، عايز أسأل عن '+intents[intent].label+' ('+code+').';
  [['visitor','نوع الزيارة'],['activity','النشاط'],['age','الفئة العمرية'],['people','عدد المشاركين'],['equipment','المعدات']].forEach(function(pair){var v=value(pair[0]);if(v)message+='\n'+pair[1]+': '+v;});
  var date=value('day');
  if(/^\d{4}-\d{2}-\d{2}$/.test(date))message+='\nاليوم المفضل: '+date;
  message+='\nبرجاء تأكيد المتاح والسعر الإجمالي والموعد قبل الزيارة.';
  if(typeof window.gtag==='function')window.gtag('event','whatsapp_click',{link_url:'https://wa.me/201026189811',page:location.pathname,intent_type:intent,source_code:code,creative_id:variant?creative:'unspecified',intent_stage:'whatsapp_open_only',transport_type:'beacon'});
  window.open('https://wa.me/201026189811?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');
 });
})();
