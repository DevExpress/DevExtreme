if(window.Promise && window.System) {
    System.config({
        meta: {
          'devextreme/localization.js': {
            esModule: true
          }
        },
        bundles: {
            'devextreme.angular.systemjs.js': [
                'devextreme/*',
                'devextreme/animation/*',
                'devextreme/core/*',
                'devextreme/core/utils/*',
                'devextreme/data/*',
                'devextreme/data/odata/*',
                'devextreme/events/*',
                'devextreme/framework/*',
                'devextreme/integration/*',
                'devextreme/localization/*',
                'devextreme/localization/globalize/*',
                'devextreme/mobile/*',
                'devextreme/ui/*',
                'devextreme/ui/pivot_grid/*',
                'devextreme/viz/*',
                'devextreme/viz/vector_map/*',
                'devextreme-angular',
                'devextreme-angular/*',
                'rxjs/*',
                'rxjs/operator/*',
                'rxjs/operators/*',
                'rxjs/observable/*'
            ]
        },
        paths: {
            'npm:': '../../../../../node_modules/'
        },
        map: {
            'jquery': 'npm:jquery/dist/jquery.min.js',
            'devextreme.angular.systemjs.js': '../../../../../bundles/devextreme.angular.systemjs.js',
            'devextreme-quill': 'npm:devextreme-quill/dist/dx-quill.min.js'

        },
        packages: {
            'devextreme': {
                defaultExtension: 'js',
            },
            'devextreme/events/utils': {
                main: 'index'
            },
            'devextreme/events': {
                main: 'index'
            },
            'rxjs': { main: 'index.js', defaultExtension: 'js' },
            'rxjs/operators': { main: 'index.js', defaultExtension: 'js' },
        }
    });
}
