import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { a11yCheck } from '../../../helpers/accessibility/utils';

fixture.disablePageReloads`CardView - ColumnChooser`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

test('column chooser in \'select\' mode', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  await cardView.apiShowColumnChooser();

  await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
}).before(async () => createWidget('dxCardView', {
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
}));

test('column chooser in \'dragAndDrop\' mode', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  await cardView.apiShowColumnChooser();

  const a11yCheckConfig = {
    rules: { 'color-contrast': { enabled: false } },
  };
  await a11yCheck(t, a11yCheckConfig, CARD_VIEW_SELECTOR);
}).before(async () => createWidget('dxCardView', {
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
}));

test('cardView with opened columnChooser', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  await cardView.apiShowColumnChooser();

  await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
}).before(async () => createWidget('dxCardView', {
  dataSource: Array.from({ length: 50 }, (_, i) => ({ value: `value_${i}` })),
  columnChooser: {
    enabled: true,
  },
  columns: [
    { dataField: 'value' },
  ],
}));
