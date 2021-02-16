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
        /** devextreme-aspnet-data-nojquery */
        'devextreme-aspnet-data-nojquery': {
            "esModule": true
        },
        /**/

        /** vectormap */
        'devextreme/dist/js/vectormap-data/*': {
            'esModule': true
        },
		
        /**/
		
        'devextreme/localization.js': {
            "esModule": true
        }
    },
    paths: {
        'npm:': '../../../../../node_modules/'
    },
    map: {
        'ts': 'npm:plugin-typescript/lib/plugin.js',
        'typescript': 'npm:typescript/lib/typescript.js',
        '@angular': 'npm:@angular',
        'tslib': 'npm:tslib/tslib.js',
        'rxjs': 'npm:rxjs',

        /** signalr */
        '@aspnet/signalr': 'npm:@aspnet/signalr/dist/cjs/index.js',
        /**/

        /** devextreme-aspnet-data-nojquery */
        'devextreme-aspnet-data-nojquery': 'npm:devextreme-aspnet-data-nojquery/index.js',
        /**/

        /** showdown&turndown */
        'showdown': "npm:showdown/dist/showdown.js",
        'turndown': "npm:turndown/lib/turndown.browser.umd.js",
        /**/

        /** globalize */
        'globalize': 'npm:globalize/dist/globalize',
        'json': 'npm:systemjs-plugin-json/json.js',
        'cldr': 'npm:cldrjs/dist/cldr',
        /**/

        /** exceljs&file-saver */
        'exceljs': 'npm:exceljs/dist/exceljs.js',
        'file-saver': 'npm:file-saver/FileSaver.js',
        /**/

        /** jspdf&jspdf-autotable */
        'jspdf': 'npm:jspdf/dist/jspdf.es.min.js',
        'jspdf-autotable': 'npm:jspdf-autotable/dist/jspdf.plugin.autotable.min.js',
        /**/

        /** devextreme-intl */
        'devextreme-intl': 'npm:devextreme-intl',
        'json': 'npm:systemjs-plugin-json/json.js',
        /**/

        /** canvg */
        'stackblur-canvas': 'npm:stackblur-canvas/dist/stackblur.min.js',
        'rgbcolor': 'npm:rgbcolor/index.js',
        'canvg': 'npm:canvg/dist/browser/canvg.min.js',
        /**/

        /** vectormap */
        'devextreme/dist/js/vectormap-data': 'npm:devextreme/dist/js/vectormap-data',
        /**/
        
        'rrule': 'npm:rrule/dist/es5/rrule.js',
        'luxon': 'npm:luxon/build/global/luxon.min.js',
        'es6-object-assign': 'npm:es6-object-assign',

        'devextreme': 'npm:devextreme/cjs',
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
        }/** globalize */,
        'globalize': {
            main: '../globalize.js',
            defaultExtension: 'js'
        },
        'cldr': {
            main: '../cldr.js',
            defaultExtension: 'js'
        }/**/,
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

        /** signalr */
        "npm:@aspnet/*/package.json",
        /**/
    ]
});
