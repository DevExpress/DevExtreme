'use strict';

const gulp = require('gulp');
const file = require('gulp-file');
const path = require('path');
const fs = require('fs');
const { generateComponents } = require('devextreme-generator/component-compiler');
const { PreactGenerator } = require('devextreme-generator/preact-generator');
const ts = require('gulp-typescript');
const plumber = require('gulp-plumber');
const gulpIf = require('gulp-if');
const babel = require('gulp-babel');
const notify = require('gulp-notify');
const watch = require('gulp-watch');
const generator = new PreactGenerator();

const SRC = ['js/renovation/**/*.tsx', '!js/renovation/**/*.j.tsx'];
const DEST = 'js/renovation/';
const COMPAT_TESTS_PARTS = 'testing/tests/Renovation/';

const COMMON_SRC = ['js/**/*.*', `!${SRC}`];

const knownErrors = [
    'Cannot find module \'preact\'',
    'Cannot find module \'preact/hooks\'',
    'Cannot find module \'preact/compat\''
];

function generateJQueryComponents(isWatch) {
    const generator = new PreactGenerator();
    generator.options = {
        defaultOptionsModule: 'js/core/options/utils',
        jqueryComponentRegistratorModule: 'js/core/component_registrator',
        jqueryBaseComponentModule: 'js/renovation/preact-wrapper/component',
        generateJQueryOnly: true
    };

    const pipe = isWatch ? watch(SRC) : gulp.src(SRC);
    return pipe
        .pipe(generateComponents(generator))
        .pipe(plumber(()=>null))
        .pipe(gulp.dest(DEST));
}

const context = require('../context.js');

function generatePreactComponents() {
    const tsProject = ts.createProject('build/gulp/generator/ts-configs/preact.tsconfig.json');

    generator.options = {
        defaultOptionsModule: 'js/core/options/utils',
        jqueryComponentRegistratorModule: 'js/core/component_registrator',
        jqueryBaseComponentModule: 'js/renovation/preact-wrapper/component'
    };

    return gulp.src(SRC, { base: 'js' })
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
        .pipe(babel())
        .pipe(gulp.dest(context.TRANSPILED_PATH));
}

function processRenovationMeta() {
    const widgetsMeta = generator
        .getComponentsMeta()
        .filter(meta =>
            meta.decorator &&
            meta.decorator.jQuery &&
            meta.decorator.jQuery.register === 'true' &&
            fs.existsSync(meta.path));

    const metaJson = JSON.stringify(widgetsMeta.map(meta => ({
        widgetName: `dxr${meta.name}`,
        ...meta,
        path: path.relative(COMPAT_TESTS_PARTS, meta.path).replace(/\\/g, '/')
    })), null, 2);

    return file('widgets.json', metaJson, { src: true })
        .pipe(gulp.dest(COMPAT_TESTS_PARTS));
}
gulp.task('generate-components', gulp.series(function generateJQuery() { return generateJQueryComponents(false); }, generatePreactComponents, processRenovationMeta));

gulp.task('generate-jquery-components-watch', function watchJQueryComponents() { return generateJQueryComponents(true); });

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
