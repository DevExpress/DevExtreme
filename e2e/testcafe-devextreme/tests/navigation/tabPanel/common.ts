import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import {
  Selector,
  ClientFunction,
} from 'testcafe';
import TabPanel from 'devextreme-testcafe-models/tabPanel';
import { Item } from 'devextreme/ui/tab_panel.d';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { setAttribute, appendElementTo, insertStylesheetRulesToPage } from '../../../helpers/domUtils';

const TABS_RIGHT_NAV_BUTTON_CLASS = 'dx-tabs-nav-button-right';
const TABS_LEFT_NAV_BUTTON_CLASS = 'dx-tabs-nav-button-left';

fixture.disablePageReloads`TabPanel_common`
  .page(url(__dirname, '../../container.html'));

['with scrolling', 'without scrolling'].forEach((mode) => {
  const testName = `TabPanel borders ${mode}`;
  test(testName, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `${testName}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    const dataSource: Item[] = [
      {
        title: 'John Heart',
        text: 'John Heart',
      }, {
        title: 'Olivia Peyton',
        text: 'Olivia Peyton',
      }, {
        title: 'Robert Reagan',
        text: 'Robert Reagan',
      }, {
        title: 'Greta Sims',
        text: 'Greta Sims',
      }, {
        title: 'Olivia Peyton',
        text: 'Olivia Peyton',
      },
    ];

    const tabPanelOptions = {
      dataSource,
      itemTemplate: (_, __, itemElement) => {
        ($('<div>').css('marginTop', '10px') as any)
          .dxTabs({
            items: [
              {
                title: 'John Heart',
                text: 'John Heart',
              }, {
                title: 'Olivia Peyton',
                text: 'Olivia Peyton',
              }, {
                title: 'Robert Reagan',
                text: 'Robert Reagan',
              }, {
                title: 'Greta Sims',
                text: 'Greta Sims',
              }, {
                title: 'Olivia Peyton',
                text: 'Olivia Peyton',
              },
            ],
            width: 300,
            showNavButtons: true,
          })
          .appendTo(itemElement);
      },
      height: 120,
      width: mode === 'with scrolling' ? 300 : 900,
      showNavButtons: true,
    };

    return createWidget('dxTabPanel', tabPanelOptions);
  });
});

test('TabPanel text-overflow with tabsPosition left', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'TabPanel text-overflow when tabsPosition is left.png', { element: '#container' });

  await setAttribute('.dx-tabs-wrapper', 'style', 'max-width: 130px;');

  await testScreenshot(t, takeScreenshot, 'TabPanel text-overflow when tabs wrapper width is limited.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const dataSource: Item[] = [
    { icon: 'user', text: 'John Heart', title: 'John Heart' },
    { icon: 'user', text: 'Marina Elizabeth Thomas Grace Sophia', title: 'Mariya Elizabeth Thomas Grace Sophia' },
    { icon: 'user', text: 'Robert Reagan', title: 'Robert Reagan' },
    { icon: 'user', text: 'Greta Sims', title: 'Greta Sims' },
  ];

  return createWidget('dxTabPanel', {
    dataSource,
    width: 600,
    height: 250,
    tabsPosition: 'left',
    showNavButtons: true,
  });
});

test('TabPanel focus borders after change selectedIndex in runtime', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const tabPanel = new TabPanel('#container');
  await tabPanel.option('selectedIndex', 1);

  await testScreenshot(t, takeScreenshot, 'TabPanel focus borders.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const dataSource: Item[] = [
    {
      title: 'John Heart',
      text: 'John Heart',
    }, {
      title: 'Olivia Peyton',
      text: 'Olivia Peyton',
    }, {
      title: 'Robert Reagan',
      text: 'Robert Reagan',
    }, {
      title: 'Greta Sims',
      text: 'Greta Sims',
    }, {
      title: 'Olivia Peyton',
      text: 'Olivia Peyton',
    },
  ];

  return createWidget('dxTabPanel', {
    dataSource,
    height: 120,
    width: 300,
  });
});

test('TabPanel navigation buttons hover', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.click('body', {
    offsetX: -10,
    offsetY: -10,
  });

  const rightNavButton = Selector(`.${TABS_RIGHT_NAV_BUTTON_CLASS}`);
  await t
    .click(rightNavButton)
    .hover(rightNavButton);

  await testScreenshot(t, takeScreenshot, 'TabPanel right navigation button hovered.png', { element: '#container' });

  const leftNavButton = Selector(`.${TABS_LEFT_NAV_BUTTON_CLASS}`);
  await t.hover(leftNavButton);

  await testScreenshot(t, takeScreenshot, 'TabPanel left navigation button hovered.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const dataSource: Item[] = [
    {
      title: 'John Heart',
      text: 'John Heart',
    }, {
      title: 'Olivia Peyton',
      text: 'Olivia Peyton',
    }, {
      title: 'Robert Reagan',
      text: 'Robert Reagan',
    }, {
      title: 'Greta Sims',
      text: 'Greta Sims',
    }, {
      title: 'Olivia Peyton',
      text: 'Olivia Peyton',
    },
  ];

  const tabPanelOptions = {
    dataSource,
    height: 120,
    width: 400,
    showNavButtons: true,
    selectedIndex: 2,
    useInkRipple: false,
  };

  return createWidget('dxTabPanel', tabPanelOptions);
});

['top', 'right', 'bottom', 'left'].forEach((tabsPosition) => {
  const testName = `TabPanel without focus,tabsPosition=${tabsPosition}`;
  test(testName, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.click('body', {
      offsetX: -10,
      offsetY: -10,
    });

    await testScreenshot(t, takeScreenshot, `${testName}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await appendElementTo('#container', 'div', 'tabpanel');
    await appendElementTo('#container', 'div', 'tabpanel-rtl');
    await setAttribute('#container', 'style', 'display: flex; gap: 40px; flex-direction: column; width: fit-content;');

    const dataSource: Item[] = [
      {
        title: 'John Heart',
        text: 'John Heart',
      }, {
        title: 'Olivia Peyton',
        text: 'Olivia Peyton',
      }, {
        title: 'Robert Reagan',
        text: 'Robert Reagan',
      }, {
        title: 'Greta Sims',
        text: 'Greta Sims',
      }, {
        title: 'Olivia Peyton',
        text: 'Olivia Peyton',
      },
    ];

    const tabPanelOptions = {
      dataSource,
      height: 250,
      width: 450,
      tabsPosition,
      useInkRipple: false,
    };

    await createWidget('dxTabPanel', tabPanelOptions, '#tabpanel');
    return createWidget('dxTabPanel', { ...tabPanelOptions, rtlEnabled: true }, '#tabpanel-rtl');
  });
});

test('TabPanel item focus when clicking on multiview', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const tabPanel = new TabPanel('#container');
  await t.click(tabPanel.multiView.element);
  await testScreenshot(t, takeScreenshot, 'TabPanel item focus when clicking on multiview.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const dataSource: Item[] = [
    {
      title: 'John Heart',
      text: 'John Heart',
    }, {
      title: 'Olivia Peyton',
      text: 'Olivia Peyton',
    }, {
      title: 'Robert Reagan',
      text: 'Robert Reagan',
    }, {
      title: 'Greta Sims',
      text: 'Greta Sims',
    }, {
      title: 'Olivia Peyton',
      text: 'Olivia Peyton',
    },
  ];

  return createWidget('dxTabPanel', {
    dataSource,
    height: 250,
    width: 450,
    useInkRipple: false,
  });
});

const positions = ['top', 'left', 'right', 'bottom'];

positions.forEach((tabsPosition) => {
  test(`TabPanel border appearance when it placed inside the content of TabPanel with=${tabsPosition}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `Nested TabPanel borders appearance,tabsPos=${tabsPosition}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await insertStylesheetRulesToPage('.dx-tabpanel { margin: 10px }');

    const dataSource: Item[] = [
      {
        title: 'John Heart',
        text: 'John Heart',
      }, {
        title: 'Olivia Peyton',
        text: 'Olivia Peyton',
      },
    ];

    return createWidget('dxTabPanel', {
      dataSource,
      height: 700,
      width: 500,
      tabsPosition,
      selectedIndex: 1,
      deferRendering: true,
      itemTemplate: ClientFunction(() => {
        const $container = $('<div>');

        positions.forEach((position) => {
          const $tabPanel = ($('<div>') as any).dxTabPanel({
            height: 120,
            tabsPosition: position,
            dataSource,
          });

          $container.append($tabPanel);

          $container.append($('<hr>'));
        });

        return $container;
      }, {
        dependencies: { dataSource, positions },
      }),
    });
  });
});

test('TabPanel tabs min-width', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'TabPanel tabs min-width.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const dataSource: Item[] = [
    { text: 'ok', title: 'ok' },
    { icon: 'comment' },
    { icon: 'user' },
    { icon: 'money' },
    { text: 'ok', title: 'ok', icon: 'search' },
    { text: 'alignright', title: 'alignright', icon: 'alignright' },
  ];

  return createWidget('dxTabPanel', {
    dataSource,
    height: 250,
    width: 900,
    useInkRipple: false,
  });
});

['left', 'right'].forEach((tabsPosition) => {
  test('TabPanel should be shown correctly even if there is only one tab', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `TabPanel with single tab, tabPosition=${tabsPosition}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    const dataSource: Item[] = [
      {
        title: 'John Heart',
        text: 'John Heart',
      },
    ];

    return createWidget('dxTabPanel', {
      dataSource,
      height: 120,
      width: 300,
      tabsPosition,
    });
  });
});
