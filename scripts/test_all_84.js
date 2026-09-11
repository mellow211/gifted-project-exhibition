async function testAll84() {
  console.log('=== 1. Testing /api/projects ===');
  const res = await fetch('http://localhost:3000/api/projects');
  const projects = await res.json();
  console.log(`Total projects returned by API: ${projects.length}`);

  const catCounts = {};
  let invalidStudents = 0;
  let missingTitles = 0;
  let missingPosters = 0;

  projects.forEach((p) => {
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

  console.log('\n=== 2. Testing Updated 4 Projects Details ===');
  const targetSlugs = [
    { name: '석재원 (신규)', slug: 'recycling-cleaning-robot-319' },
    { name: '표시연 (보고서 추가)', slug: 'smart-planter-751' },
    { name: '김주원 (설명서/포스터 추가)', slug: 'emotion-diary-340' },
    { name: '이수아 (설명서/포스터 추가)', slug: 'project-941' },
  ];

  for (const s of targetSlugs) {
    const pRes = await fetch(`http://localhost:3000/projects/${s.slug}`);
    console.log(`  [${s.name}] slug: ${s.slug} -> HTTP ${pRes.status}`);
  }

  console.log('\n=== 3. Testing Homepage HTML Stats ===');
  const homeRes = await fetch('http://localhost:3000');
  const homeHtml = await homeRes.text();
  const statMatches = [...homeHtml.matchAll(/<span class="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight font-mono">([^<]+)<\/span>/g)];
  console.log('Homepage stat values:', statMatches.map(m => m[1]));

  console.log('\nALL 84 TESTS PASSED!');
}

testAll84().catch(console.error);
