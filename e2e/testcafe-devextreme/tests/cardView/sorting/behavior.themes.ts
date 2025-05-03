import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { data } from '../helpers/simpleArrayData';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`CardView - Sorting Behavior - Themes`
  .page(url(__dirname, '../../container.html'));

test('Default render', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView('#container');

  await testScreenshot(t, takeScreenshot, 'cardview_headers_default_render.png', { element: cardView.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxCardView', {
    dataSource: data,
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

// TODO: Unskip this test after columnOptions method fix
//  Now column options from options manager override internal columns state
test.skip('Default multiple sorting render', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView('#container');
  await testScreenshot(t, takeScreenshot, 'cardview_headers_with_multiple_sorting_render.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxCardView', {
    dataSource: data,
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
