const fs = require('fs');
const path = require('path');
const process = require('process');
const minimist = require('minimist');
const express = require('express');

const DIST_DIRS = {
    react19: 'builders/react19/dist',
    angular: 'builders/angular/dist/angular/browser',
    vue3: 'builders/vue3/dist',
};

const argv = minimist(process.argv.slice(2));
const framework = argv.framework;
const port = Number(argv.port);
const distDir = DIST_DIRS[framework];

if(!distDir) {
    console.error(`❌ Unsupported framework: ${framework}. Expected one of: ${Object.keys(DIST_DIRS).join(', ')}.`);
    process.exit(1);
}

const root = path.resolve(__dirname, distDir);
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
