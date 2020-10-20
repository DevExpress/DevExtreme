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

        '@angular/core': 'npm:@angular/core@8.0.0/bundles/core.umd.js',
        '@angular/common': 'npm:@angular/common@8.0.0/bundles/common.umd.js',
        '@angular/compiler': 'npm:@angular/compiler@8.0.0/bundles/compiler.umd.js',
        '@angular/platform-browser': 'npm:@angular/platform-browser@8.0.0/bundles/platform-browser.umd.js',
        '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic@8.0.0/bundles/platform-browser-dynamic.umd.js',
        '@angular/router': 'npm:@angular/router@8.0.0/bundles/router.umd.js',
        '@angular/forms': 'npm:@angular/forms@8.0.0/bundles/forms.umd.js',
        '@angular/common/http': 'npm:@angular/common@8.0.0/bundles/common-http.umd.js',
        'tslib': 'npm:tslib/tslib.js',

        'rxjs': 'npm:rxjs@6.3.3',
        'rxjs/operators': 'npm:rxjs@6.3.3/operators',
        'preact': 'npm:preact/dist/preact.js',

        'jszip': 'npm:jszip@3.1.3/dist/jszip.min.js',
        'devextreme-quill': 'npm:devextreme-quill/dist/dx-quill.js',
        'devextreme': '../../artifacts/angular'
    },
    packages: {
        'app': {
            main: './app.component.ts',
            defaultExtension: 'ts'
        },
        'devextreme': {
            defaultExtension: 'js',
        },
        'devextreme/events': {
            defaultExtension: 'js',
            main: 'index.js'
        },
        'rxjs': { main: 'index.js', defaultExtension: 'js' },
        'rxjs/operators': { main: 'index.js', defaultExtension: 'js' },
    }
});
