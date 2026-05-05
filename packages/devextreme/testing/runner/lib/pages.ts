import {
  BaseRunProps, RunAllModel, RunSuiteModel, TemplateVars,
} from './types';

interface PagesRendererDeps {
  contentWithCacheBuster: (contentPath: string, cacheBuster: string) => string;
  getCacheBuster: (searchParams: URLSearchParams) => string;
  jsonString: (value: unknown) => string;
  renderTemplate: (templateName: string, vars?: TemplateVars) => string;
}

export interface PagesRenderer {
  renderIndexPage: () => string;
  renderRunAllPage: (model: RunAllModel, runProps: BaseRunProps) => string;
  renderRunSuitePage: (
    model: RunSuiteModel,
    runProps: BaseRunProps,
    searchParams: URLSearchParams,
  ) => string;
}

export function createPagesRenderer({
  contentWithCacheBuster,
  getCacheBuster,
  jsonString,
  renderTemplate,
}: PagesRendererDeps): PagesRenderer {
  function renderIndexPage(): string {
    return renderTemplate('index.template.html', {
      JQUERY_URL: '/packages/devextreme/artifacts/js/jquery.js',
      KNOCKOUT_URL: '/packages/devextreme/artifacts/js/knockout-latest.js',
      ROOT_URL_JSON: jsonString('/'),
      SUITES_JSON_URL_JSON: jsonString('/Main/SuitesJson'),
      CATEGORIES_JSON_URL_JSON: jsonString('/Main/CategoriesJson'),
    });
  }

  function renderRunAllPage(model: RunAllModel, runProps: BaseRunProps): string {
    return renderTemplate('run-all.template.html', {
      JQUERY_URL: '/packages/devextreme/artifacts/js/jquery.js',
      CONSTELLATION_JSON: jsonString(model.Constellation),
      CATEGORIES_LIST_JSON: jsonString(model.CategoriesList),
      VERSION_JSON: jsonString(model.Version),
      SUITES_JSON: jsonString(model.Suites),
      NO_TRY_CATCH_JSON: jsonString(runProps.NoTryCatch),
      NO_GLOBALS_JSON: jsonString(runProps.NoGlobals),
      NO_TIMERS_JSON: jsonString(runProps.NoTimers),
      NO_JQUERY_JSON: jsonString(runProps.NoJQuery),
      SHADOW_DOM_JSON: jsonString(runProps.ShadowDom),
      NO_CSP_JSON: jsonString(runProps.NoCsp),
      IS_CONTINUOUS_INTEGRATION_JSON: jsonString(runProps.IsContinuousIntegration),
      WORKER_IN_WINDOW_JSON: jsonString(runProps.WorkerInWindow),
      MAX_WORKERS_JSON: jsonString(runProps.MaxWorkers),
    });
  }

  function renderRunSuitePage(
    model: RunSuiteModel,
    runProps: BaseRunProps,
    searchParams: URLSearchParams,
  ): string {
    const scriptVirtualPath = model.ScriptVirtualPath;
    const isNoJQueryTest = scriptVirtualPath.includes('nojquery');
    const isServerSideTest = scriptVirtualPath.includes('DevExpress.serverSide');
    const isSelfSufficientTest = scriptVirtualPath.includes('_bundled')
            || scriptVirtualPath.includes('Bundles')
            || scriptVirtualPath.includes('DevExpress.jquery');

    const cspPart = runProps.NoCsp ? '' : '-systemjs';
    const npmModule = `transpiled${cspPart}`;
    const testingBasePath = runProps.NoCsp
      ? '/packages/devextreme/testing/'
      : '/packages/devextreme/artifacts/transpiled-testing/';

    function getJQueryUrl(): string {
      if (isNoJQueryTest) {
        return `${testingBasePath}helpers/noJQuery.js`;
      }

      return '/packages/devextreme/artifacts/js/jquery.js';
    }

    function getTestUrl(): string {
      if (runProps.NoCsp) {
        return scriptVirtualPath;
      }

      return scriptVirtualPath.replace('/testing/', '/artifacts/transpiled-testing/');
    }

    function getJQueryIntegrationImports(): string[] {
      const result: string[] = [];

      if (!isSelfSufficientTest) {
        if (runProps.NoJQuery || isNoJQueryTest || isServerSideTest) {
          result.push(`${testingBasePath}helpers/jQueryEventsPatch.js`);
          result.push(`${testingBasePath}helpers/argumentsValidator.js`);
          result.push(`${testingBasePath}helpers/dataPatch.js`);
          result.push(`/packages/devextreme/artifacts/${npmModule}/__internal/integration/jquery/component_registrator.js`);
        } else {
          result.push(`/packages/devextreme/artifacts/${npmModule}/integration/jquery.js`);
        }
      }

      if (isServerSideTest) {
        result.push(`${testingBasePath}helpers/ssrEmulator.js`);
      }

      return result;
    }

    const cacheBuster = getCacheBuster(searchParams);

    const qunitCss = contentWithCacheBuster('/packages/devextreme/node_modules/qunit/qunit/qunit.css', cacheBuster);
    const qunitJs = contentWithCacheBuster('/packages/devextreme/node_modules/qunit/qunit/qunit.js', cacheBuster);
    const qunitExtensionsJs = contentWithCacheBuster('/packages/devextreme/testing/helpers/qunitExtensions.js', cacheBuster);
    const jqueryJs = contentWithCacheBuster('/packages/devextreme/node_modules/jquery/dist/jquery.js', cacheBuster);
    const sinonJs = contentWithCacheBuster('/packages/devextreme/node_modules/sinon/pkg/sinon.js', cacheBuster);
    const systemJs = contentWithCacheBuster(
      runProps.NoCsp
        ? '/packages/devextreme/node_modules/systemjs/dist/system.js'
        : '/packages/devextreme/node_modules/systemjs/dist/system-csp-production.js',
      cacheBuster,
    );

    const cspMap: Record<string, string> = !runProps.NoCsp
      ? {
        'inferno-create-element': '/packages/devextreme/node_modules/inferno-create-element/dist/inferno-create-element.js',
        intl: '/packages/devextreme/artifacts/js-systemjs/intl/index.js',
        knockout: '/packages/devextreme/artifacts/js-systemjs/knockout.js',
        css: '/packages/devextreme/artifacts/js-systemjs/css.js',
        'generic_light.css': '/packages/devextreme/artifacts/css-systemjs/dx.light.css',
        'material_blue_light.css': '/packages/devextreme/artifacts/css-systemjs/dx.material.blue.light.css',
        'fluent_blue_light.css': '/packages/devextreme/artifacts/css-systemjs/dx.fluent.blue.light.css',
        'gantt.css': '/packages/devextreme/artifacts/css-systemjs/dx-gantt.css',
        'devextreme-cldr-data': '/packages/devextreme/artifacts/js-systemjs/devextreme-cldr-data',
        'cldr-core': '/packages/devextreme/artifacts/js-systemjs/cldr-core',
        json: '/packages/devextreme/artifacts/js-systemjs/json.js',
        '@preact/signals-core': '/packages/devextreme/artifacts/js-systemjs/preact-signals.js',
      }
      : {
        'devextreme-cldr-data': '/packages/devextreme/node_modules/devextreme-cldr-data',
        'cldr-core': '/packages/devextreme/node_modules/cldr-core',
        '@preact/signals-core': '/packages/devextreme/node_modules/@preact/signals-core/dist/signals-core.js',
      };

    const systemMap: Record<string, string> = {
      globalize: '/packages/devextreme/node_modules/globalize/dist/globalize',
      intl: '/packages/devextreme/node_modules/intl/index.js',
      cldr: '/packages/devextreme/node_modules/cldrjs/dist/cldr',
      jquery: getJQueryUrl(),
      knockout: '/packages/devextreme/node_modules/knockout/build/output/knockout-latest.debug.js',
      jszip: '/packages/devextreme/artifacts/js/jszip.js',
      underscore: '/packages/devextreme/node_modules/underscore/underscore-min.js',
      '@@devextreme/vdom': '/packages/devextreme/node_modules/@devextreme/vdom',
      'devextreme-quill': '/packages/devextreme/node_modules/devextreme-quill/dist/dx-quill.js',
      'devexpress-diagram': '/packages/devextreme/artifacts/js/dx-diagram.js',
      'devexpress-gantt': '/packages/devextreme/artifacts/js/dx-gantt.js',
      'devextreme-exceljs-fork': '/packages/devextreme/node_modules/devextreme-exceljs-fork/dist/dx-exceljs-fork.js',
      // eslint-disable-next-line @stylistic/quote-props
      'fflate': '/packages/devextreme/node_modules/fflate/esm/browser.js',
      jspdf: '/packages/devextreme/node_modules/jspdf/dist/jspdf.umd.js',
      'jspdf-autotable': '/packages/devextreme/node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.js',
      rrule: '/packages/devextreme/node_modules/rrule/dist/es5/rrule.js',
      inferno: '/packages/devextreme/node_modules/inferno/dist/inferno.js',
      'inferno-hydrate': '/packages/devextreme/node_modules/inferno-hydrate/dist/inferno-hydrate.js',
      'inferno-compat': '/packages/devextreme/node_modules/inferno-compat/dist/inferno-compat.js',
      'inferno-clone-vnode': '/packages/devextreme/node_modules/inferno-clone-vnode/dist/index.cjs.js',
      'inferno-create-element': '/packages/devextreme/node_modules/inferno-create-element/dist/index.cjs.js',
      'inferno-create-class': '/packages/devextreme/node_modules/inferno-create-class/dist/index.cjs.js',
      'inferno-extras': '/packages/devextreme/node_modules/inferno-extras/dist/index.cjs.js',
      'generic_light.css': '/packages/devextreme/artifacts/css/dx.light.css',
      'material_blue_light.css': '/packages/devextreme/artifacts/css/dx.material.blue.light.css',
      'fluent_blue_light.css': '/packages/devextreme/artifacts/css/dx.fluent.blue.light.css',
      'gantt.css': '/packages/devextreme/artifacts/css/dx-gantt.css',
      css: '/packages/devextreme/node_modules/systemjs-plugin-css/css.js',
      text: '/packages/devextreme/node_modules/systemjs-plugin-text/text.js',
      json: '/packages/devextreme/node_modules/systemjs-plugin-json/json.js',
      'plugin-babel': '/packages/devextreme/node_modules/systemjs-plugin-babel/plugin-babel.js',
      'systemjs-babel-build': '/packages/devextreme/node_modules/systemjs-plugin-babel/systemjs-babel-browser.js',
      // eslint-disable-next-line spellcheck/spell-checker
      zod: '/packages/devextreme/node_modules/zod/lib',
      'zod-to-json-schema': '/packages/devextreme/node_modules/zod-to-json-schema/dist/cjs',
      ...cspMap,
    };

    const systemPackages: Record<string, {
      defaultExtension?: string;
      main?: string;
      format?: string;
    }> = {
      '': {
        defaultExtension: 'js',
      },
      globalize: {
        main: '../globalize.js',
        defaultExtension: 'js',
      },
      cldr: {
        main: '../cldr.js',
        defaultExtension: 'js',
      },
      'common/core/events/utils': {
        main: 'index',
      },
      'events/utils': {
        main: 'index',
      },
      events: {
        main: 'index',
      },
      // eslint-disable-next-line spellcheck/spell-checker
      zod: {
        main: 'index.js',
        defaultExtension: 'js',
        format: 'cjs',
      },
      'zod-to-json-schema': {
        main: 'index.js',
        defaultExtension: 'js',
        format: 'cjs',
      },
    };

    const knockoutPath = '/packages/devextreme/node_modules/knockout/build/output/knockout-latest.debug.js';

    const systemConfig = {
      baseURL: `/packages/devextreme/artifacts/${npmModule}`,
      transpiler: 'plugin-babel',
      map: systemMap,
      packages: systemPackages,
      packageConfigPaths: [
        '@@devextreme/*/package.json',
      ],
      meta: {
        [knockoutPath]: {
          format: 'global',
          deps: ['jquery'],
          exports: 'ko',
        },
        '/packages/devextreme/node_modules/zod/lib/*.js': {
          format: 'cjs',
        },
        '/packages/devextreme/node_modules/zod-to-json-schema/dist/cjs/*.js': {
          format: 'cjs',
        },
        '*.js': {
          babelOptions: {
            es2015: false,
          },
        },
      },
    };

    const integrationImportPaths = getJQueryIntegrationImports();
    const cspMetaTag = runProps.NoCsp
      ? ''
      : `<meta
            http-equiv="Content-Security-Policy"
            content="
                default-src 'self';
                script-src 'self' 'nonce-M5H5tE' 'nonce-TEiwcJ' 'nonce-IpCks6' 'nonce-Z27qXj' 'nonce-wIkO6u';
                style-src 'self' about: https://fonts.googleapis.com 'nonce-tYGMxb' 'nonce-qunit-test' 'nonce-qunit-extension';
                img-src 'self' data:;
                font-src 'self' https://fonts.gstatic.com;
                connect-src 'self' https://js.devexpress.com;
            "
        />`;

    return renderTemplate('run-suite.template.html', {
      CSP_META_TAG: cspMetaTag,
      TITLE: model.Title,
      QUNIT_CSS_URL: qunitCss,
      QUNIT_JS_URL: qunitJs,
      QUNIT_EXTENSIONS_JS_URL: qunitExtensionsJs,
      JQUERY_JS_URL: jqueryJs,
      SINON_JS_URL: sinonJs,
      SYSTEM_JS_URL: systemJs,
      IS_CONTINUOUS_INTEGRATION_JSON: jsonString(runProps.IsContinuousIntegration),
      CACHE_BUSTER_JSON: jsonString(cacheBuster),
      SYSTEM_CONFIG_JSON: jsonString(systemConfig),
      INTEGRATION_IMPORT_PATHS_JSON: jsonString(integrationImportPaths),
      IS_SERVER_SIDE_TEST_JSON: jsonString(isServerSideTest),
      TEST_URL_JSON: jsonString(getTestUrl()),
    });
  }

  return {
    renderIndexPage,
    renderRunAllPage,
    renderRunSuitePage,
  };
}
