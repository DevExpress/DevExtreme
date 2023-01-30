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
        path: 'angular/angular.js'
    },
    {
        path: 'exceljs/dist/exceljs.js'
    },
    {
        path: 'file-saver/dist/FileSaver.js'
    },
    {
        path: 'jquery/dist/jquery.js'
    },
    {
        path: 'jspdf/dist/jspdf.umd.js'
    },
    {
        path: 'jspdf-autotable'
    },
    {
        path: 'jszip/dist/jszip.js'
    },
    {
        path: 'knockout/build/output/knockout-latest.js',
        suffix: 'debug'
    },
    {
        path: 'cldrjs/dist/cldr.js',
        noUglyFile: true
    },
    {
        path: 'globalize/dist/globalize.js',
        noUglyFile: true
    },
    {
        path: ['event', 'supplemental', 'unresolved'].map(f => `cldrjs/dist/cldr/${f}.js`),
        noUglyFile: true,
        base: '/cldrjs/dist/'
    },
    {
        path: ['number', 'currency', 'date', 'message'].map(f => `globalize/dist/globalize/${f}.js`),
        noUglyFile: true,
        base: '/globalize/dist/'
    },
    {
        path: ['diagram', 'diagram.min'].map(f => `devexpress-diagram/dist/dx-${f}.js`)
    },
    {
        path: ['gantt', 'gantt.min'].map(f => `devexpress-gantt/dist/dx-${f}.js`)
    },
    {
        path: ['quill', 'quill.min'].map(f => `devextreme-quill/dist/dx-${f}.js`)
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
        const vendorPaths = Array.isArray(vendor.path) ? vendor.path : [vendor.path];
        const stream = gulp.src(vendorPaths.map(p => require.resolve(p)), sourceConfig)
            .pipe(gulp.dest(DESTINATION_JS_PATH));

        if(vendor.noUglyFile) {
            return stream
                .pipe(compressionPipes.minify())
                .pipe(rename({ suffix: '.min' }))
                .pipe(gulp.dest(DESTINATION_JS_PATH));
        }

        const path = vendorPaths.map(p => require.resolve(p.replace(/(min\.)?js$/, `${vendor.suffix || 'min'}.js`)));

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
