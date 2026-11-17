const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname,'../navigation.js'),'utf8');
function page(hash='') {
  const documentEvents = {}, windowEvents = {}, moves = [], urls = [];
  const location = new URL('https://www.egyskatepark.com/?utm_source=test'+hash);
  class Element { closest() { return this; } }
  const target = {scrollIntoView(options){moves.push(options);}};
  const history = {state:{test:1},pushState(state,_,url){urls.push(url);location.href=new URL(url,location).href;},replaceState(state,_,url){location.href=new URL(url,location).href;}};
  const document = {getElementById(id){return id==='premium-day-pass'?target:null;},querySelector(){return null;},addEventListener(name,fn){documentEvents[name]=fn;}};
  const window = {addEventListener(name,fn){windowEvents[name]=fn;}};
  vm.runInNewContext(source,{location,history,document,window,Element,URL});
  function click(href,extra={}) {
    const link = new Element();
    Object.assign(link,{href:new URL(href,location).href,target:'',hasAttribute(){return false;},classList:{contains(){return false;}}});
    const event = {button:0,target:link,preventDefault(){this.defaultPrevented=true;},...extra};
    documentEvents.click(event);
    return event;
  }
  return {location,moves,urls,click,ready:documentEvents.DOMContentLoaded,input:windowEvents};
}
test('fragment entry is positioned once, preserving tracking query and URL',()=>{
  const p=page('#premium-day-pass');
  assert.equal(p.location.hash,'');
  p.ready();
  assert.equal(p.location.hash,'#premium-day-pass');
  assert.equal(p.location.search,'?utm_source=test');
  assert.equal(p.moves.length,1);
});
test('visitor input before page readiness cancels automatic positioning',()=>{
  for(const input of ['wheel','touchstart','pointerdown','keydown']) {
    const p=page('#premium-day-pass');p.input[input]();p.ready();
    assert.equal(p.moves.length,0,input);
    assert.equal(p.location.hash,'#premium-day-pass');
  }
});
test('repeated section click avoids duplicate history and queued animations',()=>{
  const p=page();
  assert.equal(p.click('#premium-day-pass').defaultPrevented,true);
  p.click('#premium-day-pass');
  assert.equal(p.urls.length,1);
  assert.equal(p.moves.length,2);
  assert.ok(p.moves.every(m=>m.behavior==='instant'));
});
test('external, cross-page, modified and missing-target links retain normal behavior',()=>{
  for(const [href,extra] of [
    ['https://wa.me/201026189811',{}],['/ar/#premium-day-pass',{}],
    ['#premium-day-pass',{ctrlKey:true}],['#premium-day-pass',{button:1}],
    ['#does-not-exist',{}],['#bad%ZZ',{}],['#premium-day-pass',{defaultPrevented:true}]
  ]) {
    const p=page();p.click(href,extra);assert.equal(p.moves.length,0,href);
  }
});
