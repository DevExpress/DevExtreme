/* eslint no-console: */
/* eslint no-undef: */
/* eslint-disable spellcheck/spell-checker */

const fs = require('fs');

const eslintNoUnusedVars = '/* eslint no-unused-vars: */\n';

const globalizeCjs = 'const Globalize = require(\'globalize\');\n';
const globalizeEsm = 'import Globalize from \'globalize\';\n';
const devextreme = 'devextreme';

const modulesMetadataFilePath = '../../build/gulp/modules_metadata.json';

const modulesCjsFilePath = './src/modules_cjs.js';
const modulesEsmFilePAth = './src/modules_esm.js';


const getCjsModuleFromObj = (module) => {
    if(module.exports) {
        const imports = [];
        Object.keys(module.exports).forEach((exp) => {
            exp = (exp === 'default') ? '' : `.${exp}`;
            imports.push(`require('${devextreme}/${module.name}')${exp};\n`);
        });
        return imports.join('');
    } else {
        return `require('${devextreme}/${module.name}');\n`;
    }
};

const getEsmModuleFromObj = (module) => {
    if(module.exports) {
        let importItems;
        if(module.exports.default) {
            const path = module.exports.default.path;
            importItems = path.slice(path.indexOf('.') + 1);
        } else {
            importItems = `{ ${Object.keys(module.exports).join(', ')} }`;
        }
        return `import ${ importItems } from '${devextreme}/${ module.name }';\n`;
    }
    return '';
};

try {
    let metadata = fs.readFileSync(modulesMetadataFilePath);
    metadata = JSON.parse(metadata);

    const cjsImports = [ eslintNoUnusedVars, globalizeCjs];
    const esmImports = [ eslintNoUnusedVars, globalizeEsm];

    metadata.forEach((module) => {
        if(module.isInternal !== true) {
            const cjsModule = getCjsModuleFromObj(module);
            const esmModule = getEsmModuleFromObj(module);

            cjsImports.push(cjsModule);
            esmImports.push(esmModule);
        }
    });

    fs.writeFileSync(modulesCjsFilePath, cjsImports.join(''));
    fs.writeFileSync(modulesEsmFilePAth, esmImports.filter((el) => !(el === '')).join(''));

} catch(err) {
    console.log(err);
}
