'use strict';

const gulp = require('gulp');
const del = require('del');
const merge = require('merge-stream');
const ctx = require('../context.js');
const { version } = require('../../../package.json');
const replace = require('gulp-replace');
const performRecastReplacements = require('./replacements-import');
const performPackageReplacements = require('./replacements-package');
const { removeUnusedModules, cleanEmptyFolders } = require('./remove-unused-modules');
const babel = require('gulp-babel');
const transpileConfig = require('../transpile-config');
const { run } = require('./utils');
const argv = require('yargs').argv;

function copyMiscFiles(context, additionalReplacements) {
    return () => merge(
        gulp
            .src('package.json')
            .pipe(replace(version, ctx.version.package))
            .pipe(performPackageReplacements(context, additionalReplacements))
            .pipe(gulp.dest(context.destination)),
        gulp
            .src('README.md')
            .pipe(gulp.dest(context.destination)),
    );
}
function cleanNpmFramework(context) {
    return function cleanNpmFramework(done) {
        del.sync(context.destination);
        done();
    };
}
function copyRenovatedComponents(context) {
    return () => merge(
        gulp.src(context.source + '/**/*')
            .pipe(performRecastReplacements(context))
            .pipe(gulp.dest(context.destination))
    );
}

function transpileJSModules(context) {
    return () => gulp.src(`${context.destination}/**/*.js`)
                    .pipe(babel(transpileConfig.esm))
                    .pipe(gulp.dest(context.destination));
}
function installPackages(context) {
    return run('npm i', { cwd: context.destination });
}
function generateRenovation(context, generator) {
    return generator;
}

function buildSeries(steps, context) {
    const result = [];
    steps.forEach(majorStep => {
        const name = majorStep.name;
        const extension = context.steps[name] || {};

        const minorSteps = [extension.before, { ...majorStep, ...extension }, extension.after];

        minorSteps.forEach((minorStep) => {
            if (!minorStep)
                return;
            if (minorStep.condition && !minorStep.condition(context))
                return;
            if (minorStep.actions) {
                minorStep.actions.forEach(action => {
                    if (minorStep.arg) {
                        result.push(action(context, minorStep.arg(context)));
                    } else {
                        result.push(action(context));
                    }
                })
            }
        });
    });
    return result;
}

function addCompilationTask(frameworkData) {
    const context = {
        source: `artifacts/${frameworkData.name}/renovation`,
        destination: `artifacts/npm-${frameworkData.name}`,
        extensions: ['.js', '.ts', '.d.ts', '.tsx'],
        production: argv.production,
        ...frameworkData,
    }
    const steps = [
        {
            name: 'startup'
        },
        {
            name: 'cleanup',
            actions: [cleanNpmFramework]
        },
        {
            name: 'generate',
            arg: (ctx) => ctx.generator,
            actions: [generateRenovation],
        },
        {
            name: 'copyRenovatedComponents',
            actions: [copyRenovatedComponents]
        },
        {
            name: 'copyMiscFiles',
            requires: 'copyRenovatedComponents',
            actions: [copyMiscFiles]
        },
        {
            name: 'removeUnusedModules',
            actions: [removeUnusedModules, cleanEmptyFolders]
        },
        {
            name: 'transpile',
            condition: (ctx) => ctx.switches.transpile,
            actions: [transpileJSModules]
        },
        {
            name: 'installPackages',
            condition: (ctx) => ctx.switches.installPackages,
            actions: [installPackages]
        },
        {
            name: 'teardown'
        }
    ];

    const builtSteps = buildSeries(steps, context)
    gulp.task(`renovation-npm-${context.name}`, gulp.series(...buildSeries(steps, context)));
}

addCompilationTask({
    name: 'react',
    generator: 'generate-react',

    switches: {
        transpile: true
    },
    steps: {
        copyMiscFiles: {
            arg: (ctx) => require('./steps-react').preparePackage,
            after: {
                actions: [require('./steps-react').createReactEntryPoint, require('./steps-react').createModuleEntryPointers]
            }
        },
    }
});
addCompilationTask({
    name: 'angular',
    generator: 'generate-angular-typescript',

    switches: {
        installPackages: true,
    },
    steps: {
        copyMiscFiles: {
            arg: (ctx) => require('./steps-angular').preparePackageForPackagr,
            after: {
                actions: [require('./steps-angular').createNgEntryPoint]
            }
        },
        teardown: {
            before: {
                actions: [require('./steps-angular').runPackagr]
            }
        }
    }
});
