import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

// TODO: Add card inner KBN tests after editing will be ready
fixture.disablePageReloads`KeyboardNavigation.ContentView`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

const getResultMatrix = (rowIdx: number, colIdx: number) => new Array(9)
  .fill(false)
  .map((_, idx) => idx === (rowIdx * 3 + colIdx));

[
  { caseName: 'arrows -> same first item', keys: 'right left', result: getResultMatrix(1, 1) },
  { caseName: 'arrows -> left item', keys: 'left', result: getResultMatrix(1, 0) },
  { caseName: 'arrows -> right item', keys: 'right', result: getResultMatrix(1, 2) },
  { caseName: 'arrows -> top item', keys: 'up', result: getResultMatrix(0, 1) },
  { caseName: 'arrows -> bottom item', keys: 'down', result: getResultMatrix(2, 1) },
  { caseName: 'arrows -> no left overflow', keys: 'left left left left left', result: getResultMatrix(1, 0) },
  { caseName: 'arrows -> no right overflow', keys: 'right right right right right', result: getResultMatrix(1, 2) },
  { caseName: 'arrows -> no top overflow', keys: 'up up up up up', result: getResultMatrix(0, 1) },
  { caseName: 'arrows -> no bottom overflow', keys: 'down down down down down', result: getResultMatrix(2, 1) },
  { caseName: 'first in same row', keys: 'home', result: getResultMatrix(1, 0) },
  { caseName: 'last in same row', keys: 'end', result: getResultMatrix(1, 2) },
  { caseName: 'first in first row', keys: 'ctrl+home', result: getResultMatrix(0, 0) },
  { caseName: 'last in last row', keys: 'ctrl+end', result: getResultMatrix(2, 2) },
].forEach(({ caseName, keys, result }) => {
  test(`Should move between cards: ${caseName}`, async (t) => {
    const cardView = new CardView(CARD_VIEW_SELECTOR);
    const firstCard = cardView.getCard(4);

    await t
      .click(firstCard.element)
      .pressKey(keys);

    const focusState = [
      await cardView.getCard(0).element.focused,
      await cardView.getCard(1).element.focused,
      await cardView.getCard(2).element.focused,
      await cardView.getCard(3).element.focused,
      await cardView.getCard(4).element.focused,
      await cardView.getCard(5).element.focused,
      await cardView.getCard(6).element.focused,
      await cardView.getCard(7).element.focused,
      await cardView.getCard(8).element.focused,
    ];

    await t.expect(focusState).eql(result);
  }).before(async () => createWidget('dxCardView', {
    dataSource: new Array(9).fill(undefined).map((_, idx) => ({ id: idx })),
    columns: ['id'],
    keyExpr: 'id',
    paging: {
      pageSize: 9,
    },
    height: 700,
  }));
});

test('Should change page to the previous one and focus first card', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const firstCard = cardView.getCard(1);
  const firstCardValue = await firstCard.getFieldValueCell('Id').textContent;

  await t.expect(firstCardValue).eql('4');

  await t
    .click(firstCard.element)
    .pressKey('pageup');

  const targetCardText = await cardView.getCard(0).getFieldValueCell('Id').textContent;
  const focusState = [
    await cardView.getCard(0).element.focused,
    await cardView.getCard(1).element.focused,
    await cardView.getCard(2).element.focused,
  ];

  await t.expect(focusState).eql([true, false, false]);
  await t.expect(targetCardText).eql('0');
}).before(async () => createWidget('dxCardView', {
  dataSource: new Array(9).fill(undefined).map((_, idx) => ({ id: idx })),
  columns: ['id'],
  keyExpr: 'id',
  paging: {
    pageSize: 3,
    pageIndex: 1,
  },
  height: 700,
}));

test('Should change page to the next one and focus first card', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const firstCard = cardView.getCard(1);
  const firstCardValue = await firstCard.getFieldValueCell('Id').textContent;

  await t.expect(firstCardValue).eql('4');

  await t
    .click(firstCard.element)
    .pressKey('pagedown');

  const targetCardText = await cardView.getCard(0).getFieldValueCell('Id').textContent;
  const focusState = [
    await cardView.getCard(0).element.focused,
    await cardView.getCard(1).element.focused,
    await cardView.getCard(2).element.focused,
  ];

  await t.expect(focusState).eql([true, false, false]);
  await t.expect(targetCardText).eql('6');
}).before(async () => createWidget('dxCardView', {
  dataSource: new Array(9).fill(undefined).map((_, idx) => ({ id: idx })),
  columns: ['id'],
  keyExpr: 'id',
  paging: {
    pageSize: 3,
    pageIndex: 1,
  },
  height: 700,
}));

test('Should do nothing if pageup pressed on first page', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const firstCard = cardView.getCard(2);
  const firstCardValue = await firstCard.getFieldValueCell('Id').textContent;

  await t.expect(firstCardValue).eql('2');

  await t
    .click(firstCard.element)
    .pressKey('pageup');

  const targetCardText = await cardView.getCard(0).getFieldValueCell('Id').textContent;
  const focusState = [
    await cardView.getCard(0).element.focused,
    await cardView.getCard(1).element.focused,
    await cardView.getCard(2).element.focused,
  ];

  await t.expect(focusState).eql([false, false, true]);
  await t.expect(targetCardText).eql('0');
}).before(async () => createWidget('dxCardView', {
  dataSource: new Array(9).fill(undefined).map((_, idx) => ({ id: idx })),
  columns: ['id'],
  keyExpr: 'id',
  paging: {
    pageSize: 3,
    pageIndex: 0,
  },
  height: 700,
}));

test('Should do nothing if pagedown pressed on last page', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const firstCard = cardView.getCard(2);
  const firstCardValue = await firstCard.getFieldValueCell('Id').textContent;

  await t.expect(firstCardValue).eql('8');

  await t
    .click(firstCard.element)
    .pressKey('pagedown');

  const targetCardText = await cardView.getCard(0).getFieldValueCell('Id').textContent;
  const focusState = [
    await cardView.getCard(0).element.focused,
    await cardView.getCard(1).element.focused,
    await cardView.getCard(2).element.focused,
  ];

  await t.expect(focusState).eql([false, false, true]);
  await t.expect(targetCardText).eql('6');
}).before(async () => createWidget('dxCardView', {
  dataSource: new Array(9).fill(undefined).map((_, idx) => ({ id: idx })),
  columns: ['id'],
  keyExpr: 'id',
  paging: {
    pageSize: 3,
    pageIndex: 2,
  },
  height: 700,
}));
