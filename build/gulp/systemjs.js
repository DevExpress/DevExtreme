'use strict';

const path = require('path');
const { spawn } = require('child_process');
const gulp = require('gulp');

const root = path.resolve(__dirname, '../..');
gulp.task('transpile-systemjs-modules', (callback) => {
    spawn('node', [path.resolve(root, 'testing/systemjs-builder.js'), '--transpile=modules'], { stdio: 'inherit' })
        .on('error', callback)
        .on('close', code => code ? callback(new Error(code)) : callback());
})

gulp.task('transpile-systemjs-tests', (callback) => {
    spawn('node', [path.resolve(root, 'testing/systemjs-builder.js'), '--transpile=tests'], { stdio: 'inherit' })
        .on('error', callback)
        .on('close', code => code ? callback(new Error(code)) : callback());
})

gulp.task('transpile-systemjs-helpers', (callback) => {
    spawn('node', [path.resolve(root, 'testing/systemjs-builder.js'), '--transpile=helpers'], { stdio: 'inherit' })
        .on('error', callback)
        .on('close', code => code ? callback(new Error(code)) : callback());
})

gulp.task('transpile-systemjs-css', (callback) => {
    spawn('node', [path.resolve(root, 'testing/systemjs-builder.js'), '--transpile=css'], { stdio: 'inherit' })
        .on('error', callback)
        .on('close', code => code ? callback(new Error(code)) : callback());
})

gulp.task('transpile-systemjs', gulp.parallel(
    'transpile-systemjs-modules',
    'transpile-systemjs-tests',
    'transpile-systemjs-helpers',
    'transpile-systemjs-css'
));
