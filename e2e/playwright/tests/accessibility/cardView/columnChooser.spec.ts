import { test } from '../../../helpers/accessibility/test';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { createWidget } from '../../../helpers/createWidget';
import CardView from '../../../models/cardView';

const CARD_VIEW_SELECTOR = '#container';

test('column chooser in \'select\' mode', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
    columnChooser: {
      enabled: true,
      mode: 'select',
      height: 400,
      width: 400,
      search: {
        enabled: true,
      },
      selection: {
        allowSelectAll: true,
      },
    },
    columns: [
      { dataField: 'Column 1', visible: false },
      { dataField: 'Column 2', allowHiding: false },
      { dataField: 'Column 3', showInColumnChooser: false },
      { dataField: 'Column 4' },
    ],
  });

  const cardView = new CardView(page, CARD_VIEW_SELECTOR);

  await cardView.apiShowColumnChooser();

  await a11yCheck(page, {}, CARD_VIEW_SELECTOR);
});

test('column chooser in \'dragAndDrop\' mode', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
    columnChooser: {
      enabled: true,
      mode: 'dragAndDrop',
      height: 400,
      width: 400,
      search: {
        enabled: true,
      },
    },
    columns: [
      { dataField: 'Column 1', visible: false },
      { dataField: 'Column 2', visible: false, allowHiding: false },
      { dataField: 'Column 3', visible: false, showInColumnChooser: false },
      { dataField: 'Column 4', visible: false },
    ],
  });

  const cardView = new CardView(page, CARD_VIEW_SELECTOR);

  await cardView.apiShowColumnChooser();

  const a11yCheckConfig = {};
  await a11yCheck(page, a11yCheckConfig, CARD_VIEW_SELECTOR);
});

test('cardView with opened columnChooser', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
    dataSource: Array.from({ length: 50 }, (_, i) => ({ value: `value_${i}` })),
    columnChooser: {
      enabled: true,
    },
    columns: [
      { dataField: 'value' },
    ],
  });

  const cardView = new CardView(page, CARD_VIEW_SELECTOR);

  await cardView.apiShowColumnChooser();

  await a11yCheck(page, {}, CARD_VIEW_SELECTOR);
});
