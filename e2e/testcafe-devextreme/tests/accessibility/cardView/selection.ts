import CardView from 'devextreme-testcafe-models/cardView';
import { ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { a11yCheck } from '../../../helpers/accessibility/utils';

fixture.disablePageReloads`Selection.Visual`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

test('Single mode', async (t) => {
  await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
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
  await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
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
  await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
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
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  await t.hover(cardView.element);

  await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
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
  await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
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
  await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
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
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const firstCard = cardView.getCard(0);

  await ClientFunction((card) => {
    $(card()).trigger('dxhold');
  })(firstCard.element);

  await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
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
  await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
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
