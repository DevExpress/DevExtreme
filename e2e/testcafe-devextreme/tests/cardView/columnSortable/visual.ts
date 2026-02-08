import CardView from 'devextreme-testcafe-models/cardView';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { getColumnItem, triggerDragEnd, triggerDragStart } from './utils';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`CardView - ColumnSortable.Visual`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

test('headerPanel dragging column when it has sorting and headerFilter', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const columnElement = cardView.getHeaders().getHeaderItemNth(0).element;

  await triggerDragStart(columnElement);

  await testScreenshot(t, takeScreenshot, 'card-view_column-sortable_header-panel_dragging-column.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
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
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const columnElement = getColumnItem(cardView, 0, 'columnChooser');

  await cardView.apiShowColumnChooser();

  await triggerDragStart(columnElement);
  await t.wait(500); // wait for dropzone animation to finish
  await testScreenshot(t, takeScreenshot, 'card-view_column-sortable_empty-header-panel_dropzone_1.png', { element: cardView.element });

  await triggerDragEnd(columnElement);
  await t.wait(500); // wait for dropzone animation to finish
  await testScreenshot(t, takeScreenshot, 'card-view_column-sortable_empty-header-panel_dropzone_2.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
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
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const columnElement = getColumnItem(cardView, 0, 'columnChooser');

  await cardView.apiShowColumnChooser();

  await triggerDragStart(columnElement);
  await t.wait(500); // wait for dropzone animation to finish
  await testScreenshot(t, takeScreenshot, 'card-view_column-sortable_header-panel_dropzone_1.png', { element: cardView.element });

  await triggerDragEnd(columnElement);
  await t.wait(500); // wait for dropzone animation to finish
  await testScreenshot(t, takeScreenshot, 'card-view_column-sortable_header-panel_dropzone_2.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
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
