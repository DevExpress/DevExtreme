'use strict';

const gulp = require('gulp');
const path = require('path');
const createVinyl = require('./utils/create-gulp-file');
const { camelCase, run, getComponentsSpecification } = require('./utils');

function createNgEntryPoint(context) {
    return () => {
        const contents = getComponentsSpecification(context.destination, context.components)
            .map(x => x.pathInRenovationFolder.slice(0, -2))
            .map(x => `export * as ${camelCase(x.split('/').splice(-1)[0])} from './${x}';`)
            .join('\n');
    
        return createVinyl('ngentrypoint.ts', contents)
            .pipe(gulp.dest(context.destination));
    };
}

function preparePackageForPackagr(packageObject, basePackageObject, context) {
    packageObject.ngPackage = {
        lib: {
            entryFile: 'ngentrypoint.ts'
        }
    }

    // TODO: We've hardcoded angular-specific refs because we're unable to refer them inside devextreme's package.json
    packageObject.peerDependencies = {
        ...packageObject.peerDependencies,
        "@angular/core": "^11.0.0",
        "@angular/common": "^11.0.0",
        "@angular/forms": "^11.0.0",
    }
}
function runPackagr(context) {
    // TODO: Calling ng-packagr via npx because it conflicts with the current typescript version
    return run('cmd', [`/c npx ng-packagr -p ${path.join(process.cwd(), context.destination, 'package.json')}`], { });
}

module.exports = {
    createNgEntryPoint,
    preparePackageForPackagr,
    runPackagr,
}
