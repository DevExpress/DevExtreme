// jshint node:true

"use strict";

const gulp = require('gulp');
const rename = require('gulp-rename');
const merge = require('merge-stream');
const context = require('./context.js');
const compressionPipes = require('./compression-pipes.js');

const PACKAGES_SOURCE = './node_modules';
const DESTINATION_PATH = './artifacts/js';

const VENDORS = [
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
    }
];

gulp.task('vendor', function() {
    return merge.apply(this, VENDORS.map(function(vendor) {
        let sourceConfig = vendor.base ? { base: PACKAGES_SOURCE + vendor.base } : null;
        let source = gulp.src(PACKAGES_SOURCE + vendor.path, sourceConfig);
        let stream = merge(source.pipe(gulp.dest(DESTINATION_PATH)));

        if(context.uglify) {
            if(vendor.noUglyFile) {
                stream.add(source
                    .pipe(compressionPipes.minify())
                    .pipe(rename({ suffix: '.min' }))
                    .pipe(gulp.dest(DESTINATION_PATH))
                );
            } else {
                let path = PACKAGES_SOURCE + vendor.path.replace(/js$/, `${vendor.suffix || 'min'}.js`);
                let minSource = gulp.src(path, sourceConfig);
                stream.add(minSource.pipe(gulp.dest(DESTINATION_PATH)));
            }
        }

        return stream;
    }));
});
