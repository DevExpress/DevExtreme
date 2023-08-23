'use strict';

const fs = require('fs');
const path = require('path');

class SideEffectFinder {
    #sideEffectFiles = new Set();
    #checkingPathsStack = new Set();
    #checkedPaths = new Set();
    getModuleSideEffectFiles(moduleFilePath) {
        try {
            this.#sideEffectFiles.clear();
            this.#checkingPathsStack.clear();
            this.#checkedPaths.clear();

            this.#findSideEffectsInModule(moduleFilePath);

            const moduleSideEffectFiles = [...this.#sideEffectFiles].map(
                (importPath) => importPath.replace(/\\/g, '/')
            )

            return moduleSideEffectFiles;
        } catch (e) {
            const message = (e instanceof Error) ? e.message : e;
            throw(`Exception while check side effects. in ${moduleFilePath} \nException: ` + message + '\n');
        }
    }
    #findSideEffectsInModule(moduleFilePath) {
        const code = fs.readFileSync(moduleFilePath, 'utf8');

        if (!this.#checkedPaths.has(moduleFilePath)) {
            this.#findSideEffectsInImports(moduleFilePath, code);
            this.#checkedPaths.add(moduleFilePath);
        }
    }

    #findSideEffectsInImports(modulePath, code) {
        const hasRelativePathRegExp = /['"]\.?\.\/.+/;
        const relativePathRegExp = /['"]\.?\.\/.+['"]/;
        const isSideEffectImportRegExp = /^\s*import\s+['"]/ms;

        const imports = code.match(/^\s*import[^;]+;/mg) || [];

        imports.filter((str) => hasRelativePathRegExp.test(str))
            .forEach((str) => {
                let importPath = str.match(relativePathRegExp)[0].replace(/(^['"]|['"]$)/g, '');

                importPath = path.join(path.dirname(modulePath), importPath)+'.js';

                if(!fs.existsSync(importPath)) {
                    importPath = importPath.replace(/\.js$/, '/index.js')
                }

                if (isSideEffectImportRegExp.test(str)) {
                    this.#sideEffectFiles.add(importPath);
                }

                const isInLoop = this.#checkingPathsStack.has(importPath);

                if (!isInLoop) {
                    this.#checkingPathsStack.add(importPath);

                    this.#findSideEffectsInModule(importPath);

                    this.#checkingPathsStack.delete(importPath);
                }
            });
    }
}

module.exports = {
    SideEffectFinder
}
