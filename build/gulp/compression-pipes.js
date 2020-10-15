'use strict';

const lazyPipe = require('lazypipe');
const replace = require('gulp-replace');
const uglify = require('gulp-uglify-es').default;
const gulpIf = require('gulp-if');
const eol = require('gulp-eol');
const prettify = require('gulp-jsbeautifier');

const context = require('./context.js');

const removeDebug = lazyPipe().pipe(function() {
    return replace(/\/{2,}#DEBUG[\s\S]*?\/{2,}#ENDDEBUG/g, '');
});

function saveLicenseComments(node, comment) {
    return comment.value.charAt(0) === '!'
        || comment.value.indexOf(context.EULA_URL) > -1;
}

module.exports = {

    removeDebug: removeDebug,

    minify: lazyPipe()
        .pipe(removeDebug)
        .pipe(function() {
            return gulpIf(context.uglify, uglify({
                output: {
                    ascii_only: true,
                    comments: saveLicenseComments
                }
            }));
        })
        .pipe(eol),

    beautify: lazyPipe()
        .pipe(function() {
            return gulpIf(context.uglify, uglify({
                mangle: false,
                warnings: false,
                compress: {
                    'sequences': false,
                    'properties': true,
                    'dead_code': true,
                    'drop_debugger': true,
                    'unsafe': false,
                    'conditionals': false,
                    'comparisons': false,
                    'evaluate': true,
                    'booleans': false,
                    'loops': false,
                    'unused': true,
                    'hoist_funs': false,
                    'hoist_vars': false,
                    'if_return': false,
                    'join_vars': false,
                    'collapse_vars': false,
                    'side_effects': false,
                    'global_defs': {}
                },
                output: {
                    'braces': true,
                    'ascii_only': true,
                    comments: saveLicenseComments
                }
            }));
        })
        .pipe(function() {
            return gulpIf(context.uglify, prettify());
        })
        .pipe(eol)
};
