// In real applications, you should not transpile code in the browser. You can see how to create your own application with Angular and DevExtreme here:
// https://js.devexpress.com/Documentation/Guide/Angular_Components/Getting_Started/Create_a_DevExtreme_Application/
System.config({
    transpiler: 'ts',
    typescriptOptions: {
        module: "system",
        emitDecoratorMetadata: true,
        experimentalDecorators: true
    },
    meta: {
        'typescript': {
            "exports": "ts"
        },
        'devextreme/localization.js': {
            "esModule": true
        }
    },
    paths: {
        'npm:': '../../../../node_modules/'
    },
    map: {
        'ts': 'npm:plugin-typescript/lib/plugin.js',
        'typescript': 'npm:typescript/lib/typescript.js',
        '@angular': 'npm:@angular',
        'tslib': 'npm:tslib/tslib.js',
        'rxjs': 'npm:rxjs',
        'exceljs': 'npm:exceljs/dist/exceljs.js',
        'file-saver': 'npm:file-saver/FileSaver.js',
        'rrule': 'npm:rrule/dist/es5/rrule.js',
        'luxon': 'npm:luxon/build/global/luxon.min.js',
        'es6-object-assign': 'npm:es6-object-assign',
        'devextreme': 'npm:devextreme',
        'jszip': 'npm:jszip/dist/jszip.min.js',
        'devextreme-quill': 'npm:devextreme-quill/dist/dx-quill.min.js',
        'devexpress-diagram': 'npm:devexpress-diagram',
        'devexpress-gantt': 'npm:devexpress-gantt',
        'devextreme-angular': 'npm:devextreme-angular',
        'preact': 'npm:preact/dist/preact.js',
        'preact/hooks': 'npm:preact/hooks/dist/hooks.js'
    },
    packages: {
        'app': {
            main: './app.component.ts',
            defaultExtension: 'ts'
        },
        'devextreme': {
            defaultExtension: 'js'
        },
        'devextreme/events/utils': {
            main: 'index'
        },
        'devextreme/events': {
            main: 'index'
        },
        'es6-object-assign': {
            main: './index.js',
            defaultExtension: 'js'
        }
    },
    packageConfigPaths: [
        "npm:@angular/*/package.json",
        "npm:@angular/common/*/package.json",
        "npm:rxjs/package.json",
        "npm:rxjs/operators/package.json",
        "npm:devextreme-angular/*/package.json",
        "npm:devextreme-angular/ui/*/package.json",
        "npm:devextreme-angular/package.json",
        "npm:devexpress-diagram/package.json",
        "npm:devexpress-gantt/package.json",
    ]
});
