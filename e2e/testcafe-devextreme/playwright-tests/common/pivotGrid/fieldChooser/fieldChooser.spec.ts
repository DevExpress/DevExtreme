import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, PivotGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const sales = [
  {
    region: 'North America', city: 'New York', date: '2013/01/06', amount: 1740,
  },
  {
    region: 'North America', city: 'Los Angeles', date: '2013/02/06', amount: 2295,
  },
  {
    region: 'Europe', city: 'London', date: '2013/07/01', amount: 1190,
  },
  {
    region: 'Asia', city: 'Tokyo', date: '2014/01/01', amount: 1445,
  },
];

test.describe('PivotGrid_fieldChooser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Change dataFiels order with one invisible field (T1079461)', async ({ page }) => {
    await createWidget(page, 'dxPivotGrid', {
      allowSortingBySummary: true,
      allowFiltering: true,
      showBorders: true,
      showColumnGrandTotals: false,
      showRowGrandTotals: false,
      showRowTotals: false,
      showColumnTotals: false,
      fieldChooser: {
        enabled: true,
        height: 800,
      },
      dataSource: {
        fields: [{
          caption: 'Region',
          width: 120,
          dataField: 'region',
          area: 'row',
          sortBySummaryField: 'Total',
        }, {
          caption: 'City',
          dataField: 'city',
          width: 150,
          area: 'row',
        }, {
          dataField: 'date',
          dataType: 'date',
          area: 'column',
        }, {
          groupName: 'date',
          groupInterval: 'month',
          visible: false,
        }, {
          caption: 'Total',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
          areaIndex: 0,
        }, {
          caption: 'Total Hidden',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
          visible: false,
          isMeasure: true,
        }, {
          caption: 'Total 2',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
          areaIndex: 1,
        }, {
          caption: 'Total 3',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
          areaIndex: 2,
        }, {
          caption: 'Total 4',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          visible: true,
          isMeasure: true,
        }, {
          caption: 'Total 5',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          visible: true,
          isMeasure: true,
        }],
        store: sales,
      },
    });

    const pivotGrid = new PivotGrid(page);
    await pivotGrid.getFieldChooserButton().click();

    const fieldChooserOverlay = page.locator('.dx-overlay-content.dx-popup-draggable');
    await expect(fieldChooserOverlay).toBeVisible();

    const treeViewCheckboxes = fieldChooserOverlay.locator('.dx-treeview .dx-checkbox');
    await treeViewCheckboxes.nth(0).click();
    await treeViewCheckboxes.nth(1).click();

    const dataFields = fieldChooserOverlay.locator('.dx-area-fields[data-group="data"] .dx-area-field');
    const firstField = dataFields.nth(0);
    const box = await firstField.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 170, { steps: 10 });
      await page.mouse.up();
    }

    await testScreenshot(page, 'FieldChooser change dataField order with invisible fields.png', { element: '.dx-overlay-content.dx-popup-draggable' });
  });

  test('Change dataFiels order with two invisible fields', async ({ page }) => {
    await createWidget(page, 'dxPivotGrid', {
      allowSortingBySummary: true,
      allowFiltering: true,
      showBorders: true,
      showColumnGrandTotals: false,
      showRowGrandTotals: false,
      showRowTotals: false,
      showColumnTotals: false,
      fieldChooser: {
        enabled: true,
        height: 800,
      },
      dataSource: {
        fields: [{
          caption: 'Region',
          width: 120,
          dataField: 'region',
          area: 'row',
        }, {
          caption: 'City',
          dataField: 'city',
          width: 150,
          area: 'row',
        }, {
          dataField: 'date',
          dataType: 'date',
          area: 'column',
        }, {
          groupName: 'date',
          groupInterval: 'month',
          visible: false,
        }, {
          caption: 'Total',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
          areaIndex: 0,
        }, {
          caption: 'Total Hidden',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
          visible: false,
          isMeasure: true,
        }, {
          caption: 'Total 2',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
          areaIndex: 1,
        }, {
          caption: 'Total Hidden 2',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
          visible: false,
          isMeasure: true,
        }, {
          caption: 'Total 3',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
          areaIndex: 2,
        }, {
          caption: 'Total 4',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          visible: true,
          isMeasure: true,
        }, {
          caption: 'Total 5',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          visible: true,
          isMeasure: true,
        }],
        store: sales,
      },
    });

    const pivotGrid = new PivotGrid(page);
    await pivotGrid.getFieldChooserButton().click();

    const fieldChooserOverlay = page.locator('.dx-overlay-content.dx-popup-draggable');
    await expect(fieldChooserOverlay).toBeVisible();

    const treeViewCheckboxes = fieldChooserOverlay.locator('.dx-treeview .dx-checkbox');
    await treeViewCheckboxes.nth(0).click();
    await treeViewCheckboxes.nth(1).click();

    const dataFields = fieldChooserOverlay.locator('.dx-area-fields[data-group="data"] .dx-area-field');
    const firstField = dataFields.nth(0);
    const box = await firstField.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 170, { steps: 10 });
      await page.mouse.up();
    }

    await testScreenshot(page, 'FieldChooser change dataField order with two invisible fields.png', { element: '.dx-overlay-content.dx-popup-draggable' });
  });

  test('Change dataFiels order with three invisible fields (T1079461)', async ({ page }) => {
    await createWidget(page, 'dxPivotGrid', {
      allowSortingBySummary: true,
      allowFiltering: true,
      showBorders: true,
      showColumnGrandTotals: false,
      showRowGrandTotals: false,
      showRowTotals: false,
      showColumnTotals: false,
      fieldChooser: {
        enabled: true,
        height: 800,
      },
      dataSource: {
        fields: [{
          caption: 'Region',
          width: 120,
          dataField: 'region',
          area: 'row',
        }, {
          caption: 'City',
          dataField: 'city',
          width: 150,
          area: 'row',
        }, {
          dataField: 'date',
          dataType: 'date',
          area: 'column',
        }, {
          groupName: 'date',
          groupInterval: 'month',
          visible: false,
        }, {
          caption: 'Total',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
          areaIndex: 0,
        }, {
          caption: 'Total 2',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
          areaIndex: 1,
        }, {
          caption: 'Total 3',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
          areaIndex: 2,
        }, {
          caption: 'Total 4',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          isMeasure: true,
        }, {
          caption: 'Total 5',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          isMeasure: true,
        }, {
          caption: 'Total Hidden',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
          visible: false,
          isMeasure: true,
        }, {
          caption: 'Total Hidden 2',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
          visible: false,
          isMeasure: true,
        }, {
          caption: 'Total Hidden 3',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
          visible: false,
          isMeasure: true,
        }],
        store: sales,
      },
    });

    const pivotGrid = new PivotGrid(page);
    await pivotGrid.getFieldChooserButton().click();

    const fieldChooserOverlay = page.locator('.dx-overlay-content.dx-popup-draggable');
    await expect(fieldChooserOverlay).toBeVisible();

    const treeViewCheckboxes = fieldChooserOverlay.locator('.dx-treeview .dx-checkbox');
    await treeViewCheckboxes.nth(0).click();

    const dataFields = fieldChooserOverlay.locator('.dx-area-fields[data-group="data"] .dx-area-field');
    const firstField = dataFields.nth(0);
    const box = await firstField.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 170, { steps: 10 });
      await page.mouse.up();
    }

    await testScreenshot(page, 'FieldChooser change dataField order with three invisible fields.png', { element: '.dx-overlay-content.dx-popup-draggable' });
  });

  test('Change dataFiels order when applyChangesMode is "onDemand" (T1097764)', async ({ page }) => {
    await createWidget(page, 'dxPivotGrid', {
      allowSortingBySummary: true,
      allowFiltering: true,
      showBorders: true,
      showColumnGrandTotals: false,
      showRowGrandTotals: false,
      showRowTotals: false,
      showColumnTotals: false,
      fieldChooser: {
        enabled: true,
        height: 800,
        applyChangesMode: 'onDemand',
      },
      dataSource: {
        fields: [{
          caption: 'Region',
          width: 120,
          dataField: 'region',
          area: 'row',
        }, {
          caption: 'City',
          dataField: 'city',
          width: 150,
          area: 'row',
        }, {
          dataField: 'date',
          dataType: 'date',
          area: 'column',
        }, {
          groupName: 'date',
          groupInterval: 'month',
          visible: false,
        }, {
          caption: 'Total',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
          areaIndex: 0,
        }, {
          caption: 'Total 2',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
          areaIndex: 1,
        }, {
          caption: 'Total 3',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
          areaIndex: 2,
        }, {
          caption: 'Total 4',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          isMeasure: true,
        }, {
          caption: 'Total 5',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          isMeasure: true,
        }],
        store: sales,
      },
    });

    const pivotGrid = new PivotGrid(page);
    await pivotGrid.getFieldChooserButton().click();

    const fieldChooserOverlay = page.locator('.dx-overlay-content.dx-popup-draggable');
    await expect(fieldChooserOverlay).toBeVisible();

    const dataFields = fieldChooserOverlay.locator('.dx-area-fields[data-group="data"] .dx-area-field');
    const initialCount = await dataFields.count();
    expect(initialCount).toBe(3);

    const treeViewCheckboxes = fieldChooserOverlay.locator('.dx-treeview .dx-checkbox');
    await treeViewCheckboxes.nth(1).click();

    const updatedCount = await dataFields.count();
    expect(updatedCount).toBe(4);

    const firstField = dataFields.nth(0);
    const box = await firstField.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 150, { steps: 10 });
      await page.mouse.up();
    }

    const finalCount = await dataFields.count();
    expect(finalCount).toBe(4);
  });

  test('Field chooser can be clicked (T1290333)', async ({ page }) => {
    await createWidget(page, 'dxPivotGrid', {
      showBorders: true,
      fieldPanel: {
        showFilterFields: false,
        visible: true,
      },
      dataSource: {
        fields: [{
          dataField: 'date',
          dataType: 'date',
          area: 'column',
        }],
        store: [],
      },
    });

    const pivotGrid = new PivotGrid(page);
    await pivotGrid.getFieldChooserButton().click();

    const fieldChooserOverlay = page.locator('.dx-overlay-content.dx-popup-draggable');
    await expect(fieldChooserOverlay).toBeVisible();
  });
});
