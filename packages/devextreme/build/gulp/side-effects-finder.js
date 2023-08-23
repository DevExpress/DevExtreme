'use strict';

const fs = require('fs');
const path = require('path');

class SideEffectFinder {
    #checkingPathsStack = new Set();
    #dirtyImportsPaths = new Map();
    #cleanImportsPaths = new Set();
    getModuleSideEffectFiles(moduleFilePath) {
        try {
            this.#checkingPathsStack.clear();

            const moduleSideEffectFiles = [ ...this.#findSideEffectsInModule(moduleFilePath)]
                .map((importPath) => importPath.replace(/\\/g, '/'));

            return moduleSideEffectFiles;
        } catch (e) {
            const message = (e instanceof Error) ? e.message : e;
            throw(`Exception while check side effects. in ${moduleFilePath} \nException: ` + message + '\n');
        }
    }
    #findSideEffectsInModule(moduleFilePath) {
        if (this.#cleanImportsPaths.has(moduleFilePath)) {
            return new Set();
        }

        let foundPaths = this.#dirtyImportsPaths.get(moduleFilePath) || new Set();

        if (foundPaths.size === 0) {
            const code = fs.readFileSync(moduleFilePath, 'utf8');

            foundPaths = this.#findSideEffectsInImports(moduleFilePath, code);
            if (foundPaths.size === 0) {
                this.#cleanImportsPaths.add(moduleFilePath);
            }

            this.#dirtyImportsPaths.set(moduleFilePath, foundPaths);
        }

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
