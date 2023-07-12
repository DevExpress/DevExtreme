const fs = require('fs');
const path = require('path');

const modulesMetadataFilePath = path.join(__dirname, '../../build/gulp/modules_metadata.json');

const filePaths = {
    cjs: path.join(__dirname, './entry/modules_cjs.js'),
    esm: path.join(__dirname, './entry/modules_esm.js')
};

const excludedModules = new Set([
    'core/set_template_engine',
    'data/utils',
    'ui/overlay',
    'viz/export']);

const pathToName = (path) => {
    return path.replace(/(\/|_)+(\w)/g, (...args) => args[2].toUpperCase());
};

const importTemplates = {
    cjs: {
        empty: (modulePath) => `require('devextreme/${modulePath}');`,
        default: (modulePath) => `require('devextreme/${modulePath}');`,
        named: (modulePath, moduleExport) => `require('devextreme/${modulePath}').${moduleExport};`
    },
    esm: {
        empty: (modulePath) => `import 'devextreme/${modulePath}';`,
        default: (modulePath) => `import ${pathToName(modulePath)} from 'devextreme/${modulePath}';`,
        named: (modulePath, moduleExport) => `import { ${moduleExport} } from 'devextreme/${modulePath}';`,
    }
};

const importsBags = {
    cjs: [ 'const Globalize = require("globalize");' ],
    esm: [ 'import Globalize from "globalize";' ]
};

const pushToBags = ({ name, moduleExport, type }) => {
    [ 'cjs', 'esm' ].forEach((standard) => {
        importsBags[standard].push(importTemplates[standard][type](name, moduleExport));
    });
};

const addModule = ({ name, exports }) => {
    if(!exports) {
        pushToBags({ name, type: 'empty' });
        return;
    }

    for(const moduleExport in exports) {
        const skipModule = exports[moduleExport].exportAs === 'type';
        if(skipModule) {
            continue;
        }

        pushToBags({
            name,
            moduleExport,
            type: moduleExport === 'default' ? moduleExport : 'named'
        });
    }
};

const modulesMetadata = fs.readFileSync(modulesMetadataFilePath);
JSON.parse(modulesMetadata).forEach((moduleMetadata) => {
    const publicModule = !moduleMetadata.isInternal;
    const excludedModule = excludedModules.has(moduleMetadata.name);
    if(publicModule && !excludedModule) {
        addModule(moduleMetadata);
    }
});

const writeToFiles = () => {
    [ 'cjs', 'esm' ].forEach((standard) => {
        fs.writeFileSync(filePaths[standard], importsBags[standard].join('\n'));
    });
};

writeToFiles();
