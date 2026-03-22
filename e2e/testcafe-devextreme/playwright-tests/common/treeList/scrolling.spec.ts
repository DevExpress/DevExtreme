import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Virtual Scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const scrollWindowTo = async (position: object) => {
    await ClientFunction(
      () => {
        (window as any).scroll(position);
      },
      {
        dependencies: {
          position,
        },
      },
    )();
  };

  function generateData(rowCount): Record<string, unknown>[] {
    const items: Record<string, unknown>[] = [];

    for (let i = 0; i < rowCount; i += 1) {
      items.push({
        ID: i,
        Head_ID: -1,
        Full_Name: 'Ken Samuelson Demo Demo Demo Demo Demo Demo Demo Demo Demo Demo',
        Prefix: 'Dr. Demo Demo Demo Demo Demo Demo Demo Demo Demo Demo',
        Title: 'Ombudsman Demo Demo Demo Demo Demo Demo Demo Demo Demo Demo',
        City: 'St. Louis Demo Demo Demo Demo Demo Demo Demo Demo Demo Demo',
        State: 'Missouri Demo Demo Demo Demo Demo Demo Demo Demo Demo Demo',
        Email: 'kents@dx-email.com Demo Demo Demo Demo Demo Demo Demo Demo Demo Demo',
        Skype: 'kents_DX_skype',
        Mobile_Phone: '(562) 555-9282',
        Birth_Date: '1972-09-11',
        Hire_Date: '2009-04-22',
      });
    }

    return items;
  }

  // T1129106
  test('The vertical scroll bar of the container\'s parent should not be displayed when the grid has no height, virtual scrolling and state storing are enabled', async ({ page }) => {
    // arrange, act
    const treeList = page.locator('#container');

    await expect(treeList.isReady()).ok();
    await testScreenshot(page, 'T1129106-treelist-virtual-scrolling-1');

    // act
    await scrollWindowTo({ top: 10000000 });

    await expect(treeList.isReady()).ok();
    await testScreenshot(page, 'T1129106-treelist-virtual-scrolling-2');

    // act
    await scrollWindowTo({ top: 0 });

    await expect(treeList.isReady()).ok();
    await testScreenshot(page, 'T1129106-treelist-virtual-scrolling-3');

    // assert

    });.before(async ({ page }) => {
    await page.evaluate(() => {
      $('#container').wrap('<div id=\'wrapperContainer\' style=\'height: 100%; overflow: auto;\'></div>');
    });

    await resizeWindow(550, 700);

    await createWidget(page, 'dxTreeList', {
      dataSource: generateData(1000),
      rootValue: -1,
      columnMinWidth: 80,
      wordWrapEnabled: true,
      columnAutoWidth: true,
      allowColumnResizing: true,
      keyExpr: 'ID',
      parentIdExpr: 'Head_ID',
      showRowLines: true,
      showBorders: true,
      autoExpandAll: true,
      scrolling: {
        mode: 'virtual',
      },
      stateStoring: {
        enabled: true,
        type: 'custom',
        customSave: () => {},
        customLoad: () => ({
          pageIndex: 50,
        }),
      },
      columns: ['Title', 'Full_Name', 'City', 'State', 'Mobile_Phone', 'Hire_Date'],
    });
  });

  // T1189118
  test('All items should be selected after select all and scroll down', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
    dataSource: generateData(100),
    height: 400,
    rootValue: -1,
    columnMinWidth: 80,
    columnAutoWidth: true,
    allowColumnResizing: true,
    keyExpr: 'ID',
    parentIdExpr: 'Head_ID',
    showRowLines: true,
    showBorders: true,
    autoExpandAll: true,
    scrolling: {
      mode: 'virtual',
    },
    selection: {
      allowSelectAll: true,
      mode: 'multiple',
    },
    columns: ['Title', 'Full_Name', 'City'],
  });

    // arrange
    const treeList = page.locator('#container');

    // assert
    await page.expect(treeList.isReady())
      .ok();

    // act
    const selectAllCheckBox = new CheckBox(
      treeList.getHeaders().getHeaderRow(0).getHeaderCell(0).getEditor().element,

    await selectAllCheckBox.click();

    await testScreenshot(page, 'T1189118-treelist-select-all-with-virtual-scrolling-1', { element: treeList.element });

    // act
    await treeList.scrollTo(t, { y: 300 });

    await testScreenshot(page, 'T1189118-treelist-select-all-with-virtual-scrolling-2', { element: treeList.element });

    });
});
