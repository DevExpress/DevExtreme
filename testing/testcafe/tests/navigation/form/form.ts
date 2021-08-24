import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';

fixture`Form`
  .page(url(__dirname, '../../container.html'));

test('Empty', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('Empty', Selector('#container')))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxForm', {
  width: 100,
  height: 100,
}));

// eslint-disable-next-line no-plusplus
for (let colCount = 1; colCount <= 3; colCount++) {
  const testName = `TextBox_1,colCount_${colCount}`;
  test(testName, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`${testName}.png`, Selector('#container')))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxForm', {
    width: 100,
    height: 100,
    colCount: 1,
    items: [{
      dataField: `TextBox_${colCount}`,
    }],
  }));
}
