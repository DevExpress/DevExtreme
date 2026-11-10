'use strict';

const fs = require('fs');
const path = require('path');

// Makes relative import/export specifiers in the ESM build fully specified, as Node's ESM loader
// and strict-ESM bundler modes require:
//   './button'    -> './button.js'
//   './ui.errors' -> './ui.errors.js'   (a dot in a file name is not an extension)
//   './grids'     -> './grids/index.js'
// The decision is made against the source tree, the way TypeScript resolves the import.

const SOURCE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

function isFile(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    } catch {
        return false;
    }
}

// Files compiled to an intermediate folder (tsc output) are resolved against their sources
function toSourcePath(filePath, sourceRoots) {
    const root = sourceRoots.find(({ from }) => filePath.startsWith(from + path.sep));

    return root ? path.join(root.to, path.relative(root.from, filePath)) : filePath;
}

function fullySpecify(specifier, importerPath) {
    const target = path.resolve(path.dirname(importerPath), specifier);

    if (isFile(target)) {
        return specifier;
    }

    if (SOURCE_EXTENSIONS.some((ext) => isFile(`${target}${ext}`))) {
        return `${specifier}.js`;
    }

    if (SOURCE_EXTENSIONS.some((ext) => isFile(path.join(target, `index${ext}`)))) {
        return `${specifier}/index.js`;
    }

    return null;
}

module.exports = function addImportExtensions({ types: t }, { sourceRoots = [] } = {}) {
    function rewriteSource(sourcePath, state) {
        if (!sourcePath.node || !t.isStringLiteral(sourcePath.node)) {
            return;
        }

        const specifier = sourcePath.node.value;

        if (!specifier.startsWith('./') && !specifier.startsWith('../')) {
            return;
        }

        const { filename } = state.file.opts;

        if (!filename) {
            throw sourcePath.buildCodeFrameError('add-import-extensions needs the file name to resolve relative imports');
        }

        const importerPath = toSourcePath(filename, sourceRoots);
        const resolved = fullySpecify(specifier, importerPath);

        if (resolved === null) {
            throw sourcePath.buildCodeFrameError(`Cannot resolve '${specifier}' from ${importerPath}`);
        }

        if (resolved !== specifier) {
            const quote = sourcePath.node.extra?.raw?.[0] ?? '\'';
            const literal = t.stringLiteral(resolved);
            literal.extra = { rawValue: resolved, raw: `${quote}${resolved}${quote}` };

            sourcePath.replaceWith(literal);
        }
    }

    return {
        name: 'add-import-extensions',
        visitor: {
            ImportDeclaration: (p, state) => rewriteSource(p.get('source'), state),
            ExportNamedDeclaration: (p, state) => rewriteSource(p.get('source'), state),
            ExportAllDeclaration: (p, state) => rewriteSource(p.get('source'), state),
            ImportExpression: (p, state) => rewriteSource(p.get('source'), state),
            CallExpression: (p, state) => {
                if (p.get('callee').isImport()) {
                    rewriteSource(p.get('arguments.0'), state);
                }
            },
        },
    };
};
