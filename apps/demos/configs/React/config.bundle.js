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
      'devexpress-gantt',
      'devexpress-diagram',
      'react/*',
      'react-dom/*',
    ],
  },
  map: {
    'devextreme.react.systemjs.js': '../../../../bundles/devextreme.react.systemjs.js',
    'devextreme/localization/messages': 'npm:devextreme/localization/messages',
  },
  packages: {
    'react': {
      defaultExtension: 'js',
      main: '../../../../../../../node_modules/react/umd/react.development.js',
    },
    'react-dom': {
      defaultExtension: 'js',
      main: '../../../../../../../node_modules/react-dom/umd/react-dom.development.js',
    },
    'devextreme/localization/messages': {
      format: 'json',
      defaultExtension: '',
    },
    'devextreme-cldr-data': {
      format: 'json',
      defaultExtension: '',
    },
  },
};

System.config(bundleConfig);

if (window.config) {
  [
    'devextreme',
    'devextreme-react',
    'devexpress-gantt',
    'devexpress-diagram',
    'react',
    'react-dom',
  ].forEach((pkg) => delete window.config.map[pkg]);

  System.config(window.config);
}
