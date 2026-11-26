import type { Position } from 'devextreme/common';
import type { OpenedStateMode } from 'devextreme/ui/drawer';
import { test } from '../../../fixtures';
import { testScreenshot } from '../../../helpers/screenshots';
import { createDrawer } from './drawer.helpers';

test.describe('Drawer', () => {
  test.use({ browserSize: [600, 600] });

  ['overlap', 'shrink', 'push'].forEach((openedStateMode: OpenedStateMode) => {
    const testName = `Drawer, openedStateMode=${openedStateMode}, shading=true`;

    test(testName, async ({ page }) => {
      await createDrawer(page, {
        options: { openedStateMode },
      });

      await testScreenshot(page, `${testName}.png`);
    });
  });

  ['top', 'bottom', 'left', 'right'].forEach((position: Position) => {
    const testName = `Drawer, position=${position}, shading=true`;

    test(testName, async ({ page }) => {
      await createDrawer(page, {
        options: { position },
      });

      await testScreenshot(page, `${testName}.png`);
    });
  });

  test('Drawer hidden', async ({ page }) => {
    await createDrawer(page, {
      createOuterContent: () => ($container) => {
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
    createDrawerContent: () => ($container: JQuery) => {
      ($('<div id="content">').appendTo($container) as any).dxMenu({
        dataSource: [{ text: 'item1 very long text wider than panel', items: [{ text: 'item1/item1 very long text wider than panel' }, { text: 'item1/item2' }] }],
      });
    },
  }, {
    testCase: 'SelectBox inside drawer',
    selector: '.dx-texteditor-container',
    createDrawerContent: () => ($container: JQuery) => {
      ($('<div id="content">').appendTo($container) as any).dxSelectBox({
        dataSource: ['item1 very long text wider than panel', 'item2'],
      });
    },
  }, {
    testCase: 'Menu outside drawer',
    selector: '.dx-menu-item',
    createOuterContent: () => ($container: JQuery) => {
      ($('<div id="content">').appendTo($container) as any).dxMenu({
        dataSource: [{ text: 'item1 very long text wider than panel', items: [{ text: 'item1/item1 very long text wider than panel' }, { text: 'item1/item2' }] }],
      });
    },
  }, {
    testCase: 'SelectBox outside drawer',
    selector: '.dx-texteditor-container',
    createOuterContent: () => ($container: JQuery) => {
      ($('<div id="content">').appendTo($container) as any).dxSelectBox({
        dataSource: ['item1 very long text wider than panel', 'item2'],
      });
    },
  }].forEach(({
    testCase, createDrawerContent, createOuterContent, selector,
  }) => {
    const testName = `Drawer z-index, ${testCase}, shading=true`;

    test(testName, async ({ page }) => {
      await createDrawer(page, {
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
