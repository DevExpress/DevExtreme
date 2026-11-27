import { test } from '../../../helpers/accessibility/test';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { createWidget } from '../../../helpers/createWidget';
import CardView from '../../../models/cardView';

const HEADER_PANEL_SELECTOR = `${DEFAULT_SELECTOR} .dx-cardview-headers`;
const a11yCheckConfig = {};

test('Default render', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
    dataSource: [
      {
        id: 0, filedA: 'A_0', filedB: 'B_0', fieldC: 'C_0',
      },
    ],
    width: 600,
  });

  await a11yCheck(page, a11yCheckConfig, HEADER_PANEL_SELECTOR);
});

test('render with header filter enabled', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
    dataSource: [
      {
        id: 0, filedA: 'A_0', filedB: 'B_0', fieldC: 'C_0',
      },
    ],
    headerFilter: {
      visible: true,
    },
    width: 600,
  });

  await a11yCheck(page, a11yCheckConfig, HEADER_PANEL_SELECTOR);
});

test('render with header filter enabled with filter values', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
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
  });

  await a11yCheck(page, a11yCheckConfig, HEADER_PANEL_SELECTOR);
});

test('render with single sorting', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
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
  });

  await a11yCheck(page, a11yCheckConfig, HEADER_PANEL_SELECTOR);
});

test('render with single sorting and header filter enabled', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
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
  });

  await a11yCheck(page, a11yCheckConfig, HEADER_PANEL_SELECTOR);
});

test('render with multiple sorting', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
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
  });

  await a11yCheck(page, a11yCheckConfig, HEADER_PANEL_SELECTOR);
});

test('render with multiple sorting and header filter', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
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
  });

  await a11yCheck(page, a11yCheckConfig, HEADER_PANEL_SELECTOR);
});

test('render with horizontal scroll', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
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
  });

  await a11yCheck(page, a11yCheckConfig, HEADER_PANEL_SELECTOR);
});

test('headerPanel column chooser link opens column chooser on click', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
    height: 600,
    columns: [
      { dataField: 'Column 1', visible: false },
    ],
    columnChooser: {
      enabled: true,
    },
  });

  const cardView = new CardView(page, DEFAULT_SELECTOR);
  const headerPanel = cardView.getHeaderPanel();

  await headerPanel.getColumnChooserLink().click();

  await a11yCheck(page, a11yCheckConfig, HEADER_PANEL_SELECTOR);
});
