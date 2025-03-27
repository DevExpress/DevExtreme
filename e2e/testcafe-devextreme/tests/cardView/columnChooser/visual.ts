import CardView from 'devextreme-testcafe-models/cardView';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture`CardView - ColumnChooser.Visual`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

test('column chooser in select mode', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const columnChooser = cardView.getColumnChooser();

  await cardView.apiShowColumnChooser();

  await takeScreenshot('card-view_column-chooser.png', columnChooser.content);

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
