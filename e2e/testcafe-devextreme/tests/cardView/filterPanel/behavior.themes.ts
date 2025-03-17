import CardView from 'devextreme-testcafe-models/cardView';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { baseConfig } from './helpers/baseConfig';

fixture.disablePageReloads`CardView - FilterPanel Appearance`
  .page(url(__dirname, '../../container.html'));

test('FilterPanel and FilterBuilderPopup screenshots', async (t) => {
  const cardView = new CardView('#container');
  const popup = cardView.getFilterPanel().getFilterBuilderPopup();
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('CardView_FilterPanel.png', cardView.getFilterPanel().element))
    .ok()

    .click(cardView.getFilterPanel().getIconFilter().element)

    .expect(await takeScreenshot('CardView_FilterBuilderPopup.png', popup.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    filterValue: ['title', '=', 'Mr.'],
  });
});
