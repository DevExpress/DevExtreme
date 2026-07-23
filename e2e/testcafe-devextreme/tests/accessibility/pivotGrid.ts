import PivotGrid from 'devextreme-testcafe-models/pivotGrid';
import { Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { a11yCheck } from '../../helpers/accessibility/utils';

fixture.disablePageReloads`PivotGrid - Accessibility`
  .page(url(__dirname, '../container.html'));

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

test('grid with field panel', async (t) => {
  await a11yCheck(t, {}, PIVOT_GRID_SELECTOR);
}).before(async () => createWidget('dxPivotGrid', createConfig()));

test('field chooser popup', async (t) => {
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);

  await t.click(pivotGrid.getFieldChooserButton());

  // The popup opens with an animation; wait for its content to settle so axe
  // does not sample a transient mid-animation state.
  await t.expect(Selector('.dx-fieldchooser-popup .dx-pivotgridfieldchooser').visible).ok();

  await a11yCheck(t);
}).before(async () => createWidget('dxPivotGrid', createConfig()));

test('header filter popup', async (t) => {
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
  const filterIcon = pivotGrid
    .getColumnHeaderArea()
    .getHeaderFilterIcon()
    .element;

  await t.click(filterIcon);

  await t.expect(Selector('.dx-header-filter-menu .dx-list-item').visible).ok();

  await a11yCheck(t);
}).before(async () => createWidget('dxPivotGrid', createConfig()));

test('cell context menu', async (t) => {
  const columnHeaderCell = Selector('.dx-pivotgrid-horizontal-headers td[tabindex]');

  await t.rightClick(columnHeaderCell);

  // The context menu is an animated overlay; wait for its items to be visible
  // before running axe to avoid flaky mid-animation samples.
  await t.expect(Selector('.dx-context-menu .dx-menu-item').visible).ok();

  await a11yCheck(t);
}).before(async () => createWidget('dxPivotGrid', createConfig()));
