const fs = require('fs');
const path = require('path');

const modulesMetadataFilePath = path.join(__dirname, '../../build/gulp/modules_metadata.json');
const modulesCjsFilePath = path.join(__dirname, './entry/modules_cjs.js');
const modulesEsmFilePath = path.join(__dirname, './entry/modules_esm.js');

const globalizeCjs = 'const Globalize = require("globalize");';
const globalizeEsm = 'import Globalize from "globalize";';

const excludedModules = new Set(['core/set_template_engine', 'data/utils', 'viz/export', 'ui/overlay']);

const pathToName = (path) => {
    return path.replace(/(\/|_)+(\w)/g, (...args) => args[2].toUpperCase());
};

const importTemplate = {
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

const cjsImportsBag = [ globalizeCjs ];
const esmImportsBag = [ globalizeEsm ];

const addModule = (module) => {
    const exports = module.exports;
    if(exports) {
        for(const moduleExport in exports) {
            const type = exports[moduleExport].exportAs === 'type';
            if(!type) {
                const importType = moduleExport === 'default' ? moduleExport : 'named';
                cjsImportsBag.push(importTemplate.cjs[importType](module.name, moduleExport));
                esmImportsBag.push(importTemplate.esm[importType](module.name, moduleExport));
            }
        }
    } else {
        cjsImportsBag.push(importTemplate.cjs.empty(module.name));
        esmImportsBag.push(importTemplate.esm.empty(module.name));
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

fs.writeFileSync(modulesCjsFilePath, cjsImportsBag.join('\n'));
fs.writeFileSync(modulesEsmFilePath, esmImportsBag.join('\n'));
