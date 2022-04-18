/* eslint-disable */

System.config({
    transpiler: 'ts',
    typescriptOptions: {
        module: 'commonjs',
        emitDecoratorMetadata: true,
        experimentalDecorators: true
    },
    meta: {
        'typescript': {
            'exports': 'ts'
        }
    },
    paths: {
        'npm:': 'https://unpkg.com/'
    },
    map: {
        'ts': 'npm:plugin-typescript@8.0.0/lib/plugin.js',
        'typescript': 'npm:typescript@3.4.5/lib/typescript.js',

        '@angular/core': 'npm:@angular/core@11.2.14/bundles/core.umd.js',
        '@angular/common': 'npm:@angular/common@11.2.14/bundles/common.umd.js',
        '@angular/compiler': 'npm:@angular/compiler@11.2.14/bundles/compiler.umd.js',
        '@angular/platform-browser': 'npm:@angular/platform-browser@11.2.14/bundles/platform-browser.umd.js',
        '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic@11.2.14/bundles/platform-browser-dynamic.umd.js',
        '@angular/router': 'npm:@angular/router@11.2.14/bundles/router.umd.js',
        '@angular/forms': 'npm:@angular/forms@11.2.14/bundles/forms.umd.js',
        '@angular/common/http': 'npm:@angular/common@11.2.14/bundles/common-http.umd.js',
        'tslib': 'npm:tslib/tslib.js',

        'rxjs': 'npm:rxjs@6.3.3',
        'rxjs/operators': 'npm:rxjs@6.3.3/operators',
        'inferno': 'npm:inferno/dist/inferno.min.js',
        'inferno-create-element': 'npm:inferno-create-element/dist/inferno-create-element.min.js',

        'jszip': 'npm:jszip@3.1.3/dist/jszip.min.js',
        'rrule': 'npm:rrule@2.6.8/dist/es5/rrule.js',
        'devextreme-quill': 'npm:devextreme-quill/dist/dx-quill.js',
        'devextreme': '../../artifacts/angular',
        '@devextreme/runtime/angular': '../../node_modules/@devextreme/runtime/cjs/angular',
        '@devextreme/runtime/common': '../../node_modules/@devextreme/runtime/cjs/common',
    },
    packages: {
        'app': {
            main: './app.component.ts',
            defaultExtension: 'ts'
        },
        'devextreme': {
            defaultExtension: 'js',
        },
        '@devextreme/runtime/angular': {
            defaultExtension: 'js',
            main: 'index.js'
        },
        'devextreme/events': {
            defaultExtension: 'js',
            main: 'index.js'
        },
        'rxjs': { main: 'index.js', defaultExtension: 'js' },
        'rxjs/operators': { main: 'index.js', defaultExtension: 'js' },
    }
});
