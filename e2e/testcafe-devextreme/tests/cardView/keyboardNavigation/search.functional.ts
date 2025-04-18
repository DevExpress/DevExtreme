import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`KeyboardNavigation.Selection`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

test('Should focus search text box after ctrl+f if card is focused', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const firstCard = cardView.getCard(1);

  await t
    .click(firstCard.element)
    .dispatchEvent(firstCard.element, 'keydown', { key: 'f', ctrlKey: true });

  const toolbar = cardView.getToolbar();
  const isFocused = await toolbar.getSearchTextBox()?.isFocused;

  await t.expect(isFocused).ok();
}).before(async () => createWidget('dxCardView', {
  dataSource: new Array(6).fill(undefined).map((_, idx) => ({ id: idx })),
  columns: ['id'],
  keyExpr: 'id',
  searchPanel: {
    visible: true,
  },
  height: 700,
}));

test('Should do nothing after ctrl+f if card is not focused', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const toolbar = cardView.getToolbar();

  await t
    .click(toolbar.element)
    .dispatchEvent(toolbar.element, 'keydown', { key: 'f', ctrlKey: true });

  const isFocused = await toolbar.getSearchTextBox()?.isFocused;

  await t.expect(isFocused).notOk();
}).before(async () => createWidget('dxCardView', {
  dataSource: new Array(6).fill(undefined).map((_, idx) => ({ id: idx })),
  columns: ['id'],
  keyExpr: 'id',
  searchPanel: {
    visible: true,
  },
  height: 700,
}));
