const fs = require('fs');
const del = require('del');
const path = require('path');

function removeUnusedModules(context) {
    return function removeUnusedModules(cb) {
        const componentPaths = [];
        const components = require(path.resolve(process.cwd(), path.join(context.source, 'components.js')));
        const visitedModules = Object.keys(context.moduleMap).reduce((p, c) => {
            p[c] = false;
            return p;
        }, {});

        components.forEach(c => {
            const fileName = path.resolve(process.cwd(), path.join(context.source, c.pathInRenovationFolder.slice(0, -2)));
            context.extensions.forEach(ext => componentPaths.push(`${fileName}${ext}`));
        });

        const modulesToVisit = [...componentPaths];
        while (modulesToVisit.length) {
            const current = modulesToVisit.pop();
            const importedModules = context.moduleMap[current];
            if(visitedModules[current] || !importedModules) continue;

            visitedModules[current] = true;
            modulesToVisit.push(...importedModules);
        }
        const filesToRemove = Object.keys(context.moduleMap)
            .filter(m => !visitedModules[m])
            .map(m => {
                const sourcePath = path.resolve(process.cwd(), path.join(context.source));
                const destPath = path.resolve(process.cwd(), path.join(context.destination));
                return m.replace(sourcePath, destPath);
            });

        del.sync(filesToRemove);
        cb();
    }
}

function cleanEmptyFolders(destination) {
    return function cleanEmptyFoldersRecurcive(cb) {
        const isDir = fs.statSync(destination).isDirectory();
        if (!isDir) {
            cb();
            return;
        }
        let files = fs.readdirSync(destination);
        if (files.length > 0) {
            files.forEach(function(file) {
                const fullPath = path.join(destination, file);
                cleanEmptyFolders(fullPath)(cb);
            });
            files = fs.readdirSync(destination);
        }
    
        if (!files.length) {
          fs.rmdirSync(destination);
        }
        cb();
    }
}

module.exports = {
    removeUnusedModules,
    cleanEmptyFolders: (x) => cleanEmptyFolders(x.destination)
}
