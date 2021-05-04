if (window.Promise && window.System) {
    System.config({
        bundles: {
            'devextreme.vue.systemjs.js': [
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
                'devextreme-vue/*',
                'dx-systemjs-vue-browser/*',
                'systemjs-plugin-babel/*',
                'systemjs-plugin-babel/babel-helpers/*'
            ]
        },
        paths: {
            'npm:': '../../../../../node_modules/'
        },
        map: {
            'jquery': 'npm:jquery/dist/jquery.min.js',
            'devextreme.vue.systemjs.js': '../../../../../bundles/devextreme.vue.systemjs.js',
            'devextreme-quill': 'npm:devextreme-quill/dist/dx-quill.min.js',
            'plugin-babel': 'systemjs-plugin-babel/plugin-babel.js',
            'systemjs-babel-build': 'systemjs-plugin-babel/systemjs-babel-browser.js'
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
            'devextreme-vue': {
                defaultExtension: 'js'
            }
        },
        meta: {
            "*.vue": { loader: "vue-loader" }
        }
    });
}
