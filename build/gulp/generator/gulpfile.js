const gulp = require('gulp');
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

const GLOB_TS = require('../ts').GLOB_TS;
const COMMON_SRC = ['js/**/*.*', `!${GLOB_TS}`, `!${SRC}`];

const knownErrors = [
    'Cannot find module \'preact\'.',
    'Cannot find module \'preact/hooks\'.',
    'Cannot find module \'preact/compat\'.'
];

gulp.task('generate-components', function() {
    const tsProject = ts.createProject('build/gulp/generator/ts-configs/preact.tsconfig.json');
    generator.defaultOptionsModule = 'js/core/options/utils';
    generator.jqueryComponentRegistratorModule = 'js/core/component_registrator';
    generator.jqueryBaseComponentModule = 'js/renovation/preact-wrapper/component';

    return gulp.src(SRC)
        .pipe(generateComponents(generator))
        .pipe(plumber(()=>null))
        .pipe(tsProject({
            error(e) {
                if(!knownErrors.some(i => e.message.endsWith(i))) {
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
});

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
                .pipe(babel())
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
                .pipe(babel())
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

addGenerationTask('react', ['Cannot find module \'csstype\'.']);
addGenerationTask('angular', [
    'Cannot find module \'@angular/core\'.',
    'Cannot find module \'@angular/common\'.'
]);

addGenerationTask('vue', [], false, true, false);

gulp.task('generate-components-watch', gulp.series('generate-components', function() {
    gulp.watch(SRC, gulp.series('generate-components'));
}));
