import CardView from 'devextreme-testcafe-models/cardView';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { baseConfig } from './helpers/baseConfig';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`CardView - FilterPanel Appearance`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

test('FilterPanel and FilterBuilderPopup screenshots', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const popup = cardView.getFilterPanel().getFilterBuilderPopup();
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'cardView_FilterPanel.png', { element: cardView.getFilterPanel().element });

  await t.click(cardView.getFilterPanel().getIconFilter().element);

  await testScreenshot(t, takeScreenshot, 'cardView_FilterBuilderPopup.png', { element: popup.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    filterValue: ['title', '=', 'Mr.'],
  });
});
