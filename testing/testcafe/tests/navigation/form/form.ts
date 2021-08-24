import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';

fixture`Form`
  .page(url(__dirname, '../../container.html'));

test('Empty form', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('Empty Form', Selector('#container')))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxForm', {
  width: 100,
  height: 100,
}));

test('1 TextBox, colCount: 1', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('1 TextBox, colCount: 1', Selector('#container')))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxForm', {
  width: 100,
  height: 100,
  colCount: 1,
  items: [{
    dataField: 'TextBox',
  }],
}));
