'use strict';

const gulp = require('gulp');
const through = require('through2');
const path = require('path');
const ngPackager = require('ng-packagr');
const createVinyl = require('./utils/create-gulp-file');

function camelCase(str) {
    return str
        .split('_')
        .map(x => `${x[0].toUpperCase()}${x.slice(1)}`)
        .join('');
}
function createNgEntryPoint(context) {
    const components = require(path.resolve(process.cwd(), path.join(context.destination, 'components.js')));
    const contents = components
        .map(x => x.pathInRenovationFolder.slice(0, -2))
        .map(x => `export * as ${camelCase(x.split('/').splice(-1)[0])} from './${x}';`)
        .join('\n');
    
    return createVinyl('ngentrypoint.ts', contents)
        .pipe(gulp.dest(context.destination));
}

function preparePackageForPackagr(packageObject, basePackageObject, context) {
    packageObject.ngPackage = {
        lib: {
            entryFile: 'ngentrypoint.ts'
        }
    }
}
function runPackagr(context) {
    const name = `packer-${context.name}`;
    gulp.task(name, () => ngPackager.ngPackagr()
        .forProject(path.join(context.destination, 'package.json'))
        // .withTsConfig('tsconfig.lib.json')
        .build());
    return name;
}

module.exports = {
    createNgEntryPoint,
    preparePackageForPackagr,
    runPackagr
}
