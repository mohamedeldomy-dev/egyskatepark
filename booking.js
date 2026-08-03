/* Egy Skatepark — booking module (restores the protected booking contract on top of the new design)
   Opens as an overlay when any link to #bookForm is clicked. Does not modify page design.
   Protected IDs: bookForm,bName,bPhone,bAge,bActivity,bLevel,bPackage,bDate,bTime,bNotes,passEmpty,pass,tId,qrcode,tRows,waBtn
   WhatsApp: 201026189811 only. QR payload = plain text 7-line ticket. */
(function () {
  'use strict';
  var WA = '201026189811';
  var isAr = (document.documentElement.getAttribute('lang') || '').toLowerCase().indexOf('ar') === 0;

  var T = isAr ? {
    dir: 'rtl',
    close: 'اقفل',
    formStep: 'بياخد حوالي ٦٠ ثانية',
    formStart: 'تفاصيل طلبك',
    notice: 'الفورم ده بيجهز طلب. الكلاس بيتأكد بس بعد ما الفريق يرد على واتساب بالمدرب والميعاد والتفاصيل النهائية.',
    name: 'اسمك', phone: 'رقم واتساب', age: 'سن الرايدر', ride: 'اختار النشاط',
    experience: 'الخبرة', pkg: 'مسار التدريب', date: 'التاريخ المفضل',
    time: 'الوقت المفضل (٤–١١ مساءً)',
    notes: 'أي حاجة المدرب لازم يعرفها؟ (اختياري)',
    nameP: 'اسم الرايدر أو ولي الأمر', phoneP: 'مثال: 010 1234 5678',
    submit: 'جهّز طلب كلاس السكيت',
    roller: 'رولر سكيت', skateboard: 'سكيت بورد',
    lvl: [['Beginner', 'مبتدئ — أول مرة'], ['Intermediate', 'متوسط'], ['Advanced', 'متقدم']],
    pkgs: [['Private Session (300 EGP)', 'سيشن برايفت — ٣٠٠ جنيه'], ['Group Monthly (650 EGP)', 'جروب — ٦٥٠ جنيه / شهر'], ['Private Group Monthly (750 EGP)', 'جروب برايفت — ٧٥٠ جنيه / شهر'], ['Private 1-on-1 Monthly (1000 EGP)', 'برايفت فردي — ١٬٠٠٠ جنيه / شهر']],
    flex: 'وقت مرن — اتفق مع المدرب الأول',
    ruleR: 'حجز الرولر بيتم أونلاين. الفريق بيأكد الساعة النهائية على واتساب.',
    ruleS: 'السكيت بورد له مدرب واحد. اتفق على الميعاد مع المدرب الأول؛ اختار ساعة مفضلة أو اختيار الوقت المرن.',
    passHead: 'باس السيشن',
    empty: 'باس السيشن والـQR هيظهروا هنا. ابعته على واتساب للتأكيد النهائي.',
    send: 'Send request on WhatsApp', edit: 'Change the request',
    fineS: '🛹⚠️ مدرب سكيت بورد واحد: اتفق على الميعاد مع المدرب الأول. خد سكرين شوت وورّي الـQR في البارك.',
    fineR: 'طلب الرولر اتبعت أونلاين؛ الساعة النهائية بتتأكد على واتساب. خد سكرين شوت وورّي الـQR في البارك.',
    fName: 'اسمك', fPhone: 'رقم واتساب', fAge: 'سن الرايدر', fRide: 'اختار النشاط', fExp: 'الخبرة', fPkg: 'مسار التدريب', fDate: 'التاريخ المفضل'
  } : {
    dir: 'ltr',
    close: 'Close',
    formStep: 'Takes about 60 seconds',
    formStart: 'Your request details',
    notice: 'This form prepares a request. Your class is confirmed only after the team replies on WhatsApp with the coach, time and final details.',
    name: 'Your name', phone: 'WhatsApp number', age: 'Rider age', ride: 'Choose the ride',
    experience: 'Experience', pkg: 'Training path', date: 'Preferred date',
    time: 'Preferred time (4–11 PM)',
    notes: 'Anything the coach should know? (optional)',
    nameP: 'Rider or parent name', phoneP: 'Example: 010 1234 5678',
    submit: 'Prepare skate class request',
    roller: 'Roller Skate', skateboard: 'Skateboard',
    lvl: [['Beginner', 'Beginner — first time'], ['Intermediate', 'Intermediate'], ['Advanced', 'Advanced']],
    pkgs: [['Private Session (300 EGP)', 'Private session — 300 EGP'], ['Group Monthly (650 EGP)', 'Group — 650 EGP / month'], ['Private Group Monthly (750 EGP)', 'Private group — 750 EGP / month'], ['Private 1-on-1 Monthly (1000 EGP)', 'Private 1-on-1 — 1000 EGP / month']],
    flex: 'Flexible — agree time with coach first',
    ruleR: 'Roller booking is completed online. Your exact hour is confirmed by the team on WhatsApp.',
    ruleS: 'Skateboard has one coach. Agree time with coach first; you may select a preferred hour or the flexible-time option.',
    passHead: 'SESSION PASS',
    empty: 'Your QR session pass will appear here. Send it on WhatsApp for final confirmation.',
    send: 'Send request on WhatsApp', edit: 'Change the request',
    fineS: '🛹⚠️ One skateboard coach: agree time with coach first. Screenshot this pass and show the QR at the park.',
    fineR: 'Roller request submitted online; the exact hour is confirmed on WhatsApp. Screenshot this pass and show the QR at the park.',
    fName: 'Your name', fPhone: 'WhatsApp number', fAge: 'Rider age', fRide: 'Choose the ride', fExp: 'Experience', fPkg: 'Training path', fDate: 'Preferred date'
  };
  var FLEX_VALUE = 'Flexible - agree time with coach first';
  var TIMES = ['4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'];

  var css = ''
    + '#espBookOverlay{position:fixed;inset:0;z-index:99999;display:none;background:rgba(8,18,20,.72);backdrop-filter:blur(4px);overflow-y:auto;padding:24px 12px}'
    + '#espBookOverlay.esp-open{display:block}'
    + '#espBookOverlay .esp-card{max-width:920px;margin:0 auto;background:#fffdf8;color:#12262a;border-radius:18px;padding:26px 22px 30px;position:relative;font-family:"Segoe UI",Tahoma,Arial,sans-serif;box-shadow:0 24px 80px rgba(0,0,0,.45)}'
    + '#espBookOverlay .esp-x{position:absolute;top:12px;inset-inline-end:12px;border:0;background:#12262a;color:#fff;border-radius:999px;width:38px;height:38px;font-size:17px;cursor:pointer;line-height:1}'
    + '#espBookOverlay h3{margin:.2em 0 .3em;font-size:1.45rem}'
    + '#espBookOverlay .esp-step{font-size:.8rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#065f57}'
    + '#espBookOverlay .esp-notice{margin:0 0 1.1em;font-size:.92rem;color:rgba(18,38,42,.75);line-height:1.5}'
    + '#bookForm{display:grid;grid-template-columns:1fr 1fr;gap:.85rem 1rem}'
    + '#bookForm label{display:flex;flex-direction:column;gap:.35rem;font-size:.86rem;font-weight:700}'
    + '#bookForm .esp-wide{grid-column:1/-1}'
    + '#bookForm input,#bookForm select,#bookForm textarea{border:1px solid rgba(18,38,42,.25);border-radius:10px;padding:.65rem .75rem;font:inherit;font-weight:400;background:#fff;color:#12262a}'
    + '#bookForm .esp-rule{grid-column:1/-1;display:flex;gap:.6rem;align-items:flex-start;background:#eef6f4;border:1px solid rgba(6,95,87,.25);border-radius:12px;padding:.7rem .85rem}'
    + '#bookForm .esp-rule strong{font-size:1.25rem;line-height:1.2}'
    + '#bookForm .esp-rule p{margin:0;font-size:.88rem;line-height:1.5}'
    + '#bookForm button[type=submit]{grid-column:1/-1;border:0;border-radius:12px;background:#065f57;color:#fff;font-weight:800;font-size:1rem;padding:.95rem 1rem;cursor:pointer}'
    + '#bookForm button[type=submit]:hover{background:#0a7a70}'
    + '#espBookOverlay .esp-passwrap{margin-top:1.2rem}'
    + '#passEmpty{display:flex;gap:.6rem;align-items:center;border:1px dashed rgba(18,38,42,.3);border-radius:14px;padding:1rem;font-size:.9rem;color:rgba(18,38,42,.7)}'
    + '#passEmpty span{font-size:1.4rem}'
    + '#pass{border:2px solid #065f57;border-radius:16px;padding:1.1rem;display:flex;flex-direction:column;align-items:center;gap:.6rem;background:#fff}'
    + '#pass[hidden],#passEmpty[hidden]{display:none}'
    + '#pass .esp-ph{display:flex;justify-content:space-between;width:100%;font-size:.8rem;letter-spacing:.08em;font-weight:800}'
    + '#pass .esp-ph span{color:#065f57}'
    + '#tId{font-size:1.05rem;letter-spacing:.05em}'
    + '#qrcode{padding:8px;background:#fff}'
    + '#tRows{width:100%;display:grid;grid-template-columns:1fr 1fr;gap:.35rem .9rem;font-size:.85rem}'
    + '#tRows>div{display:flex;justify-content:space-between;gap:.5rem;border-bottom:1px dotted rgba(18,38,42,.2);padding-bottom:.25rem}'
    + '#tRows span{color:rgba(18,38,42,.6)}'
    + '#waBtn{display:inline-flex;align-items:center;gap:.5rem;background:#1fa855;color:#fff;font-weight:800;border-radius:12px;padding:.85rem 1.4rem;text-decoration:none}'
    + '#waBtn:hover{background:#178c46}'
    + '#espBookOverlay .esp-fine{margin:.2rem 0 0;font-size:.8rem;text-align:center;color:rgba(18,38,42,.7);line-height:1.5}'
    + '#espBookOverlay .esp-edit{border:0;background:none;color:#065f57;font-weight:700;cursor:pointer;text-decoration:underline;font-size:.85rem}'
    + '@media(max-width:640px){#bookForm{grid-template-columns:1fr}#tRows{grid-template-columns:1fr}}';

  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'text') e.textContent = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { e.appendChild(c); });
    return e;
  }

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  var overlay, ticket = null;

  function buildTimeOptions(sel, isSkate) {
    sel.innerHTML = '';
    TIMES.forEach(function (t) { sel.appendChild(el('option', { text: t })); });
    if (isSkate) {
      var o = el('option', { value: FLEX_VALUE, text: T.flex });
      sel.appendChild(o);
      sel.value = FLEX_VALUE;
    } else {
      sel.value = '6:00 PM';
    }
  }

  function build() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    overlay = el('div', { id: 'espBookOverlay', dir: T.dir, role: 'dialog', 'aria-modal': 'true' });
    var card = el('div', { 'class': 'esp-card' });
    var x = el('button', { 'class': 'esp-x', type: 'button', 'aria-label': T.close, text: '✕' });
    x.addEventListener('click', close);
    card.appendChild(x);
    card.appendChild(el('div', { 'class': 'esp-step', text: T.formStep }));
    card.appendChild(el('h3', { text: T.formStart }));
    card.appendChild(el('p', { 'class': 'esp-notice', text: T.notice }));

    var form = el('form', { id: 'bookForm' });

    function labeled(labelText, field, wide) {
      var l = el('label', wide ? { 'class': 'esp-wide' } : {});
      l.appendChild(document.createTextNode(labelText));
      l.appendChild(field);
      return l;
    }

    var bName = el('input', { id: 'bName', name: 'name', required: '', autocomplete: 'name', placeholder: T.nameP });
    var bPhone = el('input', { id: 'bPhone', name: 'phone', required: '', inputmode: 'tel', autocomplete: 'tel', placeholder: T.phoneP });
    var bAge = el('input', { id: 'bAge', name: 'age', required: '', type: 'number', min: '4', max: '80' });

    var bActivity = el('select', { id: 'bActivity', name: 'activity' });
    bActivity.appendChild(el('option', { value: 'Roller Skate', text: T.roller }));
    bActivity.appendChild(el('option', { value: 'Skateboard', text: T.skateboard }));

    var bLevel = el('select', { id: 'bLevel', name: 'level' });
    T.lvl.forEach(function (p) { bLevel.appendChild(el('option', { value: p[0], text: p[1] })); });

    var bPackage = el('select', { id: 'bPackage', name: 'package' });
    T.pkgs.forEach(function (p) { bPackage.appendChild(el('option', { value: p[0], text: p[1] })); });

    var bDate = el('input', { id: 'bDate', name: 'date', type: 'date', required: '', min: todayStr(), value: todayStr() });
    var bTime = el('select', { id: 'bTime', name: 'time' });
    buildTimeOptions(bTime, false);

    var rule = el('div', { 'class': 'esp-rule', role: 'note' });
    var ruleIcon = el('strong', { text: '🛼' });
    var ruleP = el('p', { text: T.ruleR });
    rule.appendChild(ruleIcon); rule.appendChild(ruleP);

    bActivity.addEventListener('change', function () {
      var sk = bActivity.value === 'Skateboard';
      buildTimeOptions(bTime, sk);
      ruleIcon.textContent = sk ? '🛹⚠️' : '🛼';
      ruleP.textContent = sk ? T.ruleS : T.ruleR;
    });

    var bNotes = el('textarea', { id: 'bNotes', name: 'notes', rows: '3' });

    form.appendChild(labeled(T.name, bName));
    form.appendChild(labeled(T.phone, bPhone));
    form.appendChild(labeled(T.age, bAge));
    form.appendChild(labeled(T.ride, bActivity));
    form.appendChild(labeled(T.experience, bLevel));
    form.appendChild(labeled(T.pkg, bPackage, true));
    form.appendChild(labeled(T.date, bDate));
    form.appendChild(labeled(T.time, bTime));
    form.appendChild(rule);
    form.appendChild(labeled(T.notes, bNotes, true));
    var submit = el('button', { type: 'submit', text: T.submit });
    form.appendChild(submit);
    form.addEventListener('submit', onSubmit);
    card.appendChild(form);

    var wrap = el('div', { 'class': 'esp-passwrap', 'aria-live': 'polite' });
    var empty = el('div', { id: 'passEmpty' });
    empty.appendChild(el('span', { text: '🎟️' }));
    empty.appendChild(el('p', { text: T.empty }));
    var pass = el('div', { id: 'pass', hidden: '' });
    var ph = el('div', { 'class': 'esp-ph' });
    ph.appendChild(el('b', { text: 'EGY SKATEPARK' }));
    ph.appendChild(el('span', { text: T.passHead }));
    pass.appendChild(ph);
    pass.appendChild(el('strong', { id: 'tId', text: 'ESP-000000-00' }));
    pass.appendChild(el('div', { id: 'qrcode' }));
    pass.appendChild(el('div', { id: 'tRows' }));
    var waBtn = el('a', { id: 'waBtn', href: 'https://wa.me/' + WA, target: '_blank', rel: 'noreferrer', text: T.send });
    pass.appendChild(waBtn);
    pass.appendChild(el('p', { 'class': 'esp-fine', text: '' }));
    var editBtn = el('button', { 'class': 'esp-edit', type: 'button', text: T.edit });
    editBtn.addEventListener('click', function () {
      ticket = null;
      pass.hidden = true;
      empty.hidden = false;
    });
    pass.appendChild(editBtn);
    wrap.appendChild(empty);
    wrap.appendChild(pass);
    card.appendChild(wrap);

    overlay.appendChild(card);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.body.appendChild(overlay);
  }

  function onSubmit(e) {
    e.preventDefault();
    var f = e.currentTarget;
    var g = function (n) { return String((f.elements[n] && f.elements[n].value) || '').trim(); };
    var r = g('name'), a = g('phone'), o = g('age'), s = g('activity'), c = g('level'), l = g('package'), u = g('date'), d = g('time'), fn = g('notes');
    var p = 'ESP-' + Date.now().toString(36).toUpperCase().slice(-6).padStart(6, '0') + '-' + String(Math.floor(Math.random() * 90 + 10));
    var m = 'EGY SKATEPARK TICKET\nID: ' + p + '\nName: ' + r + '\nPhone: ' + a + '\nAge: ' + o + '\nActivity: ' + s + ' - ' + c + '\nPackage: ' + l + '\nDate: ' + u + ' ' + d;
    var h = s === 'Skateboard';
    var ic = h ? '🛹⚠️' : '🛼';
    var msg;
    if (!isAr) {
      msg = ic + ' Skate class request\n🎟️ ' + p + '\n👤 ' + r + ' (' + o + ')\n📱 ' + a + '\nActivity: ' + s + ' - ' + c + '\nPackage: ' + l + '\nDate: ' + u + ' ' + d + '\nBooking rule: ' + (h ? 'Skateboard has one coach — agree time with coach first. Flexible time is available.' : 'Roller booking is submitted online; the exact hour is confirmed on WhatsApp.') + (fn ? '\nNotes: ' + fn : '');
    } else {
      msg = ic + ' طلب حجز كلاس سكيت\n🎟️ ' + p + '\n👤 ' + r + ' (' + o + ')\n📱 ' + a + '\nالنشاط: ' + s + ' - ' + c + '\nالباكدج: ' + l + '\nالتاريخ: ' + u + ' ' + d + '\nقاعدة الحجز: ' + (h ? 'السكيت بورد له مدرب واحد — اتفق على الميعاد مع المدرب الأول. متاح اختيار وقت مرن.' : 'حجز الرولر بيتبعت أونلاين، والساعة النهائية بتتأكد على واتساب.') + (fn ? '\nملاحظات: ' + fn : '');
    }
    ticket = { reference: p, name: r, phone: a, age: o, activity: s, level: c, packageName: l, date: u, time: d, payload: m, url: 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg) };
    renderTicket();
    if (window.gtag) { try { window.gtag('event', 'generate_lead', { activity: s, package: l, page: location.pathname }); } catch (err) {} }
  }

  function renderTicket() {
    var empty = document.getElementById('passEmpty');
    var pass = document.getElementById('pass');
    empty.hidden = true;
    pass.hidden = false;
    document.getElementById('tId').textContent = ticket.reference;
    var rows = document.getElementById('tRows');
    rows.innerHTML = '';
    [[T.fName, ticket.name], [T.fPhone, ticket.phone], [T.fAge, ticket.age], [T.fRide, ticket.activity], [T.fExp, ticket.level], [T.fPkg, ticket.packageName], [T.fDate, ticket.date + ' — ' + ticket.time]].forEach(function (pr) {
      var d = el('div', {});
      d.appendChild(el('span', { text: pr[0] }));
      var b = el('b', { text: pr[1] });
      if (pr[0] === T.fPhone) b.setAttribute('dir', 'ltr');
      d.appendChild(b);
      rows.appendChild(d);
    });
    document.getElementById('waBtn').setAttribute('href', ticket.url);
    var fine = pass.querySelector('.esp-fine');
    fine.textContent = ticket.activity === 'Skateboard' ? T.fineS : T.fineR;
    // QR with retry until qrcode.min.js is ready
    var tries = 0;
    function draw() {
      var q = document.getElementById('qrcode');
      if (!q || !window.QRCode) return false;
      q.innerHTML = '';
      new window.QRCode(q, { text: ticket.payload, width: 168, height: 168, colorDark: '#065f57' });
      return true;
    }
    if (!draw()) {
      var iv = window.setInterval(function () {
        tries += 1;
        if (draw() || tries >= 20) window.clearInterval(iv);
      }, 200);
    }
    pass.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function open() {
    if (!overlay) build();
    overlay.classList.add('esp-open');
    document.documentElement.style.overflow = 'hidden';
  }
  function close() {
    if (overlay) overlay.classList.remove('esp-open');
    document.documentElement.style.overflow = '';
  }

  function init() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href*="#bookForm"],a[href="#booking-form"]');
      if (a) { e.preventDefault(); open(); }
    }, true);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    if (location.hash === '#bookForm' || location.hash === '#booking-form') {
      window.setTimeout(open, 400);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

