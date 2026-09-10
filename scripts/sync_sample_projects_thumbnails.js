const fs = require('fs');

const tsPath = 'data/sample-projects.ts';
let content = fs.readFileSync(tsPath, 'utf8');

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

let count = 0;
slugs.forEach(s => {
  const reg = new RegExp(`("slug":\\s*"${s}"[\\s\\S]*?"thumbnail_url":\\s*")[^"]+(")`);
  if (reg.test(content)) {
    content = content.replace(reg, `$1/thumbnails/${s}.jpg$2`);
    count++;
  }
});

fs.writeFileSync(tsPath, content, 'utf8');
console.log(`Updated ${count} thumbnails in sample-projects.ts`);
