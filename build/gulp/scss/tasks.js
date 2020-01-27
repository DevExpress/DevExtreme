require('./compiler');
require('./generator');

const gulp = require('gulp');
const sassLint = require('gulp-sass-lint');
const outputPath = require('./config').outputPath;

gulp.task('fix-lint', () => { // this does not work
    return gulp.src(`${outputPath}/**/*.scss`)
        .pipe(sassLint({
            options: {
                // formatter: 'stylish',
                formatter: 'checkstyle',
                'merge-default-rules': false
            },
            rules: {
                'final-newline': true,
                'indentation': { size: 4 }
            }
        }))
        .pipe(sassLint.format())
        .pipe(gulp.dest(outputPath + '1'));
});

gulp.task('generate-scss', gulp.series(
    'scss-clean',
    'less2sass',
    gulp.parallel(
        'fix-bundles',
        'fix-base',
        'fix-common',
        'create-widgets',
        'fix-mixins'
        // TODO - create common bundle
    ),
    'create-base-widget',
    'create-theme-index',
    // 'fix-lint'
    'sass-material',
    'sass-generic'
));
