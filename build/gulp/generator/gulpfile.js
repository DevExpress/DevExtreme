'use strict';

const gulp = require('gulp');
const file = require('gulp-file');
const path = require('path');
const fs = require('fs');
const merge = require('merge-stream');
const { generateComponents } = require('devextreme-generator/component-compiler');
const generator = require('devextreme-generator/preact-generator').default;
const ts = require('gulp-typescript');
const lint = require('gulp-eslint');
const plumber = require('gulp-plumber');
const gulpIf = require('gulp-if');
const babel = require('gulp-babel');
const notify = require('gulp-notify');
const watch = require('gulp-watch');

const SRC = ['js/renovation/**/*.tsx'];
const DEST = 'js/renovation/';
const BUNDLES_PARTS = 'js/bundles/modules/parts';
const COMPAT_TESTS_PARTS = 'testing/jest/compat';

const COMMON_SRC = ['js/**/*.*', `!${SRC}`];

const knownErrors = [
    'Cannot find module \'preact\'',
    'Cannot find module \'preact/hooks\'',
    'Cannot find module \'preact/compat\''
];

function generatePreactComponents() {
    const tsProject = ts.createProject('build/gulp/generator/ts-configs/preact.tsconfig.json');
    generator.defaultOptionsModule = 'js/core/options/utils';
    generator.jqueryComponentRegistratorModule = 'js/core/component_registrator';
    generator.jqueryBaseComponentModule = 'js/renovation/preact-wrapper/component';

    return gulp.src(SRC)
        .pipe(generateComponents(generator))
        .pipe(plumber(()=>null))
        .pipe(tsProject({
            error(e) {
                if(!knownErrors.some(i => e.message.includes(i))) {
                    console.log(e.message);
                }
            },
            finish() {}
        }))
        .pipe(gulpIf(file => file.extname === '.js',
            lint({
                quiet: true,
                fix: true,
                useEslintrc: true
            })
        ))
        .pipe(lint.format())
        .pipe(gulp.dest(DEST));
}

function processRenovationMeta() {
    const widgetsMeta = generator
        .getComponentsMeta()
        .filter(meta =>
            meta.decorator &&
            meta.decorator.jQuery &&
            meta.decorator.jQuery.register === 'true' &&
            fs.existsSync(meta.path));

    let content = '/* !!! This file is auto-generated. Any modification will be lost! */\n\n' +
    '/// BUNDLER_PARTS\n/* Renovation (dx.module-renovation.js) */\n\n' +
    'const renovation = require(\'../../../bundles/modules/renovation\');\n';
    content += widgetsMeta.map(meta =>
        `renovation.dxr${meta.name} = require('${path.relative(BUNDLES_PARTS, meta.path).replace(/\.[\w]+$/, '.j')}').default;`
    ).join('\n');
    content += '\n/// BUNDLER_PARTS_END\nmodule.exports = renovation;\n';

    return merge(
        file('widgets-renovation.js', content, { src: true })
            .pipe(gulp.dest(BUNDLES_PARTS)),

        file('widgets.json', JSON.stringify(widgetsMeta.map(meta => ({
            ...meta,
            path: path.relative(COMPAT_TESTS_PARTS, meta.path)
        }))), { src: true })
            .pipe(lint({
                quiet: true,
                fix: true,
                useEslintrc: true
            }))
            .pipe(lint.format())
            .pipe(gulp.dest(COMPAT_TESTS_PARTS))
    );
}
gulp.task('generate-components', gulp.series(generatePreactComponents, processRenovationMeta));

function addGenerationTask(
    frameworkName,
    knownErrors = [],
    compileTs = true,
    copyArtifacts = false,
    babelGeneratedFiles = true
) {
    const frameworkDest = `artifacts/${frameworkName}`;
    const generator = require(`devextreme-generator/${frameworkName}-generator`).default;
    let tsProject = () => () => { };
    if(compileTs) {
        tsProject = ts.createProject(`build/gulp/generator/ts-configs/${frameworkName}.tsconfig.json`);
    }

    generator.defaultOptionsModule = 'js/core/options/utils';

    gulp.task(`generate-${frameworkName}-declaration-only`, function() {
        return gulp.src('js/**/*.tsx')
            .pipe(generateComponents(generator))
            .pipe(plumber(() => null))
            .pipe(gulpIf(compileTs, tsProject({
                error(e) {
                    if(!knownErrors.some(i => e.message.endsWith(i))) {
                        console.log(e.message);
                    }
                },
                finish() { }
            })))
            .pipe(gulpIf(babelGeneratedFiles, babel()))
            .pipe(gulp.dest(frameworkDest));
    });

    const artifactsSrc = ['./artifacts/css/**/*', `./artifacts/${frameworkName}/**/*`];

    const generateSeries = [
        `generate-${frameworkName}-declaration-only`,
        function() {
            return gulp.src(COMMON_SRC)
                .pipe(
                    gulpIf(
                        file => file.extname === '.js',
                        babel()
                    )
                )
                .pipe(gulp.dest(frameworkDest));
        }];

    if(copyArtifacts) {
        generateSeries.push(function copyArtifacts() {
            return gulp.src(artifactsSrc, { base: './artifacts/' })
                .pipe(gulp.dest(`./playground/${frameworkName}/src/artifacts`));
        });
    }

    gulp.task(`generate-${frameworkName}`, gulp.series(...generateSeries));

    const watchTasks = [
        function() {
            watch(COMMON_SRC)
                .pipe(plumber({
                    errorHandler: notify.onError('Error: <%= error.message %>')
                        .bind() // bind call is necessary to prevent firing 'end' event in notify.onError implementation
                }))
                .pipe(
                    gulpIf(
                        file => file.extname === '.js',
                        babel()
                    )
                )
                .pipe(gulp.dest(frameworkDest));
        },
        function declarationBuild() {
            gulp.watch(SRC, gulp.series(`generate-${frameworkName}-declaration-only`));
        }
    ];

    if(copyArtifacts) {
        watchTasks.push(function copyArtifacts() {
            return gulp.src(artifactsSrc, { base: './artifacts/' })
                .pipe(watch(artifactsSrc, { base: './artifacts/', readDelay: 1000 }))
                .pipe(gulp.dest(`./playground/${frameworkName}/src/artifacts`));
        });
    }

    gulp.task(`generate-${frameworkName}-watch`, gulp.series(
        `generate-${frameworkName}`,
        gulp.parallel(...watchTasks)
    ));
}

addGenerationTask('react', ['Cannot find module \'csstype\'.'], false, true, false);
addGenerationTask('angular', [
    'Cannot find module \'@angular/core\'.',
    'Cannot find module \'@angular/common\'.'
]);

addGenerationTask('vue', [], false, true, false);

gulp.task('generate-components-watch', gulp.series('generate-components', function() {
    gulp.watch(SRC, gulp.series('generate-components'));
}));
