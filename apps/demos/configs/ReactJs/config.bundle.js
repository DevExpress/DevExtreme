const bundleConfig = {
  bundles: {
    'devextreme.react.systemjs.js': [
      'devextreme/*',
      'devextreme/data/*',
      'devextreme/data/odata/*',
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
      'devextreme/common/*',
      'devextreme/common/data/*',
      'devextreme/common/data/odata/*',
      'devextreme/common/export/*',
      'devextreme/common/core/*',
      'devextreme/common/core/animation/*',
      'devextreme/common/core/environment/*',
      'devextreme/common/core/events/*',
      'devextreme/common/core/localization/*',
      'devextreme/common/core/localization/globalize/*',
      'devextreme-react/*',
      'devextreme-react/core/*',
      'devextreme-react/common/*',
      'devextreme-react/common/core/*',
      'devextreme-react/common/export/*',
      'devexpress-gantt',
      'devexpress-diagram',
      'react/*',
      'react-dom/*',
    ],
  },
  map: {
    'devextreme.react.systemjs.js': '../../../../../bundles/devextreme.react.systemjs.js',
    'devextreme/localization/messages': 'npm:devextreme/localization/messages',
  },
  packages: {
    'react': {
      defaultExtension: 'js',
      main: 'umd/react.development.js',
    },
    'react-dom': {
      defaultExtension: 'js',
      main: 'umd/react-dom.development.js',
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
