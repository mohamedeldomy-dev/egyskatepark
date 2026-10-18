/* Counts link openings only; never claims a received message or booking. */
(function(){
 'use strict';
 var prefixes={tiktok:'TikTok - أول كلاس',youtube:'YouTube - أول كلاس',google:'Google - أول كلاس',maps:'Google Maps - أول زيارة',instagram:'Instagram - أول كلاس'};
 var source=document.body.getAttribute('data-channel');
 if(!Object.prototype.hasOwnProperty.call(prefixes,source))return;
 var href='https://wa.me/201026189811?text='+encodeURIComponent(prefixes[source]);
 var link=document.getElementById('channel-whatsapp');
 if(link)link.href=href;
 var redirected=false;
 function go(){if(redirected)return;redirected=true;location.replace(href);}
 if(location.hostname==='www.egyskatepark.com'||location.hostname==='egyskatepark.com'){
  window.dataLayer=window.dataLayer||[];
  function gtag(){window.dataLayer.push(arguments);}
  gtag('js',new Date());
  gtag('config','G-EW01W6MBHZ',{send_page_view:false});
  gtag('event','channel_link_open',{source_code:source,intent_stage:'link_open_only',page_location:'https://www.egyskatepark.com/contact/'+source+'/',page_referrer:'',event_callback:go,event_timeout:1000});
 }
 window.setTimeout(go,1200);
})();
