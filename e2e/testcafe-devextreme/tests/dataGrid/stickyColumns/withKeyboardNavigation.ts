import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { ClientFunction } from 'testcafe';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { defaultConfig } from './data';

function getScrollPadding(scrollContainer, paddingSide): Promise<string> {
  return ClientFunction((element, side) => element().style[`scrollPadding${side}`])(scrollContainer, paddingSide);
}

function cellIsVisibleInViewport(cell, scrollContainer): Promise<boolean> {
  return ClientFunction((element, container) => {
    const cellElement = element();
    const cellRect = cellElement.getBoundingClientRect();
    const scrollContainerElement = container();
    const scrollPaddingLeft = parseFloat(scrollContainerElement.style.scrollPaddingLeft);
    const scrollPaddingRight = parseFloat(scrollContainerElement.style.scrollPaddingRight);
    const {
      left: scrollContainerOffsetLeft,
      right: scrollContainerOffsetRight,
    }: { left: number; right: number } = scrollContainerElement.getBoundingClientRect();

    if (cellRect.right < (scrollContainerOffsetLeft + scrollPaddingLeft)) {
      return false;
    }

    if (cellRect.left > (scrollContainerOffsetRight - scrollPaddingRight)) {
      return false;
    }

    return true;
  })(cell, scrollContainer);
}

const navigateToNextCell = async (t, $headerCell, scrollContainer) => {
  // act
  await t
    .pressKey('tab');

  // assert
  await t
    .expect($headerCell.isFocused)
    .ok()
    .expect(cellIsVisibleInViewport($headerCell.element, scrollContainer))
    .ok();
};

const navigateToPrevCell = async (t, $headerCell, scrollContainer) => {
  // act
  await t
    .pressKey('shift+tab');

  // assert
  await t
    .expect($headerCell.isFocused)
    .ok()
    .expect(cellIsVisibleInViewport($headerCell.element, scrollContainer))
    .ok();
};

const checkScrollPadding = async (
  t,
  scrollContainer,
  scrollPaddingLeft,
  scrollPaddingRight,
) => {
  // assert
  await t
    .expect(getScrollPadding(scrollContainer, 'Left'))
    .eql(scrollPaddingLeft)
    .expect(getScrollPadding(scrollContainer, 'Right'))
    .eql(scrollPaddingRight);
};

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`Fixed Columns - keyboard navigation`
  .page(url(__dirname, '../../container.html'));

safeSizeTest('Headers navigation by Tab key when there are fixed columns', async (t) => {
  // arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const headers = dataGrid.getHeaders();
  const headersScrollContainer = headers.getContent();
  const headerRow = headers.getHeaderRow(0);

  // assert
  await checkScrollPadding(t, headersScrollContainer, '130px', '285px');

  // act
  await t.click(headerRow.getHeaderCell(0).element);

  // assert
  await t
    .expect(headerRow.getHeaderCell(0).isFocused)
    .ok();

  // act
  await navigateToNextCell(t, headerRow.getHeaderCell(1), headersScrollContainer);
  await navigateToNextCell(t, headerRow.getHeaderCell(2), headersScrollContainer);
  await navigateToNextCell(t, headerRow.getHeaderCell(3), headersScrollContainer);

  // assert
  await checkScrollPadding(t, headersScrollContainer, '130px', '160px');

  await takeScreenshot('fixed_columns_headers_navigation_by_tab_1.png', dataGrid.element);

  // act
  await navigateToNextCell(t, headerRow.getHeaderCell(4), headersScrollContainer);
  await navigateToNextCell(t, headerRow.getHeaderCell(5), headersScrollContainer);
  await navigateToNextCell(t, headerRow.getHeaderCell(6), headersScrollContainer);

  // assert
  await checkScrollPadding(t, headersScrollContainer, '255px', '160px');

  await takeScreenshot('fixed_columns_headers_navigation_by_tab_2.png', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [900, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  width: 550,
  customizeColumns(columns) {
    columns[4].width = 125;
    columns[4].fixed = true;
    columns[4].fixedPosition = 'sticky';
  },
}));

safeSizeTest('Headers navigation by Shift and Tab keys when there are fixed columns', async (t) => {
  // arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const headers = dataGrid.getHeaders();
  const headersScrollContainer = headers.getContent();
  const headerRow = headers.getHeaderRow(0);

  // assert
  await checkScrollPadding(t, headersScrollContainer, '130px', '285px');

  // act
  await t.click(headerRow.getHeaderCell(6).element);

  // assert
  await t
    .expect(headerRow.getHeaderCell(6).isFocused)
    .ok();

  // act
  await navigateToPrevCell(t, headerRow.getHeaderCell(5), headersScrollContainer);

  // assert
  await checkScrollPadding(t, headersScrollContainer, '130px', '160px');

  await takeScreenshot('fixed_columns_headers_navigation_by_shift_and_tab_1.png', dataGrid.element);

  // act
  await navigateToPrevCell(t, headerRow.getHeaderCell(4), headersScrollContainer);
  await navigateToPrevCell(t, headerRow.getHeaderCell(3), headersScrollContainer);
  await navigateToPrevCell(t, headerRow.getHeaderCell(2), headersScrollContainer);
  await navigateToPrevCell(t, headerRow.getHeaderCell(1), headersScrollContainer);
  await navigateToPrevCell(t, headerRow.getHeaderCell(0), headersScrollContainer);

  // assert
  await checkScrollPadding(t, headersScrollContainer, '130px', '285px');

  await takeScreenshot('fixed_columns_headers_navigation_by_shift_and_tab_2.png', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [900, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  width: 625,
  customizeColumns(columns) {
    columns[4].width = 125;
    columns[4].fixed = true;
    columns[4].fixedPosition = 'sticky';
  },
}));

safeSizeTest('Data cells navigation by Tab key when there are fixed columns', async (t) => {
  // arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const scrollContainer = dataGrid.getScrollContainer();

  // act
  await t.click(dataGrid.getDataCell(0, 0).element);
  await navigateToNextCell(t, dataGrid.getDataCell(0, 1), scrollContainer);
  await navigateToNextCell(t, dataGrid.getDataCell(0, 2), scrollContainer);
  await navigateToNextCell(t, dataGrid.getDataCell(0, 3), scrollContainer);

  await takeScreenshot('fixed_columns_data_cells_navigation_by_tab_1.png', dataGrid.element);

  // act
  await navigateToNextCell(t, dataGrid.getDataCell(0, 4), scrollContainer);
  await navigateToNextCell(t, dataGrid.getDataCell(0, 5), scrollContainer);
  await navigateToNextCell(t, dataGrid.getDataCell(0, 6), scrollContainer);

  await takeScreenshot('fixed_columns_data_cells_navigation_by_tab_2.png', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [900, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  width: 550,
  customizeColumns(columns) {
    columns[4].width = 125;
    columns[4].fixed = true;
    columns[4].fixedPosition = 'sticky';
  },
}));

safeSizeTest('Data cells navigation by Shift and Tab keys when there are fixed columns', async (t) => {
  // arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const scrollContainer = dataGrid.getScrollContainer();

  // act
  await t.click(dataGrid.getDataCell(0, 6).element);
  await navigateToPrevCell(t, dataGrid.getDataCell(0, 5), scrollContainer);
  await navigateToPrevCell(t, dataGrid.getDataCell(0, 4), scrollContainer);

  await takeScreenshot('fixed_columns_data_cells_navigation_by_shift_and_tab_1.png', dataGrid.element);

  // act
  await navigateToPrevCell(t, dataGrid.getDataCell(0, 3), scrollContainer);
  await navigateToPrevCell(t, dataGrid.getDataCell(0, 2), scrollContainer);
  await navigateToPrevCell(t, dataGrid.getDataCell(0, 1), scrollContainer);
  await navigateToPrevCell(t, dataGrid.getDataCell(0, 0), scrollContainer);

  await takeScreenshot('fixed_columns_data_cells_navigation_by_shift_and_tab_2.png', dataGrid.element);

  // assert
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [900, 800]).before(async () => createWidget('dxDataGrid', {
  ...defaultConfig,
  width: 550,
  customizeColumns(columns) {
    columns[3].width = 125;
    columns[3].fixed = true;
    columns[3].fixedPosition = 'sticky';
  },
}));
