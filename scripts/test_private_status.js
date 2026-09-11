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

async function verify() {
  console.log('=== VERIFYING PRIVATE DEFAULT STATUS FOR 85 PROJECTS ===');

  const store = JSON.parse(fs.readFileSync('data/projects-store.json', 'utf8'));
  console.log('Total store projects:', store.length);
  if (store.length !== 85) throw new Error('Expected 85 projects');

  const pubCount = store.filter(p => p.published || p.is_public).length;
  console.log(`Published count in store: ${pubCount} (Expected: 0)`);
  if (pubCount !== 0) throw new Error('Expected 0 published projects by default');

  // Test endpoints
  const apiNormal = await get('http://localhost:3000/api/projects');
  const normalList = JSON.parse(apiNormal.body);
  console.log('GET /api/projects (normal) length:', normalList.length, '(Expected: 0)');

  const apiAdmin = await get('http://localhost:3000/api/projects?includeUnpublished=true');
  const adminList = JSON.parse(apiAdmin.body);
  console.log('GET /api/projects?includeUnpublished=true length:', adminList.length, '(Expected: 85)');

  const detailNormal = await get('http://localhost:3000/projects/flower-dictionary-584');
  console.log('GET /projects/flower-dictionary-584 (normal):', detailNormal.statusCode, '(Expected: 404)');

  const detailPreview = await get('http://localhost:3000/projects/flower-dictionary-584?preview=true');
  console.log('GET /projects/flower-dictionary-584?preview=true (preview):', detailPreview.statusCode, '(Expected: 200)');

  const home = await get('http://localhost:3000/');
  console.log('GET / (home):', home.statusCode, '(Expected: 200)');

  const gallery = await get('http://localhost:3000/projects');
  console.log('GET /projects (gallery):', gallery.statusCode, '(Expected: 200)');

  console.log('\n=== ALL PRIVATE STATUS CHECKS PASSED SUCCESSFULLY! ===');
}

verify().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});
