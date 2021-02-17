'use strict';

const eol = require('gulp-eol');
const fs = require('fs');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const lazyPipe = require('lazypipe');
const merge = require('merge-stream');
const replace = require('gulp-replace');
const through = require('through2');

const compressionPipes = require('./compression-pipes.js');
const ctx = require('./context.js');
const dataUri = require('./gulp-data-uri').gulpPipe;
const headerPipes = require('./header-pipes.js');
const renovatedComponents = require('../../js/bundles/modules/parts/renovation');
const renovationPipes = require('./renovation-pipes');
const { ifRenovationPackage, packageDir, isEsmPackage, isRenovationPackage, isRegularPackage } = require('./utils');
const { version } = require('../../package.json');

const resultPath = ctx.RESULT_NPM_PATH;

const srcGlobsPattern = (path, exclude) => [
    `${path}/**/*.js`,
    `!${exclude}/**/*.*`,
    `!${path}/bundles/*.js`,
    `!${path}/cjs/bundles/**/*`,
    `!${path}/esm/bundles/**/*`,
    `!${path}/bundles/modules/parts/*.js`,
    `!${path}/viz/vector_map.utils/*.js`,
    `!${path}/viz/docs/*.js`
];

const regularSrcGlobs = srcGlobsPattern(
    ctx.TRANSPILED_PROD_PATH,
    ctx.TRANSPILED_PROD_RENOVATION_PATH
);

const esmPackageJsonGlobs = [
    `${ctx.TRANSPILED_PROD_ESM_PATH}/**/*.json`,
    `!${ctx.TRANSPILED_PROD_ESM_PATH}/viz/vector_map.utils/**/*`
];

const esmSrcGlobs = srcGlobsPattern(
    ctx.TRANSPILED_PROD_ESM_PATH,
    ctx.TRANSPILED_PROD_RENOVATION_PATH
);

const renovationSrcGlobs = srcGlobsPattern(
    ctx.TRANSPILED_PROD_RENOVATION_PATH,
    ctx.TRANSPILED_PROD_PATH
);

const distGlobsPattern = (jsFolder, exclude) => [
    'artifacts/**/*.*',
    '!artifacts/transpiled**/**/*',
    '!artifacts/npm/**/*.*',
    '!artifacts/ts/jquery*',
    '!artifacts/ts/knockout*',
    '!artifacts/ts/globalize*',
    '!artifacts/ts/cldr*',
    '!artifacts/css/dx-diagram.*',
    '!artifacts/css/dx-gantt.*',
    `!${jsFolder}/angular**/*.*`,
    `!${jsFolder}/angular*`,
    `!${jsFolder}/knockout*`,
    `!${jsFolder}/cldr/*.*`,
    `!${jsFolder}/cldr*`,
    `!${jsFolder}/globalize/*.*`,
    `!${jsFolder}/globalize*`,
    `!${jsFolder}/jquery*`,
    `!${jsFolder}/jszip*`,
    `!${jsFolder}/dx.custom*`,
    `!${jsFolder}/dx.viz*`,
    `!${jsFolder}/dx.web*`,
    `!${jsFolder}/dx-diagram*`,
    `!${jsFolder}/dx-gantt*`,
    `!${jsFolder}/dx-quill*`,
    `!${renovationPipes.TEMP_PATH}/**/*.*`,
    `!${exclude}/**/*.*`,
];

const regularDistGlobs = distGlobsPattern(ctx.RESULT_JS_PATH, ctx.RESULT_JS_RENOVATION_PATH);
const renovationDistGlobs = distGlobsPattern(ctx.RESULT_JS_RENOVATION_PATH, ctx.RESULT_JS_PATH);

let srcGlobs = null;
let distGlobs = null;

if(isEsmPackage) {
    srcGlobs = esmSrcGlobs;
    distGlobs = regularDistGlobs;
} else if(isRenovationPackage) {
    srcGlobs = renovationSrcGlobs;
    distGlobs = renovationDistGlobs;
} else if(isRegularPackage) {
    srcGlobs = regularSrcGlobs;
    distGlobs = regularDistGlobs;
}

const jsonGlobs = ['js/**/*.json', '!js/viz/vector_map.utils/*.*'];

// NOTE: 'use strict' prohibits adding new 'default' field to string
const canSupplementDefaultExport = (path) => !path.endsWith('version.js') && !path.endsWith('remove_event.js');
const hasDefaultExport = (content) => /exports\.default\s=/.test(String(content));
const isCjsModule = (path) => !path.startsWith('esm/');

const addDefaultExport = lazyPipe().pipe(() =>
    through.obj((chunk, enc, callback) => {
        if(isCjsModule(chunk.relative) && hasDefaultExport(chunk.contents) && canSupplementDefaultExport(chunk.relative)) {
            chunk.contents = Buffer.from(
                `${String(chunk.contents)}module.exports.default = module.exports;`
            );
        }
        callback(null, chunk);
    })
);

const sources = (src, dist, distGlob) => (() => merge(
    gulp
        .src(src)
        .pipe(addDefaultExport())
        .pipe(headerPipes.starLicense())
        .pipe(compressionPipes.beautify())
        .pipe(gulp.dest(dist)),

    gulp
        .src(esmPackageJsonGlobs)
        .pipe(gulpIf(isEsmPackage, gulp.dest(dist))),

    gulp
        .src(jsonGlobs)
        .pipe(gulp.dest(dist)),

    gulp
        .src('build/npm-bin/*.js')
        .pipe(eol('\n'))
        .pipe(gulp.dest(`${dist}/bin`)),

    gulp
        .src('webpack.config.js')
        .pipe(gulp.dest(`${dist}/bin`)),

    gulp
        .src('package.json')
        .pipe(replace(version, ctx.version.package))
        .pipe(gulp.dest(dist)),

    gulp
        .src(distGlob)
        .pipe(gulpIf(isRenovationPackage, replace(
            new RegExp(renovatedComponents
                .map(({ name }) => (`dxr${name}`))
                .join('|'), 'g'),
            (match) => match.replace('dxr', 'dx')
        )))
        .pipe(gulp.dest(`${dist}/dist`)),

    gulp
        .src('README.md')
        .pipe(gulp.dest(dist))
));

const packagePath = `${resultPath}/${packageDir}`;

gulp.task('npm-sources', gulp.series('ts-sources', sources(srcGlobs, packagePath, distGlobs),
    ifRenovationPackage((done) =>
        fs.rename(`${packagePath}/dist/js-renovation`, `${packagePath}/dist/js`, (err) => {
            if(err) throw err;
            done();
        })
    )
));

const scssDir = `${resultPath}/${packageDir}/scss`;

gulp.task('npm-sass', gulp.series(
    'create-scss-bundles',
    gulp.parallel(
        () => gulp
            .src('scss/**/*')
            .pipe(dataUri())
            .pipe(gulp.dest(scssDir)),

        () => gulp
            .src('fonts/**/*', { base: '.' })
            .pipe(gulp.dest(`${scssDir}/widgets/material/typography`)),

        () => gulp
            .src('icons/**/*', { base: '.' })
            .pipe(gulp.dest(`${scssDir}/widgets/base`)),
    )
));

gulp.task('npm', gulp.series('npm-sources', 'ts-modules-check', 'npm-sass'));
