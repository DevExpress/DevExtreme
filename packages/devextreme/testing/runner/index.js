#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');

const {
    contentWithCacheBuster,
    escapeHtml,
    escapeXmlAttr,
    escapeXmlText,
    formatDateForSuiteTimestamp,
    getCacheBuster,
    isContinuousIntegration,
    jsonString,
    loadPorts,
    normalizeNumber,
    parseBoolean,
    parseNumber,
    readBodyText,
    readFormBody,
    resolveNodePath,
    safeDecodeURIComponent,
    safeReadFile,
    splitCommaList,
} = require('./lib/utils');
const { createRunnerLogger } = require('./lib/logger');
const { createTemplateRenderer } = require('./lib/templates');
const { createPagesRenderer } = require('./lib/pages');
const { createSuitesService } = require('./lib/suites');
const { createResultsReporter } = require('./lib/results');
const { createVectorMapService } = require('./lib/vectormap');
const {
    sendHtml,
    sendJson,
    sendJsonText,
    sendNotFound,
    sendText,
    sendXml,
    setNoCacheHeaders,
    setStaticCacheHeaders,
} = require('./lib/http');
const { createStaticFileService } = require('./lib/static');

const KNOWN_CONSTELLATIONS = new Set(['export', 'misc', 'ui', 'ui.widgets', 'ui.editors', 'ui.grid', 'ui.scheduler']);

const PACKAGE_ROOT = path.resolve(__dirname, '../..');
const WORKSPACE_ROOT = path.resolve(PACKAGE_ROOT, '../..');
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

const logger = createRunnerLogger(RAW_LOG_FILENAME);
const templates = createTemplateRenderer(TEMPLATES_ROOT, escapeHtml);
const pages = createPagesRenderer({
    contentWithCacheBuster,
    getCacheBuster,
    jsonString,
    renderTemplate: templates.renderTemplate,
});
const suites = createSuitesService({
    knownConstellations: KNOWN_CONSTELLATIONS,
    testsRoot: TESTS_ROOT,
});
const results = createResultsReporter({
    escapeXmlAttr,
    escapeXmlText,
    normalizeNumber,
});
const vectorMap = createVectorMapService({
    packageRoot: PACKAGE_ROOT,
    testingRoot: TESTING_ROOT,
    vectorDataDirectory: VECTOR_DATA_DIRECTORY,
    vectorMapTesterPort: VECTOR_MAP_TESTER_PORT,
    pathToNode: PATH_TO_NODE,
});
const staticFiles = createStaticFileService({
    escapeHtml,
    rootDirectory: WORKSPACE_ROOT,
    setNoCacheHeaders,
    setStaticCacheHeaders,
});

start();

function start() {
    const server = http.createServer((req, res) => {
        handleRequest(req, res).catch((error) => {
            logger.writeError(error && error.stack ? error.stack : String(error));
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
        logger.writeLine(`QUnit runner server listens on http://0.0.0.0:${QUNIT_PORT}...`);
    });
}

async function handleRequest(req, res) {
    const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = safeDecodeURIComponent(requestUrl.pathname);
    const pathnameLower = pathname.toLowerCase();

    if(req.method === 'GET' && (pathname === '/' || pathnameLower === '/main/index')) {
        return sendHtml(res, pages.renderIndexPage());
    }

    if(req.method === 'GET') {
        const suitesJsonMatch = pathname.match(/^\/Main\/SuitesJson(?:\/(.+))?$/i);
        if(suitesJsonMatch) {
            const id = suitesJsonMatch[1]
                ? safeDecodeURIComponent(suitesJsonMatch[1])
                : requestUrl.searchParams.get('id');
            const suitesList = suites.readSuites(id || '');
            return sendJson(res, suitesList);
        }
    }

    if(req.method === 'GET' && pathnameLower === '/main/categoriesjson') {
        return sendJson(res, suites.readCategories());
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
        return sendHtml(res, pages.renderRunAllPage(model, runProps));
    }

    if(req.method === 'GET') {
        const runSuiteMatch = pathname.match(/^\/run\/([^/]+)\/(.+\.js)$/i);
        if(runSuiteMatch) {
            const catName = safeDecodeURIComponent(runSuiteMatch[1]);
            const suiteName = safeDecodeURIComponent(runSuiteMatch[2]);
            const model = suites.buildRunSuiteModel(catName, suiteName);
            const runProps = assignBaseRunProps(requestUrl.searchParams);
            return sendHtml(res, pages.renderRunSuitePage(model, runProps, requestUrl.searchParams));
        }
    }

    if(req.method === 'GET' && pathnameLower === '/main/runsuite') {
        const catName = requestUrl.searchParams.get('catName') || '';
        const suiteName = requestUrl.searchParams.get('suiteName') || '';

        if(!catName || !suiteName) {
            return sendNotFound(res);
        }

        const model = suites.buildRunSuiteModel(catName, suiteName);
        const runProps = assignBaseRunProps(requestUrl.searchParams);
        return sendHtml(res, pages.renderRunSuitePage(model, runProps, requestUrl.searchParams));
    }

    if(req.method === 'POST' && pathnameLower === '/main/notifyteststarted') {
        const form = await readFormBody(req);
        const name = String(form.name || '');

        try {
            logger.writeLine(`       [ run] ${name}`);
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
            logger.writeLine(`       [${passed ? '  ok' : 'fail'}] ${name}`);
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

            logger.write(passed ? '[ OK ' : '[FAIL', passed ? 'green' : 'red');
            const seconds = Number((runtime / 1000).toFixed(3));
            logger.writeLine(`] ${name} in ${seconds}s`);
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
        const list = vectorMap.readThemeCssFiles();
        return sendJson(res, list);
    }

    if(req.method === 'GET' && pathnameLower === '/testvectormapdata/gettestdata') {
        const data = vectorMap.readVectorMapTestData();
        return sendJson(res, data);
    }

    if(req.method === 'GET') {
        const parseBufferMatch = pathname.match(/^\/TestVectorMapData\/ParseBuffer\/(.+)$/i);
        if(parseBufferMatch) {
            const id = safeDecodeURIComponent(parseBufferMatch[1]);
            const responseText = await vectorMap.redirectRequestToVectorMapNodeServer('parse-buffer', id);
            return sendJsonText(res, responseText);
        }
    }

    if(req.method === 'GET') {
        const readAndParseMatch = pathname.match(/^\/TestVectorMapData\/ReadAndParse\/(.+)$/i);
        if(readAndParseMatch) {
            const id = safeDecodeURIComponent(readAndParseMatch[1]);
            const responseText = await vectorMap.redirectRequestToVectorMapNodeServer('read-and-parse', id);
            return sendJsonText(res, responseText);
        }
    }

    if(req.method === 'GET') {
        const executeConsoleAppMatch = pathname.match(/^\/TestVectorMapData\/ExecuteConsoleApp(?:\/(.*))?$/i);
        if(executeConsoleAppMatch) {
            const arg = safeDecodeURIComponent(executeConsoleAppMatch[1] || '');
            const result = vectorMap.executeVectorMapConsoleApp(arg, requestUrl.searchParams);
            return sendJson(res, result);
        }
    }

    if(staticFiles.tryServeStatic(req, res, pathname, requestUrl.searchParams)) {
        return;
    }

    return sendNotFound(res);
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
        Suites: suites.getAllSuites({
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

async function saveResults(req, res) {
    let hasFailure = false;
    let xml = '';

    try {
        const json = await readBodyText(req);
        results.validateResultsJson(json);

        const parsedResults = JSON.parse(json);
        hasFailure = Number(parsedResults.failures) > 0;
        xml = results.testResultsToXml(parsedResults);

        if(RUN_FLAGS.singleRun) {
            logger.writeLine();
            results.printTextReport(parsedResults, logger.writeLine.bind(logger));
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

function writeLastSuiteTime() {
    fs.writeFileSync(LAST_SUITE_TIME_FILENAME, formatDateForSuiteTimestamp(new Date()), 'utf8');
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
