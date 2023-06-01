'use strict';

const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const tap = require('gulp-tap');
const gulpIf = require('gulp-if');
const merge = require('merge-stream');
const template = require('gulp-template');

const context = require('./context.js');
const headerPipes = require('./header-pipes.js');
const compressionPipes = require('./compression-pipes.js');

const VECTORMAP_UTILS_PATH = 'js/viz/vector_map.utils';
const VECTORMAP_UTILS_RESULT_PATH = path.join(context.RESULT_JS_PATH, 'vectormap-utils');
const VECTORMAP_DATA_RESULT_PATH = path.join(context.RESULT_JS_PATH, 'vectormap-data');

function transformFileName(fileName) {
    return path.join(VECTORMAP_UTILS_PATH, fileName) + '.js';
}

gulp.task('vectormap-utils', function() {
    return merge(
        createVectorMapUtilsStream('browser', '.debug', false),
        createVectorMapUtilsStream('browser', '', true),
        createVectorMapUtilsStream('node', '', false)
    );
});

gulp.task('vectormap-data', gulp.series('vectormap-utils', function() {
    const stream = merge();
    const processFiles = require(path.join('../..', VECTORMAP_UTILS_RESULT_PATH, 'dx.vectormaputils.node.js')).processFiles;

    if(!fs.existsSync(VECTORMAP_DATA_RESULT_PATH)) {
        fs.mkdirSync(VECTORMAP_DATA_RESULT_PATH);
    }

    processFiles('build/vectormap-sources', {
        output: VECTORMAP_DATA_RESULT_PATH,
        settings: 'build/vectormap-sources/_settings.js'
    }, function() {
        const files = fs.readdirSync(VECTORMAP_DATA_RESULT_PATH);

        files.forEach(file => {
            const data = fs.readFileSync(path.join(VECTORMAP_DATA_RESULT_PATH, file), 'utf8');

            stream.add(
                gulp.src('build/gulp/vectormapdata-template.jst')
                    .pipe(template({ data: data }))
                    .pipe(rename(file))
                    .pipe(headerPipes.useStrict())
                    .pipe(gulp.dest(VECTORMAP_DATA_RESULT_PATH))
            );
        });
    });
    return stream;
}));

function patchVectorMapUtilsStream(stream, isMinify) {
    return stream.pipe(headerPipes.useStrict())
        .pipe(headerPipes.bangLicense())
        .pipe(gulpIf(isMinify, compressionPipes.minify()))
        .pipe(gulpIf(!isMinify, compressionPipes.beautify()))
        .pipe(gulp.dest(VECTORMAP_UTILS_RESULT_PATH));
}

function createVectorMapUtilsStream(name, suffix, isMinify) {
    const settings = require(path.join('../..', VECTORMAP_UTILS_PATH, '_settings.json'));
    const part = settings[name];
    const stream = gulp.src(settings.commonFiles.concat(part.files).map(transformFileName))
        .pipe(concat(part.fileName + suffix + '.js'));

    if(name === 'browser') {
        return stream.pipe(tap(file => {
            patchVectorMapUtilsStream(gulp.src('build/gulp/vectormaputils-template.jst')
                .pipe(template({ data: file.contents }))
                .pipe(rename(path.basename(file.path))), isMinify);
        }));
    }
    return patchVectorMapUtilsStream(stream, isMinify);
}

gulp.task('vectormap', gulp.series('vectormap-utils', 'vectormap-data'));
