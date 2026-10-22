/* Family awareness campaign: click measurement only; no automatic navigation or contact. */
(function(){
'use strict';
document.addEventListener('click',function(event){
var link=event.target&&event.target.closest?event.target.closest('a[href]'):null;
if(!link||typeof window.gtag!=='function')return;
var common={page:location.pathname,source_code:'YT-FAMILY-REACH-5000',campaign_id:'family_awareness_5000',transport_type:'beacon'};
if(link.hasAttribute('data-wa'))window.gtag('event','whatsapp_click',Object.assign({},common,{link_url:'https://wa.me/201026189811',intent_type:'visit',intent_stage:'whatsapp_open_only',creative_id:'family_reach'}));
else if(link.hasAttribute('data-directions'))window.gtag('event','conversion',{send_to:'AW-11333738787/pGdoCM3xvoAaEKPCrJwq',transport_type:'beacon'});
else if(link.hasAttribute('data-call'))window.gtag('event','call_click',common);
});
})();

