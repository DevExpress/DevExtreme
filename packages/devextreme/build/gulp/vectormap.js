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
const VECTORMAP_SOURCES_PATH = 'build/vectormap-sources';

function transformFileName(fileName) {
    return path.join(VECTORMAP_UTILS_PATH, fileName) + '.js';
}

gulp.task('vectormap-utils', function() {
    return merge(
        createBrowserVectorMapUtilsStream('.debug', false),
        createBrowserVectorMapUtilsStream('', true),
    );
});

function toArrayBuffer(buffer) {
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

function collectShpFiles(dir) {
    return fs.readdirSync(dir)
        .filter(name => path.extname(name).toLowerCase() === '.shp')
        .map(name => path.basename(name, '.shp'));
}

gulp.task('vectormap-data', gulp.series('vectormap-utils', async function generateData() {
    const parse = require(path.join('../..', VECTORMAP_UTILS_RESULT_PATH, 'dx.vectormaputils.debug.js')).parse;
    const settings = require(path.join('../..', VECTORMAP_SOURCES_PATH, '_settings.js'));

    if(!fs.existsSync(VECTORMAP_DATA_RESULT_PATH)) {
        fs.mkdirSync(VECTORMAP_DATA_RESULT_PATH);
    }

    const sourceDir = path.resolve(VECTORMAP_SOURCES_PATH);
    const files = collectShpFiles(sourceDir);

    await Promise.all(files.map(name => new Promise((resolve) => {
        const shpBuffer = fs.readFileSync(path.join(sourceDir, name + '.shp'));
        const dbfBuffer = fs.readFileSync(path.join(sourceDir, name + '.dbf'));

        parse(
            { shp: toArrayBuffer(shpBuffer), dbf: toArrayBuffer(dbfBuffer) },
            { },
            function(shapeData) {
                if(shapeData) {
                    fs.writeFileSync(path.join(VECTORMAP_DATA_RESULT_PATH, name + '.js'), JSON.stringify(shapeData));
                }
                resolve();
            }
        );
    })));

    const stream = merge();
    const dataFiles = fs.readdirSync(VECTORMAP_DATA_RESULT_PATH);

    dataFiles.forEach(file => {
        const data = fs.readFileSync(path.join(VECTORMAP_DATA_RESULT_PATH, file), 'utf8');

        stream.add(
            gulp.src('build/gulp/vectormapdata-template.jst')
                .pipe(template({ data: data }))
                .pipe(rename(file))
                .pipe(headerPipes.useStrict())
                .pipe(gulp.dest(VECTORMAP_DATA_RESULT_PATH))
        );
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

function createBrowserVectorMapUtilsStream(suffix, isMinify) {
    const settings = require(path.join('../..', VECTORMAP_UTILS_PATH, '_settings.json'));
    const part = settings['browser'];
    const stream = gulp.src(settings.commonFiles.concat(part.files).map(transformFileName))
        .pipe(concat(part.fileName + suffix + '.js'));

    return stream.pipe(tap(file => {
        patchVectorMapUtilsStream(gulp.src('build/gulp/vectormaputils-template.jst')
            .pipe(template({ data: file.contents }))
            .pipe(rename(path.basename(file.path))), isMinify);
    }));
}

gulp.task('vectormap', gulp.series('vectormap-utils', 'vectormap-data'));
