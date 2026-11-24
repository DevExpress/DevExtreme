import { existsSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import {
  FRAMEWORKS,
  globalReadFrom,
  settings,
  shouldRunTestAtIndex,
  shouldRunTestExplicitly,
  updateConfig,
} from '../utils/visual-tests/matrix-test-core';
import { isFluent, isMaterial } from '../utils/visual-tests/helpers/theme-utils';
import { createMdReport } from '../utils/axe-reporter/reporter';
import { mockApi } from '../utils/visual-tests/playwright/api-mocks';
import { BASE_URL, THEME } from '../utils/visual-tests/playwright/const';
import {
  openDemo,
  prepareDemoPage,
  runTestCode,
  trackPageActivity,
} from '../utils/visual-tests/playwright/demo-page';

type DemoSteps = (page: Page) => Promise<void>;

const COLOR_CONTRAST_RULE = 'color-contrast';

const isColorContrastOnly = THEME.startsWith('fluent-next');

const DEMOS_ROOT = join(__dirname, '..');

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
  };

  return [
    ...ignoredRules,
    ...(specificRules[testName] || []),
  ];
};

const createAxeBuilder = (page: Page, ignoredRules: string[]): AxeBuilder => {
  const builder = new AxeBuilder({ page })
    .include('.demo-container')
    .setLegacyMode();

  return isColorContrastOnly
    ? builder.withRules([COLOR_CONTRAST_RULE])
    : builder.disableRules(ignoredRules);
};

updateConfig({ explicitTestArgs: [], verbose: false });

const demoPaths = glob.sync('Demos/*/*', { cwd: DEMOS_ROOT }).sort();

test.describe(FRAMEWORKS.jquery, () => {
  demoPaths.forEach((demoPath, index) => {
    const demoDir = join(DEMOS_ROOT, demoPath);

    if (!shouldRunTestAtIndex(index + 1) || !existsSync(join(demoDir, FRAMEWORKS.jquery))) { return; }

    const [, widgetName, demoName] = demoPath.split(/[/\\]/);
    const testName = `${widgetName}-${demoName}`;
    const pageURL = `${BASE_URL}/apps/demos/Demos/${widgetName}/${demoName}/${FRAMEWORKS.jquery}/`;

    const clientScript = globalReadFrom(demoDir, 'client-script.js', null);
    const testCode = globalReadFrom(demoDir, 'test-code.js', null);
    const testStyles = globalReadFrom(demoDir, 'test-styles.css', null);
    const testSettings = globalReadFrom(demoDir, 'visualtestrc.json', (x) => JSON.parse(x));
    const stepsPath = join(demoDir, 'playwright-test-code.js');
    const ignoredRules = getIgnoredRules(testName);

    if (process.env.CI && !['all', 'ignore'].includes(process.env.DISABLE_DEMO_TEST_SETTINGS)) {
      const mergedTestSettings = { ...testSettings, ...testSettings?.[FRAMEWORKS.jquery.toLowerCase()] };

      if (mergedTestSettings.ignore) { return; }
    }

    if (isColorContrastOnly && ignoredRules.includes(COLOR_CONTRAST_RULE)) { return; }

    if (settings.explicitTests && !shouldRunTestExplicitly(pageURL)) { return; }

    test(testName, async ({ page }) => {
      const pageErrors: string[] = [];

      page.on('pageerror', (error) => pageErrors.push(error.stack ?? error.message));

      const waitForIdle = trackPageActivity(page);

      await mockApi(page);
      await prepareDemoPage(page, pageURL, THEME, clientScript);
      await openDemo(page, pageURL, waitForIdle);

      if (testStyles) {
        await page.addStyleTag({ content: testStyles });
      }

      if (testCode) {
        await runTestCode(page, testCode);
      }

      if (existsSync(stepsPath)) {
        // eslint-disable-next-line import/no-dynamic-require, @typescript-eslint/no-require-imports
        const { default: steps } = require(stepsPath) as { default: DemoSteps };

        await steps(page);
      }

      await waitForIdle();

      expect(pageErrors, 'uncaught errors in the page').toEqual([]);

      const results = await createAxeBuilder(page, ignoredRules).analyze();

      if (results.violations.length > 0) {
        createMdReport({ testName, results });
      }

      const violations = results.violations.map(({ id, impact, nodes }) => `${id} (${impact}): ${nodes.map(({ target }) => target.join(' ')).join(', ')}`);

      expect(violations, 'accessibility violations').toEqual([]);
    });
  });
});
