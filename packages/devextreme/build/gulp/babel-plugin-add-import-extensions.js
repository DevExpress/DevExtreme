'use strict';

const path = require('path');
const fs = require('fs');
const TS_OUTPUT_BASE_DIR = 'artifacts/dist_ts';

module.exports = function addImportExtensions() {
    return {
        name: 'add-import-extensions',
        visitor: {
            'ImportDeclaration|ExportNamedDeclaration|ExportAllDeclaration'(astPath) {
                const source = astPath.node.source;

                if (!source) return;

                const value = source.value;

                if (!value || (!value.startsWith('./') && !value.startsWith('../'))) {
                    return;
                }

                if (value.match(/\.(js|mjs|json|css)$/)) {
                    return;
                }

                if (value.endsWith('/')) {
                    source.value = value + 'index.js';
                    return;
                }

                const currentFile = astPath.hub?.file?.opts?.filename;
                const distPathRegExp = new RegExp(TS_OUTPUT_BASE_DIR)

                if (currentFile) {
                    const currentDir = path.dirname(currentFile);
                    const resolvedPath = path.resolve(currentDir, value).replace(distPathRegExp,'js');

                    let jsFilePath = resolvedPath + '.js';

                    if ( fs.existsSync(jsFilePath)
                        || fs.existsSync(jsFilePath = resolvedPath + '.ts')
                    ) {
                        const stat = fs.statSync(jsFilePath);

                        if (stat.isFile()) {
                            source.value = value + '.js';
                            return;
                        }
                    }

                    if (fs.existsSync(resolvedPath)) {
                        const stat = fs.statSync(resolvedPath);

                        if (stat.isDirectory()) {
                            const indexPath = path.join(resolvedPath, 'index.js');

                            if (fs.existsSync(indexPath)) {
                                source.value = value + '/index.js';
                                return;
                            }
                        }
                    }
                }

                source.value = value + '.js';
            }
        }
    };
};

