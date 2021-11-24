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

function addCompilationTask(frameworkData) {
    const context = {
        packageLockSteps: [],
        completionSteps: [],
        copyFilesSteps: [],
        ...frameworkData,
        source: `artifacts/${frameworkData.name}/renovation`,
        destination: `artifacts/npm-${frameworkData.name}`,
    }
    const generateSeries = [
        cleanNpmFramework(context),
        context.generator,
        copyFrameworkArtifacts(context),
        copyServiceFiles(context),
        ...context.completionSteps.map(x=>x(context))
    ];
    gulp.task(`renovation-npm-${context.name}`, gulp.series(...generateSeries));
}

addCompilationTask({
    name: 'react',
    generator: 'generate-react',
});
addCompilationTask({
    name: 'angular',
    generator: 'generate-angular-v2',
    packageLockSteps: [require('./steps-angular').preparePackageForPackagr],
    // completionSteps: [require('./steps-angular').runPackagr],
    copyFilesSteps: [require('./steps-angular').createNgEntryPoint]
});
