import CardView from 'devextreme-testcafe-models/cardView';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { getColumnItem, triggerDragEnd, triggerDragStart } from '../../cardView/columnSortable/utils';
import { a11yCheck } from '../../../helpers/accessibility/utils';

fixture.disablePageReloads`CardView - ColumnSortable`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

test('headerPanel dragging column when it has sorting and headerFilter', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const columnElement = cardView.getHeaders().getHeaderItemNth(0).element;

  await triggerDragStart(columnElement);

  const a11yCheckConfig = {
    rules: { 'color-contrast': { enabled: false } },
  };
  await a11yCheck(t, a11yCheckConfig, CARD_VIEW_SELECTOR);
}).before(async () => createWidget('dxCardView', {
  allowColumnReordering: true,
  columnChooser: {
    enabled: true,
  },
  headerFilter: {
    visible: true,
  },
  columns: [{
    dataField: 'test',
    allowReordering: true,
    sortOrder: 'asc',
  }],
}));

test('dropzone appear in headerPanel when drag from columnChooser a column', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const columnElement = getColumnItem(cardView, 0, 'columnChooser');

  await cardView.apiShowColumnChooser();

  await triggerDragStart(columnElement);
  await t.wait(500); // wait for dropzone animation to finish

  await triggerDragEnd(columnElement);
  await t.wait(500); // wait for dropzone animation to finish

  const a11yCheckConfig = {
    rules: { 'color-contrast': { enabled: false } },
  };
  await a11yCheck(t, a11yCheckConfig, CARD_VIEW_SELECTOR);
}).before(async () => createWidget('dxCardView', {
  allowColumnReordering: true,
  columnChooser: {
    enabled: true,
  },
  height: 600,
  columns: [
    { dataField: 'Column 1', visible: false },
  ],
}));

test('dropzone appears in headerPanel when drag from columnChooser a column with allowReordering: false', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const columnElement = getColumnItem(cardView, 0, 'columnChooser');

  await cardView.apiShowColumnChooser();

  await triggerDragStart(columnElement);
  await t.wait(500); // wait for dropzone animation to finish

  await triggerDragEnd(columnElement);
  await t.wait(500); // wait for dropzone animation to finish

  await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
}).before(async () => createWidget('dxCardView', {
  allowColumnReordering: true,
  columnChooser: {
    enabled: true,
  },
  height: 600,
  columns: [
    { dataField: 'Column 1' },
    { dataField: 'Column 2', visible: false, allowReordering: false },
  ],
}));
