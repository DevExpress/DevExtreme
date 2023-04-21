'use strict';

const path = require('path');
const { spawn } = require('child_process');
const gulp = require('gulp');

const root = path.resolve(__dirname, '../..');

gulp.task('transpile-systemjs-builder', (callback) => {
    spawn('node', [path.resolve(root, 'testing/systemjs-builder.js'), '--transpile=builder'], { stdio: 'inherit' })
        .on('error', callback)
        .on('close', code => code ? callback(new Error(code)) : callback());
});

gulp.task('transpile-systemjs-modules', (callback) => {
    spawn('node', [path.resolve(root, 'testing/systemjs-builder.js'), '--transpile=modules'], { stdio: 'inherit' })
        .on('error', callback)
        .on('close', code => code ? callback(new Error(code)) : callback());
});

gulp.task('transpile-systemjs-modules-renovation', (callback) => {
    spawn('node', [path.resolve(root, 'testing/systemjs-builder.js'), '--transpile=modules-renovation'], { stdio: 'inherit' })
        .on('error', callback)
        .on('close', code => code ? callback(new Error(code)) : callback());
});

gulp.task('transpile-systemjs-testing', (callback) => {
    spawn('node', [path.resolve(root, 'testing/systemjs-builder.js'), '--transpile=testing'], { stdio: 'inherit' })
        .on('error', callback)
        .on('close', code => code ? callback(new Error(code)) : callback());
});

gulp.task('transpile-systemjs-css', (callback) => {
    spawn('node', [path.resolve(root, 'testing/systemjs-builder.js'), '--transpile=css'], { stdio: 'inherit' })
        .on('error', callback)
        .on('close', code => code ? callback(new Error(code)) : callback());
});

gulp.task('transpile-systemjs', gulp.series(
    'transpile-systemjs-builder',
    gulp.parallel(
        'transpile-systemjs-modules',
        'transpile-systemjs-modules-renovation',
        'transpile-systemjs-testing',
        'transpile-systemjs-css'
    )
));
