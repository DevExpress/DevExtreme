'use strict';

const ctx = require('../context.js');
const through = require('through2');
const versionUtils = require('./utils/version-utils');

function performPackageLockReplacements(context) {
    const frameworkName = context.name;
    return through.obj((file, enc, callback) => {
        const basePackageObject = JSON.parse(file.contents.toString());
        
        const packageObject = {
            name: `@devextreme/${frameworkName}`
        };
        
        const knownFields = ['version', 'description', 'keywords', 'homepage', 'bugs', 'author', 'repository', 'license', 'browserslist'];
        knownFields.forEach(x => packageObject[x] = basePackageObject[x]);

        const depsList = new Array(...context.rawPackageSet).map(x => {
            const splitted = x.split('/');
            if (splitted.length != 1 && splitted[0].startsWith('@')) {
                return `${splitted[0]}/${splitted[1]}`;
            }
            return splitted[0];
        });
        const depsListDistinct = new Array(...new Set(depsList));

        packageObject.dependencies = {};

        ['dependencies', 'peerDependencies', 'devDependencies'].forEach(field => {
            if (!basePackageObject[field]) {
                return;
            }
            packageObject[field] = {};
            depsListDistinct.forEach(x => {
                packageObject[field][x] = basePackageObject[field][x];
            });
        });

        const version = versionUtils.parse(ctx.version.package);
        packageObject.dependencies.devextreme = versionUtils.stringify({
            major: version.major,
            minor: version.minor,
            suffix: 'next'
        });

        context.packageLockSteps.forEach(x => x(packageObject, basePackageObject, context));

        file.contents = Buffer.from(JSON.stringify(packageObject, null, 2), enc);
        callback(null, file);
    });
}

module.exports = performPackageLockReplacements;
