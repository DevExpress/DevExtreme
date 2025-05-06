import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { testScreenshot } from '../../helpers/themeUtils';

fixture.disablePageReloads`CardView - HeaderPanel`
  .page(url(__dirname, '../container.html'));

test('default render', async (t) => {
  const cardView = new CardView('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'header-panel.png', { element: cardView.getHeaderPanel().element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCardView', {
  width: 400,
  height: 600,
  columns: ['Customer', 'Order Date'],
}));

test('headerPanel column chooser link opens column chooser on click', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView('#container');
  const headerPanel = cardView.getHeaderPanel();

  await t.click(headerPanel.getColumnChooserLink());

  await testScreenshot(t, takeScreenshot, 'card-view-column-chooser-opened-on-empty-header-panel-link-click.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCardView', {
  height: 600,
  columns: [
    { dataField: 'Column 1', visible: false },
  ],
}));
