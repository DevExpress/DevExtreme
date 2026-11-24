const express = require('express');
const { join } = require('path');

// Demo pages reference the packages by paths that start above apps/demos, so the repository is the document root.
const root = join(__dirname, '..', '..', '..', '..', '..');
const port = Number(process.argv[2]);

if (!Number.isInteger(port) || port <= 0) {
  console.error(`Invalid port: ${process.argv[2]}. Pass a positive integer, for example 20080.`);
  process.exit(1);
}

express()
  .use(express.static(root))
  .listen(port, '127.0.0.1', () => {
    console.log(`Demos are served at http://127.0.0.1:${port}/apps/demos/`);
  });
