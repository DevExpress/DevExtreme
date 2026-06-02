const { execFileSync, spawn } = require('child_process');
const { join } = require('path');
const os = require('os');
const {
  readdirSync, existsSync, readFileSync, writeFileSync, mkdirSync,
} = require('fs');
const http = require('http');

const DEMO_ROOT = join(__dirname, '..', '..');
const REPORT_DIR = join(DEMO_ROOT, 'csp-reports');
const SERVER_URL = process.env.CSP_SERVER_URL || 'http://localhost:8080';
const FRAMEWORK = (process.env.CSP_FRAMEWORKS || 'jQuery').trim();

// Use pre-built bundles from csp-bundle.js instead of the SystemJS dev demos.
const USE_BUNDLED = process.env.CSP_USE_BUNDLED === '1' || process.env.CSP_USE_BUNDLED === 'true';

const CORES = (typeof os.availableParallelism === 'function'
  ? os.availableParallelism()
  : (os.cpus() || []).length) || 1;
function defaultConcurrency() {
  if (FRAMEWORK === 'jQuery') return Math.max(2, Math.min(8, CORES));
  if (USE_BUNDLED) return Math.max(2, Math.min(8, CORES));
  return 2;
}
const DEFAULT_CONCURRENCY = defaultConcurrency();
const parsedConcurrency = parseInt(process.env.CSP_CONCURRENCY, 10);

const CONCURRENCY = parsedConcurrency > 0 ? parsedConcurrency : DEFAULT_CONCURRENCY;

const CSP_LISTENER_SOURCE = readFileSync(
  join(__dirname, '..', 'visual-tests', 'inject', 'csp-listener.js'),
  'utf8',
);

const RENDER_DEADLINE_MS = 30000;
const RETRY_DEADLINE_MS = (() => {
  const fromEnv = parseInt(process.env.CSP_RETRY_DEADLINE_MS, 10);
  return fromEnv > 0 ? fromEnv : 60000;
})();
const SETTLE_QUIET_MS = (() => {
  const fromEnv = parseInt(process.env.CSP_SETTLE_QUIET_MS, 10);
  return fromEnv > 0 ? fromEnv : 500;
})();
const SETTLE_MAX_MS = (() => {
  const fromEnv = parseInt(process.env.CSP_SETTLE_MAX_MS, 10);
  return fromEnv > 0 ? fromEnv : 5000;
})();

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

const DEBUG_PORT = 20222;
const CHROME_USER_DATA_DIR = process.env.CSP_CHROME_USER_DATA_DIR
  || join(os.tmpdir(), 'csp-chrome-shared');
const CHROME_DISK_CACHE_DIR = process.env.CSP_CHROME_DISK_CACHE_DIR
  || join(os.tmpdir(), 'csp-chrome-cache');
const CHROME_DISK_CACHE_SIZE = process.env.CSP_CHROME_DISK_CACHE_SIZE
  || '536870912';
const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

let browserChild = null;
let browserCdp = null;

function openCdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  const pending = new Map();
  const eventListeners = [];
  let msgId = 0;

  ws.addEventListener('message', ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.id !== undefined) {
      const cb = pending.get(msg.id);
      if (cb) {
        pending.delete(msg.id);
        cb(msg.result);
      }
    } else if (msg.method) {
      for (const fn of eventListeners) fn(msg.method, msg.params);
    }
  });

  return {
    ready: new Promise((resolve, reject) => {
      ws.addEventListener('open', () => resolve());
      ws.addEventListener('error', reject);
    }),
    send(method, params) {
      msgId += 1;
      const id = msgId;
      return new Promise((resolve) => {
        pending.set(id, resolve);
        ws.send(JSON.stringify({ id, method, params: params ?? {} }));
      });
    },
    on(fn) { eventListeners.push(fn); },
    onError(fn) { ws.addEventListener('error', fn); },
    close() { try { ws.close(); } catch { /* already closed */ } },
  };
}

async function startBrowser() {
  browserChild = spawn(CHROME_PATH, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-software-rasterizer',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${CHROME_USER_DATA_DIR}`,
    `--disk-cache-dir=${CHROME_DISK_CACHE_DIR}`,
    `--disk-cache-size=${CHROME_DISK_CACHE_SIZE}`,
  ], { stdio: 'ignore' });
  const info = await waitForDebugger(DEBUG_PORT);
  browserCdp = openCdp(info.webSocketDebuggerUrl);
  await browserCdp.ready;
}

function stopBrowser() {
  if (browserCdp) browserCdp.close();
  try { browserChild.kill('SIGKILL'); } catch { /* already dead */ }
}

async function waitForDebugger(port, maxWaitMs = 15000) {
  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline) {
    try {
      return await httpRequest(`http://127.0.0.1:${port}/json/version`);
    } catch {
      await delay(200);
    }
  }
  throw new Error(`Chrome debugger did not start on port ${port}`);
}

function findDemos() {
  const demosDirName = USE_BUNDLED ? 'csp-bundled-demos' : 'Demos';
  const demosDir = join(DEMO_ROOT, demosDirName);
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
          url: `${SERVER_URL}/apps/demos/${demosDirName}/${widget.name}/${demo.name}/${FRAMEWORK}/`,
          widget: widget.name,
          demo: demo.name,
          framework: FRAMEWORK,
        });
      }
    }
  }

  return result;
}

// Wait until the DOM is quiet after load so late-rendered resources fire their
// CSP violations before we snapshot, bounded by SETTLE_MAX_MS.
function waitForDomIdle(tab) {
  return tab.send('Runtime.evaluate', {
    awaitPromise: true,
    returnByValue: true,
    expression: `new Promise((resolve) => {
      let quietTimer;
      let obs;
      const hardCap = setTimeout(finish, ${SETTLE_MAX_MS});
      let done = false;
      function startQuietWatch() {
        obs = new MutationObserver(() => {
          clearTimeout(quietTimer);
          quietTimer = setTimeout(finish, ${SETTLE_QUIET_MS});
        });
        obs.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
        quietTimer = setTimeout(finish, ${SETTLE_QUIET_MS});
      }
      function whenLoaded() {
        if (document.readyState === 'complete') {
          startQuietWatch();
        } else {
          window.addEventListener('load', startQuietWatch, { once: true });
        }
      }
      whenLoaded();
      function finish() {
        if (done) return;
        done = true;
        clearTimeout(quietTimer);
        clearTimeout(hardCap);
        if (obs) obs.disconnect();
        requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(() => resolve(true), 50)));
      }
    })`,
  });
}

async function collectViolations(tab, url, renderDeadlineMs) {
  await tab.ready;
  await tab.send('Page.enable');
  await tab.send('Runtime.enable');

  // Capture page errors so a non-render reports why instead of "Nothing rendered".
  const STACK_LINES = 8;
  const pageErrors = [];
  tab.on((method, params) => {
    if (method === 'Runtime.exceptionThrown') {
      const d = (params && params.exceptionDetails) || {};
      const desc = (d.exception && (d.exception.description || d.exception.value)) || d.text;
      if (desc) {
        pageErrors.push(String(desc).split('\n').slice(0, STACK_LINES).join('\n'));
      } else {
        const frames = (d.stackTrace && d.stackTrace.callFrames) || [];
        const trace = frames.slice(0, STACK_LINES).map((f) => {
          const file = (f.url || '?').split('/').pop();
          return `    at ${f.functionName || '<anonymous>'} (${file}:${f.lineNumber + 1})`;
        }).join('\n');
        pageErrors.push(`uncaught exception${trace ? `\n${trace}` : ''}`);
      }
    } else if (method === 'Runtime.consoleAPICalled' && params && params.type === 'error') {
      const text = (params.args || []).map((a) => a.value || a.description || '').join(' ').trim();
      if (text) pageErrors.push(text.split('\n').slice(0, STACK_LINES).join('\n'));
    }
  });

  await tab.send('Page.addScriptToEvaluateOnNewDocument', { source: CSP_LISTENER_SOURCE });
  await tab.send('Page.navigate', { url });

  // Matches UI widgets (.dx-widget), viz widgets (<svg>) and new-gen widgets.
  const READY_SELECTOR = '.dx-widget, svg, .dx-cardview, .dx-pagination';
  const deadline = Date.now() + renderDeadlineMs;
  let rendered = false;
  while (Date.now() < deadline) {
    const evalRes = await tab.send('Runtime.evaluate', {
      expression: `!!document.querySelector(${JSON.stringify(READY_SELECTOR)})`,
      returnByValue: true,
    });
    if (evalRes && evalRes.result && evalRes.result.value) { rendered = true; break; }
    await delay(250);
  }

  if (!rendered) {
    const uniqueErrors = [...new Set(pageErrors)].slice(0, 2);
    const detail = uniqueErrors.length
      ? `\n      page error(s):\n${uniqueErrors
        .map((e) => e.split('\n').map((l) => `        ${l}`).join('\n'))
        .join('\n        --')}`
      : '';
    throw new Error(`Nothing rendered within ${renderDeadlineMs}ms for ${url}${detail}`);
  }

  await waitForDomIdle(tab);

  const res = await tab.send('Runtime.evaluate', {
    expression: 'JSON.stringify(window.__cspViolations || [])',
    returnByValue: true,
  });
  const raw = res && res.result && res.result.value;
  const all = raw ? JSON.parse(raw) : [];

  const seen = new Set();
  return all.filter((v) => {
    const key = `${v.effectiveDirective || v.violatedDirective}|${v.blockedURI}|${v.sourceFile}|${v.lineNumber}|${v.columnNumber}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function visitPage(url, renderDeadlineMs = RENDER_DEADLINE_MS) {
  const { targetId } = await browserCdp.send('Target.createTarget', { url: 'about:blank' });
  const tab = openCdp(`ws://127.0.0.1:${DEBUG_PORT}/devtools/page/${targetId}`);

  try {
    return await Promise.race([
      collectViolations(tab, url, renderDeadlineMs),
      new Promise((resolve, reject) => {
        tab.onError(() => reject(new Error(`Chrome WebSocket error for ${url}`)));
      }),
      delay(renderDeadlineMs + 10000).then(() => { throw new Error(`Timed out loading ${url}`); }),
    ]);
  } finally {
    tab.close();
    await browserCdp.send('Target.closeTarget', { targetId });
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

async function runPool(items, concurrency, fn) {
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < items.length) {
      const i = nextIndex;
      nextIndex += 1;
      await fn(items[i], i);
    }
  }
  const workerCount = Math.max(1, Math.min(concurrency || 1, items.length));
  const workers = [];
  for (let w = 0; w < workerCount; w += 1) {
    workers.push(worker());
  }
  await Promise.all(workers);
}

async function main() {
  console.log(`Chrome: ${CHROME_PATH}`);
  console.log(`Server: ${SERVER_URL}`);
  console.log(`Framework: ${FRAMEWORK}`);
  console.log(`Source: ${USE_BUNDLED ? 'csp-bundled-demos (production-style)' : 'Demos (SystemJS dev)'}`);
  console.log(`Concurrency: ${CONCURRENCY}\n`);

  const demos = findDemos();
  console.log(`Found ${demos.length} demo page(s) to check\n`);

  if (demos.length === 0) {
    console.log('No demos found. Exiting.');
    return;
  }

  let totalViolations = 0;
  let demosWithViolations = 0;
  let demosChecked = 0;
  const allViolations = [];

  function recordResult(demo, label, violations) {
    demosChecked += 1;
    if (violations.length > 0) {
      demosWithViolations += 1;
      totalViolations += violations.length;
      console.log(`  ❌ ${label} ${demo.widget}/${demo.demo}/${demo.framework} — ${violations.length} violation(s)`);
      for (const v of violations) {
        const blocked = v.blockedURI || 'N/A';
        const directive = v.effectiveDirective || v.violatedDirective || '?';
        console.log(`       ${directive}: ${blocked}`);
        allViolations.push({ ...v, framework: FRAMEWORK });
      }
    } else {
      console.log(`  ✅ ${label} ${demo.widget}/${demo.demo}/${demo.framework}`);
    }
  }

  let failed = [];

  await startBrowser();

  try {
    await runPool(demos, CONCURRENCY, async (demo, i) => {
      const idx = i + 1;
      try {
        const violations = await visitPage(demo.url);
        recordResult(demo, `[${idx}/${demos.length}]`, violations);
      } catch (err) {
        console.log(`  ⚠️ [${idx}/${demos.length}] ${demo.widget}/${demo.demo}/${demo.framework} — ${err.message} (will retry)`);
        failed.push(demo);
      }
    });

    if (failed.length > 0) {
      console.log(`\nRetrying ${failed.length} demo(s) sequentially (deadline ${RETRY_DEADLINE_MS}ms)...`);
      const toRetry = failed;
      failed = [];
      await runPool(toRetry, 1, async (demo, i) => {
        const label = `[retry ${i + 1}/${toRetry.length}]`;
        try {
          const violations = await visitPage(demo.url, RETRY_DEADLINE_MS);
          recordResult(demo, label, violations);
        } catch (err) {
          console.log(`  ❌ ${label} ${demo.widget}/${demo.demo}/${demo.framework} — ${err.message}`);
          failed.push(demo);
        }
      });
    }
  } finally {
    stopBrowser();
  }

  // Suffix the report filename per shard so parallel jobs don't overwrite it.
  const shardTotal = Math.max(1, parseInt(process.env.CSP_SHARD_TOTAL, 10) || 1);
  const shardIndex = parseInt(process.env.CSP_SHARD_INDEX, 10) || 1;
  const reportSuffix = shardTotal > 1 ? `-shard${shardIndex}` : '';
  const reportFile = join(REPORT_DIR, `csp-violations-${FRAMEWORK.toLowerCase()}${reportSuffix}.jsonl`);

  if (allViolations.length > 0) {
    mkdirSync(REPORT_DIR, { recursive: true });
    const lines = allViolations.map((v) => JSON.stringify(v)).join('\n');
    writeFileSync(reportFile, `${lines}\n`);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Framework: ${FRAMEWORK}`);
  console.log(`Demos checked: ${demosChecked}/${demos.length}`);
  console.log(`Demos with violations: ${demosWithViolations}`);
  console.log(`Total violations: ${totalViolations}`);

  if (failed.length > 0) {
    console.log(`\n❌ ${failed.length}/${demos.length} demo(s) failed to render and were NOT CSP-checked:`);
    for (const demo of failed) {
      console.log(`     ${demo.widget}/${demo.demo}/${demo.framework}`);
    }
    process.exitCode = 1;
    return;
  }

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
