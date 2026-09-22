import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { parseArgs } from 'node:util';
import express from 'express';

const DIST_DIRS = {
    react19: 'builders/react19/dist',
    angular: 'builders/angular/dist/angular/browser',
    vue3: 'builders/vue3/dist',
};

const { values } = parseArgs({
    options: {
        framework: { type: 'string' },
        port: { type: 'string' },
    },
});

const framework = values.framework;
const port = Number(values.port);
const distDir = DIST_DIRS[framework];

if(!distDir) {
    console.error(`❌ Unsupported framework: ${framework}. Expected one of: ${Object.keys(DIST_DIRS).join(', ')}.`);
    process.exit(1);
}

if(!Number.isInteger(port) || port <= 0) {
    console.error(`❌ Invalid port: ${values.port}. Pass a positive integer, for example --port=3030.`);
    process.exit(1);
}

const root = path.resolve(import.meta.dirname, distDir);
const indexPath = path.join(root, 'index.html');

if(!fs.existsSync(indexPath)) {
    console.error(`❌ Build for ${framework} is not found at ${root}. Run "pnpm run build:${framework}" first.`);
    process.exit(1);
}

const app = express();

app.use(express.static(root));
app.get('*', (_, res) => res.sendFile(indexPath));

app.listen(port, () => {
    console.log(`✅ Server for ${framework} running at http://localhost:${port}`);
});
