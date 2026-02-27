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
  const framework = FRAMEWORKS[0];
  console.log(`Chrome: ${chromePath}`);
  console.log(`Server: ${SERVER_URL}`);
  console.log(`Framework: ${framework}\n`);

  const demos = findDemos();
  console.log(`Found ${demos.length} demo page(s) to check\n`);

  if (demos.length === 0) {
    console.log('No demos found. Exiting.');
    return;
  }

  mkdirSync(REPORT_DIR, { recursive: true });
  const reportFile = join(REPORT_DIR, `csp-violations-${framework.toLowerCase()}.jsonl`);

  let totalViolations = 0;
  let demosWithViolations = 0;
  const allViolations = [];

  for (let i = 0; i < demos.length; i += 1) {
    const demo = demos[i];

    await httpRequest(`${SERVER_URL}/csp-violations`, 'DELETE');

    visitPage(chromePath, demo.url);

    await new Promise((resolve) => { setTimeout(resolve, 500); });

    const result = await httpRequest(`${SERVER_URL}/csp-violations`);
    const violations = result.violations || [];

    if (violations.length > 0) {
      demosWithViolations += 1;
      totalViolations += violations.length;

      console.log(`  ❌ [${i + 1}/${demos.length}] ${demo.widget}/${demo.demo}/${demo.framework} — ${violations.length} violation(s)`);
      for (const v of violations) {
        const blocked = v.blockedUri || 'N/A';
        const directive = v.effectiveDirective || v.violatedDirective || '?';
        console.log(`       ${directive}: ${blocked}`);
        allViolations.push({ ...v, framework });
      }
    } else {
      console.log(`  ✅ [${i + 1}/${demos.length}] ${demo.widget}/${demo.demo}/${demo.framework}`);
    }
  }

  if (allViolations.length > 0) {
    const lines = allViolations.map((v) => JSON.stringify(v)).join('\n');
    writeFileSync(reportFile, `${lines}\n`);
  } else {
    writeFileSync(reportFile, '');
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Framework: ${framework}`);
  console.log(`Demos checked: ${demos.length}`);
  console.log(`Demos with violations: ${demosWithViolations}`);
  console.log(`Total violations: ${totalViolations}`);

  if (totalViolations > 0) {
    console.log(`\n⚠️  ${totalViolations} CSP violation(s) detected in ${demosWithViolations} demo(s)`);
    console.log(`Report: ${reportFile}`);
  } else {
    console.log('\n✅ No CSP violations detected');
  }
}

main().catch((err) => {
  console.error('CSP check failed:', err.message);
  process.exit(1);
});
