'use strict';

const fs = require('fs');
const path = require('path');
 class SideEffectFinder {
    #sideEffectFiles = new Set();
    #checkedImportsCache = new Set();
    #noSideEffectsFilesCache = new Set();
    getModuleSideEffectFiles(moduleFilePath) {
        try {
            this.#sideEffectFiles.clear();
            this.#checkedImportsCache.clear();
            this.#noSideEffectsFilesCache.clear();

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

    #findSideEffectsInModule(moduleFilePath, deep = 0) {
        const code = fs.readFileSync(moduleFilePath, 'utf8');

        const hasSideEffectsInImports = this.#findSideEffectsInImports(moduleFilePath, code, deep);

        this.#checkedImportsCache.clear();
        return hasSideEffectsInImports;
    }

    #findSideEffectsInImports(modulePath, code, deep) {
        const hasRelativePathRegExp = /['"]\.?\.\/.+/;
        const relativePathRegExp = /['"]\.?\.\/.+['"]/;
        const hasSideEffectImportRegExp = /^\s*import\s+['"]/ms;

        let imports = code.match(/^\s*import[^;]+;/mg) || [];
        let found = false;

        imports.filter((str) => hasRelativePathRegExp.test(str) /*&& (/\s+from\s+/ms).test(str)*/)
            .forEach((str) => {
                let pathFromImport = str.match(relativePathRegExp)[0].replace(/(^['"]|['"]$)/g, '');
                pathFromImport = path.join(path.dirname(modulePath), pathFromImport)+'.js';

                if(!fs.existsSync(pathFromImport)) {
                    pathFromImport = pathFromImport.replace(/\.js$/, '/index.js')
                }

                if (hasSideEffectImportRegExp.test(str)) {
                    this.#sideEffectFiles.add(pathFromImport);
                }

                if (this.#noSideEffectsFilesCache.has(pathFromImport)) {
                    return false;
                }

                const alreadyChecked = this.#checkedImportsCache.has(pathFromImport);
                let isDirty = false;

                if (!alreadyChecked) {
                    this.#checkedImportsCache.add(pathFromImport);
                    isDirty = !!this.#findSideEffectsInModule(pathFromImport, deep + 1);
                }

                this.#checkedImportsCache.delete(pathFromImport);

                if (!isDirty) {
                    this.#noSideEffectsFilesCache.add(pathFromImport);
                }

                found = found || isDirty;
            });

        return found;
    }
}

module.exports = {
    SideEffectFinder
}
