'use strict';

const gulp = require('gulp');
const file = require('gulp-file');
const del = require('del');
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
const {
    BASE_GENERATOR_OPTIONS,
    BASE_GENERATOR_OPTIONS_WITH_JQUERY
} = require('./generator-options');

const generator = new PreactGenerator();

const jQueryComponentsGlob = 'js/renovation/**/*.j.tsx';

const SRC = [
    'js/renovation/**/*.{tsx,ts}',
    `!${jQueryComponentsGlob}`,
    '!js/renovation/**/*.d.ts',
    '!js/renovation/**/__tests__/**/*',
    '!js/renovation/test_utils/**/*'
];

const COMPAT_TESTS_PARTS = 'testing/tests/Renovation/';

const COMMON_SRC = ['js/**/*.d.ts', 'js/**/*.js'];

const knownErrors = [
    'Cannot find module \'preact\'',
    'Cannot find module \'preact/hooks\'',
    'Cannot find module \'preact/compat\'',
    'js/renovation/preact_wrapper/',
    'js\\renovation\\preact_wrapper\\',
    'has no exported member \'RefObject\''
];

function deleteJQueryComponents(cb) {
    del.sync(jQueryComponentsGlob);
    cb();
}

function generateJQueryComponents(isWatch) {
    const generator = new PreactGenerator();
    generator.options = {
        ...BASE_GENERATOR_OPTIONS_WITH_JQUERY,
        generateJQueryOnly: true
    };

    const pipe = isWatch ? watch(SRC) : gulp.src(SRC);
    return pipe
        .pipe(generateComponents(generator))
        .pipe(plumber(()=>null))
        .pipe(gulp.dest('js/renovation/'));
}

const context = require('../context.js');

const processErrors = (knownErrors, errors = []) => (e) => {
    if(!knownErrors.some(i => e.message.includes(i))) {
        errors.push(e);
        console.log(e.message);
    }
};

function generatePreactComponents(dev = false) {
    return function(done) {
        const tsProject = ts.createProject('build/gulp/generator/ts-configs/preact.tsconfig.json');

        generator.options = BASE_GENERATOR_OPTIONS_WITH_JQUERY;

        const errors = [];

        return gulp.src(SRC, { base: 'js' })
            .pipe(generateComponents(generator))
            .pipe(plumber(()=>null))
            .pipe(tsProject({
                error: processErrors(knownErrors, errors),
                finish() {}
            }))
            .pipe(babel())
            .pipe(gulp.dest(context.TRANSPILED_PATH))
            .pipe(gulp.dest(context.TRANSPILED_PROD_PATH))
            .pipe(gulp.dest(context.TRANSPILED_PROD_RENOVATION_PATH))
            .on('end', function() {
                done(!dev && errors.length || undefined);
            });
    };
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
        widgetName: `dx${meta.name}`,
        ...meta,
        path: path.relative(COMPAT_TESTS_PARTS, meta.path).replace(/\\/g, '/')
    })), null, 2);

    return file('widgets.json', metaJson, { src: true })
        .pipe(gulp.dest(COMPAT_TESTS_PARTS));
}

gulp.task('generate-jquery-components', gulp.series(deleteJQueryComponents, function generateJQuery() {
    return generateJQueryComponents(false);
}));

gulp.task('generate-jquery-components-watch', function watchJQueryComponents() {
    return generateJQueryComponents(true);
});

gulp.task('generate-components', gulp.series(
    'generate-jquery-components',
    generatePreactComponents(),
    processRenovationMeta
));

gulp.task('generate-components-dev', gulp.series(
    'generate-jquery-components',
    generatePreactComponents(true),
    processRenovationMeta
));

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

    generator.options = BASE_GENERATOR_OPTIONS;

    gulp.task(`generate-${frameworkName}-declaration-only`, function() {
        return gulp.src(SRC, { base: 'js' })
            .pipe(generateComponents(generator))
            .pipe(plumber(() => null))
            .pipe(gulpIf(compileTs, tsProject({
                error: processErrors(knownErrors),
                finish() { }
            })))
            .pipe(gulpIf(babelGeneratedFiles, babel()))
            .pipe(gulp.dest(frameworkDest));
    });

    const frameworkSrc = `./artifacts/${frameworkName}`;
    const artifactsSrc = ['./artifacts/css/**/*', `${frameworkSrc}/**/*`];

    const generateSeries = [
        function cleanFrameworkArtifacts(cb) {
            del.sync(frameworkSrc);
            cb();
        },
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
        const dest = `./playground/${frameworkName}/src/artifacts`;
        generateSeries.push(function cleanFrameworkPlayground(cb) {
            del.sync(dest);
            cb();
        });
        generateSeries.push(function copyArtifacts() {
            return gulp.src(artifactsSrc, { base: './artifacts/' })
                .pipe(gulp.dest(dest));
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
    'Cannot find module \'@angular/core\'',
    'Cannot find module \'@angular/common\'',
    'Cannot find module \'@angular/forms\''
].concat(knownErrors));

addGenerationTask('vue', [], false, true, false);

gulp.task('generate-components-watch', gulp.series('generate-components', function() {
    gulp.watch(SRC, gulp.series('generate-components-dev'));
}));

gulp.task('react-compilation-check', function() {
    const generator = require('devextreme-generator/react-generator').default;

    generator.options = BASE_GENERATOR_OPTIONS;

    const tsProject = ts.createProject('build/gulp/generator/ts-configs/react.tsconfig.json');

    return gulp.src([...SRC, '!js/renovation/preact_wrapper/**/*.*'], { base: 'js' })
        .pipe(generateComponents(generator))
        .pipe(tsProject());
});
