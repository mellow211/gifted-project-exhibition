const fs = require('fs');
const http = require('http');

async function run() {
  console.log('=== VERIFYING 85 PROJECTS ===');
  const store = JSON.parse(fs.readFileSync('data/projects-store.json', 'utf8'));
  console.log('Total store projects:', store.length);
  if (store.length !== 85) throw new Error('Expected 85 projects, got ' + store.length);

  // Categories
  const cats = {};
  store.forEach(p => {
    cats[p.category] = (cats[p.category] || 0) + 1;
  });
  console.log('Category distribution:', cats);

  // Check unique thumbnails
  const thumbs = new Set();
  const dupThumbs = [];
  store.forEach(p => {
    if (thumbs.has(p.thumbnail_url)) {
      dupThumbs.push({ slug: p.slug, thumb: p.thumbnail_url });
    }
    thumbs.add(p.thumbnail_url);
  });
  if (dupThumbs.length > 0) {
    console.error('Duplicate thumbnails found:', dupThumbs);
  } else {
    console.log('Unique thumbnails check: PASSED (All 85 unique)');
  }

  // Check new project: flower-dictionary-584
  const jang = store.find(p => p.slug === 'flower-dictionary-584');
  if (!jang) throw new Error('flower-dictionary-584 not found in store!');
  console.log('Jang Hye-rin project found:', {
    title: jang.title,
    student: jang.student_display_names,
    category: jang.category,
    team: jang.team_name,
    poster: jang.poster_url,
    report: jang.report_url,
    manual: jang.manual_url,
  });

  // Verify file existence
  const filesToCheck = [
    'public' + jang.poster_url,
    'public' + jang.report_url,
    'public' + jang.manual_url,
  ];
  filesToCheck.forEach(f => {
    if (!fs.existsSync(f)) throw new Error('Missing file: ' + f);
    console.log('File verified:', f, fs.statSync(f).size, 'bytes');
  });

  // Test dev server endpoints
  const testUrls = [
    'http://localhost:3000/api/projects',
    'http://localhost:3000/projects/flower-dictionary-584',
    'http://localhost:3000/'
  ];

  for (const url of testUrls) {
    const res = await fetch(url);
    console.log('Endpoint:', url, '-> Status:', res.status);
    if (res.status !== 200) throw new Error(`URL ${url} returned ${res.status}`);
  }

  // Check API project count
  const apiData = await fetch('http://localhost:3000/api/projects').then(r => r.json());
  console.log('API returned projects count:', apiData.length);
  if (apiData.length !== 85) throw new Error('API expected 85, got ' + apiData.length);

  console.log('=== ALL 85 PROJECT TESTS PASSED PERFECTLY ===');
}

run().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});
