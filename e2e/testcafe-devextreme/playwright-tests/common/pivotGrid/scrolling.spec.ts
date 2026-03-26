import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, insertStylesheetRulesToPage, generateOptionMatrix } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe.skip('PivotGrid_scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [
    { useNative: true, mode: 'standart' },
    { useNative: false, mode: 'standart' },
  ].forEach(({ useNative, mode }) => {
    test(`Rows syncronization with vertical scrollbar when scrolling{useNative=${useNative},mode=${mode}} and white-space cell is normal (T1081956)`, async ({ page }) => {

      await insertStylesheetRulesToPage(page, '.dx-pivotgrid .dx-pivotgrid-area-data tbody td { white-space: normal !important; }');

      await createWidget(page, 'dxPivotGrid', {
        dataSource: {
          store: virtualData,
          retrieveFields: false,
          fields: [{
            area: 'data',
            dataType: 'string',
            summaryType: 'custom',
            calculateCustomSummary(options) {
              if (options.summaryProcess === 'calculate') {
                const item = options.value;
                options.totalValue = `<div>${item.value}</div>`;
              }
            },
          }, {
            dataField: 'y1path',
            area: 'row',
            width: 200,
            expanded: true,
          }, {
            dataField: 'y2code',
            area: 'row',
            width: dataOptions.data.y2.visible ? undefined : 1,
          }, {
            dataField: 'x1code',
            area: 'column',
            expanded: true,
          }],
        },
        encodeHtml: false,
        showColumnTotals: false,
        height: 400,
        width: 1200,
        scrolling: {
          mode,
          useNative,
        },
      });


      const pivotGrid = page.locator('#container');

      await pivotGrid.scrollBy({ top: 300000 });
      await pivotGrid.scrollBy({ top: 100000 });
      await pivotGrid.scrollBy({ top: -150 });

      await testScreenshot(page, `PivotGrid rows sync dir=vertical,useNative=${useNative},mode=${mode}.png`, { element: '#container' });

    });

    test(`Rows syncronization with both scrollbars when scrolling{useNative=${useNative},mode=${mode}} and white-space cell is normal (T1081956)`, async ({ page }) => {

      await insertStylesheetRulesToPage(page, '.dx-pivotgrid .dx-pivotgrid-area-data tbody td { white-space: normal !important; }');

      await createWidget(page, 'dxPivotGrid', {
        dataSource: {
          store: virtualData,
          retrieveFields: false,
          fields: [{
            area: 'data',
            dataType: 'string',
            summaryType: 'custom',
            calculateCustomSummary(options) {
              if (options.summaryProcess === 'calculate') {
                const item = options.value;
                options.totalValue = `<div>${item.value}</div>`;
              }
            },
          }, {
            dataField: 'y1path',
            area: 'row',
            width: 200,
            expanded: true,
          }, {
            dataField: 'y2code',
            area: 'row',
            width: dataOptions.data.y2.visible ? undefined : 1,
          }, {
            dataField: 'x1code',
            area: 'column',
            expanded: true,
          }],
        },
        encodeHtml: false,
        showColumnTotals: false,
        height: 400,
        width: 800,
        scrolling: {
          mode,
          useNative,
        },
      });


      const pivotGrid = page.locator('#container');

      await pivotGrid.scrollBy({ top: 300000 });
      await pivotGrid.scrollBy({ top: 100000 });
      await pivotGrid.scrollBy({ top: -150 });

      await testScreenshot(page, `PivotGrid rows sync dir=both,useNative=${useNative},mode=${mode}.png`, { element: '#container' });

    });
  });

  generateOptionMatrix({
    height: [450, 350],
    useNative: [false, true],
  }).forEach(({ height, useNative }) => {
    test(`Rows content dont hide under vertical scrollbar when scrolling{useNative=${useNative}},height=100% (${height}px) (T1290313)`, async ({ page }) => {

      await insertStylesheetRulesToPage(page, `#parentContainer { height: ${height}px; }`);

      await createWidget(page, 'dxPivotGrid', {
        height: '100%',
        showBorders: true,
        scrolling: {
          useNative,
          mode: 'standard',
        },
        dataSource: {
          fields: [{
            dataField: 'rowField',
            area: 'row',
          }, {
            dataField: 'dataField',
            area: 'data',
          }, {
            dataField: 'dataField',
            area: 'data',
          }],
          store: Array.from({ length: 9 }).map((_, id) => ({
            id,
            rowField: id > 7 ? 'row '.repeat(id) : `row ${id}`,
            dataField: 47,
          })),
        },
      });


      await testScreenshot(page,
        `PivotGrid rows content height=100%(${height}px),useNative=${useNative}.png`,
        { element: '#container' },
      );

    });
  });

  generateOptionMatrix({
    rtlEnabled: [false, true],
    nativeScrolling: [false, true],
  }).forEach(({ rtlEnabled, nativeScrolling }) => {
    test(`Should set margin for scroll-bar correctly (T1214743), rtl=${rtlEnabled}, nativeScrolling=${nativeScrolling}`, async ({ page }) => {
    await createWidget(page, 'dxPivotGrid', {
      height: 400,
      scrolling: { useNative: nativeScrolling },
      showBorders: true,
      rtlEnabled,
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
          selector(data) {
            return `${data.city} (${data.country})`;
          },
        }, {
          dataField: 'date',
          dataType: 'date',
          area: 'column',
        }, {
          caption: 'Sales',
          dataField: 'amount',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
        }],
        store: sales,
      },
    });

      const pivotGrid = page.locator('#container');

      const firstCellToClick = pivotGrid.getRowsArea().getCell(1);
      await click(firstCellToClick);
      await testScreenshot(page, `scrollbar-margin_step-0_useNative-${nativeScrolling}_rtl-${rtlEnabled}`, { element: pivotGrid.element });

      const secondCellToClick = pivotGrid.getRowsArea().getCell(6);
      await click(secondCellToClick);
      await testScreenshot(page, `scrollbar-margin_step-1_useNative-${nativeScrolling}_rtl-${rtlEnabled}`, { element: pivotGrid.element });

      await click(secondCellToClick);
      await testScreenshot(page, `scrollbar-margin_step-2_useNative-${nativeScrolling}_rtl-${rtlEnabled}`, { element: pivotGrid.element });

    });
  });
});
