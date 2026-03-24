import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setAttribute, Menu } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Menu_common', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const items: any[] = [
    { text: 'Category 1' },
    {
      text: 'Category 2',
      items: [
        { text: 'Item long name 2-1' },
        { text: 'Item long name 2-2' },
      ],
    },
    {
      text: 'Category 3',
      items: [
        { text: 'Item 1' },
        { text: 'Item 2' },
      ],
    },
    {
      text: 'Category 4',
      items: [
        { text: 'Item long name 4-1' },
        { text: 'Item long name 4-2' },
      ],
    },
  ];

  ['horizontal', 'vertical'].forEach((orientation) => {
    const testName = `Menu delimiter, orientation=${orientation}`;
    test(testName, async ({ page }) => {
      await createWidget(page,
        'dxMenu',
        {
          items,
          orientation,
        },
        '#container',
      );

      await testScreenshot(page, `${testName}.png`);
    });
  });

  ['horizontal', 'vertical'].forEach((orientation) => {
    ['bottom', 'right', 'bottom right'].forEach((collision) => {
      const testName = `Menu delimiter ${collision} collision, orientation=${orientation}`;
      test(testName, async ({ page }) => {

        await appendElementTo(page, '#container', 'div', 'menu');
        const additionalStyles: Record<string, string> = {
          bottom: 'justify-content: start;',
          right: 'align-content: start;',
        };
        await setAttribute(page, '#container', 'style', `width: 500px; height: 500px; display: grid; ${additionalStyles[collision] ?? ''}`);

        await createWidget(page,
          'dxMenu',
          {
            elementAttr: {
              style: 'align-self: end; justify-self: end;',
            },
            items,
            orientation,
          },
          '#menu',
        );

        const menu = new Menu(page);
        await menu.getItem(3).click();

        await testScreenshot(page, `${testName}.png`);
      });
    });
  });

  test('Menu delimiter appearance when the Menu is used as a toolbar item', async ({ page }) => {

    const toolbarItems = [
      {
        location: 'before',
        widget: 'dxMenu',
        options: {
          items: [{
            text: 'Video Players',
          }, {
            text: 'Televisions',
            items: [{
              id: '2_1',
              text: 'SuperLCD 42',
            }, {
              id: '2_2',
              text: 'SuperLED 42',
            }],
          }],
        },
      }, {
        location: 'before',
        widget: 'dxButton',
        options: {
          icon: 'undo',
        },
      }, {
        location: 'before',
        widget: 'dxButton',
        options: {
          icon: 'redo',
        },
      },
    ];

    await createWidget(page, 'dxToolbar', {
      items: toolbarItems,
      width: '100%',
    }, '#container');

    const menu = new Menu(page);
    await menu.getItem(1).click();

    await testScreenshot(page, 'Menu delimiter, menu as toolbar item.png');
  });
});
