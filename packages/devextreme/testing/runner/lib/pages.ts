import * as fs from 'node:fs';
import * as path from 'node:path';

import {
  BaseRunProps, RunAllModel, RunSuiteModel, TemplateVars,
} from './types';
import {
  buildQunitImportMap,
  collectPluginSpecifiersFromSuiteTree,
  getEsmModuleRoot,
} from './importMap';

interface PagesRendererDeps {
  contentWithCacheBuster: (contentPath: string, cacheBuster: string) => string;
  getCacheBuster: (searchParams: URLSearchParams) => string;
  jsonString: (value: unknown) => string;
  packageRoot: string;
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

const ESM_NPM = 'transpiled-esm-npm/esm';
const TESTING_BASE = '/packages/devextreme/testing/';

export function createPagesRenderer({
  contentWithCacheBuster,
  getCacheBuster,
  jsonString,
  packageRoot,
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

    const esmRootPath = path.join(packageRoot, 'artifacts', 'transpiled-esm-npm', 'esm');
    const esmReady = fs.existsSync(path.join(esmRootPath, 'integration', 'jquery.js'));

    if (!esmReady) {
      return `<!DOCTYPE html><html><head><title>ESM artifacts missing</title></head><body>
<h1>QUnit ESM loader: artifacts missing</h1>
<p><code>artifacts/transpiled-esm-npm/esm</code> is not built.</p>
<p><code>pnpm run dev</code> / <code>build:dev</code> should build ESM via <code>build:transpile -c ci</code>.</p>
<p>If artifacts were cleaned manually, rebuild:</p>
<pre>pnpm nx run devextreme:build:qunit-esm</pre>
<p>Then reload the suite.</p>
</body></html>`;
    }

    function getJQueryUrl(): string {
      if (isNoJQueryTest) {
        return `${TESTING_BASE}helpers/noJQuery.js`;
      }

      return '/packages/devextreme/artifacts/js/jquery.js';
    }

    function getJQueryIntegrationImports(): string[] {
      const result: string[] = [];

      if (!isSelfSufficientTest) {
        if (runProps.NoJQuery || isNoJQueryTest || isServerSideTest) {
          result.push(`${TESTING_BASE}helpers/jQueryEventsPatch.js`);
          result.push(`${TESTING_BASE}helpers/argumentsValidator.js`);
          result.push(`${TESTING_BASE}helpers/dataPatch.js`);
          result.push(`/packages/devextreme/artifacts/${ESM_NPM}/__internal/integration/jquery/component_registrator.js`);
        } else {
          result.push(`/packages/devextreme/artifacts/${ESM_NPM}/integration/jquery.js`);
        }
      }

      if (isServerSideTest) {
        result.push(`${TESTING_BASE}helpers/ssrEmulator.js`);
      }

      return result;
    }

    const cacheBuster = getCacheBuster(searchParams);

    const qunitCss = contentWithCacheBuster('/packages/devextreme/node_modules/qunit/qunit/qunit.css', cacheBuster);
    const qunitJs = contentWithCacheBuster('/packages/devextreme/node_modules/qunit/qunit/qunit.js', cacheBuster);
    const qunitExtensionsJs = contentWithCacheBuster('/packages/devextreme/testing/helpers/qunitExtensions.js', cacheBuster);
    const jqueryJs = contentWithCacheBuster('/packages/devextreme/node_modules/jquery/dist/jquery.js', cacheBuster);
    const knockoutJs = contentWithCacheBuster('/packages/devextreme/node_modules/knockout/build/output/knockout-latest.debug.js', cacheBuster);
    const sinonJs = contentWithCacheBuster('/packages/devextreme/node_modules/sinon/pkg/sinon.js', cacheBuster);

    const suiteFilePath = path.join(
      packageRoot,
      scriptVirtualPath.replace(/^\/packages\/devextreme\//, ''),
    );

    const importMap = buildQunitImportMap({
      jqueryUrl: getJQueryUrl(),
      cacheBuster,
      suiteFilePath,
    });

    // Preload theme CSS before the suite graph evaluates. Scheduler (and others)
    // call getThemeType() at module scope; sibling ESM imports run in parallel,
    // so without this CSS may not be in the DOM yet and isMaterialBased freezes
    // as false.
    const themeCssImportPaths = fs.existsSync(suiteFilePath)
      ? collectPluginSpecifiersFromSuiteTree(suiteFilePath)
        .filter((specifier) => /\.css!(?:css)?$/.test(specifier))
      : [];

    const importMapScript = `<script type="importmap" nonce="wIkO6u">\n${JSON.stringify(importMap)}\n</script>`;

    // Restore CSP for default runs; `?nocsp` keeps the meta off for suites
    // that branch on QUnit.urlParams['nocsp'] (Knockout, aspnet, …).
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
      KNOCKOUT_JS_URL: knockoutJs,
      SINON_JS_URL: sinonJs,
      IMPORT_MAP_SCRIPT: importMapScript,
      ESM_MODULE_ROOT_JSON: jsonString(getEsmModuleRoot()),
      IS_CONTINUOUS_INTEGRATION_JSON: jsonString(runProps.IsContinuousIntegration),
      CACHE_BUSTER_JSON: jsonString(cacheBuster),
      INTEGRATION_IMPORT_PATHS_JSON: jsonString(getJQueryIntegrationImports()),
      THEME_CSS_IMPORT_PATHS_JSON: jsonString(themeCssImportPaths),
      IS_SERVER_SIDE_TEST_JSON: jsonString(isServerSideTest),
      TEST_URL_JSON: jsonString(scriptVirtualPath),
    });
  }

  return {
    renderIndexPage,
    renderRunAllPage,
    renderRunSuitePage,
  };
}
