// scripts/index-now.js
const fs = require('fs');
const path = require('path');

const HOST = 'www.formilo.in';
const API_KEY = 'formilo_index_engine_2026';
const KEY_LOCATION = `https://${HOST}/${API_KEY}.txt`;

// Load all programmatic exam routes
const examDataPath = path.join(__dirname, '../data/exam-presets.json');
const examTools = JSON.parse(fs.readFileSync(examDataPath, 'utf8'));

const urlList = [
  `https://${HOST}/`,
  `https://${HOST}/form-tools`,
  `https://${HOST}/photo-tools`,
  `https://${HOST}/signature-tools`,
  `https://${HOST}/pdf-tools`,
  ...examTools.map((t) => `https://${HOST}/exam/${t.slug}`)
];

async function submitIndexNow() {
  console.log(`Pinging search engines with ${urlList.length} live URLs...`);

  const payload = {
    host: HOST,
    key: API_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urlList
  };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (res.status === 200 || res.status === 202) {
      console.log('✅ IndexNow batch ping successful! Search engines notified.');
    } else {
      console.log(`Ping response status: ${res.status}`);
    }
  } catch (err) {
    console.error('Indexing ping error:', err.message);
  }
}

submitIndexNow();
