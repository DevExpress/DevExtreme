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
      'devexpress-gantt',
      'devexpress-diagram',
      'rxjs/*',
      'rxjs/operator/*',
      'rxjs/operators/*',
      'rxjs/observable/*',
    ],
  },
  map: {
    'devextreme.angular.systemjs.js': '../../../../../bundles/devextreme.angular.systemjs.js',
    'rxjs': 'npm:rxjs/dist/bundles/rxjs.umd.js',
    'rxjs/operators': 'npm:rxjs/dist/cjs/operators/index.js',
  },
  packages: {
    'rxjs': { defaultExtension: 'js' },
    'rxjs/operators': { defaultExtension: 'js' },
  },
};

System.config(bundleConfig);

if (window.config) {
  [
    'devextreme',
    'devextreme-angular',
    'devexpress-gantt',
    'devexpress-diagram',
    'rxjs',
    'devextreme/bundles/dx.all',
  ].forEach((pkg) => delete window.config.map[pkg]);

  System.config(window.config);
}
