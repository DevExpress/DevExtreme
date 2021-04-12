'use strict';

const gulp = require('gulp');
const file = require('gulp-file');
const del = require('del');
const path = require('path');
const fs = require('fs');
const { generateComponents } = require('@devextreme-generator/build-helpers');
const { InfernoGenerator } = require('@devextreme-generator/inferno');
const ts = require('gulp-typescript');
const plumber = require('gulp-plumber');
const gulpIf = require('gulp-if');
const babel = require('gulp-babel');
const notify = require('gulp-notify');
const watch = require('gulp-watch');
const transpileConfig = require('../transpile-config');
const env = require('../env-variables');
const cached = require('gulp-cached');

const {
    BASE_GENERATOR_OPTIONS,
    BASE_GENERATOR_OPTIONS_WITH_JQUERY
} = require('./generator-options');

const generator = new InfernoGenerator();

const jQueryComponentsGlob = 'js/renovation/**/*.j.tsx';

const esmPackage = env.BUILD_ESM_PACKAGE;

const SRC = [
    'js/renovation/**/*.{tsx,ts}',
    `!${jQueryComponentsGlob}`,
    '!js/renovation/**/*.d.ts',
    '!js/renovation/**/__tests__/**/*',
    '!js/renovation/test_utils/**/*'
];

const IGNORE_PATHS_BY_FRAMEWORKS = {
    vue: [],
    react: [],
    angular: []
};

const COMPAT_TESTS_PARTS = 'testing/tests/Renovation/';

const COMMON_SRC = ['js/**/*.d.ts', 'js/**/*.js'];

const knownErrors = [
    'js/renovation/component_wrapper/',
    'js\\renovation\\component_wrapper\\',
    'Cannot find module \'../../inferno/src\'',
];

function deleteJQueryComponents(cb) {
    del.sync(jQueryComponentsGlob);
    cb();
}

function generateJQueryComponents(isWatch) {
    const generator = new InfernoGenerator();
    generator.options = {
        ...BASE_GENERATOR_OPTIONS_WITH_JQUERY,
        generateJQueryOnly: true
    };


    const pipe = isWatch ?
        watch(SRC).on('ready', () => console.log(
            'generate-jquery-components task is watching for changes...'
        )) : gulp.src(SRC);

    return pipe
        .pipe(generateComponents(generator))
        .pipe(plumber(()=>null))
        .pipe(gulp.dest('js/renovation/'));
}

const context = require('../context.js');
const { ifEsmPackage } = require('../utils');

const processErrors = (knownErrors, errors = []) => (e) => {
    if(!knownErrors.some(i => e.message.includes(i))) {
        errors.push(e);
        console.log(e.message);
    }
};

function generateInfernoComponents(distPath = './', babelConfig = transpileConfig.cjs, dev) {
    return function generateInfernoComponents(done) {
        const tsProject = ts.createProject('build/gulp/generator/ts-configs/inferno.tsconfig.json');

        generator.options = BASE_GENERATOR_OPTIONS_WITH_JQUERY;

        const errors = [];
        const isNotDTS = (file) => !file.path.endsWith('.d.ts');
        const isDefault = distPath === './';

        return gulp.src(SRC, { base: 'js' })
            .pipe(gulpIf(dev, cached('generate-inferno-component')))
            .pipe(generateComponents(generator))
            .pipe(plumber(() => null))
            .pipe(tsProject({
                error: processErrors(knownErrors, errors),
                finish() {}
            }))
            .pipe(gulpIf(isNotDTS, babel(babelConfig)))
            .pipe(gulpIf(isDefault, gulp.dest(context.TRANSPILED_PATH)))
            .pipe(gulpIf(isDefault, gulp.dest(context.TRANSPILED_RENOVATION_PATH)))
            .pipe(gulpIf(isDefault, gulp.dest(context.TRANSPILED_PROD_RENOVATION_PATH)))
            .pipe(gulpIf(esmPackage, gulp.dest(path.join(context.TRANSPILED_PROD_ESM_PATH, distPath))))
            .on('end', function() {
                done(/* !dev && errors.length || undefined*/);
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

gulp.task('generate-jquery-components-clean', deleteJQueryComponents);

gulp.task('generate-jquery-components-run', function generateJQuery() {
    return generateJQueryComponents(false);
});

gulp.task('generate-jquery-components', gulp.series('generate-jquery-components-clean', 'generate-jquery-components-run'));

gulp.task('generate-jquery-components-watch', function watchJQueryComponents() {
    return generateJQueryComponents(true);
});

gulp.task('generate-components', gulp.series(
    'generate-jquery-components',
    generateInfernoComponents(),
    ifEsmPackage(generateInfernoComponents('./esm', transpileConfig.esm)),
    ifEsmPackage(generateInfernoComponents('./cjs', transpileConfig.cjs)),
    processRenovationMeta
));

gulp.task('generate-components-dev', gulp.series(
    'generate-jquery-components',
    generateInfernoComponents('./', transpileConfig.cjs, true),
    processRenovationMeta
));

gulp.task('generate-inferno-components-watch', function() {
    gulp
        .watch(SRC, gulp.series(
            generateInfernoComponents('./', transpileConfig.cjs, true)
        ))
        .on('ready', () => console.log(
            'generate-inferno-components task is watching for changes...'
        ));
});

function addGenerationTask(
    frameworkName,
    knownErrors = [],
    compileTs = true,
    copyArtifacts = false,
    babelGeneratedFiles = true
) {
    const frameworkDest = `artifacts/${frameworkName}`;
    const generator = require(`@devextreme-generator/${frameworkName}`).default;
    let tsProject = () => () => { };
    if(compileTs) {
        tsProject = ts.createProject(`build/gulp/generator/ts-configs/${frameworkName}.tsconfig.json`);
    }

    generator.options = BASE_GENERATOR_OPTIONS;

    function compileComponents(done) {
        const errors = [];
        const frameworkIgnorePaths = IGNORE_PATHS_BY_FRAMEWORKS[frameworkName];

        return gulp.src([
            ...SRC,
            ...frameworkIgnorePaths,
            '!js/renovation/component_wrapper/**/*.*',
        ], { base: 'js' })
            .pipe(generateComponents(generator))
            .pipe(plumber(() => null))
            .pipe(gulpIf(compileTs, tsProject({
                error: processErrors(knownErrors, errors),
                finish() { }
            }))).on('end', function() {
                done(errors.map(e => e.message).join('\n') || undefined);
            });
    }

    gulp.task(`${frameworkName}-compilation-check`, compileComponents);

    gulp.task(`generate-${frameworkName}-declaration-only`, function(done) {
        return compileComponents(done)
            .pipe(gulpIf(babelGeneratedFiles, babel(transpileConfig.cjs)))
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
                        babel(transpileConfig.cjs)
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
                        babel(transpileConfig.cjs)
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

addGenerationTask('react',
    ['Cannot find module \'csstype\'.'],
    true,
    true,
    false
);
addGenerationTask('angular', [
    'Cannot find module \'@angular/core\'',
    'Cannot find module \'@angular/common\'',
    'Cannot find module \'@angular/forms\'',
    'Cannot find module \'@angular/cdk/portal\'',
    'Cannot find module \'inferno\'',
    'Cannot find module \'inferno-create-element\'',
].concat(knownErrors));

addGenerationTask('vue', [], false, true, false);

gulp.task('generate-components-watch', gulp.series('generate-components', function() {
    gulp
        .watch(SRC, gulp.series('generate-components-dev'))
        .on('ready', () => console.log(
            'generate-components task is watching for changes...'
        ));
}));

gulp.task('native-components-compilation-check', gulp.series('react-compilation-check', 'angular-compilation-check', 'vue-compilation-check'));
