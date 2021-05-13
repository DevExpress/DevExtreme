
const bundleConfig = {
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
    map: {
        'devextreme.angular.systemjs.js': '../../../../../bundles/devextreme.angular.systemjs.js'
    },
    packages: {

        'rxjs': { main: 'index.js', defaultExtension: 'js' },
        'rxjs/operators': { main: 'index.js', defaultExtension: 'js' },
    }
};

System.config(bundleConfig);

if(window.config) {
    [
        'devextreme',
        'devextreme-angular',
        'rxjs',
        'devextreme/bundles/dx.all'
    ].forEach(pkg => delete window.config.map[pkg]);

    System.config(window.config);
}

