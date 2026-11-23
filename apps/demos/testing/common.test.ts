import { glob } from 'glob';
import { join } from 'path';
import { existsSync, mkdirSync, appendFileSync } from 'fs';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import {
  runTestAtPage,
  shouldRunFramework,
  shouldRunTestAtIndex,
  globalReadFrom,
  changeTheme,
  waitForAngularLoading,
  waitForStylesheets,
  shouldSkipDemo,
  FRAMEWORKS,
  execCode,
  injectStyle,
} from '../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../utils/visual-tests/helpers/theme-utils';
import { getTestGlobalsScriptPath } from '../utils/visual-tests/test-globals-bundle';
import { knownWarnings } from './known-warnings';
import { skippedTests } from './skipped-tests';
import { widgetsGalleryServiceMock } from './apiMocks/widgetsGalleryServiceMock';
import { xmlaServiceMock } from './apiMocks/xmlaServiceMock';

const execTestCafeCode = (t, code) => {
  // eslint-disable-next-line no-eval
  const testCafeFunction = eval(code);
  return testCafeFunction(t);
};

const getClientCspViolations = ClientFunction(() => (window as any).__cspViolations || []);

const isCspEnabled = () => process.env.CSP_REPORT === 'true';

const cspReportDir = join(__dirname, '..', 'csp-reports');
const cspReportFile = join(cspReportDir, 'csp-violations.jsonl');

const writeCspReport = (testName: string, framework: string, violations: any[]) => {
  if (!violations.length) return;
  if (!existsSync(cspReportDir)) {
    mkdirSync(cspReportDir, { recursive: true });
  }
  for (const v of violations) {
    const entry = {
      test: testName,
      framework,
      ...v,
    };
    appendFileSync(cspReportFile, `${JSON.stringify(entry)}\n`);
  }
};

const getClientScripts = (approach: string) => {
  const scripts = [
    { module: 'mockdate' },
  ];

  const testGlobalsScriptPath = getTestGlobalsScriptPath(approach);
  if (testGlobalsScriptPath) {
    // @ts-expect-error
    scripts.push(testGlobalsScriptPath);
  }

  if (isCspEnabled()) {
    scripts.push(
      // @ts-expect-error
      join(__dirname, '../utils/visual-tests/inject/csp-listener.js'),
    );
  }

  scripts.push(
    // @ts-expect-error
    join(__dirname, '../utils/visual-tests/inject/test-utils.js'),
    { content: injectStyle(globalReadFrom(__dirname, '../utils/visual-tests/inject/test-styles.css', (x) => x)) },
    {
      content: `
        window.addEventListener('error', function (e) {
            console.error(e.message);
        });`,
    }
  );

  return scripts;
};

Object.values(FRAMEWORKS).forEach((approach) => {
  if (!shouldRunFramework(approach)) { return; }
  // jQuery screenshots are taken by Playwright (common.spec.ts).
  if (approach === FRAMEWORKS.jquery) { return; }
  fixture(approach)
    .beforeEach(async (t) => {
      await t.resizeWindow(1000, 800);
    })
    .clientScripts(getClientScripts(approach))
    .requestHooks(widgetsGalleryServiceMock, xmlaServiceMock);

  const getDemoPaths = (platform) => glob.sync('Demos/*/*')
    .map((path) => join(path, platform));

  getDemoPaths(approach).forEach((demoPath, index) => {
    if (!shouldRunTestAtIndex(index + 1) || !existsSync(demoPath)) { return; }

    const readFrom = (relativePath, mapCallback) => globalReadFrom(demoPath, relativePath, mapCallback);

    const testParts = demoPath.split(/[/\\]/);
    const widgetName = testParts[1];
    const demoName = testParts[2];
    const testName = `${widgetName}-${demoName}`;

    const clientScriptSource = readFrom('../client-script.js', (x) => [{ content: x }]) || [];
    const testCodeSource = readFrom('../test-code.js', (x) => x);
    const testCafeCodeSource = readFrom('../testcafe-test-code.js', (x) => x);
    const visualTestSettings = readFrom('../visualtestrc.json', (x) => JSON.parse(x));
    const visualTestStyles = readFrom('../test-styles.css', (x) => injectStyle(x));

    let comparisonOptions;
    if (process.env.DISABLE_DEMO_TEST_SETTINGS !== 'all') {
      const approachLowerCase = approach.toLowerCase();
      const mergedTestSettings = (visualTestSettings && {
        ...visualTestSettings,
        ...visualTestSettings[approachLowerCase],
      }) || {};

      if (process.env.CI_ENV && process.env.DISABLE_DEMO_TEST_SETTINGS !== 'ignore') {
        if (mergedTestSettings.ignore) { return; }
      }
      if (process.env.DISABLE_DEMO_TEST_SETTINGS !== 'comparison-options') {
        comparisonOptions = mergedTestSettings['comparison-options'];
      }
    }

    changeTheme(__dirname, `../${demoPath}/index.html`, process.env.THEME);
    const pageURL = `http://127.0.0.1:8080/apps/demos/Demos/${widgetName}/${demoName}/${approach}/`;

    if (shouldSkipDemo(approach, widgetName, demoName, skippedTests)) {
      return;
    }

    runTestAtPage(
      test,
      pageURL
    )
      .clientScripts(clientScriptSource)(testName, async (t) => {
        await waitForStylesheets();

        if (visualTestStyles) {
          await execCode(visualTestStyles);
        }

        if (approach === 'Angular') {
          await waitForAngularLoading();
        }

        if (testCodeSource) {
          await execCode(testCodeSource);
        }
        if (testCafeCodeSource) {
          await execTestCafeCode(t, testCafeCodeSource);
        }

        const consoleMessages = await t.getBrowserConsoleMessages();
        const errors = [...consoleMessages.error, ...consoleMessages.warn]
          .filter((e) => !knownWarnings.some((kw) => e.startsWith(kw)))
          .filter((e) => !e.startsWith('[CSP Violation]'));
        await t.expect(errors).eql([]);

        if (isCspEnabled()) {
          const cspViolations = await getClientCspViolations();
          writeCspReport(testName, approach, cspViolations);
        }

        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        await testScreenshot(t, takeScreenshot, `${testName}.png`, undefined, comparisonOptions);

        await t
          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      });
  });
});
