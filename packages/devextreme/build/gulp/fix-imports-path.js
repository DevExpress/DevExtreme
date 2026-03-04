// fix-imports.js
const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.argv[2]; // Папка передаётся первым аргументом

if (!ROOT_DIR) {
    console.error('Использование: node fix-imports.js <path-to-folder>');
    process.exit(1);
}

function walkDir(dir, callback) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkDir(fullPath, callback);
        } else if (entry.isFile() && fullPath.endsWith('.js')) {
            callback(fullPath);
        }
    }
}

function resolveImport(fileDir, importSpecifier) {
    const basePath = path.resolve(fileDir, importSpecifier);

    const candidates = [
        basePath + '.js',
        path.join(basePath, 'index.js'),
    ];

    for (const full of candidates) {
        if (fs.existsSync(full) && fs.statSync(full).isFile()) {
            let rel = path.relative(fileDir, full).replace(/\\/g, '/');
            if (!rel.startsWith('.')) {
                rel = './' + rel;
            }
            return rel;
        }
    }
    return null;
}

function processFile(filePath) {
    const original = fs.readFileSync(filePath, 'utf8');
    let content = original;
    const fileDir = path.dirname(filePath);

    const importExportRegex =
        /(?:import|export)\s+(?:[^'"]*?\s+from\s+)?(['"])(\.{1,2}\/[^'"]*)\1/g;

    const requireRegex =
        /require\(\s*(['"])(\.{1,2}\/[^'"]*)\1\s*\)/g;

    function replaceCallback(_, quote, spec) {
        // Если уже есть .js или .mjs — не трогаем
        if (spec.endsWith('.js') || spec.endsWith('.mjs')) {
            return _;
        }

        const resolved = resolveImport(fileDir, spec);
        if (!resolved) return _;

        return _.replace(spec, resolved);
    }

    content = content.replace(importExportRegex, replaceCallback);
    content = content.replace(requireRegex, replaceCallback);

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', filePath);
    }
}

;

module.exports = {
    addExtensionToImportsPath: function (dir) {
        walkDir(path.resolve(dir), processFile)
    },
};
