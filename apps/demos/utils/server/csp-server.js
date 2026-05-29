/* eslint-disable import/no-extraneous-dependencies */

const crypto = require('crypto');
const express = require('express');
const cookieParser = require('cookie-parser');
const { join, resolve } = require('path');
const { readFileSync, readdirSync } = require('fs');
const RateLimit = require('express-rate-limit');

const root = join(__dirname, '..', '..', '..', '..');
const indexFileName = 'index.html';
const port = process.argv[2] ?? 8080;
const host = process.env.CSP_SERVER_HOST || '127.0.0.1';

const cspViolations = [];
let cspViolationIdCounter = 0;

const CSP_BASE_DIRECTIVES = {
  'default-src': ["'none'"],
  'script-src': ["'self'", 'https://esm.sh', 'https://cdnjs.cloudflare.com', 'https://cdn.jsdelivr.net'],
  'style-src': ["'self'", 'https://maxcdn.bootstrapcdn.com'],
  'img-src': ["'self'"],
  'font-src': ["'self'"],
  'connect-src': ["'self'", 'https://js.devexpress.com', 'https://demos.devexpress.com'],
  'worker-src': ["'self'"],
  'frame-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'none'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
};

const CSP_DEMO_ALLOWLIST = {
  'Button/Icons': {
    'font-src': ['https://maxcdn.bootstrapcdn.com'],
  },
  'CardView/WebAPIService': {
    'img-src': ['data:'],
  },
  // Azure Maps SDK: inline styles, blob workers, data: images,
  // and font glyphs from atlas.microsoft.com
  Map: {
    'script-src': ['https://atlas.microsoft.com'],
    'style-src': ["'unsafe-inline'"],
    'connect-src': ['https://atlas.microsoft.com'],
    'worker-src': ['blob:'],
    'img-src': ['data:'],
    'font-src': ['https://atlas.microsoft.com'],
  },
  'DataGrid/CollaborativeEditing': {
    'connect-src': ['wss://js.devexpress.com'],
  },
  'Charts/SignalRService': {
    'connect-src': ['wss://js.devexpress.com'],
  },
  'Charts/SpiderWeb': {
    'font-src': ['https://fonts.gstatic.com'],
  },
  'Common/ListsOverview': {
    'img-src': ['data:'],
  },
  'DataGrid/SignalRService': {
    'connect-src': ['wss://js.devexpress.com'],
  },
  'Scheduler/SignalRService': {
    'connect-src': ['wss://js.devexpress.com'],
  },
  'DataGrid/Cell': {
    'img-src': ['data:'],
  },
  // AI demo: inline <script type="module"> to import OpenAI SDK from esm.sh. Cannot move to a separate file or index.js
  'DataGrid/AIColumns': {
    'script-src': ["'unsafe-inline'"],
    'connect-src': ['https://public-api.devexpress.com'],
  },
  'DataGrid/ExcelJSExportImages': {
    'img-src': ['data:'],
  },
  'DataGrid/InfiniteScrolling': {
    'img-src': ['data:'],
  },
  'DataGrid/LocalReordering': {
    'img-src': ['data:'],
  },
  'DataGrid/PDFExportImages': {
    'img-src': ['data:'],
  },
  'DataGrid/RemoteCRUDOperations': {
    'img-src': ['data:'],
  },
  'DataGrid/RemoteGrouping': {
    'img-src': ['data:'],
  },
  'DataGrid/RemoteReordering': {
    'img-src': ['data:'],
  },
  'DataGrid/RemoteVirtualScrolling': {
    'img-src': ['data:'],
  },
  'DataGrid/VirtualScrolling': {
    'img-src': ['data:'],
  },
  'DataGrid/WebAPIService': {
    'img-src': ['data:'],
  },
  Gantt: {
    'img-src': ['data:'],
  },
  Diagram: {
    'img-src': ['data:'],
  },
  Drawer: {
    'font-src': ['https://maxcdn.bootstrapcdn.com'],
  },
  FilterBuilder: {
    'font-src': ['https://maxcdn.bootstrapcdn.com'],
  },
  FileManager: {
    'img-src': ['data:'],
  },
  'Resizable/Overview': {
    'img-src': ['data:'],
  },
  'SelectBox/Grouping': {
    'font-src': ['https://maxcdn.bootstrapcdn.com'],
  },
  'SelectBox/SearchAndEditing': {
    'font-src': ['https://maxcdn.bootstrapcdn.com'],
  },
  'Scheduler/GoogleCalendarIntegration': {
    'connect-src': ['https://www.googleapis.com'],
  },
  'Scheduler/CellTemplates': {
    'img-src': ['data:'],
  },
  'ScrollView/Overview': {
    'img-src': ['data:'],
  },
  'Slider/Overview': {
    'font-src': ['https://maxcdn.bootstrapcdn.com'],
  },
  'Sortable/Customization': {
    'font-src': ['https://maxcdn.bootstrapcdn.com'],
  },
  'TagBox/Grouping': {
    'font-src': ['https://maxcdn.bootstrapcdn.com'],
  },
  // AI demos use inline <script type="module"> to import OpenAI SDK from esm.sh. Cannot move to a separate file or index.js
  'TreeList/AIColumns': {
    'connect-src': ['https://public-api.devexpress.com'],
    'script-src': ["'unsafe-inline'"],
  },
  'TreeList/BatchEditing': {
    'img-src': ['data:'],
  },
  'TreeList/CellEditing': {
    'img-src': ['data:'],
  },
  'TreeList/FixedAndStickyColumns': {
    'img-src': ['data:'],
  },
  'TreeList/FocusedRow': {
    'img-src': ['data:'],
  },
  'TreeList/MultipleSorting': {
    'img-src': ['data:'],
  },
  'TreeList/SearchPanel': {
    'img-src': ['data:'],
  },
  'TreeList/WebAPIService': {
    'img-src': ['data:'],
  },
  'TreeList/Overview': {
    'img-src': ['data:'],
  },
  // globalize/message.js uses new Function() internally
  'Localization/UsingGlobalize': {
    'script-src': ["'unsafe-eval'"],
  },
  // AI demo: inline <script type="module"> for OpenAI SDK + eval() used by the SDK
  'Form/SmartPaste': {
    'script-src': ["'unsafe-inline'", "'unsafe-eval'"],
  },
  // AI demo: inline <script type="module"> to import OpenAI SDK from esm.sh
  'HtmlEditor/AITextEditing': {
    'script-src': ["'unsafe-inline'"],
  },
  // Inline <script type="module"> to import remark/rehype from esm.sh
  'HtmlEditor/MarkdownSupport': {
    'script-src': ["'unsafe-inline'"],
  },
  // AI demo: inline <script type="module"> to import OpenAI SDK from esm.sh
  'Chat/AIAndChatbotIntegration': {
    'script-src': ["'unsafe-inline'"],
  },
};

// Framework-specific overrides (e.g. Font Awesome loaded only in React/Vue demos)
const CSP_FRAMEWORK_ALLOWLIST = {
  React: {
    Calendar: { 'font-src': ['https://maxcdn.bootstrapcdn.com'] },
    CheckBox: { 'font-src': ['https://maxcdn.bootstrapcdn.com'] },
    'DateRangeBox/Overview': { 'font-src': ['https://maxcdn.bootstrapcdn.com'] },
    Diagram: { 'font-src': ['https://maxcdn.bootstrapcdn.com'] },
    Form: { 'font-src': ['https://maxcdn.bootstrapcdn.com'] },
    'Lookup/Templates': { 'font-src': ['https://maxcdn.bootstrapcdn.com'] },
  },
  Vue: {
    Calendar: { 'font-src': ['https://maxcdn.bootstrapcdn.com'] },
    CheckBox: { 'font-src': ['https://maxcdn.bootstrapcdn.com'] },
    Diagram: { 'font-src': ['https://maxcdn.bootstrapcdn.com'] },
    Form: { 'font-src': ['https://maxcdn.bootstrapcdn.com'] },
    'Lookup/Templates': { 'font-src': ['https://maxcdn.bootstrapcdn.com'] },
  },
};

function generateNonce() {
  return crypto.randomBytes(16).toString('base64');
}

function buildCspHeader(demoKey, nonce, framework) {
  const directives = {};
  for (const [key, values] of Object.entries(CSP_BASE_DIRECTIVES)) {
    directives[key] = [...values];
  }

  if (nonce) {
    directives['script-src'].push(`'nonce-${nonce}'`);
    // Allow scripts dynamically created by nonced scripts (e.g. SystemJS module evaluation)
    directives['script-src'].push("'strict-dynamic'");
  }

  const widgetKey = demoKey && demoKey.split('/')[0];
  const frameworkList = framework && CSP_FRAMEWORK_ALLOWLIST[framework];
  const allowlists = [
    demoKey && CSP_DEMO_ALLOWLIST[demoKey],
    widgetKey && CSP_DEMO_ALLOWLIST[widgetKey],
    frameworkList && demoKey && frameworkList[demoKey],
    frameworkList && widgetKey && frameworkList[widgetKey],
  ].filter(Boolean);

  for (const allowlist of allowlists) {
    for (const [key, values] of Object.entries(allowlist)) {
      if (directives[key]) {
        directives[key].push(...values);
      } else {
        directives[key] = [...values];
      }
    }
  }

  const parts = Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`);
  parts.push('report-uri /csp-report');
  return parts.join('; ');
}

function getDemoKey(url) {
  const match = url.match(/\/Demos\/([^/]+)\/([^/]+)\//);
  return match ? `${match[1]}/${match[2]}` : null;
}

function getFramework(url) {
  const match = url.match(/\/Demos\/[^/]+\/[^/]+\/([^/]+)/);
  return match ? match[1] : null;
}

function cspMiddleware(req, res, next) {
  const demoKey = getDemoKey(req.path);
  const framework = getFramework(req.path);

  // Angular, React & Vue demos use inline <script> for SystemJS — allow via nonce
  const needsNonce = framework === 'Angular' || framework === 'React' || framework === 'Vue';
  const nonce = needsNonce ? generateNonce() : null;
  if (nonce) {
    res.locals.cspNonce = nonce;
  }

  res.setHeader('Content-Security-Policy', buildCspHeader(demoKey, nonce, framework));
  next();
}

function cspReportHandler(req, res) {
  let body = '';
  req.on('data', (chunk) => { body += chunk.toString(); });
  req.on('end', () => {
    try {
      const report = JSON.parse(body);
      const violation = report['csp-report'] || report;
      cspViolationIdCounter += 1;
      cspViolations.push({
        id: cspViolationIdCounter,
        timestamp: new Date().toISOString(),
        documentUri: violation['document-uri'],
        blockedUri: violation['blocked-uri'],
        violatedDirective: violation['violated-directive'],
        effectiveDirective: violation['effective-directive'],
        originalPolicy: violation['original-policy'],
        sourceFile: violation['source-file'],
        lineNumber: violation['line-number'],
        columnNumber: violation['column-number'],
        statusCode: violation['status-code'],
      });
    } catch (e) {
      console.error('Failed to parse CSP report:', e.message);
    }
    res.status(204).end();
  });
}

function cspViolationsHandler(req, res) {
  const since = parseInt(req.query.since, 10) || 0;
  const filtered = cspViolations.filter((v) => v.id > since);
  res.json({
    violations: filtered,
    lastId: cspViolationIdCounter,
    total: cspViolations.length,
  });
}

function cspViolationsClearHandler(_req, res) {
  cspViolations.length = 0;
  cspViolationIdCounter = 0;
  res.status(204).end();
}

const demosBaseDir = resolve(root, 'apps', 'demos', 'Demos');

const demoIndexHandler = (request, response) => {
  const { widget, name, approach } = request.params;
  const fileSystemPath = resolve(demosBaseDir, widget, name, approach, indexFileName);

  if (!fileSystemPath.startsWith(demosBaseDir)) {
    response.status(403).send('Forbidden');
    return;
  }
  let fileContent;
  try {
    fileContent = readFileSync(fileSystemPath).toString();
  } catch {
    response.status(404).send('Not Found');
    return;
  }

  const cookieTheme = request.cookies['dx-demo-theme'];
  const cssDirectory = join(root, 'node_modules', 'devextreme', 'dist', 'css');
  let availableThemes = [];
  try {
    availableThemes = readdirSync(cssDirectory).filter((f) => /^dx\.(?!common).*\.css$/i.test(f));
  } catch { /* css directory may not exist */ }

  if (cookieTheme && availableThemes.includes(cookieTheme)) {
    fileContent = fileContent.replace('dx.light.css', cookieTheme);
  }

  // Inject nonce into all <script> tags for Angular/React/Vue demos.
  // 'strict-dynamic' in CSP ignores 'self', so <script src> tags also need the nonce.
  // 'strict-dynamic' propagates trust to scripts dynamically created by SystemJS.
  const { cspNonce } = response.locals;
  if (cspNonce) {
    fileContent = fileContent.replace(/<script(?=\s|>)/g, `<script nonce="${cspNonce}"`);
  }

  response.set('Content-Type', 'text/html');
  response.send(fileContent);
};

const app = express();
app.use(cookieParser());
app.use(cspMiddleware);

const demoIndexLimiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.post('/csp-report', cspReportHandler);
app.get('/csp-violations', cspViolationsHandler);
app.delete('/csp-violations', cspViolationsClearHandler);

app.get('/apps/demos/Demos/:widget/:name/:approach', demoIndexLimiter, demoIndexHandler);
app.get(`/apps/demos/Demos/:widget/:name/:approach/${indexFileName}`, demoIndexLimiter, demoIndexHandler);

app.use(express.static(root, { index: [indexFileName] }));

const server = app.listen(port, host, () => {
  console.log(`CSP Demo server listening on http://${host}:${port}`);
  console.log('CSP Report-Only mode enabled');
  console.log('  Report endpoint: POST /csp-report');
  console.log('  View violations: GET /csp-violations');
  console.log('  Clear violations: DELETE /csp-violations');
});

module.exports = { app, server };
