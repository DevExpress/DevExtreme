import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { data } from '../helpers/simpleArrayData';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`CardView - Sorting Behavior - Themes`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

const baseConfig = {
  dataSource: data,
  height: 500,
};

test('Default render', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  await testScreenshot(t, takeScreenshot, 'cardview_headers_default_render.png', { element: cardView.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    columns: [
      {
        dataField: 'id',
      },
      {
        dataField: 'title',
        sortOrder: 'desc',
      },
      {
        dataField: 'name',
      },
      {
        dataField: 'lastName',
      },
    ],
  });
});

test('Default multiple sorting render', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  await testScreenshot(t, takeScreenshot, 'cardview_headers_with_multiple_sorting_render.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    columns: [
      {
        dataField: 'id',
      },
      {
        dataField: 'title',
        sortOrder: 'desc',
      },
      {
        dataField: 'name',
        sortOrder: 'asc',
      },
      {
        dataField: 'lastName',
      },
    ],
  });
});
