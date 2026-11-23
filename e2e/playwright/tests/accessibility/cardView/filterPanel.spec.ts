import { test } from '../../../helpers/accessibility/test';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { createWidget } from '../../../helpers/createWidget';
import CardView from '../../../models/cardView';
import { baseConfig } from '../../cardView/filterPanel/helpers/baseConfig';

const CARD_VIEW_SELECTOR = '#container';

test('FilterPanel and FilterBuilderPopup', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
    ...baseConfig,
    filterValue: ['title', '=', 'Mr.'],
  });

  const cardView = new CardView(page, CARD_VIEW_SELECTOR);

  await cardView.getFilterPanel().getIconFilter().element.click();

  const a11yCheckConfig = {};
  await a11yCheck(page, a11yCheckConfig, CARD_VIEW_SELECTOR);
});
