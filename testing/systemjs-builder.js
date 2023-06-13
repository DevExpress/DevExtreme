const path = require('path/posix');
const fs = require('fs');
const babel = require('@babel/core');
const parseArguments = require('minimist');

// eslint-disable-next-line no-undef
const root = path.join(__dirname, '..');
const transpileRenovationPath = path.join(root, '/artifacts/transpiled-renovation');
const transpilePath = path.join(root, '/artifacts/transpiled');

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

const writeFileSync = (destPath, file) => {
    const destDir = path.dirname(destPath);
    if(!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    fs.writeFileSync(destPath, file);
};

const transpileModules = async() => {
    getFileList(transpilePath).forEach((filePath) => {
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
        writeFileSync(destPath, code);
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

    writeFileSync(
        pathToFile,
        buildAmdModule(
            `${pre}${source}${post}`.replace(/(\n|\r)/g, '$1    ')
        )
    );
};

const buildJsonModule = (body) => `
define(function(require, exports, module) {
    module.exports = ${body};
});
`;

const buildSystemJSModule = (body, pre = '') => `
SystemJS.register([], function(_exports) {
    ${pre}

    return {
        setters: [],
        execute: function() {
            ${body}
        }
    };
});
`;

const transpileFile = async(sourcePath, targetPath) => {
    const code = fs.readFileSync(sourcePath).toString().replaceAll('/testing/helpers/', '/artifacts/transpiled-testing/helpers/');

    if(sourcePath.includes('testing/helpers/includeThemesLinks.js')) {
        writeFileSync(targetPath, buildSystemJSModule('', code.replaceAll('\n', '    ')));
        return;
    }

    if(/(^|\s)System(JS)?\.register/gm.test(code) || /(^|\s)define\(/gm.test(code)) {
        writeFileSync(targetPath, code);
    } else if(/(\(|\s|^)require\(/.test(code) || /(module\.)?exports(\.\w+)?\s?=/.test(code)) {
        transpileCommonJSFile(code, targetPath);
    } else if(sourcePath.endsWith('.json')) {
        writeFileSync(targetPath, buildJsonModule(code));
    } else {
        await transpileWithBabel(code, targetPath);
    }
};

const transpileRenovationModules = async() => {
    await Promise.all(
        getFileList(transpileRenovationPath).map((filePath) => {
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

const transpileCss = async() => {
    const cssList = [
        ['artifacts/css/dx.light.css', 'generic.light'],
        ['artifacts/css/dx.material.blue.light.css', 'material.blue.light'],
    ];

    // eslint-disable-next-line no-restricted-syntax
    for(const [cssFile, styleName] of cssList) {
        const destPath = path.join(root, cssFile.replace('css', 'css-systemjs'));

        writeFileSync(destPath, buildCssAsSystemModule(styleName, cssFile));
    }
};

const transpileWithBabel = async(sourceCode, destPath) => {
    const { code } = await babel.transform(sourceCode, {
        compact: false,
        plugins: ['@babel/plugin-transform-modules-systemjs'],
        sourceMaps: true,
    });

    writeFileSync(destPath, code);
};

const transpileIntl = async() => {
    const listIntlFiles = [
        {
            filePath: path.join(root, 'node_modules/intl/lib/core.js'),
            destPath: path.join(root, 'artifacts/js-systemjs/intl/intl.js'),
        },
        {
            filePath: path.join(root, 'node_modules/intl/locale-data/complete.js'),
            destPath: path.join(root, 'artifacts/js-systemjs/intl/intl.complete.js'),
        },
    ];

    await Promise.all(listIntlFiles.map(({ filePath, destPath }) => {
        const code = fs.readFileSync(filePath).toString();

        writeFileSync(
            destPath,
            buildAmdModule(
                code.replace('IntlPolyfill', 'require("./intl.js")')
            )
        );
    }));

    const intlIndex = `
        define(function(require, exports, module) {
            window.IntlPolyfill = require('./intl.js');

            require('./intl.complete.js');

            if (!window.Intl) {
                window.Intl = window.IntlPolyfill;
                window.IntlPolyfill.__applyLocaleSensitivePrototypes();
            }

            module.exports = window.IntlPolyfill;
        });
    `;

    writeFileSync(path.join(root, 'artifacts/js-systemjs/intl/index.js'), intlIndex);
};

const transpileJsVendors = async() => {
    const pluginsList = [
        {
            filePath: path.join(root, 'node_modules/systemjs-plugin-css/css.js'),
            destPath: path.join(root, 'artifacts/js-systemjs/css.js'),
        },
        {
            filePath: path.join(root, 'node_modules/systemjs-plugin-json/json.js'),
            destPath: path.join(root, 'artifacts/js-systemjs/json.js'),
        },
    ];

    await Promise.all(
        pluginsList.map(({ filePath, destPath }) => {
            const code = fs.readFileSync(filePath).toString();

            return writeFileSync(
                destPath,
                buildSystemJSModule(
                    '',
                    code.replaceAll('exports', '_exports')
                        .replaceAll('module.exports', '_exports')
                )
            );
        }),
    );

    await Promise.all(
        getFileList(path.join(root, 'node_modules/angular')).map((filePath) => {
            return transpileFile(
                filePath,
                filePath.replace('node_modules', 'artifacts/js-systemjs'),
            );
        })
    );

    await transpileIntl();

    await transpileFile(
        path.join(root, 'node_modules/knockout/build/output/knockout-latest.debug.js'),
        path.join(root, 'artifacts/js-systemjs/knockout.js')
    );


    [].concat(
        getFileList(path.join(root, 'node_modules/devextreme-cldr-data')),
        getFileList(path.join(root, 'node_modules/cldr-core/supplemental'))
    )
        .filter(filePath => filePath.endsWith('.json'))
        .forEach((filePath) => {
            transpileFile(filePath, filePath.replace('node_modules', 'artifacts/js-systemjs'));
        });
};

const transpileTesting = async() => {
    const contentList = getFileList(path.join(root, 'testing/content'));
    const helpersList = getFileList(path.join(root, 'testing/helpers'));
    const testsList = getFileList(path.join(root, 'testing/tests'));

    [].concat(contentList, helpersList, testsList)
        .forEach((filePath) => {
            transpileFile(filePath, filePath.replace('/testing/', '/artifacts/transpiled-testing/'));
        });
};

(async() => {
    // eslint-disable-next-line no-undef
    const { transpile } = parseArguments(process.argv);

    switch(transpile) {
        case 'modules':
            return await transpileModules();
        case 'modules-renovation':
            return await transpileRenovationModules();
        case 'testing':
            return await transpileTesting();
        case 'css':
            return await transpileCss();
        case 'js-vendors':
            return await transpileJsVendors();
    }
})();
