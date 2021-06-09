const fs = require('fs');
const path = require('path');

const modulesMetadataFilePath = path.join(__dirname, '../../build/gulp/modules_metadata.json');
const modulesCjsFilePath = path.join(__dirname, './src/modules_cjs.js');
const modulesEsmFilePath = path.join(__dirname, './src/modules_esm.js');

const globalizeCjs = 'const Globalize = require("globalize");';
const globalizeEsm = 'import Globalize from "globalize";';
const prefix = 'devextreme/';

const excludeModules = new Set(['ui/set_template_engine', 'data/utils', 'viz/export', 'ui/diagram', 'ui/overlay']);

const modulesImports = {
    cjs: [ globalizeCjs ],
    esm: [ globalizeEsm ]
};

const getDefaultImportName = (moduleName) => {
    return moduleName.replace(/(\/|_)[a-z]/g, (match) => match[1].toUpperCase());
};

const getCjsImportString = (prefix, moduleName, importName) => {
    importName = (importName === 'default' || !importName) ? '' : `.${importName}`;
    return `require('${prefix}${moduleName}')${importName};`;
};

const getEsmImportString = (prefix, moduleName, importName) => {
    if(importName) {
        importName = (importName === 'default') ? `${ getDefaultImportName(moduleName) }` : `{ ${ importName } }`;
        importName = `${ importName } from`;
    } else {
        importName = '';
    }
    return `import ${ importName }'${prefix}${ moduleName }';`;
};

const addModule = (module, modulesImports) => {
    if(module.exports) {
        Object.entries(module.exports).forEach(([moduleExport, exportOptions]) => {
            const notType = (exportOptions.exportAs !== 'type');
            if(notType) {
                modulesImports.cjs.push(getCjsImportString(prefix, module.name, moduleExport));
                modulesImports.esm.push(getEsmImportString(prefix, module.name, moduleExport));
            }
        });
    } else {
        modulesImports.cjs.push(getCjsImportString(prefix, module.name));
        modulesImports.esm.push(getEsmImportString(prefix, module.name));
    }
};

const modulesMetadata = fs.readFileSync(modulesMetadataFilePath);
JSON.parse(modulesMetadata).forEach((moduleMetadata) => {
    const externalModule = !moduleMetadata.isInternal;
    const includedModule = !excludeModules.has(moduleMetadata.name);
    if(externalModule && includedModule) {
        addModule(moduleMetadata, modulesImports);
    }
});

fs.writeFileSync(modulesCjsFilePath, modulesImports.cjs.join('\n'));
fs.writeFileSync(modulesEsmFilePath, modulesImports.esm.join('\n'));
