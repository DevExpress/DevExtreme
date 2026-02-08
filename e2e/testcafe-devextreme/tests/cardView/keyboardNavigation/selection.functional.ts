import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`KeyboardNavigation.Selection`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

[
  { caseName: 'card selection', keys: 'space', result: [false, true, false] },
  { caseName: 'card cannot be deselected', keys: 'space space', result: [false, true, false] },
  { caseName: 'the next card selection', keys: 'space right space', result: [false, false, true] },
].forEach(({ caseName, keys, result }) => {
  test(`Should handle selection in single mode: ${caseName}`, async (t) => {
    const cardView = new CardView(CARD_VIEW_SELECTOR);
    const firstCard = cardView.getCard(1);

    await t
      .click(firstCard.element)
      .pressKey(keys);

    const selectionState = [
      await cardView.getCard(0).isSelected,
      await cardView.getCard(1).isSelected,
      await cardView.getCard(2).isSelected,
    ];

    await t.expect(selectionState).eql(result);
  }).before(async () => createWidget('dxCardView', {
    dataSource: new Array(3).fill(undefined).map((_, idx) => ({ id: idx })),
    columns: ['id'],
    keyExpr: 'id',
    selection: {
      mode: 'single',
    },
    height: 700,
  }));
});

[
  { caseName: 'card selection', keys: 'space', result: [false, true, false] },
  { caseName: 'card deselection', keys: 'space space', result: [false, false, false] },
  { caseName: 'the next card selection', keys: 'space right space', result: [false, true, true] },
  { caseName: 'range selection', keys: 'left space right right shift+space', result: [true, true, true] },
].forEach(({ caseName, keys, result }) => {
  test(`Should handle selection in multiple mode: ${caseName}`, async (t) => {
    const cardView = new CardView(CARD_VIEW_SELECTOR);
    const firstCard = cardView.getCard(1);

    await t
      .click(firstCard.element)
      .pressKey(keys);

    const selectionState = [
      await cardView.getCard(0).isSelected,
      await cardView.getCard(1).isSelected,
      await cardView.getCard(2).isSelected,
    ];

    await t.expect(selectionState).eql(result);
  }).before(async () => createWidget('dxCardView', {
    dataSource: new Array(3).fill(undefined).map((_, idx) => ({ id: idx })),
    columns: ['id'],
    keyExpr: 'id',
    selection: {
      mode: 'multiple',
    },
    height: 700,
  }));
});

test('Should do nothing after ctrl+a with selection single mode', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const firstCard = cardView.getCard(1);

  await t
    .dispatchEvent(firstCard.element, 'keydown', { key: 'a', ctrlKey: true });

  const selectionState = [
    await cardView.getCard(0).isSelected,
    await cardView.getCard(1).isSelected,
    await cardView.getCard(2).isSelected,
  ];

  await t.expect(selectionState).eql([false, false, false]);
}).before(async () => createWidget('dxCardView', {
  dataSource: new Array(3).fill(undefined).map((_, idx) => ({ id: idx })),
  columns: ['id'],
  keyExpr: 'id',
  selection: {
    mode: 'single',
  },
  height: 700,
}));

test('Should select all cards after ctrl+a with selection multiple mode', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const firstCard = cardView.getCard(1);

  await t
    .dispatchEvent(firstCard.element, 'keydown', { key: 'a', ctrlKey: true });

  const selectionState = [
    await cardView.getCard(0).isSelected,
    await cardView.getCard(1).isSelected,
    await cardView.getCard(2).isSelected,
  ];

  await t.expect(selectionState).eql([true, true, true]);
}).before(async () => createWidget('dxCardView', {
  dataSource: new Array(3).fill(undefined).map((_, idx) => ({ id: idx })),
  columns: ['id'],
  keyExpr: 'id',
  selection: {
    mode: 'multiple',
  },
  height: 700,
}));
