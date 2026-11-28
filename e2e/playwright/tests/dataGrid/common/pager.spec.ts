import type { Page } from '@playwright/test';
import type { Properties } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import DataGrid from '../../../models/dataGrid';
import { expectClass } from '../../../models/internal/classMatcher';
import TextBox from '../../../models/textBox';
import { typeText } from '../helpers/typeText';

const SELECTION_CLASS = 'dx-selection';

async function createDataGridWithPager(page: Page): Promise<void> {
  const dataSource = Array.from({ length: 100 }, (_, room) => ({ name: 'Alex', phone: '555555', room }));
  return createWidget(page, 'dxDataGrid', {
    dataSource,
    columns: ['name', 'phone', 'room'],
    paging: {
      pageSize: 5,
      pageIndex: 5,
    },
    pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [5, 10, 20],
      showInfo: true,
      showNavigationButtons: true,
    },
  });
}

test.describe('Pager', () => {
  test('Full size pager', async ({ page }) => {
    await createDataGridWithPager(page);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const pager = dataGrid.getPager();

    await page.setViewportSize({ width: 900, height: 600 });
    // page size 5 selected
    await expectClass(pager.getPageSize(0), SELECTION_CLASS);
    // page 6 selected
    await expectClass(pager.getNavPage('6'), SELECTION_CLASS);
    await expect(pager.getInfoText()).toHaveText('Page 6 of 20 (100 items)');
    await expect(dataGrid.getDataCell(29, 2).element).toHaveText('29');
    // set page size to 10
    await pager.getPageSize(1).click();
    await expect(dataGrid.getDataCell(10 * 6 - 1, 2).element).toHaveText('59');
    // set page index 7
    await pager.getNavPage('7').click();
    await expect(dataGrid.getDataCell(10 * 7 - 1, 2).element).toHaveText('69');
    await expect(pager.getInfoText()).toHaveText('Page 7 of 10 (100 items)');
    // navigate to prev page (6)
    await pager.getPrevNavButton().click();
    await expect(pager.getInfoText()).toHaveText('Page 6 of 10 (100 items)');
    // navigate to next page (7)
    await pager.getNextNavButton().click();
    await expect(pager.getInfoText()).toHaveText('Page 7 of 10 (100 items)');

    await testScreenshot(page, 'pager-full-allpages.png');
  });

  test.describe(() => {
    test.use({ browserSize: [350, 600] });

    test('Compact pager', async ({ page }) => {
      await createDataGridWithPager(page);

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const pager = dataGrid.getPager();
      const pageSizeWidget = pager.getPageSizeSelectBox();
      const pageIndexWidget = new TextBox(page, pager.getPageIndexWidget());

      await typeText(pageIndexWidget.input, '7', { replace: true });
      await pageSizeWidget.dropDownButton.click();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await expect(pageSizeWidget.input).toHaveValue('10');
      await expect(dataGrid.getDataCell(10 * 7 - 1, 2).element).toHaveText('69');

      await testScreenshot(page, 'pager-compact.png');
    });
  });

  test('Resize', async ({ page }) => {
    await createDataGridWithPager(page);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const pagerElement = dataGrid.getPager().element;

    await page.setViewportSize({ width: 700, height: 600 });
    await testScreenshot(page, 'pager-resize-large.png', { element: pagerElement });
    await page.setViewportSize({ width: 600, height: 600 });
    await testScreenshot(page, 'pager-resize-large-noinfo.png', { element: pagerElement });
    await page.setViewportSize({ width: 350, height: 600 });
    await testScreenshot(page, 'pager-resize-small.png', { element: pagerElement });
    await page.setViewportSize({ width: 600, height: 600 });
    await testScreenshot(page, 'pager-resize-large-noinfo-enlarge.png', { element: pagerElement });
    await page.setViewportSize({ width: 700, height: 600 });
    await testScreenshot(page, 'pager-resize-large-enlarge.png', { element: pagerElement });
  });

  test('Resize without navigation buttons', async ({ page }) => {
    await createDataGridWithPager(page);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await dataGrid.option('pager.showNavigationButtons', false);
    const pagerElement = dataGrid.getPager().element;

    await page.setViewportSize({ width: 700, height: 600 });
    await testScreenshot(page, 'pager-resize-nobutton-large.png', { element: pagerElement });
    await page.setViewportSize({ width: 540, height: 600 });
    await testScreenshot(page, 'pager-resize-nobutton-large-noinfo.png', { element: pagerElement });
    await page.setViewportSize({ width: 350, height: 600 });
    await testScreenshot(page, 'pager-resize-nobutton-small.png', { element: pagerElement });
    await page.setViewportSize({ width: 540, height: 600 });
    await testScreenshot(page, 'pager-resize-nobutton-large-noinfo-enlarge.png', { element: pagerElement });
    await page.setViewportSize({ width: 700, height: 600 });
    await testScreenshot(page, 'pager-resize-nobutton-large-enlarge.png', { element: pagerElement });
  });

  test.describe(() => {
    test.use({ browserSize: [700, 600] });

    test('Compact pager (T1057735)', async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [{ id: 1, name: 'test' }],
        keyExpr: 'id',
        paging: {
          pageSize: 10,
        },
        pager: {
          visible: true,
          allowedPageSizes: [5, 10, 'all'],
          showPageSizeSelector: true,
          showInfo: true,
          showNavigationButtons: true,
          displayMode: 'compact',
        },
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const pagerElement = dataGrid.getPager().element;

      await testScreenshot(page, 'compact-pager.png', { element: pagerElement });
    });
  });

  test('Changing pageSize to \'all\' with rowRenderingMode=\'virtual\' should work (T1090331)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [...new Array(100).keys()].map((i) => ({ id: i })),
      keyExpr: 'id',
      showBorders: true,
      scrolling: {
        rowRenderingMode: 'virtual',
      },
      paging: {
        pageSize: 10,
      },
      pager: {
        visible: true,
        allowedPageSizes: [5, 10, 'all'],
        showPageSizeSelector: true,
        displayMode: 'compact',
      },
      height: 400,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const pager = dataGrid.getPager();

    await expect.poll(() => dataGrid.option('paging.pageSize')).toBe(10);

    await dataGrid.element.click(); // don't know why but test isn't reproduces without this click

    await dataGrid.scrollBy({ top: 100 });

    await pager.getPageSizeSelectBox().element.click();
    await pager.getPopupPageSizes().filter({ hasText: 'All' }).click();

    await expect.poll(() => dataGrid.option('paging.pageSize')).toBe(0);
  });

  test('Page index should not reset when scrolling while the grid is being refreshed (T1196099)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [...new Array(100).keys()].map((i) => ({ id: i })),
      keyExpr: 'id',
      showBorders: true,
      scrolling: {
        mode: 'standard',
        rowRenderingMode: 'virtual',
      },
      paging: { pageIndex: 2 },
      pager: {
        visible: true,
        displayMode: 'compact',
      },
      height: 440,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.option('paging.pageIndex')).toBe(2);

    await dataGrid.apiRefresh();
    await dataGrid.scrollBy({ top: 20 });

    await expect.poll(() => dataGrid.option('paging.pageIndex')).toBe(2);
  });

  test('Pager info should show page 1 of 1 after changing pageSize to \'all\' with virtual scrolling (T1327238)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [...new Array(100).keys()].map((i) => ({ id: i })),
      keyExpr: 'id',
      showBorders: true,
      scrolling: {
        mode: 'virtual',
      },
      paging: {
        pageSize: 10,
        pageIndex: 4,
      },
      pager: {
        visible: true,
        allowedPageSizes: [10, 'all'],
        showPageSizeSelector: true,
        showInfo: true,
        showNavigationButtons: true,
      },
      height: 400,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const pager = dataGrid.getPager();

    await expect(pager.getInfoText()).toHaveText('Page 5 of 10 (100 items)');

    await pager.getPageSize(1).click();
    await expect(pager.getInfoText()).toHaveText('Page 1 of 1 (100 items)');
  });

  test('Pager info should show page 1 of 1 after changing pageSize to \'all\' and enabling virtual scrolling (T1327238)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (): Properties => ({
      dataSource: [...new Array(100).keys()].map((i) => ({ id: i })),
      keyExpr: 'id',
      showBorders: true,
      scrolling: {
        mode: 'standard',
      },
      paging: {
        pageSize: 10,
        pageIndex: 4,
      },
      pager: {
        visible: true,
        allowedPageSizes: [10, 'all'],
        showPageSizeSelector: true,
        showInfo: true,
        showNavigationButtons: true,
      },
      height: 400,
      onOptionChanged: (e) => {
        if (e.fullName === 'paging.pageSize') {
          const setVirtual = e.value === 0;
          const targetRenderingMode = setVirtual ? 'virtual' : 'standard';
          const currentRenderingMode = e.component.option('scrolling.mode');
          if (currentRenderingMode !== targetRenderingMode) {
            e.component.beginUpdate();
            e.component.option('scrolling.mode', targetRenderingMode);
            e.component.repaint();
            e.component.endUpdate();
          }
        }
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const pager = dataGrid.getPager();

    await expect(pager.getInfoText()).toHaveText('Page 5 of 10 (100 items)');

    await pager.getPageSize(1).click();
    await expect(pager.getInfoText()).toHaveText('Page 1 of 1 (100 items)');
  });

  test('Pager should stay consistent after expanding/collapsing a group on the last page (T1322291)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      // 24 single-item groups with pageSize 2 -> collapsed groups fill 12 pages.
      // 12 pages (> 10) is what makes the pager use its windowed "1 ... n" layout with separators
      dataSource: Array.from({ length: 24 }, (_, i) => ({
        id: i,
        product: `Group ${String(i + 1).padStart(2, '0')}`,
        value: i,
      })),
      keyExpr: 'id',
      columns: [
        { dataField: 'product', groupIndex: 0 },
        'value',
      ],
      grouping: { autoExpandAll: false },
      paging: { pageSize: 2 },
      pager: { visible: true },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const pager = dataGrid.getPager();

    const checkPagerConsistent = async (expectedPageCount: number): Promise<void> => {
      // exactly one page is selected (no duplicated selection)
      await expect(pager.getSelectedPages()).toHaveCount(1);
      // the last page button is pageCount
      await expect(pager.getPageByIndex(-1)).toHaveText(`${expectedPageCount}`, { useInnerText: true });
      // the pageCount button appears only once (not duplicated)
      await expect(pager.getPagesByText(`${expectedPageCount}`)).toHaveCount(1);
      // no stale page button above pageCount
      await expect(pager.getPagesByText(`${expectedPageCount + 1}`)).toHaveCount(0);
    };

    await pager.getNavPage('12').click();
    await checkPagerConsistent(12);

    const lastGroupExpandCell = dataGrid.getGroupRow(-1).getExpandCell();

    await lastGroupExpandCell.click();
    await checkPagerConsistent(13);

    await lastGroupExpandCell.click();
    await checkPagerConsistent(12);

    await lastGroupExpandCell.click();
    await checkPagerConsistent(13);

    await lastGroupExpandCell.click();
    await checkPagerConsistent(12);
  });

  test('No error should occur if dataSource is not defined and pageIndex is promise chained (T1256070)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (): Properties => ({
      onContentReady(e) {
        e.component.pageIndex(1).then(() => {}, () => {});
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);
  });
});
