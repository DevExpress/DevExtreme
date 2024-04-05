import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector, ClientFunction } from 'testcafe';
import { testScreenshot, isMaterialBased } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { Item } from 'devextreme/ui/tabs.d';
import { appendElementTo, setAttribute } from '../../../helpers/domUtils';
import Tabs from 'devextreme-testcafe-models/tabs';

const TAB_CLASS = 'dx-tab';

fixture.disablePageReloads`Tabs_common`
  .page(url(__dirname, '../../container.html'));

test('Tabs nav buttons', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Tabs nav buttons.png', { element: '#tabs' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'tabs');
  await setAttribute('#container', 'style', 'width: 200px; height: 200px; background: #fff000 !important;');

  const dataSource = [
    { text: 'John Heart' },
    { text: 'Marina Thomas' },
    { text: 'Robert Reagan' },
    { text: 'Greta Sims' },
    { text: 'Olivia Peyton' },
    { text: 'Ed Holmes' },
    { text: 'Wally Hobbs' },
    { text: 'Brad Jameson' },
  ] as Item[];

  return createWidget('dxTabs', { dataSource, width: 200, showNavButtons: true }, '#tabs');
});

test('Tabs text-overflow with vertical orientation', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const tabs = new Tabs('#tabs');

  await testScreenshot(t, takeScreenshot, 'Tabs text-overflow.png', { element: '#tabs' });

  await tabs.option({ iconPosition: 'top' } as any);

  await testScreenshot(t, takeScreenshot, 'Tabs text-overflow when iconPosition is top.png', { element: '#tabs' });

  await tabs.option({ height: 300 } as any);

  await testScreenshot(t, takeScreenshot, 'Tabs text-overflow when height is limited.png', { element: '#tabs' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'tabs');
  await setAttribute('#container', 'style', 'width: 600px; height: 400px;');

  const dataSource = [
    { icon: 'user', text: 'John Heart' },
    { icon: 'user', text: 'Marina Elizabeth Thomas Grace Sophia Alexander Benjamin Olivia Nicholas Victoria Michael Emily' },
    { icon: 'user', text: 'Robert Reagan' },
    { icon: 'user', text: 'Greta Sims' },
  ] as Item[];

  const options = {
    dataSource,
    width: 130,
    showNavButtons: true,
    orientation: 'vertical',
  };

  return createWidget('dxTabs', options, '#tabs');
});

test('Tab item width in secondary stylingMode', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Tab item width in secondary stylingMode.png', { element: '#tabs' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'tabs');
  await setAttribute('#container', 'style', 'display: flex; width: 800px; height: 600px;');

  const dataSource = [
    { text: 'user' },
    { text: 'user' },
    { text: 'user' },
    { text: 'user' },
    { text: 'user' },
  ] as Item[];

  return createWidget('dxTabs', { dataSource, width: 'auto', stylingMode: 'secondary' }, '#tabs');
});

[true, false].forEach((rtlEnabled) => {
  ['start', 'top', 'end', 'bottom'].forEach((iconPosition) => {
    test('Tabs icon position', async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await testScreenshot(t, takeScreenshot, `Tabs iconPosition=${iconPosition},rtl=${rtlEnabled}.png`, { element: '#tabs', shouldTestInCompact: true });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await appendElementTo('#container', 'div', 'tabs');
      await setAttribute('#container', 'style', 'width: 800px; height: 600px;');

      const dataSource = [
        { text: 'user', badge: '1' },
        { text: 'comment', icon: 'comment', badge: 'text' },
        { icon: 'user' },
        { icon: 'money' },
      ] as Item[];

      return createWidget('dxTabs', { dataSource, iconPosition, rtlEnabled }, '#tabs');
    });
  });
});

test('Tabs with width: auto in flex container', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Tabs with width auto.png', { element: '#tabs', shouldTestInCompact: true });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'tabs');
  await setAttribute('#container', 'style', 'display: flex; width: 800px;');

  const dataSource = [
    { text: 'ok' },
    { icon: 'comment' },
    { icon: 'user' },
    { icon: 'money' },
    { text: 'ok', icon: 'search' },
    { text: 'alignright', icon: 'alignright' },
  ] as Item[];

  return createWidget('dxTabs', { dataSource, width: 'auto' }, '#tabs');
});

[true, false].forEach((rtlEnabled) => {
  ['primary', 'secondary'].forEach((stylingMode) => {
    test('Tabs icon position', async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await testScreenshot(t, takeScreenshot, `Tabs 1 selected stylingMode=${stylingMode},rtl=${rtlEnabled}.png`, { element: '#tabs' });

      const firstItem = Selector(`.${TAB_CLASS}:nth-child(1)`);

      // TODO: this test is unstable
      // await t.hover(firstItem);
      // eslint-disable-next-line max-len
      // await testScreenshot(t, takeScreenshot, `Tabs 1 selected,hovered stylingMode=${stylingMode},rtl=${rtlEnabled}.png`, { element: '#tabs' });

      await t.dispatchEvent(firstItem, 'mousedown');
      await testScreenshot(t, takeScreenshot, `Tabs 1 selected,active stylingMode=${stylingMode},rtl=${rtlEnabled}.png`, { element: '#tabs' });

      const thirdItem = Selector(`.${TAB_CLASS}:nth-child(3)`);

      // TODO: this test is unstable
      // await t
      //   .dispatchEvent(firstItem, 'mouseup')
      //   .click(firstItem)
      // .hover(thirdItem);
      // eslint-disable-next-line max-len
      // await testScreenshot(t, takeScreenshot, `Tabs 3 not selected,hovered stylingMode=${stylingMode},rtl=${rtlEnabled}.png`, { element: '#tabs' });

      await t.dispatchEvent(thirdItem, 'mousedown');
      await testScreenshot(t, takeScreenshot, `Tabs 3 not selected,active stylingMode=${stylingMode},rtl=${rtlEnabled}.png`, { element: '#tabs' });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await appendElementTo('#container', 'div', 'tabs');
      await setAttribute('#container', 'style', 'width: 800px; height: 600px;');

      const dataSource = [
        { text: 'user' },
        { text: 'comment', icon: 'comment' },
        { icon: 'user' },
        { icon: 'money' },
      ] as Item[];

      const tabsOptions = {
        dataSource,
        stylingMode,
        rtlEnabled,
        selectedItem: dataSource[0],
      };

      return createWidget('dxTabs', tabsOptions, '#tabs');
    });
  });
});

test('Tabs in contrast theme', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  if (!isMaterialBased()) {
    await testScreenshot(t, takeScreenshot, 'Tabs in contrast theme if first tab is focused.png', { element: '#tabs', theme: 'generic.contrast' });
  }

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'tabs');
  await setAttribute('#container', 'style', 'width: 800px; height: 600px;');

  const dataSource = [
    { text: 'user' },
    { text: 'comment', icon: 'comment' },
    { icon: 'user' },
    { icon: 'money' },
  ] as Item[];

  const tabsOptions = {
    dataSource,
    selectedItem: dataSource[0],
  };

  return createWidget('dxTabs', tabsOptions, '#tabs');
});

[true, false].forEach((rtlEnabled) => {
  ['horizontal', 'vertical'].forEach((orientation) => {
    [true, false].forEach((selectOnFocus) => {
      test('Tabs item states', async (t) => {
        const direction = rtlEnabled ? 'left' : 'right';
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
        await testScreenshot(t, takeScreenshot, `Tabs without focus,sOF=${selectOnFocus},orient=${orientation},rtl=${rtlEnabled}.png`, { element: '#tabs' });

        await t.pressKey('tab');
        await testScreenshot(t, takeScreenshot, `Tabs avail focused,sOF=${selectOnFocus},orient=${orientation},rtl=${rtlEnabled}.png`, { element: '#tabs' });

        await t.pressKey(direction);
        await testScreenshot(t, takeScreenshot, `Tabs disab focused,sOF=${selectOnFocus},orient=${orientation},rtl=${rtlEnabled}.png`, { element: '#tabs' });

        const thirdItem = Selector(`.${TAB_CLASS}:nth-child(3)`);
        // const fourthItem = Selector(`.${TAB_CLASS}:nth-child(4)`);

        await t
          .pressKey(direction)
          .dispatchEvent(thirdItem, 'mousedown');

        await testScreenshot(t, takeScreenshot, `Tabs 3item active,sOF=${selectOnFocus},orient=${orientation},rtl=${rtlEnabled}.png`, { element: '#tabs' });

        // TODO: this test is unstable
        // await t
        //   .dispatchEvent(thirdItem, 'mouseup')
        //   .click(thirdItem)
        // .hover(fourthItem);

        // eslint-disable-next-line max-len
        // await testScreenshot(t, takeScreenshot, `Tabs 4item hovered,sOF=${selectOnFocus},orient=${orientation},rtl=${rtlEnabled}.png`, { element: '#tabs' });

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

        await appendElementTo('#container', 'div', 'tabs');
        await setAttribute('#container', 'style', 'width: 500px; height: 600px;');

        const dataSource = [
          { text: 'John Heart' },
          { text: 'Marina Thomas', disabled: true },
          { text: 'Robert Reagan' },
          { text: 'Greta Sims' },
          { text: 'Olivia Peyton' },
          { text: 'Ed Holmes' },
          { text: 'Wally Hobbs' },
          { text: 'Brad Jameson' },
        ] as Item[];

        const tabsOptions = {
          rtlEnabled,
          orientation,
          dataSource,
          selectOnFocus,
          showNavButtons: true,
          width: orientation === 'horizontal' ? 450 : 'auto',
          height: orientation === 'horizontal' ? 'auto' : 250,
          // prevent firing dxinactive event for to avoid failing test
          itemHoldTimeout: 5000,
          useInkRipple: false,
        };

        return createWidget('dxTabs', tabsOptions, '#tabs');
      });
    });
  });
});
