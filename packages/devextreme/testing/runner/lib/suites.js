const fs = require('fs');
const path = require('path');

function createSuitesService({
    knownConstellations,
    testsRoot,
}) {
    function readCategories() {
        const dirs = fs.readdirSync(testsRoot, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => path.join(testsRoot, entry.name))
            .filter(isNotEmptyDir)
            .map(categoryFromPath)
            .sort((a, b) => a.Name.localeCompare(b.Name));

        return dirs;
    }

    function readSuites(catName) {
        if(!catName) {
            throw new Error('Category name is required.');
        }

        const catPath = path.join(testsRoot, catName);

        const subDirs = fs.readdirSync(catPath, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name);

        subDirs.forEach((dirName) => {
            if(!dirName.endsWith('Parts')) {
                throw new Error(`Unexpected sub-directory in the test category: ${path.join(catPath, dirName)}`);
            }
        });

        const suites = fs.readdirSync(catPath, { withFileTypes: true })
            .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
            .map((entry) => suiteFromPath(catName, path.join(catPath, entry.name)))
            .sort((a, b) => a.ShortName.localeCompare(b.ShortName));

        return suites;
    }

    function getAllSuites({
        deviceMode,
        constellation,
        includeCategories,
        excludeCategories,
        excludeSuites,
        partIndex,
        partCount,
    }) {
        const includeSpecified = includeCategories && includeCategories.size > 0;
        const excludeSpecified = excludeCategories && excludeCategories.size > 0;
        const result = [];

        readCategories().forEach((category) => {
            if(deviceMode && !category.RunOnDevices) {
                return;
            }

            if(constellation && category.Constellation !== constellation) {
                return;
            }

            if(includeSpecified && !includeCategories.has(category.Name)) {
                return;
            }

            if(category.Explicit && (!includeSpecified || !includeCategories.has(category.Name))) {
                return;
            }

            if(excludeSpecified && excludeCategories.has(category.Name)) {
                return;
            }

            let index = 0;
            readSuites(category.Name).forEach((suite) => {
                if(partCount > 1 && (index % partCount) !== partIndex) {
                    index += 1;
                    return;
                }

                index += 1;

                if(excludeSuites && excludeSuites.has(suite.FullName)) {
                    return;
                }

                result.push(suite);
            });
        });

        return result;
    }

    function buildRunSuiteModel(catName, suiteName) {
        return {
            Title: suiteName,
            ScriptVirtualPath: getSuiteVirtualPath(catName, suiteName),
        };
    }

    function getSuiteVirtualPath(catName, suiteName) {
        return `/packages/devextreme/testing/tests/${catName}/${suiteName}`;
    }

    function categoryFromPath(categoryPath) {
        const name = path.basename(categoryPath);
        const metaPath = path.join(categoryPath, '__meta.json');
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        const constellation = String(meta.constellation || '');

        if(!knownConstellations.has(constellation)) {
            throw new Error(`Unknown constellation (group of categories):${constellation}`);
        }

        return {
            Name: name,
            Constellation: constellation,
            Explicit: Boolean(meta.explicit),
            RunOnDevices: Boolean(meta.runOnDevices),
        };
    }

    function suiteFromPath(catName, suitePath) {
        const suiteName = path.basename(suitePath);
        const shortName = path.basename(suitePath, '.js');

        return {
            ShortName: shortName,
            FullName: `${catName}/${suiteName}`,
            Url: `/run/${encodeURIComponent(catName)}/${encodeURIComponent(suiteName)}`,
        };
    }

    return {
        buildRunSuiteModel,
        getAllSuites,
        readCategories,
        readSuites,
    };
}

function isNotEmptyDir(dirPath) {
    try {
        return fs.readdirSync(dirPath).length > 0;
    } catch(_) {
        return false;
    }
}

module.exports = {
    createSuitesService,
};
