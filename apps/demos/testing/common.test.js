import { glob } from 'glob';
import { ClientFunction } from 'testcafe';
import { join } from 'path';
import { existsSync } from 'fs';
import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { axeCheck, createReport } from '@testcafe-community/axe';
import {
  getPortByIndex,
  runTestAtPage,
  shouldRunFramework,
  shouldRunTestAtIndex,
  globalReadFrom,
  changeTheme,
  waitForAngularLoading,
  shouldSkipDemo,
} from '../utils/visual-tests/matrix-test-helper';
import {
  getThemePostfix,
  THEME,
} from '../utils/visual-tests/helpers/theme-utils';

import { createMdReport, createTestCafeReport } from '../utils/axe-reporter/reporter';
import knownWarnings from './known-warnings.json';

const execCode = ClientFunction((code) => {
  // eslint-disable-next-line no-eval
  const result = eval(code);
  if (result && typeof result.then === 'function') {
    // eslint-disable-next-line no-promise-executor-return
    return Promise.race([result, new Promise((resolve) => setTimeout(resolve, 60000))]);
  }

  return Promise.resolve();
});

const injectStyle = (style) => `
    var style = document.createElement('style'); 
    style.innerHTML = \`${style}\`;
    document.getElementsByTagName('head')[0].appendChild(style);
  `;

const execTestCafeCode = (t, code) => {
  // eslint-disable-next-line no-eval
  const testCafeFunction = eval(code);
  return testCafeFunction(t);
};

const SKIP_ACCESSIBILITY_TESTS = ['TabPanel-Overview'];
const COMMON_SKIP_RULES = ['color-contrast'];
const getTestSpecificSkipRules = (testName) => {
  switch (testName) {
    case 'Calendar-MultipleSelection':
    case 'DataGrid-ExcelJSCellCustomization':
    case 'DataGrid-HorizontalVirtualScrolling':
    case 'DataGrid-PDFCellCustomization':
      return ['empty-table-header'];
    case 'DataGrid-Filtering':
    case 'DataGrid-FilterPanel':
    case 'Localization-UsingGlobalize':
    case 'Localization-UsingIntl':
      return ['label'];
    case 'DataGrid-RowTemplate':
    case 'DataGrid-Row3RdPartyEngineTemplate':
      return ['aria-required-children', 'image-alt'];
    case 'DataGrid-CustomNewRecordPosition':
      return ['link-name'];
    case 'DataGrid-Column3RdPartyEngineTemplate':
    case 'DataGrid-ColumnTemplate':
    case 'DataGrid-ExcelJSExportImages':
    case 'DataGrid-FilteringAPI':
    case 'DataGrid-MasterDetailAPI':
    case 'DataGrid-PDFExportImages':
    case 'DataGrid-RowSelection':
    case 'FilterBuilder-WithList':
      return ['image-alt'];
    case 'TagBox-Overview':
      return ['image-alt', 'image-redundant-alt'];
    default:
      return [];
  }
};

const SKIPPED_TESTS = {
  Angular: {
    DataGrid: [
      { demo: 'ToolbarCustomization', themes: [THEME.fluent] },
    ],
    Scheduler: [
      { demo: 'Overview', themes: [THEME.fluent, THEME.material] },
    ],
  },
  React: {
    DataGrid: [
      { demo: 'SignalRService', themes: [THEME.material] },
    ],
    Scheduler: [
      { demo: 'Overview', themes: [THEME.fluent, THEME.material] },
    ],
  },
};

['jQuery', 'React', 'Vue', 'Angular'].forEach((approach) => {
  if (!shouldRunFramework(approach)) { return; }
  fixture(approach)
    .beforeEach(async (t) => {
      // eslint-disable-next-line spellcheck/spell-checker
      t.ctx.watchDogHandle = setTimeout(() => { throw new Error('test timeout exceeded'); }, 3 * 60 * 1000);
      await t.resizeWindow(1000, 800);
    })
    // eslint-disable-next-line spellcheck/spell-checker
    .afterEach((t) => clearTimeout(t.ctx.watchDogHandle))
    .clientScripts([
      { module: 'mockdate' },
      { module: 'axe-core/axe.min.js' },
      join(__dirname, '../utils/visual-tests/inject/test-utils.js'),
      { content: injectStyle(globalReadFrom(__dirname, '../utils/visual-tests/inject/test-styles.css')) },
      {
        content: `
          window.addEventListener('error', function (e) {
              console.error(e.message); 
          });`,
      },
    ]);

  const getDemoPaths = (platform) => glob.sync('Demos/*/*')
    .map((path) => join(path, platform));
  const ACCESSIBILITY_UNSUPPORTED_COMPONENTS = [
    'Accordion',
    'Charts',
    'Diagram',
    'FileManager',
    'Gantt',
    'Scheduler',
    'PivotGrid',
  ];
  const BROKEN_THIRD_PARTY_SCRIPTS_COMPONENT = [
    'Map',
  ];

  getDemoPaths(approach).forEach((demoPath, index) => {
    if (!shouldRunTestAtIndex(index + 1) || !existsSync(demoPath)) { return; }
    // eslint-disable-next-line max-len
    const readFrom = (relativePath, mapCallback) => globalReadFrom(demoPath, relativePath, mapCallback);

    const testParts = demoPath.split(/[/\\]/);
    const widgetName = testParts[1];
    const demoName = testParts[2];
    const testName = `${widgetName}-${demoName}`;

    const clientScriptSource = readFrom('../client-script.js', (x) => [{ content: x }]) || [];
    const testCodeSource = readFrom('../test-code.js');
    const testCafeCodeSource = readFrom('../testcafe-test-code.js');
    const visualTestSettings = readFrom('../visualtestrc.json', (x) => JSON.parse(x));
    const visualTestStyles = readFrom('../test-styles.css', (x) => injectStyle(x));

    let comparisonOptions;
    if (process.env.DISABLE_DEMO_TEST_SETTINGS !== 'all') {
      const approachLowerCase = approach.toLowerCase();
      const mergedTestSettings = (visualTestSettings && {
        ...visualTestSettings,
        ...visualTestSettings[approachLowerCase],
      }) || {};

      if (process.env.STRATEGY === 'accessibility' && ACCESSIBILITY_UNSUPPORTED_COMPONENTS.indexOf(widgetName) > -1) {
        return;
      }
      if (BROKEN_THIRD_PARTY_SCRIPTS_COMPONENT.indexOf(widgetName) > -1) {
        return;
      }
      if (process.env.CI_ENV && process.env.DISABLE_DEMO_TEST_SETTINGS !== 'ignore') {
        if (mergedTestSettings.ignore) { return; }
      }
      if (process.env.DISABLE_DEMO_TEST_SETTINGS !== 'comparison-options') {
        comparisonOptions = mergedTestSettings['comparison-options'];
      }
    }

    changeTheme(__dirname, `../${demoPath}/index.html`, process.env.THEME);

    runTestAtPage(test, `http://127.0.0.1:808${getPortByIndex(index)}/apps/demos/Demos/${widgetName}/${demoName}/${approach}/`)
      .clientScripts(clientScriptSource)(testName, async (t) => {
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

        if (process.env.STRATEGY === 'accessibility') {
          if (SKIP_ACCESSIBILITY_TESTS.indexOf(testName) > -1) {
            return;
          }

          const specificSkipRules = getTestSpecificSkipRules(testName);
          const options = { rules: { } };

          [...COMMON_SKIP_RULES, ...specificSkipRules].forEach((ruleName) => {
            options.rules[ruleName] = { enabled: false };
          });

          const axeResult = await axeCheck(t, '.demo-container', options);
          const { error, results } = axeResult;

          if (results.violations.length > 0) {
            createMdReport({ testName, results });
            await t.report(createTestCafeReport(results.violations));
          }

          await t.expect(error).notOk();
          await t.expect(results.violations.length === 0).ok(createReport(results.violations));
        } else {
          const testTheme = process.env.THEME;

          if (shouldSkipDemo(approach, widgetName, demoName, SKIPPED_TESTS)) {
            return;
          }

          const comparisonResult = await compareScreenshot(t, `${testName}${getThemePostfix(testTheme)}.png`, undefined, comparisonOptions);

          const consoleMessages = await t.getBrowserConsoleMessages();
          if (!comparisonResult) {
            // eslint-disable-next-line no-console
            console.log(consoleMessages);
          }

          const errors = [...consoleMessages.error, ...consoleMessages.warn]
            .filter((e) => !knownWarnings.some((kw) => e.startsWith(kw)));

          await t.expect(errors).eql([]);

          await t.expect(comparisonResult).ok('INVALID_SCREENSHOT');
        }
      });
  });
});
