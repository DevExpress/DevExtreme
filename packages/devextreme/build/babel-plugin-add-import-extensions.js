'use strict';

const path = require('path');

// Appends .js to bare relative imports/re-exports so the ESM output is valid
// under Node's strict ESM resolver (requires explicit file extensions).
module.exports = function addImportExtensions({ types: t }) {
    function withJsExtension(source) {
        if (!source.startsWith('./') && !source.startsWith('../')) return null;
        if (path.extname(source)) return null;
        return source + '.js';
    }

    function patchSource(nodePath) {
        if (!nodePath.node.source) return;
        const patched = withJsExtension(nodePath.node.source.value);
        if (patched) {
            nodePath.node.source = t.stringLiteral(patched);
        }
    }

    return {
        visitor: {
            ImportDeclaration: patchSource,
            ExportNamedDeclaration: patchSource,
            ExportAllDeclaration: patchSource,
        },
    };
};
