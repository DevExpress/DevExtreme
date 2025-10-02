import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { testScreenshot } from '../../helpers/themeUtils';
import { addCaptionTo, appendElementTo, setAttribute } from '../../helpers/domUtils';

const waitFont = ClientFunction(() => (window as any).DevExpress.ui.themes.waitWebFont('Item123somevalu*op ', 400));

fixture.disablePageReloads`Form`
  .page(url(__dirname, '../container.html'));

test('SimpleItem: item1_cSpan_2', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'SimpleItem,item1_cSpan_2.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await waitFont();
  await setAttribute('#container', 'style', 'width: 500px;');

  for (let colCount = 1; colCount <= 4; colCount += 1) {
    const formId = `form${colCount}`;

    await appendElementTo('#container', 'div', formId);
    await addCaptionTo(`#${formId}`, `colCount = ${colCount}`);

    const formOptions = {
      height: 60,
      labelMode: 'static',
      colCount,
      items: [{ dataField: 'item_1', colSpan: 2 }],
    };

    await createWidget('dxForm', formOptions, `#${formId}`);
  }
});

[[1, 2], [2, 1], [2, 2]].forEach(([colSpan1, colSpan2]) => {
  const testName = `SimpleItem,item1_cSpan_${colSpan1},item2_cSpan_${colSpan2}`;
  test(testName, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `${testName}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await waitFont();
    await setAttribute('#container', 'style', 'width: 600px;');

    for (let colCount = 1; colCount <= 4; colCount += 1) {
      const formId = `form${colCount}`;

      await appendElementTo('#container', 'div', formId);
      await addCaptionTo(`#${formId}`, `colCount = ${colCount}`);

      const formOptions = {
        height: colCount > colSpan1 ? 60 : 100,
        labelMode: 'static',
        colCount,
        items: [
          { dataField: `item_1_span_${colSpan1}`, colSpan: colSpan1 },
          { dataField: `item_2_span_${colSpan2}`, colSpan: colSpan2 },
        ],
      };

      await createWidget('dxForm', formOptions, `#${formId}`);
    }
  });
});
