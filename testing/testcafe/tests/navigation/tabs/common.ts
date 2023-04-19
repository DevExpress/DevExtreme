import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { testScreenshot } from '../../../helpers/themeUtils';
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

[true, false].forEach((selectOnFocus) => {
  test('Tabs item states', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `Tabs without focus and selectOnFocus=${selectOnFocus}.png`, { element: '#tabs' });

    await t.pressKey('tab');
    await testScreenshot(t, takeScreenshot, `Tabs when its available item has focus and selectOnFocus=${selectOnFocus}.png`, { element: '#tabs' });

    await t.pressKey('right');
    await testScreenshot(t, takeScreenshot, `Tabs when its disabled item has focus and selectOnFocus=${selectOnFocus}.png`, { element: '#tabs' });

    const thirdItem = Selector(`.${TAB_CLASS}:nth-child(3)`);
    const fourthItem = Selector(`.${TAB_CLASS}:nth-child(4)`);

    await t
      .pressKey('right')
      .dispatchEvent(thirdItem, 'mousedown');

    await testScreenshot(t, takeScreenshot, `Tabs when 3 item has active state and selectOnFocus=${selectOnFocus}.png`, { element: '#tabs' });

    await t
      .dispatchEvent(thirdItem, 'mouseup')
      .click(thirdItem)
      .hover(fourthItem);

    await testScreenshot(t, takeScreenshot, `Tabs when 3 item is selected, 4 item is hovered and selectOnFocus=${selectOnFocus}.png`, { element: '#tabs' });

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
    ] as Item[];

    const tabsOptions = {
      dataSource,
      selectOnFocus,
      width: 450,
      showNavButtons: true,
    };

    return createWidget('dxTabs', tabsOptions, '#tabs');
  });
});
