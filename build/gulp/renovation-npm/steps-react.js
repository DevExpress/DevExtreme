const createVinyl = require('./utils/create-gulp-file');
const { getComponentsSpecification } = require('./utils')
const path = require('path');
const gulp = require('gulp');
const merge = require('merge-stream');
const { createEntryPoint } = require('./common-steps');

function createReactEntryPoint(context) {
    return createEntryPoint(context, 'entrypoint.js');
}

function createModuleEntryPointers(context) {
    return () => {
        const vinyls = getComponentsSpecification(context.destination, context.components)
            .map(c => {
                const name = (c.name.charAt(0).toLowerCase() + c.name.slice(1)).replace(/[A-Z]/g, m => "-" + m.toLowerCase());
                const componentPath = `./${c.pathInRenovationFolder.slice(0, -2)}`;
                return {
                    fileName: `${name}.js`,
                    content: `import { ${c.name} } from '${componentPath}';
    export * from '${componentPath}';
    export default ${c.name};
    `
                };
            }).map(ef => {
                return createVinyl(ef.fileName, ef.content)
                    .pipe(gulp.dest(context.destination))
            });

        return merge(vinyls);
    };
}

function preparePackage(packageObject, basePackageObject, context) {
    packageObject.peerDependencies["react"] = `>= ${packageObject.devDependencies["react"]}`;
    packageObject.peerDependencies["react-dom"] = `>= ${packageObject.devDependencies["react-dom"]}`;

    delete packageObject.devDependencies;
}

module.exports = {
    createReactEntryPoint,
    createModuleEntryPointers,
    preparePackage,
}
