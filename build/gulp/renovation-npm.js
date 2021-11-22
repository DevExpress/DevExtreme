'use strict';

const gulp = require('gulp');
const del = require('del');
const merge = require('merge-stream');
const ctx = require('./context.js');
const { version } = require('../../package.json');
const replace = require('gulp-replace');

function copyServiceFiles(dist) {
    return () => merge(
        gulp
            .src('package.json')
            .pipe(replace(version, ctx.version.package))
            .pipe(gulp.dest(dist)),
        gulp
            .src('README.md')
            .pipe(gulp.dest(dist))
    );
}
function cleanNpmFramework(destination) {
    return function cleanNpmFramework(done) {
        del.sync(destination);
        done();
    };
}
function copyFrameworkArtifacts(source, destination) {
    return () => merge(
        gulp.src(source)
            .pipe(gulp.dest(destination))
    );
}

function addCompilationTask(frameworkName) {
    const frameworkSrc = `artifacts/${frameworkName}/renovation/**/*`;
    const npmDestFolder = `artifacts/npm-${frameworkName}`;
    const generateSeries = [
        cleanNpmFramework(npmDestFolder),
        `generate-${frameworkName}`,
        copyFrameworkArtifacts(frameworkSrc, npmDestFolder),
        copyServiceFiles(npmDestFolder)
    ];
    gulp.task(`renovation-npm-${frameworkName}`, gulp.series(...generateSeries));
}

addCompilationTask('react');
addCompilationTask('angular');
