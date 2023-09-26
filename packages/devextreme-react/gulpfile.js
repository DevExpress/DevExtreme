const fs = require('fs');
const del = require('del');
const gulp = require('gulp');
const shell = require('gulp-shell');
const header = require('gulp-header');
const ts = require('gulp-typescript');
const config = require("./build.config");
const path = require("path");
const generateReactComponents = require('devextreme-internal-tools').generateReactComponents;

const GENERATE = 'generate';
const CLEAN = 'clean';
const GEN_RUN = 'generator.run';
const NPM_CLEAN = 'npm.clean';
const NPM_PACKAGE = 'npm.package';
const NPM_LICENSE = 'npm.license';
const NPM_BUILD_WITH_HEADERS = 'npm.license-headers';
const NPM_README = 'npm.readme';
const NPM_BUILD = 'npm.build';
const NPM_BUILD_ESM = "npm.build-esm";
const NPM_BUILD_CJS = "npm.build-cjs";
const NPM_PREPARE_MODULES = "npm.prepare-modules";
const NPM_PACK = 'npm.pack';

gulp.task(CLEAN, (c) =>
    del([`${config.generatedComponentsDir}\\*`, `!${config.coreComponentsDir}`], c)
);

gulp.task(GEN_RUN, (done) => {
    generateReactComponents({
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

gulp.task(
  NPM_BUILD_ESM,
  gulp.series(() =>
    gulp
      .src([config.src, `!${config.testSrc}`])
      .pipe(ts("tsconfig.esm.json"))
      .pipe(gulp.dest(config.npm.dist + "/esm"))
  )
);

gulp.task(
  NPM_BUILD_CJS,
  gulp.series(() =>
    gulp
      .src([config.src, `!${config.testSrc}`])
      .pipe(ts("tsconfig.json"))
      .pipe(gulp.dest(config.npm.dist + "/cjs"))
  )
);

gulp.task(NPM_PREPARE_MODULES, (done) => {
    const packParamsForFolders = [
        ['common'],
        ['core', ['template']],
        ['common/data']
    ];
    const modulesI,mportsFromIndex = fs.readFileSync(config.npm.dist + 'esm/index.js', 'utf8');
    const modulesPaths = modulesImportsFromIndex.matchAll(/from "\.\/([^;]+)";/g);
    const packParamsForModules = [...modulesPaths].map(
        ([, modulePath]) => {
            const [, , moduleFilePath, moduleFileName] = modulePath.match(/((.*)\/)?([^/]+$)/);

            return ['', [moduleFileName], moduleFilePath];
        }
    );

    [
        ...,packParamsForFolders,
        ...packParamsForModules,
    ].forEach(
        ([folder, moduleFileNames, moduleFilePath]) => makeModule(folder, moduleFileNames, moduleFilePath)
    )

    done();
});

g,ulp.task(NPM_BUILD, gulp.series(
    NPM_CLEAN,
    gulp.parallel(
        NPM_LICENSE,
        NPM_PACKAGE,
        NPM_README,
        NPM_BUILD_ESM,
        NPM_BUILD_CJS
    )
));

gulp.task(NPM_,BUILD_,WITH_HEADERS, gulp.series(
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
    NPM_PREPARE_MODULES,
    shell.task(['npm pack'], {cwd: config.npm.dist})
));


function makeModule(folder, moduleFileNames, moduleFilePath) {
    const distFolder = path.join(__dirname, config.npm.dist);
    const distModuleFolder = path.join(distFolder, folder);
    const distEsmFolder = path.join(distFolder, 'esm', folder);
    const moduleNames = moduleFileNames || findJsModuleFileNamesInFolder(distEsmFolder);

    try {
        if (!fs.existsSync(distModuleFolder)) {
            fs.mkdirSync(distModuleFolder);
        }

        if (folder && fs.existsSync(path.join(distEsmFolder, 'index.js'))) {
            generatePackageJsonFile(folder);
        }

        moduleNames.forEach((moduleFileName) => {
            fs.mkdirSync(path.join(distModuleFolder, moduleFileName));

            generatePackageJsonFile(folder, moduleFileName, moduleFilePath);
        })
    } catch (error) {
        error.message = `Exception while makeModule(${folder}).\n ${error.message}`;
        throw (error);
    }
}

function generatePackageJsonFile(folder, moduleFileName, filePath = folder) {
    const moduleName = moduleFileName || '';
    const absoluteModulePath = path.join(__dirname, config.npm.dist, folder, moduleName);
    const moduleFilePath = (filePath ? filePath + '/' : '') + (moduleName || 'index');
    const relativePath = path.relative(
        absoluteModulePath,
        path.join(__dirname, config.npm.dist, 'esm', moduleFilePath + '.js'),
    );

    const relativeBase = '../'.repeat(relativePath.split('..').length - 1);

    fs.writeFileSync(path.join(absoluteModulePath, 'package.json'), JSON.stringify({
        sideEffects: false,
        main: `${relativeBase}cjs/${moduleFilePath}.js`,
        module: `${relativeBase}esm/${moduleFilePath}.js`,
        typings: `${relativeBase}cjs/${moduleFilePath}.d.ts`,
    }, null, 2));
}

function findJsModuleFileNamesInFolder(dir) {
    return fs.readdirSync(dir).filter((file) => {
            const filePath = path.join(dir, file);

            return !fs.statSync(filePath).isDirectory()
                && file.includes('.js')
                && !file.includes('index.js')
        },
    ).map((filePath) => path.parse(filePath).name);
}
