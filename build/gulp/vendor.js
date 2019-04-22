const gulp = require('gulp');
const rename = require('gulp-rename');
const merge = require('merge-stream');
const compressionPipes = require('./compression-pipes.js');

const PACKAGES_SOURCE = './node_modules';
const DESTINATION_JS_PATH = './artifacts/js';
const DESTINATION_CSS_PATH = './artifacts/css';

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
        path: '/devexpress-diagram/dx.diagram.js'
    },
    {
        path: '/devexpress-diagram/dx.diagram.css'
    }
];

gulp.task('vendor', function() {
    return merge.apply(this, VENDORS.map(function(vendor) {
        const isScript = vendor.path.endsWith(".js");
        const destinationPath = isScript ? DESTINATION_JS_PATH : DESTINATION_CSS_PATH;
        let sourceConfig = vendor.base ? { base: PACKAGES_SOURCE + vendor.base } : null;
        let stream = gulp.src(PACKAGES_SOURCE + vendor.path, sourceConfig).pipe(gulp.dest(destinationPath));
        if(isScript) {
            if(vendor.noUglyFile) {
                return stream
                    .pipe(compressionPipes.minify())
                    .pipe(rename({ suffix: '.min' }))
                    .pipe(gulp.dest(destinationPath));
            }

            let path = PACKAGES_SOURCE + vendor.path.replace(/js$/, `${vendor.suffix || 'min'}.js`);

            return merge(stream, gulp.src(path, sourceConfig).pipe(gulp.dest(destinationPath)));
        } else {
            return stream;
        }
    }));
});
