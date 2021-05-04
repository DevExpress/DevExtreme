if (window.Promise && window.System) {
    System.config({
        bundles: {
            'devextreme.react.systemjs.js': [
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
                'devextreme-react/*',
                'react/*',
                'react-dom/*'

            ]
        },
        paths: {
            'npm:': '../../../../../node_modules/'
        },
        map: {
            'jquery': 'npm:jquery/dist/jquery.min.js',
            'devextreme.react.systemjs.js': '../../../../../bundles/devextreme.react.systemjs.js',
            'devextreme-quill': 'npm:devextreme-quill/dist/dx-quill.min.js'
        },
        packages: {
            'devextreme': {
                defaultExtension: 'js'
            },
            'devextreme/events/utils': {
                main: 'index'
            },
            'devextreme/events': {
                main: 'index'
            },
            'devextreme-react': {
                defaultExtension: 'js'
            },
            'react': {
                defaultExtension: 'js',
                main: 'umd/react.development.js'
            },
            'react-dom': {
                defaultExtension: 'js',
                main: 'umd/react-dom.development.js'
            }
        }
    });
}
