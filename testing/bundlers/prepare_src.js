/* eslint no-console: */
/* eslint no-undef: */
/* eslint-disable spellcheck/spell-checker */

const fs = require('fs');

const globalizeCjs = 'const Globalize = require(\'globalize\');\n';
const globalizeEsm = 'import Globalize from \'globalize\';\n';
const prefix = 'devextreme/';

const modulesMetadataFilePath = '../../build/gulp/modules_metadata.json';
const modulesCjsFilePath = './src/modules_cjs.js';
const modulesEsmFilePAth = './src/modules_esm.js';

const excludeModules = ['ui/set_template_engine', 'core/element', 'data/utils', 'viz/export', 'ui/diagram', 'ui/overlay'];

const cjsImports = [ globalizeCjs ];
const esmImports = [ globalizeEsm ];

const getModuleFromObj = (module, cjsImports, esmImports) => {
    if(module.exports) {
        Object.keys(module.exports).map((expr) => {
            if(!(module.exports[expr].exportAs === 'type')) {
                const path = module.exports[expr].path;
                let importItem = path.slice(path.lastIndexOf('.') + 1);

                if(expr === 'default') {
                    expr = '';
                } else {
                    expr = `.${importItem}`;
                    importItem = `{ ${importItem} }`;
                }

                cjsImports.push(`require('${prefix}${module.name}')${expr};\n`);
                esmImports.push(`import ${ importItem } from '${prefix}${ module.name }';\n`);
            }
        });
    } else {
        cjsImports.push(`require('${prefix}${module.name}');\n`);
    }
};

try {
    JSON.parse(fs.readFileSync(modulesMetadataFilePath)).forEach((module) => {
        if(!module.isInternal &&
           !(excludeModules.includes(module.name))) {
            getModuleFromObj(module, cjsImports, esmImports);
        }
    });

    fs.writeFileSync(modulesCjsFilePath, cjsImports.join(''));
    fs.writeFileSync(modulesEsmFilePAth, esmImports.join(''));

} catch(err) {
    console.log(err);
}
