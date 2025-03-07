import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import CardView from 'devextreme-testcafe-models/cardView';

fixture.disablePageReloads`CardView - Sorting Behavior`
  .page(url(__dirname, '../../container.html'));;

const data = [
  {
    id: 1,
    title: 'Mr.',
    name: 'John',
    lastName: 'Heart',
  },
  {
    id: 2,
    title: 'Mrs.',
    name: 'Olivia',
    lastName: 'Peyton',
  },
  {
    id: 3,
    title: 'Mr.',
    name: 'Robert',
    lastName: 'Reagan',
  },
  {
    id: 4,
    title: 'Mr.',
    name: 'Greta',
    lastName: 'Sims',
  },
];

test('Sort index API', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView('#container');

  await takeScreenshot('sort_index_api.png', cardView.element);
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
  
    await takeScreenshot('show_sort_indexes_api.png', cardView.element);
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
  
    await takeScreenshot('allow_sorting_api.png', cardView.element);
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
    function(rowData) {
        return rowData.id % 3;
    },
    "name",
].forEach((calculateSortValue) => {
    test('CalculateSortValue API', async (t) => {
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
        const cardView = new CardView('#container');
        
        await takeScreenshot(`calculate_sort_value_is_${calculateSortValue === 'name' ? 'filed' : 'function'}_api.png`, cardView.element);
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
    
    await takeScreenshot(`sorting_method_api.png`, cardView.element);
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
            sortingMethod: function(value1, value2) {
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