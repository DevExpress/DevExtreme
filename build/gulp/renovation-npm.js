'use strict';

const gulp = require('gulp');
const del = require('del');

function addCompilationTask(frameworkName) {
    const frameworkSrc = `artifacts/${frameworkName}/renovation/**/*`;
    const npmDestFolder = `artifacts/npm-${frameworkName}`;
    const generateSeries = [
        function cleanNpmFramework(cb) {
            del.sync(npmDestFolder);
            cb();
        },
        `generate-${frameworkName}`,
        function copyFrameworkArtifacts() {
            return gulp.src(frameworkSrc)
                .pipe(gulp.dest(npmDestFolder));
        }
    ];
    gulp.task(`renovation-npm-${frameworkName}`, gulp.series(...generateSeries));
}

addCompilationTask('react');
addCompilationTask('angular');