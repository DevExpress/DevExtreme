window.exports = window.exports || {};
window.config = {
  transpiler: 'plugin-babel',
  meta: {
    '*.vue': {
      loader: 'vue-loader',
    },
    '*.ts': {
      loader: 'demo-ts-loader',
    },
    '*.svg': {
      loader: 'svg-loader',
    },
    'devextreme/time_zone_utils.js': {
      'esModule': true,
    },
    'devextreme/localization.js': {
      'esModule': true,
    },
    'devextreme/viz/palette.js': {
      'esModule': true,
    },
  },
  paths: {
    'root:': '../../../../',
    'npm:': '../../../../../../node_modules/',
  },
  map: {
    'vue': 'npm:vue/dist/vue.esm-browser.js',
    'vue-loader': 'npm:dx-systemjs-vue-browser/index.js',
    'demo-ts-loader': 'root:utils/demo-ts-loader.js',
    'svg-loader': 'root:utils/svg-loader.js',
    'mitt': 'npm:mitt/dist/mitt.umd.js',
    'rrule': 'npm:rrule/dist/es5/rrule.js',
    'luxon': 'npm:luxon/build/global/luxon.min.js',
    'es6-object-assign': 'npm:es6-object-assign',
    'devextreme': 'npm:devextreme/cjs',
    'devextreme-vue': 'npm:devextreme-vue/cjs',
    'jszip': 'npm:jszip/dist/jszip.min.js',
    'devextreme-quill': 'npm:devextreme-quill/dist/dx-quill.min.js',
    'devexpress-diagram': 'npm:devexpress-diagram/dist/dx-diagram.js',
    'devexpress-gantt': 'npm:devexpress-gantt/dist/dx-gantt.js',
    '@devextreme/runtime': 'npm:@devextreme/runtime',
    'inferno': 'npm:inferno/dist/inferno.min.js',
    'inferno-compat': 'npm:inferno-compat/dist/inferno-compat.min.js',
    'inferno-create-element': 'npm:inferno-create-element/dist/inferno-create-element.min.js',
    'inferno-dom': 'npm:inferno-dom/dist/inferno-dom.min.js',
    'inferno-hydrate': 'npm:inferno-hydrate/dist/inferno-hydrate.min.js',
    'inferno-clone-vnode': 'npm:inferno-clone-vnode/dist/inferno-clone-vnode.min.js',
    'inferno-create-class': 'npm:inferno-create-class/dist/inferno-create-class.min.js',
    'inferno-extras': 'npm:inferno-extras/dist/inferno-extras.min.js',
    'plugin-babel': 'npm:systemjs-plugin-babel/plugin-babel.js',
    'systemjs-babel-build': 'npm:systemjs-plugin-babel/systemjs-babel-browser.js',
    // Prettier
    'prettier/standalone': 'npm:prettier/standalone.js',
    'prettier/parser-html': 'npm:prettier/parser-html.js',
  },
  packages: {
    'devextreme-vue': {
      main: 'index.js',
    },
    'devextreme': {
      defaultExtension: 'js',
    },
    'devextreme/events/utils': {
      main: 'index',
    },
    'devextreme/events': {
      main: 'index',
    },
    'es6-object-assign': {
      main: './index.js',
      defaultExtension: 'js',
    },
  },
  packageConfigPaths: [
    'npm:@devextreme/*/package.json',
    'npm:@devextreme/runtime/inferno/package.json',
  ],
  babelOptions: {
    sourceMaps: false,
    stage0: true,
  },
};
System.config(window.config);
