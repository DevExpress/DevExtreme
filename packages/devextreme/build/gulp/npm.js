'use strict';

require('./ts');

const eol = require('gulp-eol');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const merge = require('merge-stream');
const replace = require('gulp-replace');
const lazyPipe = require('lazypipe');
const gulpFilter = require('gulp-filter');
const gulpRename = require('gulp-rename');

const compressionPipes = require('./compression-pipes.js');
const ctx = require('./context.js');
const env = require('./env-variables.js');
const dataUri = require('./gulp-data-uri').gulpPipe;
const headerPipes = require('./header-pipes.js');
const { packageDir, packageDistDir, isEsmPackage, stringSrc, packageDirInternal, packageDistDirInternal } = require('./utils');
const { version } = require('../../package.json');

const resultPath = ctx.RESULT_NPM_PATH;
const isBuildInternal = env.BUILD_INTERNAL_PACKAGE;

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

const esmPackageJsonGlobs = [
    `${ctx.TRANSPILED_PROD_ESM_PATH}/**/*.json`,
    `!${ctx.TRANSPILED_PROD_ESM_PATH}/viz/vector_map.utils/**/*`
];

const esmSrcGlobs = srcGlobsPattern(
    ctx.TRANSPILED_PROD_ESM_PATH,
    ctx.TRANSPILED_PROD_RENOVATION_PATH
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
    `!${jsFolder}/exceljs*`,
    `!${jsFolder}/file-saver*`,
    `!${jsFolder}/jquery*`,
    `!${jsFolder}/jspdf*`,
    `!${jsFolder}/jspdf-autotable*`,
    `!${jsFolder}/jszip*`,
    `!${jsFolder}/dx.custom*`,
    `!${jsFolder}/dx.viz*`,
    `!${jsFolder}/dx.web*`,
    `!${jsFolder}/dx-diagram*`,
    `!${jsFolder}/dx-gantt*`,
    `!${jsFolder}/dx-quill*`,
];

const srcGlobs = esmSrcGlobs;
const distGlobs = distGlobsPattern(ctx.RESULT_JS_PATH);

const jsonGlobs = ['js/**/*.json', '!js/viz/vector_map.utils/*.*'];

const updatePackageName = lazyPipe()
    .pipe(() => replace(/"devextreme(-.*)?"/, '"devextreme$1-internal"'));

const licenseValidator = isBuildInternal ?
    lazyPipe()
        .pipe(() => gulpFilter(['**', '!**/license/license_validation.js']))
        .pipe(() => gulpRename(path => {
            if(path.basename.includes('license_validation_internal')) {
                path.basename = 'license_validation';
            }
        })) :
    lazyPipe()
        .pipe(() => gulpFilter(['**', '!**/license/license_validation_internal.js']));

const sources = (src, dist, distGlob) => (() => merge(
    gulp
        .src(src)
        .pipe(licenseValidator())
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
        .src(`${dist}/package.json`)
        .pipe(replace(version, ctx.version.package))
        .pipe(gulpIf(isBuildInternal, updatePackageName()))
        .pipe(gulp.dest(dist)),

    gulp
        .src(distGlob)
        .pipe(gulp.dest(`${dist}/dist`)),

    gulp
        .src('README.md')
        .pipe(gulp.dest(dist)),

    stringSrc('.npmignore', 'dist/js\ndist/ts\n!dist/css\n!/scss/bundles/*.scss\nproject.json')
        .pipe(gulp.dest(`${dist}/`))
));

const packagePath = isBuildInternal ? `${resultPath}/${packageDirInternal}` : `${resultPath}/${packageDir}`;
const distPath = isBuildInternal ? `${resultPath}/${packageDistDirInternal}` : `${resultPath}/${packageDistDir}`;

gulp.task('npm-sources', gulp.series(
    'ts-sources',
    () => gulp
        .src(`${resultPath}/${packageDir}/package.json`)
        .pipe(gulpIf(isBuildInternal, gulp.dest(packagePath))),
    () => gulp
        .src(`${resultPath}/${packageDistDir}/package.json`)
        .pipe(updatePackageName())
        .pipe(gulpIf(isBuildInternal, gulp.dest(distPath))),
    sources(srcGlobs, packagePath, distGlobs))
);

gulp.task('npm-dist', () => gulp
    .src(`${packagePath}/dist/**/*`)
    .pipe(gulp.dest(distPath))
);

const scssDir = `${packagePath}/scss`;

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

gulp.task('npm', gulp.series('npm-sources', 'npm-dist', 'ts-check-public-modules', 'npm-sass'));
