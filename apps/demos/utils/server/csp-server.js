/* eslint-disable import/no-extraneous-dependencies */

const express = require('express');
const serveStatic = require('serve-static');
const cookieParser = require('cookie-parser');
const { join, normalize } = require('path');
const { readFileSync, readdirSync } = require('fs');

const root = join(__dirname, '..', '..', '..', '..');
const indexFileName = 'index.html';
const port = process.argv[2] ?? 8080;

const cspViolations = [];
let cspViolationIdCounter = 0;

const CSP_BASE_DIRECTIVES = {
  'default-src': ["'none'"],
  'script-src': ["'self'", 'https://esm.sh', 'https://cdnjs.cloudflare.com', 'https://cdn.jsdelivr.net'],
  'style-src': ["'self'", 'https://maxcdn.bootstrapcdn.com'],
  'img-src': ["'self'"],
  'font-src': ["'self'"],
  'connect-src': ["'self'", 'https://js.devexpress.com', ' https://demos.devexpress.com'],
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
  Map: {
    'script-src': ['https://atlas.microsoft.com'],
    'connect-src': ['https://atlas.microsoft.com'],
  },
};

function buildCspHeader(demoKey) {
  const directives = {};
  for (const [key, values] of Object.entries(CSP_BASE_DIRECTIVES)) {
    directives[key] = [...values];
  }

  const widgetKey = demoKey && demoKey.split('/')[0];
  const allowlists = [
    demoKey && CSP_DEMO_ALLOWLIST[demoKey],
    widgetKey && CSP_DEMO_ALLOWLIST[widgetKey],
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

function cspMiddleware(req, res, next) {
  const demoKey = getDemoKey(req.path);
  res.setHeader('Content-Security-Policy-Report-Only', buildCspHeader(demoKey));
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

const demoIndexHandler = (request, response) => {
  const parts = request.path.split('/');
  parts.unshift(root);

  if (parts[parts.length - 1] !== indexFileName) {
    parts.push(indexFileName);
  }

  const fileSystemPath = normalize(join.apply(null, parts));
  let fileContent;
  try {
    fileContent = readFileSync(fileSystemPath).toString();
  } catch (e) {
    response.status(404).send('Not Found');
    return;
  }

  const cookieTheme = request.cookies['dx-demo-theme'];
  const cssDirectory = join(root, 'node_modules', 'devextreme', 'dist', 'css');
  let availableThemes = [];
  try {
    availableThemes = readdirSync(cssDirectory).filter((f) => /^dx\.(?!common).*\.css$/i.test(f));
  } catch (e) { /* css directory may not exist */ }

  if (cookieTheme && availableThemes.includes(cookieTheme)) {
    fileContent = fileContent.replace('dx.light.css', cookieTheme);
  }

  response.set('Content-Type', 'text/html');
  response.send(fileContent);
};

const app = express();
app.use(cookieParser());
app.use(cspMiddleware);

app.post('/csp-report', cspReportHandler);
app.get('/csp-violations', cspViolationsHandler);
app.delete('/csp-violations', cspViolationsClearHandler);

app.get('/apps/demos/Demos/:widget/:name/:approach', demoIndexHandler);
app.get(`/apps/demos/Demos/:widget/:name/:approach/${indexFileName}`, demoIndexHandler);
app.get('/Demos/:widget/:name/:approach', demoIndexHandler);
app.get(`/Demos/:widget/:name/:approach/${indexFileName}`, demoIndexHandler);

app.use(
  serveStatic(root, { index: [indexFileName] }),
);

const server = app.listen(port, () => {
  console.log(`CSP Demo server listening on http://127.0.0.1:${port}`);
  console.log('CSP Report-Only mode enabled');
  console.log('  Report endpoint: POST /csp-report');
  console.log('  View violations: GET /csp-violations');
  console.log('  Clear violations: DELETE /csp-violations');
});

module.exports = { app, server };
