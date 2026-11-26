import { expect, test } from '../../helpers/accessibility/test';
import PivotGrid from '../../models/pivotGrid';
import { createWidget } from '../../helpers/createWidget';
import { a11yCheck } from '../../helpers/accessibility/utils';

const PIVOT_GRID_SELECTOR = '#container';

const createConfig = () => ({
  width: 1000,
  allowSorting: true,
  allowSortingBySummary: true,
  allowFiltering: true,
  allowExpandAll: true,
  showBorders: true,
  fieldPanel: {
    visible: true,
  },
  fieldChooser: {
    enabled: true,
    height: 500,
  },
  dataSource: {
    fields: [{
      dataField: 'country',
      area: 'filter',
    }, {
      caption: 'Region',
      width: 120,
      dataField: 'region',
      area: 'row',
    }, {
      caption: 'City',
      dataField: 'city',
      width: 150,
      area: 'row',
    }, {
      caption: 'Country',
      dataField: 'country',
      area: 'column',
    }, {
      dataField: 'date',
      dataType: 'date',
      area: 'column',
    }, {
      groupName: 'date',
      groupInterval: 'year',
      expanded: true,
      area: 'column',
    }, {
      caption: 'Sales',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      area: 'data',
    }],
    store: [{
      region: 'Africa',
      country: 'Egypt',
      city: 'Cairo',
      amount: 500,
      date: new Date('2015-05-26'),
    }, {
      region: 'South America',
      country: 'Argentina',
      city: 'Buenos Aires',
      amount: 780,
      date: new Date('2015-05-07'),
    }],
  },
});

test('grid with field panel', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig());

  await a11yCheck(page, {}, PIVOT_GRID_SELECTOR);
});

// The popup/menu widgets are portaled to <body>, outside the harness page
// landmarks, so the best-practice 'region' rule fires on them regardless of
// the widget's own accessibility (same convention as dataGrid/cardView a11y
// tests). It is disabled for the overlay scenarios.
const overlayA11yOptions = { rules: { region: { enabled: false } } };

test('field chooser popup', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig());

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);

  await pivotGrid.getFieldChooserButton().click();

  await a11yCheck(page, overlayA11yOptions);
});

test('header filter popup', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig());

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const filterIcon = pivotGrid
    .getColumnHeaderArea()
    .getHeaderFilterIcon()
    .element;

  await filterIcon.click();

  await expect(page.locator('.dx-header-filter-menu .dx-list-item').first()).toBeVisible();

  await a11yCheck(page, overlayA11yOptions);
});

test('cell context menu', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig());

  const columnHeaderCell = page.locator('.dx-pivotgrid-horizontal-headers td[tabindex]').first();

  await columnHeaderCell.click({ button: 'right' });

  await expect(page.locator('.dx-context-menu .dx-menu-item').first()).toBeVisible();

  await a11yCheck(page, overlayA11yOptions);
});
