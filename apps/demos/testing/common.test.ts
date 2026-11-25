import { glob } from 'glob';
import { join } from 'path';
import { existsSync } from 'fs';
import { axeCheck, createReport } from '@testcafe-community/axe';
import {
  runTestAtPage,
  shouldRunFramework,
  shouldRunTestAtIndex,
  globalReadFrom,
  changeTheme,
  waitForAngularLoading,
  waitForStylesheets,
  FRAMEWORKS,
  execCode,
  injectStyle,
} from '../utils/visual-tests/matrix-test-helper';
import { isMaterial, isFluent } from '../utils/visual-tests/helpers/theme-utils';
import { createMdReport, createTestCafeReport } from '../utils/axe-reporter/reporter';
import { getTestGlobalsScriptPath } from '../utils/visual-tests/test-globals-bundle';
import { widgetsGalleryServiceMock } from './apiMocks/widgetsGalleryServiceMock';
import { xmlaServiceMock } from './apiMocks/xmlaServiceMock';

const execTestCafeCode = (t, code) => {
  // eslint-disable-next-line no-eval
  const testCafeFunction = eval(code);
  return testCafeFunction(t);
};

const getIgnoredRules = (testName) => {
  const ignoredRules = [];

  if ((isMaterial() || isFluent())
    && [
      // False positive: contrast rules do not apply to disabled tags
      'Accordion-Overview',
      'TagBox-Overview',
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
  };

  return [
    ...ignoredRules,
    ...(specificRules[testName] || []),
  ];
};

// The appointment title and date do not reach the AA contrast ratio: the date line is dimmed
// to 70% opacity and the appointments are painted with the resource colors.
const getAxeContext = (testName) => (testName.startsWith('Scheduler-')
  ? {
    include: ['.demo-container'],
    exclude: ['.dx-scheduler-appointment-title', '.dx-scheduler-appointment-content-date'],
  }
  : '.demo-container');

const getClientScripts = (approach: string) => {
  const scripts = [
    { module: 'mockdate' },
    { module: 'axe-core/axe.min.js' },
  ];

  const testGlobalsScriptPath = getTestGlobalsScriptPath(approach);
  if (testGlobalsScriptPath) {
    // @ts-expect-error
    scripts.push(testGlobalsScriptPath);
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

// The demo screenshots are taken by Playwright (common.spec.ts); this test runs the accessibility checks.
Object.values(FRAMEWORKS).forEach((approach) => {
  if (process.env.STRATEGY !== 'accessibility' || !shouldRunFramework(approach)) { return; }
  fixture(approach)
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

    if (process.env.CI_ENV && !['all', 'ignore'].includes(process.env.DISABLE_DEMO_TEST_SETTINGS)) {
      const mergedTestSettings = {
        ...visualTestSettings,
        ...visualTestSettings?.[approach.toLowerCase()],
      };

      if (mergedTestSettings.ignore) { return; }
    }

    changeTheme(__dirname, `../${demoPath}/index.html`, process.env.THEME);
    const pageURL = `http://127.0.0.1:8080/apps/demos/Demos/${widgetName}/${demoName}/${approach}/`;

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
      });
  });
});
