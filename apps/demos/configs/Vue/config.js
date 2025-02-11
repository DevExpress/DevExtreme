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
    /** devextreme-aspnet-data-nojquery */
    'devextreme-aspnet-data-nojquery': {
      'esModule': true,
    },
    /**/
    /** vectormap */
    'devextreme-dist/js/vectormap-data/*': {
      'esModule': true,
    },
    /**/
    /** exceljs&file-saver */
    'exceljs': {
      'esModule': true,
    },
    /**/
    'openai': {
      'esModule': true,
    },
  },
  paths: {
    'project:': '../../../../',
    'npm:': '../../../../node_modules/',
    'bundles:': '../../../../bundles/',
    'externals:': '../../../../bundles/externals/',
  },
  map: {
    'vue': 'npm:vue/dist/vue.esm-browser.js',
    '@vue/shared': 'npm:@vue/shared/dist/shared.cjs.prod.js',
    'vue-loader': 'npm:dx-systemjs-vue-browser/index.js',
    'demo-ts-loader': 'project:utils/demo-ts-loader.js',
    'jszip': 'npm:jszip/dist/jszip.min.js',
    'svg-loader': 'project:utils/svg-loader.js',

    /** signalr */
    '@aspnet/signalr': 'npm:@aspnet/signalr/dist/cjs',
    'tslib': 'npm:tslib/tslib.js',
    /**/

    /** devextreme-aspnet-data-nojquery */
    'devextreme-aspnet-data-nojquery': 'npm:devextreme-aspnet-data-nojquery/index.js',
    /**/

    /** globalize--vue&react */
    'globalize': 'npm:globalize/dist/globalize',
    'json': 'npm:systemjs-plugin-json/json.js',
    'cldr': 'npm:cldrjs/dist/cldr',
    /**/

    /** globalize */
    'globalize': 'npm:globalize/dist/globalize',
    'json': 'npm:systemjs-plugin-json/json.js',
    'cldr': 'npm:cldrjs/dist/cldr',
    /**/

    /** exceljs&file-saver */
    'exceljs': 'npm:exceljs/dist/exceljs.min.js',
    'file-saver-es': 'npm:file-saver-es/dist/FileSaver.min.js',
    /**/

    /** jspdf */
    'fflate': 'npm:fflate/esm/browser.js',
    'jspdf': 'npm:jspdf/dist/jspdf.umd.min.js',
    /**/

    /** jspdf&jspdf-autotable */
    'fflate': 'npm:fflate/esm/browser.js',
    'jspdf': 'npm:jspdf/dist/jspdf.umd.min.js',
    'jspdf-autotable': 'npm:jspdf-autotable/dist/jspdf.plugin.autotable.min.js',
    /**/

    /** devextreme-intl */
    'json': 'npm:systemjs-plugin-json/json.js',
    /**/

    /** canvg */
    'canvg': 'externals:canvg.bundle.js',
    /**/

    /** whatwg-fetch */
    'whatwg-fetch': 'npm:whatwg-fetch/fetch.js',
    /**/

    /** vectormap */
    'devextreme-dist/js/vectormap-data': 'npm:devextreme-dist/js/vectormap-data',
    /**/

    'mitt': 'npm:mitt/dist/mitt.umd.js',

    /** vuex */
    'vuex': 'npm:vuex/dist/vuex.esm-browser.js',
    /**/

    'rrule': 'npm:rrule/dist/es5/rrule.js',
    'luxon': 'npm:luxon/build/global/luxon.min.js',
    'es6-object-assign': 'npm:es6-object-assign',

    'devextreme': 'npm:devextreme/cjs',
    'devextreme-vue': 'npm:devextreme-vue/cjs',

    /** unified */
    'unified': 'externals:unified/unified.bundle.js',
    'remark-parse': 'externals:unified/remark-parse.bundle.js',
    'remark-rehype': 'externals:unified/remark-rehype.bundle.js',
    'remark-stringify': 'externals:unified/remark-stringify.bundle.js',
    'rehype-parse': 'externals:unified/rehype-parse.bundle.js',
    'rehype-remark': 'externals:unified/rehype-remark.bundle.js',
    'rehype-stringify': 'externals:unified/rehype-stringify.bundle.js',
    'rehype-minify-whitespace': 'externals:unified/rehype-minify-whitespace.bundle.js',
    /**/

    /** openai */
    'openai': 'externals:openai.bundle.js',
    /**/

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
    }/** globalize--vue&react */,
    'globalize': {
      main: '../globalize.js',
      defaultExtension: 'js',
    },
    'cldr': {
      main: '../cldr.js',
      defaultExtension: 'js',
    }/**//** globalize */,
    'globalize': {
      main: '../globalize.js',
      defaultExtension: 'js',
    },
    'cldr': {
      main: '../cldr.js',
      defaultExtension: 'js',
    }/**//** signalr */,
    '@aspnet/signalr': {
      main: 'index.js',
      defaultExtension: 'js',
    }/**/,
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
