System.config({
  transpiler: 'plugin-babel',
  meta: {
    /** devextreme-aspnet-data-nojquery */
    'devextreme-aspnet-data-nojquery': {
      'esModule': true
    },
    /**/

    /** vectormap */
    'devextreme/dist/js/vectormap-data/*': {
      'esModule': true
    },
    /**/
},
  paths: {
    'npm:': '../../../../../node_modules/'
  },
  defaultExtension: 'js',
  map: {
    'react': 'npm:react/umd/react.development.js',
    'react-dom': 'npm:react-dom/umd/react-dom.development.js',
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
    'exceljs': 'npm:exceljs/dist/exceljs.js',
    'file-saver': 'npm:file-saver/FileSaver.js',
    /**/

    /** jspdf&jspdf-autotable */
    'jspdf': 'npm:jspdf/dist/jspdf.es.min.js',
    'jspdf-autotable': 'npm:jspdf-autotable/dist/jspdf.plugin.autotable.min.js',
    /**/

    /** devextreme-intl */
    'devextreme-intl': 'npm:devextreme-intl',
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
    'devextreme/dist/js/vectormap-data': 'npm:devextreme/dist/js/vectormap-data',
    /**/

    'rrule': 'npm:rrule/dist/es5/rrule.js',
    'luxon': 'npm:luxon/build/global/luxon.min.js',
    'es6-object-assign': 'npm:es6-object-assign',

    'devextreme': 'npm:devextreme',
    'devextreme-react': 'npm:devextreme-react',
    'jszip': 'npm:jszip/dist/jszip.min.js',
    'devextreme-quill': 'npm:devextreme-quill/dist/dx-quill.min.js',
    'devexpress-diagram': 'npm:devexpress-diagram/dist/dx-diagram.js',
    'devexpress-gantt': 'npm:devexpress-gantt/dist/dx-gantt.js',
    'preact': 'npm:preact/dist/preact.js',
    'preact/hooks': 'npm:preact/hooks/dist/hooks.js',

    // SystemJS plugins
    'plugin-babel': 'npm:systemjs-plugin-babel/plugin-babel.js',
    'systemjs-babel-build': 'npm:systemjs-plugin-babel/systemjs-babel-browser.js'
  },
  packages: {
    'devextreme': {
      defaultExtension: 'js'
    },
    'devextreme-react': {
      main: 'index.js'
    },
    'devextreme/events/utils': {
      main: 'index'
    },
    'devextreme/events': {
      main: 'index'
    }/** globalize--vue&react */,
    'globalize': {
      main: '../globalize.js',
      defaultExtension: 'js'
    },
    'cldr': {
      main: '../cldr.js',
      defaultExtension: 'js'
    }/**//** globalize */,
    'globalize': {
      main: '../globalize.js',
      defaultExtension: 'js'
    },
    'cldr': {
      main: '../cldr.js',
      defaultExtension: 'js'
    }/**//**signalr */,
    '@aspnet/signalr': {
      main: 'index.js',
      defaultExtension: 'js'
    }/**/,
    'es6-object-assign': {
      main: './index.js',
      defaultExtension: 'js'
    }
  },
  babelOptions: {
    sourceMaps: false,
    stage0: true,
    react: true
  }
});
