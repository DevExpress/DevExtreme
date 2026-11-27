import { test } from '../../../helpers/accessibility/test';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { createWidget } from '../../../helpers/createWidget';

test('default render', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
    width: 1000,
    height: 600,
    columns: ['Customer', 'Order Date'],
    dataSource: [],
  });

  await a11yCheck(page, {}, DEFAULT_SELECTOR);
});
