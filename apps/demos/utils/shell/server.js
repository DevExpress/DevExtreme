/* eslint-disable import/no-extraneous-dependencies */

const express = require('express');
const serveStatic = require('serve-static');
const serveIndex = require('serve-index');
const cookieParser = require('cookie-parser');
const open = require('open');
const { join, normalize } = require('path');
const { readFileSync, readdirSync } = require('fs');

const root = join(__dirname, '..', '..', '..', '..');
const indexFileName = 'index.html';
const cssDirectory = join(root, 'node_modules', 'devextreme', 'dist', 'css');
const getAvailableThemes = readdirSync(cssDirectory).filter((f) => /^dx\.(?!common).*\.css$/i.test(f));
const baseTheme = 'dx.light.css';
const port = process.argv[2] ?? 3000;

const demoIndexHandler = (request, response) => {
  const parts = request.path.split('/');

  parts.unshift(root);

  if (parts[parts.length - 1] !== indexFileName) {
    parts.push(indexFileName);
  }

  const fileSystemPath = normalize(join.apply(this, parts));
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

app.get('/Demos/:widget/:name/:approach', demoIndexHandler);
app.get(`/Demos/:widget/:name/:approach/${indexFileName}`, demoIndexHandler);
app.get('/themes', (request, response) => response.send(getAvailableThemes));
app.use(
  serveStatic(root, { index: [indexFileName] }),
  serveIndex(root, { icons: true }),
);

app.listen(port);

open(`http://localhost:${port}/apps/demos`);
