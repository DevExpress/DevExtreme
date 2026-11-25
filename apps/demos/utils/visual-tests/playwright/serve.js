const crypto = require('crypto');
const express = require('express');
const RateLimit = require('express-rate-limit');
const { readFile } = require('fs/promises');
const { join, resolve } = require('path');
const { buildCspHeader, parseDemoPath } = require('./csp-policy');

// Demo pages reference the packages by paths that start above apps/demos, so the repository is the document root.
const root = join(__dirname, '..', '..', '..', '..', '..');
const port = Number(process.argv[2]);
const csp = process.argv.includes('--csp');

if (!Number.isInteger(port) || port <= 0) {
  console.error(`Invalid port: ${process.argv[2]}. Pass a positive integer, for example 20080.`);
  process.exit(1);
}

const app = express();

if (csp) {
  const demosDir = resolve(root, 'apps', 'demos', 'Demos');

  app.use((req, res, next) => {
    const { demoKey, framework } = parseDemoPath(req.path);
    // Angular adds the <style> elements of its components at run time and stamps them with this nonce.
    const nonce = framework === 'Angular' ? crypto.randomBytes(16).toString('base64') : null;

    res.locals.cspNonce = nonce;
    res.setHeader('Content-Security-Policy', buildCspHeader(demoKey, nonce, framework));
    next();
  });

  // Angular reads the nonce from the ngCspNonce attribute of its root element.
  app.get(
    ['/apps/demos/Demos/:widget/:name/Angular/', '/apps/demos/Demos/:widget/:name/Angular/index.html'],
    RateLimit({ windowMs: 15 * 60 * 1000, max: 10000 }),
    async (req, res, next) => {
      const file = resolve(demosDir, req.params.widget, req.params.name, 'Angular', 'index.html');

      if (!file.startsWith(demosDir)) {
        res.status(403).send('Forbidden');
        return;
      }

      try {
        const html = await readFile(file, 'utf8');

        res.type('html').send(html.replace(/<demo-app(?=[\s>])/, `<demo-app ngCspNonce="${res.locals.cspNonce}"`));
      } catch {
        next();
      }
    },
  );
}

app
  .use(express.static(root))
  .listen(port, '127.0.0.1', () => {
    console.log(`Demos are served at http://127.0.0.1:${port}/apps/demos/${csp ? ' with the Content Security Policy' : ''}`);
  });
