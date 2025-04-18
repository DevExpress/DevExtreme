import CardView from 'devextreme-testcafe-models/cardView';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { triggerDragStart } from './utils';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`CardView - ColumnSortable.Visual`
  .page(url(__dirname, '../container.html'));

test('headerPanel dragging column when it has sorting and headerFilter', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const cardView = new CardView('#container');
  const columnElement = cardView.getHeaders().getHeaderItemNth(0).element;

  await triggerDragStart(columnElement);

  await testScreenshot(t, takeScreenshot, 'card-view_column-sortable_header-panel_dragging-column.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCardView', {
  allowColumnReordering: true,
  headerFilter: {
    visible: true,
  },
  columns: [{
    dataField: 'test',
    allowReordering: true,
    sortOrder: 'asc',
  }],
}));
