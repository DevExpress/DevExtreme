import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { baseConfig } from '../../cardView/filterPanel/helpers/baseConfig';
import { a11yCheck } from '../../../helpers/accessibility/utils';

fixture.disablePageReloads`CardView - FilterPanel Appearance`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

test('FilterPanel and FilterBuilderPopup', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  await t.click(cardView.getFilterPanel().getIconFilter().element);

  const a11yCheckConfig = {
    rules: { 'color-contrast': { enabled: false } },
  };
  await a11yCheck(t, a11yCheckConfig, CARD_VIEW_SELECTOR);
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    filterValue: ['title', '=', 'Mr.'],
  });
});
