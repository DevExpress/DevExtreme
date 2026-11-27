import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';
import DateBox from '../../../../models/dateBox';
import SelectBox from '../../../../models/selectBox';
import TextBox from '../../../../models/textBox';
import { getData } from '../../helpers/generateDataSourceData';
import { typeText } from '../../helpers/typeText';

test.describe('FilterRow', () => {
  test('Filter should reset if the filter row editor text is cleared (T1257261)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [
        { ID: 1, Text: 'Item 1' },
        { ID: 2, Text: '' },
        { ID: 3, Text: 'Item 3' },
      ],
      keyExpr: 'ID',
      showBorders: true,
      remoteOperations: true,
      headerFilter: { visible: true },
      filterRow: { visible: true },
      filterPanel: { visible: true },
      filterValue: ['Text', '=', 'i'],
      columns: ['ID', {
        dataField: 'Text',
        selectedFilterOperation: '=',
      }],
      onEditorPreparing(e) {
        e.updateValueTimeout = 100;
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const filterEditor = dataGrid.getFilterEditor(1, TextBox);
    const filterPanelText = dataGrid.getFilterPanel().getFilterText();

    // assert
    await expect(filterPanelText.element).toHaveText('[Text] Equals \'i\'');
    // act
    await filterEditor.input.click();
    await page.keyboard.press('Backspace');
    // assert: the filter applies after the editor's updateValueTimeout
    await expect(filterPanelText.element).toHaveText('Create Filter');
    // act
    await dataGrid.element.click();
    // assert
    await expect(filterPanelText.element).toHaveText('Create Filter');
  });

  // T1267481
  test('Filter Row\'s Reset button does not work after a custom filter is set in Filter Builder', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data) => ({
      dataSource: data,
      height: 400,
      showBorders: true,
      filterRow: {
        visible: true,
        applyFilter: 'auto',
      },
      filterBuilder: {
        customOperations: [
          {
            name: 'custom',
            caption: 'custom',
            dataTypes: ['string'],
            icon: 'check',
            hasValue: false,
            calculateFilterExpression() {
              return [
                ['Field 0', '=', 0],
              ];
            },
          },
        ],
        allowHierarchicalFields: true,
      },
      filterPanel: { visible: true },
      filterValue: [
        ['field_0', 'custom'],
      ],
    }), DEFAULT_SELECTOR, { arg: getData(20, 1) });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const filterCell = dataGrid.getFilterCell(0);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect(dataGrid.getDataRows()).toHaveCount(0);

    await filterCell.menuButton.click();
    await filterCell.menu.getItemByText('Reset').click();

    await expect(dataGrid.getDataRows()).not.toHaveCount(0);
  });

  // T1290381
  test('DataGrid - filter row\'s search-box\'s aria-label should be customizable via localization', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).DevExpress.localization.loadMessages({
        en: {
          'dxDataGrid-ariaSearchBox': 'custom text',
        },
      });
    });

    await createWidget(page, 'dxDataGrid', {
      columns: [{
        dataField: 'test',
        dataType: 'string',
      }],
      filterRow: {
        visible: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const filterCell = dataGrid.getFilterCell(0);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect(filterCell.menuButton).toHaveAttribute('aria-label', 'custom text');
  });

  test('DataGrid - NVDA reads filter menu items as "Search box 1 of 8" (T1290386)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(5, 1),
      keyExpr: 'field_0',
      filterRow: {
        visible: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const filterCell = dataGrid.getFilterCell(0);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await expect(filterCell.menuButton).toHaveAttribute('aria-label', 'Search box');

    await filterCell.menuButton.click();

    const itemCount = await filterCell.menu.getItemCount();

    for (let i = 0; i < itemCount; i += 1) {
      const item = filterCell.menu.getItemByIndex(i);
      await expect(item).not.toHaveAttribute('aria-label');
    }

    await filterCell.menu.getItemByText('Equals').click();
    await expect(filterCell.menuButton).toHaveAttribute('aria-label', 'Equals');
  });

  // T1312521
  [true, false].forEach((grouped) => {
    test(`DataGrid - filter range overlay in last column on Tab pressed moves focus to next tabbable element (T1312521) (grouped=${grouped})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [
          { Group: 'group1', Value: 'field1', Range: 10 },
          { Group: 'group1', Value: 'field2', Range: 20 },
          { Group: 'group2', Value: 'field3', Range: 30 },
          { Group: 'group2', Value: 'field4', Range: 40 },
        ],
        filterRow: { visible: true },
        columns: [
          {
            dataField: 'Group',
            groupIndex: grouped ? 0 : undefined,
          },
          'Value',
          {
            dataField: 'Range',
            selectedFilterOperation: 'between',
          },
        ],
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const filterCell = dataGrid.getFilterCell(2);
      const expectedFocusedElement = grouped ? dataGrid.getGroupRow(0) : dataGrid.getDataCell(0, 0);

      await filterCell.element.click();
      await expect(dataGrid.getFilterRangeOverlay(), 'Filter range overlay is shown').toBeAttached();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await expect(dataGrid.getFilterRangeOverlay(), 'Filter range overlay is closed').not.toBeAttached();
      await expectedFocusedElement.expectFocusVisible();
    });
  });

  test('DataGrid - filter range overlay in last column on Tab pressed moves focus to next tabbable element with empty data (T1312521)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
      filterRow: { visible: true },
      columns: [
        'Group',
        'Value',
        {
          dataField: 'Range',
          selectedFilterOperation: 'between',
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const filterCell = dataGrid.getFilterCell(2);

    await filterCell.element.click();
    await expect(dataGrid.getFilterRangeOverlay(), 'Filter range overlay is shown').toBeAttached();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(dataGrid.getFilterRangeOverlay(), 'Filter range overlay is closed').not.toBeAttached();
    await expect(dataGrid.getRowsView(), 'Empty rows view is focused').toBeFocused();
  });

  test('Lookup filter should not change to (All) after searching twice in another column (T1284002)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [
        { ID: 1, Lookup: 1, Text: 'Item 1' },
        { ID: 2, Lookup: 2, Text: 'Item 2' },
        { ID: 3, Lookup: 3, Text: 'Item 3' },
      ],
      keyExpr: 'ID',
      syncLookupFilterValues: true,
      filterRow: { visible: true },
      columns: [{
        dataField: 'Lookup',
        lookup: {
          valueExpr: 'ID',
          displayExpr: 'Text',
          dataSource: [
            { ID: 1, Text: 'Lookup Item 1' },
            { ID: 2, Text: 'Lookup Item 2' },
            { ID: 3, Text: 'Lookup Item 3' },
          ],
        },
      }, 'Text'],
      onEditorPreparing(e) {
        if (e.dataField === 'Text') {
          e.updateValueTimeout = 0;
        }
      },
    }));

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const lookupFilterEditor = dataGrid.getFilterEditor(0, SelectBox);
    const textFilterEditor = dataGrid.getFilterEditor(1, TextBox);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await lookupFilterEditor.element.click();

    // assert
    await expect.poll(() => lookupFilterEditor.isOpened()).toBe(true);

    // act
    const lookupList = await lookupFilterEditor.getList();
    const lookupItem = lookupList.getItem(1);
    await lookupItem.element.click();

    // assert
    await expect(lookupFilterEditor.input).toHaveValue('Lookup Item 1');
    await expect(dataGrid.getDataRows()).toHaveCount(1);

    // act
    await typeText(textFilterEditor.input, 'a');

    // assert
    await expect(lookupFilterEditor.input).toHaveValue('Lookup Item 1');
    await expect(dataGrid.getDataRows()).toHaveCount(0);

    // act
    await typeText(textFilterEditor.input, 'b');

    // assert
    await expect(lookupFilterEditor.input).toHaveValue('Lookup Item 1');
    await expect(dataGrid.getDataRows()).toHaveCount(0);
  });

  test('DataGrid – `between` filter dropdown should be closed when columns are resized (T1303927)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      allowColumnResizing: true,
      filterRow: { visible: true },
      showBorders: true,
      columns: [{
        dataField: 'field1',
        dataType: 'number',
        selectedFilterOperation: 'between',
      }, {
        dataField: 'field2',
      }, {
        dataField: 'field3',
      }],
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const filterCell = dataGrid.getFilterCell(0);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await filterCell.element.click();

    // assert
    await expect(dataGrid.getFilterRangeOverlay(), 'Filter range overlay is shown').toBeAttached();

    // act
    await dataGrid.resizeHeader(1, 50);

    // assert
    await expect(dataGrid.getFilterRangeOverlay(), 'Filter range overlay is closed').not.toBeAttached();

    // act
    await filterCell.element.click();

    // assert
    await expect(dataGrid.getFilterRangeOverlay(), 'Filter range overlay is shown').toBeAttached();

    // act
    await dataGrid.resizeHeader(2, 50);

    // assert
    await expect(dataGrid.getFilterRangeOverlay(), 'Filter range overlay is closed').not.toBeAttached();
  });

  test('Date filter should be reset without errors after switching the operation from `between` when the filter panel is visible (T1336947)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { ID: 1, OrderDate: new Date(2026, 9, 13) },
        { ID: 2, OrderDate: new Date(2026, 9, 14) },
        { ID: 3, OrderDate: new Date(2026, 9, 20) },
      ],
      keyExpr: 'ID',
      showBorders: true,
      filterRow: { visible: true },
      filterPanel: { visible: true },
      columns: [{
        dataField: 'OrderDate',
        dataType: 'date',
        selectedFilterOperation: 'between',
        filterValue: [new Date(2026, 9, 13), new Date(2026, 9, 15)],
      }],
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const filterCell = dataGrid.getFilterCell(0);
    const filterEditor = dataGrid.getFilterEditor(0, DateBox);
    const filterPanelText = dataGrid.getFilterPanel().getFilterText();

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await expect(dataGrid.getDataRows()).toHaveCount(2);

    // act
    await filterCell.menuButton.click();
    await filterCell.menu.getItemByText('Equals').click();

    // assert
    await expect(filterEditor.element).toBeAttached();
    await expect.poll(() => filterEditor.option('value')).toBe(null);
    await expect(filterPanelText.element).toHaveText('Create Filter');
    await expect(dataGrid.getDataRows()).toHaveCount(3);
  });
});
