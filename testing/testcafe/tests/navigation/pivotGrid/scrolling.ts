import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
// eslint-disable-next-line import/extensions
import { virtualData } from './virtualData.js';
// eslint-disable-next-line import/extensions
import { dataOptions } from './virtualDataOptions.js';
import PivotGrid from '../../../model/pivotGrid';
import { deleteStylesheetRule, insertStylesheetRule } from '../helpers/domUtils';

fixture`PivotGrid_scrolling`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

[
  { useNative: true, mode: 'standart' },
  { useNative: false, mode: 'standart' },
  { useNative: true, mode: 'virtual' },
  { useNative: false, mode: 'virtual' },
].forEach(({ useNative, mode }) => {
  test(`Rows sincronization with vertical scrollbar when scrolling{useNative=${useNative},mode=${mode}} and white-space cell is normal (T1081956)`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const pivotGrid = new PivotGrid('#container');

    await pivotGrid.scrollBy({ top: 300000 });
    await t.wait(1000);
    await pivotGrid.scrollBy({ top: 100000 });
    await t.wait(1000);
    await pivotGrid.scrollBy({ top: -150 });
    await t.wait(1000);

    await t
      .expect(await takeScreenshot(`Rows_sinc_vert_scrollbar_useNative=${useNative}_mode=${mode}.png`, '#container'))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await insertStylesheetRule('.dx-pivotgrid .dx-pivotgrid-area-data tbody td { white-space: normal !important }', 0);

    return createWidget('dxPivotGrid', {
      loadingTimeout: null,
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
  }).after(async () => {
    await deleteStylesheetRule(0);
  });

  test(`Rows sincronization with both scrollbars when scrolling{useNative=${useNative},mode=${mode}} and white-space cell is normal (T1081956)`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const pivotGrid = new PivotGrid('#container');

    await pivotGrid.scrollBy({ top: 300000 });
    await t.wait(1000);
    await pivotGrid.scrollBy({ top: 100000 });
    await t.wait(1000);
    await pivotGrid.scrollBy({ top: -150 });
    await t.wait(1000);

    await t
      .expect(await takeScreenshot(`Rows_sinc_both_scrollbars_useNative=${useNative}_mode=${mode}.png`, '#container'))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await insertStylesheetRule('.dx-pivotgrid .dx-pivotgrid-area-data tbody td { white-space: normal !important }', 0);

    return createWidget('dxPivotGrid', {
      loadingTimeout: null,
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
  }).after(async () => {
    await deleteStylesheetRule(0);
  });
});
