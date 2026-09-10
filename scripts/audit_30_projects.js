const fs = require('fs');
const path = require('path');

const store = JSON.parse(fs.readFileSync('data/projects-store.json', 'utf8'));
const slugs = [
  'game-development-665', 'kickboard-safety-073', 'project-704', 'game-development-553',
  'font-optimizer-523', 'project-250', 'smart-robot-990', 'safety-helper-004',
  'smart-wheelchair-104', 'smart-robot-321', 'safety-helper-073', 'fire-escape-robot-398',
  'safety-helper-988', 'autonomous-car-689', 'smart-robot-389', 'smart-robot-790',
  'project-298', 'smart-robot-767', 'project-398', 'water-fountain-980',
  'project-369', 'barrier-free-826', 'project-941', 'ant-colony-sim-057',
  'cube-solver-105', 'ship-survival-ai-530', 'commute-predictor-853', 'vocab-learner-229',
  'contract-analyzer-400', 'project-793'
];

console.log('AUDIT OF 30 TARGET PROJECTS:');
let missing = 0;
slugs.forEach((s, idx) => {
  const p = store.find(x => x.slug === s || x.id === s);
  if (!p) {
    console.error((idx+1) + '. ' + s + ' NOT FOUND IN STORE!');
    missing++;
    return;
  }
  const relPath = p.thumbnail_url.startsWith('/') ? p.thumbnail_url.slice(1) : p.thumbnail_url;
  const filePath = path.join('public', relPath);
  const exists = fs.existsSync(filePath);
  const size = exists ? fs.statSync(filePath).size : 0;
  console.log(`${idx + 1}. [${exists ? 'OK' : 'FAIL'}] ${s} | ${p.title} -> ${p.thumbnail_url} (${size} bytes)`);
  if (!exists || size < 1000) missing++;
});
console.log(`\nRESULT: ${30 - missing}/30 PASS, MISSING: ${missing}`);
