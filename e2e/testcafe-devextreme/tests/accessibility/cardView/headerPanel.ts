import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { a11yCheck } from '../../../helpers/accessibility/utils';

fixture.disablePageReloads`CardView - HeaderPanel`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';
const HEADER_PANEL_SELECTOR = `${CARD_VIEW_SELECTOR} .dx-cardview-headers`;
const a11yCheckConfig = {};

test('Default render', async (t) => {
  await a11yCheck(t, a11yCheckConfig, HEADER_PANEL_SELECTOR);
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    {
      id: 0, filedA: 'A_0', filedB: 'B_0', fieldC: 'C_0',
    },
  ],
  width: 600,
}));

test('render with header filter enabled', async (t) => {
  await a11yCheck(t, a11yCheckConfig, HEADER_PANEL_SELECTOR);
}).before(async () => createWidget('dxCardView', {
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

test('render with header filter enabled with filter values', async (t) => {
  await a11yCheck(t, a11yCheckConfig, HEADER_PANEL_SELECTOR);
}).before(async () => createWidget('dxCardView', {
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

test('render with single sorting', async (t) => {
  await a11yCheck(t, a11yCheckConfig, HEADER_PANEL_SELECTOR);
}).before(async () => createWidget('dxCardView', {
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

test('render with single sorting and header filter enabled', async (t) => {
  await a11yCheck(t, a11yCheckConfig, HEADER_PANEL_SELECTOR);
}).before(async () => createWidget('dxCardView', {
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

test('render with multiple sorting', async (t) => {
  await a11yCheck(t, a11yCheckConfig, HEADER_PANEL_SELECTOR);
}).before(async () => createWidget('dxCardView', {
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

test('render with multiple sorting and header filter', async (t) => {
  await a11yCheck(t, a11yCheckConfig, HEADER_PANEL_SELECTOR);
}).before(async () => createWidget('dxCardView', {
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

test('render with horizontal scroll', async (t) => {
  await a11yCheck(t, a11yCheckConfig, HEADER_PANEL_SELECTOR);
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
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const headerPanel = cardView.getHeaderPanel();

  await t.click(headerPanel.getColumnChooserLink());

  await a11yCheck(t, a11yCheckConfig, HEADER_PANEL_SELECTOR);
}).before(async () => createWidget('dxCardView', {
  height: 600,
  columns: [
    { dataField: 'Column 1', visible: false },
  ],
  columnChooser: {
    enabled: true,
  },
}));
