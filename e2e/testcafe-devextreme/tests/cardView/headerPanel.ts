import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import CardView from 'testcafe-models/cardView';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture.disablePageReloads`CardView - HeaderPanel`
  .page(url(__dirname, '../container.html'));

test('default render', async (t) => {
  const cardView = new CardView('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshot('header-panel', cardView.getHeaderPanel().element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCardView', {
  width: 400,
  height: 600,
  columns: ['Customer', 'Order Date'],
}));
