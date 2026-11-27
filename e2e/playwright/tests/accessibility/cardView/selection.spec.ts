import { test } from '../../../helpers/accessibility/test';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { createWidget } from '../../../helpers/createWidget';
import CardView from '../../../models/cardView';

test('Single mode', async ({ page }) => {
  await createWidget(page, 'dxCardView', () => ({
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

  await a11yCheck(page, {}, DEFAULT_SELECTOR);
});

test('Multiple mode with Select All/Deselect All and showCheckBoxesMode = \'none\'', async ({ page }) => {
  await createWidget(page, 'dxCardView', () => ({
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

  await a11yCheck(page, {}, DEFAULT_SELECTOR);
});

test('Multiple mode with Select All/Deselect All and showCheckBoxesMode = \'always\'', async ({ page }) => {
  await createWidget(page, 'dxCardView', () => ({
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

  await a11yCheck(page, {}, DEFAULT_SELECTOR);
});

test('Multiple mode with Select All/Deselect All and showCheckBoxesMode = \'onClick\'', async ({ page }) => {
  await createWidget(page, 'dxCardView', () => ({
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

  const cardView = new CardView(page, DEFAULT_SELECTOR);

  await cardView.element.hover();

  await a11yCheck(page, {}, DEFAULT_SELECTOR);
});

test('Multiple mode with a selected card and showCheckBoxesMode = \'onClick\'', async ({ page }) => {
  await createWidget(page, 'dxCardView', () => ({
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

  await a11yCheck(page, {}, DEFAULT_SELECTOR);
});

test('Multiple mode with selected cards and showCheckBoxesMode = \'onClick\'', async ({ page }) => {
  await createWidget(page, 'dxCardView', () => ({
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

  await a11yCheck(page, {}, DEFAULT_SELECTOR);
});

test('Multiple mode with Select All/Deselect All and showCheckBoxesMode = \'onLongTap\'', async ({ page }) => {
  await createWidget(page, 'dxCardView', () => ({
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

  const cardView = new CardView(page, DEFAULT_SELECTOR);
  const firstCard = cardView.getCard(0);

  await firstCard.element.evaluate((card) => {
    $(card).trigger('dxhold');
  });

  await a11yCheck(page, {}, DEFAULT_SELECTOR);
});

test('Multiple mode without Select All/Deselect All', async ({ page }) => {
  await createWidget(page, 'dxCardView', () => ({
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

  await a11yCheck(page, {}, DEFAULT_SELECTOR);
});
