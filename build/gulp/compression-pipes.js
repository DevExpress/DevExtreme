var lazyPipe = require('lazypipe');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var eol = require('gulp-eol');
var prettify = require('gulp-jsbeautifier');

var context = require('./context.js');

var removeDebug = lazyPipe().pipe(function() {
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
                compress: { screw_ie8: true },
                mangle: { screw_ie8: true },
                preserveComments: saveLicenseComments,
                output: { ascii_only: true }
            }));
        })
        .pipe(eol),

    beautify: lazyPipe()
        .pipe(function() {
            return gulpIf(context.uglify, uglify({
                mangle: false,
                compress: {
                    'screw_ie8': true,
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
                    'cascade': false,
                    'side_effects': false,
                    'warnings': false,
                    'global_defs': {}
                },
                preserveComments: saveLicenseComments,
                output: {
                    'bracketize': true,
                    'ascii_only': true
                }
            }));
        })
        .pipe(function() {
            return gulpIf(context.uglify, prettify());
        })
        .pipe(eol)
};
