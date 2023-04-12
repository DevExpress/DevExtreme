const path = require('path');
const fs = require('fs');
const babel = require('@babel/core');
const parseArguments = require('minimist');

// eslint-disable-next-line no-undef
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
        '@devextreme/*/package.json',
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
        },

        '*.json': {
            'loader': 'json'
        }
    }
};

const getFileList = (dirName) => {
    let files = [];
    const items = fs.readdirSync(dirName, { withFileTypes: true });

    // eslint-disable-next-line no-restricted-syntax
    for(const item of items) {
        if(item.isDirectory()) {
            files = [...files, ...getFileList(`${dirName}/${item.name}`)];
        } else if(
            item.name.endsWith('.js') ||
            (item.name.endsWith('.json') && !item.name.includes('tsconfig'))
        ) {
            files.push(`${dirName}/${item.name}`);
        }
    }

    return files;
};

const transpileModules = async(Builder) => {
    const builder = new Builder(root, config);

    const listFiles = getFileList(path.join(root, 'artifacts/transpiled'));

    // eslint-disable-next-line no-restricted-syntax
    for(const filePath of listFiles) {
        await builder.buildStatic(
            `[${filePath}]`,
            filePath.replace('transpiled', 'transpiled-systemjs'),
            {
                minify: false,
                sourceMaps: true,
                encodeNames: false
            }
        );
    }

    const infernoPath = path.join(root, 'node_modules/@devextreme/runtime/esm/inferno');
    const listRuntimeFiles = getFileList(infernoPath);

    // eslint-disable-next-line no-restricted-syntax
    for(const filePath of listRuntimeFiles) {
        const file = fs.readFileSync(filePath);
        const { code } = await babel.transform(file.toString(), {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-modules-systemjs']
        });

        const destPath = filePath.replace(infernoPath, path.join(root, 'artifacts/transpiled-systemjs/runtime/inferno'));
        const destDir = path.dirname(destPath);
        if(!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        fs.writeFileSync(destPath, code);
    }
};

const transpileRenovationModules = async(Builder) => {
    const builder = new Builder(root, config);

    const listRenovationFiles = getFileList(path.join(root, 'artifacts/transpiled-renovation'));

    // eslint-disable-next-line no-restricted-syntax
    for(const filePath of listRenovationFiles) {
        await builder.buildStatic(
            `[${filePath}]`,
            filePath.replace('transpiled-renovation', 'transpiled-renovation-systemjs'),
            {
                minify: false,
                sourceMaps: true,
                encodeNames: false,
                namedExports: filePath.includes('__internal')
            }
        );
    }
};

const transpileCss = async(Builder) => {
    const pluginsList = ['css', 'json'];

    await Promise.all(
        pluginsList.map(pluginName => {
            const builder = new Builder(root, config);

            return builder.bundle(
                path.join(root, `node_modules/systemjs-plugin-${pluginName}/${pluginName}.js`),
                path.join(root, `artifacts/css-systemjs/${pluginName}.js`)
            );
        })
    );

    const cssList = ['artifacts/css/dx.light.css', 'artifacts/css/dx.material.blue.light.css'];

    // eslint-disable-next-line no-restricted-syntax
    for(const cssFile of cssList) {
        const destPath = path.join(root, cssFile.replace('css', 'css-systemjs'));
        const destDir = path.dirname(destPath);
        if(!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        const systemInject = `System.register('${cssFile}', [], false, function () {});`;
        const cssInject = `(function(c){if (typeof document == 'undefined') return;var d=document,a='appendChild',i='styleSheet',s=d.createElement('link');s.rel='stylesheet';s.type='text/css';s.href='/${cssFile}';d.getElementsByTagName('head')[0][a](s);})();`;

        fs.writeFileSync(destPath, [systemInject, cssInject].join('\n'));
    }
};

const transpileTests = async(Builder) => {
    const builder = new Builder(root, config);
    const helpersList = getFileList(path.join(root, 'testing/helpers'));
    const testsList = getFileList(path.join(root, 'testing/tests'));
    const listFiles = [].concat(helpersList, testsList).filter(name => name.endsWith('.js'));

    // eslint-disable-next-line no-restricted-syntax
    for(const filePath of listFiles) {
        const destPath = filePath.replace('testing', 'artifacts/transpiled-testing');
        try {
            await builder.buildStatic(
                `[${filePath}]`,
                destPath,
                {
                    minify: false,
                    sourceMaps: true,
                    encodeNames: false
                }
            );
        } catch(error) {
            const file = fs.readFileSync(filePath);
            const { code } = await babel.transform(file.toString(), {
                plugins: ['@babel/plugin-transform-modules-systemjs']
            });

            const destDir = path.dirname(destPath);
            if(!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }

            fs.writeFileSync(destPath, code);
        }

    }
};

const patchBuilder = (fileName, searchValue, replaceValue) => {
    const filePath = path.join(root, 'node_modules/systemjs-builder/lib/', fileName);
    const file = fs.readFileSync(filePath).toString();

    if(!file.includes(replaceValue)) {
        fs.writeFileSync(filePath, file.replace(
            searchValue,
            replaceValue
        ));
    }
};

const updateBuilder = () => {
    patchBuilder(
        'trace.js',
        'load.depMap[dep] = getCanonicalName(loader, normalized);',
        'load.depMap[dep] = dep.replace("/testing/helpers/", "/artifacts/transpiled-testing/helpers/").replace("/node_modules/", "/../node_modules/");'
    );

    patchBuilder(
        'compile.js',
        'exportDefault ? "true" : "false"',
        'exportDefault && !compileOpts.namedExports ? "true" : "false"'
    );
};

(async() => {
    // eslint-disable-next-line no-undef
    const { transpile } = parseArguments(process.argv);

    const Builder = require('systemjs-builder');

    switch(transpile) {
        case 'builder': return updateBuilder();
        case 'modules': return await transpileModules(Builder);
        case 'modules-renovation': return await transpileRenovationModules(Builder);
        case 'tests': return await transpileTests(Builder);
        case 'css': return await transpileCss(Builder);
    }
})();
