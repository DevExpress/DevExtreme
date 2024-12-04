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

const SKIPPED_TESTS = {
  jQuery: {
    Charts: [
      { demo: 'ServerSideDataProcessing', themes: [THEME.material] },
    ],
    Gantt: [
      { demo: 'TaskTemplate', themes: [THEME.generic, THEME.material, THEME.fluent] },
      { demo: 'Validation', themes: [THEME.generic, THEME.material, THEME.fluent] },
    ],
  },
  Angular: {
    DataGrid: [
      { demo: 'EditStateManagement', themes: [THEME.generic] },
      { demo: 'MultipleRecordSelectionModes', themes: [THEME.fluent] },
      { demo: 'ToolbarCustomization', themes: [THEME.fluent, THEME.material] },
      { demo: 'SignalRService', themes: [THEME.fluent, THEME.material] },
      { demo: 'CellEditingAndEditingAPI', themes: [THEME.material] },
      { demo: 'MultipleRecordSelectionAPI', themes: [THEME.material] },
      { demo: 'RemoteGrouping', themes: [THEME.generic] },
    ],
    Charts: [
      { demo: 'Overview', themes: [THEME.material] },
      { demo: 'Strips', themes: [THEME.material] },
      { demo: 'Bubble', themes: [THEME.material] },
      { demo: 'PointImage', themes: [THEME.material] },
      { demo: 'BiDirectionalBarChart', themes: [THEME.material] },
      { demo: 'CustomizePointsAndLabels', themes: [THEME.material] },
      { demo: 'ServerSideDataProcessing', themes: [THEME.material] },
      { demo: 'MultiplePointSelection', themes: [THEME.material] },
      { demo: 'PiesWithEqualSize', themes: [THEME.material] },
      { demo: 'Selection', themes: [THEME.material] },
      { demo: 'CustomMapData', themes: [THEME.material] },
      { demo: 'MultipleSeriesSelection', themes: [THEME.material] },
      { demo: 'DiscreteAxisZoomingAndScrolling', themes: [THEME.material] },
      { demo: 'APISelectAPoint', themes: [THEME.material] },
    ],
    Scheduler: [
      { demo: 'Overview', themes: [THEME.fluent, THEME.material] },
    ],
    PivotGrid: [
      { demo: 'Overview', themes: [THEME.material] },
      { demo: 'ChartIntegration', themes: [THEME.material] },
    ],
    TreeList: [
      { demo: 'BatchEditing', themes: [THEME.material] },
      { demo: 'RowEditing', themes: [THEME.material] },
      { demo: 'PopupEditing', themes: [THEME.material] },
      { demo: 'FormEditing', themes: [THEME.material] },
      { demo: 'CellEditing', themes: [THEME.material] },
      { demo: 'Resizing', themes: [THEME.material] },
    ],
    Gauges: [
      { demo: 'ScaleLabelFormatting', themes: [THEME.material] },
      { demo: 'BaseValueForRangeBar', themes: [THEME.material] },
      { demo: 'DifferentValueIndicatorTypesLinearGauge', themes: [THEME.material] },
      { demo: 'SubvalueIndicatorTextFormatting', themes: [THEME.material] },
      { demo: 'DifferentValueIndicatorTypes', themes: [THEME.material] },
    ],
    RangeSelector: [
      { demo: 'DiscreteScale', themes: [THEME.material] },
    ],
    Gantt: [
      { demo: 'ContextMenu', themes: [THEME.material] },
      { demo: 'TaskTemplate', themes: [THEME.generic, THEME.material, THEME.fluent] },
      { demo: 'Validation', themes: [THEME.generic, THEME.material, THEME.fluent] },
    ],
    VectorMap: [
      { demo: 'Palette', themes: [THEME.material] },
      { demo: 'CustomAnnotations', themes: [THEME.material] },
      { demo: 'CustomProjection', themes: [THEME.material] },
      { demo: 'MultipleLayers', themes: [THEME.material] },
      { demo: 'TooltipHTMLSupport', themes: [THEME.material] },
      { demo: 'CustomMapData', themes: [THEME.material] },
    ],
  },
  React: {
    Charts: [
      { demo: 'PiesWithEqualSize', themes: [THEME.material] },
      { demo: 'CustomAnnotations', themes: [THEME.material] },
    ],
    DataGrid: [
      { demo: 'SignalRService', themes: [THEME.material, THEME.fluent] },
      { demo: 'MultipleRecordSelectionModes', themes: [THEME.fluent] },
      { demo: 'ToolbarCustomization', themes: [THEME.fluent, THEME.material] },
      { demo: 'MultipleRecordSelectionAPI', themes: [THEME.material] },
      { demo: 'CellEditingAndEditingAPI', themes: [THEME.material] },
    ],
    Gantt: [
      { demo: 'Validation', themes: [THEME.generic, THEME.material, THEME.fluent] },
    ],
    Scheduler: [
      { demo: 'Overview', themes: [THEME.fluent, THEME.material] },
      { demo: 'GroupByDate', themes: [THEME.fluent, THEME.material] },
    ],
    List: [
      { demo: 'ListWithSearchBar', themes: [THEME.material] },
      { demo: 'ItemDragging', themes: [THEME.fluent, THEME.material] },
    ],
    VectorMap: [
      { demo: 'PieMarkers', themes: [THEME.material] },
      { demo: 'CustomAnnotations', themes: [THEME.material] },
      { demo: 'CustomMapData', themes: [THEME.material] },
      { demo: 'CustomProjection', themes: [THEME.material] },
      { demo: 'AreaWithLabelsAndTwoLegends', themes: [THEME.material] },
      { demo: 'MultipleLayers', themes: [THEME.material] },
      { demo: 'Palette', themes: [THEME.material] },
      { demo: 'TooltipHTMLSupport', themes: [THEME.material] },
    ],
    RangeSelector: [
      { demo: 'DiscreteScale', themes: [THEME.material] },
      { demo: 'UseRangeSelectionForCalculation', themes: [THEME.material] },
    ],
    PivotGrid: [
      { demo: 'ExcelJSCellCustomization', themes: [THEME.material] },
      { demo: 'LayoutCustomization', themes: [THEME.material] },
    ],
    Gauges: [
      { demo: 'DifferentValueIndicatorTypesLinearGauge', themes: [THEME.material] },
      { demo: 'ScaleLabelFormatting', themes: [THEME.material] },
    ],
  },
  Vue: {
    Charts: [
      { demo: 'TilingAlgorithms', themes: [THEME.material] },
      { demo: 'ExportAndPrintingAPI', themes: [THEME.material] },
      { demo: 'DiscreteAxisZoomingAndScrolling', themes: [THEME.material] },
      { demo: 'Colorization', themes: [THEME.material] },
      { demo: 'SignalRService', themes: [THEME.material] },
      { demo: 'PointsAggregation', themes: [THEME.material] },
      { demo: 'AxisLabelsOverlapping', themes: [THEME.material] },
      { demo: 'ServerSideDataProcessing', themes: [THEME.material] },
      { demo: 'PiesWithEqualSize', themes: [THEME.material] },
      { demo: 'Palette', themes: [THEME.material] },
    ],
    Drawer: [
      { demo: 'TopOrBottomPosition', themes: [THEME.material] },
    ],
    DataGrid: [
      { demo: 'SignalRService', themes: [THEME.fluent, THEME.material] },
      { demo: 'ToolbarCustomization', themes: [THEME.fluent, THEME.material] },
      { demo: 'MultipleRecordSelectionModes', themes: [THEME.fluent] },
      { demo: 'FilteringAPI', themes: [THEME.material] },
      { demo: 'Filtering', themes: [THEME.fluent] },
      { demo: 'MultipleRecordSelectionAPI', themes: [THEME.material] },
      { demo: 'DeferredSelection', themes: [THEME.material] },
      { demo: 'CellEditingAndEditingAPI', themes: [THEME.material] },
      { demo: 'PopupEditing', themes: [THEME.generic] },
      { demo: 'RecordPaging', themes: [THEME.generic] },
    ],
    FieldSet: [
      { demo: 'Overview', themes: [THEME.fluent] },
    ],
    FileManager: [
      { demo: 'BindingToFileSystem', themes: [THEME.material] },
      { demo: 'CustomThumbnails', themes: [THEME.generic] },
    ],
    FilterBuilder: [
      { demo: 'Customization', themes: [THEME.material] },
    ],
    Form: [
      { demo: 'ColumnsAdaptability', themes: [THEME.generic] },
      { demo: 'UpdateItemsDynamically', themes: [THEME.generic] },
    ],
    TreeList: [
      { demo: 'Overview', themes: [THEME.material] },
    ],
    List: [
      { demo: 'ListWithSearchBar', themes: [THEME.material] },
    ],
    Gauges: [
      { demo: 'Overview', themes: [THEME.material] },
      { demo: 'ScaleLabelFormatting', themes: [THEME.material] },
      { demo: 'DifferentValueIndicatorTypes', themes: [THEME.material] },
      { demo: 'DifferentValueIndicatorTypesLinearGauge', themes: [THEME.material] },
    ],
    RangeSelector: [
      { demo: 'UseRangeSelectionForCalculation', themes: [THEME.material] },
      { demo: 'DiscreteScale', themes: [THEME.material] },
    ],
    PivotGrid: [
      { demo: 'Overview', themes: [THEME.material] },
      { demo: 'LayoutCustomization', themes: [THEME.material] },
    ],
    VectorMap: [
      { demo: 'CustomProjection', themes: [THEME.material] },
      { demo: 'Overview', themes: [THEME.material] },
      { demo: 'PieMarkers', themes: [THEME.material] },
      { demo: 'TooltipHTMLSupport', themes: [THEME.material] },
      { demo: 'MultipleLayers', themes: [THEME.material] },
      { demo: 'CustomMapData', themes: [THEME.material] },
      { demo: 'AreaWithLabelsAndTwoLegends', themes: [THEME.material] },
    ],
    Gantt: [
      { demo: 'Validation', themes: [THEME.generic, THEME.material, THEME.fluent] },
      { demo: 'TaskTemplate', themes: [THEME.generic, THEME.material, THEME.fluent] },
    ],
    Pagination: ['Overview'],
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

          const errors = [...consoleMessages.error, ...consoleMessages.warn]
            .filter((e) => !knownWarnings.some((kw) => e.startsWith(kw)));

          await t.expect(errors).eql([]);

          await t.expect(comparisonResult).ok('INVALID_SCREENSHOT');
        }
      });
  });
});
