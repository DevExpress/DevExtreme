import CardView from 'devextreme-testcafe-models/cardView';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { testScreenshot } from '../../../helpers/themeUtils';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`CardView - HeaderPanel`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

const visualTest = (etalonName: string) => async (t: TestController) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(
    t,
    takeScreenshot,
    etalonName,
    { element: cardView.getHeaderPanel().element },
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
};

test(
  'default render',
  visualTest('default-render.png'),
)
  .before(async () => createWidget('dxCardView', {
    dataSource: [
      {
        id: 0, filedA: 'A_0', filedB: 'B_0', fieldC: 'C_0',
      },
    ],
    width: 600,
  }));

test(
  'render with header filter enabled',
  visualTest('header-filter-enabled.png'),
)
  .before(async () => createWidget('dxCardView', {
    dataSource: [
      {
        id: 0, filedA: 'A_0', filedB: 'B_0', fieldC: 'C_0',
      },
    ],
    headerFilter: {
      visible: true,
    },
    width: 600,
  }));

test(
  'render with header filter enabled with filter values',
  visualTest('header-filter-enabled-with-values.png'),
)
  .before(async () => createWidget('dxCardView', {
    dataSource: [
      {
        id: 0, filedA: 'A_0', filedB: 'B_0', fieldC: 'C_0',
      },
    ],
    columns: [
      'id',
      'filedA',
      {
        dataField: 'filedB',
        filterValues: ['B_0'],
      },
      {
        dataField: 'filedC',
        filterValues: ['C_0'],
      },
    ],
    headerFilter: {
      visible: true,
    },
    width: 600,
  }));

test(
  'render with single sorting',
  visualTest('single-sorting.png'),
).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, filedA: 'A_0', filedB: 'B_0', fieldC: 'C_0',
    },
  ],
  columns: [
    'id',
    'filedA',
    {
      dataField: 'filedB',
      sortOrder: 'asc',
    },
    'fieldC',
  ],
  width: 600,
}));

test(
  'render with single sorting and header filter enabled',
  visualTest('single-sorting-with-header-filter-enabled.png'),
).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, filedA: 'A_0', filedB: 'B_0', fieldC: 'C_0',
    },
  ],
  columns: [
    'id',
    'filedA',
    {
      dataField: 'filedB',
      sortOrder: 'asc',
    },
    'fieldC',
  ],
  headerFilter: {
    visible: true,
  },
  width: 600,
}));

test(
  'render with multiple sorting',
  visualTest('multiple-sorting.png'),
).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, filedA: 'A_0', filedB: 'B_0', fieldC: 'C_0',
    },
  ],
  columns: [
    'id',
    'filedA',
    {
      dataField: 'filedB',
      sortOrder: 'asc',
      sortIndex: 1,
    },
    {
      dataField: 'filedC',
      sortOrder: 'desc',
      sortIndex: 0,
    },
  ],
  sorting: {
    mode: 'multiple',
  },
  width: 600,
}));

test(
  'render with multiple sorting and header filter',
  visualTest('multiple-sorting-with-header-filter-enabled.png'),
).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, filedA: 'A_0', filedB: 'B_0', fieldC: 'C_0',
    },
  ],
  columns: [
    'id',
    'filedA',
    {
      dataField: 'filedB',
      sortOrder: 'asc',
      sortIndex: 1,
    },
    {
      dataField: 'filedC',
      sortOrder: 'desc',
      sortIndex: 0,
    },
  ],
  sorting: {
    mode: 'multiple',
  },
  headerFilter: {
    visible: true,
  },
  width: 600,
}));

test.meta({ unstable: true })('render with horizontal scroll', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const firstItem = cardView.getHeaderPanel().getHeaderItem(0);

  await testScreenshot(
    t,
    takeScreenshot,
    'render-with-horizontal-scroll.png',
    { element: firstItem.element },
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCardView', {
  columns: [
    {
      dataField: 'A',
      caption: 'First long caption',
    },
    {
      dataField: 'B',
      caption: 'Second long caption',
    },
  ],
  width: 250,
}));

test('headerPanel column chooser link opens column chooser on click', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);
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
  columnChooser: {
    enabled: true,
  },
}));
