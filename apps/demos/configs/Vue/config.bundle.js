const bundleConfig = {
  bundles: {
    'devextreme.vue.systemjs.js': [
      'devextreme/*',
      'devextreme/animation/*',
      'devextreme/common/*',
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
      'devextreme-vue/*',
      'devexpress-gantt',
      'devexpress-diagram',
    ],
  },
  map: {
    'devextreme.vue.systemjs.js': '../../../../bundles/devextreme.vue.systemjs.js',
  },
};

System.config(bundleConfig);

if (window.config) {
  [
    'devextreme',
    'devextreme-vue',
    'devexpress-gantt',
    'devexpress-diagram',
  ].forEach((pkg) => delete window.config.map[pkg]);

  System.config(window.config);
}
