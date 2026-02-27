/* eslint-disable no-console */
const { execFileSync } = require('child_process');
const { join } = require('path');
const {
  readdirSync, existsSync, writeFileSync, mkdirSync,
} = require('fs');
const http = require('http');

const DEMO_ROOT = join(__dirname, '..', '..');
const REPORT_DIR = join(DEMO_ROOT, 'csp-reports');
const SERVER_URL = process.env.CSP_SERVER_URL || 'http://localhost:8080';
const FRAMEWORKS = (process.env.CSP_FRAMEWORKS || 'jQuery').split(',').map((f) => f.trim());

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'google-chrome-stable',
    'google-chrome',
    'chromium-browser',
    'chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      if (candidate.startsWith('/')) {
        execFileSync('test', ['-x', candidate], { stdio: 'ignore' });
      } else {
        execFileSync('which', [candidate], { stdio: 'ignore' });
      }
      return candidate;
    } catch {
      // try next candidate
    }
  }
  throw new Error('Chrome not found. Set CHROME_PATH environment variable.');
}

function findDemos() {
  const demosDir = join(DEMO_ROOT, 'Demos');
  const result = [];

  if (!existsSync(demosDir)) {
    console.error(`Demos directory not found: ${demosDir}`);
    return result;
  }

  const widgets = readdirSync(demosDir, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  for (const widget of widgets) {
    const widgetDir = join(demosDir, widget.name);
    let demos;
    try {
      demos = readdirSync(widgetDir, { withFileTypes: true })
        .filter((d) => d.isDirectory());
    } catch {
      continue;
    }

    for (const demo of demos) {
      for (const fw of FRAMEWORKS) {
        const fwDir = join(widgetDir, demo.name, fw);
        if (existsSync(join(fwDir, 'index.html'))) {
          result.push({
            url: `${SERVER_URL}/apps/demos/Demos/${widget.name}/${demo.name}/${fw}/`,
            widget: widget.name,
            demo: demo.name,
            framework: fw,
          });
        }
      }
    }
  }

  return result;
}

function visitPage(chromePath, url) {
  try {
    execFileSync(chromePath, [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-dev-shm-usage',
      '--screenshot=/tmp/csp_check.png',
      '--window-size=100,100',
      url,
    ], { timeout: 30000, stdio: 'ignore' });
  } catch {
    // timeout or crash — continue to next page
  }
}

function httpRequest(url, method) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, { method: method || 'GET' }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  const chromePath = findChrome();
  console.log(`Chrome: ${chromePath}`);
  console.log(`Server: ${SERVER_URL}`);
  console.log(`Frameworks: ${FRAMEWORKS.join(', ')}\n`);

  // Clear previous violations on server
  await httpRequest(`${SERVER_URL}/csp-violations`, 'DELETE');

  const demos = findDemos();
  console.log(`Found ${demos.length} demo page(s) to check\n`);

  if (demos.length === 0) {
    console.log('No demos found. Exiting.');
    return;
  }

  let checked = 0;
  for (const demo of demos) {
    checked += 1;
    if (checked % 50 === 0 || checked === demos.length || checked === 1) {
      console.log(`  [${checked}/${demos.length}] ${demo.widget}/${demo.demo}/${demo.framework}`);
    }
    visitPage(chromePath, demo.url);
  }

  // Wait for in-flight CSP reports to arrive at the server
  console.log('\nWaiting for remaining CSP reports...');
  await new Promise((resolve) => { setTimeout(resolve, 3000); });

  // Fetch violations from CSP server
  const result = await httpRequest(`${SERVER_URL}/csp-violations`);
  const violations = result.violations || [];

  // Write JSONL report
  mkdirSync(REPORT_DIR, { recursive: true });
  const reportFile = join(REPORT_DIR, 'csp-violations.jsonl');

  if (violations.length > 0) {
    const lines = violations.map((v) => JSON.stringify(v)).join('\n');
    writeFileSync(reportFile, `${lines}\n`);
    console.log(`\n⚠️  ${violations.length} CSP violation(s) detected`);
  } else {
    writeFileSync(reportFile, '');
    console.log('\n✅ No CSP violations detected');
  }
}

main().catch((err) => {
  console.error('CSP check failed:', err.message);
  process.exit(1);
});
