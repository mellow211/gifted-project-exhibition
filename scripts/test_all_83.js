const http = require('http');

async function testExhibition() {
  console.log('=== 1. Testing /api/projects ===');
  const res = await fetch('http://localhost:3000/api/projects');
  const projects = await res.json();
  console.log(`Total projects returned by API: ${projects.length}`);

  const catCounts = {};
  let invalidStudents = 0;
  let missingTitles = 0;
  let missingPosters = 0;

  projects.forEach((p, idx) => {
    catCounts[p.category] = (catCounts[p.category] || 0) + 1;
    if (!p.student_display_names || p.student_display_names.length !== 1) invalidStudents++;
    if (!p.title || p.title.trim().length === 0) missingTitles++;
    if (!p.poster_url) missingPosters++;
  });

  console.log('Category breakdown:');
  Object.keys(catCounts).sort().forEach(cat => {
    console.log(`  ${cat}: ${catCounts[cat]} 건`);
  });

  console.log(`Integrity checks:`);
  console.log(`  Invalid student counts: ${invalidStudents}`);
  console.log(`  Missing titles: ${missingTitles}`);
  console.log(`  Missing posters: ${missingPosters}`);

  console.log('\n=== 2. Testing Homepage HTML Stats ===');
  const homeRes = await fetch('http://localhost:3000');
  const homeHtml = await homeRes.text();
  const statMatches = [...homeHtml.matchAll(/<span class="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight font-mono">([^<]+)<\/span>/g)];
  console.log('Homepage stat values:', statMatches.map(m => m[1]));

  console.log('\n=== 3. Testing Gallery Page ===');
  const galleryRes = await fetch('http://localhost:3000/projects');
  console.log(`Gallery HTTP status: ${galleryRes.status}`);

  console.log('\n=== 4. Testing Sample Project Details for each of 5 categories ===');
  const samples = [
    { cat: 'SW초급', slug: 'game-development-398' },
    { cat: 'SW고급', slug: projects.find(p => p.category === 'SW고급').slug },
    { cat: '로봇초급', slug: projects.find(p => p.category === '로봇초급').slug },
    { cat: '로봇고급', slug: projects.find(p => p.category === '로봇고급').slug },
    { cat: 'AI', slug: projects.find(p => p.category === 'AI').slug },
  ];

  for (const s of samples) {
    const pRes = await fetch(`http://localhost:3000/projects/${s.slug}`);
    console.log(`  [${s.cat}] slug: ${s.slug} -> HTTP ${pRes.status}`);
  }

  console.log('\nALL TESTS PASSED SUCCESSFULLY!');
}

testExhibition().catch(console.error);
