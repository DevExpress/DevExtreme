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

    if(req.method === 'GET' && (pathnameLower === '/run' || pathnameLower === '/run/' || pathnameLower === '/main/runall')) {
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
    const rootUrl = '/';
    const suitesJsonUrl = '/Main/SuitesJson';
    const categoriesJsonUrl = '/Main/CategoriesJson';
    const jqueryUrl = '/packages/devextreme/artifacts/js/jquery.js';
    const knockoutUrl = '/packages/devextreme/artifacts/js/knockout-latest.js';

    return `<!DOCTYPE html>

<script src="${jqueryUrl}"></script>
<script src="${knockoutUrl}"></script>

<style>

    a,
    .link
    {
        text-decoration: none;
        color: Blue;
        cursor: pointer;
    }

    #cat_block,
    #suite_block
    {
        border: solid 1px silver;
        padding: 10px;
        margin: 10px;
        float: left;
    }

    #cat_block li .explicit
    {
        color: gray;
    }

</style>

<body>
    <div id="cat_block">
        <div>
            <b>Categories</b>
        </div>
        <hr />
        <div>
            Select:
                <span class="link" data-bind="click: handleSelectAll">all</span>,
                <span class="link" data-bind="click: handleUnselectAll">none</span>
            | <a target="_blank" href="" data-bind="attr: { href: runSelectedUrl }">RUN</a>
        </div>
        <div>
            <label>
                Check for globals: <input type="checkbox" data-bind="checked: noGlobals" />
            </label>
        </div>
        <div>
            <label>
                No try catch: <input type="checkbox" data-bind="checked: noTryCatch" />
            </label>
        </div>
        <div>
            <label>
                Check for timers: <input type="checkbox" data-bind="checked: noTimers" />
            </label>
        </div>
        <div>
            <label>
                No jQuery: <input type="checkbox" data-bind="checked: noJQuery" />
            </label>
        </div>
        <div>
            <label>
                No CSP: <input type="checkbox" data-bind="checked: noCsp" />
            </label>
        </div>

        <ul data-bind="foreach: cats">
            <li>
                <input type=checkbox data-bind="checked: selected">
                <span class="link" data-bind="text: name, css: { explicit: explicit }, click: handleChoose"></span>
            </li>
        </ul>
        <div>
            <small>Greyed are explicit tests</small>
        </div>
    </div>

    <div id="suite_block" data-bind="visible: chosenCat">
        <div>
            <b>Suites for category &quot;<span data-bind="text: chosenCat"></span>&quot;</b>
            <span class="link" data-bind="click: handleRefreshSuies">(Refresh)</span>
        </div>
        <hr />
        <div>
            <a target="_blank" href="" data-bind="attr: { href: runAllInCatUrl }">Run all suites</a>
        </div>
        <ul data-bind="foreach: suites">
            <li>
                <a data-bind="text: shortName, attr: { href: url }"></a>
            </li>
        </ul>
    </div>
</body>


<script>
    $(function() {
        var ROOT_URL = ${jsonString(rootUrl)};

        // Category model

        var CatModel = function(data) {
            this.name = data.Name;
            this.explicit = data.Explicit;
            this.selected = ko.observable(CatModel.shouldSelectByDefault(this));
        };

        CatModel.shouldSelectByDefault = function(cat) {
            return !cat.explicit;
        };

        CatModel.prototype = {
            handleChoose: function(cat, e) {
                vm.chosenCat(cat);
                cat.loadSuites();
            },

            loadSuites: function() {
                $.getJSON(${jsonString(suitesJsonUrl)}, { id: this.name })
                    .done(function(suites) {
                        suites = $.map(suites, function(s) { return new SuiteModel(s) });
                        vm.suites(suites);

                    });
            },

            toString: function() {
                return this.name;
            }
        };


        // Suite model

        var SuiteModel = function(data) {
            this.shortName = data.ShortName;
            this.url = ko.computed(function() {
                var mainModel = ko.dataFor(document.getElementById("cat_block")),
                    qs = {};
                $.extend(qs, mainModel._runUrlExtraParams());
                return data.Url + "?" + $.param(qs);
            });
        }


        // Main model

        var MainModel = function() {
            this.cats = ko.observableArray();
            this.chosenCat = ko.observable();
            this.suites = ko.observableArray();
            this.noTryCatch = ko.observable(false);
            this.noGlobals = ko.observable(false);
            this.noTimers = ko.observable(true);
            this.noJQuery = ko.observable(true);
            this.noCsp = ko.observable(true);
            this.hasChosenCat = ko.computed(
                function() { return !!this.chosenCat() },
                this
            );

            this.runAllInCatUrl = ko.computed(
                function() {
                    if(!this.hasChosenCat())
                        return;
                    return this._formatRunAllUrl([this.chosenCat().name]);
                },
                this
            );

            this.runSelectedUrl = ko.computed(
                function() {
                    var names = this.selectedCatNames();
                    return this._formatRunAllUrl(names);
                },
                this
            );
        };

        MainModel.prototype = {

            handleRefreshSuies: function(s, e) {
                this.chosenCat().loadSuites();
            },

            handleSelectAll: function(s, e) {
                s._selectAllCore(CatModel.shouldSelectByDefault);
            },

            handleUnselectAll: function(s, e) {
                s._selectAllCore(function() { return false });
            },

            selectedCatNames: function() {
                return $.map(
                    $.grep(this.cats(), function(c) { return c.selected() }),
                    function(c) { return c.name }
                );
            },

            implicitCategoriesCount: function() {
                return $.grep(this.cats(), function(c) { return !c.explicit }).length;
            },

            _runUrlExtraParams: function() {
                var result = {};
                if(this.noGlobals())
                    result.noglobals = "true";
                if(this.noTryCatch())
                    result.notrycatch = "true";
                if(this.noTimers())
                    result.notimers = "true";
                if(this.noJQuery())
                    result.nojquery = "true";
                if(this.noCsp()) {
                    result.nocsp = "true";
                }
                return result;
            },

            _formatRunAllUrl: function(include) {
                var qs = { };
                if(include && include.length) {
                    if(include.length !== this.implicitCategoriesCount())
                        qs.include = include.join();
                }
                $.extend(qs, this._runUrlExtraParams());
                return ROOT_URL + "run?" + $.param(qs);
            },

            _selectAllCore: function(func) {
                $.each(this.cats(), function() { this.selected(func(this)) });
            }
        };

        var vm = new MainModel;

        $.getJSON(${jsonString(categoriesJsonUrl)})
            .done(function(cats) {
                cats = $.map(cats, function(c) { return new CatModel(c) });
                vm.cats(cats);
            });

        ko.applyBindings(vm);
    });
</script>
`;
}

function renderRunAllPage(model, runProps) {
    const jqueryUrl = '/packages/devextreme/artifacts/js/jquery.js';

    return `<!DOCTYPE html>

<head>
    <title>QUnit All Suites test page</title>
    <meta name="MobileOptimized" content="480">
</head>

<style>
    html, body
    {
        height: 100%;
    }

    body
    {
        padding: 0;
        margin: 0;
        background: gray;
    }

    iframe
    {
        background: white;
    }

    #workers .worker
    {
        float: left;
        margin: 4px;
    }

    #workers .worker iframe
    {

        width: 400px;
        height: 300px;
        border: solid 2px black;
    }

    #reportFrame
    {
        border: 0;
        width: 100%;
        height: 100%;
        display: none;
    }

    h1, h2 {
        margin: 0;
        padding: 0;
    }

</style>

<script src="${jqueryUrl}"></script>

<script>
    $(function() {
        var TEST_TIMEOUT_SECONDS = 45,
            TEST_TIMEOUT = TEST_TIMEOUT_SECONDS * 1000,
            WORKER_NAME_PREFIX = "workerFrame",
            busyCount = 0,
            suitesDescription = {
                constellation: ${jsonString(model.Constellation)},
                categoriesList: ${jsonString(model.CategoriesList)},
                version: ${jsonString(model.Version)}
            },
            suitesInProgress = [ ],
            urls = ${jsonString(model.Suites)},
            noTryCatch = ${jsonString(runProps.NoTryCatch)},
            noGlobals = ${jsonString(runProps.NoGlobals)},
            noTimers = ${jsonString(runProps.NoTimers)},
            noJQuery = ${jsonString(runProps.NoJQuery)},
            shadowDom = ${jsonString(runProps.ShadowDom)},
            noCsp = ${jsonString(runProps.NoCsp)},
            farmMode = ${jsonString(runProps.IsContinuousIntegration)},
            DX_HTTP_CACHE = Date.now(),
            runWorkerInNewWindow = ${jsonString(runProps.WorkerInWindow)},
            maxWorkersFromEnv = ${jsonString(runProps.MaxWorkers)},

            WORKER_COUNT;

        var calcWorkerFrameCount = function() {
            if(runWorkerInNewWindow)
                return 1;

            if(maxWorkersFromEnv !== null && maxWorkersFromEnv > 0)
                return maxWorkersFromEnv;

            return 2;
        };

        WORKER_COUNT = calcWorkerFrameCount();

        var testResults = {
            name: "QUnit runner output",
            total: 0,
            failures: 0,
            suites: [
                {
                    __type: "suite",
                    name: "Root suite",
                    results: [ ],
                    pureTime: 0
                }
            ]
        };

        var rootSuite = testResults.suites[0],
            rootStartTime = new Date();

        var titleElement  = document.getElementById("title");
        if(suitesDescription.constellation) {
            titleElement.innerText = suitesDescription.constellation;
            titleElement.style.color = "yellow";
        } else {
            titleElement.innerText = suitesDescription.categoriesList;
            titleElement.style.color = "white";
        }

        document.getElementById("branch").innerText = suitesDescription.version;


        var saveResults = function() {
            $.ajax({
                url: ${jsonString('/Main/SaveResults')},
                type: "post",
                contentType: "application/json",
                data: JSON.stringify(testResults),
                timeout: 60000
            }).done(function() {
                notifyDeviceTestManager("QUnit.saveResults.done");
                removeWorkers();

                var frame = document.getElementById("reportFrame");
                frame.style.display = "block";
                frame.setAttribute("src", ${jsonString('/Main/DisplayResults')});
            }).fail(function(jqXHR, textStatus, errorThrown) {
                notifyDeviceTestManager("QUnit.saveResults.failed");
                removeWorkers();
            });
        };

        var resultSaving = false;

        var nextUrl = function(i) {
            if(suitesInProgress[i] !== null && suitesInProgress[i] !== undefined) {
                return;
            }

            if(!urls.length) {
                if(!resultSaving && !busyCount) {
                    resultSaving = true;
                    rootSuite.time = roundTime((new Date() - rootStartTime) / 1000);
                    rootSuite.pureTime = roundTime(rootSuite.pureTime);
                    saveResults();
                    window.onbeforeunload = $.noop;
                }
                return;
            }

            notifyDeviceTestManager("QUnit.nextUrl");

            var urlInfo = urls.shift(),
                worker = workerByIndex(i),
                additionalParams = { };

            if(noTryCatch)
                additionalParams.notrycatch = "true";
            if(noGlobals)
                additionalParams.noglobals = "true";
            if(noTimers)
                additionalParams.notimers = "true";
            if(noJQuery)
                additionalParams.nojquery = "true";
            if(shadowDom)
                additionalParams.shadowDom = "true";
            if(noCsp) {
                additionalParams.nocsp = "true";
            }

            additionalParams.DX_HTTP_CACHE = DX_HTTP_CACHE;
            additionalParams.frame = i;

            suitesInProgress[i] = {
                __type: "suite",

                name: urlInfo.FullName,
                url: urlInfo.Url,
                results: [ ],

                startTime: new Date(),
                pureTime: 0,
                finalized: false,

                finalize: function(success) {
                    if(this.finalized) {
                        return;
                    }

                    this.finalized = true;
                    this.time = roundTime((new Date() - this.startTime) / 1000);
                    this.pureTime = roundTime(this.pureTime);
                    delete this.startTime;

                    delete this.finalize;
                    delete this.url;

                    rootSuite.results.push(this);
                    suitesInProgress[i] = null;
                    busyCount--;
                }
            };

            worker.name = WORKER_NAME_PREFIX + i;
            busyCount++;
            worker.location = urlInfo.Url + "?" + $.param(additionalParams);
        };

        var workers = [ ];

        var createWorkers = function() {
            var worker;

            for(var i = 0; i < WORKER_COUNT; i++) {
                if(runWorkerInNewWindow) {
                    worker = window.open("about:blank", "popup" + Date.now(), "left=0,top=0,width=500,height=500");
                } else {
                    var workerWrapper = $("<div class=worker></div>")
                        .attr("id", "worker" + i)
                        .append(
                            $("<iframe scrolling=no></iframe")
                        )
                        .appendTo("#workers")

                    worker = workerWrapper.children("iframe").get(0).contentWindow;
                }
                workers.push(worker);
            }
        };

        var removeWorkers = function() {
            if(runWorkerInNewWindow) {
                for(var i = 0; i < workers.length; i++) {
                    workers[i].close();
                };
            } else {
                $("#workers").remove();
            }
            workers = [];
        };

        var workerByIndex = function(index) {
            return workers[index];
        };

        var indexFromWorkerName = function(worker) {
            return Number(worker.name.substr(WORKER_NAME_PREFIX.length));
        };

        var runFirstBatch = function() {
            notifyDeviceTestManager("QUnit.runFirstBatch");
            for(var i = 0; i < WORKER_COUNT; i++)
                nextUrl(i);
        };

        var getTestCaseName = function(testSuite, qunitData) {
            var result = testSuite.name + " - ";
            if(qunitData.module)
                result += qunitData.module + ": ";
            result += qunitData.name;
            return result;
        };

        var getTestCaseUrl = function(testSuite, qunitData) {
            return testSuite.url + "?filter=" + encodeURIComponent(qunitData.name);
        };

        window.RUNNER_ON_TEST_START = function(worker, qunitData) {
            var i = indexFromWorkerName(worker),
                testSuite = suitesInProgress[i];

            notifyIsAlive();

            var testCase = {
                __type: "case",

                startTime: new Date(),
                currentAssert: 0,

                stopWatch: launchStopWatch(),

                finalize: function(success) {
                    clearTimeout(this.stopWatch);
                    delete this.stopWatch;

                    var time = (new Date() - this.startTime) / 1000;
                    this.time = this.time || time;

                    testSuite.pureTime += time;
                    rootSuite.pureTime += time;

                    testResults.total++;
                    if(!success) {
                        testResults.failures++;
                    }

                    delete this.startTime;
                    delete this.currentAssert;
                    delete this.finalize;
                }
            };

            function launchStopWatch() {
                return setTimeout(function() {
                    testCase.finalize(false, 0);
                    testCase.name = getTestCaseName(testSuite, qunitData);
                    testCase.url = getTestCaseUrl(testSuite, qunitData);
                    testCase.failure = testCase.failure || { };
                    testCase.failure.message = "Test timed out after " + TEST_TIMEOUT_SECONDS + " seconds!";
                    testSuite.finalize(false, 0);
                }, TEST_TIMEOUT);
            }

            if(testSuite) {
                testSuite.results.push(testCase);
            } else {
                window.RUNNER_ON_MISC_ERROR(qunitData.suiteUrl,
                    "The test suite has already been finalized when an test has executed in the following test" +
                    "\nModule: " + qunitData.module +
                    "\nTest: " + qunitData.name + "\n" +
                    new Error().stack
                );
            }

            $.post(${jsonString('/Main/NotifyTestStarted')}, { name: getTestCaseName(testSuite, qunitData) });
        };

        var indicateTestStatusInTitle = function(failed) {
            document.title = [
                    (failed ? "\u2716" : "\u2714"),
                    document.title.replace(/^[\u2714\u2716] /i, "")
            ].join(" ");
        };

        window.RUNNER_ON_TEST_LOG = function(worker, qunitData) {
            var i = indexFromWorkerName(worker),
                testSuite = suitesInProgress[i];

            if(testSuite && StringEndsWith(qunitData.suiteUrl, escape(testSuite.name))) {
                var testCases = testSuite.results,
                    testCase = testCases[testCases.length - 1];

                ++testCase.currentAssert;
                if(!qunitData.result) {
                    testCase.failure = testCase.failure || { message: "" };
                    testCase.failure.message += testCase.currentAssert + ". " + (qunitData.message || "failed") + "\n";
                    if(qunitData.hasOwnProperty("actual") && qunitData.hasOwnProperty("expected")) {
                        testCase.failure.message += "Expected: " + JSON.stringify(qunitData.expected) + "\n"
                                                  + "Result: " + JSON.stringify(qunitData.actual) + "\n";
                    }
                    testCase.failure.message += "Source:\n" + qunitData.source + "\n\n";
                    testCase.name = getTestCaseName(testSuite, qunitData);
                    testCase.url = getTestCaseUrl(testSuite, qunitData);

                    testCase.failure.message = stripDXCache(testCase.failure.message);

                    indicateTestStatusInTitle(!qunitData.failed);
                }
                else if(qunitData.message && qunitData.message.indexOf && qunitData.message.indexOf("TIME: ") === 0 && qunitData.actual){
                    testCase.name = getTestCaseName(testSuite, qunitData);
                    testCase.time = qunitData.actual;
                }
            } else {
                window.RUNNER_ON_MISC_ERROR(qunitData.suiteUrl,
                       "The test suite has already been finalized when an assert has executed in the following test" +
                       "\nModule: " + qunitData.module +
                       "\nTest: " + qunitData.name + "\n" +
                       new Error().stack
                );
            }
        };

        window.RUNNER_ON_TEST_DONE = function(worker, qunitData) {
            var i = indexFromWorkerName(worker),
                testSuite = suitesInProgress[i],
                testCases,
                testCase;

            notifyDeviceTestManager("QUnit.testCaseDone");
            notifyIsAlive();

            if(testSuite && StringEndsWith(qunitData.suiteUrl, escape(testSuite.name))) {
                testCases = suitesInProgress[i].results;
                testCase = testCases[testCases.length - 1];

                if(qunitData.skipped) {
                    var reason = "Unknown reason",
                        name = qunitData.name;

                    if(name.indexOf("[") > -1) {
                        reason = name.substring(name.indexOf("[") + 1, name.indexOf("]"));
                        name = name.substring(0, name.indexOf("["));
                    }
                    testCase.reason = { message: reason };
                    qunitData.name = name;
                    testCase.name = getTestCaseName(testSuite, qunitData);
                    testCase.url = getTestCaseUrl(testSuite, qunitData);
                    testCase.executed = false;
                }
                testCase.finalize(!qunitData.failed, qunitData.total);
            } else {
                window.RUNNER_ON_MISC_ERROR(qunitData.suiteUrl,
                    "The test suite has already been finalized when the following test has finished running" +
                    "\nModule: " + qunitData.module +
                    "\nTest: " + qunitData.name + "\n" +
                    new Error().stack
                );
            }

            $.post(${jsonString('/Main/NotifyTestCompleted')}, { name: getTestCaseName(testSuite, qunitData), passed:  qunitData.passed === qunitData.total});
        };

        window.RUNNER_ON_DONE = function(worker, qunitData) {
            var i = indexFromWorkerName(worker),
                suite = suitesInProgress[i],
                passed = !qunitData.failed;

            if(suite) {
                if(suite.finalized) {
                    suitesInProgress[i] = null;
                    return;
                }

                var suiteName = suite.name;
                suite.finalize(passed, qunitData.total);

                notifySuiteFinalized(suiteName, passed, qunitData.runtime, function() {
                    nextUrl.call(window, i);
                });
            }
        };

        window.RUNNER_ON_MISC_ERROR = function(worker, msg) {
            msg = String(worker.location || worker) + ": " + msg;
            $.post(${jsonString('/Main/LogMiscError')}, { msg: msg });
        };

        window.onbeforeunload = function(e) {
            if(!isWinPhone) {
                var confirmationMessage = "Tests are Running!";
                (e || window.event).returnValue = confirmationMessage;
                return confirmationMessage;
            }
        };

        function StringEndsWith(phrase, ending) {
            return phrase.indexOf(ending, phrase.length - ending.length) !== -1;
        };

        function stripDXCache(text) {
            return String(text).replace(/[?&]DX_HTTP_CACHE=\w+/g, "");
        }

        function notifyDeviceTestManager(text) {
            if(window.external && "notify" in external) {
                external.notify(text);
            } else if("DevExtremeTestWorkerBridge" in window) {
                DevExtremeTestWorkerBridge.notify(text);
            }
        }

        var activeFinalizationRequests = 0;
        var maxConcurrentFinalizations = 3;
        var finalizationQueue = [];

        function notifySuiteFinalized(name, passed, runtime, callback) {
            finalizationQueue.push({ name: name, passed: passed, runtime: runtime, callback: callback });
            processFinalizationQueue();
        }

        function processFinalizationQueue() {
            while (finalizationQueue.length > 0 && activeFinalizationRequests < maxConcurrentFinalizations) {
                var item = finalizationQueue.shift();
                executeNotifySuiteFinalized(item.name, item.passed, item.runtime, item.callback);
            }
        }

        function executeNotifySuiteFinalized(name, passed, runtime, callback) {
            activeFinalizationRequests++;

            var callbackCalled = false;
            var safeCallback = function() {
                if(callbackCalled) return;
                callbackCalled = true;
                if(callback) callback();
            };

            var safetyTimer = setTimeout(function() {
                activeFinalizationRequests--;
                safeCallback();
                processFinalizationQueue();
            }, 20000);

            $.ajax({
                url: ${jsonString('/Main/NotifySuiteFinalized')},
                type: 'POST',
                data: { name: name, passed: passed, runtime: runtime },
                timeout: 10000
            }).always(function() {
                clearTimeout(safetyTimer);
                activeFinalizationRequests--;
                safeCallback();
                processFinalizationQueue();
            });
        }
        var lastAliveTime = 0;
        var aliveThrottleMs = 5000;
        var pendingAlive = false;

        function notifyIsAlive(){
            var now = Date.now();
            var timeSinceLastAlive = now - lastAliveTime;

            if (timeSinceLastAlive < aliveThrottleMs) {
                if (!pendingAlive) {
                    pendingAlive = true;
                    setTimeout(function() {
                        pendingAlive = false;
                        notifyIsAlive();
                    }, aliveThrottleMs - timeSinceLastAlive);
                }
                return;
            }

            lastAliveTime = now;

            $.ajax({
                url: ${jsonString('/Main/NotifyIsAlive')},
                type: 'POST',
                timeout: 10000
            });
        }

        function roundTime(time) {
            return +(time.toFixed(3));
        }

        createWorkers();
        runFirstBatch();
    });
</script>

<div id="workers">

</div>
<div>
    <div>
        <h1 id="title"></h1>
        <h2 id="branch"></h2>
    </div>
</div>
<iframe id="reportFrame" name="reportFrame"></iframe>
`;
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
            '@@preact/signals-core': '/packages/devextreme/artifacts/js-systemjs/preact-signals.js',
        }
        : {
            'devextreme-cldr-data': '/packages/devextreme/node_modules/devextreme-cldr-data',
            'cldr-core': '/packages/devextreme/node_modules/cldr-core',
            '@@preact/signals-core': '/packages/devextreme/node_modules/@preact/signals-core/dist/signals-core.js',
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

    return `<!DOCTYPE html>
<head>
    ${runProps.NoCsp ? '' : `<meta
            http-equiv="Content-Security-Policy"
            content="
                default-src 'self';
                script-src 'self' 'nonce-M5H5tE' 'nonce-TEiwcJ' 'nonce-IpCks6' 'nonce-Z27qXj' 'nonce-wIkO6u';
                style-src 'self' about: https://fonts.googleapis.com 'nonce-tYGMxb' 'nonce-qunit-test' 'nonce-qunit-extension';
                img-src 'self' data:;
                font-src 'self' https://fonts.gstatic.com;
                connect-src 'self' https://js.devexpress.com;
            "
        />`}
    <title>${escapeHtml(model.Title)} - QUnit test page</title>
    <link rel="stylesheet" href="${qunitCss}" />
    <script src="${qunitJs}"></script>

    <script nonce="M5H5tE">
        window.ROOT_URL = "/";
        window.farmMode = ${jsonString(runProps.IsContinuousIntegration)};

        QUnit.config.autostart = false;
        QUnit.config.failOnZeroTests = false;
    </script>
    <script src="${qunitExtensionsJs}"></script>

    <style nonce="tYGMxb">
        #qunit-fixture.qunit-fixture-visible {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            pointer-events: none;
        }

        #qunit-fixture.qunit-fixture-visible * {
            pointer-events: auto;
        }



        a.up {
            width: 30px;
            height: 30px;
            margin-top: 12px;
            margin-left: 10px;
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAvklEQVQ4y2NgoAa4yvjH9bc0Ccr/Jv//+O/Qbxlilaf8//D///9/RGmBK/8P1nLwtyxh5e//IwB+LRjK8WvBqhyfln9ucOVfofSv/98hWv7vwqLhfzpU2ZV/dVDWxX/1UC1PcGu48sf4vw9Uw8kfHEAtP/BpuPrH+AUDQgMDA1QLDg1X/xi9ALGQNEC13MXmadc/hi8gWlE0MDB8Z/+XhkXDC8YXMLvQNICCHG98Y2ogAEamBqX/RWAYxTAgAACFCjwy8XB3SQAAAABJRU5ErkJggg==) no-repeat;
            display: inline-block;
            float: left;
        }
    </style>

    <script nonce="TEiwcJ">
        (function() {
            var doneCount = 0,
                parentWindow = window.opener || window.parent;

            QUnit.done(function(data) {
                if(doneCount == 1)
                    notifyExtraDoneCall();

                if(!doneCount && parentWindow && parentWindow.RUNNER_ON_DONE)
                    parentWindow.RUNNER_ON_DONE(window, data);

                doneCount++;
            });

            QUnit.testStart(function(data) {
                data.suiteUrl = location.pathname;
                if(parentWindow && parentWindow.RUNNER_ON_TEST_START)
                    parentWindow.RUNNER_ON_TEST_START(window, data);
            });

            QUnit.log(function(data) {
                data.suiteUrl = location.pathname;
                if(parentWindow && parentWindow.RUNNER_ON_TEST_LOG)
                    parentWindow.RUNNER_ON_TEST_LOG(window, data);
            });

            QUnit.testDone(function(data) {
                data.suiteUrl = location.pathname;
                if(parentWindow && parentWindow.RUNNER_ON_TEST_DONE )
                    parentWindow.RUNNER_ON_TEST_DONE(window, data);
            });

            QUnit.config.urlConfig.push({
                id: "nojquery",
                label: "No jQuery",
                tooltip: "Don't use jQuery for widget rendering"
            });

            QUnit.config.urlConfig.push({
                id: "nocsp",
                label: "No CSP",
                tooltip: "Use noscp components without CSP checks",
            });

            function notifyExtraDoneCall() {
                var msg = "QUnit.done called several times. Possible causes: extra start() calls, assertion outside test context";

                if(parentWindow && parentWindow.RUNNER_ON_MISC_ERROR) {
                    parentWindow.RUNNER_ON_MISC_ERROR(window, msg);
                } else {
                    alert("ALARM! DO NOT IGNORE THIS!\\n" + msg);
                }
            }
        })();
    </script>

    <script src="${jqueryJs}"></script>

    <script src="${sinonJs}"></script>

    <script src="${systemJs}"></script>

    <script nonce="IpCks6">
        (function() {
            window.process = window.process || {};
            window.process.env = window.process.env || {};
            window.process.env.NODE_ENV = 'test';

            jQuery.noConflict();

            var cacheBuster = ${jsonString(cacheBuster)};
            if(cacheBuster.length) {
                var systemLocate = SystemJS.locate;
                SystemJS.locate = function(load) {
                    return Promise.resolve(systemLocate.call(this, load)).then(function(address) {
                        return address + ( address.indexOf('?') === -1 ? '?' : '&') + cacheBuster;
                    });
                }
            }

            SystemJS.config(${jsonString(systemConfig)});
        })();
    </script>
</head>
<a class="up" href="/"></a>
<div id="qunit"></div>
<div id="qunit-fixture"></div>

<script nonce="Z27qXj">
    (function() {
        var integrationImportPaths = ${jsonString(integrationImportPaths)};

        var imports = integrationImportPaths.map(function(importPath) {
            return SystemJS.import(importPath);
        });

        imports.push(new Promise(function(resolve) {
            jQuery(resolve);
        }));

        Promise.all(imports)
        .then(function() {
            var isNotWebkitBrowser = window.navigator.userAgent.toLowerCase().indexOf("webkit") < 0;

            if(${jsonString(isServerSideTest)} && isNotWebkitBrowser) {
                return;
            }

            return SystemJS.import(${jsonString(getTestUrl())});
        })
        .then(function() {
            QUnit.start();
        })
        .catch(function (err) {
            QUnit.start();
            QUnit.test("load failed", function(assert) {
                throw err;
            });
        });
    })();
</script>
`;
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
                        text = text.substring(index + 1, text.length - 2).trim();
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
