const { execFile } = require('child_process');
const { join } = require('path');
const {
  readdirSync, existsSync, writeFileSync, mkdirSync,
} = require('fs');
const http = require('http');

const DEMO_ROOT = join(__dirname, '..', '..');
const REPORT_DIR = join(DEMO_ROOT, 'csp-reports');
const SERVER_URL = process.env.CSP_SERVER_URL || 'http://localhost:8080';
const FRAMEWORK = (process.env.CSP_FRAMEWORKS || 'jQuery').trim();
const CONCURRENCY = parseInt(process.env.CSP_CONCURRENCY, 10) || 8;

const CHROME_PATH = process.env.CHROME_PATH || 'google-chrome-stable';

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
  return new Promise((resolve) => {
    const child = execFile(CHROME_PATH, [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-dev-shm-usage',
      '--screenshot=/dev/null',
      '--window-size=100,100',
      url,
    ], { timeout: 30000 }, () => resolve());
    child.on('error', () => resolve());
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

  mkdirSync(REPORT_DIR, { recursive: true });
  const reportFile = join(REPORT_DIR, `csp-violations-${FRAMEWORK.toLowerCase()}.jsonl`);

  let totalViolations = 0;
  let demosWithViolations = 0;
  const allViolations = [];

  for (let batchStart = 0; batchStart < demos.length; batchStart += CONCURRENCY) {
    const batch = demos.slice(batchStart, batchStart + CONCURRENCY);

    await httpRequest(`${SERVER_URL}/csp-violations`, 'DELETE');

    await Promise.all(batch.map((demo) => visitPage(demo.url)));

    await new Promise((resolve) => { setTimeout(resolve, 500); });

    const result = await httpRequest(`${SERVER_URL}/csp-violations`);
    const violations = result.violations || [];

    const violationsByUrl = {};
    for (const v of violations) {
      const uri = v.documentUri || '';
      if (!violationsByUrl[uri]) violationsByUrl[uri] = [];
      violationsByUrl[uri].push(v);
    }

    for (let j = 0; j < batch.length; j += 1) {
      const demo = batch[j];
      const idx = batchStart + j + 1;
      const demoViolations = violationsByUrl[demo.url]
        || violationsByUrl[`${demo.url}index.html`]
        || [];

      if (demoViolations.length > 0) {
        demosWithViolations += 1;
        totalViolations += demoViolations.length;

        console.log(`  ❌ [${idx}/${demos.length}] ${demo.widget}/${demo.demo}/${demo.framework} — ${demoViolations.length} violation(s)`);
        for (const v of demoViolations) {
          const blocked = v.blockedUri || 'N/A';
          const directive = v.effectiveDirective || v.violatedDirective || '?';
          console.log(`       ${directive}: ${blocked}`);
          allViolations.push({ ...v, framework: FRAMEWORK });
        }
      } else {
        console.log(`  ✅ [${idx}/${demos.length}] ${demo.widget}/${demo.demo}/${demo.framework}`);
      }
    }
  }

  if (allViolations.length > 0) {
    const lines = allViolations.map((v) => JSON.stringify(v)).join('\n');
    writeFileSync(reportFile, `${lines}\n`);
  } else {
    writeFileSync(reportFile, '');
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
