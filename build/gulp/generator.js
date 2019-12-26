const gulp = require('gulp');
const { generateComponents } = require('devextreme-generator/component-compiler');
const generator = require('devextreme-generator/preact-generator').default;
const gulpTypeScript = require('gulp-typescript');
const lint = require('gulp-eslint');
const plumber = require('gulp-plumber');

const SRC = 'js/**/*.tsx';
const DEST = 'js';

const knownErrors = [
    'Cannot find module \'preact\'.',
    'Cannot find module \'preact/hooks\'.'
];

gulp.task('generate-components', function() {
    const tsProject = gulpTypeScript.createProject('build/gulp/preact.tsconfig.json');
    return gulp.src(SRC)
        .pipe(generateComponents(generator))
        .pipe(plumber({
            errorHandler: function() {

            }
        }))
        .pipe(tsProject({
            error(e) {
                if(!knownErrors.some(i => e.message.endsWith(i)) && e.message.indexOf('node_modules/@types') === -1) {
                    console.log(e.message);
                }
            },
            finish() {}
        }))
        .pipe(lint({
            quiet: true,
            fix: true,
            useEslintrc: true
        }))
        .pipe(lint.format())
        .pipe(gulp.dest(DEST));
});

gulp.task('generate-components-watch', gulp.series('generate-components', function() {
    gulp.watch([SRC], gulp.series('generate-components'));
}));
