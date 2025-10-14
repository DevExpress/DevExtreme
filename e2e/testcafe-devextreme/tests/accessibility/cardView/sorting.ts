import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { data } from '../../cardView/helpers/simpleArrayData';
import { a11yCheck } from '../../../helpers/accessibility/utils';

fixture.disablePageReloads`CardView - Sorting Behavior`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

const baseConfig = {
  dataSource: data,
  height: 500,
};

test('Default render', async (t) => {
  await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
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
  await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
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

test('Sort index API', async (t) => {
  await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
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
  await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
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
  await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
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
  // eslint-disable-next-line func-names
  function (rowData) {
    return rowData.id % 3;
  },
  'name',
].forEach((calculateSortValue) => {
  test('CalculateSortValue API', async (t) => {
    await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
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
  await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
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
