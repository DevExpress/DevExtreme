'use strict';

const gulp = require('gulp');
const through = require('through2');
const path = require('path');
//const ngPackager = require('ng-packagr');
const createVinyl = require('./utils/create-gulp-file');
const { camelCase } = require('./utils')

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

    packageObject.peerDependencies = packageObject.peerDependencies || {};
    packageObject.peerDependencies["@angular/core"] = "^11.0.0";
    packageObject.peerDependencies["@angular/common"] = "^11.0.0";
    packageObject.peerDependencies["@angular/forms"] = "^11.0.0";
}
/* function runPackagr(context) {
    const name = `packer-${context.name}`;
    gulp.task(name, () => ngPackager.ngPackagr()
        .forProject(path.join(context.destination, 'package.json'))
        // .withTsConfig('tsconfig.lib.json')
        .build());
    return name;
} */

module.exports = {
    createNgEntryPoint,
    preparePackageForPackagr,
    // runPackagr
}
