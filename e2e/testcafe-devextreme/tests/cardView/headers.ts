import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture.disablePageReloads`CardView - Headers`
  .page(url(__dirname, '../container.html'));

test('default render', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshot('headers', Selector('.dx-gridcore-headers'));

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCardView', {
  width: 400,
  height: 600,
  columns: ['Customer', 'Order Date'],
}));
