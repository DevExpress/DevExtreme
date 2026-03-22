import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

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

    const pivotGrid = page.locator('#container');

    await click(pivotGrid.getFieldChooserButton());

    const fieldChooser = pivotGrid.getFieldChooser();
    const fieldChooserTreeView = fieldChooser.getTreeView();

    await fieldChooserTreeView.getCheckBoxByNodeIndex(0).element.click();
    await fieldChooserTreeView.getCheckBoxByNodeIndex(1).element.click();

    await (async () => {
        const box = await fieldChooser.getDataFields().nth(0).boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.mouse.down();
          await page.mouse.move(box.x + box.width / 2 + 0, box.y + box.height / 2 + 170, { steps: 10 });
          await page.mouse.up();
        }
      })();

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
        caption: 'Total Hidden',
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

    const pivotGrid = page.locator('#container');

    await click(pivotGrid.getFieldChooserButton());

    const fieldChooser = pivotGrid.getFieldChooser();
    const fieldChooserTreeView = fieldChooser.getTreeView();

    await fieldChooserTreeView.getCheckBoxByNodeIndex(0).element.click();
    await fieldChooserTreeView.getCheckBoxByNodeIndex(1).element.click();

    await (async () => {
        const box = await fieldChooser.getDataFields().nth(0).boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.mouse.down();
          await page.mouse.move(box.x + box.width / 2 + 0, box.y + box.height / 2 + 170, { steps: 10 });
          await page.mouse.up();
        }
      })();

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
    onInitialized(e) {
      function expand(dataSource) {
        setTimeout(() => {
          dataSource.expandHeaderItem('row', ['North America']);
          dataSource.expandHeaderItem('column', [2013]);
        }, 0);
      }

      expand(e.component.getDataSource());
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

    const pivotGrid = page.locator('#container');

    await click(pivotGrid.getFieldChooserButton());

    const fieldChooser = pivotGrid.getFieldChooser();
    const fieldChooserTreeView = fieldChooser.getTreeView();

    await fieldChooserTreeView.getCheckBoxByNodeIndex(0).element.click();

    await (async () => {
        const box = await fieldChooser.getDataFields().nth(0).boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.mouse.down();
          await page.mouse.move(box.x + box.width / 2 + 0, box.y + box.height / 2 + 170, { steps: 10 });
          await page.mouse.up();
        }
      })();

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
    onInitialized(e) {
      function expand(dataSource) {
        setTimeout(() => {
          dataSource.expandHeaderItem('row', ['North America']);
          dataSource.expandHeaderItem('column', [2013]);
        }, 0);
      }

      expand(e.component.getDataSource());
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
      }, {
        caption: 'Total Hidden 4',
        dataField: 'amount',
        dataType: 'number',
        summaryType: 'sum',
        format: 'currency',
        area: 'data',
        visible: false,
        isMeasure: true,
      }, {
        caption: 'Total Hidden 5',
        dataField: 'amount',
        dataType: 'number',
        summaryType: 'sum',
        format: 'currency',
        area: 'data',
        visible: false,
        isMeasure: true,
      }, {
        caption: 'Total Hidden 6',
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

    const pivotGrid = page.locator('#container');

    await click(pivotGrid.getFieldChooserButton());

    const fieldChooser = pivotGrid.getFieldChooser();
    const fieldChooserTreeView = fieldChooser.getTreeView();

    const dataFields = fieldChooser.getDataFields();

    expect(dataFields.count).toBe(3)
      .expect(dataFields.nth(0).textContent)
      .eql('Total')
      .expect(dataFields.nth(1).textContent)
      .eql('Total 2')
      .expect(dataFields.nth(2).textContent)
      .eql('Total 3');

    await fieldChooserTreeView.getCheckBoxByNodeIndex(1).element.click();

    expect(dataFields.count).toBe(4)
      .expect(dataFields.nth(0).textContent)
      .eql('Total')
      .expect(dataFields.nth(1).textContent)
      .eql('Total 2')
      .expect(dataFields.nth(2).textContent)
      .eql('Total 3')
      .expect(dataFields.nth(3).textContent)
      .eql('Total 5');

    await (async () => {
        const box = await fieldChooser.getDataFields().nth(0).boundingBox();
        if (box) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.mouse.down();
          await page.mouse.move(box.x + box.width / 2 + 0, box.y + box.height / 2 + 150, { steps: 10 });
          await page.mouse.up();
        }
      })();

    expect(dataFields.count).toBe(4)
      .expect(dataFields.nth(0).textContent)
      .eql('Total 2')
      .expect(dataFields.nth(1).textContent)
      .eql('Total 3')
      .expect(dataFields.nth(2).textContent)
      .eql('Total 5')
      .expect(dataFields.nth(3).textContent)
      .eql('Total');

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

    const pivotGrid = page.locator('#container');

    await click(pivotGrid.getFieldChooserButton());
    await page.expect(pivotGrid.getFieldChooser().element.exists)
      .ok();

    });
});
