'use strict';

const fs = require('fs');
const path = require('path');

class SideEffectFinder {
    #checkingPathsStack = new Set();
    #checkedPaths = new Map();

    getModuleSideEffectFiles(moduleFilePath) {
        try {
            const moduleSideEffectFiles = [...this.#findSideEffectsInModule(moduleFilePath)]
                .map((importPath) => importPath.replace(/\\/g, '/'));

            return moduleSideEffectFiles;
        } catch (e) {
            const message = (e instanceof Error) ? e.message : e;
            throw (`Exception while check side effects. in ${moduleFilePath} \nException: ` + message + '\n');
        }
    }

    #findSideEffectsInModule(moduleFilePath) {
        let foundPaths = this.#checkedPaths.get(moduleFilePath);

        if (!foundPaths) {
            const code = fs.readFileSync(moduleFilePath, 'utf8');

            foundPaths = this.#findSideEffectsInImports(moduleFilePath, code);
        }

        foundPaths = foundPaths || new Set();

        this.#checkedPaths.set(moduleFilePath, foundPaths);

        return foundPaths;
    }

    #findSideEffectsInImports(modulePath, code) {
        const hasRelativePathRegExp = /['"]\.?\.\/.+/;
        const relativePathRegExp = /['"]\.?\.\/.+['"]/;
        const isSideEffectImportRegExp = /^\s*import\s+['"]/ms;

        const imports = code.match(/^\s*import[^;]+;/mg) || [];
        let foundPaths = new Set();

        imports.filter((str) => hasRelativePathRegExp.test(str))
            .forEach((str) => {
                let importPath = str.match(relativePathRegExp)[0].replace(/(^['"]|['"]$)/g, '');

                importPath = path.join(path.dirname(modulePath), importPath)+'.js';

                if(!fs.existsSync(importPath)) {
                    importPath = importPath.replace(/\.js$/, '/index.js')
                }

                if (isSideEffectImportRegExp.test(str)) {
                    foundPaths.add(importPath);
                }

                const isInLoop = this.#checkingPathsStack.has(importPath);

                if (!isInLoop) {
                    this.#checkingPathsStack.add(importPath);

                    foundPaths = new Set([...foundPaths, ...this.#findSideEffectsInModule(importPath)]);

                    this.#checkingPathsStack.delete(importPath);
                }
            });

        return foundPaths ;
    }
}

module.exports = {
    SideEffectFinder
}
