import type { Item } from 'devextreme/ui/menu';
import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setAttribute } from '../../../helpers/domUtils';
import { scrollIntoView } from '../../../helpers/dragUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import Menu from '../../../models/menu';

const items: Item[] = [
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

test.describe('Menu_common', () => {
  test.describe(() => {
    test.use({ browserSize: [500, 500] });

    ['horizontal', 'vertical'].forEach((orientation) => {
      const testName = `Menu delimiter, orientation=${orientation}`;

      test(testName, async ({ page }) => {
        await createWidget(page, 'dxMenu', {
          items,
          orientation,
        }, '#container');

        const menu = new Menu(page);

        await menu.getItem(2).click();
        await page.keyboard.press('ArrowDown');

        await testScreenshot(page, `${testName}.png`);

        if (orientation === 'horizontal') {
          await menu.getItem(1).click();
          await page.keyboard.press('ArrowDown');

          await testScreenshot(page, `${testName}, wide submenu.png`);
        }
      });
    });
  });

  test.describe(() => {
    test.use({ browserSize: [515, 515] });

    ['horizontal', 'vertical'].forEach((orientation) => {
      ['bottom', 'right', 'bottom right'].forEach((collision) => {
        const testName = `Menu delimiter ${collision} collision, orientation=${orientation}`;

        test(testName, async ({ page }) => {
          await appendElementTo(page, '#container', 'div', 'menu');
          const additionalStyles = {
            bottom: 'justify-content: start;',
            right: 'align-content: start;',
          };
          await setAttribute(page, '#container', 'style', `width: 500px; height: 500px; display: grid; ${additionalStyles[collision] ?? ''}`);

          await createWidget(page, 'dxMenu', {
            elementAttr: {
              style: 'align-self: end; justify-self: end;',
            },
            items,
            orientation,
          }, '#menu');

          const menu = new Menu(page);
          const item = menu.getItem(3);

          // The page overflows the window. TestCafe scrolled the whole item into view before the
          // click; Playwright scrolls only to the click point, so the focus scrolls the page
          // afterward, and the submenu closes on that scroll.
          await scrollIntoView(item);
          await item.click();

          await testScreenshot(page, `${testName}.png`);
        });
      });
    });
  });

  test.describe(() => {
    test.use({ browserSize: [500, 500] });

    test('Menu delimiter appearance when the Menu is used as a toolbar item', async ({ page }) => {
      await createWidget(page, 'dxToolbar', {
        items: [
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
        ],
        width: '100%',
      }, '#container');

      const menu = new Menu(page);

      await menu.getItem(1).click();

      await testScreenshot(page, 'Menu delimiter, menu as toolbar item.png');
    });
  });
});
