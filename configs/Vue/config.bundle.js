const bundleConfig = {
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
            'devextreme-vue/*'
        ]
    },
    map: {
        'devextreme.vue.systemjs.js': '../../../../../bundles/devextreme.vue.systemjs.js'
    }
};

System.config(bundleConfig);

if(window.config) {
    [
        'devextreme',
        'devextreme-vue'
    ].forEach(pkg => delete window.config.map[pkg]);

    System.config(window.config);
}

