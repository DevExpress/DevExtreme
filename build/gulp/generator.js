const gulp = require('gulp');
const { generateComponents } = require('devextreme-generator/component-compiler');
const generator = require('devextreme-generator/preact-generator').default;
const gulpTypeScript = require('gulp-typescript');
const lint = require('gulp-eslint');
const plumber = require('gulp-plumber');

const SRC = 'js/**/*.tsx';
const DEST = 'js';

gulp.task('generate-components', function() {
    const tsProject = gulpTypeScript.createProject('build/gulp/preact.tsconfig.json');
    return gulp.src(SRC)
        .pipe(generateComponents(generator))
        .pipe(plumber({
            errorHandler: console.log
        }))
        .pipe(tsProject())
        .pipe(lint({
            quiet: true,
            fix: true,
            useEslintrc: true
        }))
        .pipe(lint.format())
        .pipe(gulp.dest(DEST));
});

gulp.task('generate-components-watch', function() {
    gulp.watch([SRC], gulp.series('generate-components'));
});
