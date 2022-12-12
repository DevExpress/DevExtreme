import gulp from 'gulp';
import gulpIf from 'gulp-if';
import cached from 'gulp-cached';
import rename from "gulp-rename";
import * as ts from 'gulp-typescript';

import { generateComponents } from '@devextreme-generator/build-helpers';
import  { InfernoFromReactGenerator } from '@devextreme-generator/inferno-from-react';

const reactComponentsRoot = '../react/src/';

export const ReactSrc = [
    '**/*.{ts,tsx}',
].map(path => path[0] === '!' ? '!' + reactComponentsRoot + path.slice(1) :
    reactComponentsRoot + path);

export function generateInfernoFromReactComponents(distPath, dev = true) {
    const tsReactProject = ts.default.createProject('gulp/typescript-configs/tsconfig.json');
    const tsProject = ts.default.createProject('gulp/typescript-configs/tsconfig.json');
    const generator = new InfernoFromReactGenerator();

    return gulp.src(ReactSrc)
        .pipe(gulpIf(dev, cached('generate-inferno-from-react-component')))
        .pipe(tsReactProject({}))
        .pipe(rename(function(path) {
            path.extname = path.extname === '.js' ? '.ts' : '.tsx'
        }))
        .pipe(generateComponents(generator))
        .pipe(tsProject())
        .pipe(gulp.dest(distPath));
}

