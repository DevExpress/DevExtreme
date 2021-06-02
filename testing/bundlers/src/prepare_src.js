/* eslint no-console: */
/* eslint no-undef: */

const fs = require('fs');

const getCjsModuleFromObj = (module) => {
    if(module.exports) {
        const imports = [];
        Object.keys(module.exports).forEach((exp) => {
            exp = (exp === 'default') ? '' : `.${exp}`;
            imports.push(`require('devextreme/${module.name}')${exp};\n`);
        });
        return imports.join('');
    } else {
        return `require('devextreme/${module.name}');\n`;
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
        return `import ${ importItems } from 'devextreme/${ module.name }';\n`;
    }
    return '';
};

try {
    let metadata = fs.readFileSync('../../build/gulp/modules_metadata.json');
    metadata = JSON.parse(metadata);

    const cjsImports = [];
    const esmImports = ['/* eslint no-unused-vars: */\n'];

    metadata.forEach((module) => {
        if(module.isInternal !== true) {
            const cjsModule = getCjsModuleFromObj(module);
            const esmModule = getEsmModuleFromObj(module);

            cjsImports.push(cjsModule);
            esmImports.push(esmModule);
        }
    });

    fs.writeFileSync('./src/modules_cjs.js', cjsImports.filter((el) => !(el === '')).join(''));
    fs.writeFileSync('./src/modules_esm.js', esmImports.filter((el) => !(el === '')).join(''));

} catch(err) {
    console.log(err);
}
