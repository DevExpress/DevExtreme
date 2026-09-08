import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import PivotGrid from '../../../../models/pivotGrid';

const PIVOT_GRID_SELECTOR = '#container';

const FIELD_PANEL_PLACEMENTS: [string, Record<string, boolean>][] = [
  ['filter-fields', { visible: true, showFilterFields: true }],
  ['column-fields', { visible: true, showDataFields: true }],
  ['description-cell', { visible: false }],
];

FIELD_PANEL_PLACEMENTS.forEach(([areaName, fieldPanelOptions]) => {
  test(`Field chooser button should have visible focus state when placed in ${areaName}`, async ({ page }) => {
    await createWidget(page, 'dxPivotGrid', {
      allowFiltering: true,
      showBorders: true,
      height: 470,
      fieldChooser: {
        enabled: true,
      },
      fieldPanel: fieldPanelOptions,
    }, PIVOT_GRID_SELECTOR);

    const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);

    await page.keyboard.press('Tab');

    await expect(pivotGrid.getFieldChooserButton()).toBeFocused();

    await testScreenshot(page, `field-chooser-button_focus_${areaName}.png`);
  });
});

test('Export button should have visible focus state', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', {
    allowFiltering: true,
    showBorders: true,
    height: 470,
    fieldChooser: {
      enabled: true,
    },
    export: {
      enabled: true,
    },
  }, PIVOT_GRID_SELECTOR);

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  await expect(pivotGrid.getExportButton()).toBeFocused();

  await testScreenshot(page, 'export-button_focus.png');
});

test('Field chooser button should have correct aria attributes', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', {
    allowFiltering: true,
    showBorders: true,
    height: 470,
    fieldChooser: {
      enabled: true,
    },
  }, PIVOT_GRID_SELECTOR);

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);

  await expect(pivotGrid.getFieldChooserButton()).toHaveAttribute('aria-haspopup', 'dialog');
  await expect(pivotGrid.getFieldChooserButton()).toHaveAttribute('aria-label', 'Show Field Chooser');
});

test('Field chooser button should be focused after field chooser popup is closed', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', {
    allowFiltering: true,
    showBorders: true,
    height: 470,
    fieldChooser: {
      enabled: true,
    },
  }, PIVOT_GRID_SELECTOR);

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);

  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  await expect.poll(async () => pivotGrid.getFieldChooserPopup().isVisible()).toBe(true);

  await page.keyboard.press('Escape');

  await expect.poll(async () => pivotGrid.getFieldChooserPopup().isVisible()).toBe(false);
  await expect(pivotGrid.getFieldChooserButton()).toBeFocused();
});
