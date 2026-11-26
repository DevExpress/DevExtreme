import { test } from '../../../helpers/accessibility/test';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { createWidget } from '../../../helpers/createWidget';

const CARD_VIEW_SELECTOR = '#container';

test('default render', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
    width: 1000,
    height: 600,
    columns: ['Customer', 'Order Date'],
    dataSource: [],
  });

  await a11yCheck(page, {}, CARD_VIEW_SELECTOR);
});
