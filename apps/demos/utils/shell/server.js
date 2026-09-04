/* eslint-disable import/no-extraneous-dependencies */

const express = require('express');
const serveStatic = require('serve-static');
const serveIndex = require('serve-index');
const cookieParser = require('cookie-parser');
const open = require('open');
const rateLimit = require('express-rate-limit');
const {
  join, normalize, relative, isAbsolute,
} = require('path');
const {
  readFileSync, readdirSync, existsSync, statSync,
} = require('fs');
const { buildReactVueDemoInPlace } = require('../build/build-react-vue-demo');
const { buildAngularDemoInPlace } = require('../build/build-angular-demo');

const root = join(__dirname, '..', '..');
const demosRoot = join(root, 'Demos');
const indexFileName = 'index.html';
const cssDirectory = join(root, 'node_modules', 'devextreme-dist', 'css');
const getAvailableThemes = readdirSync(cssDirectory).filter((f) => /^dx\.(?!common).*\.css$/i.test(f));
const baseTheme = 'dx.light.css';
const portArgument = process.argv.slice(2).findLast((argument) => argument !== '--');
const port = Number(portArgument) || 8080;

const getDemoPath = (requestPath) => requestPath.replace(/^\/apps\/demos(?=\/|$)/, '');

function isPathWithin(parentDir, candidatePath) {
  const rel = relative(parentDir, candidatePath);
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel);
}

// Rebuilds on-demand, only for the demo actually being viewed, rather than
// watching all ~2,500 demos.
const BUNDLED_APPROACHES = new Set(['React', 'ReactJs', 'Vue', 'Angular']);
const GENERATED_ENTRY_NAMES = new Set([
  'bundle.js', 'bundle.css', indexFileName, 'tsconfig.json', 'description.md', '_chunks',
]);

function newestSourceMtimeMs(dir) {
  let newest = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const isGenerated = GENERATED_ENTRY_NAMES.has(entry.name)
      || entry.name.startsWith('.csp-bundle-angular-patched.');
    if (!isGenerated) {
      const fullPath = join(dir, entry.name);
      const mtimeMs = entry.isDirectory()
        ? newestSourceMtimeMs(fullPath)
        : statSync(fullPath).mtimeMs;
      newest = Math.max(newest, mtimeMs);
    }
  }
  return newest;
}

function isBundleStale(srcDir) {
  const bundlePath = join(srcDir, 'bundle.js');
  if (!existsSync(bundlePath)) return true;
  return newestSourceMtimeMs(srcDir) > statSync(bundlePath).mtimeMs;
}

// Dedupe concurrent requests for the same demo (e.g. a page loading several
// assets at once) into a single in-flight build.
const buildsInFlight = new Map();

function ensureBundleFresh(widget, name, approach) {
  if (!BUNDLED_APPROACHES.has(approach)) return Promise.resolve({ ok: true });

  const srcDir = join(demosRoot, widget, name, approach);
  if (!isPathWithin(demosRoot, srcDir)) return Promise.resolve({ ok: false, reason: 'invalid demo path' });
  if (!existsSync(srcDir) || !isBundleStale(srcDir)) return Promise.resolve({ ok: true });

  if (buildsInFlight.has(srcDir)) return buildsInFlight.get(srcDir);

  const buildPromise = (approach === 'Angular'
    ? buildAngularDemoInPlace(widget, name, srcDir)
    : buildReactVueDemoInPlace(approach, widget, name, srcDir))
    .finally(() => buildsInFlight.delete(srcDir));

  buildsInFlight.set(srcDir, buildPromise);
  return buildPromise;
}

const demoIndexHandler = async (request, response) => {
  const { widget, name, approach } = request.params;

  if (widget && name && approach) {
    let result;
    try {
      result = await ensureBundleFresh(widget, name, approach);
    } catch (err) {
      response.status(500).send(`Demo build failed: ${err.message}`);
      return;
    }
    if (!result.ok) {
      response.status(500).send(`Demo build failed: ${result.reason}`);
      return;
    }
  }

  const parts = getDemoPath(request.path).split('/');

  parts.unshift(root);

  if (parts[parts.length - 1] !== indexFileName) {
    parts.push(indexFileName);
  }

  const fileSystemPath = normalize(join.apply(this, parts));
  if (!isPathWithin(root, fileSystemPath)) {
    response.status(403).send('Forbidden');
    return;
  }
  let fileContent = readFileSync(fileSystemPath).toString();
  const cookieTheme = request.cookies['dx-demo-theme'];

  if (cookieTheme && getAvailableThemes.includes(cookieTheme)) {
    fileContent = fileContent.replace(baseTheme, cookieTheme);
  }

  response.set('Content-Type', 'text/html');
  response.send(fileContent);
};

const app = express();
app.use(cookieParser());

const demoLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.get('/apps/demos', (request, response) => response.redirect('/'));
app.get(`/apps/demos/${indexFileName}`, (request, response) => response.redirect('/'));
app.get('/Demos/:widget/:name/:approach', demoLimiter, demoIndexHandler);
app.get(`/Demos/:widget/:name/:approach/${indexFileName}`, demoLimiter, demoIndexHandler);
app.get('/apps/demos/Demos/:widget/:name/:approach', demoLimiter, demoIndexHandler);
app.get(`/apps/demos/Demos/:widget/:name/:approach/${indexFileName}`, demoLimiter, demoIndexHandler);
app.get('/themes', (request, response) => response.send(getAvailableThemes));
app.use(
  serveStatic(root, { index: [indexFileName] }),
  serveIndex(root, { icons: true }),
);

app.listen(port);

open(`http://localhost:${port}/`);
