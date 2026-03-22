import { test, expect } from '@playwright/test';
import { testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Drawer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  ['overlap', 'shrink', 'push'].forEach((openedStateMode: OpenedStateMode) => {
    const testName = `Drawer, openedStateMode=${openedStateMode}, shading=true`;
    test(testName, async ({ page }) => {

      await createDrawer({
        options: { openedStateMode },
      });


      await testScreenshot(page, `${testName}.png`);

    });
  });

  ['top', 'bottom', 'left', 'right'].forEach((position: Position) => {
    const testName = `Drawer, position=${position}, shading=true`;
    test(testName, async ({ page }) => {

      await createDrawer({
        options: { position },
      });


      await testScreenshot(page, `${testName}.png`);

    });
  });

  test('Drawer hidden', async ({ page }) => {

    await createDrawer({
      createOuterContent: ($container) => {
        ($('<div id="hideDrawerBtn">').appendTo($container) as any).dxButton({
          text: 'Hide Drawer',
          onClick: () => ($(`#${$container.attr('id')} #drawer`) as any).dxDrawer('instance').hide(),
        });
      },
    });

    await page.locator('#container #hideDrawerBtn').click();

    await testScreenshot(page, 'Drawer hidden.png');

    });

  [{
    testCase: 'Menu inside drawer',
    selector: '.dx-menu-item',
    createDrawerContent: ($container: JQuery) => {
      ($('<div id="content">').appendTo($container) as any).dxMenu({
        dataSource: [{ text: 'item1 very long text wider than panel', items: [{ text: 'item1/item1 very long text wider than panel' }, { text: 'item1/item2' }] }],
      });
    },
  }, {
    testCase: 'SelectBox inside drawer',
    selector: '.dx-texteditor-container',
    createDrawerContent: ($container: JQuery) => {
      ($('<div id="content">').appendTo($container) as any).dxSelectBox({
        dataSource: ['item1 very long text wider than panel', 'item2'],
      });
    },
  }, {
    testCase: 'Menu outside drawer',
    selector: '.dx-menu-item',
    createOuterContent: ($container: JQuery) => {
      ($('<div id="content">').appendTo($container) as any).dxMenu({
        dataSource: [{ text: 'item1 very long text wider than panel', items: [{ text: 'item1/item1 very long text wider than panel' }, { text: 'item1/item2' }] }],
      });
    },
  }, {
    testCase: 'SelectBox outside drawer',
    selector: '.dx-texteditor-container',
    createOuterContent: ($container: JQuery) => {
      ($('<div id="content">').appendTo($container) as any).dxSelectBox({
        dataSource: ['item1 very long text wider than panel', 'item2'],
      });
    },
  }].forEach(({
    testCase, createDrawerContent, createOuterContent, selector,
  }) => {
    const testName = `Drawer z-index, ${testCase}, shading=true`;
    test(testName, async ({ page }) => {

      await createDrawer({
        createDrawerContent,
        createOuterContent,
        testInPopup: true,
      });


      await page.locator(`#container #content ${selector}`).click();

      await testScreenshot(page, `${testName}_container.png`);

      await page.locator('#showPopupBtn').click();
      await page.locator(`#popup1_template #content ${selector}`).click();

      await testScreenshot(page, `${testName}_popup.png`);

    });
  });
});
