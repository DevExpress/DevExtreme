#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { spawn, spawnSync } = require('child_process');

const KNOWN_CONSTELLATIONS = new Set(['export', 'misc', 'ui', 'ui.widgets', 'ui.editors', 'ui.grid', 'ui.scheduler']);

const PACKAGE_ROOT = path.resolve(__dirname, '../..');
const REPO_ROOT = path.resolve(PACKAGE_ROOT, '../..');
const TESTING_ROOT = path.join(PACKAGE_ROOT, 'testing');
const TESTS_ROOT = path.join(TESTING_ROOT, 'tests');
const VECTOR_DATA_DIRECTORY = path.join(TESTING_ROOT, 'content', 'VectorMapData');
const TEMPLATES_ROOT = path.join(__dirname, 'templates');

const COMPLETED_SUITES_FILENAME = path.join(TESTING_ROOT, 'CompletedSuites.txt');
const LAST_SUITE_TIME_FILENAME = path.join(TESTING_ROOT, 'LastSuiteTime.txt');
const RESULTS_XML_FILENAME = path.join(TESTING_ROOT, 'Results.xml');
const MISC_ERRORS_FILENAME = path.join(TESTING_ROOT, 'MiscErrors.log');
const RAW_LOG_FILENAME = path.join(TESTING_ROOT, 'RawLog.txt');

const RUN_FLAGS = {
    singleRun: process.argv.includes('--single-run'),
    isContinuousIntegration: isContinuousIntegration(),
};

const PORTS = loadPorts(path.join(PACKAGE_ROOT, 'ports.json'));
const QUNIT_PORT = Number(PORTS.qunit);
const VECTOR_MAP_TESTER_PORT = Number(PORTS['vectormap-utils-tester']);

const PATH_TO_NODE = resolveNodePath();

const logger = createRawLogger(RAW_LOG_FILENAME);
const TEMPLATE_CACHE = new Map();

const vectorMapNodeServer = {
    process: null,
    refs: 0,
    killTimer: null,
};

start();

function start() {
    const server = http.createServer((req, res) => {
        handleRequest(req, res).catch((error) => {
            writeError(error && error.stack ? error.stack : String(error));
            if(!res.headersSent) {
                setNoCacheHeaders(res);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            }
            if(!res.writableEnded) {
                res.end('Internal Server Error');
            }
        });
    });

    server.listen(QUNIT_PORT, '0.0.0.0', () => {
        writeLine(`QUnit runner server listens on http://0.0.0.0:${QUNIT_PORT}...`);
    });
}

async function handleRequest(req, res) {
    const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = safeDecodeURIComponent(requestUrl.pathname);
    const pathnameLower = pathname.toLowerCase();

    if(req.method === 'GET' && (pathname === '/' || pathnameLower === '/main/index')) {
        return sendHtml(res, renderIndexPage());
    }

    if(req.method === 'GET') {
        const suitesJsonMatch = pathname.match(/^\/Main\/SuitesJson(?:\/(.+))?$/i);
        if(suitesJsonMatch) {
            const id = suitesJsonMatch[1]
                ? safeDecodeURIComponent(suitesJsonMatch[1])
                : requestUrl.searchParams.get('id');
            const suites = readSuites(id || '');
            return sendJson(res, suites);
        }
    }

    if(req.method === 'GET' && pathnameLower === '/main/categoriesjson') {
        return sendJson(res, readCategories());
    }

    if((req.method === 'GET' || req.method === 'HEAD')
        && (pathnameLower === '/run' || pathnameLower === '/run/' || pathnameLower === '/main/runall')) {
        if(req.method === 'HEAD') {
            setNoCacheHeaders(res);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end();
            return;
        }

        const model = buildRunAllModel(requestUrl.searchParams);
        const runProps = assignBaseRunProps(requestUrl.searchParams);
        return sendHtml(res, renderRunAllPage(model, runProps));
    }

    if(req.method === 'GET') {
        const runSuiteMatch = pathname.match(/^\/run\/([^/]+)\/(.+\.js)$/i);
        if(runSuiteMatch) {
            const catName = safeDecodeURIComponent(runSuiteMatch[1]);
            const suiteName = safeDecodeURIComponent(runSuiteMatch[2]);
            const model = buildRunSuiteModel(catName, suiteName);
            const runProps = assignBaseRunProps(requestUrl.searchParams);
            return sendHtml(res, renderRunSuitePage(model, runProps, requestUrl.searchParams));
        }
    }

    if(req.method === 'GET' && pathnameLower === '/main/runsuite') {
        const catName = requestUrl.searchParams.get('catName') || '';
        const suiteName = requestUrl.searchParams.get('suiteName') || '';

        if(!catName || !suiteName) {
            return sendNotFound(res);
        }

        const model = buildRunSuiteModel(catName, suiteName);
        const runProps = assignBaseRunProps(requestUrl.searchParams);
        return sendHtml(res, renderRunSuitePage(model, runProps, requestUrl.searchParams));
    }

    if(req.method === 'POST' && pathnameLower === '/main/notifyteststarted') {
        const form = await readFormBody(req);
        const name = String(form.name || '');

        try {
            writeLine(`       [ run] ${name}`);
        } catch(_) {
            // Ignore logging errors.
        }

        return sendText(res, 'OK');
    }

    if(req.method === 'POST' && pathnameLower === '/main/notifytestcompleted') {
        const form = await readFormBody(req);
        const name = String(form.name || '');
        const passed = parseBoolean(form.passed);

        try {
            writeLine(`       [${passed ? '  ok' : 'fail'}] ${name}`);
        } catch(_) {
            // Ignore logging errors.
        }

        return sendText(res, 'OK');
    }

    if(req.method === 'POST' && pathnameLower === '/main/notifysuitefinalized') {
        const form = await readFormBody(req);
        const name = String(form.name || '');
        const passed = parseBoolean(form.passed);
        const runtime = parseNumber(form.runtime);

        try {
            if(passed && RUN_FLAGS.isContinuousIntegration) {
                fs.appendFileSync(COMPLETED_SUITES_FILENAME, `${name}${os.EOL}`);
            }

            if(RUN_FLAGS.isContinuousIntegration) {
                writeLastSuiteTime();
            }

            write(passed ? '[ OK ' : '[FAIL', passed ? 'green' : 'red');
            const seconds = Number((runtime / 1000).toFixed(3));
            writeLine(`] ${name} in ${seconds}s`);
        } catch(_) {
            // Preserve legacy behavior: swallow errors.
        }

        return sendText(res, 'OK');
    }

    if(req.method === 'POST' && pathnameLower === '/main/notifyisalive') {
        try {
            if(RUN_FLAGS.isContinuousIntegration) {
                writeLastSuiteTime();
            }
        } catch(_) {
            // Preserve legacy behavior: swallow errors.
        }

        return sendText(res, 'OK');
    }

    if(req.method === 'POST' && pathnameLower === '/main/saveresults') {
        return saveResults(req, res);
    }

    if(req.method === 'GET' && pathnameLower === '/main/displayresults') {
        const stylesheetUrl = '/packages/devextreme/testing/content/unittests.xsl';
        const xml = [
            '<?xml version="1.0"?>',
            `<?xml-stylesheet type="text/xsl" href="${stylesheetUrl}"?>`,
            '<cruisecontrol>',
            safeReadFile(RESULTS_XML_FILENAME),
            '</cruisecontrol>',
            '',
        ].join('\n');

        return sendXml(res, xml);
    }

    if(req.method === 'POST' && pathnameLower === '/main/logmiscerror') {
        const form = await readFormBody(req);
        const message = String(form.msg || '');
        logMiscErrorCore(message);
        return sendText(res, 'OK');
    }

    if(req.method === 'GET' && pathnameLower === '/themes-test/get-css-files-list') {
        const list = readThemeCssFiles();
        return sendJson(res, list);
    }

    if(req.method === 'GET' && pathnameLower === '/testvectormapdata/gettestdata') {
        const data = readVectorMapTestData();
        return sendJson(res, data);
    }

    if(req.method === 'GET') {
        const parseBufferMatch = pathname.match(/^\/TestVectorMapData\/ParseBuffer\/(.+)$/i);
        if(parseBufferMatch) {
            const id = safeDecodeURIComponent(parseBufferMatch[1]);
            const responseText = await redirectRequestToVectorMapNodeServer('parse-buffer', id);
            return sendJsonText(res, responseText);
        }
    }

    if(req.method === 'GET') {
        const readAndParseMatch = pathname.match(/^\/TestVectorMapData\/ReadAndParse\/(.+)$/i);
        if(readAndParseMatch) {
            const id = safeDecodeURIComponent(readAndParseMatch[1]);
            const responseText = await redirectRequestToVectorMapNodeServer('read-and-parse', id);
            return sendJsonText(res, responseText);
        }
    }

    if(req.method === 'GET') {
        const executeConsoleAppMatch = pathname.match(/^\/TestVectorMapData\/ExecuteConsoleApp(?:\/(.*))?$/i);
        if(executeConsoleAppMatch) {
            const arg = safeDecodeURIComponent(executeConsoleAppMatch[1] || '');
            const result = executeVectorMapConsoleApp(arg, requestUrl.searchParams);
            return sendJson(res, result);
        }
    }

    if(await tryServeStatic(req, res, pathname, requestUrl.searchParams)) {
        return;
    }

    return sendNotFound(res);
}

function buildRunSuiteModel(catName, suiteName) {
    return {
        Title: suiteName,
        ScriptVirtualPath: getSuiteVirtualPath(catName, suiteName),
    };
}

function buildRunAllModel(searchParams) {
    let includeSet = null;
    let excludeSet = null;
    let excludeSuites = null;
    let partIndex = 0;
    let partCount = 1;

    let constellation = searchParams.get('constellation');
    const include = searchParams.get('include');
    const exclude = searchParams.get('exclude');

    if(include) {
        includeSet = new Set(splitCommaList(include));
    }

    if(exclude) {
        excludeSet = new Set(splitCommaList(exclude));
    }

    if(constellation && constellation.includes('(') && constellation.endsWith(')')) {
        const [name, partInfo] = constellation.slice(0, -1).split('(');
        const parts = partInfo.split('/');

        constellation = name;
        partIndex = Number(parts[0]) - 1;
        partCount = Number(parts[1]);
    }

    if(RUN_FLAGS.isContinuousIntegration && fs.existsSync(COMPLETED_SUITES_FILENAME)) {
        const completedSuites = fs.readFileSync(COMPLETED_SUITES_FILENAME, 'utf8')
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean);

        excludeSuites = new Set(completedSuites);
    }

    const packageJson = JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf8'));

    return {
        Constellation: constellation || '',
        CategoriesList: include || '',
        Version: String(packageJson.version || ''),
        Suites: getAllSuites({
            deviceMode: hasDeviceModeFlag(searchParams),
            constellation: constellation || '',
            includeCategories: includeSet,
            excludeCategories: excludeSet,
            excludeSuites,
            partIndex,
            partCount,
        }),
    };
}

function assignBaseRunProps(searchParams) {
    const result = {
        IsContinuousIntegration: RUN_FLAGS.isContinuousIntegration,
        NoGlobals: searchParams.has('noglobals'),
        NoTimers: searchParams.has('notimers'),
        NoTryCatch: searchParams.has('notrycatch'),
        NoJQuery: searchParams.has('nojquery'),
        ShadowDom: searchParams.has('shadowDom'),
        WorkerInWindow: searchParams.has('workerinwindow'),
        NoCsp: searchParams.has('nocsp'),
        MaxWorkers: null,
    };

    if(process.env.MAX_WORKERS && /^\d+$/.test(process.env.MAX_WORKERS)) {
        result.MaxWorkers = Number(process.env.MAX_WORKERS);
    }

    return result;
}

function hasDeviceModeFlag(searchParams) {
    return searchParams.has('deviceMode');
}

function readCategories() {
    const dirs = fs.readdirSync(TESTS_ROOT, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(TESTS_ROOT, entry.name))
        .filter(isNotEmptyDir)
        .map(categoryFromPath)
        .sort((a, b) => a.Name.localeCompare(b.Name));

    return dirs;
}

function readSuites(catName) {
    if(!catName) {
        throw new Error('Category name is required.');
    }

    const catPath = path.join(TESTS_ROOT, catName);

    const subDirs = fs.readdirSync(catPath, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);

    subDirs.forEach((dirName) => {
        if(!dirName.endsWith('Parts')) {
            throw new Error(`Unexpected sub-directory in the test category: ${path.join(catPath, dirName)}`);
        }
    });

    const suites = fs.readdirSync(catPath, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
        .map((entry) => suiteFromPath(catName, path.join(catPath, entry.name)))
        .sort((a, b) => a.ShortName.localeCompare(b.ShortName));

    return suites;
}

function getSuiteVirtualPath(catName, suiteName) {
    return `/packages/devextreme/testing/tests/${catName}/${suiteName}`;
}

function getAllSuites({
    deviceMode,
    constellation,
    includeCategories,
    excludeCategories,
    excludeSuites,
    partIndex,
    partCount,
}) {
    const includeSpecified = includeCategories && includeCategories.size > 0;
    const excludeSpecified = excludeCategories && excludeCategories.size > 0;
    const result = [];

    readCategories().forEach((category) => {
        if(deviceMode && !category.RunOnDevices) {
            return;
        }

        if(constellation && category.Constellation !== constellation) {
            return;
        }

        if(includeSpecified && !includeCategories.has(category.Name)) {
            return;
        }

        if(category.Explicit && (!includeSpecified || !includeCategories.has(category.Name))) {
            return;
        }

        if(excludeSpecified && excludeCategories.has(category.Name)) {
            return;
        }

        let index = 0;
        readSuites(category.Name).forEach((suite) => {
            if(partCount > 1 && (index % partCount) !== partIndex) {
                index += 1;
                return;
            }

            index += 1;

            if(excludeSuites && excludeSuites.has(suite.FullName)) {
                return;
            }

            result.push(suite);
        });
    });

    return result;
}

function categoryFromPath(categoryPath) {
    const name = path.basename(categoryPath);
    const metaPath = path.join(categoryPath, '__meta.json');
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const constellation = String(meta.constellation || '');

    if(!KNOWN_CONSTELLATIONS.has(constellation)) {
        throw new Error(`Unknown constellation (group of categories):${constellation}`);
    }

    return {
        Name: name,
        Constellation: constellation,
        Explicit: Boolean(meta.explicit),
        RunOnDevices: Boolean(meta.runOnDevices),
    };
}

function suiteFromPath(catName, suitePath) {
    const suiteName = path.basename(suitePath);
    const shortName = path.basename(suitePath, '.js');

    return {
        ShortName: shortName,
        FullName: `${catName}/${suiteName}`,
        Url: `/run/${encodeURIComponent(catName)}/${encodeURIComponent(suiteName)}`,
    };
}

function isNotEmptyDir(dirPath) {
    try {
        return fs.readdirSync(dirPath).length > 0;
    } catch(_) {
        return false;
    }
}

function renderIndexPage() {
    return renderTemplate('index.template.html', {
        JQUERY_URL: '/packages/devextreme/artifacts/js/jquery.js',
        KNOCKOUT_URL: '/packages/devextreme/artifacts/js/knockout-latest.js',
        ROOT_URL_JSON: jsonString('/'),
        SUITES_JSON_URL_JSON: jsonString('/Main/SuitesJson'),
        CATEGORIES_JSON_URL_JSON: jsonString('/Main/CategoriesJson'),
    });
}

function renderRunAllPage(model, runProps) {
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

function renderRunSuitePage(model, runProps, searchParams) {
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

    function getJQueryUrl() {
        if(isNoJQueryTest) {
            return `${testingBasePath}helpers/noJQuery.js`;
        }

        return '/packages/devextreme/artifacts/js/jquery.js';
    }

    function getTestUrl() {
        if(runProps.NoCsp) {
            return scriptVirtualPath;
        }

        return scriptVirtualPath.replace('/testing/', '/artifacts/transpiled-testing/');
    }

    function getJQueryIntegrationImports() {
        const result = [];

        if(!isSelfSufficientTest) {
            if(runProps.NoJQuery || isNoJQueryTest || isServerSideTest) {
                result.push(`${testingBasePath}helpers/jQueryEventsPatch.js`);
                result.push(`${testingBasePath}helpers/argumentsValidator.js`);
                result.push(`${testingBasePath}helpers/dataPatch.js`);
                result.push(`/packages/devextreme/artifacts/${npmModule}/__internal/integration/jquery/component_registrator.js`);
            } else {
                result.push(`/packages/devextreme/artifacts/${npmModule}/integration/jquery.js`);
            }
        }

        if(isServerSideTest) {
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

    const cspMap = !runProps.NoCsp
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

    const systemMap = {
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
        ...cspMap,
    };

    const systemPackages = {
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

async function saveResults(req, res) {
    let hasFailure = false;
    let xml = '';

    try {
        const json = await readBodyText(req);
        validateResultsJson(json);

        const results = JSON.parse(json);
        hasFailure = Number(results.failures) > 0;
        xml = testResultsToXml(results);

        if(RUN_FLAGS.singleRun) {
            writeLine();
            printTextReport(results);
        }
    } catch(error) {
        logMiscErrorCore(`Failed to save results. ${error && error.stack ? error.stack : String(error)}`);
        hasFailure = true;
    }

    fs.writeFileSync(RESULTS_XML_FILENAME, xml, 'utf8');

    sendText(res, 'OK');

    if(RUN_FLAGS.singleRun) {
        setTimeout(() => {
            process.exit(hasFailure ? 1 : 0);
        }, 0);
    }
}

function validateResultsJson(json) {
    const badToken = '\\u0000';
    const badIndex = json.indexOf(badToken);

    if(badIndex > -1) {
        const from = Math.max(0, badIndex - 200);
        const to = Math.min(json.length, badIndex + 200);
        throw new Error(`Result JSON has bad content: ${json.slice(from, to)}`);
    }
}

function printTextReport(results) {
    const maxWrittenFailures = 50;
    const notRunCases = [];
    const failedCases = [];

    (results.suites || []).forEach((suite) => {
        enumerateAllCases(suite, (testCase) => {
            if(testCase && testCase.reason) {
                notRunCases.push(testCase);
            }
            if(testCase && testCase.failure) {
                failedCases.push(testCase);
            }
        });
    });

    const total = Number(results.total) || 0;
    const failures = Number(results.failures) || 0;
    const notRunCount = notRunCases.length;
    const color = failures > 0 ? 'red' : (notRunCount > 0 ? 'yellow' : 'green');

    writeLine(`Tests run: ${total}, Failures: ${failures}, Not run: ${notRunCount}`, color);

    if(notRunCount > 0 && failures === 0) {
        notRunCases.forEach((testCase) => {
            writeLine('-'.repeat(80));
            writeLine(`Skipped: ${testCase.name || ''}`);
            writeLine(`Reason: ${testCase.reason && testCase.reason.message ? testCase.reason.message : ''}`);
        });
    }

    if(failures > 0) {
        let writtenFailures = 0;

        failedCases.forEach((testCase) => {
            if(writtenFailures >= maxWrittenFailures) {
                return;
            }

            writeLine('-'.repeat(80));
            writeLine(testCase.name || '', 'white');
            writeLine();
            writeLine(testCase.failure && testCase.failure.message ? testCase.failure.message : '');

            writtenFailures += 1;
        });

        if(writtenFailures >= maxWrittenFailures) {
            writeLine(`WARNING: only first ${maxWrittenFailures} failures are shown.`);
        }
    }
}

function enumerateAllCases(suite, callback) {
    (suite.results || []).forEach((item) => {
        if(item && Array.isArray(item.results)) {
            enumerateAllCases(item, callback);
            return;
        }

        callback(item);
    });
}

function testResultsToXml(results) {
    const lines = [];

    lines.push(`<test-results name="${escapeXmlAttr(results.name || '')}" total="${Number(results.total) || 0}" failures="${Number(results.failures) || 0}">`);

    (results.suites || []).forEach((suite) => {
        lines.push(renderSuiteXml(suite, '  '));
    });

    lines.push('</test-results>');

    return `${lines.join('\n')}\n`;
}

function renderSuiteXml(suite, indent) {
    const lines = [];

    lines.push(`${indent}<test-suite name="${escapeXmlAttr(suite.name || '')}" time="${normalizeNumber(suite.time)}" pure-time="${normalizeNumber(suite.pureTime)}">`);
    lines.push(`${indent}  <results>`);

    (suite.results || []).forEach((item) => {
        if(item && Array.isArray(item.results)) {
            lines.push(renderSuiteXml(item, `${indent}    `));
        } else {
            lines.push(renderCaseXml(item || {}, `${indent}    `));
        }
    });

    lines.push(`${indent}  </results>`);
    lines.push(`${indent}</test-suite>`);

    return lines.join('\n');
}

function renderCaseXml(testCase, indent) {
    const attributes = [
        `name="${escapeXmlAttr(testCase.name || '')}"`,
        `url="${escapeXmlAttr(testCase.url || '')}"`,
        `time="${escapeXmlAttr(testCase.time || '')}"`,
    ];

    if(testCase.executed === false) {
        attributes.push('executed="false"');
    }

    const hasFailure = Boolean(testCase.failure && typeof testCase.failure.message === 'string');
    const hasReason = Boolean(testCase.reason && typeof testCase.reason.message === 'string');

    if(!hasFailure && !hasReason) {
        return `${indent}<test-case ${attributes.join(' ')} />`;
    }

    const lines = [`${indent}<test-case ${attributes.join(' ')}>`];

    if(hasFailure) {
        lines.push(`${indent}  <failure>`);
        lines.push(`${indent}    <message>${escapeXmlText(testCase.failure.message)}</message>`);
        lines.push(`${indent}  </failure>`);
    }

    if(hasReason) {
        lines.push(`${indent}  <reason>`);
        lines.push(`${indent}    <message>${escapeXmlText(testCase.reason.message)}</message>`);
        lines.push(`${indent}  </reason>`);
    }

    lines.push(`${indent}</test-case>`);

    return lines.join('\n');
}

function normalizeNumber(value) {
    const number = Number(value);
    if(Number.isNaN(number)) {
        return 0;
    }

    return number;
}

function readThemeCssFiles() {
    const bundlesPath = path.join(PACKAGE_ROOT, 'scss', 'bundles');
    const result = [];

    if(!fs.existsSync(bundlesPath)) {
        return result;
    }

    fs.readdirSync(bundlesPath, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .forEach((entry) => {
            const bundleDirectory = path.join(bundlesPath, entry.name);
            fs.readdirSync(bundleDirectory, { withFileTypes: true })
                .filter((file) => file.isFile() && file.name.endsWith('.scss'))
                .forEach((file) => {
                    result.push(`${path.basename(file.name, '.scss')}.css`);
                });
        });

    return result;
}

function readVectorMapTestData() {
    if(!fs.existsSync(VECTOR_DATA_DIRECTORY)) {
        return [];
    }

    return fs.readdirSync(VECTOR_DATA_DIRECTORY, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith('.txt'))
        .map((entry) => {
            const filePath = path.join(VECTOR_DATA_DIRECTORY, entry.name);
            return {
                name: path.basename(entry.name, '.txt'),
                expected: fs.readFileSync(filePath, 'utf8'),
            };
        });
}

async function redirectRequestToVectorMapNodeServer(action, arg) {
    acquireVectorMapNodeServer();

    try {
        const startTime = Date.now();

        while(true) {
            try {
                const text = await httpGetText(`http://127.0.0.1:${VECTOR_MAP_TESTER_PORT}/${action}/${arg}`);
                return text;
            } catch(error) {
                if(Date.now() - startTime > 5000) {
                    throw error;
                }
            }
        }
    } finally {
        releaseVectorMapNodeServer();
    }
}

function acquireVectorMapNodeServer() {
    if(vectorMapNodeServer.killTimer) {
        clearTimeout(vectorMapNodeServer.killTimer);
        vectorMapNodeServer.killTimer = null;
    }

    if(!vectorMapNodeServer.process || vectorMapNodeServer.process.killed) {
        const scriptPath = path.join(TESTING_ROOT, 'helpers', 'vectormaputils-tester.js');

        vectorMapNodeServer.process = spawn(
            PATH_TO_NODE,
            [scriptPath, `${VECTOR_DATA_DIRECTORY}${path.sep}`],
            {
                stdio: 'ignore',
            },
        );

        vectorMapNodeServer.process.on('exit', () => {
            if(vectorMapNodeServer.process && vectorMapNodeServer.process.exitCode !== null) {
                vectorMapNodeServer.process = null;
            }
        });
    }

    vectorMapNodeServer.refs += 1;
}

function releaseVectorMapNodeServer() {
    vectorMapNodeServer.refs -= 1;

    if(vectorMapNodeServer.refs <= 0) {
        vectorMapNodeServer.refs = 0;

        vectorMapNodeServer.killTimer = setTimeout(() => {
            if(vectorMapNodeServer.refs === 0 && vectorMapNodeServer.process) {
                try {
                    vectorMapNodeServer.process.kill();
                } catch(_) {
                    // Ignore process kill failures.
                }
                vectorMapNodeServer.process = null;
            }
            vectorMapNodeServer.killTimer = null;
        }, 200);
    }
}

function executeVectorMapConsoleApp(arg, searchParams) {
    const inputDirectory = `${path.join(PACKAGE_ROOT, 'testing', 'content', 'VectorMapData')}${path.sep}`;
    const outputDirectory = path.join(inputDirectory, '__Output');
    const settingsPath = path.join(inputDirectory, '_settings.js');
    const processFileContentPath = path.join(inputDirectory, '_processFileContent.js');
    const vectorMapUtilsNodePath = path.resolve(path.join(PACKAGE_ROOT, 'artifacts/js/vectormap-utils/dx.vectormaputils.node.js'));

    const args = [vectorMapUtilsNodePath, inputDirectory];

    if(searchParams.has('file')) {
        args[1] += searchParams.get('file');
    }

    args.push('--quiet', '--output', outputDirectory, '--settings', settingsPath, '--process-file-content', processFileContentPath);

    const isJson = searchParams.has('json');

    if(isJson) {
        args.push('--json');
    }

    fs.mkdirSync(outputDirectory, { recursive: true });

    try {
        const spawnResult = spawnSync(PATH_TO_NODE, args, {
            timeout: 15000,
            stdio: 'ignore',
        });

        if(spawnResult.error && spawnResult.error.code === 'ETIMEDOUT') {
            // Intentionally ignored to match legacy behavior.
        }

        const extension = isJson ? '.json' : '.js';

        return fs.readdirSync(outputDirectory, { withFileTypes: true })
            .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
            .map((entry) => {
                const filePath = path.join(outputDirectory, entry.name);
                let text = fs.readFileSync(filePath, 'utf8');
                let variable = null;

                if(!isJson) {
                    const index = text.indexOf('=');
                    if(index > 0) {
                        variable = text.substring(0, index).trim();
                        text = text.substring(index + 1).trim();

                        if(text.endsWith(';')) {
                            text = text.slice(0, -1).trim();
                        }
                    }
                }

                return {
                    file: `${path.basename(entry.name, extension)}${extension}`,
                    variable,
                    content: JSON.parse(text),
                };
            });
    } finally {
        try {
            fs.rmSync(outputDirectory, { recursive: true, force: true });
        } catch(_) {
            // Ignore cleanup errors.
        }
    }
}

function tryServeStatic(req, res, pathname, searchParams) {
    const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
    const relativePath = normalizedPath.replace(/^\/+/, '');
    const filePath = path.resolve(path.join(REPO_ROOT, relativePath));
    const relativeToRoot = path.relative(REPO_ROOT, filePath);

    if(relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) {
        setNoCacheHeaders(res);
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('Forbidden');
        return true;
    }

    if(!fs.existsSync(filePath)) {
        return false;
    }

    setStaticCacheHeaders(res, searchParams);

    const stat = fs.statSync(filePath);

    if(stat.isDirectory()) {
        return sendDirectoryListing(res, pathname, filePath);
    }

    if(stat.isFile()) {
        return sendStaticFile(res, filePath, stat.size);
    }

    return false;
}

function sendStaticFile(res, filePath, fileSize) {
    res.statusCode = 200;
    res.setHeader('Content-Type', getContentType(filePath));
    res.setHeader('Content-Length', String(fileSize));

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    stream.on('error', () => {
        if(!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        }
        if(!res.writableEnded) {
            res.end('Internal Server Error');
        }
    });

    return true;
}

function sendDirectoryListing(res, requestPath, dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const pathname = requestPath.endsWith('/') ? requestPath : `${requestPath}/`;

    const items = [];

    if(pathname !== '/') {
        const parentPath = pathname
            .split('/')
            .filter(Boolean)
            .slice(0, -1)
            .join('/');
        const href = parentPath ? `/${parentPath}/` : '/';
        items.push(`<li><a href="${escapeHtml(href)}">..</a></li>`);
    }

    entries
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((entry) => {
            const suffix = entry.isDirectory() ? '/' : '';
            const href = `${pathname}${encodeURIComponent(entry.name)}${suffix}`;
            items.push(`<li><a href="${escapeHtml(href)}">${escapeHtml(entry.name)}${suffix}</a></li>`);
        });

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Index of ${escapeHtml(pathname)}</title>
</head>
<body>
<h1>Index of ${escapeHtml(pathname)}</h1>
<ul>
${items.join('\n')}
</ul>
</body>
</html>`;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(html);

    return true;
}

function readBodyText(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];

        req.on('data', (chunk) => {
            chunks.push(chunk);
        });

        req.on('end', () => {
            resolve(Buffer.concat(chunks).toString('utf8'));
        });

        req.on('error', reject);
    });
}

async function readFormBody(req) {
    const body = await readBodyText(req);
    return Object.fromEntries(new URLSearchParams(body));
}

function sendHtml(res, html) {
    setNoCacheHeaders(res);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(html);
}

function sendJson(res, payload) {
    setNoCacheHeaders(res);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(payload));
}

function sendJsonText(res, payloadText) {
    setNoCacheHeaders(res);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(payloadText);
}

function sendXml(res, payload) {
    setNoCacheHeaders(res);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.end(payload);
}

function sendText(res, payload) {
    setNoCacheHeaders(res);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(payload);
}

function sendNotFound(res) {
    setNoCacheHeaders(res);
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Not Found');
}

function setNoCacheHeaders(res) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
}

function setStaticCacheHeaders(res, searchParams) {
    if(searchParams.has('DX_HTTP_CACHE')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
    } else {
        res.setHeader('Cache-Control', 'private, must-revalidate, max-age=0');
    }
}

function getCacheBuster(searchParams) {
    if(searchParams.has('DX_HTTP_CACHE')) {
        const value = searchParams.get('DX_HTTP_CACHE') || '';
        return `DX_HTTP_CACHE=${encodeURIComponent(value)}`;
    }

    return '';
}

function contentWithCacheBuster(contentPath, cacheBuster) {
    if(!cacheBuster) {
        return contentPath;
    }

    return `${contentPath}${contentPath.includes('?') ? '&' : '?'}${cacheBuster}`;
}

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();

    switch(ext) {
        case '.html':
        case '.htm':
            return 'text/html; charset=utf-8';
        case '.css':
            return 'text/css; charset=utf-8';
        case '.js':
        case '.mjs':
            return 'application/javascript; charset=utf-8';
        case '.json':
            return 'application/json; charset=utf-8';
        case '.xml':
        case '.xsl':
            return 'text/xml; charset=utf-8';
        case '.txt':
        case '.md':
        case '.log':
            return 'text/plain; charset=utf-8';
        case '.svg':
            return 'image/svg+xml';
        case '.png':
            return 'image/png';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.gif':
            return 'image/gif';
        case '.ico':
            return 'image/x-icon';
        case '.woff':
            return 'font/woff';
        case '.woff2':
            return 'font/woff2';
        case '.ttf':
            return 'font/ttf';
        case '.eot':
            return 'application/vnd.ms-fontobject';
        case '.map':
            return 'application/json; charset=utf-8';
        case '.wasm':
            return 'application/wasm';
        default:
            return 'application/octet-stream';
    }
}

function jsonString(value) {
    return JSON.stringify(value);
}

function renderTemplate(templateName, vars) {
    const template = readTemplate(templateName);
    const data = vars || {};

    return template
        .replace(/\{\{\{([A-Za-z0-9_]+)\}\}\}/g, (_, key) => getTemplateValue(data, key, false))
        .replace(/\{\{([A-Za-z0-9_]+)\}\}/g, (_, key) => getTemplateValue(data, key, true));
}

function readTemplate(templateName) {
    const key = String(templateName || '');

    if(TEMPLATE_CACHE.has(key)) {
        return TEMPLATE_CACHE.get(key);
    }

    const filePath = path.resolve(TEMPLATES_ROOT, key);
    const relativePath = path.relative(TEMPLATES_ROOT, filePath);

    if(relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
        throw new Error(`Invalid template path: ${key}`);
    }

    const templateText = fs.readFileSync(filePath, 'utf8');
    TEMPLATE_CACHE.set(key, templateText);

    return templateText;
}

function getTemplateValue(data, key, shouldEscape) {
    const hasValue = Object.prototype.hasOwnProperty.call(data, key);
    const value = hasValue ? data[key] : '';
    const valueAsString = value === null || value === undefined ? '' : String(value);

    if(shouldEscape) {
        return escapeHtml(valueAsString);
    }

    return valueAsString;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeXmlText(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function escapeXmlAttr(value) {
    return escapeXmlText(value)
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function loadPorts(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function safeReadFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch(_) {
        return '';
    }
}

function parseBoolean(value) {
    return String(value).toLowerCase() === 'true';
}

function parseNumber(value) {
    const number = Number(value);
    return Number.isNaN(number) ? 0 : number;
}

function splitCommaList(value) {
    return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
}

function safeDecodeURIComponent(value) {
    try {
        return decodeURIComponent(value);
    } catch(_) {
        return value;
    }
}

function writeLastSuiteTime() {
    fs.writeFileSync(LAST_SUITE_TIME_FILENAME, formatDateForSuiteTimestamp(new Date()), 'utf8');
}

function formatDateForSuiteTimestamp(date) {
    return [
        date.getFullYear(),
        pad2(date.getMonth() + 1),
        pad2(date.getDate()),
    ].join('-') + 'T' + [
        pad2(date.getHours()),
        pad2(date.getMinutes()),
        pad2(date.getSeconds()),
    ].join(':');
}

function isContinuousIntegration() {
    return Boolean(process.env.CCNetWorkingDirectory || process.env.DEVEXTREME_TEST_CI);
}

function resolveNodePath() {
    if(process.env.CCNetWorkingDirectory) {
        const customPath = path.join(process.env.CCNetWorkingDirectory, 'node', 'node.exe');
        if(fs.existsSync(customPath)) {
            return customPath;
        }
    }

    return 'node';
}

function logMiscErrorCore(data) {
    if(!RUN_FLAGS.isContinuousIntegration) {
        return;
    }

    try {
        fs.appendFileSync(MISC_ERRORS_FILENAME, `${data}${os.EOL}`, 'utf8');
    } catch(_) {
        // Ignore logging errors.
    }
}

function createRawLogger(filePath) {
    return {
        filePath,
        writeLine(text = '') {
            this.write(`${text || ''}\r\n`);
            this._time = true;
        },
        write(text = '') {
            if(!text) {
                return;
            }

            if(this._time !== false) {
                this._time = false;
                fs.appendFileSync(this.filePath, `${formatLogTime(new Date())}     `, 'utf8');
            }

            fs.appendFileSync(this.filePath, text, 'utf8');
        },
        _time: true,
    };
}

function formatLogTime(date) {
    let hours = date.getHours() % 12;
    if(hours === 0) {
        hours = 12;
    }

    return `${pad2(hours)}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
}

function write(message, color) {
    const text = String(message || '');
    logger.write(text);
    process.stdout.write(colorize(text, color));
}

function writeLine(message = '', color) {
    const text = String(message || '');
    logger.writeLine(text);
    process.stdout.write(`${colorize(text, color)}\n`);
}

function writeError(message) {
    const text = `ERROR: ${message}`;
    logger.writeLine(text);
    process.stderr.write(`${text}\n`);
}

function colorize(text, color) {
    if(!color) {
        return text;
    }

    const colorCodes = {
        red: 31,
        green: 32,
        yellow: 33,
        white: 37,
    };

    const code = colorCodes[color];
    if(!code) {
        return text;
    }

    return `\u001b[${code}m${text}\u001b[0m`;
}

function pad2(value) {
    return String(value).padStart(2, '0');
}

function httpGetText(targetUrl) {
    return new Promise((resolve, reject) => {
        const request = http.get(targetUrl, (response) => {
            const chunks = [];

            response.on('data', (chunk) => {
                chunks.push(chunk);
            });

            response.on('end', () => {
                resolve(Buffer.concat(chunks).toString('utf8'));
            });
        });

        request.on('error', reject);
    });
}
