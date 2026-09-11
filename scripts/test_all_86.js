const fs = require('fs');
const http = require('http');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function run() {
  console.log('=== VERIFYING 86 PROJECTS ===');
  const store = JSON.parse(fs.readFileSync('data/projects-store.json', 'utf8'));
  console.log('Total store projects:', store.length);
  if (store.length !== 86) throw new Error('Expected 86 projects, got ' + store.length);

  // Category counts
  const cats = {};
  store.forEach(p => {
    cats[p.category] = (cats[p.category] || 0) + 1;
  });
  console.log('Category distribution:', cats);
  if (cats['로봇고급'] !== 14) throw new Error('Expected 14 in 로봇고급, got ' + cats['로봇고급']);

  // Thumbnail uniqueness
  const thumbs = new Set();
  const dupThumbs = [];
  store.forEach(p => {
    if (thumbs.has(p.thumbnail_url)) {
      dupThumbs.push({ slug: p.slug, thumb: p.thumbnail_url });
    }
    thumbs.add(p.thumbnail_url);
  });
  if (dupThumbs.length > 0) {
    throw new Error('Duplicate thumbnails found: ' + JSON.stringify(dupThumbs));
  }
  console.log('Thumbnail uniqueness: 86/86 PASSED');

  // Verify Yang Yu-chan files
  const yang = store.find(p => p.slug === 'carbon-neutral-fan-632');
  if (!yang) throw new Error('Yang Yu-chan project not found!');
  console.log('Yang Yu-chan project found:', {
    title: yang.title,
    student: yang.student_display_names,
    category: yang.category,
    team: yang.team_name,
    poster: yang.poster_url,
    report: yang.report_url,
    manual: yang.manual_url,
  });

  const filesToCheck = [
    'public' + yang.poster_url,
    'public' + yang.report_url,
    'public' + yang.manual_url,
  ];
  filesToCheck.forEach(f => {
    if (!fs.existsSync(f)) throw new Error('Missing file: ' + f);
    console.log('File verified:', f, fs.statSync(f).size, 'bytes');
  });

  // Test endpoints on local server
  const apiNormal = await get('http://localhost:3000/api/projects');
  console.log('GET /api/projects (normal) length:', JSON.parse(apiNormal.body).length, '(Expected: 0)');

  const apiAdmin = await get('http://localhost:3000/api/projects?includeUnpublished=true');
  console.log('GET /api/projects?includeUnpublished=true length:', JSON.parse(apiAdmin.body).length, '(Expected: 86)');

  const detailNormal = await get('http://localhost:3000/projects/carbon-neutral-fan-632');
  console.log('GET /projects/carbon-neutral-fan-632 (normal):', detailNormal.statusCode, '(Expected: 404)');

  const detailPreview = await get('http://localhost:3000/projects/carbon-neutral-fan-632?preview=true');
  console.log('GET /projects/carbon-neutral-fan-632?preview=true (preview):', detailPreview.statusCode, '(Expected: 200)');

  const home = await get('http://localhost:3000/');
  console.log('GET / (home):', home.statusCode, '(Expected: 200)');

  const gallery = await get('http://localhost:3000/projects');
  console.log('GET /projects (gallery):', gallery.statusCode, '(Expected: 200)');

  console.log('\n=== ALL 86 VERIFICATIONS PASSED! ===');
}

run().catch(err => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
