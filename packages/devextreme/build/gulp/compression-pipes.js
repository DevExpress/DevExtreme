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
        // Workaround for rrule, on v2.7.1 the space char was added to the license header https://github.com/jakubroztocil/rrule/commit/803c03b85ac074d92d443306805a68e104069c02#diff-a2a171449d862fe29692ce031981047d7ab755ae7f84c707aef80701b3ea0c80R1
        || comment.value.startsWith(' !')
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
