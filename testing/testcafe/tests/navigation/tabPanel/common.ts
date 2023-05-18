import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import TabPanel from '../../../model/tabPanel';
import { Item } from '../../../../../js/ui/tab_panel.d';

const TABS_RIGHT_NAV_BUTTON_CLASS = 'dx-tabs-nav-button-right';

fixture.disablePageReloads`TabPanel_common`
  .page(url(__dirname, '../../container.html'));

test('TabPanel borders with scrolling', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'TabPanel borders with scrolling.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const dataSource = [
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
  ] as Item[];

  const tabPanelOptions = {
    dataSource,
    itemTemplate: (itemData, itemIndex, itemElement) => {
      ($('<div>').css('marginTop', 10) as any)
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
    width: 300,
    showNavButtons: true,
  };

  return createWidget('dxTabPanel', tabPanelOptions);
});

test('TabPanel borders without scrolling', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'TabPanel borders without scrolling.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const dataSource = [
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
  ] as Item[];

  const tabPanelOptions = {
    dataSource,
    itemTemplate: (itemData, itemIndex, itemElement) => {
      ($('<div>').css('marginTop', 10) as any)
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
    width: 900,
    showNavButtons: true,
  };

  return createWidget('dxTabPanel', tabPanelOptions);
});

[true, false].forEach((rtlEnabled) => {
  test(`TabPanel when its disabled item has focus if rtlEnabled=${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const tabPanel = new TabPanel('#container');
    const direction = rtlEnabled ? 'left' : 'right';

    await testScreenshot(t, takeScreenshot, `TabPanel without focus, rtlEnabled=${rtlEnabled}.png`, { element: '#container' });

    await t.pressKey('tab');
    await testScreenshot(t, takeScreenshot, `TabPanel when its available item has focus, rtlEnabled=${rtlEnabled}.png`, { element: '#container' });

    await t.pressKey(direction);
    await testScreenshot(t, takeScreenshot, `TabPanel when its disabled item has focus, rtlEnabled=${rtlEnabled}.png`, { element: '#container' });

    await t.pressKey(direction);

    const thirdItem = tabPanel.getItem(2);
    const fourthItem = tabPanel.getItem(3);

    await t.dispatchEvent(thirdItem.element, 'mousedown');
    await testScreenshot(t, takeScreenshot, `TabPanel when 3 item has active state, rtlEnabled=${rtlEnabled}.png`, { element: '#container' });

    await t
      .dispatchEvent(thirdItem.element, 'mouseup')
      .hover(fourthItem.element);

    await testScreenshot(t, takeScreenshot, `TabPanel when 4 item has hover state, rtlEnabled=${rtlEnabled}.png`, { element: '#container' });

    await t.hover(Selector(`.${TABS_RIGHT_NAV_BUTTON_CLASS}`));
    await testScreenshot(t, takeScreenshot, `TabPanel when right navigation button has hover state, rtlEnabled=${rtlEnabled}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    const dataSource = [
      {
        title: 'John Heart',
        text: 'John Heart',
      }, {
        title: 'Olivia Peyton',
        text: 'Olivia Peyton',
        disabled: true,
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
    ] as Item[];

    const tabPanelOptions = {
      dataSource,
      height: 120,
      width: 450,
      showNavButtons: true,
      rtlEnabled,
    };

    return createWidget('dxTabPanel', tabPanelOptions);
  });

  test(`Tab borders in TabPanel with expanded tabs if rtlEnabled=${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const direction = rtlEnabled ? 'left' : 'right';

    await t
      .pressKey('tab')
      .pressKey(direction)
      .pressKey(direction);

    await testScreenshot(t, takeScreenshot, `TabPanel with expanded tabs, rtlEnabled=${rtlEnabled}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    const dataSource = [
      {
        title: 'John Heart',
        text: 'John Heart',
      }, {
        title: 'Olivia Peyton',
        text: 'Olivia Peyton',
      }, {
        title: 'Robert Reagan',
        text: 'Robert Reagan',
      },
    ] as Item[];

    const tabPanelOptions = {
      dataSource,
      height: 120,
      width: 450,
      rtlEnabled,
    };

    return createWidget('dxTabPanel', tabPanelOptions);
  });

  test(`Tab borders in TabPanel with long tabs if rtlEnabled=${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const direction = rtlEnabled ? 'left' : 'right';

    await testScreenshot(t, takeScreenshot, `TabPanel with long tabs, rtlEnabled=${rtlEnabled}.png`, { element: '#container' });

    await t
      .pressKey('tab')
      .pressKey(direction)
      .pressKey(direction);

    await testScreenshot(t, takeScreenshot, `TabPanel with long tabs, 2 tab is selected, rtlEnabled=${rtlEnabled}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    const dataSource = [
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
    ] as Item[];

    const tabPanelOptions = {
      dataSource,
      width: 700,
      rtlEnabled,
    };

    return createWidget('dxTabPanel', tabPanelOptions);
  });

  test(`Tab borders in TabPanel with long not stretched tabs if ${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const direction = rtlEnabled ? 'left' : 'right';

    await t
      .pressKey('tab')
      .pressKey(direction);

    await testScreenshot(t, takeScreenshot, `TabPanel with long not stretched tabs, rtlEnabled=${rtlEnabled}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    const dataSource = [
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
    ] as Item[];

    const tabPanelOptions = {
      dataSource,
      width: 720,
      rtlEnabled,
    };

    return createWidget('dxTabPanel', tabPanelOptions);
  });
});
