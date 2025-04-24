import { ClientFunction } from 'testcafe';
import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`KeyboardNavigation.OnKeyDown`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

const initKeyDownArgs = ClientFunction(() => { (window as any).onKeyDownArgs = []; });
const getKeyDownArgs = ClientFunction(() => (window as any).onKeyDownArgs);
const clearKeyDownArgs = ClientFunction(() => { delete (window as any).onKeyDownArgs; });

test('Should be called on header item unhandled event', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const headerItem = cardView.getHeaders().getHeaderItemNth(0);

  await t.dispatchEvent(headerItem.element, 'keydown', { key: 'a' });

  const result = await getKeyDownArgs();
  await t.expect(result).eql([{ handled: false, key: 'a' }]);
}).before(async () => {
  await initKeyDownArgs();
  await createWidget('dxCardView', {
    dataSource: new Array(6).fill(undefined).map((_, idx) => ({ id: idx })),
    columns: ['id'],
    keyExpr: 'id',
    onKeyDown: ({ handled, event: { key } }) => {
      (window as any).onKeyDownArgs.push({ handled, key });
    },
    height: 700,
  });
}).after(async () => clearKeyDownArgs());

test('Should be called on header item handled event', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const headerItem = cardView.getHeaders().getHeaderItemNth(0);

  await t.dispatchEvent(headerItem.element, 'keydown', { key: 'ArrowRight' });

  const result = await getKeyDownArgs();
  await t.expect(result).eql([{ handled: true, key: 'ArrowRight' }]);
}).before(async () => {
  await initKeyDownArgs();
  await createWidget('dxCardView', {
    dataSource: new Array(6).fill(undefined).map((_, idx) => ({ id: idx })),
    columns: ['id'],
    keyExpr: 'id',
    onKeyDown: ({ handled, event: { key } }) => {
      (window as any).onKeyDownArgs.push({ handled, key });
    },
    height: 700,
  });
}).after(async () => clearKeyDownArgs());

test('Should be called on card unhandled event', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const card = cardView.getCard(0);

  await t.dispatchEvent(card.element, 'keydown', { key: 'b' });

  const result = await getKeyDownArgs();
  await t.expect(result).eql([{ handled: false, key: 'b' }]);
}).before(async () => {
  await initKeyDownArgs();
  await createWidget('dxCardView', {
    dataSource: new Array(6).fill(undefined).map((_, idx) => ({ id: idx })),
    columns: ['id'],
    keyExpr: 'id',
    onKeyDown: ({ handled, event: { key } }) => {
      (window as any).onKeyDownArgs.push({ handled, key });
    },
    height: 700,
  });
}).after(async () => clearKeyDownArgs());

test('Should be called on card handled event', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const card = cardView.getCard(0);

  await t.dispatchEvent(card.element, 'keydown', { key: 'ArrowRight' });

  const result = await getKeyDownArgs();
  await t.expect(result).eql([{ handled: true, key: 'ArrowRight' }]);
}).before(async () => {
  await initKeyDownArgs();
  await createWidget('dxCardView', {
    dataSource: new Array(6).fill(undefined).map((_, idx) => ({ id: idx })),
    columns: ['id'],
    keyExpr: 'id',
    onKeyDown: ({ handled, event: { key } }) => {
      (window as any).onKeyDownArgs.push({ handled, key });
    },
    height: 700,
  });
}).after(async () => clearKeyDownArgs());

test('Should be called on card unhandled event inside focus trap', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const checkbox = cardView.getCard(0).getSelectCheckbox();

  await t.dispatchEvent(checkbox, 'keydown', { key: 'c' });

  const result = await getKeyDownArgs();
  await t.expect(result).eql([{ handled: false, key: 'c' }]);
}).before(async () => {
  await initKeyDownArgs();
  await createWidget('dxCardView', {
    dataSource: new Array(6).fill(undefined).map((_, idx) => ({ id: idx })),
    columns: ['id'],
    keyExpr: 'id',
    onKeyDown: ({ handled, event: { key } }) => {
      (window as any).onKeyDownArgs.push({ handled, key });
    },
    selection: {
      mode: 'multiple',
    },
    height: 700,
  });
}).after(async () => clearKeyDownArgs());

test('Should be called on card handled event inside focus trap', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const checkbox = cardView.getCard(0).getSelectCheckbox();

  await t.dispatchEvent(checkbox, 'keydown', { key: 'Escape' });

  const result = await getKeyDownArgs();
  await t.expect(result).eql([{ handled: true, key: 'Escape' }]);
}).before(async () => {
  await initKeyDownArgs();
  await createWidget('dxCardView', {
    dataSource: new Array(6).fill(undefined).map((_, idx) => ({ id: idx })),
    columns: ['id'],
    keyExpr: 'id',
    onKeyDown: ({ handled, event: { key } }) => {
      (window as any).onKeyDownArgs.push({ handled, key });
    },
    selection: {
      mode: 'multiple',
    },
    height: 700,
  });
}).after(async () => clearKeyDownArgs());
