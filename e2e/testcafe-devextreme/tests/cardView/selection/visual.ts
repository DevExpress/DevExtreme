import CardView from 'devextreme-testcafe-models/cardView';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`Selection.Visual`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

test('Single mode', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  await testScreenshot(t, takeScreenshot, 'card-view_single_selection.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
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
  selectedCardKeys: [0],
  selection: {
    mode: 'single',
  },
}));

test('Multiple mode with Select All/Deselect All and showCheckBoxesMode = \'none\'', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  await testScreenshot(t, takeScreenshot, 'card-view_miltiple_selection_with_showCheckBoxesMode_=_none.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
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
    showCheckBoxesMode: 'none',
    allowSelectAll: true,
  },
}));

test('Multiple mode with Select All/Deselect All and showCheckBoxesMode = \'always\'', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  await testScreenshot(t, takeScreenshot, 'card-view_miltiple_selection_with_showCheckBoxesMode_=_always.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
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

test('Multiple mode with Select All/Deselect All and showCheckBoxesMode = \'onClick\'', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const firstSelectCheckboxItemContent = cardView
    .getCard(0)
    .getToolbarItemContent(0);

  await testScreenshot(t, takeScreenshot, 'card-view_miltiple_selection_with_showCheckBoxesMode_=_onClick_1.png', { element: cardView.element });

  await t.hover(firstSelectCheckboxItemContent);

  await testScreenshot(t, takeScreenshot, 'card-view_miltiple_selection_with_showCheckBoxesMode_=_onClick_2.png', { element: cardView.element });

  await t.hover(cardView.element);

  await testScreenshot(t, takeScreenshot, 'card-view_miltiple_selection_with_showCheckBoxesMode_=_onClick_3.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
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

test('Multiple mode with a selected card and showCheckBoxesMode = \'onClick\'', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  await testScreenshot(t, takeScreenshot, 'card-view_checkbox_visibility_with_showCheckBoxesMode_=_onClick.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
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
  selectedCardKeys: [0],
  keyExpr: 'id',
  height: 700,
  selection: {
    mode: 'multiple',
    showCheckBoxesMode: 'onClick',
    allowSelectAll: true,
  },
}));

test('Multiple mode with selected cards and showCheckBoxesMode = \'onClick\'', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  await testScreenshot(t, takeScreenshot, 'card-view_checkboxes_visibility_with_showCheckBoxesMode_=_onClick.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
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
  selectedCardKeys: [0, 1],
  keyExpr: 'id',
  height: 700,
  selection: {
    mode: 'multiple',
    showCheckBoxesMode: 'onClick',
    allowSelectAll: true,
  },
}));

test('Multiple mode with Select All/Deselect All and showCheckBoxesMode = \'onLongTap\'', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const firstCard = cardView.getCard(0);

  await testScreenshot(t, takeScreenshot, 'card-view_miltiple_selection_with_showCheckBoxesMode_=_onLongTap_1.png', { element: cardView.element });

  await ClientFunction((card) => {
    $(card()).trigger('dxhold');
  })(firstCard.element);

  await testScreenshot(t, takeScreenshot, 'card-view_miltiple_selection_with_showCheckBoxesMode_=_onLongTap_2.png', { element: cardView.element });

  await ClientFunction((card) => {
    $(card()).trigger('dxhold');
  })(firstCard.element);

  await testScreenshot(t, takeScreenshot, 'card-view_miltiple_selection_with_showCheckBoxesMode_=_onLongTap_3.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
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

test('Multiple mode without Select All/Deselect All', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  await testScreenshot(t, takeScreenshot, 'card-view_miltiple_selection_without_select-all.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
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
    allowSelectAll: false,
  },
}));
