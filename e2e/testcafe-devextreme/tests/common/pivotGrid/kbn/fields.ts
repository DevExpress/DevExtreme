import PivotGrid from 'devextreme-testcafe-models/pivotGrid';
import HeaderFilter from 'devextreme-testcafe-models/dataGrid/headers/headerFilter';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`PivotGrid_KBN_fields`
  .page(url(__dirname, '../../../container.html'));

const PIVOT_GRID_SELECTOR = '#container';

const createConfig = () => ({
  width: 1000,
  allowSortingBySummary: true,
  allowSorting: true,
  allowExpandAll: true,
  allowFiltering: true,
  showBorders: true,
  fieldChooser: {
    enabled: true,
    height: 500,
  },
  fieldPanel: {
    visible: true,
  },
  dataSource: {
    fields: [{
      dataField: 'country',
      area: 'filter',
    }, {
      dataField: 'city',
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
      dataField: 'id',
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
      caption: 'Relative Sales',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      area: 'data',
      summaryDisplayMode: 'percentOfColumnGrandTotal',
    }, {
      dataField: 'data1',
      dataType: 'number',
      area: 'data',
    }],
    store: [{
      id: 10887,
      region: 'Africa',
      country: 'Egypt',
      city: 'Cairo',
      amount: 500,
      date: new Date('2015-05-26'),
    }, {
      id: 10888,
      region: 'South America',
      country: 'Argentina',
      city: 'Buenos Aires',
      amount: 780,
      date: '2015-05-07',
    }],
  },
});

[true, false].forEach((isFieldChooser) => {
  const getField = (pivotGrid: PivotGrid, area: string, index: number) => {
    switch (area) {
      case 'filter':
        return isFieldChooser
          ? pivotGrid.getFieldChooser().getFilterAreaItem(index)
          : pivotGrid.getFilterHeaderArea().getField(index);
      case 'data':
        return isFieldChooser
          ? pivotGrid.getFieldChooser().getDataFields().nth(index)
          : pivotGrid.getDataHeaderArea().getField(index);
      case 'column':
        return isFieldChooser
          ? pivotGrid.getFieldChooser().getColumnAreaItem(index)
          : pivotGrid.getColumnHeaderArea().getField(index);
      case 'row':
        return isFieldChooser
          ? pivotGrid.getFieldChooser().getRowAreaItem(index)
          : pivotGrid.getRowHeaderArea().getField(index);
      default:
        throw new Error(`Unknown area: ${area}`);
    }
  };

  const testTitlePrefix = isFieldChooser ? 'Field Chooser' : 'PivotGrid';

  ['filter', 'data', 'column', 'row'].forEach((area) => {
    test(`${testTitlePrefix}: Fields in ${area} area should be focusable by tab`, async (t) => {
      const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);

      if (isFieldChooser) {
        await t.click(pivotGrid.getFieldChooserButton());
      }

      const firstField = getField(pivotGrid, area, 0);
      const secondField = getField(pivotGrid, area, 1);

      await t
        .click(firstField)
        .expect(firstField.focused)
        .ok('first field is focused after click');

      await t
        .pressKey(area === 'data' ? 'tab' : 'tab tab')
        .expect(secondField.focused)
        .ok('second field is focused after Tab Tab');

      await t
        .pressKey(area === 'data' ? 'shift+tab' : 'shift+tab shift+tab')
        .expect(firstField.focused)
        .ok('first field is focused after Shift+Tab Shift+Tab');
    }).before(async () => createWidget('dxPivotGrid', createConfig()));
  });

  ['filter', 'column', 'row'].forEach((area) => {
    test(`${testTitlePrefix}: Fields in ${area} area on enter key press`, async (t) => {
      const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);

      if (isFieldChooser) {
        await t.click(pivotGrid.getFieldChooserButton());
      }

      const firstField = getField(pivotGrid, area, 0);
      const secondField = getField(pivotGrid, area, 1);

      await t
        .click(firstField)
        .pressKey('tab tab')
        .expect(secondField.focused)
        .ok('second field is focused after Tab Tab')
        .expect(secondField.find('.dx-sort-up').exists)
        .ok('second field has asc sort indicator initially');

      await t
        .pressKey('enter')
        .expect(secondField.focused)
        .ok('second field is focused after Enter')
        .expect(secondField.find('.dx-sort-down').exists)
        .ok('second field has desc sort indicator after Enter');

      await t
        .pressKey('enter')
        .expect(secondField.focused)
        .ok('second field is focused after second Enter')
        .expect(secondField.find('.dx-sort-up').exists)
        .ok('second field has asc sort indicator after second Enter');
    }).before(async () => createWidget('dxPivotGrid', createConfig()));

    test(`${testTitlePrefix}: Fields in ${area} area on space key press`, async (t) => {
      const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);

      if (isFieldChooser) {
        await t.click(pivotGrid.getFieldChooserButton());
      }

      const firstField = getField(pivotGrid, area, 0);
      const secondField = getField(pivotGrid, area, 1);

      await t
        .click(firstField)
        .pressKey('tab tab')
        .expect(secondField.focused)
        .ok('second field is focused after Tab Tab')
        .expect(secondField.find('.dx-sort-up').exists)
        .ok('second field has asc sort indicator initially');

      await t
        .pressKey('space')
        .expect(secondField.focused)
        .ok('second field is focused after Space')
        .expect(secondField.find('.dx-sort-down').exists)
        .ok('second field has desc sort indicator after Space');

      await t
        .pressKey('space')
        .expect(secondField.focused)
        .ok('second field is focused after second Space')
        .expect(secondField.find('.dx-sort-up').exists)
        .ok('second field has asc sort indicator after second Space');
    }).before(async () => createWidget('dxPivotGrid', createConfig()));

    test(`${testTitlePrefix}: Field in ${area} should have focus after header filter is closed`, async (t) => {
      const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
      const headerFilter = new HeaderFilter();

      if (isFieldChooser) {
        await t.click(pivotGrid.getFieldChooserButton());
      }

      const firstField = getField(pivotGrid, area, 0);

      await t
        .click(firstField)
        .pressKey('tab')
        .pressKey('enter')
        .expect(headerFilter.element.exists)
        .ok('header filter popup is shown after Enter on icon');

      await t
        .pressKey('esc')
        .expect(firstField.focused)
        .ok('first field is focused after header filter is closed');
    }).before(async () => createWidget('dxPivotGrid', createConfig()));

    test(`${testTitlePrefix}: Field in ${area} should have focus after header filter is applied`, async (t) => {
      const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
      const headerFilter = new HeaderFilter();

      if (isFieldChooser) {
        await t.click(pivotGrid.getFieldChooserButton());
      }

      const firstField = getField(pivotGrid, area, 0);

      await t
        .click(firstField)
        .pressKey('tab')
        .pressKey('enter')
        .expect(headerFilter.element.exists)
        .ok('header filter popup is shown after Enter on icon');

      const list = headerFilter.getList();
      const okButton = headerFilter.getButtons().nth(0);

      await t
        .click(list.getItem(0).element)
        .click(okButton)
        .expect(firstField.focused)
        .ok('first field is focused after header filter is applied');
    }).before(async () => createWidget('dxPivotGrid', createConfig()));
  });
});

test('PivotGrid: Should traverse fields in all areas by tab', async (t) => {
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);

  const filterFirstField = pivotGrid.getFilterHeaderArea().getField(0);
  const dataFirstField = pivotGrid.getDataHeaderArea().getField(0);
  const columnFirstField = pivotGrid.getColumnHeaderArea().getField(0);
  const rowFirstField = pivotGrid.getRowHeaderArea().getField(0);

  await t
    .click(filterFirstField)
    .expect(filterFirstField.focused)
    .ok('first field in filter area is focused after click');

  await t
    .pressKey('tab tab tab tab')
    .expect(dataFirstField.focused)
    .ok('first field in data area is focused');

  await t
    .pressKey('tab tab')
    .expect(columnFirstField.focused)
    .ok('first field in column area is focused');

  await t
    .pressKey('tab tab tab tab tab tab')
    .expect(rowFirstField.focused)
    .ok('first field in row area is focused');
}).before(async () => createWidget('dxPivotGrid', createConfig()));

test('FieldChooser: Should traverse fields in all areas by tab', async (t) => {
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
  const fieldChooser = pivotGrid.getFieldChooser();

  await t.click(pivotGrid.getFieldChooserButton());

  const rowFirstField = fieldChooser.getRowAreaItem(0);
  const columnFirstField = fieldChooser.getColumnAreaItem(0);
  const filterFirstField = fieldChooser.getFilterAreaItem(0);
  const dataFirstField = fieldChooser.getDataAreaItem(0);

  await t
    .click(rowFirstField)
    .expect(rowFirstField.focused)
    .ok('first field in row area is focused after click');

  await t
    .pressKey('tab tab tab tab tab')
    .expect(columnFirstField.focused)
    .ok('first field in column area is focused');

  await t
    .pressKey('tab tab tab tab tab')
    .expect(filterFirstField.focused)
    .ok('first field in filter area is focused');

  await t
    .pressKey('tab tab tab tab tab')
    .expect(dataFirstField.focused)
    .ok('first field in data area is focused');
}).before(async () => createWidget('dxPivotGrid', createConfig()));
