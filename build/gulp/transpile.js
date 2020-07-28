'use strict';

const gulp = require('gulp');
const gulpIf = require('gulp-if');
const babel = require('gulp-babel');
const gulpEach = require('gulp-each');
const watch = require('gulp-watch');
const replace = require('gulp-replace');
const plumber = require('gulp-plumber');
const path = require('path');
const notify = require('gulp-notify');
const compressionPipes = require('./compression-pipes.js');
const renovatedComponents = require('../../js/bundles/modules/parts/renovation');

const context = require('./context.js');

require('./generator/gulpfile');

const GLOB_TS = require('./ts').GLOB_TS;
const SRC = ['js/**/*.*', '!' + GLOB_TS, '!js/**/*.{tsx,ts}'];
const TESTS_PATH = 'testing';
const TESTS_SRC = TESTS_PATH + '/**/*.js';

const VERSION_FILE_PATH = 'core/version.js';

const renovationComponentsAll = renovatedComponents.base.concat(renovatedComponents.web, renovatedComponents.viz, renovatedComponents.mobile);
const renovatedFileNames = renovationComponentsAll.map(component => component.name);

function isOldComponentRenovated(file) {
    const isRenovatedName = !!file.basename.match(new RegExp(renovatedFileNames.map(fileName => ('^' + fileName + '\\b')).join('|'), 'i')); // only renovated file names
    const isNotRenovationFolder = file.path.match(/renovation/g) === null; // without renovation folder
    const isJsFile = file.extname === '.js';
    const isCorrectFilePath = !!file.path.match(new RegExp(renovatedFileNames.map(fileName => ('ui\\/' + fileName)).join('|'), 'i')); // without ui/text_box/../button.js

    return isRenovatedName && isNotRenovationFolder && isJsFile && isCorrectFilePath;
}

gulp.task('transpile-prod-renovation', function() {
    return gulp.src(SRC)
        .pipe(compressionPipes.removeDebug())
        .pipe(gulpIf(isOldComponentRenovated, gulpEach((content, file, callback) => {
            const component = renovationComponentsAll.find(component => component.name.toLowerCase() === file.stem);
            const fileContext = 'import Widget from "../renovation/' + component.pathInRenovationFolder + '";export default Widget;';
            callback(null, fileContext);
        })))
        // .pipe(replace('require("./widgets-base")', `require("./${context.RENOVATION_WIDGETS_BASE}")`))
        // .pipe(replace('require("./widgets-mobile")', `require("./${context.RENOVATION_WIDGETS_MOBILE}")`))
        // .pipe(replace('import "./viz-old"', `import "./${context.RENOVATION_WIDGETS_VIZ}"`))
        // .pipe(replace('require("./widgets-web")', `require("./${context.RENOVATION_WIDGETS_WEB}")`))
        .pipe(babel())
        .pipe(gulp.dest(context.TRANSPILED_PROD_RENOVATION_PATH));
});

gulp.task('transpile-prod-old', function() {
    return gulp.src(SRC)
        .pipe(compressionPipes.removeDebug())
        .pipe(babel())
        .pipe(gulp.dest(context.TRANSPILED_PROD_PATH));
});

gulp.task('transpile-prod', gulp.series('transpile-prod-old', 'transpile-prod-renovation'));

gulp.task('transpile', gulp.series('generate-components', 'bundler-config', 'transpile-prod', function() {
    return gulp.src(SRC)
        .pipe(babel())
        .pipe(gulp.dest(context.TRANSPILED_PATH));
}));

const replaceTask = (sourcePath) => {
    return () => gulp.src(path.join(sourcePath, VERSION_FILE_PATH), { base: './' })
        .pipe(replace('%VERSION%', context.version.script))
        .pipe(gulp.dest('./'));
};

gulp.task('version-replace', gulp.series('transpile', gulp.parallel([
    replaceTask(context.TRANSPILED_PATH),
    replaceTask(context.TRANSPILED_PROD_PATH)
])));

gulp.task('transpile-watch', gulp.series('version-replace', function() {
    return watch(SRC)
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
                .bind() // bind call is necessary to prevent firing 'end' event in notify.onError implementation
        }))
        .pipe(babel())
        .pipe(gulp.dest(context.TRANSPILED_PATH));
}));

gulp.task('transpile-tests', gulp.series('bundler-config', function() {
    return gulp.src(TESTS_SRC)
        .pipe(babel())
        .pipe(gulp.dest(TESTS_PATH));
}));
