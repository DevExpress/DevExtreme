'use strict';

const gulp = require('gulp');
const path = require('path');
const rename = require('gulp-rename');
const merge = require('merge-stream');
const compressionPipes = require('./compression-pipes.js');
const context = require('./context');

const PACKAGES_SOURCE = './node_modules';
const DESTINATION_JS_PATH = './' + context.RESULT_JS_PATH;
const DESTINATION_CSS_PATH = './artifacts/css';

const JS_VENDORS = [
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
        path: 'cldrjs/dist/cldr/event.js',
        dir: 'cldr',
        noUglyFile: true
    },
    {
        path: 'cldrjs/dist/cldr/supplemental.js',
        dir: 'cldr',
        noUglyFile: true
    },
    {
        path: 'cldrjs/dist/cldr/unresolved.js',
        dir: 'cldr',
        noUglyFile: true
    },
    {
        path: 'globalize/dist/globalize/number.js',
        dir: 'globalize',
        noUglyFile: true
    },
    {
        path: 'globalize/dist/globalize/currency.js',
        dir: 'globalize',
        noUglyFile: true
    },
    {
        path: 'globalize/dist/globalize/date.js',
        dir: 'globalize',
        noUglyFile: true
    },
    {
        path: 'globalize/dist/globalize/message.js',
        dir: 'globalize',
        noUglyFile: true
    },
    {
        path: 'devexpress-diagram/dist/dx-diagram.js'
    },
    {
        path: 'devexpress-diagram/dist/dx-diagram.min.js'
    },
    {
        path: 'devexpress-gantt/dist/dx-gantt.js'
    },
    {
        path: 'devexpress-gantt/dist/dx-gantt.min.js'
    },
    {
        path: 'devextreme-quill/dist/dx-quill.js'
    },
    {
        path: 'devextreme-quill/dist/dx-quill.min.js'
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
        const sourceConfig = vendor.base ? { dir: PACKAGES_SOURCE + vendor.base } : null;
        const vendorSource = require.resolve(vendor.path);
        const dest = vendor.dir ? `${DESTINATION_JS_PATH}/${vendor.dir}` : DESTINATION_JS_PATH;
        const stream = gulp.src(vendorSource, sourceConfig)
            .pipe(gulp.dest(dest));

        if(vendor.noUglyFile) {
            return stream
                .pipe(compressionPipes.minify())
                .pipe(rename({ suffix: '.min' }))
                .pipe(gulp.dest(dest));
        }

        const path = vendorSource.replace(/(min\.)?js$/, `${vendor.suffix || 'min'}.js`);

        return merge(stream, gulp.src(path, sourceConfig)
            .pipe(gulp.dest(dest))
        );
    }));
});

gulp.task('vendor-css', function() {
    return merge.apply(this, CSS_VENDORS.map(function(vendor) {
        return gulp.src(path.resolve(__dirname, '../../', PACKAGES_SOURCE) + vendor.path).pipe(gulp.dest(DESTINATION_CSS_PATH));
    }));
});

gulp.task('vendor', gulp.parallel('vendor-js', 'vendor-css'));
