// const path = require('path');
import gulp from 'gulp';
import gulpIf from 'gulp-if';
// const cached = require('gulp-cached');
import babel from 'gulp-babel';
import rename from "gulp-rename";
import * as ts from 'gulp-typescript';
import transpileConfig from './transpile-config.js';

import * as core from '@devextreme-generator/core';

import { generateComponents } from '@devextreme-generator/build-helpers';
import InfernoFromReactGeneratorModule from '@devextreme-generator/inferno-from-react';
// TODO Vitik: remove this mapping after next release of generators
const InfernoFromReactGenerator = InfernoFromReactGeneratorModule.InfernoFromReactGenerator ||
    InfernoFromReactGeneratorModule.ReactInfernoGenerator;

class ImportWrap {
    constructor(importDeclaration) {
        this.importDeclaration = importDeclaration;
    }
    toString() {
        return `import { HookContainer, InfernoWrapperComponent } from '@devextreme/runtime/inferno-hooks'
        ${this.importDeclaration.toString()}`;
    }
}
class PatchedGenerator extends InfernoFromReactGenerator {
    createImportDeclaration(decorators, modifiers, importClause, moduleSpecifier) {
        if(Object.keys(this.components).length > 0 && !this.coreHooksImportAdded) {
            this.coreHooksImportAdded = true;
            return new ImportWrap(super.createImportDeclaration(decorators, modifiers, importClause, moduleSpecifier));
        }
        return super.createImportDeclaration(decorators, modifiers, importClause, moduleSpecifier);
    }
    postProcessResult() {
        this.coreHooksImportAdded = false;
        super.postProcessResult();
    }
}
// const env = require('../env-variables');
// const context = require('../context.js');

// const esmPackage = env.BUILD_ESM_PACKAGE;
// const { BASE_GENERATOR_OPTIONS_WITH_JQUERY } = require('./generator-options');
const reactComponentsRoot = '../react/src/';
const BASE_GENERATOR_OPTIONS_WITH_JQUERY = {
    defaultOptionsModule: 'js/core/options/utils',
    jqueryComponentRegistratorModule: 'js/core/component_registrator',
    jqueryBaseComponentModule: 'js/renovation/component_wrapper/common/component'
};

const SRC = [
    '**/*.{ts,tsx}',
    //    '!/**/*.d.ts',
    //'!/**/__tests__/**/*',
    //'!/test_utils/**/*'
].map(path => path[0] === '!' ? '!' + reactComponentsRoot + path.slice(1) :
    reactComponentsRoot + path);

/*function partialGenerateInfernoFromReactComponents() {
    return function generateInfernoFromReactComponentsTs() {
        const tsReactProject = ts.createProject('build/gulp/generator/ts-configs/inferno-from-react.tsconfig.json');
        const generator = new InfernoFromReactGenerator();
        generator.options = BASE_GENERATOR_OPTIONS_WITH_JQUERY;

        return gulp.src(SRC, { base: 'js/react' })
            .pipe(gulpIf(true, cached('generate-inferno-from-react-component')))
            .pipe(tsReactProject())
            .pipe(rename(function(path) {
                path.extname = path.extname === '.js' ? '.ts' : '.tsx'
            }))
            .pipe(generateComponents(generator))
            .pipe(gulp.dest('./artifacts/inferno-from-react/'));
    };
}*/

export function generateInfernoFromReactComponents(distPath) {
    //return function generateInfernoFromReactComponents() {
    const tsReactProject = ts.default.createProject('gulp/inferno-from-react.tsconfig.json');
    const tsProject = ts.default.createProject('gulp/inferno-from-react.tsconfig.json');
    const generator = new PatchedGenerator(); //new InfernoFromReactGenerator();
    generator.options = BASE_GENERATOR_OPTIONS_WITH_JQUERY;

    const isNotDTS = (file) => !file.path.endsWith('.d.ts');
    // const isDefault = distPath === './';
    // return gulp
    //     .src('./node_modules/@dx/react/components/pager/**/*.mjs')
    // .pipe(gulp.dest('./dest'));

    return gulp.src(SRC/*, { base: 'react/components/pager/' }*/)
        // .pipe(gulpIf(dev, cached('generate-inferno-from-react-component')))
        .pipe(tsReactProject({}))
        .pipe(rename(function(path) {
            path.extname = path.extname === '.js' ? '.ts' : '.tsx'
        }))
        .pipe(generateComponents(generator))
        .pipe(tsProject())
        // .pipe(gulpIf(isNotDTS, babel(transpileConfig.cjs)))
        .pipe(babel(transpileConfig.esm))
        .pipe(gulp.dest(distPath));
    // .pipe(gulpIf(isDefault, gulp.dest(path.join(context.TRANSPILED_PATH, 'renovation'))))
    // .pipe(gulpIf(isDefault, gulp.dest(path.join(context.TRANSPILED_RENOVATION_PATH, 'renovation'))))
    // .pipe(gulpIf(isDefault, gulp.dest(path.join(context.TRANSPILED_PROD_RENOVATION_PATH, 'renovation'))))
    // .pipe(gulpIf(esmPackage, gulp.dest(path.join(context.TRANSPILED_PROD_ESM_PATH, 'renovation', distPath))));
    //};
}

// gulp.task('debug:inferno-from-react', partialGenerateInfernoFromReactComponents())
// gulp.task('debug:update-renovation-using-react', generateInfernoFromReactComponents('./', transpileConfig.cjs, true))

/* module.exports = {
    reactComponentSrc: SRC,
    generateInfernoFromReactComponents,
    generateInfernoFromReactComponentsTs: partialGenerateInfernoFromReactComponents
};*/
