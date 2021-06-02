/* eslint no-console: */
/* eslint no-undef: */

const fs = require('fs');

const getCjsModuleFromObj = (module) => {
    if(module.exports) {
        const imports = [];
        Object.keys(module.exports).forEach((exp) => {
            exp = (exp === 'default') ? '' : `.${exp}`;
            imports.push(`require('${module.name}')${exp};\n`);
        });
        return imports.join('');
    } else {
        return `require('${module.name}');\n`;
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
        return `import ${ importItems } from '${ module.name }';\n`;
    }
    return '';
};

try {
    let metadata = fs.readFileSync('../../build/gulp/modules_metadata.json');
    metadata = JSON.parse(metadata);

    const cjsImports = [];
    const esmImports = [];

    metadata.forEach((module) => {
        if(module.isInternal !== true) {
            const cjsModule = getCjsModuleFromObj(module);
            const esmModule = getEsmModuleFromObj(module);

            cjsImports.push(cjsModule);
            esmImports.push(esmModule);
        }
    });

    fs.writeFileSync('./src/dinamic_modules_cjs.js', cjsImports.filter((el) => !(el === '')).join(''));
    fs.writeFileSync('./src/dinamic_modules_esm.js', esmImports.filter((el) => !(el === '')).join(''));

} catch(err) {
    console.log(err);
}
