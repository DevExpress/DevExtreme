/* eslint-env node */
const path = require('path');
const fs = require('fs');

const BASE_DIR = process.cwd();
const ARTIFACTS_DIR = path.resolve(BASE_DIR, 'artifacts');
fs.rmSync(ARTIFACTS_DIR, { recursive: true, force: true });
fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });

const containerHtmlPath = path.resolve(BASE_DIR, 'container.html');
const containerHtml = fs.readFileSync(containerHtmlPath, 'utf-8');

const assetRegex = /(?:href|src)="([^"]+)"/g;
let match;
const assets = [];
while((match = assetRegex.exec(containerHtml)) !== null) {
    assets.push(match[1]);
}

let newHtml = containerHtml;
assets.forEach((relPath) => {
    switch(true) {
        case relPath.includes('artifacts/css'):
            newHtml = newHtml.replace(new RegExp(relPath, 'g'), `css/${path.basename(relPath)}`);
            break;
        case relPath.includes('artifacts/js'):
            newHtml = newHtml.replace(new RegExp(relPath, 'g'), `js/${path.basename(relPath)}`);
            break;
        default:
            fs.copyFileSync(
                path.resolve(BASE_DIR, relPath),
                path.join(ARTIFACTS_DIR, path.basename(relPath)),
            );
            newHtml = newHtml.replace(new RegExp(relPath, 'g'), path.basename(relPath));
    }
});

const SOURCE_DIR = path.resolve(BASE_DIR, '../../packages/devextreme/artifacts');
fs.cpSync(path.join(SOURCE_DIR, 'css'), path.join(ARTIFACTS_DIR, 'css'), { recursive: true });
fs.cpSync(path.join(SOURCE_DIR, 'js'), path.join(ARTIFACTS_DIR, 'js'), { recursive: true });
fs.writeFileSync(path.join(ARTIFACTS_DIR, 'container.html'), newHtml, 'utf-8');

process.stdout.write('Artifacts and container.html generated successfully.\n');
