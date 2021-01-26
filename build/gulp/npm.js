'use strict';

const eol = require('gulp-eol');
const fs = require('fs');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const lazyPipe = require('lazypipe');
const merge = require('merge-stream');
const replace = require('gulp-replace');
const through = require('through2');

const MODULES = require('./modules_metadata.json');
const compressionPipes = require('./compression-pipes.js');
const ctx = require('./context.js');
const dataUri = require('./gulp-data-uri').gulpPipe;
const env = require('./env-variables');
const headerPipes = require('./header-pipes.js');
const renovatedComponents = require('../../js/bundles/modules/parts/renovation');
const renovationPipes = require('./renovation-pipes');
const { ifRenovation } = require('./utils');
const { version } = require('../../package.json');

const resultPath = ctx.RESULT_NPM_PATH;
const renovation = env.USE_RENOVATION;

const srcGlobsPattern = (path, exclude) => [
    `${path}/**/*.js`,
    `!${exclude}/**/*.*`,
    `!${path}/bundles/*.js`,
    `!${path}/bundles/modules/parts/*.js`,
    `!${path}/viz/vector_map.utils/*.js`,
    `!${path}/viz/docs/*.js`
];

const srcGlobs = srcGlobsPattern(
    ctx.TRANSPILED_PROD_PATH,
    ctx.TRANSPILED_PROD_RENOVATION_PATH
);

const renovationSrcGlobs = srcGlobsPattern(
    ctx.TRANSPILED_PROD_RENOVATION_PATH,
    ctx.TRANSPILED_PROD_PATH
);

const jsonGlobs = ['js/**/*.json', '!js/viz/vector_map.utils/*.*'];

const distGlobsPattern = (jsFolder, exclude) => [
    'artifacts/**/*.*',
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
    `!${jsFolder}/dx-diagram*`,
    `!${jsFolder}/dx-gantt*`,
    `!${jsFolder}/dx-quill*`,
    `!${renovationPipes.TEMP_PATH}/**/*.*`,
    `!${ctx.TRANSPILED_PROD_RENOVATION_PATH}/**/*.*`,
    `!${ctx.TRANSPILED_PROD_PATH}/**/*.*`,
    `!${exclude}/**/*.*`,
];

const distGlobs = distGlobsPattern(ctx.RESULT_JS_PATH, ctx.RESULT_JS_RENOVATION_PATH);
const renovationDistGlobs = distGlobsPattern(ctx.RESULT_JS_RENOVATION_PATH, ctx.RESULT_JS_PATH);

const addDefaultExport = lazyPipe().pipe(() =>
    through.obj((chunk, enc, callback) => {
        const moduleName = chunk.relative.replace('.js', '').split('\\').join('/');
        const moduleMeta = MODULES.filter(({ name }) => name === moduleName)[0];

        if(moduleMeta && moduleMeta.exports && moduleMeta.exports.default) {
            chunk.contents = Buffer.from(`${String(chunk.contents)}
                module.exports.default = module.exports;`);
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
        .pipe(gulpIf(renovation, replace(
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


gulp.task('npm-sources', gulp.series(
    'ts-sources',
    sources(srcGlobs, `${resultPath}/devextreme`, distGlobs),
    ifRenovation(
        sources(renovationSrcGlobs, `${resultPath}/devextreme-renovation`, renovationDistGlobs)
    ),
    ifRenovation((done) =>
        fs.rename(
            `${resultPath}/devextreme-renovation/dist/js-renovation`,
            `${resultPath}/devextreme-renovation/dist/js`,
            (err) => {
                if(err) throw err;
                done();
            }
        ))
));

gulp.task('npm-sass', gulp.series(
    'create-scss-bundles',
    gulp.parallel(
        () => gulp
            .src('scss/**/*')
            .pipe(dataUri())
            .pipe(gulp.dest(`${resultPath}/devextreme/scss`))
            .pipe(gulpIf(renovation, gulp.dest(`${resultPath}/devextreme-renovation/scss`))),

        () => gulp
            .src('fonts/**/*', { base: '.' })
            .pipe(gulp.dest(`${resultPath}/devextreme/scss/widgets/material/typography`))
            .pipe(gulpIf(renovation, gulp.dest(`${resultPath}/devextreme-renovation/scss/widgets/material/typography`))),

        () => gulp
            .src('icons/**/*', { base: '.' })
            .pipe(gulp.dest(`${resultPath}/devextreme/scss/widgets/base`))
            .pipe(gulpIf(renovation, gulp.dest(`${resultPath}/devextreme-renovation/scss/widgets/base`))),
    )));

gulp.task('npm', gulp.series('npm-sources', 'ts-modules-check', 'npm-sass'));
