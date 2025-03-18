import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { data } from '../helpers/simpleArrayData';

fixture.disablePageReloads`CardView - Sorting Behavior`
  .page(url(__dirname, '../../container.html'));

test('Sort index API', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView('#container');

  await takeScreenshot('cardview_sort_index_api.png', cardView.element);
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
  const cardView = new CardView('#container');

  await takeScreenshot('cardview_show_sort_indexes_api.png', cardView.element);
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxCardView', {
    dataSource: data,
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
  const cardView = new CardView('#container');

  await t
    .click(cardView.getHeaders().getHeaderItemByText('Title').element);

  await takeScreenshot('cardview_allow_sorting_api.png', cardView.element);
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxCardView', {
    dataSource: data,
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
    const cardView = new CardView('#container');

    await takeScreenshot(`cardview_calculate_sort_value_is_${calculateSortValue === 'name' ? 'filed' : 'function'}_api.png`, cardView.element);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxCardView', {
      dataSource: data,
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
  const cardView = new CardView('#container');

  await takeScreenshot('cardview_sorting_method_api.png', cardView.element);
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxCardView', {
    dataSource: data,
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
