'use strict';

const ctx = require('../context.js');
const through = require('through2');
const versionUtils = require('./utils/version-utils');

function performPackageReplacements(context, additionalReplacements) {
    const frameworkName = context.name;
    return through.obj((file, enc, callback) => {
        const basePackageObject = JSON.parse(file.contents.toString());

        const packageObject = {
            name: `@devextreme/${frameworkName}`
        };

        const knownFields = ['version', 'description', 'keywords', 'homepage', 'bugs', 'author', 'repository', 'license', 'browserslist'];
        knownFields.forEach(x => packageObject[x] = basePackageObject[x]);

        const depsList = new Array(...context.rawPackageSet)
        .map(x => {
            const splitted = x.split('/');
            if (splitted.length != 1 && splitted[0].startsWith('@')) {
                return `${splitted[0]}/${splitted[1]}`;
            }
            return splitted[0];
        })
        .filter(x => !x.includes('@devextreme-generator'));

        const depsListDistinct = new Array(...new Set(depsList));

        packageObject.dependencies = {};

        ['dependencies', 'peerDependencies', 'devDependencies'].forEach(field => {
            if (!basePackageObject[field]) {
                return;
            }
            packageObject[field] = {};
            depsListDistinct.forEach(x => {
                const packageVersion = basePackageObject[field][x];
                packageObject[field][x] = packageVersion?.replace(/file:\.\.\//, 'file:../../../');
            });
        });

        const version = versionUtils.parse(ctx.version.package);
        const dxversion = versionUtils.stringify({
            major: version.major,
            minor: version.minor,
            suffix: 'next'
        });

        if (context.production) {
            packageObject.dependencies.devextreme = dxversion;
        } else {
            packageObject.dependencies.devextreme = `${dxversion} || ${basePackageObject.version}`;
        }

        packageObject.peerDependencies = packageObject.peerDependencies || {};
        packageObject.peerDependencies = {
            ...packageObject.peerDependencies,
            ...packageObject.dependencies
        }
        delete packageObject.dependencies;

        if (additionalReplacements) {
            additionalReplacements(packageObject, basePackageObject, context);
        }

        if (context.production) {
            delete packageObject.peerDependencies.devextreme;
            packageObject.dependencies = {
                devextreme: dxversion
            };
        }

        file.contents = Buffer.from(JSON.stringify(packageObject, null, 2), enc);
        callback(null, file);
    });
}

module.exports = performPackageReplacements;
