import { nodeResolve }  from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import fs from 'fs-extra';

const baseDir = './node_modules/devextreme-angular/fesm2022/';
const fileNames = fs.readdirSync(baseDir)
    .filter((fileName) => fileName.indexOf('mjs.map') !== -1)
    .filter((fileName) =>
        fileName.indexOf('devextreme-angular-ui') === 0
        || fileName.indexOf('devextreme-angular-common') === 0
    )
    .map((fileName) => fileName.replace('.mjs.map', ''));

const inputs = {
    'devextreme-angular': `${baseDir}devextreme-angular.mjs`,
    'devextreme-angular-core': `${baseDir}devextreme-angular-core.mjs`,
    'devextreme-angular-http': `${baseDir}devextreme-angular-http.mjs`,
    ...fileNames.reduce((acc, name) => {
        acc[name] = `${baseDir}${name}.mjs`;

        return acc;
    }, {}),
};

const getLibName =  (file) => file
    .replace(/^devextreme-angular-ui-/,'devextreme-angular/ui/')
    .replace(/^devextreme-angular-/,'devextreme-angular/');

export default Object.entries(inputs).map(([module, file]) =>
    ({
        input: file,
        treeshake: {
            moduleSideEffects: true
        },
        context: 'window',
        output: {
            file: `./bundles/devextreme-angular/${module}.umd.js`,
            name: `${getLibName(module)}`,
            format: "umd",
            amd: {
                id: getLibName(module)
            },
            globals: {
                '@angular/core': 'ng.core',
                '@angular/common': 'ng.common',
                '@angular/forms': 'ng.forms',
                "@angular/platform-browser": 'ng.platformBrowser',
            },
            plugins: [
                {
                    name: 'add-esModule-marker',
                    renderChunk(code) {
                        return code.replace(/(\}\)\);)([^\;]*)$/, 'Object.defineProperty(exports, \'__esModule\', { value: true });\n$1$2');
                    }
                }
            ]
        },
        external: id => {
            return /^@angular\//.test(id)
                || /^zonejs/.test(id)
                || /^devextreme\//.test(id)
                || /^devextreme-angular\//.test(id)
        },

        plugins: [
            replace({
                preventAssignment: true,
                'process.env.NODE_ENV': JSON.stringify( 'production' )
            }),
            nodeResolve({
                preferBuiltins: false,
                browser: true
            }),
            babel({
                babelHelpers: 'bundled',
                presets: ['@babel/preset-env'],
            }),
        ]
    })
)
;
