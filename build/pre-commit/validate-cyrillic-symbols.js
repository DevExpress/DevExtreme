'use strict';

const events = require('events');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const ignore = require('ignore');

const CODE_RE = /[cm]?[jt]sx?$/i;
const RESULT = {
    ok: 0,
    fail: 1,
};
const CYRILLIC_RE = /[а-яА-Я]/;

const check = async(filePaths) => {
    const nonCodeFiles = filePaths
        .filter(file => !CODE_RE.test(file));
    let result = RESULT.ok;

    await Promise.all(nonCodeFiles.map(async(filePath) => {
        const rl = readline.createInterface({
            input: fs.createReadStream(filePath),
            crlfDelay: Infinity
        });
        let lineNum = 1;

        rl.on('line', (line) => {
            if(CYRILLIC_RE.test(line)) {
                const filename = path.join(process.cwd(), filePath);
                console.log(`${filename}:${lineNum} cyrillic symbols found!`);
                result = RESULT.fail;
            }
            lineNum++;
        });

        await events.once(rl, 'close');
    }));

    return result;
};
const checkDir = async function(dir) {
    const dirEntities = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirEntities.map((dirEntity) => {
        const res = path.join(dir, dirEntity.name);
        return dirEntity.isDirectory() ? checkDir(res) : res;
    }));
    return Array.prototype.concat(...files);
};
const main = async function() {
    const gitIgnore = (await fs.promises.readFile('.gitignore')).toString();
    const ig = ignore().add(gitIgnore).add([
        '.git',
        '.angular',
        'build',
        'fonts',
        'icons',
        'localization',
        '*.jpg',
        '*.gif',
        '*.ico',
        '*.png',
        '*.js',
        '*.ts',
        '*.tsx',
    ]);

    const files = await checkDir('.');
    const filtered = ig.filter(files);
    const errors = await check(filtered);

    if(errors) {
        console.error('Check failure');
        process.exit(1);
    }
};

if(!module.parent) {
    main();
}

// for work as pre-commit hook
module.exports = check;
