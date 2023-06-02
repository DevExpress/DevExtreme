import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { insertStylesheetRulesToPage } from '../../helpers/domUtils';
import { isMaterial, testScreenshot } from '../../helpers/themeUtils';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
// eslint-disable-next-line import/extensions
import { virtualData } from './virtualData.js';
// eslint-disable-next-line import/extensions
import { dataOptions } from './virtualDataOptions.js';
import PivotGrid from '../../model/pivotGrid';

const testFixture = () => {
  if (isMaterial()) {
    return fixture.disablePageReloads.skip;
  }
  return fixture.disablePageReloads;
};

testFixture()`PivotGrid_scrolling`
  .page(url(__dirname, '../container.html'));

[
  { useNative: true, mode: 'standart' },
  { useNative: false, mode: 'standart' },
].forEach(({ useNative, mode }) => {
  test(`Rows syncronization with vertical scrollbar when scrolling{useNative=${useNative},mode=${mode}} and white-space cell is normal (T1081956)`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const pivotGrid = new PivotGrid('#container');

    await pivotGrid.scrollBy({ top: 300000 });
    await pivotGrid.scrollBy({ top: 100000 });
    await pivotGrid.scrollBy({ top: -150 });

    await testScreenshot(t, takeScreenshot, `PivotGrid rows sync dir=vertical,useNative=${useNative},mode=${mode}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await insertStylesheetRulesToPage('.dx-pivotgrid .dx-pivotgrid-area-data tbody td { white-space: normal !important; }');

    return createWidget('dxPivotGrid', {
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
  });

  test(`Rows syncronization with both scrollbars when scrolling{useNative=${useNative},mode=${mode}} and white-space cell is normal (T1081956)`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const pivotGrid = new PivotGrid('#container');

    await pivotGrid.scrollBy({ top: 300000 });
    await pivotGrid.scrollBy({ top: 100000 });
    await pivotGrid.scrollBy({ top: -150 });

    await testScreenshot(t, takeScreenshot, `PivotGrid rows sync dir=both,useNative=${useNative},mode=${mode}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await insertStylesheetRulesToPage('.dx-pivotgrid .dx-pivotgrid-area-data tbody td { white-space: normal !important; }');

    return createWidget('dxPivotGrid', {
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
  });
});
