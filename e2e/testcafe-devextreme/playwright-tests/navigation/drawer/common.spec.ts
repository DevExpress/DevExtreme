import { test, expect } from '@playwright/test';
import { testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

type OpenedStateMode = 'overlap' | 'shrink' | 'push';
type Position = 'top' | 'bottom' | 'left' | 'right';

async function createDrawer(page: any, config: {
  options?: Record<string, unknown>;
  createDrawerContent?: ($container: JQuery) => void;
  createOuterContent?: ($container: JQuery) => void;
  testInPopup?: boolean;
} = {}) {
  const {
    options = {},
    createDrawerContent,
    createOuterContent,
    testInPopup = false,
  } = config;

  const drawerContentStr = createDrawerContent?.toString();
  const outerContentStr = createOuterContent?.toString();

  await page.evaluate(({
    opts, drawerContentFn, outerContentFn, inPopup,
  }: { opts: Record<string, unknown>; drawerContentFn?: string; outerContentFn?: string; inPopup: boolean }) => {
    const createDrawerContentFn = drawerContentFn
      ? (new Function('return ' + drawerContentFn))() as ($container: JQuery) => void
      : undefined;
    const createOuterContentFn = outerContentFn
      ? (new Function('return ' + outerContentFn))() as ($container: JQuery) => void
      : undefined;

    const createDrawerInt = ($container: JQuery) => {
      if (createOuterContentFn) {
        createOuterContentFn($container);
      }

      const $drawer = $('<div id="drawer">');
      const $templateView = $('<div style="background-color: aquamarine; height: 100%;">').appendTo($drawer);

      $('<div id="inner">')
        .text('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Penatibus et magnis dis parturient. Eget dolor morbi non arcu risus. Tristique magna sit amet purus gravida quis blandit. Auctor urna nunc id cursus metus aliquam eleifend mi in.')
        .appendTo($templateView);

      ($drawer.appendTo($container) as any).dxDrawer({
        opened: true,
        shading: true,
        height: 400,
        template: () => {
          const isTopOrBottom = opts.position === 'top' || opts.position === 'bottom';
          const cssSizeProperty = isTopOrBottom ? 'width' : 'height';

          const $result = $('<div>')
            .css('background-color', 'aqua')
            .css(cssSizeProperty, '100%');

          if (isTopOrBottom) {
            $result.height('100px');
          } else {
            $result.width('200px');
          }

          if (createDrawerContentFn) {
            createDrawerContentFn($result);
          } else {
            $('<div>').text('Drawer Content').appendTo($result);
          }

          return $result;
        },
        ...opts,
      });
    };

    if (inPopup) {
      ($('<div id="showPopupBtn">').appendTo($('#container')) as any).dxButton({
        text: 'Show Popup',
        onClick: () => ($('#popup1') as any).dxPopup('instance').show(),
      });

      ($('<div id="popup1">').appendTo($('#container')) as any).dxPopup({
        position: 'top',
        height: 600,
        showTitle: false,
        contentTemplate: () => {
          const $popupTemplate = $('<div id="popup1_template">').css('background-color', 'blanchedalmond').css('height', '100%');
          createDrawerInt($popupTemplate);
          return $popupTemplate;
        },
      });
    }

    createDrawerInt($('#container'));
  }, {
    opts: options,
    drawerContentFn: drawerContentStr,
    outerContentFn: outerContentStr,
    inPopup: testInPopup,
  });
}

test.describe('Drawer', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 600 });
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

      await createDrawer(page, {
        createDrawerContent,
        createOuterContent,
        testInPopup: true,
      });


      await page.locator(`#container #content ${selector}`).click();

      await testScreenshot(page, `${testName}_container.png`, { maxDiffPixelRatio: 0.25 });

      await page.locator('#showPopupBtn').click();
      await page.locator(`#popup1_template #content ${selector}`).click();

      await testScreenshot(page, `${testName}_popup.png`, { maxDiffPixelRatio: 0.25 });

    });
  });
});
