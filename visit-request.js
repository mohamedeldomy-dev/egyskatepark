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
 // Recognise only approved campaign identifiers; never echo arbitrary query text.
 var classCampaigns={remarketing90_20261028:{label:'Google DemandGen Remarketing90',suffix:'RM90'},original_scaled_20261028:{label:'Google PMax Original Daily',suffix:'ORIGINAL-3X'},p1_nearby_20261028:{label:'Google PMax P1 Nearby20km',suffix:'P1-20KM'},p2_cairo_20261028:{label:'Google PMax P2 GreaterCairo',suffix:'P2-CAIRO'},phase2_newclients_20261025:{label:'Google PMax New Clients',suffix:'NEW'},phase2_lessons_20261025:{label:'Google Search Lessons',suffix:'LESSONS'},extra5000_compound_20261026:{label:'Google PMax Extra5000 B Compound',suffix:'EXTRA-B'},extra5000_youtube_20261025:{label:'YouTube Extra5000 C',suffix:'EXTRA-C'},extra5000_weekend_20261029:{label:'Google PMax Extra5000 D Weekend',suffix:'EXTRA-D'}};
 var campaignKey=query.get('utm_campaign');
 var classCampaign=intent==='class'&&knownSource&&Object.prototype.hasOwnProperty.call(classCampaigns,campaignKey)?classCampaigns[campaignKey]:null;
 if(intent==='visit'&&knownSource&&campaignKey==='extra5000_visits_20261025')classCampaign={label:'Google PMax Extra5000 A Visits',suffix:'EXTRA-A'};
 if(classCampaign)code+='-'+classCampaign.suffix;
 if(variant&&variant.returning&&form.elements.visitor)form.elements.visitor.value='راجع ألعب';
 // A quick enquiry must not require completing the optional detailed form.
 // Only allowlisted source codes are measured; message text stays out of Analytics.
 var quickLink=document.querySelector&&document.querySelector('[data-quick-whatsapp]');
 if(quickLink&&(intent==='class'||intent==='visit')){
  var quickMessage=(classCampaign?classCampaign.label+' - ':knownSource?channelNames[source]+' - ':'')+(intent==='class'?'أول كلاس':'زيارة البارك')+' ('+code+').\n'+(intent==='class'?'أهلًا، عايز أسأل عن أول كلاس بـ٣٠٠ جنيه بالمعدات. إيه المواعيد المتاحة؟':'أهلًا، عايز أسأل عن زيارة البارك. الدخول ١٥٠ جنيه والتأجير منفصل؛ ممكن التفاصيل؟');
  quickLink.href='https://wa.me/201026189811?text='+encodeURIComponent(quickMessage);
  quickLink.addEventListener('click',function(){
   if(typeof window.gtag==='function')window.gtag('event','whatsapp_click',{link_url:'https://wa.me/201026189811',page:location.pathname,intent_type:intent,source_code:code,creative_id:variant?creative:'unspecified',intent_stage:'whatsapp_open_only',cta_position:'hero_quick',transport_type:'beacon'});
  });
 }
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
  var message=(classCampaign?classCampaign.label+' - '+(intent==='class'?'أول كلاس':'أول زيارة')+'\n':knownSource?channelNames[source]+' - '+(intent==='class'?'أول كلاس':intent==='birthday'?'عيد ميلاد':'أول زيارة')+'\n':'')+'أهلًا إيجي سكيت بارك، عايز أسأل عن '+intents[intent].label+' ('+code+').';
  [['visitor','نوع الزيارة'],['activity','النشاط'],['age','الفئة العمرية'],['people','عدد المشاركين'],['equipment','المعدات']].forEach(function(pair){var v=value(pair[0]);if(v)message+='\n'+pair[1]+': '+v;});
  var date=value('day');
  if(/^\d{4}-\d{2}-\d{2}$/.test(date))message+='\nاليوم المفضل: '+date;
  message+='\nبرجاء تأكيد المتاح والسعر الإجمالي والموعد قبل الزيارة.';
  if(typeof window.gtag==='function')window.gtag('event','whatsapp_click',{link_url:'https://wa.me/201026189811',page:location.pathname,intent_type:intent,source_code:code,creative_id:variant?creative:'unspecified',intent_stage:'whatsapp_open_only',transport_type:'beacon'});
  window.open('https://wa.me/201026189811?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');
 });
})();
