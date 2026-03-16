const { execFile, execFileSync } = require('child_process');
const { join } = require('path');
const {
  readdirSync, existsSync, writeFileSync, mkdirSync,
} = require('fs');
const http = require('http');

const DEMO_ROOT = join(__dirname, '..', '..');
const REPORT_DIR = join(DEMO_ROOT, 'csp-reports');
const SERVER_URL = process.env.CSP_SERVER_URL || 'http://localhost:8080';
const FRAMEWORK = (process.env.CSP_FRAMEWORKS || 'jQuery').trim();
const CONCURRENCY = parseInt(process.env.CSP_CONCURRENCY, 10) || 10;

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

const CHROME_PATH = findChrome();

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
    let demos = [];

    demos = readdirSync(widgetDir, { withFileTypes: true })
      .filter((d) => d.isDirectory());

    for (const demo of demos) {
      const fwDir = join(widgetDir, demo.name, FRAMEWORK);
      if (existsSync(join(fwDir, 'index.html'))) {
        result.push({
          url: `${SERVER_URL}/apps/demos/Demos/${widget.name}/${demo.name}/${FRAMEWORK}/`,
          widget: widget.name,
          demo: demo.name,
          framework: FRAMEWORK,
        });
      }
    }
  }

  return result;
}

function visitPage(url) {
  return new Promise((resolve, reject) => {
    const child = execFile(CHROME_PATH, [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-dev-shm-usage',
      '--dump-dom',
      '--virtual-time-budget=2000',
      '--window-size=100,100',
      url,
    ], { timeout: 50000, killSignal: 'SIGKILL' }, (error) => {
      if (error && error.killed) {
        reject(new Error(`Chrome timed out for ${url}`));
      } else {
        resolve();
      }
    });
    child.on('error', (err) => {
      reject(new Error(`Failed to launch Chrome at "${CHROME_PATH}": ${err.message}`));
    });
  });
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

async function runPool(items, concurrency, fn) {
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < items.length) {
      const i = nextIndex;
      nextIndex += 1;
      await fn(items[i], i);
    }
  }
  const workers = [];
  for (let w = 0; w < Math.min(concurrency, items.length); w += 1) {
    workers.push(worker());
  }
  await Promise.all(workers);
}

async function main() {
  console.log(`Chrome: ${CHROME_PATH}`);
  console.log(`Server: ${SERVER_URL}`);
  console.log(`Framework: ${FRAMEWORK}`);
  console.log(`Concurrency: ${CONCURRENCY}\n`);

  const demos = findDemos();
  console.log(`Found ${demos.length} demo page(s) to check\n`);

  if (demos.length === 0) {
    console.log('No demos found. Exiting.');
    return;
  }

  let totalViolations = 0;
  let demosWithViolations = 0;
  const allViolations = [];

  await httpRequest(`${SERVER_URL}/csp-violations`, 'DELETE');

  await runPool(demos, CONCURRENCY, async (demo, i) => {
    const idx = i + 1;
    try {
      await visitPage(demo.url);
    } catch (err) {
      console.log(`  ⚠️ [${idx}/${demos.length}] ${demo.widget}/${demo.demo}/${demo.framework} — ${err.message}`);
      return;
    }

    const result = await httpRequest(`${SERVER_URL}/csp-violations`);
    const violations = (result.violations || []).filter(
      (v) => v.documentUri === demo.url || v.documentUri === `${demo.url}index.html`,
    );

    if (violations.length > 0) {
      demosWithViolations += 1;
      totalViolations += violations.length;

      console.log(`  ❌ [${idx}/${demos.length}] ${demo.widget}/${demo.demo}/${demo.framework} — ${violations.length} violation(s)`);
      for (const v of violations) {
        const blocked = v.blockedUri || 'N/A';
        const directive = v.effectiveDirective || v.violatedDirective || '?';
        console.log(`       ${directive}: ${blocked}`);
        allViolations.push({ ...v, framework: FRAMEWORK });
      }
    } else {
      console.log(`  ✅ [${idx}/${demos.length}] ${demo.widget}/${demo.demo}/${demo.framework}`);
    }
  });

  const reportFile = join(REPORT_DIR, `csp-violations-${FRAMEWORK.toLowerCase()}.jsonl`);

  if (allViolations.length > 0) {
    mkdirSync(REPORT_DIR, { recursive: true });
    const lines = allViolations.map((v) => JSON.stringify(v)).join('\n');
    writeFileSync(reportFile, `${lines}\n`);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Framework: ${FRAMEWORK}`);
  console.log(`Demos checked: ${demos.length}`);
  console.log(`Demos with violations: ${demosWithViolations}`);
  console.log(`Total violations: ${totalViolations}`);

  if (totalViolations > 0) {
    console.log(`\n⚠️  ${totalViolations} CSP violation(s) detected in ${demosWithViolations} demo(s)`);
    console.log(`Report: ${reportFile}`);
    process.exitCode = 1;
  } else {
    console.log('\n✅ No CSP violations detected');
  }
}

main().catch((err) => {
  console.error('CSP check failed:', err.message);
  process.exit(1);
});
