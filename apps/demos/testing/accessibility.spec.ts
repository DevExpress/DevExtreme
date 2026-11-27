import { readFileSync, rmSync } from 'fs';
import { join } from 'path';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { FRAMEWORKS } from '../utils/visual-tests/matrix-test-core';
import { isFluent, isMaterial } from '../utils/visual-tests/helpers/theme-utils';
import { createMdReport } from '../utils/axe-reporter/reporter';
import { mockApi } from '../utils/visual-tests/playwright/api-mocks';
import { BASE_URL, THEME } from '../utils/visual-tests/playwright/const';
import {
  openDemo,
  prepareDemoPage,
  trackPageActivity,
} from '../utils/visual-tests/playwright/demo-page';
import { getDemos, loadDemo } from '../utils/visual-tests/playwright/demos';

const COLOR_CONTRAST_RULE = 'color-contrast';

const isColorContrastOnly = THEME.startsWith('fluent-next');

const DEMOS_ROOT = join(__dirname, '..');

const getIgnoredRules = (testName: string): string[] => {
  const ignoredRules: string[] = [];

  if ((isMaterial() || isFluent())
    && [
      // False positive: contrast rules do not apply to custom orange color
      'CardView-FieldTemplate',
      // False positive: contrast rules do not apply to read-only editors on the custom option panel background
      'VectorMap-DynamicViewport',
    ].includes(testName)
  ) {
    ignoredRules.push('color-contrast');
  }

  const specificRules: Record<string, string[]> = {
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

    'Map-Markers': ['image-redundant-alt'],
    'Map-Routes': ['image-redundant-alt'],
  };

  return [
    ...ignoredRules,
    ...(specificRules[testName] || []),
  ];
};

const areAriaOwnsResolved = (): boolean => Array
  .from(document.querySelectorAll('[aria-owns]'))
  .every((element) => (element.getAttribute('aria-owns') ?? '')
    .split(' ')
    .every((id) => !id || document.getElementById(id)));

const createAxeBuilder = (page: Page, ignoredRules: string[], colorContrastOnly: boolean): AxeBuilder => {
  const builder = new AxeBuilder({ page })
    .include('.demo-container')
    .setLegacyMode();

  return colorContrastOnly
    ? builder.withRules([COLOR_CONTRAST_RULE])
    : builder.disableRules(ignoredRules);
};

const findViolations = async (
  page: Page,
  testName: string,
  ignoredRules: string[],
  colorContrastOnly: boolean,
): Promise<string[]> => {
  await page.waitForFunction(areAriaOwnsResolved);

  const results = await createAxeBuilder(page, ignoredRules, colorContrastOnly).analyze();

  if (results.violations.length > 0) {
    createMdReport({ testName, results });
  }

  return results.violations.map(({ id, impact, nodes }) => `${id} (${impact}): ${nodes.map(({ target }) => target.join(' ')).join(', ')}`);
};

const getPageTheme = (page: Page): Promise<string> => page.evaluate(
  () => window.DevExpress.ui.themes.current(),
);

test.describe(FRAMEWORKS.jquery, () => {
  getDemos(FRAMEWORKS.jquery).forEach((demo) => {
    const ignoredRules = getIgnoredRules(demo.testName);

    if (isColorContrastOnly && ignoredRules.includes(COLOR_CONTRAST_RULE)) { return; }

    test(demo.testName, async ({ page }) => {
      const pageErrors = await loadDemo(page, demo);

      expect(pageErrors, 'uncaught errors in the page').toEqual([]);
      expect(await getPageTheme(page), 'theme of the page').toBe(THEME);

      const violations = await findViolations(page, demo.testName, ignoredRules, isColorContrastOnly);

      expect(violations, 'accessibility violations').toEqual([]);
    });
  });
});

test.describe('axe setup', () => {
  const PLANTED_REPORT_NAME = 'axe-setup-planted-violations';
  const PLANTED_REPORT_PATH = join(DEMOS_ROOT, 'testing', 'artifacts', 'axe-reports', `${PLANTED_REPORT_NAME}.md`);
  const DEMO_URL = `${BASE_URL}/apps/demos/Demos/Button/PredefinedTypes/${FRAMEWORKS.jquery}/`;

  const PLANTED_CONTRAST = 'color-contrast (serious): .planted-contrast-inside';
  const PLANTED_IMAGE = 'image-alt (critical): .planted-image-inside';

  test.beforeEach(async ({ page }) => {
    const waitForIdle = trackPageActivity(page);

    await mockApi(page);
    await prepareDemoPage(page, DEMO_URL, THEME, null);
    await openDemo(page, DEMO_URL, waitForIdle);
  });

  test.afterEach(() => rmSync(PLANTED_REPORT_PATH, { force: true }));

  test('reports only the violations planted inside the demo container', async ({ page }) => {
    await page.evaluate(() => {
      const plant = (parent: Element, place: string): void => {
        parent.insertAdjacentHTML(
          'beforeend',
          `<img class="planted-image-${place}" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">`
          + `<span class="planted-contrast-${place}" style="color: #777; background: #888;">planted</span>`,
        );
      };

      document.querySelectorAll('.demo-container').forEach((container) => plant(container, 'inside'));
      plant(document.body, 'outside');
    });

    expect(await findViolations(page, PLANTED_REPORT_NAME, [], false)).toEqual([PLANTED_CONTRAST, PLANTED_IMAGE]);
    expect(readFileSync(PLANTED_REPORT_PATH, 'utf8')).toContain('.planted-image-inside');

    expect(await findViolations(page, PLANTED_REPORT_NAME, ['image-alt'], false)).toEqual([PLANTED_CONTRAST]);
    expect(await findViolations(page, PLANTED_REPORT_NAME, [], true)).toEqual([PLANTED_CONTRAST]);
  });

  test('checks the page once the elements named in aria-owns exist', async ({ page }) => {
    const OWNED_ELEMENT_DELAY = 1000;

    await page.evaluate(() => {
      document.querySelector('.demo-container')
        ?.insertAdjacentHTML('beforeend', '<div class="planted-owner" aria-owns="planted-owned"></div>');
    });

    const { violations } = await createAxeBuilder(page, [], false).analyze();

    expect(violations.map(({ id }) => id)).toEqual(['aria-valid-attr-value']);

    await page.evaluate((delay) => {
      setTimeout(() => {
        document.querySelector('.demo-container')
          ?.insertAdjacentHTML('beforeend', '<span id="planted-owned">owned</span>');
      }, delay);
    }, OWNED_ELEMENT_DELAY);

    expect(await findViolations(page, PLANTED_REPORT_NAME, [], false)).toEqual([]);
  });
});
