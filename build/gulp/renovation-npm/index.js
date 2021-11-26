'use strict';

const gulp = require('gulp');
const del = require('del');
const merge = require('merge-stream');
const ctx = require('../context.js');
const { version } = require('../../../package.json');
const replace = require('gulp-replace');
const through = require('through2');
const path = require('path');
const performRecastReplacements = require('./replacements-import');
const performPackageLockReplacements = require('./replacements-package-lock');
const removeFiles = require('./remove-unused-modules');
const babel = require('gulp-babel');
const transpileConfig = require('../transpile-config');
const { run } = require('./utils');
const gulpIf = require('gulp-if');

function copyServiceFiles(context) {
    return () => merge(
        gulp
            .src('package.json')
            .pipe(replace(version, ctx.version.package))
            .pipe(performPackageLockReplacements(context))
            .pipe(gulp.dest(context.destination)),
        gulp
            .src('README.md')
            .pipe(gulp.dest(context.destination)),
        ...context.copyFilesSteps.map(x=>x(context))
    );
}
function cleanNpmFramework(context) {
    return function cleanNpmFramework(done) {
        del.sync(context.destination);
        done();
    };
}
function copyFrameworkArtifacts(context) {
    return () => merge(
        gulp.src(context.source + '/**/*')
            .pipe(performRecastReplacements(context))
            .pipe(gulp.dest(context.destination))
    );
}

function transpileJSModules(context) {
    return () => gulp.src(`${context.destination}/**/*.js`)
                    .pipe(babel(transpileConfig.esm))
                    .pipe(gulp.dest(context.destination));
}

function addCompilationTask(frameworkData) {
    const context = {
        packageLockSteps: [],
        completionSteps: [],
        copyFilesSteps: [],
        source: `artifacts/${frameworkData.name}/renovation`,
        destination: `artifacts/npm-${frameworkData.name}`,
        extensions: ['.js', '.ts', '.d.ts', '.tsx'],
        ...frameworkData,
    }
    const generateSeries = [
        cleanNpmFramework(context),
        context.generator,
        copyFrameworkArtifacts(context),
        copyServiceFiles(context),
        removeFiles.removeUnusedModules(context),
        removeFiles.cleanEmptyFolders(context.destination),
        ...(frameworkData.transpileJS ? [transpileJSModules(context)] : []),
        run('cmd', ['/c npm i'], { cwd: context.destination }),
        ...context.completionSteps.map(x=>x(context))
    ];
    
    gulp.task(`renovation-npm-${context.name}`, gulp.series(...generateSeries));
}

addCompilationTask({
    name: 'react',
    generator: 'generate-react',
    transpileJS: true,
    packageLockSteps: [require('./steps-react').preparePackage],
    copyFilesSteps: [require('./steps-react').createReactEntryPoint]
});
addCompilationTask({
    name: 'angular',
    generator: 'generate-angular-v2',
    packageLockSteps: [require('./steps-angular').preparePackageForPackagr],
    // completionSteps: [require('./steps-angular').runPackagr],
    copyFilesSteps: [require('./steps-angular').createNgEntryPoint]
});
