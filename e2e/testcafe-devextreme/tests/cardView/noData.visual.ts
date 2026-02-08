import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { testScreenshot } from '../../helpers/themeUtils';

fixture.disablePageReloads`CardView - HeaderPanel`
  .page(url(__dirname, '../container.html'));

const CARD_VIEW_SELECTOR = '#container';

test('default render', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'content-no-data.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCardView', {
  width: 1000,
  height: 600,
  columns: ['Customer', 'Order Date'],
  dataSource: [],
}));
