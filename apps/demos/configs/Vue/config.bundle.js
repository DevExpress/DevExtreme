const bundleConfig = {
  bundles: {
    'devextreme.vue.systemjs.js': [
      'devextreme/*',
      'devextreme/animation/*',
      'devextreme/common/*',
      'devextreme/core/*',
      'devextreme/core/utils/*',
      'devextreme/common/data/*',
      'devextreme/common/data/odata/*',
      'devextreme/events/*',
      'devextreme/file_management/*',
      'devextreme/framework/*',
      'devextreme/integration/*',
      'devextreme/common/core/localization/*',
      'devextreme/common/core/localization/globalize/*',
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
      'devextreme-vue/common/*',
      'devextreme-vue/common/file_management/*',
      'devextreme-vue/common/data/*',
      'devextreme-vue/common/data/odata/*',
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
