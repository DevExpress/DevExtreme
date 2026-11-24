import { test } from '../../../helpers/accessibility/test';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { createWidget } from '../../../helpers/createWidget';
import CardView from '../../../models/cardView';
import { columns, data } from '../../cardView/helpers/simpleArrayData';

const CARD_VIEW_SELECTOR = '#container';

const baseConfig = {
  columns,
  dataSource: data,
  keyExpr: 'id',
  editing: {
    allowUpdating: true,
    allowDeleting: true,
    allowAdding: true,
  },
};

test('default render', async ({ page }) => {
  await createWidget(page, 'dxCardView', baseConfig);

  await a11yCheck(page, {}, CARD_VIEW_SELECTOR);
});

test('render of add card popup', async ({ page }) => {
  await createWidget(page, 'dxCardView', baseConfig);

  const cardView = new CardView(page, CARD_VIEW_SELECTOR);

  await cardView.getToolbar().getAddButton().element.click();

  await a11yCheck(page, {}, CARD_VIEW_SELECTOR);
});

test('render of edit card popup', async ({ page }) => {
  await createWidget(page, 'dxCardView', baseConfig);

  const cardView = new CardView(page, CARD_VIEW_SELECTOR);

  await cardView.getCard(0).getToolbarItem(0).click();

  await a11yCheck(page, {}, CARD_VIEW_SELECTOR);
});
