import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { columns, data } from '../../cardView/helpers/simpleArrayData';
import { a11yCheck } from '../../../helpers/accessibility/utils';

fixture.disablePageReloads`CardView - Editing`
  .page(url(__dirname, '../../container.html'));

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

test('default render', async (t) => {
  await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
}).before(async () => createWidget('dxCardView', baseConfig));

test('render of add card popup', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  await t.click(cardView.getToolbar().getAddButton().element);

  await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
}).before(async () => createWidget('dxCardView', baseConfig));

test('render of edit card popup', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  await t.click(cardView.getCard(0).getToolbarItem(0));

  await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
}).before(async () => createWidget('dxCardView', baseConfig));
