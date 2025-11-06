import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Item } from 'devextreme/ui/menu.d';
import Menu from 'devextreme-testcafe-models/menu';
import { appendElementTo, setAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`Menu_common`
  .page(url(__dirname, '../../container.html'));

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

['horizontal', 'vertical'].forEach((orientation) => {
  const testName = `Menu delimiter, orientation=${orientation}`;
  test.meta({ browserSize: [500, 500] })(testName, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const menu = new Menu();

    await t
      .click(menu.getItem(2))
      .pressKey('down');

    await testScreenshot(t, takeScreenshot, `${testName}.png`);

    if (orientation === 'horizontal') {
      await t
        .click(menu.getItem(1))
        .pressKey('down');

      await testScreenshot(t, takeScreenshot, `${testName}, wide submenu.png`);
    }

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(() => createWidget(
    'dxMenu',
    {
      items,
      orientation,
    },
    '#container',
  ));
});

['horizontal', 'vertical'].forEach((orientation) => {
  ['bottom', 'right', 'bottom right'].forEach((collision) => {
    const testName = `Menu delimiter ${collision} collision, orientation=${orientation}`;
    test.meta({ browserSize: [515, 515] })(testName, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      const menu = new Menu();

      await t.click(menu.getItem(3));

      await testScreenshot(t, takeScreenshot, `${testName}.png`);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await appendElementTo('#container', 'div', 'menu');
      const additionalStyles = {
        bottom: 'justify-content: start;',
        right: 'align-content: start;',
      };
      await setAttribute('#container', 'style', `width: 500px; height: 500px; display: grid; ${additionalStyles[collision] ?? ''}`);

      await createWidget(
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
    });
  });
});

test.meta({ browserSize: [500, 500] })('Menu delimiter appearance when the Menu is used as a toolbar item', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const menu = new Menu();

  await t.click(menu.getItem(1));

  await testScreenshot(t, takeScreenshot, 'Menu delimiter, menu as toolbar item.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
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

  return createWidget('dxToolbar', {
    items: toolbarItems,
    width: '100%',
  }, '#container');
});
