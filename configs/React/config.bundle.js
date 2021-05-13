
const bundleConfig = {
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
    map: {
        'devextreme.react.systemjs.js': '../../../../../bundles/devextreme.react.systemjs.js'
    },
    packages: {
        'react': {
            defaultExtension: 'js',
            main: 'umd/react.development.js'
        },
        'react-dom': {
            defaultExtension: 'js',
            main: 'umd/react-dom.development.js'
        }
    }
};

System.config(bundleConfig);

if(window.config) {
    [
        'devextreme',
        'devextreme-react',
        'react',
        'react-dom'
    ].forEach(pkg => delete window.config.map[pkg]);

    System.config(window.config);
}

