const bundleConfig = {
  bundles: {
    'devextreme.angular.systemjs.js': [
      'devextreme/*',
      'devextreme/data/*',
      'devextreme/data/odata/*',
      'devextreme/animation/*',
      'devextreme/core/*',
      'devextreme/core/utils/*',
      'devextreme/data/*',
      'devextreme/data/odata/*',
      'devextreme/events/*',
      'devextreme/file_management/*',
      'devextreme/framework/*',
      'devextreme/integration/*',
      'devextreme/localization/*',
      'devextreme/localization/globalize/*',
      'devextreme/mobile/*',
      'devextreme/ui/*',
      'devextreme/ui/html_editor/*',
      'devextreme/ui/html_editor/converters/*',
      'devextreme/ui/pivot_grid/*',
      'devextreme/ui/speed_dial_action/*',
      'devextreme/ui/toast/*',
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
      'devextreme-angular',
      'devextreme-angular/*',
      'devextreme-angular/core/*',
      'devextreme-angular/common/*',
      'devextreme-angular/common/core/*',
      'devextreme-angular/common/export/*',
      'devexpress-gantt',
      'devexpress-diagram',
      'rxjs/*',
      'rxjs/operator/*',
      'rxjs/operators/*',
      'rxjs/observable/*',
    ],
  },
  map: {
    'devextreme.angular.systemjs.js': '../../../../bundles/devextreme.angular.systemjs.js',
    'rxjs': 'npm:rxjs/dist/bundles/rxjs.umd.js',
    'rxjs/operators': 'npm:rxjs/dist/cjs/operators/index.js',
  },
  packages: {
    'rxjs': { defaultExtension: 'js' },
    'rxjs/operators': { defaultExtension: 'js' },
  },
};

// eslint-disable-next-line no-unused-vars
function useBundle() {
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

    Object.keys(window.config.map).forEach((pkg) => {
      if (pkg.startsWith('devextreme-angular/')) {
        delete window.config.map[pkg];
      }
    });
  }
}

// useBundle();
System.config(window.config);
System.import('@angular/compiler').catch(console.error.bind(console));
