const gulp = require('gulp');
const rename = require('gulp-rename');
const merge = require('merge-stream');
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
    },
    {
        path: '/quill/dist/quill.js'
    },
    {
        path: '/showdown/dist/showdown.js'
    },
    {
        path: '/turndown/lib/turndown.browser.umd.js'
    }
];

gulp.task('vendor', function() {
    return merge.apply(this, VENDORS.map(function(vendor) {
        let sourceConfig = vendor.base ? { base: PACKAGES_SOURCE + vendor.base } : null;
        let stream = gulp.src(PACKAGES_SOURCE + vendor.path, sourceConfig).pipe(gulp.dest(DESTINATION_PATH));

        if(vendor.noUglyFile) {
            return stream
                .pipe(compressionPipes.minify())
                .pipe(rename({ suffix: '.min' }))
                .pipe(gulp.dest(DESTINATION_PATH));
        }

        let path = PACKAGES_SOURCE + vendor.path.replace(/js$/, `${vendor.suffix || 'min'}.js`);

        return merge(stream, gulp.src(path, sourceConfig).pipe(gulp.dest(DESTINATION_PATH)));
    }));
});
