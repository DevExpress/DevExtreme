import { ClientFunction } from 'testcafe';
import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`KeyboardNavigation.onFocusedCardChanged`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

const initFocusedCardChangedArgs = ClientFunction(
  () => { (window as any).onFocusedCardChangedArgs = []; },
);
const getFocusedCardChangedArgs = ClientFunction(
  () => (window as any).onFocusedCardChangedArgs,
);
const clearFocusedCardChangedArgs = ClientFunction(
  () => { delete (window as any).onFocusedCardChangedArgs; },
);

test('Should be called on each card focus change', async (t) => {
  const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'];
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const card = cardView.getCard(4);

  await t.click(card.element);

  // eslint-disable-next-line no-restricted-syntax
  for (const key of keys) {
    await t.dispatchEvent(card.element, 'keydown', { key });
  }

  const result = await getFocusedCardChangedArgs();
  await t.expect(result).eql([4, 7, 8, 5, 4]);
}).before(async () => {
  await initFocusedCardChangedArgs();
  await createWidget('dxCardView', {
    dataSource: new Array(9).fill(undefined).map((_, idx) => ({ id: idx })),
    columns: ['id'],
    keyExpr: 'id',
    paging: {
      pageSize: 9,
    },
    onFocusedCardChanged: ({ cardIndex }) => {
      (window as any).onFocusedCardChangedArgs.push(cardIndex);
    },
    height: 700,
  });
}).after(async () => clearFocusedCardChangedArgs());

test('Should be called on focus change by click', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const firstCard = cardView.getCard(5);
  const secondCard = cardView.getCard(8);
  const thirdCard = cardView.getCard(0);

  await t
    .click(firstCard.element)
    .click(secondCard.element)
    .click(thirdCard.element);

  const result = await getFocusedCardChangedArgs();
  await t.expect(result).eql([5, 8, 0]);
}).before(async () => {
  await initFocusedCardChangedArgs();
  await createWidget('dxCardView', {
    dataSource: new Array(9).fill(undefined).map((_, idx) => ({ id: idx })),
    columns: ['id'],
    keyExpr: 'id',
    paging: {
      pageSize: 9,
    },
    onFocusedCardChanged: ({ cardIndex }) => {
      (window as any).onFocusedCardChangedArgs.push(cardIndex);
    },
    height: 700,
  });
}).after(async () => clearFocusedCardChangedArgs());
