const Builder = require('systemjs-builder');
const path = require('path');
const fs = require('fs');

const root = path.join(__dirname, '..');
const transpileRenovationPath = path.join(root, '/artifacts/transpiled-renovation');
const transpilePath = path.join(root, '/artifacts/transpiled');

const config = {
    map: {
        'animation': path.join(transpilePath, 'animation'),
        'core': path.join(transpilePath, 'core'),
        'data': path.join(transpilePath, 'data'),
        'events': path.join(transpilePath, 'events'),
        'renovation': path.join(transpileRenovationPath, 'renovation'),
        'ui': path.join(transpilePath, 'ui'),

        // Deps
        'globalize': path.join(root, '/artifacts/js/globalize'),
        'intl': path.join(root, '/node_modules/intl/index.js'),
        'cldr': path.join(root, '/artifacts/js/cldr'),
        'jquery': path.join(root, '/artifacts/js/jquery.js'),
        'knockout': path.join(root, '/node_modules/knockout/build/output/knockout-latest.debug.js'),
        'angular': path.join(root, '/artifacts/js/angular.js'),
        'inferno': path.join(root, '/node_modules/inferno/dist/inferno.js'),
        'inferno-hydrate': path.join(root, '/node_modules/inferno-hydrate/dist/inferno-hydrate.js'),
        'inferno-compat': path.join(root, '/node_modules/inferno-compat/dist/inferno-compat.js'),
        'inferno-clone-vnode': path.join(root, '/node_modules/inferno-clone-vnode/dist/index.cjs.js'),
        'inferno-create-element': path.join(root, '/node_modules/inferno-create-element/dist/index.cjs.js'),
        'inferno-create-class': path.join(root, '/node_modules/inferno-create-class/dist/index.cjs.js'),
        'inferno-extras': path.join(root, '/node_modules/inferno-extras/dist/index.cjs.js'),
        'jszip': path.join(root, '/artifacts/js/jszip.js'),
        '@devextreme/vdom': path.join(root, '/node_modules/@devextreme/vdom'),
        '@devextreme/runtime/common': path.join(root, '/node_modules/@devextreme/runtime/common'),
        '@devextreme/runtime/inferno': path.join(root, '/node_modules/@devextreme/runtime/inferno'),
        '@devextreme/runtime/declarations': path.join(root, '/node_modules/@devextreme/runtime/declarations'),
        '@devextreme/runtime/angular': path.join(root, '/node_modules/@devextreme/runtime/angular'),
        '@devextreme/runtime/vue': path.join(root, '/node_modules/@devextreme/runtime/vue'),
        '@devextreme/runtime/react': path.join(root, '/node_modules/@devextreme/runtime/react'),
        'devextreme-quill': path.join(root, '/node_modules/devextreme-quill/dist/dx-quill.js'),
        'devexpress-diagram': path.join(root, '/artifacts/js/dx-diagram.js'),
        'devexpress-gantt': path.join(root, '/artifacts/js/dx-gantt.js'),
        'exceljs': path.join(root, '/node_modules/exceljs/dist/exceljs.js'),
        'fflate': path.join(root, '/node_modules/fflate/esm/browser.js'),
        'jspdf': path.join(root, '/node_modules/jspdf/dist/jspdf.umd.js'),
        'jspdf-autotable': path.join(root, '/node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.js'),
        'turndown': path.join(root, '/node_modules/turndown/lib/turndown.browser.umd.js'),
        'devextreme-showdown': path.join(root, '/node_modules/devextreme-showdown/dist/showdown.js'),
        'rrule': path.join(root, '/node_modules/rrule/dist/es5/rrule.js'),

        // Global CSS
        'generic_light.css': path.join(root, '/artifacts/css/dx.light.css'),
        'material_blue_light.css': path.join(root, '/artifacts/css/dx.material.blue.light.css'),

        // SystemJS plugins
        'css': path.join(root, '/node_modules/systemjs-plugin-css/css.js'),
        'text': path.join(root, '/node_modules/systemjs-plugin-text/text.js'),
        'json': path.join(root, '/node_modules/systemjs-plugin-json/json.js'),
        'plugin-babel': path.join(root, '/node_modules/systemjs-plugin-babel/plugin-babel.js'),
        'systemjs-babel-build': path.join(root, '/node_modules/systemjs-plugin-babel/systemjs-babel-browser.js')
    },
    packages: {
        '@devextreme/runtime/common': {
            main: '../cjs/common/index.js',
            defaultExtension: 'js',
            format: 'cjs'
        },
        '@devextreme/runtime/inferno': {
            main: '../cjs/inferno/index.js',
            defaultExtension: 'js',
            format: 'cjs'
        },
        '@devextreme/runtime/angular': {
            main: '../cjs/angular/index.js',
            defaultExtension: 'js',
            format: 'cjs'
        },
        '@devextreme/runtime/react': {
            main: '../cjs/react/index.js',
            defaultExtension: 'js',
            format: 'cjs'
        },
        '@devextreme/runtime/vue': {
            main: '../cjs/vue/index.js',
            defaultExtension: 'js',
            format: 'cjs'
        },
        '@devextreme/runtime/declarations': {
            main: '../cjs/declarations/index.js',
            defaultExtension: 'js',
            format: 'cjs'
        },
        '': {
            defaultExtension: 'js'
        },

        // Deps
        'globalize': {
            main: '../globalize.js',
            defaultExtension: 'js'
        },
        'cldr': {
            main: '../cldr.js',
            defaultExtension: 'js'
        },
        'events/utils': {
            main: 'index'
        },
        'events': {
            main: 'index'
        },
    },
    packageConfigPaths: [
        "@devextreme/*/package.json",
    ],
    meta: {
        '/node_modules/knockout/build/output/knockout-latest.debug.js': {
            format: 'global',
            deps: ['jquery'],
            exports: 'ko'
        },

        '/artifacts/js/angular.js': {
            deps: ['jquery'],
            format: 'global',
            exports: 'angular'
        }
    }
};

const getFileList = (dirName) => {
    let files = [];
    const items = fs.readdirSync(dirName, { withFileTypes: true });

    for (const item of items) {
        if (item.isDirectory()) {
            files = [...files, ...getFileList(`${dirName}/${item.name}`)];
        } else if (item.name.endsWith('.js')) {
            files.push(`${dirName}/${item.name}`);
        }
    }

    return files;
};

const transpileModules = () => {
    const builder = new Builder(root, config);
    const listFiles = getFileList(path.join(root, 'artifacts', 'transpiled'));

    return Promise.all(listFiles.map(filePath => builder.buildStatic(
        `[${filePath}]`,
        filePath.replace('transpiled', 'transpiled-systemjs'),
        {
            minify: false,
            sourceMaps: true,
            encodeNames: false
        }
    )));
};

const transpileCss = async () => {
    const builder = new Builder(root, config);
    const listFiles = [
        {
            filePath: path.join(root, 'artifacts', 'css', 'dx.material.blue.light.css!'),
            destPath: path.join(root, 'artifacts', 'css-systemjs', 'dx.material.blue.light.css'),
        },
        {
            filePath: path.join(root, 'artifacts', 'css', 'dx.light.css!'),
            destPath: path.join(root, 'artifacts', 'css-systemjs', 'dx.light.css'),
        },
        {
            filePath: path.join(root, 'node_modules', 'systemjs-plugin-css', 'css.js'),
            destPath: path.join(root, 'artifacts', 'css-systemjs', 'css.js'),
        }
    ];

    // https://github.com/systemjs/plugin-css/issues/102#issuecomment-243473887
    for (const { filePath, destPath } of listFiles) {
        await builder.bundle(filePath, destPath);
    }
};

const transpileTests = () => {
    const builder = new Builder(root, config);
    const testingFolders = [
        'DevExpress.ui.widgets',
        'DevExpress.ui.widgets.dataGrid',
        'DevExpress.ui.widgets.editors'
    ];

    const promises = [];

    for (const folder of testingFolders) {
        const listFiles = getFileList(path.join(root, 'testing', 'tests', folder));

        for (const filePath of listFiles) {
            promises.push(builder.buildStatic(
                `[${filePath}]`,
                filePath.replace('testing', 'artifacts/transpiled-testing'),
                {
                    minify: false,
                    sourceMaps: true,
                    encodeNames: false
                }
            ));
        }
    }

    return Promise.all(promises);
};

const transpileHelpers = async () => {
    const builder = new Builder(root, { ...config, transpiler: 'plugin-babel', });
    const helpers = getFileList(path.join(root, 'testing', 'helpers'));

    for (const filePath of helpers) {
        try {
            await builder.buildStatic(
                `[${filePath}]`,
                filePath.replace('testing', 'artifacts/transpiled-testing'),
                {
                    minify: false,
                    sourceMaps: true,
                    encodeNames: false
                }
            );
        } catch (error) {
            console.log(filePath, error)
        }
    }
};

(async () => {
    console.time('modules')
    await transpileModules();
    console.timeEnd('modules');

    console.time('tests')
    await transpileTests();
    console.timeEnd('tests');

    console.time('css')
    await transpileCss();
    console.timeEnd('css');

    console.time('helpers')
    await transpileHelpers();
    console.timeEnd('helpers');
})();
