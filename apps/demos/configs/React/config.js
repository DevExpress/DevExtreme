window.exports = window.exports || {};
window.config = {
  transpiler: 'ts',
  typescriptOptions: {
    module: 'system',
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    jsx: 'react',
  },
  meta: {
    'react': {
      'esModule': true,
    },
    'typescript': {
      'exports': 'ts',
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
  },
  paths: {
    'npm:': '../../../../../../node_modules/',
  },
  defaultExtension: 'js',
  map: {
    'ts': 'npm:plugin-typescript/lib/plugin.js',
    'typescript': 'npm:typescript/lib/typescript.js',
    'react': 'npm:react/cjs/react.development.js',
    'react-dom': 'npm:react-dom/cjs/react-dom.development.js',
    'prop-types': 'npm:prop-types/prop-types.js',

    /** signalr */
    '@aspnet/signalr': 'npm:@aspnet/signalr/dist/cjs',
    'tslib': 'npm:tslib/tslib.js',
    /**/

    /** devextreme-aspnet-data-nojquery */
    'devextreme-aspnet-data-nojquery': 'npm:devextreme-aspnet-data-nojquery/index.js',
    /**/

    /** showdown&turndown */
    'showdown': 'npm:showdown/dist/showdown.js',
    'turndown': 'npm:turndown/lib/turndown.browser.umd.js',
    /**/

    /** html-react-parser */
    'html-react-parser': 'npm:html-react-parser/dist/html-react-parser.min.js',
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
    'stackblur-canvas': 'npm:stackblur-canvas/dist/stackblur.min.js',
    'rgbcolor': 'npm:rgbcolor/index.js',
    'canvg': 'npm:canvg/dist/browser/canvg.min.js',
    /**/

    /** whatwg-fetch */
    'whatwg-fetch': 'npm:whatwg-fetch/fetch.js',
    /**/

    /** vectormap */
    'devextreme-dist/js/vectormap-data': 'npm:devextreme-dist/js/vectormap-data',
    /**/

    'rrule': 'npm:rrule/dist/es5/rrule.js',
    'luxon': 'npm:luxon/build/global/luxon.min.js',
    'es6-object-assign': 'npm:es6-object-assign',

    'devextreme': 'npm:devextreme/cjs',
    'devextreme-react': 'npm:devextreme-react/cjs',
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
    'devextreme-cldr-data': 'npm:devextreme-cldr-data',

    // SystemJS plugins
    'plugin-babel': 'npm:systemjs-plugin-babel/plugin-babel.js',
    'systemjs-babel-build': 'npm:systemjs-plugin-babel/systemjs-babel-browser.js',

    // Prettier
    'prettier/standalone': 'npm:prettier/standalone.js',
    'prettier/parser-html': 'npm:prettier/parser-html.js',
  },
  packages: {
    'devextreme': {
      defaultExtension: 'js',
    },
    'devextreme-react': {
      main: 'index.js',
    },
    'devextreme/events/utils': {
      main: 'index',
    },
    'devextreme/localization/messages': {
      format: 'json',
      defaultExtension: 'json',
    },
    'devextreme/events': {
      main: 'index',
    }/** globalize */,
    'devextreme-cldr-data': {
      format: 'json',
      defaultExtension: 'json',
    }/**//** globalize--vue&react */,
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
    react: true,
  },
};

System.config(window.config);
