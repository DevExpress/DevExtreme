'use strict';

const gulp = require('gulp');
const path = require('path');
const createVinyl = require('./utils/create-gulp-file');
const { run } = require('./utils');
const { createEntryPoint } = require('./common-steps');

function createNgEntryPoint(context) {
    return createEntryPoint(context, 'ngentrypoint.ts');
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
    return run([`npx ng-packagr -p ${path.join(process.cwd(), context.destination, 'package.json')}`], { });
}

module.exports = {
    createNgEntryPoint,
    preparePackageForPackagr,
    runPackagr,
}
