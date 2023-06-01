const path = require('path/posix');
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
        'systemjs-babel-build': path.join(root, '/node_modules/systemjs-plugin-babel/systemjs-babel-browser.js'),
    },
    packages: {
        '@devextreme/runtime/common': {
            main: '../cjs/common/index.js',
            defaultExtension: 'js',
            format: 'cjs',
        },
        '@devextreme/runtime/inferno': {
            main: '../cjs/inferno/index.js',
            defaultExtension: 'js',
            format: 'cjs',
        },
        '@devextreme/runtime/angular': {
            main: '../cjs/angular/index.js',
            defaultExtension: 'js',
            format: 'cjs',
        },
        '@devextreme/runtime/react': {
            main: '../cjs/react/index.js',
            defaultExtension: 'js',
            format: 'cjs',
        },
        '@devextreme/runtime/vue': {
            main: '../cjs/vue/index.js',
            defaultExtension: 'js',
            format: 'cjs',
        },
        '@devextreme/runtime/declarations': {
            main: '../cjs/declarations/index.js',
            defaultExtension: 'js',
            format: 'cjs',
        },
        '': {
            defaultExtension: 'js',
        },

        // Deps
        'globalize': {
            main: '../globalize.js',
            defaultExtension: 'js',
        },
        'cldr': {
            main: '../cldr.js',
            defaultExtension: 'js',
        },
        'events/utils': {
            main: 'index',
        },
        'events': {
            main: 'index',
        },
    },
    packageConfigPaths: [
        '@devextreme/*/package.json',
    ],
    meta: {
        '/node_modules/knockout/build/output/knockout-latest.debug.js': {
            format: 'global',
            deps: ['jquery'],
            exports: 'ko',
        },

        '/artifacts/js/angular.js': {
            deps: ['jquery'],
            format: 'global',
            exports: 'angular',
        },

        '*.json': {
            'loader': 'json',
        },
    },
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
            (item.name.endsWith('.json') && !item.name.includes('tsconfig') && !item.name.includes('__meta'))
        ) {
            files.push(`${dirName}/${item.name}`);
        }
    }

    return files;
};

const transpileModules = async() => {
    getFileList(path.join(root, 'artifacts/transpiled')).forEach((filePath) => {
        transpileFile(filePath, filePath.replace('/transpiled', '/transpiled-systemjs'));
    });

    const infernoPath = path.join(root, 'node_modules/@devextreme/runtime/esm/inferno');
    const listRuntimeFiles = getFileList(infernoPath);

    // eslint-disable-next-line no-restricted-syntax
    for(const filePath of listRuntimeFiles) {
        const file = fs.readFileSync(filePath);
        const { code } = await babel.transform(file.toString(), {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-modules-systemjs'],
        });

        const destPath = filePath.replace(infernoPath, path.join(root, 'artifacts/transpiled-systemjs/runtime/inferno'));
        const destDir = path.dirname(destPath);
        if(!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        fs.writeFileSync(destPath, code);
    }
};

const buildAmdModule = (body) => `
define(function(require, exports, module) {
${body}
});
`;

const transpileCommonJSFile = (source, pathToFile) => {
    const [pre, post] = path.extname(pathToFile) === '.json'
        ? ['module.exports = ', ';']
        : ['', ''];

    fs.writeFileSync(
        pathToFile,
        buildAmdModule(
            `${pre}${source}${post}`.replace(/(\n|\r)/g, '$1    ')
        )
    );
};

const buildJsonModule = (body) => `
SystemJS.register([], function(_exports) {
    return {
        setters: [],
        execute: function() {
            _exports("default", ${body});
        }
    };
});
`;

const transpileFile = async(sourcePath, targetPath) => {
    const code = fs.readFileSync(sourcePath).toString().replaceAll('/testing/helpers/', '/artifacts/transpiled-testing/helpers/');
    const dirPath = path.dirname(targetPath);

    if(!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    if(/(^|\s)System(JS)?\./gm.test(code) || /(^|\s)define\(/gm.test(code)) {
        fs.writeFileSync(targetPath, code);
    } else if(/(\(|\s|^)require\(/.test(code) || /(module\.)?exports(\.\w+)?\s?=/.test(code)) {
        transpileCommonJSFile(code, targetPath);
    } else if(sourcePath.endsWith('.json')) {
        fs.writeFileSync(targetPath, buildJsonModule(code));
    } else {
        await transpileWithBabel(code, targetPath);
    }
};

const transpileRenovationModules = async() => {
    await Promise.all(
        getFileList(path.join(root, 'artifacts/transpiled-renovation')).map((filePath) => {
            return transpileFile(
                filePath,
                filePath.replace('/transpiled-renovation', '/transpiled-renovation-systemjs'),
            );
        })
    );
};

const buildCssAsSystemModule = (name, filePath) => `
System.register('${filePath}', [], false, function() {});
(function() {
    if (typeof document == 'undefined') return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/${filePath}';
    link.setAttribute('data-theme', '${name}');
    document.getElementsByTagName('head')[0].appendChild(link);
})();
`;

const transpileCss = async(Builder) => {
    const pluginsList = ['css', 'json'];

    await Promise.all(
        pluginsList.map(pluginName => {
            const builder = new Builder(root, config);

            return builder.bundle(
                path.join(root, `node_modules/systemjs-plugin-${pluginName}/${pluginName}.js`),
                path.join(root, `artifacts/css-systemjs/${pluginName}.js`),
            );
        }),
    );

    const cssList = [
        ['artifacts/css/dx.light.css', 'generic.light'],
        ['artifacts/css/dx.material.blue.light.css', 'material.blue.light'],
    ];

    // eslint-disable-next-line no-restricted-syntax
    for(const [cssFile, styleName] of cssList) {
        const destPath = path.join(root, cssFile.replace('css', 'css-systemjs'));
        const destDir = path.dirname(destPath);
        if(!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        fs.writeFileSync(destPath, buildCssAsSystemModule(styleName, cssFile));
    }
};

const transpileWithBuilder = async(builder, sourcePath, destPath, buildTree) => {
    await builder.buildStatic(
        buildTree ? sourcePath : `[${sourcePath}]`,
        destPath,
        {
            minify: false,
            sourceMaps: true,
            encodeNames: false,
        },
    );
};

const transpileWithBabel = async(sourceCode, destPath) => {
    const { code } = await babel.transform(sourceCode, {
        compact: false,
        plugins: ['@babel/plugin-transform-modules-systemjs'],
        sourceMaps: true,
    });

    const destDir = path.dirname(destPath);

    if(!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    fs.writeFileSync(destPath, code);
};

const transpileJsVendors = async(Builder) => {
    const builder = new Builder(root, config);

    const vendorsList = [
        {
            filePath: path.join(root, 'node_modules/angular/index.js'),
            destPath: path.join(root, 'artifacts/js-systemjs/angular.js'),
        },
        {
            filePath: path.join(root, 'node_modules/intl/index.js'),
            destPath: path.join(root, 'artifacts/js-systemjs/intl.js'),
        },
        {
            filePath: path.join(root, 'node_modules/knockout/build/output/knockout-latest.debug.js'),
            destPath: path.join(root, 'artifacts/js-systemjs/knockout.js'),
        },
    ];

    [].concat(
        getFileList(path.join(root, 'node_modules/devextreme-cldr-data')),
        getFileList(path.join(root, 'node_modules/cldr-core/supplemental'))
    )
        .filter(filePath => filePath.endsWith('.json'))
        .forEach((filePath) => {
            transpileFile(filePath, filePath.replace('node_modules', 'artifacts/js-systemjs'));
        });

    // eslint-disable-next-line no-restricted-syntax
    for(const { filePath, destPath } of vendorsList) {
        await transpileWithBuilder(builder, filePath, destPath, true);
    }
};

const transpileFileWithBuilder = async(Builder, filePath, sourceFolder, destFolder) => {
    const builder = new Builder(root, config);
    const destPath = filePath.replace(sourceFolder, destFolder);
    const sourceCode = fs.readFileSync(filePath).toString();

    if(/System(JS)?\./.test(sourceCode) && (
        filePath.includes('DevExpress.ui.widgets/') ||
        filePath.includes('htmlEditorParts/')
    )) {
        fs.writeFileSync(destPath, sourceCode.replace(new RegExp(`(['"])\\${sourceFolder}`, 'g'), `$1${destFolder}`));
        return;
    }

    if(
        filePath.includes('ui.widgets/fileManagerParts')
        || filePath.includes('ui.widgets.dataGrid/')
        || filePath.includes('ui.widgets.editors/')
    ) {
        await transpileWithBabel(sourceCode, destPath);
    } else {
        try {
            await transpileWithBuilder(builder, filePath, destPath);
        } catch(error) {
            await transpileWithBabel(sourceCode, destPath);
        }
    }
};

const transpileTesting = async(Builder) => {
    const contentList = getFileList(path.join(root, 'testing/content'));
    const helpersList = getFileList(path.join(root, 'testing/helpers'));
    const testsList = getFileList(path.join(root, 'testing/tests'));
    const listFiles = [].concat(contentList, helpersList, testsList);

    // eslint-disable-next-line no-restricted-syntax
    for(const filePath of listFiles) {
        if(filePath.endsWith('.js')) {
            await transpileFile(filePath, filePath.replace('/testing/', '/artifacts/transpiled-testing/'));
        } else {
            await transpileFileWithBuilder(Builder, filePath, '/testing/', '/artifacts/transpiled-testing/');
        }
    }
};

const patchBuilder = (fileName, searchValue, replaceValue) => {
    const filePath = path.join(root, 'node_modules/systemjs-builder/lib/', fileName);
    const file = fs.readFileSync(filePath).toString();

    if(!file.includes(replaceValue)) {
        fs.writeFileSync(filePath, file.replaceAll(
            searchValue,
            replaceValue,
        ));
    }
};

const updateBuilder = () => {
    patchBuilder(
        'trace.js',
        'load.depMap[dep] = getCanonicalName(loader, normalized);',
        `load.depMap[dep] = normalized.includes('node_modules/angular') || normalized.includes('node_modules/intl') ?
            getCanonicalName(loader, normalized) :
            dep.replace("/testing/helpers/", "/artifacts/transpiled-testing/helpers/")
                .replace("../../../../artifacts/js/", "../../../../../artifacts/js")
                .replace("/node_modules/", "/../node_modules/");`,
    );

    patchBuilder(
        'compile.js',
        'exportDefault ? "true" : "false"',
        'exportDefault && !compileOpts.namedExports ? "true" : "false"',
    );

    patchBuilder(
        'builder.js',
        'return normalized;',
        'return normalized.replace("%20", " ");',
    );
};

(async() => {
    // eslint-disable-next-line no-undef
    const { transpile } = parseArguments(process.argv);

    const Builder = require('systemjs-builder');

    switch(transpile) {
        case 'builder':
            return updateBuilder();
        case 'modules':
            return await transpileModules();
        case 'modules-renovation':
            return await transpileRenovationModules();
        case 'testing':
            return await transpileTesting(Builder);
        case 'css':
            return await transpileCss(Builder);
        case 'js-vendors':
            return await transpileJsVendors(Builder);
    }
})();
