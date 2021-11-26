const createVinyl = require('./utils/create-gulp-file');
const { camelCase } = require('./utils')
const path = require('path');
const gulp = require('gulp');

function createReactEntryPoint(context) {
    const components = require(path.resolve(process.cwd(), path.join(context.destination, 'components.js')));
    const contents = components
        .map(x => x.pathInRenovationFolder.slice(0, -2))
        .map(x => `    ${camelCase(x.split('/').splice(-1)[0])}: require('./${x}')`)
        .join(',\n');
    const entryPointTemplate =
        `const modules = {
${contents}
}
module.exports = modules;
`
    
    return createVinyl('entrypoint.js', entryPointTemplate)
        .pipe(gulp.dest(context.destination));
}

function createModuleEntryPointers(context) {
    const components = require(path.resolve(process.cwd(), path.join(context.destination, 'components.js')));
    const vinyls = components.map(c => {
        const name = (c.name.charAt(0).toLowerCase() + c.name.slice(1)).replace(/[A-Z]/g, m => "-" + m.toLowerCase());
        return {
            fileName: `${name}.js`,
            content: `import ${c.name} from './${c.pathInRenovationFolder.slice(0, -2)}';
    export default ${c.name};`
        };
    }).map(ef => {
        return createVinyl(ef.fileName, ef.content)
                .pipe(gulp.dest(context.destination))
    });

    return vinyls;
}

function preparePackage(packageObject, basePackageObject, context) {
    const vreact = packageObject.devDependencies["react"];
    const vreactDom = packageObject.devDependencies["react-dom"];

    delete packageObject.devDependencies["react"];
    delete packageObject.devDependencies["react-dom"];

    packageObject.peerDependencies = packageObject.peerDependencies || {};
    packageObject.peerDependencies["react"] = `>= ${vreact}`;
    packageObject.peerDependencies["react-dom"] = `>= ${vreactDom}`;
}

module.exports = {
    createReactEntryPoint,
    createModuleEntryPointers,
    preparePackage,
}
