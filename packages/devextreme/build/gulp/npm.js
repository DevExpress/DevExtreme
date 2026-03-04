'use strict';

require('./ts');

const eol = require('gulp-eol');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const merge = require('merge-stream');
const through = require('through2');
const replace = require('gulp-replace');
const lazyPipe = require('lazypipe');
const gulpFilter = require('gulp-filter');
const gulpRename = require('gulp-rename');
const MODULES = require('./modules_metadata.json');

const compressionPipes = require('./compression-pipes.js');
const ctx = require('./context.js');
const env = require('./env-variables.js');
const dataUri = require('./gulp-data-uri').gulpPipe;
const headerPipes = require('./header-pipes.js');
const { packageDir, packageDistDir, isEsmPackage, stringSrc, devextremeDistDir } = require('./utils');
const path = require('path');
const fs = require('fs');

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
    `!${jsFolder}/knockout*`,
    `!${jsFolder}/cldr/*.*`,
    `!${jsFolder}/cldr*`,
    `!${jsFolder}/globalize/*.*`,
    `!${jsFolder}/globalize*`,
    `!${jsFolder}/dx-exceljs-fork*`,
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

const overwriteInternalPackageName = lazyPipe()
    .pipe(() => replace(/"devextreme(-.*)?"/, '"devextreme$1-internal"'));

const licenseValidator = env.BUILD_INTERNAL_PACKAGE || env.BUILD_TEST_INTERNAL_PACKAGE ?
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
        .src('package.json')
        .pipe(
            through.obj((file, enc, callback) => {
                const pkg = JSON.parse(file.contents.toString(enc));

                pkg.name = 'devextreme';
                pkg.version = ctx.version;

                delete pkg.devDependencies;
                delete pkg.publishConfig;
                delete pkg.scripts;

                file.contents = Buffer.from(JSON.stringify(pkg, null, 2));
                callback(null, file);
            })
        )
        .pipe(gulpIf(env.BUILD_INTERNAL_PACKAGE, overwriteInternalPackageName()))
        .pipe(gulp.dest(dist)),

    gulp
        .src(distGlob)
        .pipe(gulp.dest(`${dist}/dist`)),

    gulp
        .src('../../README.md')
        .pipe(gulp.dest(dist)),

    stringSrc('.npmignore', 'dist/js\ndist/ts\n!dist/css\n!/scss/bundles/*.scss\nproject.json')
        .pipe(gulp.dest(`${dist}/`))
));

const packagePath = `${resultPath}/${packageDir}`;
const distPath = `${resultPath}/${packageDistDir}`;

function collectExports(baseDir) {
    const exportsMap = {};

    function getPath(p) {
        return path.posix.join(p.replace(/\\/g, '/'))
            .replace(/^.+\/esm\//, './esm/')
            .replace(/^.+\/cjs\//, './cjs/')
    }

    function walk(currentDir, relativePath = '.') {
        const packageJsonPath = path.join(currentDir, 'package.json');

        if (fs.existsSync(packageJsonPath) && !/(cjs|esm)$/.test(currentDir)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
                const exportEntry = {};

                if (pkg.module) {
                    exportEntry.import = getPath(pkg.module);
                }
                if (pkg.main) {
                    exportEntry.require = getPath(pkg.main);
                }
                if (pkg.typings || pkg.types) {
                    const typesFile = pkg.typings || pkg.types;
                    exportEntry.types = path.join(currentDir, typesFile)
                        .replace(/\\/g, '/')
                        .replace(/^.*\/devextreme\//, './');
                }

                if (Object.keys(exportEntry).length > 0) {
                    const exportKey = relativePath === '.' ? '.' : `./${relativePath.replace(/\\/g, '/')}`;
                    exportsMap[exportKey] = exportEntry;
                }
            } catch (err) {
                console.warn(`Failed to read package.json in ${packageJsonPath}:`, err.message);
            }
        }

        const entries = fs.readdirSync(currentDir, { withFileTypes: true });

        for (const entry of entries) {
            if (entry.isDirectory()) {
                walk(path.join(currentDir, entry.name), path.join(relativePath, entry.name));
            }
        }
    }

    walk(baseDir);
    return exportsMap;
}

gulp.task('npm-sources', gulp.series(
    'ts-sources',
    () => gulp
        .src(`${resultPath}/${devextremeDistDir}/package.json`)
        .pipe(overwriteInternalPackageName())
        .pipe(gulpIf(env.BUILD_INTERNAL_PACKAGE, gulp.dest(distPath))),
    sources(srcGlobs, packagePath, distGlobs))
);

gulp.task('npm-dist', () => gulp
    .src(`${packagePath}/dist/**/*`)
    .pipe(gulp.dest(distPath))
);

gulp.task('add-exports-to-package-json', () => gulp
    .src(`${packagePath}/package.json`)
    .pipe(
        through.obj((file, enc, callback) => {
            const pkg = JSON.parse(file.contents.toString(enc));

            pkg.exports = {
                "./dist/*":"./dist/*",
                ...collectExports(path.resolve(packagePath))
            };

            MODULES.forEach((item) => {
                const exportPath = './' + item.name;
                if(item.types && !pkg.exports[exportPath]?.types) {
                    pkg.exports[exportPath] = pkg.exports[exportPath] || {};
                    pkg.exports[exportPath].types = item.types;
                }
            })

            file.contents = Buffer.from(JSON.stringify(pkg, null, 2));

            callback(null, file);
        })
    )
    .pipe(gulp.dest(packagePath))
);

const scssDir = `${packagePath}/scss`;

gulp.task('npm-sass', gulp.series(
    gulp.parallel(
        () => gulp
            .src(`${ctx.SCSS_PACKAGE_PATH}/scss/**/*`)
            .pipe(dataUri())
            .pipe(gulp.dest(scssDir)),

        () => gulp
            .src(`${ctx.SCSS_PACKAGE_PATH}/fonts/**/*`)
            .pipe(gulp.dest(`${scssDir}/widgets/material/typography/fonts`)),

        () => gulp
            .src(`${ctx.SCSS_PACKAGE_PATH}/icons/**/*`)
            .pipe(gulp.dest(`${scssDir}/widgets/base/icons`)),
    )
));

gulp.task('npm', gulp.series('npm-sources', 'npm-dist', 'ts-check-public-modules', 'npm-sass', 'add-exports-to-package-json'));

