'use strict';

const gulp = require('gulp');
const rename = require('gulp-rename');
const merge = require('merge-stream');
const compressionPipes = require('./compression-pipes.js');
const context = require('./context');

const PACKAGES_SOURCE = './node_modules';
const DESTINATION_JS_PATH = './' + context.RESULT_JS_PATH;
const DESTINATION_CSS_PATH = './artifacts/css';

const JS_VENDORS = [
    {
        path: '/angular/angular.js'
    },
    {
        path: '/jquery/dist/jquery.js'
    },
    {
        path: '/jszip/dist/jszip.js'
    },
    {
        path: '/knockout/build/output/knockout-latest.js',
        suffix: 'debug'
    },
    {
        path: '/cldrjs/dist/cldr.js',
        noUglyFile: true
    },
    {
        path: '/globalize/dist/globalize.js',
        noUglyFile: true
    },
    {
        path: '/cldrjs/dist/cldr/@(event|supplemental|unresolved).js',
        noUglyFile: true,
        base: '/cldrjs/dist/'
    },
    {
        path: '/globalize/dist/globalize/@(number|currency|date|message).js',
        noUglyFile: true,
        base: '/globalize/dist/'
    },
    {
        path: '/devexpress-diagram/dist/dx-@(diagram|diagram.min).js'
    },
    {
        path: '/devexpress-gantt/dist/dx-@(gantt|gantt.min).js'
    },
    {
        path: '/devextreme-quill/dist/dx-@(quill|quill.min).js'
    }
];

const CSS_VENDORS = [
    {
        path: '/devexpress-diagram/dist/dx-@(diagram|diagram.min).css'
    },
    {
        path: '/devexpress-gantt/dist/dx-@(gantt|gantt.min).css'
    }
];

gulp.task('vendor-js', function() {
    return merge.apply(this, JS_VENDORS.map(function(vendor) {
        const sourceConfig = vendor.base ? { base: PACKAGES_SOURCE + vendor.base } : null;
        const stream = gulp.src(PACKAGES_SOURCE + vendor.path, sourceConfig)
            .pipe(gulp.dest(DESTINATION_JS_PATH));

        if(vendor.noUglyFile) {
            return stream
                .pipe(compressionPipes.minify())
                .pipe(rename({ suffix: '.min' }))
                .pipe(gulp.dest(DESTINATION_JS_PATH));
        }

        const path = PACKAGES_SOURCE + vendor.path.replace(/js$/, `${vendor.suffix || 'min'}.js`);

        return merge(stream, gulp.src(path, sourceConfig)
            .pipe(gulp.dest(DESTINATION_JS_PATH))
        );
    }));
});

gulp.task('vendor-css', function() {
    return merge.apply(this, CSS_VENDORS.map(function(vendor) {
        return gulp.src(PACKAGES_SOURCE + vendor.path).pipe(gulp.dest(DESTINATION_CSS_PATH));
    }));
});

gulp.task('vendor', gulp.parallel('vendor-js', 'vendor-css'));
