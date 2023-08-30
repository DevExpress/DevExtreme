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
const NPM_PACKAGE_MODULES = 'npm.package-modules';
const NPM_MOVE_DECLARATIONS = 'npm.move-declarations';
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

gulp.task(NPM_PACKAGE_MODULES, (done) => {
    const modulesIndex = fs.readFileSync(config.npm.dist + 'esm/index.js', 'utf8');
    const distFolder = path.join(__dirname, config.npm.dist);

    [...modulesIndex.matchAll(/from "\.\/([^;]+)";/g)].forEach(([,modulePath]) => {
        const moduleName = modulePath.match(/[^/]+$/)[0];

        try {
            // moveDeclarations();

            fs.mkdirSync(path.join(distFolder, moduleName));

            fs.writeFileSync(path.join(distFolder , moduleName, 'package.json'), JSON.stringify({
                sideEffects: false,
                main: `../cjs/${modulePath}.js`,
                module: `../esm/${modulePath}.js`,
                typings: `../declarations/${modulePath}.d.ts`,
            },null, 2));

        } catch (error) {
            error.message = `Exception while ${NPM_PACKAGE_MODULES}.\n ${error.message}`;
            throw(error);
        }
    })

    done();
});

gulp.task(NPM_MOVE_DECLARATIONS, (done) => {
    const distFolder = path.join(__dirname, config.npm.dist);
    const declarations = findDeclarationFiles(path.join(distFolder, 'cjs'));

    fs.mkdirSync(path.join(distFolder + `/declarations`));

    declarations.forEach((filePath) => {
        const relativePath = path.relative(path.join(distFolder, 'cjs'), filePath);
        const destPath = path.join(distFolder, 'declarations', relativePath);


        if (!fs.existsSync(path.dirname(destPath))) {
            fs.mkdirSync(path.dirname(destPath), { recursive: true });
        }

        fs.rename(
            filePath,
            path.join(distFolder, 'declarations', relativePath),
            (err) => {
                if (err) {
                    throw(err);
                }
            });
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
    ),
    NPM_PACKAGE_MODULES,
    NPM_MOVE_DECLARATIONS,
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
    shell.task(['npm pack'], {cwd: config.npm.dist})
));

function findDeclarationFiles(dir) {
    let results = [];

    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);

        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            results = results.concat(findDeclarationFiles(filePath));
        } else if (file.includes('.d.ts')) {
            results.push(filePath);
        }
    }

    return results;
}
