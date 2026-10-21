/* Campaign-specific click measurement. No messages sent, calls placed or redirects on load. */
(function(){
 'use strict';
 var configs={brand_return:{code:'VISIT-BRAND-20261025'},friends_visit:{code:'VISIT-FRIENDS-20261025'}};
 var key=document.body.getAttribute('data-campaign');
 if(!Object.prototype.hasOwnProperty.call(configs,key))return;
 var code=configs[key].code;
 document.addEventListener('click',function(event){
  var link=event.target&&event.target.closest?event.target.closest('a[href]'):null;
  if(!link||typeof window.gtag!=='function')return;
  var common={page:location.pathname,source_code:code,campaign_id:key,transport_type:'beacon'};
  if(link.hasAttribute('data-wa'))window.gtag('event','whatsapp_click',Object.assign({},common,{link_url:'https://wa.me/201026189811',intent_type:'visit',intent_stage:'whatsapp_open_only',creative_id:'campaign_visit'}));
  else if(link.hasAttribute('data-directions'))window.gtag('event','conversion',{send_to:'AW-11333738787/pGdoCM3xvoAaEKPCrJwq',transport_type:'beacon'});
  else if(link.hasAttribute('data-call'))window.gtag('event','call_click',common);
 });
})();
