const fs = require('fs');
const del = require('del');
const gulp = require('gulp');
const shell = require('gulp-shell');
const header = require('gulp-header');
const ts = require('gulp-typescript');
const config = require('./build.config');
const path = require('path');

const GENERATE = 'generate';
const CLEAN = 'clean';
const GEN_RUN = 'generator.run';
const NPM_CLEAN = 'npm.clean';
const NPM_PACKAGE = 'npm.package';
const NPM_LICENSE = 'npm.license';
const NPM_BUILD_WITH_HEADERS = 'npm.license-headers';
const NPM_README = 'npm.readme';
const NPM_BUILD = 'npm.build';
const NPM_BUILD_ESM = 'npm.build-esm';
const NPM_BUILD_CJS = 'npm.build-cjs';
const NPM_PREPARE_FOLDERS = 'npm.prepare-folders';
const NPM_PREPARE_MODULES = 'npm.prepare-modules';
const NPM_PACK = 'npm.pack';

gulp.task(CLEAN, (c) =>
    del([`${config.generatedComponentsDir}\\*`, `!${config.coreComponentsDir}`], c)
);

gulp.task(GEN_RUN, (done) => {
    const generateSync = require('devextreme-react-generator').default;
    generateSync({
        metaData: JSON.parse(fs.readFileSync(config.metadataPath).toString()),
        components: {
            baseComponent: config.baseComponent,
            extensionComponent: config.extensionComponent,
            configComponent: config.configComponent
        },
        out: {
            componentsDir: config.generatedComponentsDir,
            indexFileName: config.indexFileName
        },
        widgetsPackage: 'devextreme',
        typeGenerationOptions: {
            generateReexports: true,
            generateCustomTypes: true,
        },
    });

    done();
});

gulp.task(GENERATE, gulp.series(
    CLEAN,
    GEN_RUN
));

gulp.task(NPM_CLEAN, (c) =>
    del(config.npm.dist, c)
);

gulp.task(NPM_PACKAGE, gulp.series(
    () => gulp.src(config.npm.package).pipe(gulp.dest(config.npm.dist))
));

gulp.task(NPM_LICENSE, gulp.series(
    () => gulp.src(config.npm.license).pipe(gulp.dest(config.npm.dist))
));

gulp.task(NPM_README, gulp.series(
    () => gulp.src(config.npm.readme).pipe(gulp.dest(config.npm.dist))
));

gulp.task(NPM_BUILD_ESM, gulp.series(
    () => gulp.src([
        config.src,
        `!${config.testSrc}`
    ])
        .pipe(ts('tsconfig.esm.json'))
        .pipe(gulp.dest(config.npm.dist + '/esm'))
));

gulp.task(NPM_BUILD_CJS, gulp.series(
    () => gulp.src([
        config.src,
        `!${config.testSrc}`
    ])
        .pipe(ts('tsconfig.json'))
        .pipe(gulp.dest(config.npm.dist + '/cjs'))
));

gulp.task(NPM_PREPARE_FOLDERS, (done) => {
    makeModuleFolder('common');

    makeModuleFolder('core', ['template']);

    makeModuleFolder('common/data');

    done();
});

gulp.task(NPM_PREPARE_MODULES, (done) => {
    const modulesIndex = fs.readFileSync(config.npm.dist + 'esm/index.js', 'utf8');

    [...modulesIndex.matchAll(/from "\.\/([^;]+)";/g)].forEach(([,modulePath]) => {
        const moduleName = modulePath.match(/[^/]+$/)[0];

        createModuleFolder(moduleName);
    })

    done();
});

gulp.task(NPM_BUILD, gulp.series(
    NPM_CLEAN,
    gulp.parallel(
        NPM_LICENSE,
        NPM_PACKAGE,
        NPM_README,
        NPM_BUILD_ESM,
        NPM_BUILD_CJS
    )
));

gulp.task(NPM_BUILD_WITH_HEADERS, gulp.series(
    NPM_BUILD,
    () => {
        const pkg = require('./package.json');
        const now = new Date();
        const data = {
            pkg,
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
            ' * https://github.com/DevExpress/devextreme-react',
            ' */',
            '\n'
        ].join('\n');

        return gulp.src(`${config.npm.dist}**/*.{ts,js}`)
            .pipe(header(banner, data))
            .pipe(gulp.dest(config.npm.dist));
    }
));

gulp.task(NPM_PACK, gulp.series(
    NPM_BUILD_WITH_HEADERS,
    gulp.parallel(
        NPM_PREPARE_MODULES,
        NPM_PREPARE_FOLDERS,
    ),
    shell.task(['npm pack'], {cwd: config.npm.dist})
));

function findFilesByMask(dir, mask) {
    let results = [];

    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);

        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            results = results.concat(findFilesByMask(filePath, mask));
        } else if (file.includes(mask)) {
            results.push(filePath);
        }
    }

    return results;
}

function findJsModuleFileNamesInFolder(dir) {
    return findFilesByMask(dir, '.js')
        .filter((file) => !file.includes('index.js'))
        .map((filePath) => path.parse(filePath).name);
}

function makeModuleFolder(targetName, moduleFileNames) {
    const distFolder = path.join(__dirname, config.npm.dist);
    const targetFolder = path.join(distFolder, targetName);
    const baseDir = '../'.repeat(targetName.split('/').length);

    moduleFileNames = moduleFileNames || findJsModuleFileNamesInFolder(path.join(distFolder, 'esm', targetName));

    fs.mkdirSync(targetFolder);

    if (fs.existsSync(path.join(distFolder, 'esm', targetName, 'index.js'))) {
        fs.writeFileSync(path.join(targetFolder , 'package.json'), JSON.stringify({
            sideEffects: false,
            main: `${baseDir}cjs/${targetName}/index.js`,
            module: `${baseDir}esm/${targetName}/index.js`,
            typings: `${baseDir}cjs/${targetName}/index.d.ts`,
        },null, 2));
    }

    moduleFileNames.forEach((moduleName) => {
        createModuleFolder(moduleName, targetName, baseDir);
    })
}

function createModuleFolder(moduleName, targetName = null, baseDir = '') {
    const moduleFolder = path.join(__dirname, config.npm.dist, targetName || '', moduleName);
    const modulePath = (targetName ? targetName + '/' : '') + moduleName;

    try {
        fs.mkdirSync(moduleFolder);

        fs.writeFileSync(path.join(moduleFolder , 'package.json'), JSON.stringify({
            sideEffects: false,
            main:  `${baseDir}../cjs/${modulePath}.js`,
            module: `${baseDir}../esm/${modulePath}.js`,
            typings: `${baseDir}../cjs/${modulePath}.d.ts`,
        },null, 2));

    } catch (error) {
        error.message = `Exception while createModuleFolder(${targetName}).\n ${error.message}`;
        throw(error);
    }
}
