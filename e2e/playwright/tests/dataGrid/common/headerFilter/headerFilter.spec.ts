import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { scrollIntoView } from '../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import HeaderFilter from '../../../../models/dataGrid/headers/headerFilter';
import { getData } from '../../helpers/generateDataSourceData';

test.describe('Header Filter', () => {
  test('Data should be filtered if (Blank) is selected in the header filter (T1257261)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
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
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);
    const dataCell = dataGrid.getDataRow(0).getDataCell(0);
    const filterIconElement = headerCell.getFilterIcon();
    const headerFilter = new HeaderFilter(page);
    const buttons = headerFilter.getButtons();
    const list = headerFilter.getList();

    await filterIconElement.click();
    await list.getItem(1).element.click(); // Select second item with value 'Item 1'
    await buttons.nth(0).click(); // Click OK

    await expect(dataCell.element).toHaveText('1', { useInnerText: true });

    await filterIconElement.click();
    await list.getItem(1).element.click(); // Deselect second item with value 'Item 1'
    await list.getItem(0).element.click(); // Select second item with value '(Blanks)'
    await buttons.nth(0).click(); // Click OK

    await expect(dataCell.element).toHaveText('2', { useInnerText: true });
  });

  test('HeaderFilter icon should be grayed out after the clearFilter call (T1193648)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        ID: 1,
        Name: 'A',
      }, {
        ID: 2,
        Name: 'B',
      }],
      keyExpr: 'ID',
      showBorders: true,
      headerFilter: { visible: true },
      filterRow: { visible: true },
      columns: [{
        dataField: 'Name',
        filterValues: ['A'],
        filterValue: 'A',
      }],
      height: 140,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // act
    await dataGrid.apiClearFilter();

    // assert
    await testScreenshot(page, 'header-filter-icon-clear-filter.png', { element: dataGrid.element });
  });

  test('The header filter should fit inside the viewport if the grid is scrolled horizontally (T1156848)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      columns: ['Column1', 'Column2'],
      columnWidth: 250,
      width: 400,
      height: 400,
      headerFilter: { visible: true },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const filterIconElement = dataGrid.getHeaders()
      .getHeaderRow(0)
      .getHeaderCell(0)
      .getFilterIcon();

    // act
    await dataGrid.scrollBy({ left: 100 });
    // The screenshot shows the headers scrolled where TestCafe's click left them.
    await scrollIntoView(filterIconElement);
    await filterIconElement.click();

    // assert
    await testScreenshot(page, 'grid-header-filter-popup-T1156848.png', { element: DEFAULT_SELECTOR });
  });

  test('HeaderFilter popup screenshot', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 2),
      height: 400,
      showBorders: true,
      headerFilter: {
        visible: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);
    const filterIconElement = headerCell.getFilterIcon();

    await filterIconElement.click();
    // act
    await testScreenshot(page, 'header-filter-popup.png', { element: dataGrid.element });

    // assert
    await expect(new HeaderFilter(page).element.first()).toBeAttached();
  });

  test('Should correctly change values (T1161941)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        {
          Name: 'A',
          Amount: 1000,
        },
        {
          Name: 'B',
          Amount: 5000,
        },
      ],
      headerFilter: {
        visible: true,
      },
      columns: ['Name', 'Amount'],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);
    const dataCell = dataGrid.getDataRow(0).getDataCell(1);
    const filterIconElement = headerCell.getFilterIcon();
    const headerFilter = new HeaderFilter(page);
    const buttons = headerFilter.getButtons();
    const list = headerFilter.getList();

    await filterIconElement.click();
    await list.getItem(0).element.click();
    await buttons.nth(0).click();

    await expect(dataCell.element).toHaveText('1000', { useInnerText: true });

    await filterIconElement.click();
    await filterIconElement.click();
    await list.getItem(0).element.click();
    await list.getItem(1).element.click();
    await buttons.nth(0).click();

    await expect(dataCell.element).toHaveText('5000', { useInnerText: true });
  });

  test('Header filter should support string height and width', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
      columns: [
        'field1', 'field2', {
          dataField: 'field3',
          headerFilter: {
            height: '450px',
            width: '380px',
          },
        },
      ],
      width: 700,
      headerFilter: {
        visible: true,
        height: '400px',
        width: '330px',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const firstFilterIcon = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).getFilterIcon();
    const thirdFilterIcon = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(2).getFilterIcon();

    await firstFilterIcon.click();
    await expect(new HeaderFilter(page).getContent().first()).toHaveCSS('height', '400px');
    await expect(new HeaderFilter(page).getContent().first()).toHaveCSS('width', '330px');
    await thirdFilterIcon.click();
    await expect(new HeaderFilter(page).getContent().first()).toHaveCSS('height', '450px');
    await expect(new HeaderFilter(page).getContent().first()).toHaveCSS('width', '380px');
  });

  test('DataGrid - Column Header filter does not properly work if the column caption contains double quotes (T1251768)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(5, 1),
      headerFilter: {
        visible: true,
      },
      columns: [
        {
          dataField: 'Position',
          caption: '"סה"כ שולם"',
        },
        'FirstName',
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const filterIconElement = dataGrid.getHeaders()
      .getHeaderRow(0)
      .getHeaderCell(0)
      .getFilterIcon();

    await filterIconElement.click();

    await testScreenshot(page, 'T1251768-header-filter-double-quotes.png', { element: dataGrid.element });
  });

  test('Data should be filtered if True is selected in the header filter when case sensitive is enabled (T1273020)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: {
        store: [
          { ID: 1, text: 'true' },
          { ID: 2, text: 'True' },
        ],
        langParams: {
          locale: 'en-US',
          collatorOptions: {
            sensitivity: 'case',
          },
        },
      },
      keyExpr: 'ID',
      showBorders: true,
      headerFilter: { visible: true },
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);
    const filterIconElement = headerCell.getFilterIcon();
    const headerFilter = new HeaderFilter(page);
    const buttons = headerFilter.getButtons();
    const list = headerFilter.getList();

    // act
    await filterIconElement.click();
    await list.getItem(0).element.click(); // Select first item with value 'true'
    await buttons.nth(0).click(); // Click OK

    await testScreenshot(page, 'T1273020-header-filter-with-case-sensitive-1.png', { element: dataGrid.element });

    // act
    await filterIconElement.click();
    await list.getItem(0).element.click(); // Deselect first item with value 'true'
    await list.getItem(1).element.click(); // Select second item with value 'True'
    await buttons.nth(0).click(); // Click OK

    await testScreenshot(page, 'T1273020-header-filter-with-case-sensitive-2.png', { element: dataGrid.element });
  });

  test('Header filter search input loses focus on first key in datetime columns (T1284663)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        id: 1,
        DeliveryDate: '2017/04/13 9:00',
      }],
      headerFilter: {
        visible: true,
      },
      keyExpr: 'id',
      columns: [{
        dataField: 'DeliveryDate',
        dataType: 'date',
        headerFilter: {
          dataSource: [
            { text: 'March 11, 2025', value: '2025-03-11T00:00:00' },
            { text: 'March 2, 2025', value: '2025-03-02T00:00:00' },
            { text: 'February 3, 2025', value: '2025-02-03T00:00:00' },
          ],
          search: { enabled: true },
        },
      }],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerCell = dataGrid.getHeaders()
      .getHeaderRow(0)
      .getHeaderCell(0);
    const filterIconElement = headerCell.getFilterIcon();
    const headerFilter = new HeaderFilter(page);

    await filterIconElement.click();
    await page.keyboard.press('1');

    // The search applies after a timeout and re-renders the values: the focus got lost then.
    await expect(headerFilter.getTreeView().getNodes()).toHaveCount(1);

    const searchInput = headerFilter.getSearchInput();

    await expect(searchInput).toBeFocused();
  });

  test('DataGrid – Header filters show "No data to display" when "not and" or "not or" operations are used in the filter panel (T1291737)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 1),
      keyExpr: 'field_0',
      filterValue: [
        '!',
        [['field_0', '=', 'val_0_0']],
      ],
      filterPanel: {
        visible: true,
      },
      headerFilter: {
        visible: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerFilterButton = dataGrid.getHeaders()
      .getHeaderRow(0)
      .getHeaderCell(0)
      .getFilterIcon();
    const headerFilter = new HeaderFilter(page);
    const listCount = headerFilter.getList().items;

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await headerFilterButton.click();

    await expect(listCount).toHaveCount(9);
  });
});
