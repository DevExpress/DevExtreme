/* eslint-disable import/no-extraneous-dependencies */

const crypto = require('crypto');
const express = require('express');
const { join, resolve } = require('path');
const { readFileSync } = require('fs');
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

const DEMO_OPENAI_CONNECT_SRC = ['https://public-api.devexpress.com'];

const CSP_DEMO_ALLOWLIST = {
  'Button/Icons': {
    'font-src': ['https://maxcdn.bootstrapcdn.com'],
  },
  // Azure Maps SDK: inline styles, blob workers, data: images, font glyphs.
  Map: {
    'script-src': ['https://atlas.microsoft.com'],
    'connect-src': ['https://atlas.microsoft.com'],
    'worker-src': ['blob:'],
    'img-src': ['data:'],
    'font-src': ['https://atlas.microsoft.com'],
    'style-src-elem': ["'self'", "'unsafe-inline'"],
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
    // Country-flag glyphs are painted via a data: CSS background (all frameworks).
    'img-src': ['data:'],
  },
  'Scheduler/SignalRService': {
    'connect-src': ['wss://js.devexpress.com'],
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
  'DataGrid/Cell': {
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
  'DataGrid/SemanticSearch': {
    'img-src': ['data:'],
  },
  'DataGrid/VirtualScrolling': {
    'img-src': ['data:'],
  },
  'DataGrid/WebAPIService': {
    'img-src': ['data:'],
  },
  'TreeList/FocusedRow': {
    'img-src': ['data:'],
  },
  'TreeList/WebAPIService': {
    'img-src': ['data:'],
  },
  Gantt: {
    'img-src': ['data:'],
  },
  'Gantt/TaskTemplate': {
    'style-src-attr': ["'unsafe-inline'"],
  },
  Diagram: {
    'img-src': ['data:'],
    'font-src': ['https://maxcdn.bootstrapcdn.com'],
  },
  FileManager: {
    'img-src': ['data:'],
  },
  'Resizable/Overview': {
    'img-src': ['data:'],
  },
  'Scheduler/GoogleCalendarIntegration': {
    'connect-src': ['https://www.googleapis.com'],
  },
  'DataGrid/AIAssistant': {
    'connect-src': DEMO_OPENAI_CONNECT_SRC,
  },
  'DataGrid/AIColumns': {
    'connect-src': DEMO_OPENAI_CONNECT_SRC,
  },
  'Form/SmartPaste': {
    'connect-src': DEMO_OPENAI_CONNECT_SRC,
  },
  'HtmlEditor/AITextEditing': {
    'connect-src': DEMO_OPENAI_CONNECT_SRC,
  },
  'Chat/AIAndChatbotIntegration': {
    'connect-src': DEMO_OPENAI_CONNECT_SRC,
  },
  'Chat/MessageStreaming': {
    'connect-src': DEMO_OPENAI_CONNECT_SRC,
  },
  'Chat/PromptSuggestions': {
    'connect-src': DEMO_OPENAI_CONNECT_SRC,
  },
  'Scheduler/CellTemplates': {
    'img-src': ['data:'],
  },
  'ScrollView/Overview': {
    'img-src': ['data:'],
  },
  'Common/FormsOverview': {
    'img-src': ['data:'],
  },
  'Scheduler/Overview': {
    'img-src': ['data:'],
  },
  'TreeList/BatchEditing': {
    'img-src': ['data:'],
  },
  'TreeList/CellEditing': {
    'img-src': ['data:'],
  },
  'TreeList/MultipleSorting': {
    'img-src': ['data:'],
  },
  'TreeList/SearchPanel': {
    'img-src': ['data:'],
  },
  'TreeList/Overview': {
    'img-src': ['data:'],
  },
  'TreeList/FixedAndStickyColumns': {
    'img-src': ['data:'],
  },
  'TreeList/AIColumns': {
    'connect-src': DEMO_OPENAI_CONNECT_SRC,
  },
};

// Framework-specific overrides (e.g. Font Awesome loaded only in React/Vue demos)
const CSP_FRAMEWORK_ALLOWLIST = {
  jQuery: {
    FilterBuilder: { 'font-src': ['https://maxcdn.bootstrapcdn.com'] },
    // globalize/message.js uses new Function() internally
    'Localization/UsingGlobalize': {
      'script-src': ["'unsafe-eval'"],
    },
    // Inline <script type="module"> to import remark/rehype from esm.sh
    'HtmlEditor/MarkdownSupport': {
      'script-src': ["'unsafe-inline'"],
    },
    // AI demos: inline <script type="module"> imports the OpenAI SDK; jQuery has no nonce.
    'DataGrid/AIAssistant': {
      'script-src': ["'unsafe-inline'"],
    },
    'DataGrid/AIColumns': {
      'script-src': ["'unsafe-inline'"],
    },
    // The OpenAI SDK additionally uses eval() in this demo.
    'Form/SmartPaste': {
      'script-src': ["'unsafe-inline'", "'unsafe-eval'"],
    },
    'HtmlEditor/AITextEditing': {
      'script-src': ["'unsafe-inline'"],
    },
    'Chat/AIAndChatbotIntegration': {
      'script-src': ["'unsafe-inline'"],
    },
    'Chat/MessageStreaming': {
      'script-src': ["'unsafe-inline'"],
    },
    'Chat/PromptSuggestions': {
      'script-src': ["'unsafe-inline'"],
    },
    'TreeList/AIColumns': {
      'script-src': ["'unsafe-inline'"],
    },
  },
  Angular: {
    FilterBuilder: { 'font-src': ['https://maxcdn.bootstrapcdn.com'] },
    // globalize/message.js uses new Function() internally
    'Localization/UsingGlobalize': { 'script-src': ["'unsafe-eval'"] },
  },
  React: {
    'Slider/Overview': {
      'font-src': ['https://maxcdn.bootstrapcdn.com'],
    },
    'Sortable/Customization': {
      'font-src': ['https://maxcdn.bootstrapcdn.com'],
    },
    'TagBox/Grouping': {
      'font-src': ['https://maxcdn.bootstrapcdn.com'],
    },
    'SelectBox/Grouping': {
      'font-src': ['https://maxcdn.bootstrapcdn.com'],
    },
    'SelectBox/SearchAndEditing': {
      'font-src': ['https://maxcdn.bootstrapcdn.com'],
    },
    Calendar: { 'font-src': ['https://maxcdn.bootstrapcdn.com'] },
    CheckBox: { 'font-src': ['https://maxcdn.bootstrapcdn.com'] },
    'DateRangeBox/Overview': { 'font-src': ['https://maxcdn.bootstrapcdn.com'] },
    Form: { 'font-src': ['https://maxcdn.bootstrapcdn.com'] },
    'Lookup/Templates': { 'font-src': ['https://maxcdn.bootstrapcdn.com'] },
    // globalize/message.js uses new Function() internally
    'Localization/UsingGlobalize': { 'script-src': ["'unsafe-eval'"] },
  },
  Vue: {
    'SelectBox/Grouping': {
      'font-src': ['https://maxcdn.bootstrapcdn.com'],
    },
    Calendar: { 'font-src': ['https://maxcdn.bootstrapcdn.com'] },
    CheckBox: { 'font-src': ['https://maxcdn.bootstrapcdn.com'] },
    Form: { 'font-src': ['https://maxcdn.bootstrapcdn.com'] },
    'Lookup/Templates': { 'font-src': ['https://maxcdn.bootstrapcdn.com'] },
    // globalize/message.js uses new Function() internally
    'Localization/UsingGlobalize': { 'script-src': ["'unsafe-eval'"] },
  },
};

// Vue's SFC loader injects component CSS as inline <style> with no nonce, so the
// SystemJS dev demos need 'unsafe-inline'. Dropped for bundled demos.
const CSP_FRAMEWORK_DEFAULTS = {
  Vue: { 'style-src': ["'unsafe-inline'"] },
};

// Framework allowlist entries needed only by the SystemJS dev loader (Font Awesome
// via inline component CSS); dropped when serving bundled demos.
const SYSTEMJS_ONLY_FRAMEWORK_KEYS = {
  React: ['Slider/Overview', 'Sortable/Customization', 'TagBox/Grouping',
    'SelectBox/Grouping', 'SelectBox/SearchAndEditing', 'Calendar', 'CheckBox',
    'DateRangeBox/Overview', 'Form', 'Lookup/Templates'],
  Vue: ['SelectBox/Grouping', 'Calendar', 'CheckBox', 'Form', 'Lookup/Templates'],
  Angular: ['FilterBuilder'],
};

function generateNonce() {
  return crypto.randomBytes(16).toString('base64');
}

function isSystemJsOnlyEntry(framework, key) {
  const list = SYSTEMJS_ONLY_FRAMEWORK_KEYS[framework];
  return !!(list && list.includes(key));
}

function buildCspHeader(demoKey, nonce, framework, isBundled) {
  const directives = {};
  for (const [key, values] of Object.entries(CSP_BASE_DIRECTIVES)) {
    directives[key] = [...values];
  }

  if (nonce) {
    // Only SystemJS dev demos need script-src nonce + strict-dynamic + eval;
    // bundled demos load external scripts under 'self'.
    if (!isBundled) {
      directives['script-src'].push(`'nonce-${nonce}'`);
      directives['script-src'].push("'strict-dynamic'");
      directives['script-src'].push("'unsafe-eval'");
    }

    // Angular stamps this nonce (via ngCspNonce) on the <style> elements it
    // injects for component styles — needed in dev and bundled mode.
    if (framework === 'Angular') {
      directives['style-src'].push(`'nonce-${nonce}'`);
    }
  }

  const widgetKey = demoKey && demoKey.split('/')[0];
  const frameworkList = framework && CSP_FRAMEWORK_ALLOWLIST[framework];

  const allowFrameworkEntry = (key) => !(isBundled && isSystemJsOnlyEntry(framework, key));

  const allowlists = [
    !isBundled && framework && CSP_FRAMEWORK_DEFAULTS[framework],
    demoKey && CSP_DEMO_ALLOWLIST[demoKey],
    widgetKey && CSP_DEMO_ALLOWLIST[widgetKey],
    frameworkList && demoKey && allowFrameworkEntry(demoKey) && frameworkList[demoKey],
    frameworkList && widgetKey && allowFrameworkEntry(widgetKey) && frameworkList[widgetKey],
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

const DEMO_PATH_RE = /\/(?:Demos|csp-bundled-demos)\/([^/]+)\/([^/]+)\/([^/]+)/;

function parseDemoPath(url) {
  const match = url.match(DEMO_PATH_RE);
  if (!match) return { demoKey: null, framework: null, isBundled: false };
  return {
    demoKey: `${match[1]}/${match[2]}`,
    framework: match[3],
    isBundled: url.includes('/csp-bundled-demos/'),
  };
}

function cspMiddleware(req, res, next) {
  const { demoKey, framework, isBundled } = parseDemoPath(req.path);

  // Dev demos need a nonce for inline scripts; bundled Angular needs one for its
  // injected component <style> elements.
  const needsNonce = (!isBundled
    && (framework === 'Angular' || framework === 'React' || framework === 'Vue'))
    || (isBundled && framework === 'Angular');
  const nonce = needsNonce ? generateNonce() : null;
  if (nonce) {
    res.locals.cspNonce = nonce;
  }

  res.setHeader('Content-Security-Policy-Report-Only', buildCspHeader(demoKey, nonce, framework, isBundled));
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
const bundledDemosBaseDir = resolve(root, 'apps', 'demos', 'csp-bundled-demos');

const makeIndexHandler = (baseDir) => (request, response) => {
  const { widget, name, approach } = request.params;
  const fileSystemPath = resolve(baseDir, widget, name, approach, indexFileName);

  if (!fileSystemPath.startsWith(baseDir)) {
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

  // Inject nonce into all <script> tags for Angular/React/Vue demos.
  // 'strict-dynamic' in CSP ignores 'self', so <script src> tags also need the nonce.
  // 'strict-dynamic' propagates trust to scripts dynamically created by SystemJS.
  const { cspNonce } = response.locals;
  if (cspNonce) {
    fileContent = fileContent.replace(/<script(?=\s|>)/g, `<script nonce="${cspNonce}"`);

    if (approach === 'Angular') {
      fileContent = fileContent.replace(/<demo-app(?=[\s>])/, `<demo-app ngCspNonce="${cspNonce}"`);
    }
  }

  response.set('Content-Type', 'text/html');
  response.send(fileContent);
};

const demoIndexHandler = makeIndexHandler(demosBaseDir);
const bundledIndexHandler = makeIndexHandler(bundledDemosBaseDir);

const app = express();
app.use(cspMiddleware);

const demoIndexLimiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
});

app.post('/csp-report', cspReportHandler);
app.get('/csp-violations', cspViolationsHandler);
app.delete('/csp-violations', cspViolationsClearHandler);

app.get('/apps/demos/Demos/:widget/:name/:approach', demoIndexLimiter, demoIndexHandler);
app.get(`/apps/demos/Demos/:widget/:name/:approach/${indexFileName}`, demoIndexLimiter, demoIndexHandler);

// Route bundled index.html through the handler so Angular gets ngCspNonce stamped.
app.get('/apps/demos/csp-bundled-demos/:widget/:name/:approach', demoIndexLimiter, bundledIndexHandler);
app.get(`/apps/demos/csp-bundled-demos/:widget/:name/:approach/${indexFileName}`, demoIndexLimiter, bundledIndexHandler);

app.use(express.static(root, { index: [indexFileName] }));

const server = app.listen(port, host, () => {
  console.log(`CSP Demo server listening on http://${host}:${port}`);
  console.log('CSP report-only mode enabled');
  console.log('  Report endpoint: POST /csp-report');
  console.log('  View violations: GET /csp-violations');
  console.log('  Clear violations: DELETE /csp-violations');
});

module.exports = { app, server };
