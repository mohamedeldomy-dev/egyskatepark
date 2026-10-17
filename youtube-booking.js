/* This landing page measures intent only. Never report a click as a received lead
   or a confirmed booking. No customer data or WhatsApp message is sent to GA4. */
(function () {
  'use strict';
  var button = document.getElementById('youtube-booking-whatsapp');
  if (!button) return;
  var query = new URLSearchParams(location.search);
  // Organic channel and future paid links remain distinct. Unknown traffic is unclassified.
  var medium = query.get('utm_source') === 'youtube' && query.get('utm_medium') === 'paid_video'
    ? 'paid_video' : query.get('utm_source') === 'youtube' && query.get('utm_medium') === 'organic_video'
      ? 'organic_video' : 'unclassified';
  var code = medium === 'paid_video' ? 'YT-BOOK-01-P' : medium === 'organic_video' ? 'YT-BOOK-01-O' : 'YT-BOOK-01';
  var message = 'شفت فيديو يوتيوب ١ (' + code + '). عايز أسأل عن حجز كلاس.\nسن الرايدر:\nالنشاط (رولر / سكيت بورد):\nاليوم المناسب:';
  button.href = 'https://wa.me/201026189811?text=' + encodeURIComponent(message);
  button.addEventListener('click', function () {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'whatsapp_click', {
      link_url: 'https://wa.me/201026189811',
      page: '/ar/youtube-booking/',
      creative_id: 'YT-BOOK-01',
      source_code: code,
      traffic_type: medium,
      intent_stage: 'whatsapp_open_only',
      transport_type: 'beacon'
    });
  });
})();
