// Run before deployment: node scripts/check-site.cjs
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const files = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes:true })) {
    if (e.name === '.git') continue;
    const f = path.join(dir,e.name);
    if (e.isDirectory()) walk(f);
    else if (e.name.endsWith('.html')) files.push(f);
  }
}
walk(root);
const errors = [], warnings = [];
let anchors = 0, resources = 0;
for (const file of files) {
  const html = fs.readFileSync(file,'utf8');
  const name = path.relative(root,file);
  if (html.includes('a[href*=wa.me]')) errors.push(name+': invalid WhatsApp click selector');
  if (!/<head[\s>]/i.test(html)) continue;
  if ((html.match(/src="\/navigation\.js\?v=20261117"/g)||[]).length !== 1 ||
      !html.includes('href="/navigation.css?v=20261117-2"')) errors.push(name+': missing shared navigation');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]));
  for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) {
    anchors++;
    if (!ids.has(decodeURIComponent(match[1]))) errors.push(name+': missing #'+match[1]);
  }
  for (const match of html.matchAll(/\b(?:src|href)="(\/[^"#?]+)(?:[?#][^"]*)?"/g)) {
    const urlPath = match[1];
    if (urlPath.startsWith('//')) continue;
    resources++;
    const target = path.join(root,decodeURIComponent(urlPath));
    if (!fs.existsSync(target)) warnings.push(name+': missing '+urlPath);
  }
}
if (fs.readFileSync(path.join(root,'index.html'),'utf8') !== fs.readFileSync(path.join(root,'en/index.html'),'utf8')) errors.push('Root and English homepage have diverged');
for (const name of fs.readdirSync(path.join(root,'assets')).filter(n=>n.endsWith('-nav-20261117.js'))) {
  const text = fs.readFileSync(path.join(root,'assets',name),'utf8');
  if (text.includes('document.addEventListener(`click`,e,!0)')) errors.push(name+': competing anchor owner');
  for (const match of text.matchAll(/(?:import\(|from)\s*[`"]\.\/([^`"]+)[`"]/g)) {
    if (!fs.existsSync(path.join(root,'assets',match[1]))) errors.push(name+': missing import '+match[1]);
  }
}
console.log(JSON.stringify({pages:files.length,anchors,resources,errors,warnings:[...new Set(warnings)]},null,2));
if (errors.length) process.exitCode=1;
