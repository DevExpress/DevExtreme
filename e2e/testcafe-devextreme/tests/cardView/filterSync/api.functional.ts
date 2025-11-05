import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

// NOTE: Skip tests because FilterSync feature disabled
fixture.skip`CardView - FilterSync API`
  .page(url(__dirname, '../../container.html'));

const baseConfig = {
  filterSyncEnabled: true,
  filterPanel: { visible: true },
  headerFilter: { visible: true, allowSelectAll: true },
  columns: [
    {
      dataField: 'id',
      caption: 'id',
      allowHeaderFiltering: true,
    },
    {
      dataField: 'gender',
      caption: 'gender',
      allowHeaderFiltering: true,
    },
  ],
  dataSource: [
    { id: 0, gender: 'male' },
    { id: 1, gender: 'male' },
    { id: 2, gender: 'female' },
    { id: 3, gender: 'female' },
    { id: 4, gender: undefined },
    { id: 5, gender: undefined },
  ],
};

const expectFilterElementsState = async (t, filteredColumns: string[], active = true) => {
  const cardView = new CardView('#container');

  const filterPanelClearBtn = cardView.getFilterPanel().getClearFilterButton();

  const headerItems = filteredColumns.map(
    (column) => cardView.getHeaders().getHeaderItemByText(column),
  );

  if (active) {
    await t.expect(filterPanelClearBtn.element.exists).ok();

    // eslint-disable-next-line no-restricted-syntax
    for (const headerItem of headerItems) {
      await t.expect(headerItem.isHeaderFilterSelected()).ok();
    }
  } else {
    await t.expect(filterPanelClearBtn.element.exists).notOk();

    // eslint-disable-next-line no-restricted-syntax
    for (const headerItem of headerItems) {
      await t.expect(headerItem.isHeaderFilterSelected()).notOk();
    }
  }
};

/*
 sync from headerFilter
*/

test('sync from headerFilter: filter by one value', async (t) => {
  const cardView = new CardView('#container');

  await cardView.apiColumnOption('id', 'filterValues', [0]);

  await t.expect(cardView.apiOption('filterValue'))
    .eql(['id', '=', 0]);

  await expectFilterElementsState(t, ['id']);
}).before(async () => createWidget('dxCardView', baseConfig));

test('sync from headerFilter: filter by exclude one value', async (t) => {
  const cardView = new CardView('#container');

  await cardView.apiColumnOption('id', 'filterType', 'exclude');
  await cardView.apiColumnOption('id', 'filterValues', [0]);

  await t.expect(cardView.apiOption('filterValue'))
    .eql(['id', '<>', 0]);

  await expectFilterElementsState(t, ['id']);
}).before(async () => createWidget('dxCardView', baseConfig));

test('sync from headerFilter: filter by two values', async (t) => {
  const cardView = new CardView('#container');

  await cardView.apiColumnOption('id', 'filterValues', [0, 1]);

  await t.expect(cardView.apiOption('filterValue'))
    .eql(['id', 'anyof', [0, 1]]);

  await expectFilterElementsState(t, ['id']);
}).before(async () => createWidget('dxCardView', baseConfig));

test('sync from headerFilter: filter by exclude two values', async (t) => {
  const cardView = new CardView('#container');

  await cardView.apiColumnOption('id', 'filterType', 'exclude');
  await cardView.apiColumnOption('id', 'filterValues', [0, 1]);

  await t.expect(cardView.apiOption('filterValue'))
    .eql(['id', 'noneof', [0, 1]]);

  await expectFilterElementsState(t, ['id']);
}).before(async () => createWidget('dxCardView', baseConfig));

test('sync from headerFilter: filter by empty', async (t) => {
  const cardView = new CardView('#container');

  await cardView.apiColumnOption('gender', 'filterValues', [null]);

  await t.expect(cardView.apiOption('filterValue'))
    .eql(['gender', '=', null]);

  await expectFilterElementsState(t, ['gender']);
}).before(async () => createWidget('dxCardView', baseConfig));

test('sync from headerFilter: filter by non-empty', async (t) => {
  const cardView = new CardView('#container');

  await cardView.apiColumnOption('gender', 'filterType', 'exclude');
  await cardView.apiColumnOption('gender', 'filterValues', [null]);

  await t.expect(cardView.apiOption('filterValue'))
    .eql(['gender', '<>', null]);

  await expectFilterElementsState(t, ['gender']);
}).before(async () => createWidget('dxCardView', baseConfig));

test('sync from headerFilter: filter by all values', async (t) => {
  const cardView = new CardView('#container');

  await cardView.apiColumnOption('id', 'filterType', 'exclude');
  await cardView.apiColumnOption('id', 'filterValues', undefined);

  await t.expect(cardView.apiOption('filterValue')).eql(null);
}).before(async () => createWidget('dxCardView', baseConfig));

test('sync from headerFilter: filter by two columns', async (t) => {
  const cardView = new CardView('#container');

  await cardView.apiColumnOption('id', 'filterType', 'include');
  await cardView.apiColumnOption('id', 'filterValues', [0, 1]);

  await cardView.apiColumnOption('gender', 'filterType', 'include');
  await cardView.apiColumnOption('gender', 'filterValues', ['male']);

  await t.expect(cardView.apiOption('filterValue')).eql(
    [
      ['id', 'anyof', [0, 1]],
      'and',
      ['gender', '=', 'male'],
    ],
  );

  await expectFilterElementsState(t, ['id', 'gender']);
}).before(async () => createWidget('dxCardView', baseConfig));

test('sync from headerFilter: filter by groupInterval', async (t) => {
  const cardView = new CardView('#container');

  await cardView.apiColumnOption('id', 'filterType', 'include');
  await cardView.apiColumnOption('id', 'filterValues', [0]);

  await t.expect(cardView.apiOption('filterValue')).eql(
    ['id', 'anyof', [0]],
  );
}).before(async () => createWidget('dxCardView', {
  ...baseConfig,
  columns: [{
    dataField: 'id',
    caption: 'id',
    allowHeaderFiltering: true,
    headerFilter: {
      groupInterval: 2,
    },
  }],
}));

test('sync from headerFilter: filter by a column, then remove filter', async (t) => {
  const cardView = new CardView('#container');

  await cardView.apiColumnOption('id', 'filterType', 'include');
  await cardView.apiColumnOption('id', 'filterValues', [0]);

  await cardView.apiColumnOption('id', 'filterValues', []);

  await t.expect(cardView.apiOption('filterValue')).eql(null);

  await t.expect(cardView.getFilterPanel().getClearFilterButton().element.exists).notOk();
}).before(async () => createWidget('dxCardView', baseConfig));

/*
 sync from filterPanel
*/

test('sync from filterPanel: equals filter', async (t) => {
  const cardView = new CardView('#container');

  await cardView.apiOption('filterValue', [['id', '=', 0]]);

  await t.expect(cardView.apiColumnOption('id', 'filterType')).eql('include');
  await t.expect(cardView.apiColumnOption('id', 'filterValues')).eql([0]);

  await expectFilterElementsState(t, ['id']);
}).before(async () => createWidget('dxCardView', baseConfig));

test('sync from filterPanel: does not equal filter', async (t) => {
  const cardView = new CardView('#container');

  await cardView.apiOption('filterValue', [['id', '<>', 0]]);

  await t.expect(cardView.apiColumnOption('id', 'filterType')).eql('exclude');
  await t.expect(cardView.apiColumnOption('id', 'filterValues')).eql([0]);

  await expectFilterElementsState(t, ['id']);
}).before(async () => createWidget('dxCardView', baseConfig));

test('sync from filterPanel: anyof filter', async (t) => {
  const cardView = new CardView('#container');

  await cardView.apiOption('filterValue', [['id', 'anyof', [0, 1]]]);

  await t.expect(cardView.apiColumnOption('id', 'filterType')).eql('include');
  await t.expect(cardView.apiColumnOption('id', 'filterValues')).eql([0, 1]);

  await expectFilterElementsState(t, ['id']);
}).before(async () => createWidget('dxCardView', baseConfig));

test('sync from filterPanel: noneof filter', async (t) => {
  const cardView = new CardView('#container');

  await cardView.apiOption('filterValue', [['id', 'noneof', [0, 1]]]);

  await t.expect(cardView.apiColumnOption('id', 'filterType')).eql('exclude');
  await t.expect(cardView.apiColumnOption('id', 'filterValues')).eql([0, 1]);

  await expectFilterElementsState(t, ['id']);
}).before(async () => createWidget('dxCardView', baseConfig));

test('sync from filterPanel: is blank filter', async (t) => {
  const cardView = new CardView('#container');

  await cardView.apiOption('filterValue', [['gender', '=', null]]);

  await t.expect(cardView.apiColumnOption('gender', 'filterType')).eql('include');
  await t.expect(cardView.apiColumnOption('gender', 'filterValues')).eql([null]);

  await expectFilterElementsState(t, ['gender']);
}).before(async () => createWidget('dxCardView', baseConfig));

test('sync from filterPanel: is not blank filter', async (t) => {
  const cardView = new CardView('#container');

  await cardView.apiOption('filterValue', [['gender', '<>', null]]);

  await t.expect(cardView.apiColumnOption('gender', 'filterType')).eql('exclude');
  await t.expect(cardView.apiColumnOption('gender', 'filterValues')).eql([null]);

  await expectFilterElementsState(t, ['gender']);
}).before(async () => createWidget('dxCardView', baseConfig));

[
  {
    column: 'id', filterName: 'is less than', operation: '<', value: 0,
  },
  {
    column: 'id', filterName: 'is greater than', operation: '>', value: 0,
  },
  {
    column: 'id', filterName: 'is less than or equal to', operation: '<=', value: 0,
  },
  {
    column: 'id', filterName: 'is greater than or equal to', operation: '>=', value: 0,
  },
  {
    column: 'gender', filterName: 'contains', operation: 'contains', value: 'a',
  },
  {
    column: 'gender', filterName: 'does not contain', operation: 'notcontains', value: 'a',
  },
  {
    column: 'gender', filterName: 'starts with', operation: 'startswith', value: 'a',
  },
  {
    column: 'gender', filterName: 'ends with', operation: 'endswith', value: 'a',
  },
].forEach(({
  column, filterName, operation, value,
}) => {
  test(`sync from filterPanel: ${filterName} filter`, async (t) => {
    const cardView = new CardView('#container');

    await cardView.apiOption('filterValue', [[column, operation, value]]);

    await t.expect(cardView.apiColumnOption(column, 'filterType')).eql(undefined);
    await t.expect(cardView.apiColumnOption(column, 'filterValues')).eql(undefined);

    await expectFilterElementsState(t, [column]);
  }).before(async () => createWidget('dxCardView', baseConfig));
});

test('sync from filterPanel: filter by two columns', async (t) => {
  const cardView = new CardView('#container');

  await cardView.apiOption('filterValue', [
    ['id', 'anyof', [0, 1]],
    'and',
    ['gender', '=', 'male'],
  ]);

  await t.expect(cardView.apiColumnOption('id', 'filterType')).eql('include');
  await t.expect(cardView.apiColumnOption('id', 'filterValues')).eql([0, 1]);

  await t.expect(cardView.apiColumnOption('gender', 'filterType')).eql('include');
  await t.expect(cardView.apiColumnOption('gender', 'filterValues')).eql(['male']);

  await expectFilterElementsState(t, ['id', 'gender']);
}).before(async () => createWidget('dxCardView', baseConfig));

test('sync from filterPanel: filter by groupInterval', async (t) => {
  const cardView = new CardView('#container');

  await cardView.apiOption('filterValue', [['id', 'anyof', 0]]);

  await t.expect(cardView.apiColumnOption('id', 'filterType')).eql('include');
  await t.expect(cardView.apiColumnOption('id', 'filterValues')).eql([0]);
}).before(async () => createWidget('dxCardView', {
  ...baseConfig,
  columns: [{
    dataField: 'id',
    caption: 'id',
    allowHeaderFiltering: true,
    headerFilter: {
      groupInterval: 2,
    },
  }],
}));

/*
 Other sync scenarios
*/

test('sync first from filterPanel, then from headerFilter', async (t) => {
  const cardView = new CardView('#container');

  await cardView.apiOption('filterValue', [['id', 'anyof', [0, 1]]]);

  await cardView.apiColumnOption('gender', 'filterType', 'include');
  await cardView.apiColumnOption('gender', 'filterValues', ['male']);

  await t.expect(cardView.apiOption('filterValue')).eql([
    ['id', 'anyof', [0, 1]],
    'and',
    ['gender', '=', 'male'],
  ]);

  await expectFilterElementsState(t, ['id', 'gender']);
}).before(async () => createWidget('dxCardView', baseConfig));
