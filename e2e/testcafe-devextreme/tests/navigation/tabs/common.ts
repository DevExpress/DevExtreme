import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { Item } from 'devextreme/ui/tabs.d';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setAttribute } from '../../../helpers/domUtils';

const TAB_CLASS = 'dx-tab';

fixture.disablePageReloads`Tabs_common`
  .page(url(__dirname, '../../container.html'));

test('Tabs background color', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Tabs background color.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'tabs');
  await setAttribute('#container', 'style', 'width: 400px; background: #fff000 !important;');

  const dataSource: Item[] = [
    { text: 'John Heart' },
    { text: 'Marina Thomas' },
    { text: 'Robert Reagan' },
    { text: 'Greta Sims' },
  ];

  await createWidget('dxTabs', { dataSource }, '#tabs');
});

test('Tabs text-overflow with vertical orientation', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Tabs text-overflow.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await setAttribute('#container', 'style', 'display: flex; gap: 40px; width: fit-content;');

  const iconPositions = ['start', 'end', 'top'];
  const dataSource: Item[] = [
    { icon: 'user', text: 'John Heart' },
    { icon: 'user', text: 'Marina Elizabeth Thomas Grace Sophia Alexander Benjamin Olivia Nicholas Victoria Michael Emily' },
    { icon: 'user', text: 'Robert Reagan' },
    { icon: 'user', text: 'Greta Sims' },
  ];

  await Promise.all(iconPositions.map((iconPosition) => appendElementTo('#container', 'div', `tabs-${iconPosition}`)));
  await Promise.all(iconPositions.map((iconPosition) => createWidget('dxTabs', {
    dataSource,
    iconPosition,
    width: 130,
    orientation: 'vertical',
  }, `#tabs-${iconPosition}`)));
});

[true, false].forEach((rtlEnabled) => {
  test('Tabs icon position', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `Tabs icon position,rtl=${rtlEnabled}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await setAttribute('#container', 'style', 'display: flex; flex-direction: column; gap: 20px; width: 800px');

    const iconPositions = ['start', 'end', 'top', 'bottom'];
    const dataSource: Item[] = [
      { text: 'user', badge: '1' },
      { text: 'comment', icon: 'comment', badge: 'text' },
      { icon: 'user' },
      { icon: 'money' },
    ];

    await Promise.all(iconPositions.map((iconPosition) => appendElementTo('#container', 'div', `tabs-${iconPosition}`)));
    await Promise.all(iconPositions.map((iconPosition) => createWidget('dxTabs', {
      dataSource,
      iconPosition,
      rtlEnabled,
    }, `#tabs-${iconPosition}`)));
  });
});

test('Tabs with width: auto in flex container', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Tabs with width auto.png', { element: '#tabs' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'tabs');
  await setAttribute('#container', 'style', 'display: flex; width: 800px;');

  const dataSource: Item[] = [
    { text: 'ok' },
    { icon: 'comment' },
    { icon: 'user' },
    { icon: 'money' },
    { text: 'ok', icon: 'search' },
    { text: 'alignright', icon: 'alignright' },
  ];

  return createWidget('dxTabs', { dataSource, width: 'auto' }, '#tabs');
});

['primary', 'secondary'].forEach((stylingMode) => {
  ['horizontal', 'vertical'].forEach((orientation) => {
    test('Tabs item selected states', async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await testScreenshot(t, takeScreenshot, `Tabs item selected, orientation=${orientation}, stylingMode=${stylingMode}.png`, { element: '#container' });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await appendElementTo('#container', 'div', 'tabs');
      await appendElementTo('#container', 'div', 'tabs-rtl');
      await setAttribute('#container', 'style', `display: flex; gap: 40px; flex-direction: ${orientation === 'horizontal' ? 'column' : 'row'}; width: fit-content;`);

      const dataSource: Item[] = [
        { text: 'John Heart' },
        { text: 'Marina Thomas', disabled: true },
        { text: 'Robert Reagan' },
        { text: 'Greta Sims' },
        { text: 'Olivia Peyton' },
        { text: 'Ed Holmes' },
        { text: 'Wally Hobbs' },
        { text: 'Brad Jameson' },
      ];

      const tabsOptions = {
        dataSource,
        orientation,
        stylingMode,
        width: orientation === 'horizontal' ? 450 : 'auto',
        height: orientation === 'horizontal' ? 'auto' : 250,
        selectedItem: dataSource[2],
        showNavButtons: true,
      };

      await createWidget('dxTabs', tabsOptions, '#tabs');
      return createWidget('dxTabs', { ...tabsOptions, rtlEnabled: true }, '#tabs-rtl');
    });
  });
});

test('Tabs item states', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await testScreenshot(t, takeScreenshot, 'Tabs without focus.png', { element: '#tabs' });

  await t.pressKey('tab');
  await testScreenshot(t, takeScreenshot, 'Tabs item focused.png', { element: '#tabs' });

  await t.pressKey('right');
  await testScreenshot(t, takeScreenshot, 'Tabs disabled item focused.png', { element: '#tabs' });

  const thirdItem = Selector(`.${TAB_CLASS}:nth-child(3)`);
  const fourthItem = Selector(`.${TAB_CLASS}:nth-child(4)`);

  await t
    .pressKey('right')
    .dispatchEvent(thirdItem, 'mousedown');
  await testScreenshot(t, takeScreenshot, 'Tabs item active.png', { element: '#tabs' });
  await t.dispatchEvent(thirdItem, 'mouseup');

  await t
    .click(thirdItem)
    .hover(fourthItem);
  await testScreenshot(t, takeScreenshot, 'Tabs item hovered.png', { element: '#tabs' });

  await t.click('body', {
    offsetX: -10,
    offsetY: -10,
  });

  await t.hover(thirdItem);
  await testScreenshot(t, takeScreenshot, 'Tabs selected item hovered.png', { element: '#tabs' });

  await t.dispatchEvent(thirdItem, 'mousedown');
  await testScreenshot(t, takeScreenshot, 'Tabs selected item active.png', { element: '#tabs' });
  await t.dispatchEvent(thirdItem, 'mouseup');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'tabs');

  const dataSource: Item[] = [
    { text: 'John Heart' },
    { text: 'Marina Thomas', disabled: true },
    { text: 'Robert Reagan' },
    { text: 'Greta Sims' },
    { text: 'Olivia Peyton' },
    { text: 'Ed Holmes' },
    { text: 'Wally Hobbs' },
    { text: 'Brad Jameson' },
  ];

  const tabsOptions = {
    dataSource,
    selectOnFocus: false,
    showNavButtons: true,
    width: 600,
    useInkRipple: false,
  };

  return createWidget('dxTabs', tabsOptions, '#tabs');
});
