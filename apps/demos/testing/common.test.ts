import { glob } from 'glob';
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
  FRAMEWORKS,
  execCode,
  injectStyle,
} from '../utils/visual-tests/matrix-test-helper';
import { getThemePostfix } from '../utils/visual-tests/helpers/theme-utils';
import { createMdReport, createTestCafeReport } from '../utils/axe-reporter/reporter';
import { accessibilityUnsupportedComponents } from './accessibility-unsupported-components';
import { knownWarnings } from './known-warnings';
import { skipJsErrorsComponents } from './skip-js-errors-components';
import { skippedTests } from './skipped-tests';

import { gitHubIgnored } from '../utils/visual-tests/github-ignored-list';

const execTestCafeCode = (t, code) => {
  // eslint-disable-next-line no-eval
  const testCafeFunction = eval(code);
  return testCafeFunction(t);
};

const COMMON_SKIP_RULES = ['color-contrast'];
const getTestSpecificSkipRules = (testName) => {
  switch (testName) {
    case 'Calendar-MultipleSelection':
      return ['empty-table-header'];
    case 'Localization-UsingGlobalize':
      return ['label'];
    default:
      return [];
  }
};

const getClientScripts = () => {
  const scripts = [
    { module: 'mockdate' },
  ];

  if (process.env.STRATEGY === 'accessibility') {
    scripts.push({ module: 'axe-core/axe.min.js' });
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
  fixture(approach)
    .beforeEach(async (t) => {
      t.ctx.watchDogHandle = setTimeout(() => { throw new Error('test timeout exceeded'); }, 3 * 60 * 1000);

      if (process.env.STRATEGY !== 'accessibility') {
        await t.resizeWindow(1000, 800);
      }
    })
    .afterEach(async (t) => clearTimeout(t.ctx.watchDogHandle))
    .clientScripts(getClientScripts());

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
      if (process.env.STRATEGY === 'accessibility' && accessibilityUnsupportedComponents.indexOf(widgetName) > -1) {
        return;
      }

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

    const isGitHubDemos = process.env.ISGITHUBDEMOS;
    let pageURL = '';
    const theme = process.env.THEME.replace('generic.', '');
    if (isGitHubDemos) {
      pageURL = `http://127.0.0.1:808${getPortByIndex(index)}/Demos/${widgetName}/${demoName}/${approach}/?theme=dx.${theme}`;
    } else {
      changeTheme(__dirname, `../${demoPath}/index.html`, process.env.THEME);
      pageURL = `http://127.0.0.1:808${getPortByIndex(index)}/apps/demos/Demos/${widgetName}/${demoName}/${approach}/`;
    }
    // remove when tests enabled not only for datagrid
    if (isGitHubDemos && (widgetName !== 'DataGrid' || gitHubIgnored.includes(demoName))) {
      return;
    }

    if (shouldSkipDemo(approach, widgetName, demoName, skippedTests)) {
      return;
    }

    runTestAtPage(
      test,
      pageURL,
      skipJsErrorsComponents.includes(widgetName),
    )
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
          const specificSkipRules = getTestSpecificSkipRules(testName);
          const options = { rules: {} };

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

          let comparisonResult;
          if (isGitHubDemos) {
            comparisonResult = await compareScreenshot(t, `${testName}${getThemePostfix(testTheme)}.png`, undefined, (comparisonOptions && {
              ...comparisonOptions,
              ...{ looksSameComparisonOptions: { antialiasingTolerance: 10 } },
            }));
          } else {
            comparisonResult = await compareScreenshot(t, `${testName}${getThemePostfix(testTheme)}.png`, undefined, (comparisonOptions && {
              ...comparisonOptions,
              ...{ looksSameComparisonOptions: {
                antialiasingTolerance: 10,
                foregroundDiffThreshold: 10,
              } },
            }));
          }

          const consoleMessages = await t.getBrowserConsoleMessages();

          const errors = [...consoleMessages.error, ...consoleMessages.warn]
            .filter((e) => !knownWarnings.some((kw) => e.startsWith(kw)));

          await t.expect(errors).eql([]);
          await t.expect(comparisonResult).ok('INVALID_SCREENSHOT');
        }
      });
  });
});
