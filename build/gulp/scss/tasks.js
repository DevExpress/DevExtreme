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

gulp.task('convert-scss', gulp.series(
    'fix-scss-clean',
    'less2sass',
    gulp.parallel(
        'fix-bundles',
        'fix-base',
        'fix-common',
        'fix-themes',
        'fix-mixins'
        // TODO - create common bundle
    ),
    'create-base-widget',
    'generate-indexes',
    // 'fix-lint'
    'sass-material',
    'sass-generic'
));
