#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-use-before-define */

import * as fs from 'node:fs';
import * as http from 'node:http';
import * as os from 'node:os';
import * as path from 'node:path';

import {
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
  safeDecodeURIComponent,
  safeReadFile,
  splitCommaList,
} from './lib/utils';
import { createRunnerLogger } from './lib/logger';
import { createTemplateRenderer } from './lib/templates';
import { createPagesRenderer } from './lib/pages';
import { createSuitesService } from './lib/suites';
import { createResultsReporter } from './lib/results';
import { createVectorMapService } from './lib/vectormap';
import {
  sendHtml,
  sendJson,
  sendNotFound,
  sendText,
  sendXml,
  setNoCacheHeaders,
  setStaticCacheHeaders,
} from './lib/http';
import { createStaticFileService } from './lib/static';
import {
  BaseRunProps,
  ConstellationFilter,
  ConstellationName,
  KNOWN_CONSTELLATION_NAMES,
  RunAllModel,
  TestResultsPayload,
} from './lib/types';

const KNOWN_CONSTELLATIONS = new Set<ConstellationName>(KNOWN_CONSTELLATION_NAMES);

const RUNNER_ROOT = fs.existsSync(path.join(__dirname, 'templates'))
  ? __dirname
  : path.resolve(__dirname, '..');
const PACKAGE_ROOT = path.resolve(RUNNER_ROOT, '../..');
const WORKSPACE_ROOT = path.resolve(PACKAGE_ROOT, '../..');
const TESTING_ROOT = path.join(PACKAGE_ROOT, 'testing');
const TESTS_ROOT = path.join(TESTING_ROOT, 'tests');
const VECTOR_DATA_DIRECTORY = path.join(TESTING_ROOT, 'content', 'VectorMapData');
const TEMPLATES_ROOT = path.join(RUNNER_ROOT, 'templates');

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

const logger = createRunnerLogger(RAW_LOG_FILENAME);
const templates = createTemplateRenderer(TEMPLATES_ROOT, escapeHtml);
const pages = createPagesRenderer({
  contentWithCacheBuster,
  getCacheBuster,
  jsonString,
  renderTemplate: templates.renderTemplate,
});
const suitesService = createSuitesService({
  knownConstellations: KNOWN_CONSTELLATIONS,
  testsRoot: TESTS_ROOT,
});
const resultsReporter = createResultsReporter({
  escapeXmlAttr,
  escapeXmlText,
  normalizeNumber,
});
const vectorMapService = createVectorMapService({
  packageRoot: PACKAGE_ROOT,
  testingRoot: TESTING_ROOT,
  vectorDataDirectory: VECTOR_DATA_DIRECTORY,
});
const staticFiles = createStaticFileService({
  escapeHtml,
  rootDirectory: WORKSPACE_ROOT,
  setNoCacheHeaders,
  setStaticCacheHeaders,
});

start();

function start(): void {
  const server = http.createServer((req, res) => {
    handleRequest(req, res).catch((error: unknown) => {
      logger.writeError(error instanceof Error && error.stack ? error.stack : String(error));
      if (!res.headersSent) {
        setNoCacheHeaders(res);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      }
      if (!res.writableEnded) {
        res.end('Internal Server Error');
      }
    });
  });

  server.listen(QUNIT_PORT, '0.0.0.0', () => {
    logger.writeLine(`QUnit runner server listens on http://0.0.0.0:${QUNIT_PORT}...`);
  });
}

async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  const requestUrl = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  const pathname = safeDecodeURIComponent(requestUrl.pathname);
  const pathnameLower = pathname.toLowerCase();

  if (req.method === 'GET' && (pathname === '/' || pathnameLower === '/main/index')) {
    sendHtml(res, pages.renderIndexPage());
    return;
  }

  if (req.method === 'GET') {
    const suitesJsonMatch = /^\/Main\/SuitesJson(?:\/(.+))?$/i.exec(pathname);
    if (suitesJsonMatch) {
      const id = suitesJsonMatch[1]
        ? safeDecodeURIComponent(suitesJsonMatch[1])
        : requestUrl.searchParams.get('id');
      const suites = suitesService.readSuites(id ?? '');
      sendJson(res, suites);
      return;
    }
  }

  if (req.method === 'GET' && pathnameLower === '/main/categoriesjson') {
    sendJson(res, suitesService.readCategories());
    return;
  }

  if ((req.method === 'GET' || req.method === 'HEAD')
        && (pathnameLower === '/run' || pathnameLower === '/run/' || pathnameLower === '/main/runall')) {
    if (req.method === 'HEAD') {
      setNoCacheHeaders(res);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end();
      return;
    }

    const model = buildRunAllModel(requestUrl.searchParams);
    const runProps = assignBaseRunProps(requestUrl.searchParams);
    sendHtml(res, pages.renderRunAllPage(model, runProps));
    return;
  }

  if (req.method === 'GET') {
    const runSuiteMatch = /^\/run\/([^/]+)\/(.+\.js)$/i.exec(pathname);
    if (runSuiteMatch) {
      const catName = safeDecodeURIComponent(runSuiteMatch[1]);
      const suiteName = safeDecodeURIComponent(runSuiteMatch[2]);
      const model = suitesService.buildRunSuiteModel(catName, suiteName);
      const runProps = assignBaseRunProps(requestUrl.searchParams);
      sendHtml(res, pages.renderRunSuitePage(model, runProps, requestUrl.searchParams));
      return;
    }
  }

  if (req.method === 'GET' && pathnameLower === '/main/runsuite') {
    const catName = requestUrl.searchParams.get('catName') ?? '';
    const suiteName = requestUrl.searchParams.get('suiteName') ?? '';

    if (!catName || !suiteName) {
      sendNotFound(res);
      return;
    }

    const model = suitesService.buildRunSuiteModel(catName, suiteName);
    const runProps = assignBaseRunProps(requestUrl.searchParams);
    sendHtml(res, pages.renderRunSuitePage(model, runProps, requestUrl.searchParams));
    return;
  }

  if (req.method === 'POST' && pathnameLower === '/main/notifyteststarted') {
    const form = await readFormBody(req);
    const name = String(form.name ?? '');

    try {
      logger.writeLine(`       [ run] ${name}`);
    } catch {
      // Ignore logging errors.
    }

    sendText(res, 'OK');
    return;
  }

  if (req.method === 'POST' && pathnameLower === '/main/notifytestcompleted') {
    const form = await readFormBody(req);
    const name = String(form.name ?? '');
    const passed = parseBoolean(form.passed);

    try {
      logger.writeLine(`       [${passed ? '  ok' : 'fail'}] ${name}`);
    } catch {
      // Ignore logging errors.
    }

    sendText(res, 'OK');
    return;
  }

  if (req.method === 'POST' && pathnameLower === '/main/notifysuitefinalized') {
    const form = await readFormBody(req);
    const name = String(form.name ?? '');
    const passed = parseBoolean(form.passed);
    const runtime = parseNumber(form.runtime);

    try {
      if (passed && RUN_FLAGS.isContinuousIntegration) {
        fs.appendFileSync(COMPLETED_SUITES_FILENAME, `${name}${os.EOL}`);
      }

      if (RUN_FLAGS.isContinuousIntegration) {
        writeLastSuiteTime();
      }

      logger.write(passed ? '[ OK ' : '[FAIL', passed ? 'green' : 'red');
      const seconds = Number((runtime / 1000).toFixed(3));
      logger.writeLine(`] ${name} in ${seconds}s`);
    } catch {
      // Preserve legacy behavior: swallow errors.
    }

    sendText(res, 'OK');
    return;
  }

  if (req.method === 'POST' && pathnameLower === '/main/notifyisalive') {
    try {
      if (RUN_FLAGS.isContinuousIntegration) {
        writeLastSuiteTime();
      }
    } catch {
      // Preserve legacy behavior: swallow errors.
    }

    sendText(res, 'OK');
    return;
  }

  if (req.method === 'POST' && pathnameLower === '/main/saveresults') {
    await saveResults(req, res);
    return;
  }

  if (req.method === 'GET' && pathnameLower === '/main/displayresults') {
    const stylesheetUrl = '/packages/devextreme/testing/content/unittests.xsl';
    const xml = [
      '<?xml version="1.0"?>',
      `<?xml-stylesheet type="text/xsl" href="${stylesheetUrl}"?>`,
      '<cruisecontrol>',
      safeReadFile(RESULTS_XML_FILENAME),
      '</cruisecontrol>',
      '',
    ].join('\n');

    sendXml(res, xml);
    return;
  }

  if (req.method === 'POST' && pathnameLower === '/main/logmiscerror') {
    const form = await readFormBody(req);
    const message = String(form.msg ?? '');
    logMiscErrorCore(message);
    sendText(res, 'OK');
    return;
  }

  if (req.method === 'GET' && pathnameLower === '/themes-test/get-css-files-list') {
    const list = vectorMapService.readThemeCssFiles();
    sendJson(res, list);
    return;
  }

  if (req.method === 'GET' && pathnameLower === '/testvectormapdata/gettestdata') {
    const data = vectorMapService.readVectorMapTestData();
    sendJson(res, data);
    return;
  }

  if (staticFiles.tryServeStatic(req, res, pathname, requestUrl.searchParams)) {
    return;
  }

  sendNotFound(res);
}

function buildRunAllModel(searchParams: URLSearchParams): RunAllModel {
  let includeSet: Set<string> | null = null;
  let excludeSet: Set<string> | null = null;
  let excludeSuites: Set<string> | null = null;
  let partIndex = 0;
  let partCount = 1;

  let constellation: ConstellationFilter = searchParams.get('constellation') ?? '';
  const include = searchParams.get('include');
  const exclude = searchParams.get('exclude');

  if (include) {
    includeSet = new Set(splitCommaList(include));
  }

  if (exclude) {
    excludeSet = new Set(splitCommaList(exclude));
  }

  if (constellation.includes('(') && constellation.endsWith(')')) {
    const [name, partInfo] = constellation.slice(0, -1).split('(');
    const parts = partInfo.split('/');

    constellation = name;
    partIndex = Number(parts[0]) - 1;
    partCount = Number(parts[1]);
  }

  if (RUN_FLAGS.isContinuousIntegration && fs.existsSync(COMPLETED_SUITES_FILENAME)) {
    const completedSuites = fs.readFileSync(COMPLETED_SUITES_FILENAME, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    excludeSuites = new Set(completedSuites);
  }

  return {
    Constellation: constellation,
    CategoriesList: include ?? '',
    Version: readPackageVersion(),
    Suites: suitesService.getAllSuites({
      deviceMode: hasDeviceModeFlag(searchParams),
      constellation,
      includeCategories: includeSet,
      excludeCategories: excludeSet,
      excludeSuites,
      partIndex,
      partCount,
    }),
  };
}

function assignBaseRunProps(searchParams: URLSearchParams): BaseRunProps {
  const maxWorkersRaw = process.env.MAX_WORKERS;

  const result: BaseRunProps = {
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

  if (typeof maxWorkersRaw === 'string' && /^\d+$/.test(maxWorkersRaw)) {
    result.MaxWorkers = Number(maxWorkersRaw);
  }

  return result;
}

function hasDeviceModeFlag(searchParams: URLSearchParams): boolean {
  return searchParams.has('deviceMode');
}

async function saveResults(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  let hasFailure = false;
  let xml = '';

  try {
    const json = await readBodyText(req);
    resultsReporter.validateResultsJson(json);

    const parsedResults: TestResultsPayload = resultsReporter.parseResultsJson(json);
    hasFailure = parsedResults.failures > 0;
    xml = resultsReporter.testResultsToXml(parsedResults);

    if (RUN_FLAGS.singleRun) {
      logger.writeLine();
      resultsReporter.printTextReport(parsedResults, logger.writeLine.bind(logger));
    }
  } catch(error) {
    const message = error instanceof Error && error.stack ? error.stack : String(error);
    logMiscErrorCore(`Failed to save results. ${message}`);
    hasFailure = true;
  }

  fs.writeFileSync(RESULTS_XML_FILENAME, xml, 'utf8');

  sendText(res, 'OK');

  if (RUN_FLAGS.singleRun) {
    setTimeout(() => {
      process.exit(hasFailure ? 1 : 0);
    }, 0);
  }
}

function writeLastSuiteTime(): void {
  fs.writeFileSync(LAST_SUITE_TIME_FILENAME, formatDateForSuiteTimestamp(new Date()), 'utf8');
}

function logMiscErrorCore(data: string): void {
  if (!RUN_FLAGS.isContinuousIntegration) {
    return;
  }

  try {
    fs.appendFileSync(MISC_ERRORS_FILENAME, `${data}${os.EOL}`, 'utf8');
  } catch {
    // Ignore logging errors.
  }
}

function stringifyPrimitive(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return '';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readPackageVersion(): string {
  const parsed = JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf8')) as unknown;

  if (isRecord(parsed)) {
    return stringifyPrimitive(parsed.version);
  }

  return '';
}
