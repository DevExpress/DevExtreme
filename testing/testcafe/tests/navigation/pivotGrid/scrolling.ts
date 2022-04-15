import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
// eslint-disable-next-line import/extensions
import { virtualData, dataOptions } from './data.js';

fixture`PivotGrid_scrolling`
  .page(url(__dirname, './pages/T1081956.html'));

// T1081956
[
  { useNative: true, mode: 'standart' },
  { useNative: false, mode: 'standart' },
  { useNative: true, mode: 'virtual' },
  { useNative: false, mode: 'virtual' },
].forEach(({ useNative, mode }) => {
  test(`Rows sincronization with vertical scrollbar when scrolling{useNative=${useNative},mode=${mode}} and white-space cell is normal`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await ClientFunction(() => {
      // eslint-disable-next-line no-underscore-dangle
      ($('#container') as any).dxPivotGrid('instance')._dataArea._getScrollable().scrollTo({ top: 83200 });
    })();

    await t
      .expect(await takeScreenshot(`Rows_sinc_vert_scrollbar_useNative=${useNative}_mode=${mode}.png`, '#container'))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    const fields = [{
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
    },
    ];

    const dataSource = {
      store: virtualData,
      retrieveFields: false,
      fields,
    };

    return createWidget('dxPivotGrid', {
      dataSource,
      encodeHtml: false,
      showColumnTotals: false,
      height: 400,
      width: 1400,
      scrolling: {
        mode,
        useNative,
      },
    });
  });

  test(`Rows sincronization with both scrollbars when scrolling{useNative=${useNative},mode=${mode}} and white-space cell is normal`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await ClientFunction(() => {
      // eslint-disable-next-line no-underscore-dangle
      ($('#container') as any).dxPivotGrid('instance')._dataArea._getScrollable().scrollTo({ top: 132700 });
    })();

    await t
      .expect(await takeScreenshot(`Rows_sinc_both_scrollbars_useNative=${useNative}_mode=${mode}.png`, '#container'))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    const fields = [{
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
    },
    ];

    const dataSource = {
      store: virtualData,
      retrieveFields: false,
      fields,
    };

    return createWidget('dxPivotGrid', {
      dataSource,
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
