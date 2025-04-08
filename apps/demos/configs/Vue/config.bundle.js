const bundleConfig = {
  bundles: {
    'devextreme.vue.systemjs.js': [
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
      'devextreme-vue/*',
      'devextreme-vue/core/*',
      'devextreme-vue/common/*',
      'devextreme-vue/common/core/*',
      'devextreme-vue/common/export/*',
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
