import { test } from '../../../helpers/accessibility/test';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { createWidget } from '../../../helpers/createWidget';
import { data } from '../../cardView/helpers/simpleArrayData';

const baseConfig = {
  dataSource: data,
  height: 500,
};

test('Default render', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
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

  await a11yCheck(page, {}, DEFAULT_SELECTOR);
});

test('Default multiple sorting render', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
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

  await a11yCheck(page, {}, DEFAULT_SELECTOR);
});

test('Sort index API', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
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

  await a11yCheck(page, {}, DEFAULT_SELECTOR);
});

test('ShowSortIndexes API', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
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

  await a11yCheck(page, {}, DEFAULT_SELECTOR);
});

test('AllowSorting API', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
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

  await a11yCheck(page, {}, DEFAULT_SELECTOR);
});

// The function cannot cross into the page as an argument, so the factory picks it by name.
['function', 'name'].forEach((calculateSortValue, index) => {
  // The TestCafe test used one title for both cases; Playwright requires unique titles.
  test(`CalculateSortValue API #${index}`, async ({ page }) => {
    await createWidget(page, 'dxCardView', ({ config, sortValue }) => ({
      ...config,
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
          calculateSortValue: sortValue === 'function'
            // eslint-disable-next-line func-names
            ? function (rowData) {
              return rowData.id % 3;
            }
            : sortValue,
        },
        {
          dataField: 'name',
        },
        {
          dataField: 'lastName',
        },
      ],
    }), DEFAULT_SELECTOR, { arg: { config: baseConfig, sortValue: calculateSortValue } });

    await a11yCheck(page, {}, DEFAULT_SELECTOR);
  });
});

test('SortingMethod API', async ({ page }) => {
  await createWidget(page, 'dxCardView', (config) => ({
    ...config,
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
  }), DEFAULT_SELECTOR, { arg: baseConfig });

  await a11yCheck(page, {}, DEFAULT_SELECTOR);
});
