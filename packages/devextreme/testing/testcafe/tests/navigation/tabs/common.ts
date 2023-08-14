import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { testScreenshot, isMaterial } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { Item } from '../../../../../js/ui/tabs.d';
import { appendElementTo, setAttribute } from '../../../helpers/domUtils';

const TAB_CLASS = 'dx-tab';

fixture.disablePageReloads`Tabs_common`
  .page(url(__dirname, '../../container.html'));

test('Tabs icon alignment', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Tabs items alignment.png', { element: '#tabs', shouldTestInCompact: true });

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

  return createWidget('dxTabs', { dataSource }, '#tabs');
});

test('Tabs in contrast theme', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  if (!isMaterial()) {
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

['horizontal', 'vertical'].forEach((orientation) => {
  [true, false].forEach((selectOnFocus) => {
    test('Tabs item states', async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      await testScreenshot(t, takeScreenshot, `Tabs without focus, selectOnFocus=${selectOnFocus}, orientation=${orientation}.png`, { element: '#tabs' });

      await t.pressKey('tab');
      await testScreenshot(t, takeScreenshot, `Tabs when its available item has focus, selectOnFocus=${selectOnFocus}, orientation=${orientation}.png`, { element: '#tabs' });

      await t.pressKey('right');
      await testScreenshot(t, takeScreenshot, `Tabs when its disabled item has focus, selectOnFocus=${selectOnFocus}, orientation=${orientation}.png`, { element: '#tabs' });

      const thirdItem = Selector(`.${TAB_CLASS}:nth-child(3)`);
      const fourthItem = Selector(`.${TAB_CLASS}:nth-child(4)`);

      await t
        .pressKey('right')
        .dispatchEvent(thirdItem, 'mousedown');

      await testScreenshot(t, takeScreenshot, `Tabs when 3 item has active state selectOnFocus=${selectOnFocus}, orientation=${orientation}.png`, { element: '#tabs' });

      await t
        .dispatchEvent(thirdItem, 'mouseup')
        .click(thirdItem)
        .hover(fourthItem);

      await testScreenshot(t, takeScreenshot, `Tabs when 3 item is selected, 4 item is hovered, selectOnFocus=${selectOnFocus}, orientation=${orientation}.png`, { element: '#tabs' });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
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
        orientation,
        dataSource,
        selectOnFocus,
        showNavButtons: true,
        width: orientation === 'horizontal' ? 450 : 'auto',
        height: orientation === 'horizontal' ? 'auto' : 250,
      };

      return createWidget('dxTabs', tabsOptions, '#tabs');
    });
  });
});
