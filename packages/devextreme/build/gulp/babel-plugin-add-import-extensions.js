'use strict';

const path = require('path');
const fs = require('fs');

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
                const distPathRegExp = /artifacts[\/\\]dist_ts/;

                if (currentFile) {
                    const currentDir = path.dirname(currentFile);
                    const resolvedPath = path.resolve(currentDir, value).replace(distPathRegExp,'js');

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
                }

                source.value = value + '.js';
            }
        }
    };
};

