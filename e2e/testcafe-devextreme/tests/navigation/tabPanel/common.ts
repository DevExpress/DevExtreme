import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import {
  // Selector,
  ClientFunction,
} from 'testcafe';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import TabPanel from '../../../model/tabPanel';
import { Item } from 'devextreme/ui/tab_panel.d';
import { setAttribute, appendElementTo } from '../../../helpers/domUtils';

// const TABS_RIGHT_NAV_BUTTON_CLASS = 'dx-tabs-nav-button-right';
// const TABS_LEFT_NAV_BUTTON_CLASS = 'dx-tabs-nav-button-left';

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

['primary', 'secondary'].forEach((stylingMode) => {
  test(`Tab item width in a bounded container, stylingMode=${stylingMode}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `Tab item width in a bounded container, stylingMode=${stylingMode}.png`, { element: '#tabpanel' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await appendElementTo('#container', 'div', 'tabpanel');
    await setAttribute('#container', 'style', 'width: 200px;');

    const dataSource = [
      { title: 'John Heart', text: 'John Heart' },
      { title: 'Marina Thomas', text: 'Marina Thomas' },
      { title: 'Robert Reagan', text: 'Robert Reagan' },
      { title: 'Olivia Peyton', text: 'Olivia Peyton' },
      { title: 'Ed Holmes', text: 'Ed Holmes' },
      { title: 'Wally Hobbs', text: 'Wally Hobbs' },
      { title: 'Brad Jameson', text: 'Brad Jameson' },
    ] as Item[];

    const options = {
      dataSource,
      height: 250,
    };

    return createWidget('dxTabPanel', options, '#tabpanel');
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
  const dataSource = [
    { icon: 'user', text: 'John Heart', title: 'John Heart' },
    { icon: 'user', text: 'Marina Elizabeth Thomas Grace Sophia', title: 'Mariya Elizabeth Thomas Grace Sophia' },
    { icon: 'user', text: 'Robert Reagan', title: 'Robert Reagan' },
    { icon: 'user', text: 'Greta Sims', title: 'Greta Sims' },
  ] as Item[];

  const options = {
    dataSource,
    width: 600,
    height: 250,
    tabsPosition: 'left',
    showNavButtons: true,
  };

  return createWidget('dxTabPanel', options);
});

test('TabPanel focus borders after change selectedIndex in runtime', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const tabPanel = new TabPanel('#container');

  await tabPanel.option({ selectedIndex: 1 } as any);

  await testScreenshot(t, takeScreenshot, 'TabPanel focus borders.png', { element: '#container' });

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
    height: 120,
    width: 300,
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

    await testScreenshot(t, takeScreenshot, `TabPanel without focus,rtl=${rtlEnabled}.png`, { element: '#container' });

    await t.pressKey('tab');
    await testScreenshot(t, takeScreenshot, `TabPanel available item focused,rtl=${rtlEnabled}.png`, { element: '#container' });

    await t.pressKey(direction);
    await testScreenshot(t, takeScreenshot, `TabPanel disabled item focused,rtl=${rtlEnabled}.png`, { element: '#container' });

    await t.pressKey(direction);

    // const thirdItem = tabPanel.getItem(2);
    const firstItem = tabPanel.getItem(0);

    await t.dispatchEvent(firstItem.element, 'mousedown');
    await testScreenshot(t, takeScreenshot, `TabPanel 1 item active,rtl=${rtlEnabled}.png`, { element: '#container' });

    // TODO: this test is unstable
    // await t
    //   .dispatchEvent(thirdItem.element, 'mouseup')
    //   .click(Selector('body'), { offsetY: -50 })
    //   .hover(firstItem.element);

    // eslint-disable-next-line max-len
    // await testScreenshot(t, takeScreenshot, `TabPanel 1 item hovered,rtl=${rtlEnabled}.png`, { element: '#container' });

    // TODO: this test is unstable
    // await t
    //   .click(Selector('body'), { offsetY: -50 })
    // eslint-disable-next-line max-len
    //   .hover(Selector(`.${rtlEnabled ? TABS_LEFT_NAV_BUTTON_CLASS : TABS_RIGHT_NAV_BUTTON_CLASS}`));

    // eslint-disable-next-line max-len
    // await testScreenshot(t, takeScreenshot, `TabPanel right navigation button hovered, rtl=${rtlEnabled}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await ClientFunction(() => {
      (window as any).DevExpress.ui.dxTabs.defaultOptions({
        options: {
          useInkRipple: false,
        },
      });
    })();

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
      // prevent firing dxinactive event for to avoid failing test
      itemHoldTimeout: 5000,
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

    await testScreenshot(t, takeScreenshot, `TabPanel with expanded tabs,rtl=${rtlEnabled}.png`, { element: '#container' });

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

    await testScreenshot(t, takeScreenshot, `TabPanel long tabs,rtl=${rtlEnabled}.png`, { element: '#container' });

    await t
      .pressKey('tab')
      .pressKey(direction)
      .pressKey(direction);

    await testScreenshot(t, takeScreenshot, `TabPanel long tabs,2 tab selected,rtl=${rtlEnabled}.png`, { element: '#container' });

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

    await testScreenshot(t, takeScreenshot, `TabPanel long not stretched tabs,rtl=${rtlEnabled}.png`, { element: '#container' });

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

['right', 'bottom', 'left'].forEach((tabsPosition) => {
  test(`TabPanel with tabsPosition=${tabsPosition}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const tabPanel = new TabPanel('#container');

    await testScreenshot(t, takeScreenshot, `TabPanel without focus,tabsPosition=${tabsPosition}.png`, { element: '#container' });

    await t.pressKey('tab');
    await testScreenshot(t, takeScreenshot, `TabPanel available item focused,tabsPosition=${tabsPosition}.png`, { element: '#container' });

    await t.pressKey('right');
    await testScreenshot(t, takeScreenshot, `TabPanel disabled item focused,tabsPosition=${tabsPosition}.png`, { element: '#container' });

    await t.pressKey('right');

    // const thirdItem = tabPanel.getItem(2);
    const firstItem = tabPanel.getItem(0);

    await t.dispatchEvent(firstItem.element, 'mousedown');
    await testScreenshot(t, takeScreenshot, `TabPanel 1 item active,tabsPosition=${tabsPosition}.png`, { element: '#container' });

    // TODO: this test is unstable
    // await t
    //   .dispatchEvent(thirdItem.element, 'mouseup')
    //   .click(Selector('body'), { offsetY: -50 })
    //   .hover(firstItem.element);

    // eslint-disable-next-line max-len
    // await testScreenshot(t, takeScreenshot, `TabPanel 1 item hovered,tabsPosition=${tabsPosition}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await ClientFunction(() => {
      (window as any).DevExpress.ui.dxTabs.defaultOptions({
        options: {
          useInkRipple: false,
        },
      });
    })();

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
      height: 250,
      width: 450,
      tabsPosition,
      // prevent firing dxinactive event for to avoid failing test
      itemHoldTimeout: 5000,
    };

    return createWidget('dxTabPanel', tabPanelOptions);
  });
});

[true, false].forEach((rtlEnabled) => {
  ['start', 'top', 'end', 'bottom'].forEach((iconPosition) => {
    test('TabPanel icon position', async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await testScreenshot(t, takeScreenshot, `TabPanel iconPosition=${iconPosition},rtl=${rtlEnabled}.png`, { element: '#container' });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      const dataSource = [
        {
          title: 'John Heart',
          text: 'John Heart',
          icon: 'plus',
        }, {
          title: 'Olivia Peyton',
          text: 'Olivia Peyton',
          disabled: true,
          icon: 'plus',
        }, {
          title: 'Robert Reagan',
          text: 'Robert Reagan',
          icon: 'plus',
        }, {
          title: 'Greta Sims',
          text: 'Greta Sims',
          icon: 'plus',
        }, {
          title: 'Olivia Peyton',
          text: 'Olivia Peyton',
          icon: 'plus',
        },
      ] as Item[];

      const tabPanelOptions = {
        dataSource,
        height: 250,
        width: 450,
        iconPosition,
        rtlEnabled,
        // prevent firing dxinactive event for to avoid failing test
        itemHoldTimeout: 5000,
      };

      return createWidget('dxTabPanel', tabPanelOptions);
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
  await ClientFunction(() => {
    (window as any).DevExpress.ui.dxTabs.defaultOptions({
      options: {
        useInkRipple: false,
      },
    });
  })();

  const dataSource = [
    { text: 'ok', title: 'ok' },
    { icon: 'comment' },
    { icon: 'user' },
    { icon: 'money' },
    { text: 'ok', title: 'ok', icon: 'search' },
    { text: 'alignright', title: 'alignright', icon: 'alignright' },
  ] as Item[];

  const tabPanelOptions = {
    dataSource,
    height: 250,
    width: 900,
  };

  return createWidget('dxTabPanel', tabPanelOptions);
});
