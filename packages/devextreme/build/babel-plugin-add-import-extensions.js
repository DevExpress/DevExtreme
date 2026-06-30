'use strict';

const path = require('path');
const fs = require('fs');

// Appends .js to bare relative imports/re-exports so the ESM output is valid
// under Node's strict ESM resolver (requires explicit file extensions).
// Directory imports (resolving via index.ts) get /index.js appended instead.
module.exports = function addImportExtensions({ types: t }) {
    function withJsExtension(source, filename) {
        if (!source.startsWith('./') && !source.startsWith('../')) return null;
        if (path.extname(source)) return null;

        if (filename) {
            const resolved = path.resolve(path.dirname(filename), source);
            try {
                if (fs.statSync(resolved).isDirectory()) {
                    return source + '/index.js';
                }
            } catch {
                // path is a file (no bare entry) — fall through to .js
            }
        }

        return source + '.js';
    }

    function patchSource(nodePath, state) {
        if (!nodePath.node.source) return;
        const patched = withJsExtension(nodePath.node.source.value, state.file?.opts?.filename);
        if (patched) {
            nodePath.node.source = t.stringLiteral(patched);
        }
    }

    return {
        visitor: {
            ImportDeclaration: (p, s) => patchSource(p, s),
            ExportNamedDeclaration: (p, s) => patchSource(p, s),
            ExportAllDeclaration: (p, s) => patchSource(p, s),
        },
    };
};
