import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('TreeList - Markup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const tasksT1223168 = [{
    Task_ID: 1,
    Task_Subject: 'Plans 2015',
    Task_Parent_ID: 0,
  }, {
    Task_ID: 2,
    Task_Subject: 'Health Insurance',
    Task_Parent_ID: 1,
  }, {
    Task_ID: 3,
    Task_Subject: 'Training',
    Task_Parent_ID: 2,
  }];

  test('TreeList - Expand/collapse buttons are too close to column borders if the first column is a boolean column (T1223168)', async ({ page }) => {

    await createWidget(page, 'dxTreeList', {
      dataSource: tasksT1223168,
      keyExpr: 'Task_ID',
      parentIdExpr: 'Task_Parent_ID',
      autoExpandAll: true,
      wordWrapEnabled: true,
      showBorders: true,
      columns: [{
        dataField: 'test',
        dataType: 'boolean',
      }, 'Task_Subject'],
      showColumnLines: true,
      rowDragging: {
        allowReordering: true,
      },
    });

    const treeList = page.locator('#container');

    await testScreenshot(page, 'T1223168-expandable', { element: treeList });

    });

  // T1221037
  test('TreeList screenshot when the first cell has a template', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
    dataSource: [{
      ID: 1,
      Head_ID: 0,
      Full_Name: 'John Heart',
      Prefix: 'Mr.',
      Title: 'CEO',
      City: 'Los Angeles',
      State: 'California',
      Email: 'jheart@dx-email.com',
      Skype: 'jheart_DX_skype',
      Mobile_Phone: '(213) 555-9392',
      Birth_Date: '1964-03-16',
      Hire_Date: '1995-01-15',
    }, {
      ID: 2,
      Head_ID: 1,
      Full_Name: 'Arthur Miller',
      Prefix: 'Mr.',
      Title: 'CTO',
      City: 'Denver',
      State: 'Colorado',
      Email: 'arthurm@dx-email.com',
      Skype: 'arthurm_DX_skype',
      Mobile_Phone: '(310) 555-8583',
      Birth_Date: '1972-07-11',
      Hire_Date: '2007-12-18',
    }, {
      ID: 3,
      Head_ID: 2,
      Full_Name: 'Brett Wade',
      Prefix: 'Mr.',
      Title: 'IT Manager',
      City: 'Reno',
      State: 'Nevada',
      Email: 'brettw@dx-email.com',
      Skype: 'brettw_DX_skype',
      Mobile_Phone: '(626) 555-0358',
      Birth_Date: '1968-12-01',
      Hire_Date: '2009-03-06',
    }, {
      ID: 4,
      Head_ID: 3,
      Full_Name: 'Morgan Kennedy',
      Prefix: 'Mrs.',
      Title: 'Graphic Designer',
      City: 'San Fernando Valley',
      State: 'California',
      Email: 'morgank@dx-email.com',
      Skype: 'morgank_DX_skype',
      Mobile_Phone: '(818) 555-8238',
      Birth_Date: '1984-07-17',
      Hire_Date: '2012-01-11',
    }, {
      ID: 5,
      Head_ID: 4,
      Full_Name: 'Violet Bailey',
      Prefix: 'Ms.',
      Title: 'Jr Graphic Designer',
      City: 'La Canada',
      State: 'California',
      Email: 'violetb@dx-email.com',
      Skype: 'violetb_DX_skype',
      Mobile_Phone: '(818) 555-2478',
      Birth_Date: '1985-06-10',
      Hire_Date: '2012-01-19',
    }],
    keyExpr: 'ID',
    parentIdExpr: 'Head_ID',
    columnAutoWidth: true,
    width: 770,
    columns: [{
      dataField: 'Title',
      caption: 'Position',
      cellTemplate(_, cellInfo) {
        return $('<div>').append(
          $('<span>').text(cellInfo.data.Title),
        );
      },
    }, 'Full_Name', 'City', 'State', {
      dataField: 'Hire_Date',
      dataType: 'date',
    }],
    showRowLines: true,
    showBorders: true,
    expandedRowKeys: [1, 2, 3, 4],
  });

    const treeList = page.locator('#container');

    await testScreenshot(page, 'T1221037-cell-with-template', { element: treeList });

    });

  // T1291705
  test('The shading should alternate correctly after expanding the node when repaintChangesOnly is enabled', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
    dataSource: [
      { id: 1, parentId: 0, text: 'item 1' },
      { id: 2, parentId: 0, text: 'item 2' },
      { id: 3, parentId: 2, text: 'item 3' },
      { id: 4, parentId: 0, text: 'item 4' },
      { id: 5, parentId: 4, text: 'item 5' },
      { id: 6, parentId: 0, text: 'item 6' },
    ],
    keyExpr: 'id',
    parentIdExpr: 'parentId',
    rowAlternationEnabled: true,
    repaintChangesOnly: true,
  });

    const treeList = page.locator('#container');

    await page.evaluate(() => ($('#container') as any).dxTreeList('instance').expandRow(4));
    await page.evaluate(() => ($('#container') as any).dxTreeList('instance').expandRow(2));

    await testScreenshot(page, 'T1291705-row-alternation-after-expanding-node-when-repaintChangesOnly=true', { element: treeList });

    });

  test('The shading should alternate correctly after expanding the node when repaintChangesOnly and old fixed columns are enabled', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
    dataSource: [
      { id: 1, parentId: 0, text: 'item 1' },
      { id: 2, parentId: 0, text: 'item 2' },
      { id: 3, parentId: 2, text: 'item 3' },
      { id: 4, parentId: 0, text: 'item 4' },
      { id: 5, parentId: 4, text: 'item 5' },
      { id: 6, parentId: 0, text: 'item 6' },
    ],
    keyExpr: 'id',
    parentIdExpr: 'parentId',
    rowAlternationEnabled: true,
    repaintChangesOnly: true,
    columnFixing: {
      legacyMode: true,
    },
    columns: [{ dataField: 'id', fixed: true }, 'text'],
  });

    const treeList = page.locator('#container');

    await page.evaluate(() => ($('#container') as any).dxTreeList('instance').expandRow(4));
    await page.evaluate(() => ($('#container') as any).dxTreeList('instance').expandRow(2));

    await testScreenshot(page, 'T1291705-row-alternation-after-expanding-node-when-there-is-fixed-column-and-repaintChangesOnly=true', { element: treeList });

    });

  ['single', 'multiple'].forEach((selectionMode) => {
    ['single-line', 'multiple-line'].forEach((contentType) => {
      [false, true].forEach((rtlEnabled) => {
        const testFn = (selectionMode === 'multiple' && contentType === 'multiple-line') ? test.skip : test;
        testFn(
          `Markup should be correct [T1291914 & T1294907]:selection=${selectionMode},content=${contentType},rtl=${rtlEnabled}`,
          async ({ page }) => {
            const treeList = page.locator('#container');

            await createWidget(page, 'dxTreeList', {
            dataSource: [
              {
                id: 1, parentId: 0, first: 'Alice', last: 'Blue', age: 30, position: 'CEO',
              },
              {
                id: 2, parentId: 1, first: 'Bob', last: 'Brown', age: 25, position: 'CTO',
              },
              {
                id: 3, parentId: 1, first: 'Charlie', last: 'Green', age: 28, position: 'CFO',
              },
              {
                id: 4, parentId: 1, first: 'David', last: 'White', age: 22, position: 'Developer',
              },
              {
                id: 5, parentId: 3, first: 'Eve', last: 'Black', age: 26, position: 'Designer',
              },
            ],
            keyExpr: 'id',
            parentIdExpr: 'parentId',
            expandedRowKeys: [1, 2],
            columns: [
              {
                dataField: 'first',
                cellTemplate: contentType === 'single-line'
                  ? undefined
                  : () => {
                    const div = document.createElement('div');
                    div.innerText = 'Long text that should wrap into multiple lines. Long text that should wrap into multiple lines.';
                    div.style.whiteSpace = 'break-spaces';

                    return div;
                  },
              },
              'last',
              'age',
              'position',
            ],
            rtlEnabled,
            selection: {
              mode: selectionMode,
            },
            selectedRowKeys: selectionMode === 'single' ? [3] : [3, 4],
          });

            await testScreenshot(page, `markup-selection=${selectionMode}-rtl=${rtlEnabled}-content=${contentType}`, { element: treeList });
          },
        );
      });
    });
  });
});
