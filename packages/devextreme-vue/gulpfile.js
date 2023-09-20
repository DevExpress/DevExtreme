const fs = require('fs');
const del = require('del');
const gulp = require('gulp');
const shell = require('gulp-shell');
const header = require('gulp-header');
const ts = require('gulp-typescript');
const config = require('./build.config');
const generateVueComponents = require('devextreme-internal-tools').generateVueComponents;

const GENERATE = 'generate';
const CLEAN = 'clean';
const OUTPUTDIR_CLEAN = 'output-dir.clean';
const NPM_CLEAN = 'npm.clean';
const NPM_PACKAGE = 'npm.package';
const NPM_LICENSE = 'npm.license';
const ADD_HEADERS = 'npm.license-headers';
const NPM_README = 'npm.readme';
const NPM_BUILD = 'npm.build';
const NPM_PACK = 'npm.pack';
const VUE_VERSION = 3;

gulp.task(OUTPUTDIR_CLEAN, (c) =>
    del([`${config.generatedComponentsDir}\\*`, `!${config.coreComponentsDir}`], c)
);

gulp.task(NPM_CLEAN, (c) =>
    del(config.npm.dist, c)
);

gulp.task(CLEAN, gulp.parallel(OUTPUTDIR_CLEAN, NPM_CLEAN));

gulp.task(GENERATE,
    (done) => {
        generateVueComponents(
            JSON.parse(fs.readFileSync(config.metadataPath).toString()),
            config.baseComponent,
            config.configComponent,
            {
                componentsDir: config.generatedComponentsDir,
                indexFileName: config.indexFileName
            },
            config.widgetsPackage,
            VUE_VERSION,
            true
        );

        done();
    }
);

gulp.task(NPM_PACKAGE,
    () => gulp.src(config.npm.package).pipe(gulp.dest(config.npm.dist))
);

gulp.task(NPM_LICENSE,
    () => gulp.src(config.npm.license).pipe(gulp.dest(config.npm.dist))
);

gulp.task(NPM_README,
    () => gulp.src(config.npm.readme).pipe(gulp.dest(config.npm.dist))
);

gulp.task(NPM_BUILD, gulp.series(
    gulp.parallel(NPM_LICENSE, NPM_PACKAGE, NPM_README),
    () => {
        return gulp.src([
            config.src,
            ...config.ignoredGlobs
        ])
            .pipe(ts('tsconfig.json'))
            .pipe(gulp.dest(config.npm.dist));
    }
));

gulp.task(ADD_HEADERS, function () {
    const pkg = require('./package.json');
    const now = new Date();
    const data = {
        pkg: pkg,
        date: now.toDateString(),
        year: now.getFullYear()
    };

    const banner = [
        '/*!',
        ' * <%= pkg.name %>',
        ' * Version: <%= pkg.version %>',
        ' * Build date: <%= date %>',
        ' *',
        ' * Copyright (c) 2012 - <%= year %> Developer Express Inc. ALL RIGHTS RESERVED',
        ' *',
        ' * This software may be modified and distributed under the terms',
        ' * of the MIT license. See the LICENSE file in the root of the project for details.',
        ' *',
        ' * https://github.com/DevExpress/devextreme-vue',
        ' */',
        '\n'
    ].join('\n');

    return gulp.src(`${config.npm.dist}**/*.{ts,js}`)
        .pipe(header(banner, data))
        .pipe(gulp.dest(config.npm.dist));
});

gulp.task(NPM_PACK, gulp.series(
    NPM_CLEAN,
    NPM_BUILD,
    ADD_HEADERS,
    shell.task(['npm pack'], {cwd: config.npm.dist})
));
