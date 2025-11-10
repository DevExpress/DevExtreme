import { Selector } from 'testcafe';
import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { addFocusableElementBefore } from '../../../helpers/domUtils';

// NOTE: TestCafe cannot trigger "pressKey" on some specific element
// It triggers this event on document level and process keyboard navigation action immediately.
// Therefore, it's impossible to test switching focus between areas in TestCafe
// Because this feature works with event bubbling + inert attribute
fixture.disablePageReloads`KeyboardNavigation.Header`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

test('Should navigate between items by arrows', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const headerPanel = cardView.getHeaderPanel();

  await t
    .click(headerPanel.getHeaderItem(0).element)
    .pressKey('right right');

  const focusState = [
    await headerPanel.getHeaderItem(0).element.focused,
    await headerPanel.getHeaderItem(1).element.focused,
    await headerPanel.getHeaderItem(2).element.focused,
  ];

  await t.expect(focusState).eql([false, false, true]);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, A: 'A_0', B: 'B_0', C: 'C_0',
    },
  ],
  columns: ['A', 'B', 'C'],
  keyExpr: 'id',
  height: 700,
}));

test('Should focus item by click', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const headerPanel = cardView.getHeaderPanel();

  await t.click(headerPanel.getHeaderItem(1).element);

  const focusState = [
    await headerPanel.getHeaderItem(0).element.focused,
    await headerPanel.getHeaderItem(1).element.focused,
    await headerPanel.getHeaderItem(2).element.focused,
  ];

  await t.expect(focusState).eql([false, true, false]);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, A: 'A_0', B: 'B_0', C: 'C_0',
    },
  ],
  columns: ['A', 'B', 'C'],
  keyExpr: 'id',
  height: 700,
}));

test('Should continue arrow navigation from last focused item', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const headerPanel = cardView.getHeaderPanel();

  await t
    .click(headerPanel.getHeaderItem(1).element)
    .pressKey('right');

  const focusState = [
    await headerPanel.getHeaderItem(0).element.focused,
    await headerPanel.getHeaderItem(1).element.focused,
    await headerPanel.getHeaderItem(2).element.focused,
  ];

  await t.expect(focusState).eql([false, false, true]);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, A: 'A_0', B: 'B_0', C: 'C_0',
    },
  ],
  columns: ['A', 'B', 'C'],
  keyExpr: 'id',
  height: 700,
}));

test('Should enable sorting by Enter', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const headerPanel = cardView.getHeaderPanel();

  await addFocusableElementBefore(CARD_VIEW_SELECTOR);

  await t
    .click(Selector('#focusable-start'))
    .pressKey('tab')
    .expect(headerPanel.getHeaderItem(0).element.focused)
    .ok()
    .pressKey('enter')
    .wait(100);

  const texts = [
    await cardView.getCard(0).getFieldValueCell('Id').textContent,
    await cardView.getCard(1).getFieldValueCell('Id').textContent,
    await cardView.getCard(2).getFieldValueCell('Id').textContent,
    await cardView.getCard(3).getFieldValueCell('Id').textContent,
  ];

  await t.expect(texts).eql(['0', '1', '2', '3']);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { id: 1 },
    { id: 0 },
    { id: 3 },
    { id: 2 },
  ],
  columns: ['id'],
  keyExpr: 'id',
  height: 700,
}));

test('Should switch sorting by Enter', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const headerPanel = cardView.getHeaderPanel();

  await addFocusableElementBefore(CARD_VIEW_SELECTOR);

  await t
    .click(Selector('#focusable-start'))
    .pressKey('tab')
    .expect(headerPanel.getHeaderItem(0).element.focused)
    .ok()
    .pressKey('enter enter')
    .wait(100);

  const texts = [
    await cardView.getCard(0).getFieldValueCell('Id').textContent,
    await cardView.getCard(1).getFieldValueCell('Id').textContent,
    await cardView.getCard(2).getFieldValueCell('Id').textContent,
    await cardView.getCard(3).getFieldValueCell('Id').textContent,
  ];

  await t.expect(texts).eql(['3', '2', '1', '0']);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { id: 1 },
    { id: 0 },
    { id: 3 },
    { id: 2 },
  ],
  columns: ['id'],
  keyExpr: 'id',
  height: 700,
}));

test('Should clear sorting by ctrl+Enter', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const headerPanel = cardView.getHeaderPanel();

  await addFocusableElementBefore(CARD_VIEW_SELECTOR);

  await t
    .click(Selector('#focusable-start'))
    .pressKey('tab')
    .expect(headerPanel.getHeaderItem(0).element.focused)
    .ok()
    .pressKey('enter')
    .wait(100);

  const sortedTexts = [
    await cardView.getCard(0).getFieldValueCell('Id').textContent,
    await cardView.getCard(1).getFieldValueCell('Id').textContent,
    await cardView.getCard(2).getFieldValueCell('Id').textContent,
    await cardView.getCard(3).getFieldValueCell('Id').textContent,
  ];

  await t.expect(sortedTexts).eql(['0', '1', '2', '3']);

  await t
    .pressKey('ctrl+Enter')
    .wait(100);

  const unsortedTexts = [
    await cardView.getCard(0).getFieldValueCell('Id').textContent,
    await cardView.getCard(1).getFieldValueCell('Id').textContent,
    await cardView.getCard(2).getFieldValueCell('Id').textContent,
    await cardView.getCard(3).getFieldValueCell('Id').textContent,
  ];

  await t.expect(unsortedTexts).eql(['1', '0', '3', '2']);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { id: 1 },
    { id: 0 },
    { id: 3 },
    { id: 2 },
  ],
  columns: ['id'],
  keyExpr: 'id',
  height: 700,
}));

test('Should enable multi field sorting by shift+Enter', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const headerPanel = cardView.getHeaderPanel();

  await addFocusableElementBefore(CARD_VIEW_SELECTOR);

  await t
    .click(Selector('#focusable-start'))
    .pressKey('tab')
    .expect(headerPanel.getHeaderItem(0).element.focused)
    .ok()
    .pressKey('right shift+enter left shift+enter')
    .wait(100);

  const aTexts = [
    await cardView.getCard(0).getFieldValueCell('A').textContent,
    await cardView.getCard(1).getFieldValueCell('A').textContent,
    await cardView.getCard(2).getFieldValueCell('A').textContent,
    await cardView.getCard(3).getFieldValueCell('A').textContent,
  ];

  const idTexts = [
    await cardView.getCard(0).getFieldValueCell('Id').textContent,
    await cardView.getCard(1).getFieldValueCell('Id').textContent,
    await cardView.getCard(2).getFieldValueCell('Id').textContent,
    await cardView.getCard(3).getFieldValueCell('Id').textContent,
  ];

  await t.expect(aTexts).eql(['0', '0', '1', '1']);
  await t.expect(idTexts).eql(['2', '3', '0', '1']);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { id: 1, A: 1 },
    { id: 0, A: 1 },
    { id: 3, A: 0 },
    { id: 2, A: 0 },
  ],
  columns: ['id', 'A'],
  keyExpr: 'id',
  sorting: {
    mode: 'multiple',
  },
  height: 700,
}));

test('Should open header filter by alt+ArrowDown', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const headerPanel = cardView.getHeaderPanel();

  await addFocusableElementBefore(CARD_VIEW_SELECTOR);

  await t
    .click(Selector('#focusable-start'))
    .pressKey('tab')
    .expect(headerPanel.getHeaderItem(0).element.focused)
    .ok()
    .pressKey('alt+down');

  const popup = cardView.getHeaderFilterPopup();

  await t.expect(popup.element.exists).ok();
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { id: 1 },
    { id: 0 },
    { id: 3 },
    { id: 2 },
  ],
  columns: ['id'],
  keyExpr: 'id',
  height: 700,
}));
