// In real applications, you should not transpile code in the browser.
// You can see how to create your own application with Angular and DevExtreme here:
// https://js.devexpress.com/Documentation/Guide/Angular_Components/Getting_Started/Create_a_DevExtreme_Application/

const componentNames = [
  'accordion',
  'action-sheet',
  'autocomplete',
  'bar-gauge',
  'box',
  'bullet',
  'button-group',
  'button',
  'calendar',
  'chart',
  'check-box',
  'circular-gauge',
  'color-box',
  'context-menu',
  'data-grid',
  'date-box',
  'date-range-box',
  'defer-rendering',
  'diagram',
  'draggable',
  'drawer',
  'drop-down-box',
  'drop-down-button',
  'file-manager',
  'file-uploader',
  'filter-builder',
  'form',
  'funnel',
  'gallery',
  'gantt',
  'html-editor',
  'linear-gauge',
  'list',
  'load-indicator',
  'load-panel',
  'lookup',
  'map',
  'menu',
  'multi-view',
  'nested',
  'number-box',
  'pie-chart',
  'pivot-grid-field-chooser',
  'pivot-grid',
  'polar-chart',
  'popover',
  'popup',
  'progress-bar',
  'radio-group',
  'range-selector',
  'range-slider',
  'recurrence-editor',
  'resizable',
  'responsive-box',
  'sankey',
  'scheduler',
  'scroll-view',
  'select-box',
  'slider',
  'sortable',
  'sparkline',
  'speed-dial-action',
  'splitter',
  'switch',
  'tab-panel',
  'tabs',
  'tag-box',
  'text-area',
  'text-box',
  'tile-view',
  'toast',
  'toolbar',
  'tooltip',
  'tree-list',
  'tree-map',
  'tree-view',
  'validation-group',
  'validation-summary',
  'validator',
  'vector-map',
];

window.exports = window.exports || {};
window.config = {
  transpiler: 'ts',
  typescriptOptions: {
    module: 'system',
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
  },
  meta: {
    'typescript': {
      'exports': 'ts',
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
    'devextreme/time_zone_utils.js': {
      'esModule': true,
    },
    'devextreme/localization.js': {
      'esModule': true,
    },
    'devextreme/viz/palette.js': {
      'esModule': true,
    },
    /** exceljs&file-saver */
    'exceljs': {
      'esModule': true,
    },
    /**/
  },
  paths: {
    'npm:': '../../../../../../node_modules/',
    'npm-demos:': '../../../../node_modules/',
    'bundles:': '../../../../bundles-ng/',
    'bundles-dx:': '../../../../bundles-dx/',
  },
  map: {
    'ts': 'npm:plugin-typescript/lib/plugin.js',
    'typescript': 'npm:typescript/lib/typescript.js',

    '@angular/compiler': 'bundles:@angular/compiler.umd.js',
    '@angular/platform-browser-dynamic': 'bundles:@angular/platform-browser-dynamic.umd.js',
    '@angular/core': 'bundles:@angular/core.umd.js',
    '@angular/core/primitives/signals': 'bundles:@angular/core.primitives.signals.umd.js',
    '@angular/common': 'bundles:@angular/common.umd.js',
    '@angular/common/http': 'bundles:@angular/common-http.umd.js',
    '@angular/platform-browser': 'bundles:@angular/platform-browser.umd.js',
    '@angular/platform-browser/animations': 'bundles:@angular/platform-browser.umd.js',
    '@angular/forms': 'bundles:@angular/forms.umd.js',

    'devextreme': 'npm:devextreme/cjs',
    'devextreme/bundles/dx.all': 'npm:devextreme/bundles/dx.all.js',
    'jszip': 'npm:jszip/dist/jszip.min.js',
    'devextreme-quill': 'npm:devextreme-quill/dist/dx-quill.min.js',
    'devexpress-diagram': 'npm:devexpress-diagram',
    'devexpress-gantt': 'npm:devexpress-gantt',

    'devextreme-angular': 'bundles-dx:devextreme-angular/devextreme-angular.js',
    'devextreme-angular/core': 'bundles-dx:devextreme-angular/devextreme-angular-core.js',
    ...componentNames.reduce((acc, name) => {
      acc[`devextreme-angular/ui/${name}`] = `bundles-dx:devextreme-angular/devextreme-angular-ui-${name}.js`;
      return acc;
    }, {}),

    '@devextreme/runtime': 'npm:@devextreme/runtime',

    'tslib': 'npm:tslib/tslib.js',
    'rxjs': 'npm:rxjs/dist/bundles/rxjs.umd.js',
    'rxjs/operators': 'npm:rxjs/dist/cjs/operators/index.js',

    /** signalr */
    '@aspnet/signalr': 'npm:@aspnet/signalr/dist/cjs/index.js',
    /**/

    /** devextreme-aspnet-data-nojquery */
    'devextreme-aspnet-data-nojquery': 'npm:devextreme-aspnet-data-nojquery/index.js',
    /**/

    /** showdown&turndown */
    'showdown': 'npm:showdown/dist/showdown.js',
    'turndown': 'npm:turndown/lib/turndown.browser.umd.js',
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

    /** vectormap */
    'devextreme-dist/js/vectormap-data': 'npm:devextreme-dist/js/vectormap-data',
    /**/

    'rrule': 'npm:rrule/dist/es5/rrule.js',
    'luxon': 'npm:luxon/build/global/luxon.min.js',
    'es6-object-assign': 'npm:es6-object-assign',

    'inferno': 'npm:inferno/dist/inferno.min.js',
    'inferno-compat': 'npm:inferno-compat/dist/inferno-compat.min.js',
    'inferno-create-element': 'npm:inferno-create-element/dist/inferno-create-element.min.js',
    'inferno-dom': 'npm:inferno-dom/dist/inferno-dom.min.js',
    'inferno-hydrate': 'npm:inferno-hydrate/dist/inferno-hydrate.min.js',
    'inferno-clone-vnode': 'npm:inferno-clone-vnode/dist/inferno-clone-vnode.min.js',
    'inferno-create-class': 'npm:inferno-create-class/dist/inferno-create-class.min.js',
    'inferno-extras': 'npm:inferno-extras/dist/inferno-extras.min.js',

    // Prettier
    'prettier/standalone': 'npm:prettier/standalone.js',
    'prettier/parser-html': 'npm:prettier/parser-html.js',
  },
  packages: {
    'app': {
      main: './app.component.ts',
      defaultExtension: 'ts',
    },
    'devextreme': {
      defaultExtension: 'js',
    },
    'devextreme/events/utils': {
      main: 'index',
    },
    'devextreme/events': {
      main: 'index',
    }/** globalize */,
    'globalize': {
      main: '../globalize.js',
      defaultExtension: 'js',
    },
    'cldr': {
      main: '../cldr.js',
      defaultExtension: 'js',
    }/**/,
    'es6-object-assign': {
      main: './index.js',
      defaultExtension: 'js',
    },
    'rxjs': {
      defaultExtension: 'js',
    },
    'rxjs/operators': {
      defaultExtension: 'js',
    },
  },
  packageConfigPaths: [
    'npm:@devextreme/*/package.json',
    'npm:@devextreme/runtime/inferno/package.json',
    'npm:rxjs/package.json',
    'npm:rxjs/operators/package.json',
    'npm:devexpress-diagram/package.json',
    'npm:devexpress-gantt/package.json',

    /** signalr */
    'npm:@aspnet/*/package.json',
    /**/
  ],
};

System.config(window.config);
System.import('@angular/compiler').catch(console.error.bind(console));
