import CardView from 'devextreme-testcafe-models/cardView';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { testScreenshot } from '../../../helpers/themeUtils';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`CardView - ColumnChooser.Visual`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

test('column chooser in \'select\' mode', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const columnChooser = cardView.getColumnChooser();

  await cardView.apiShowColumnChooser();

  await testScreenshot(t, takeScreenshot, 'card-view_column-chooser_select_mode.png', { element: columnChooser.content });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
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
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const columnChooser = cardView.getColumnChooser();

  await cardView.apiShowColumnChooser();

  await testScreenshot(t, takeScreenshot, 'card-view_column-chooser_drag_mode.png', { element: columnChooser.content });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
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
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  await cardView.apiShowColumnChooser();

  await testScreenshot(t, takeScreenshot, 'card-view_with_opened_column-chooser.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCardView', {
  dataSource: Array.from({ length: 50 }, (_, i) => ({ value: `value_${i}` })),
  columnChooser: {
    enabled: true,
  },
  columns: [
    { dataField: 'value' },
  ],
}));
