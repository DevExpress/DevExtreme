const gulp = require('gulp');
const { generateComponents } = require('devextreme-generator/component-compiler');
const generator = require('devextreme-generator/preact-generator').default;
const ts = require('gulp-typescript');
const lint = require('gulp-eslint');
const plumber = require('gulp-plumber');
const gulpIf = require('gulp-if');
const merge = require('merge-stream');
const babel = require('gulp-babel');

const SRC = 'js/renovation/**/*.tsx';
const DEST = 'js/renovation/';

const GLOB_TS = require('../ts').GLOB_TS;
const COMMON_SRC = ['js/**/*.*', '!' + GLOB_TS];

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

function addGenerationTask(frameworkName, knownErrors = []) {
    const generator = require(`devextreme-generator/${frameworkName}-generator`).default;
    gulp.task(`generate-${frameworkName}`, function() {
        const tsProject = ts.createProject(`build/gulp/generator/ts-configs/${frameworkName}.tsconfig.json`);
        generator.defaultOptionsModule = 'js/core/options/utils';

        return merge(
            gulp.src(COMMON_SRC),
            gulp.src('js/**/*.tsx')
                .pipe(generateComponents(generator))
                .pipe(plumber(() => null))
                .pipe(tsProject({
                    error(e) {
                        if(!knownErrors.some(i => e.message.endsWith(i))) {
                            console.log(e.message);
                        }
                    },
                    finish() { }
                }))
        ).pipe(babel())
            .pipe(gulp.dest(`artifacts/${frameworkName}`));
    });
}

addGenerationTask('react', ['Cannot find module \'csstype\'.']);
addGenerationTask('angular', [
    'Cannot find module \'@angular/core\'.',
    'Cannot find module \'@angular/common\'.'
]);

gulp.task('generate-components-watch', gulp.series('generate-components', function() {
    gulp.watch([SRC], gulp.series('generate-components'));
}));
