import CardView from 'devextreme-testcafe-models/cardView';
import { ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`Selection.Functional`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

test('Single mode: select a first card -> select a second card -> deselect a second card', async (t) => {
  // arrange
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const firstCard = cardView.getCard(0);
  const secondCard = cardView.getCard(1);

  // act
  await t.click(firstCard.element);

  // assert
  await t.expect(firstCard.isSelected).ok();

  // act
  await t.click(secondCard.element);

  // assert
  await t
    .expect(firstCard.isSelected)
    .notOk()
    .expect(secondCard.isSelected)
    .ok();

  // act
  await t.click(secondCard.element, { modifiers: { ctrl: true } });

  // assert
  await t
    .expect(firstCard.isSelected)
    .notOk()
    .expect(secondCard.isSelected)
    .notOk();
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, title: 'header1', A: 'A_0', B: 'B_0', C: 'C_0',
    },
    {
      id: 1, title: 'header2', A: 'A_1', B: 'B_1', C: 'C_1',
    },
    {
      id: 2, title: 'header3', A: 'A_2', B: 'B_2', C: 'C_2',
    },
    {
      id: 3, title: 'header4', A: 'A_3', B: 'B_3', C: 'C_3',
    },
    {
      id: 4, title: 'header5', A: 'A_4', B: 'B_4', C: 'C_4',
    },
  ],
  cardHeader: {
    captionExpr: () => 'title',
  },
  columns: ['A', 'B', 'C'],
  keyExpr: 'id',
  height: 700,
  selection: {
    mode: 'single',
  },
}));

test('Multiple mode with showCheckBoxesMode=\'always\': select a first card -> select a second card -> deselect a first card -> deselect a second card', async (t) => {
  // arrange
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const firstCard = cardView.getCard(0);
  const firstSelectCheckbox = firstCard.getSelectCheckbox();
  const secondCard = cardView.getCard(1);
  const secondSelectCheckbox = secondCard.getSelectCheckbox();

  // act
  await t.click(firstSelectCheckbox);

  // assert
  await t.expect(firstCard.isSelected).ok();

  // act
  await t.click(secondSelectCheckbox);

  // assert
  await t
    .expect(firstCard.isSelected)
    .ok()
    .expect(secondCard.isSelected)
    .ok();

  // act
  await t.click(firstSelectCheckbox);

  // assert
  await t
    .expect(firstCard.isSelected)
    .notOk()
    .expect(secondCard.isSelected)
    .ok();

  // act
  await t.click(secondSelectCheckbox);

  // assert
  await t
    .expect(firstCard.isSelected)
    .notOk()
    .expect(secondCard.isSelected)
    .notOk();
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, title: 'header1', A: 'A_0', B: 'B_0', C: 'C_0',
    },
    {
      id: 1, title: 'header2', A: 'A_1', B: 'B_1', C: 'C_1',
    },
    {
      id: 2, title: 'header3', A: 'A_2', B: 'B_2', C: 'C_2',
    },
    {
      id: 3, title: 'header4', A: 'A_3', B: 'B_3', C: 'C_3',
    },
    {
      id: 4, title: 'header5', A: 'A_4', B: 'B_4', C: 'C_4',
    },
  ],
  cardHeader: {
    captionExpr: () => 'title',
  },
  columns: ['A', 'B', 'C'],
  keyExpr: 'id',
  height: 700,
  selection: {
    mode: 'multiple',
    showCheckBoxesMode: 'always',
    allowSelectAll: true,
  },
}));

test('Multiple mode with showCheckBoxesMode=\'always\': select a several cards with shift -> unselect a several cards with shift', async (t) => {
  // arrange
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const firstCard = cardView.getCard(0);
  const secondCard = cardView.getCard(1);
  const thirdCard = cardView.getCard(2);
  const firstSelectCheckbox = firstCard.getSelectCheckbox();
  const thirdSelectCheckbox = thirdCard.getSelectCheckbox();

  // act
  await t.click(firstSelectCheckbox);

  // assert
  await t.expect(firstCard.isSelected).ok();

  // act
  await t.click(thirdSelectCheckbox, { modifiers: { shift: true } });

  // assert
  await t
    .expect(firstCard.isSelected)
    .ok()
    .expect(secondCard.isSelected)
    .ok()
    .expect(thirdCard.isSelected)
    .ok();

  // act
  await t.click(firstSelectCheckbox, { modifiers: { shift: true } });

  // assert
  await t
    .expect(firstCard.isSelected)
    .ok()
    .expect(secondCard.isSelected)
    .notOk()
    .expect(thirdCard.isSelected)
    .notOk();
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, title: 'header1', A: 'A_0', B: 'B_0', C: 'C_0',
    },
    {
      id: 1, title: 'header2', A: 'A_1', B: 'B_1', C: 'C_1',
    },
    {
      id: 2, title: 'header3', A: 'A_2', B: 'B_2', C: 'C_2',
    },
    {
      id: 3, title: 'header4', A: 'A_3', B: 'B_3', C: 'C_3',
    },
    {
      id: 4, title: 'header5', A: 'A_4', B: 'B_4', C: 'C_4',
    },
  ],
  cardHeader: {
    captionExpr: () => 'title',
  },
  columns: ['A', 'B', 'C'],
  keyExpr: 'id',
  height: 700,
  selection: {
    mode: 'multiple',
    showCheckBoxesMode: 'always',
    allowSelectAll: true,
  },
}));

test('Multiple mode with showCheckBoxesMode=\'onClick\': select a first card by clicking a checkbox -> deselect a first card by clicking a checkbox', async (t) => {
  // arrange
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const firstCard = cardView.getCard(0);
  const firstSelectCheckbox = firstCard.getSelectCheckbox();
  const firstSelectCheckboxItemContent = firstCard.getToolbarItemContent(0);

  // act
  await t.hover(firstSelectCheckboxItemContent);

  // assert
  await t.expect(firstSelectCheckbox.visible).ok();

  // act
  await t.click(firstSelectCheckbox);

  // assert
  await t
    .expect(firstCard.isSelected)
    .ok()
    .expect(cardView.isCheckBoxesHidden())
    .notOk();

  // act
  await t.click(firstSelectCheckbox);

  // assert
  await t
    .expect(firstCard.isSelected)
    .notOk()
    .expect(cardView.isCheckBoxesHidden())
    .ok();
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, title: 'header1', A: 'A_0', B: 'B_0', C: 'C_0',
    },
    {
      id: 1, title: 'header2', A: 'A_1', B: 'B_1', C: 'C_1',
    },
    {
      id: 2, title: 'header3', A: 'A_2', B: 'B_2', C: 'C_2',
    },
    {
      id: 3, title: 'header4', A: 'A_3', B: 'B_3', C: 'C_3',
    },
    {
      id: 4, title: 'header5', A: 'A_4', B: 'B_4', C: 'C_4',
    },
  ],
  cardHeader: {
    captionExpr: () => 'title',
  },
  columns: ['A', 'B', 'C'],
  keyExpr: 'id',
  height: 700,
  selection: {
    mode: 'multiple',
    showCheckBoxesMode: 'onClick',
    allowSelectAll: true,
  },
}));

test('Multiple mode with showCheckBoxesMode=\'onClick\': select a first card by clicking a card -> deselect a first card by clicking a card', async (t) => {
  // arrange
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const firstCard = cardView.getCard(0);

  // act
  await t.click(firstCard.element);

  // assert
  await t
    .expect(firstCard.isSelected)
    .ok()
    .expect(cardView.isCheckBoxesHidden())
    .ok();

  // act
  await t.click(firstCard.element, { modifiers: { ctrl: true } });

  // assert
  await t
    .expect(firstCard.isSelected)
    .notOk()
    .expect(cardView.isCheckBoxesHidden())
    .ok();
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, title: 'header1', A: 'A_0', B: 'B_0', C: 'C_0',
    },
    {
      id: 1, title: 'header2', A: 'A_1', B: 'B_1', C: 'C_1',
    },
    {
      id: 2, title: 'header3', A: 'A_2', B: 'B_2', C: 'C_2',
    },
    {
      id: 3, title: 'header4', A: 'A_3', B: 'B_3', C: 'C_3',
    },
    {
      id: 4, title: 'header5', A: 'A_4', B: 'B_4', C: 'C_4',
    },
  ],
  cardHeader: {
    captionExpr: () => 'title',
  },
  columns: ['A', 'B', 'C'],
  keyExpr: 'id',
  height: 700,
  selection: {
    mode: 'multiple',
    showCheckBoxesMode: 'onClick',
    allowSelectAll: true,
  },
}));

test('Multiple mode with showCheckBoxesMode=\'onClick\': select a first card -> select a second card (first card selection state is reset) -> select a first card with ctrl', async (t) => {
  // arrange
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const firstCard = cardView.getCard(0);
  const secondCard = cardView.getCard(1);

  // act
  await t.click(firstCard.element);

  // assert
  await t
    .expect(firstCard.isSelected)
    .ok()
    .expect(cardView.isCheckBoxesHidden())
    .ok();

  // act
  await t.click(secondCard.element);

  // assert
  await t
    .expect(firstCard.isSelected)
    .notOk()
    .expect(secondCard.isSelected)
    .ok()
    .expect(cardView.isCheckBoxesHidden())
    .ok();

  // act
  await t.click(firstCard.element, { modifiers: { ctrl: true } });

  // assert
  await t
    .expect(firstCard.isSelected)
    .ok()
    .expect(secondCard.isSelected)
    .ok()
    .expect(cardView.isCheckBoxesHidden())
    .notOk();
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, title: 'header1', A: 'A_0', B: 'B_0', C: 'C_0',
    },
    {
      id: 1, title: 'header2', A: 'A_1', B: 'B_1', C: 'C_1',
    },
    {
      id: 2, title: 'header3', A: 'A_2', B: 'B_2', C: 'C_2',
    },
    {
      id: 3, title: 'header4', A: 'A_3', B: 'B_3', C: 'C_3',
    },
    {
      id: 4, title: 'header5', A: 'A_4', B: 'B_4', C: 'C_4',
    },
  ],
  cardHeader: {
    captionExpr: () => 'title',
  },
  columns: ['A', 'B', 'C'],
  keyExpr: 'id',
  height: 700,
  selection: {
    mode: 'multiple',
    showCheckBoxesMode: 'onClick',
    allowSelectAll: true,
  },
}));

test('Multiple mode with showCheckBoxesMode=\'onClick\': select a first card by card hold -> deselect a first card by card hold', async (t) => {
  // arrange
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const firstCard = cardView.getCard(0);

  // act
  await ClientFunction((card) => {
    $(card()).trigger('dxhold');
  })(firstCard.element);

  // assert
  await t
    .expect(firstCard.isSelected)
    .ok()
    .expect(cardView.isCheckBoxesHidden())
    .notOk();

  // act
  await ClientFunction((card) => {
    $(card()).trigger('dxhold');
  })(firstCard.element);

  // assert
  await t
    .expect(firstCard.isSelected)
    .notOk()
    .expect(cardView.isCheckBoxesHidden())
    .ok();
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, title: 'header1', A: 'A_0', B: 'B_0', C: 'C_0',
    },
    {
      id: 1, title: 'header2', A: 'A_1', B: 'B_1', C: 'C_1',
    },
    {
      id: 2, title: 'header3', A: 'A_2', B: 'B_2', C: 'C_2',
    },
    {
      id: 3, title: 'header4', A: 'A_3', B: 'B_3', C: 'C_3',
    },
    {
      id: 4, title: 'header5', A: 'A_4', B: 'B_4', C: 'C_4',
    },
  ],
  cardHeader: {
    captionExpr: () => 'title',
  },
  columns: ['A', 'B', 'C'],
  keyExpr: 'id',
  height: 700,
  selection: {
    mode: 'multiple',
    showCheckBoxesMode: 'onClick',
    allowSelectAll: true,
  },
}));

test('Multiple mode with showCheckBoxesMode=\'onLongTap\': select a several cards', async (t) => {
  // arrange
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const firstCard = cardView.getCard(0);
  const secondCard = cardView.getCard(1);

  // act
  await ClientFunction((card) => {
    $(card()).trigger('dxhold');
  })(firstCard.element);

  // assert
  await t
    .expect(firstCard.isSelected)
    .notOk()
    .expect(cardView.isCheckBoxesHidden())
    .notOk();

  // act
  await t.click(firstCard.element);

  // assert
  await t
    .expect(firstCard.isSelected)
    .ok();

  await t.click(secondCard.element);

  // assert
  await t
    .expect(secondCard.isSelected)
    .ok();
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, title: 'header1', A: 'A_0', B: 'B_0', C: 'C_0',
    },
    {
      id: 1, title: 'header2', A: 'A_1', B: 'B_1', C: 'C_1',
    },
    {
      id: 2, title: 'header3', A: 'A_2', B: 'B_2', C: 'C_2',
    },
    {
      id: 3, title: 'header4', A: 'A_3', B: 'B_3', C: 'C_3',
    },
    {
      id: 4, title: 'header5', A: 'A_4', B: 'B_4', C: 'C_4',
    },
  ],
  cardHeader: {
    captionExpr: () => 'title',
  },
  columns: ['A', 'B', 'C'],
  keyExpr: 'id',
  height: 700,
  selection: {
    mode: 'multiple',
    showCheckBoxesMode: 'onLongTap',
    allowSelectAll: true,
  },
}));

test('Select all when selectAllMode = \'allPages\'', async (t) => {
  // arrange
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const toolbar = cardView.getToolbar();
  const selectAllButton = toolbar.getSelectAllButton();

  // act
  await t.click(selectAllButton);

  // assert
  await t
    .expect(toolbar.isSelectAllButtonDisabled())
    .ok()
    .expect(toolbar.isClearSelectionButtonDisabled())
    .notOk()
    .expect(cardView.getSelectedCardKeys())
    .eql([0, 1, 2, 3, 4]);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, title: 'header1', A: 'A_0', B: 'B_0', C: 'C_0',
    },
    {
      id: 1, title: 'header2', A: 'A_1', B: 'B_1', C: 'C_1',
    },
    {
      id: 2, title: 'header3', A: 'A_2', B: 'B_2', C: 'C_2',
    },
    {
      id: 3, title: 'header4', A: 'A_3', B: 'B_3', C: 'C_3',
    },
    {
      id: 4, title: 'header5', A: 'A_4', B: 'B_4', C: 'C_4',
    },
  ],
  cardHeader: {
    captionExpr: () => 'title',
  },
  columns: ['A', 'B', 'C'],
  keyExpr: 'id',
  height: 700,
  selection: {
    mode: 'multiple',
    showCheckBoxesMode: 'always',
    allowSelectAll: true,
    selectAllMode: 'allPages',
  },
}));

test('Deselect all when selectAllMode = \'allPages\'', async (t) => {
  // arrange
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const toolbar = cardView.getToolbar();
  const clearSelectionButton = toolbar.getClearSelectionButton();

  // assert
  await t
    .expect(toolbar.isSelectAllButtonDisabled())
    .ok()
    .expect(toolbar.isClearSelectionButtonDisabled())
    .notOk();

  // act
  await t.click(clearSelectionButton);

  // assert
  await t
    .expect(toolbar.isSelectAllButtonDisabled())
    .notOk()
    .expect(toolbar.isClearSelectionButtonDisabled())
    .ok()
    .expect(cardView.getSelectedCardKeys())
    .eql([]);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, title: 'header1', A: 'A_0', B: 'B_0', C: 'C_0',
    },
    {
      id: 1, title: 'header2', A: 'A_1', B: 'B_1', C: 'C_1',
    },
    {
      id: 2, title: 'header3', A: 'A_2', B: 'B_2', C: 'C_2',
    },
    {
      id: 3, title: 'header4', A: 'A_3', B: 'B_3', C: 'C_3',
    },
    {
      id: 4, title: 'header5', A: 'A_4', B: 'B_4', C: 'C_4',
    },
  ],
  cardHeader: {
    captionExpr: () => 'title',
  },
  columns: ['A', 'B', 'C'],
  keyExpr: 'id',
  height: 700,
  selectedCardKeys: [0, 1, 2, 3, 4],
  selection: {
    mode: 'multiple',
    showCheckBoxesMode: 'always',
    allowSelectAll: true,
    selectAllMode: 'allPages',
  },
}));

test('Select all when selectAllMode = \'page\'', async (t) => {
  // arrange
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const toolbar = cardView.getToolbar();
  const selectAllButton = toolbar.getSelectAllButton();

  // act
  await t.click(selectAllButton);

  // assert
  await t
    .expect(toolbar.isSelectAllButtonDisabled())
    .ok()
    .expect(toolbar.isClearSelectionButtonDisabled())
    .notOk()
    .expect(cardView.getSelectedCardKeys())
    .eql([0, 1, 2]);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, title: 'header1', A: 'A_0', B: 'B_0', C: 'C_0',
    },
    {
      id: 1, title: 'header2', A: 'A_1', B: 'B_1', C: 'C_1',
    },
    {
      id: 2, title: 'header3', A: 'A_2', B: 'B_2', C: 'C_2',
    },
    {
      id: 3, title: 'header4', A: 'A_3', B: 'B_3', C: 'C_3',
    },
    {
      id: 4, title: 'header5', A: 'A_4', B: 'B_4', C: 'C_4',
    },
  ],
  cardHeader: {
    captionExpr: () => 'title',
  },
  paging: {
    pageSize: 3,
  },
  columns: ['A', 'B', 'C'],
  keyExpr: 'id',
  height: 700,
  selection: {
    mode: 'multiple',
    showCheckBoxesMode: 'always',
    allowSelectAll: true,
    selectAllMode: 'page',
  },
}));

test('Deselect all when selectAllMode = \'page\'', async (t) => {
  // arrange
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const toolbar = cardView.getToolbar();
  const clearSelectionButton = toolbar.getClearSelectionButton();

  // assert
  await t
    .expect(toolbar.isSelectAllButtonDisabled())
    .ok()
    .expect(toolbar.isClearSelectionButtonDisabled())
    .notOk();

  // act
  await t.click(clearSelectionButton);

  // assert
  await t
    .expect(toolbar.isSelectAllButtonDisabled())
    .notOk()
    .expect(toolbar.isClearSelectionButtonDisabled())
    .ok()
    .expect(cardView.getSelectedCardKeys())
    .eql([]);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, title: 'header1', A: 'A_0', B: 'B_0', C: 'C_0',
    },
    {
      id: 1, title: 'header2', A: 'A_1', B: 'B_1', C: 'C_1',
    },
    {
      id: 2, title: 'header3', A: 'A_2', B: 'B_2', C: 'C_2',
    },
    {
      id: 3, title: 'header4', A: 'A_3', B: 'B_3', C: 'C_3',
    },
    {
      id: 4, title: 'header5', A: 'A_4', B: 'B_4', C: 'C_4',
    },
  ],
  cardHeader: {
    captionExpr: () => 'title',
  },
  paging: {
    pageSize: 3,
  },
  columns: ['A', 'B', 'C'],
  keyExpr: 'id',
  height: 700,
  selectedCardKeys: [0, 1, 2],
  selection: {
    mode: 'multiple',
    showCheckBoxesMode: 'always',
    allowSelectAll: true,
    selectAllMode: 'page',
  },
}));

test('The states of the Select All and Clear selection buttons should update correctly after changing the page when selectAllMode = \'allPages\'', async (t) => {
  // arrange
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const toolbar = cardView.getToolbar();

  // assert
  await t
    .expect(toolbar.isSelectAllButtonDisabled())
    .ok()
    .expect(toolbar.isClearSelectionButtonDisabled())
    .notOk();

  // act
  await cardView.apiPageIndex(1);

  // assert
  await t
    .expect(toolbar.isSelectAllButtonDisabled())
    .ok()
    .expect(toolbar.isClearSelectionButtonDisabled())
    .notOk();
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, title: 'header1', A: 'A_0', B: 'B_0', C: 'C_0',
    },
    {
      id: 1, title: 'header2', A: 'A_1', B: 'B_1', C: 'C_1',
    },
    {
      id: 2, title: 'header3', A: 'A_2', B: 'B_2', C: 'C_2',
    },
    {
      id: 3, title: 'header4', A: 'A_3', B: 'B_3', C: 'C_3',
    },
    {
      id: 4, title: 'header5', A: 'A_4', B: 'B_4', C: 'C_4',
    },
  ],
  cardHeader: {
    captionExpr: () => 'title',
  },
  paging: {
    pageSize: 3,
  },
  columns: ['A', 'B', 'C'],
  keyExpr: 'id',
  height: 700,
  selectedCardKeys: [0, 1, 2, 3, 4],
  selection: {
    mode: 'multiple',
    showCheckBoxesMode: 'always',
    allowSelectAll: true,
    selectAllMode: 'allPages',
  },
}));

test('The states of the Select All and Clear selection buttons should update correctly after changing the page when selectAllMode = \'page\'', async (t) => {
  // arrange
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const toolbar = cardView.getToolbar();

  // assert
  await t
    .expect(toolbar.isSelectAllButtonDisabled())
    .ok()
    .expect(toolbar.isClearSelectionButtonDisabled())
    .notOk();

  // act
  await cardView.apiPageIndex(1);

  // assert
  await t
    .expect(toolbar.isSelectAllButtonDisabled())
    .notOk()
    .expect(toolbar.isClearSelectionButtonDisabled())
    .ok()
    .expect(cardView.getSelectedCardKeys())
    .eql([0, 1, 2]);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, title: 'header1', A: 'A_0', B: 'B_0', C: 'C_0',
    },
    {
      id: 1, title: 'header2', A: 'A_1', B: 'B_1', C: 'C_1',
    },
    {
      id: 2, title: 'header3', A: 'A_2', B: 'B_2', C: 'C_2',
    },
    {
      id: 3, title: 'header4', A: 'A_3', B: 'B_3', C: 'C_3',
    },
    {
      id: 4, title: 'header5', A: 'A_4', B: 'B_4', C: 'C_4',
    },
  ],
  cardHeader: {
    captionExpr: () => 'title',
  },
  paging: {
    pageSize: 3,
  },
  columns: ['A', 'B', 'C'],
  keyExpr: 'id',
  height: 700,
  selectedCardKeys: [0, 1, 2],
  selection: {
    mode: 'multiple',
    showCheckBoxesMode: 'always',
    allowSelectAll: true,
    selectAllMode: 'page',
  },
}));

test('Switching the showCheckBoxesMode option from onClick to always at runtime should work correctly', async (t) => {
  // arrange
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const firstCard = cardView.getCard(0);

  // assert
  await t
    .expect(cardView.isCheckBoxesHidden())
    .ok();

  // act
  await cardView.apiOption('selection.showCheckBoxesMode', 'always');

  // assert
  await t
    .expect(cardView.isCheckBoxesHidden())
    .notOk();

  // act
  await t.click(firstCard.element);

  // assert
  await t
    .expect(firstCard.isSelected)
    .notOk()
    .expect(cardView.getSelectedCardKeys())
    .eql([]);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, title: 'header1', A: 'A_0', B: 'B_0', C: 'C_0',
    },
    {
      id: 1, title: 'header2', A: 'A_1', B: 'B_1', C: 'C_1',
    },
    {
      id: 2, title: 'header3', A: 'A_2', B: 'B_2', C: 'C_2',
    },
    {
      id: 3, title: 'header4', A: 'A_3', B: 'B_3', C: 'C_3',
    },
    {
      id: 4, title: 'header5', A: 'A_4', B: 'B_4', C: 'C_4',
    },
  ],
  cardHeader: {
    captionExpr: () => 'title',
  },
  columns: ['A', 'B', 'C'],
  keyExpr: 'id',
  height: 700,
  selection: {
    mode: 'multiple',
    showCheckBoxesMode: 'onClick',
  },
}));

test('Switching the showCheckBoxesMode option from always to onClick at runtime should work correctly', async (t) => {
  // arrange
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const firstCard = cardView.getCard(0);

  // assert
  await t
    .expect(cardView.isCheckBoxesHidden())
    .notOk();

  // act
  await cardView.apiOption('selection.showCheckBoxesMode', 'onClick');

  // assert
  await t
    .expect(cardView.isCheckBoxesHidden())
    .ok();

  // act
  await t.click(firstCard.element);

  // assert
  await t
    .expect(firstCard.isSelected)
    .ok()
    .expect(cardView.getSelectedCardKeys())
    .eql([0]);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, title: 'header1', A: 'A_0', B: 'B_0', C: 'C_0',
    },
    {
      id: 1, title: 'header2', A: 'A_1', B: 'B_1', C: 'C_1',
    },
    {
      id: 2, title: 'header3', A: 'A_2', B: 'B_2', C: 'C_2',
    },
    {
      id: 3, title: 'header4', A: 'A_3', B: 'B_3', C: 'C_3',
    },
    {
      id: 4, title: 'header5', A: 'A_4', B: 'B_4', C: 'C_4',
    },
  ],
  cardHeader: {
    captionExpr: () => 'title',
  },
  columns: ['A', 'B', 'C'],
  keyExpr: 'id',
  height: 700,
  selection: {
    mode: 'multiple',
    showCheckBoxesMode: 'always',
  },
}));

test('"Deselect all" should work after changing showCheckboxMode', async (t) => {
  const cardView = new CardView('#container');

  await cardView.option('selection.showCheckBoxesMode', 'onClick');

  await t.click(
    cardView.getToolbar().getClearSelectionButton(),
  );

  await t
    .expect(cardView.getToolbar().isClearSelectionButtonDisabled())
    .ok();

  for (let i = 0; i < 6; i += 1) {
    await t
      .expect(cardView.getCard(i).isSelected)
      .notOk();
  }
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 },
  ],
  keyExpr: 'a',
  selection: {
    mode: 'multiple',
  },
  selectedCardKeys: [1, 2],
}));
