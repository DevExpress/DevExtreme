import { glob } from 'glob';
import { join } from 'path';
import { existsSync, mkdirSync, appendFileSync } from 'fs';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { axeCheck, createReport } from '@testcafe-community/axe';
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
import {
  testScreenshot,
  isMaterial,
  isFluent,
} from '../utils/visual-tests/helpers/theme-utils';
import { createMdReport, createTestCafeReport } from '../utils/axe-reporter/reporter';
import { getTestGlobalsScriptPath } from '../utils/visual-tests/test-globals-bundle';
import { knownWarnings } from './known-warnings';
import { skippedTests } from './skipped-tests';
import { widgetsGalleryServiceMock } from './apiMocks/widgetsGalleryServiceMock';
import { xmlaServiceMock } from './apiMocks/xmlaServiceMock';

import { gitHubIgnored } from '../utils/visual-tests/github-ignored-list';

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

const getIgnoredRules = (testName) => {
  const ignoredRules = [];

  if ((isMaterial() || isFluent())
    && [
      'TreeList-StatePersistence',
      // False positive: contrast rules do not apply to custom orange color
      'CardView-FieldTemplate',
      // False positive: contrast rules do not apply to read-only editors on the custom option panel background
      'VectorMap-DynamicViewport',
    ].includes(testName)
  ) {
    ignoredRules.push('color-contrast');
  }

  const specificRules = {
    'DataGrid-EditStateManagement': ['aria-required-parent'],
    'DataGrid-RemoteCRUDOperations': ['scrollable-region-focusable'],

    'Diagram-Adaptability': ['aria-dialog-name', 'label'],
    'Diagram-AdvancedDataBinding': ['aria-dialog-name', 'label'],
    'Diagram-Containers': ['aria-dialog-name', 'label'],
    'Diagram-CustomShapesWithIcons': ['aria-dialog-name', 'label'],
    'Diagram-CustomShapesWithTemplates': ['label'],
    'Diagram-CustomShapesWithTemplatesWithEditing': ['aria-dialog-name', 'label'],
    'Diagram-CustomShapesWithTexts': ['aria-dialog-name', 'label'],
    'Diagram-ImagesInShapes': ['aria-dialog-name', 'label'],
    'Diagram-ItemSelection': ['label'],
    'Diagram-NodesAndEdgesArrays': ['aria-dialog-name', 'label'],
    'Diagram-NodesArrayHierarchicalStructure': ['aria-dialog-name', 'label'],
    'Diagram-NodesArrayPlainStructure': ['aria-dialog-name', 'label'],
    'Diagram-OperationRestrictions': ['aria-dialog-name', 'label'],
    'Diagram-Overview': ['aria-dialog-name', 'label'],
    'Diagram-ReadOnly': ['label'],
    'Diagram-SimpleView': ['label'],
    'Diagram-UICustomization': ['aria-dialog-name', 'label'],
    'Diagram-WebAPIService': ['aria-dialog-name', 'label'],

    'FileManager-BindingToEF': ['aria-command-name', 'empty-table-header', 'label'],
    'FileManager-BindingToFileSystem': ['aria-command-name', 'empty-table-header', 'label'],
    'FileManager-BindingToHierarchicalStructure': ['aria-command-name', 'empty-table-header', 'label'],
    'FileManager-CustomThumbnails': ['aria-allowed-attr', 'aria-command-name', 'image-alt', 'label'],
    'FileManager-Overview': ['aria-command-name', 'empty-table-header', 'label'],
    'FileManager-UICustomization': ['aria-command-name', 'empty-table-header', 'label'],

    'Gantt-Appearance': ['aria-toggle-field-name'],
    'Gantt-ExportToPDF': ['aria-toggle-field-name'],
    'Gantt-Overview': ['aria-required-parent', 'aria-valid-attr-value'],
    'Gantt-StripLines': ['aria-required-parent', 'aria-valid-attr-value'],
    'Gantt-Validation': ['aria-required-parent', 'aria-valid-attr-value'],

    'Localization-UsingGlobalize': ['label'],

    // Icon-only tabs render no text, so they have no accessible name.
    // Naming them needs Tabs widget support (like Button labels icon-only buttons).
    'Tabs-Overview': ['aria-tab-name'],
  };

  return [
    ...ignoredRules,
    ...(specificRules[testName] || []),
  ];
};

// Appointments are painted with resource colors and their date line is dimmed to 70% opacity,
// so the title and the date do not reach the AA contrast ratio.
const getAxeContext = (testName) => (testName.startsWith('Scheduler-')
  ? { include: ['.demo-container'], exclude: ['.dx-scheduler-appointment'] }
  : '.demo-container');

const getClientScripts = (approach: string) => {
  const scripts = [
    { module: 'mockdate' },
  ];

  if (process.env.STRATEGY === 'accessibility') {
    scripts.push({ module: 'axe-core/axe.min.js' });
  }

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
  fixture(approach)
    .beforeEach(async (t) => {
      if (process.env.STRATEGY !== 'accessibility') {
        await t.resizeWindow(1000, 800);
      }
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

    const isGitHubDemos = process.env.ISGITHUBDEMOS;
    let pageURL = '';
    const theme = process.env.THEME.replace('generic.', '');
    if (isGitHubDemos) {
      pageURL = `http://127.0.0.1:8080/Demos/${widgetName}/${demoName}/${approach}/?theme=dx.${theme}`;
    } else {
      changeTheme(__dirname, `../${demoPath}/index.html`, process.env.THEME);
      pageURL = `http://127.0.0.1:8080/apps/demos/Demos/${widgetName}/${demoName}/${approach}/`;
    }
    // remove when tests enabled not only for datagrid
    if (isGitHubDemos && (widgetName !== 'DataGrid' || gitHubIgnored.includes(demoName))) {
      return;
    }

    if (shouldSkipDemo(approach, widgetName, demoName, skippedTests) && process.env.STRATEGY !== 'accessibility') {
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

        if (process.env.STRATEGY === 'accessibility') {
          const ignoredRules = getIgnoredRules(testName);
          const options = { rules: {} };

          ignoredRules.forEach((ruleName) => {
            options.rules[ruleName] = { enabled: false };
          });

          const axeResult = await axeCheck(t, getAxeContext(testName), options);
          const { error, results } = axeResult;

          if (results.violations.length > 0) {
            createMdReport({ testName, results });
            await t.report(createTestCafeReport(results.violations));
          }

          await t.expect(error).notOk();
          await t.expect(results.violations.length === 0).ok(createReport(results.violations));
        } else {
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
        }
      });
  });
});
