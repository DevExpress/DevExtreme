import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { data } from '../helpers/simpleArrayData';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`CardView - Sorting Behavior`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

const baseConfig = {
  dataSource: data,
  height: 500,
};

test('Sort index API', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  await testScreenshot(t, takeScreenshot, 'cardview_sort_index_api.png', { element: cardView.element });
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
        sortIndex: 1,
      },
      {
        dataField: 'name',
        sortOrder: 'asc',
        sortIndex: 0,
      },
      {
        dataField: 'lastName',
      },
    ],
  });
});

test('ShowSortIndexes API', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  await testScreenshot(t, takeScreenshot, 'cardview_show_sort_indexes_api.png', { element: cardView.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    sorting: {
      showSortIndexes: false,
    },
    columns: [
      {
        dataField: 'id',
      },
      {
        dataField: 'title',
        sortOrder: 'desc',
        sortIndex: 1,
      },
      {
        dataField: 'name',
        sortOrder: 'asc',
        sortIndex: 0,
      },
      {
        dataField: 'lastName',
      },
    ],
  });
});

test('AllowSorting API', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  await t
    .click(cardView.getHeaders().getHeaderItemByText('Title').element);

  await testScreenshot(t, takeScreenshot, 'cardview_allow_sorting_api.png', { element: cardView.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    sorting: {
      showSortIndexes: false,
    },
    columns: [
      {
        dataField: 'id',
      },
      {
        dataField: 'title',
        sortOrder: 'desc',
        sortIndex: 1,
        allowSorting: false,
      },
      {
        dataField: 'name',
        sortOrder: 'asc',
        sortIndex: 0,
      },
      {
        dataField: 'lastName',
      },
    ],
    height: 500,
  });
});

[
  function (rowData) {
    return rowData.id % 3;
  },
  'name',
].forEach((calculateSortValue) => {
  test('CalculateSortValue API', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const cardView = new CardView(CARD_VIEW_SELECTOR);

    await testScreenshot(t, takeScreenshot, `cardview_calculate_sort_value_is_${calculateSortValue === 'name' ? 'filed' : 'function'}_api.png`, { element: cardView.element });
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxCardView', {
      ...baseConfig,
      sorting: {
        showSortIndexes: false,
      },
      columns: [
        {
          dataField: 'id',
        },
        {
          dataField: 'title',
          sortOrder: 'asc',
          calculateSortValue,
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
});

test('SortingMethod API', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  await testScreenshot(t, takeScreenshot, 'cardview_sorting_method_api.png', { element: cardView.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxCardView', {
    ...baseConfig,
    sorting: {
      showSortIndexes: false,
    },
    columns: [
      {
        dataField: 'id',
      },
      {
        dataField: 'title',
        sortOrder: 'asc',
        sortingMethod(value1, value2) {
          if (value1 === 'Mr.' && value2 !== 'Mr.') return 1;
          if (value1 !== 'Mr.' && value2 === 'Mr.') return -1;
          return value1.localeCompare(value2);
        },
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
