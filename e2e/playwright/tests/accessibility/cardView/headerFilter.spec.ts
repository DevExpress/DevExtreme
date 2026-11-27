import { test } from '../../../helpers/accessibility/test';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { createWidget } from '../../../helpers/createWidget';
import CardView from '../../../models/cardView';

test('popup with list', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
    dataSource: [
      { A: 'A_0', B: 'B_0', C: 'C_0' },
      { A: 'A_1', B: 'B_1', C: 'C_1' },
      { A: 'A_2', B: 'B_2', C: 'C_2' },
      { A: 'A_3', B: 'B_3', C: 'C_3' },
      { A: 'A_4', B: 'B_4', C: 'C_4' },
    ],
    columns: ['A', 'B', 'C'],
    headerFilter: {
      visible: true,
    },
    height: 600,
  });

  const cardView = new CardView(page, DEFAULT_SELECTOR);

  const filterIcon = cardView
    .getHeaderPanel()
    .getHeaderItem()
    .getFilterIcon();
  await filterIcon.click();

  await a11yCheck(page, {}, DEFAULT_SELECTOR);
});

test('popup with search', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
    dataSource: [
      { A: 'A_0', B: 'B_0', C: 'C_0' },
      { A: 'A_1', B: 'B_1', C: 'C_1' },
      { A: 'A_2', B: 'B_2', C: 'C_2' },
      { A: 'A_3', B: 'B_3', C: 'C_3' },
      { A: 'A_4', B: 'B_4', C: 'C_4' },
    ],
    columns: ['A', 'B', 'C'],
    headerFilter: {
      visible: true,
      search: {
        enabled: true,
      },
    },
    height: 600,
  });

  const cardView = new CardView(page, DEFAULT_SELECTOR);

  const filterIcon = cardView
    .getHeaderPanel()
    .getHeaderItem()
    .getFilterIcon();
  await filterIcon.click();

  await a11yCheck(page, {}, DEFAULT_SELECTOR);
});

test('popup with tree', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
    dataSource: [
      { A: '2024-01-01', B: 'B_0', C: 'C_0' },
      { A: '2024-01-01', B: 'B_1', C: 'C_1' },
      { A: '2024-01-01', B: 'B_2', C: 'C_2' },
      { A: '2025-01-01', B: 'B_3', C: 'C_3' },
      { A: '2025-01-01', B: 'B_4', C: 'C_4' },
      { A: '2026-01-01', B: 'B_5', C: 'C_5' },
    ],
    columns: [
      {
        dataField: 'A',
        dataType: 'date',
      },
      'B',
      'C',
    ],
    headerFilter: {
      visible: true,
    },
    height: 600,
  });

  const cardView = new CardView(page, DEFAULT_SELECTOR);

  const filterIcon = cardView
    .getHeaderPanel()
    .getHeaderItem()
    .getFilterIcon();
  await filterIcon.click();

  await a11yCheck(page, {}, DEFAULT_SELECTOR);
});
