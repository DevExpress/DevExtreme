'use strict';

const gulp = require('gulp');
const path = require('path');
const createVinyl = require('./utils/create-gulp-file');
const { getComponentsSpecification } = require('./utils');
const fs = require('fs');
const del = require('del');

function createNgEntryPoint(context) {
    return () => {
        const contents = getComponentsSpecification(context.destination, context.components)
            .map(x => x.pathInRenovationFolder.slice(0, -2))
            .map(x => `export * from './${x}';`)
            .join('\n');

        return createVinyl('ngentrypoint.ts', contents)
            .pipe(gulp.dest(context.destination));
    };
}
function createTSConfig(context) {
    return () => {
        const config = {
            "buildOnSave": false,
            "compileOnSave": false,
            "compilerOptions": {
                "baseUrl": "./",
                "target": "es2015",
                "module": "es2015",
                "moduleResolution": "node",
                "outDir": "",
                "declaration": true,
                "inlineSourceMap": true,
                "inlineSources": true,
                "skipLibCheck": true,
                "emitDecoratorMetadata": true,
                "experimentalDecorators": true,
                "importHelpers": true,
                "lib": ["dom", "es2015"],
                "typeRoots": [
                    "./node_modules/@types",
                    "../../node_modules/@types"
                ],
            },
            "exclude": ["node_modules", "dist"]
        };
        return createVinyl('tsconfig.lib.json', JSON.stringify(config, null, 2))
            .pipe(gulp.dest(context.destination));
    };
}

function preparePackageForPackagr(packageObject, basePackageObject, context) {
    packageObject.ngPackage = {
        lib: {
            entryFile: 'ngentrypoint.ts'
        },
        allowedNonPeerDependencies: [
            "devextreme"
        ]
    }
}
function runPackagr(context) {
    const rootDir = path.resolve(__dirname, '../../../');
    const destinationDir = path.resolve(rootDir, context.destination);

    const runPackagr = function runPackagr(cb) {
        require('ng-packagr')
            .ngPackagr()
            .forProject(path.join(destinationDir, 'package.json'))
            .withTsConfig(path.join(destinationDir, 'tsconfig.lib.json'))
            .build()
            .catch(error => cb(error))
            .then(() => cb());
    }

    const renameTempToDestination = function renameTempToDestination(cb) {
        fs.renameSync(tempDir, destinationDir);
        cb();
    }

    return gulp.series(
        runPackagr,
        renameTempToDestination
    );
}

function afterNpmInstall(context) {
    const restore = function restorePackageJsonAfterNpmInstall(cb) {
        const fileBuffer = fs.readFileSync(path.join(context.destination, 'package.json.orig'));
        fs.writeFileSync(path.join(context.destination, 'package.json'), fileBuffer);
        cb();
    }

    const delDevextreme = function deleteDevExtremeAfterNpmInstall(cb) {
        del.sync(path.join(context.destination, 'node_modules/devextreme'));
        cb();
    }

    const rootDir = path.resolve(__dirname, '../../../');

    const copyCurrentDevExtremeSources = () => gulp.src(path.join(rootDir, context.destination, '../npm/devextreme/**/*'))
        .pipe(gulp.dest(path.join(rootDir, context.destination, 'node_modules/devextreme/')));

    return gulp.series(restore, delDevextreme, copyCurrentDevExtremeSources);
}
function beforeNpmInstall(context) {
    return function patchPackageJsonBeforeNpmInstall(cb) {
        const fileBuffer = fs.readFileSync(path.join(context.destination, 'package.json'));
        fs.writeFileSync(path.join(context.destination, 'package.json.orig'), fileBuffer);
        const packageObject = JSON.parse(fileBuffer.toString());

        packageObject.peerDependencies.devextreme = packageObject.peerDependencies.devextreme.split(' ')[0];
        fs.writeFileSync(path.join(context.destination, 'package.json'), JSON.stringify(packageObject, null, 2));

        cb();
    }
}

module.exports = {
    createNgEntryPoint,
    createTSConfig,
    preparePackageForPackagr,
    runPackagr,
    beforeNpmInstall,
    afterNpmInstall
}
