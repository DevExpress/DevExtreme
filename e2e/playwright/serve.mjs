import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { parseArgs } from 'node:util';

const MIME_TYPES = {
    '.css': 'text/css',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.mjs': 'text/javascript',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ttf': 'font/ttf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};

const { values } = parseArgs({
    options: {
        port: { type: 'string' },
    },
});

const port = Number(values.port);

if(!Number.isInteger(port) || port <= 0) {
    console.error(`❌ Invalid port: ${values.port}. Pass a positive integer, for example --port=8080.`);
    process.exit(1);
}

// The test page pulls the built library and the themes straight out of the repository,
// so the whole repository is the document root.
const root = path.resolve(import.meta.dirname, '../..');
const bundlePath = path.join(root, 'packages/devextreme/artifacts/js/dx.all.js');

if(!fs.existsSync(bundlePath)) {
    console.error(`❌ DevExtreme build is not found at ${bundlePath}. Run "pnpm exec nx build devextreme -c testing" first.`);
    process.exit(1);
}

const server = http.createServer((request, response) => {
    const { pathname } = new URL(request.url, `http://localhost:${port}`);
    const filePath = path.join(root, decodeURIComponent(pathname));
    // A prefix check would also accept a sibling directory whose name starts with the root one.
    const relative = path.relative(root, filePath);
    const isInsideRoot = relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);

    if(!isInsideRoot || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        response.writeHead(404).end('Not found');
        return;
    }

    response.writeHead(200, {
        'Content-Type': MIME_TYPES[path.extname(filePath)] ?? 'application/octet-stream',
        'Cache-Control': 'no-store',
    });
    fs.createReadStream(filePath).pipe(response);
});

server.listen(port, '127.0.0.1', () => {
    console.log(`✅ Test pages are served at http://localhost:${port}`);
});
