import type { Item } from 'devextreme/ui/tabs';
import { test } from '../../../fixtures';
import { clickWithOffset } from '../../../helpers/clickUtils';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';

const TAB_CLASS = 'dx-tab';

test.describe('Tabs_common', () => {
  test('Tabs background color', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'tabs');
    await setAttribute(page, '#container', 'style', 'width: 400px; background: #fff000 !important;');

    const dataSource: Item[] = [
      { text: 'John Heart' },
      { text: 'Marina Thomas' },
      { text: 'Robert Reagan' },
      { text: 'Greta Sims' },
    ];

    await createWidget(page, 'dxTabs', { dataSource }, '#tabs');

    await testScreenshot(page, 'Tabs background color.png', { element: '#container' });
  });

  test('Tabs text-overflow with vertical orientation', async ({ page }) => {
    await setAttribute(page, '#container', 'style', 'display: flex; gap: 40px; width: fit-content;');

    const iconPositions = ['start', 'end', 'top'];
    const dataSource: Item[] = [
      { icon: 'user', text: 'John Heart' },
      { icon: 'user', text: 'Marina Elizabeth Thomas Grace Sophia Alexander Benjamin Olivia Nicholas Victoria Michael Emily' },
      { icon: 'user', text: 'Robert Reagan' },
      { icon: 'user', text: 'Greta Sims' },
    ];

    await Promise.all(iconPositions.map((iconPosition) => appendElementTo(page, '#container', 'div', `tabs-${iconPosition}`)));
    await Promise.all(iconPositions.map((iconPosition) => createWidget(page, 'dxTabs', {
      dataSource,
      iconPosition,
      width: 130,
      orientation: 'vertical',
    }, `#tabs-${iconPosition}`)));

    await testScreenshot(page, 'Tabs text-overflow.png', { element: '#container' });
  });

  [true, false].forEach((rtlEnabled) => {
    test(`Tabs icon position (rtl=${rtlEnabled})`, async ({ page }) => {
      await setAttribute(page, '#container', 'style', 'display: flex; flex-direction: column; gap: 20px; width: 800px');

      const iconPositions = ['start', 'end', 'top', 'bottom'];
      const dataSource: Item[] = [
        { text: 'user', badge: '1' },
        { text: 'comment', icon: 'comment', badge: 'text' },
        { icon: 'user' },
        { icon: 'money' },
      ];

      await Promise.all(iconPositions.map((iconPosition) => appendElementTo(page, '#container', 'div', `tabs-${iconPosition}`)));
      await Promise.all(iconPositions.map((iconPosition) => createWidget(page, 'dxTabs', {
        dataSource,
        iconPosition,
        rtlEnabled,
      }, `#tabs-${iconPosition}`)));

      await testScreenshot(page, `Tabs icon position,rtl=${rtlEnabled}.png`, { element: '#container' });
    });
  });

  test('Tabs with width: auto in flex container', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'tabs');
    await setAttribute(page, '#container', 'style', 'display: flex; width: 800px;');

    const dataSource: Item[] = [
      { text: 'ok' },
      { icon: 'comment' },
      { icon: 'user' },
      { icon: 'money' },
      { text: 'ok', icon: 'search' },
      { text: 'alignright', icon: 'alignright' },
    ];

    await createWidget(page, 'dxTabs', { dataSource, width: 'auto' }, '#tabs');

    await testScreenshot(page, 'Tabs with width auto.png', { element: '#tabs' });
  });

  ['primary', 'secondary'].forEach((stylingMode) => {
    ['horizontal', 'vertical'].forEach((orientation) => {
      test(`Tabs item selected states (orientation=${orientation}, stylingMode=${stylingMode})`, async ({ page }) => {
        await appendElementTo(page, '#container', 'div', 'tabs');
        await appendElementTo(page, '#container', 'div', 'tabs-rtl');
        await setAttribute(page, '#container', 'style', `display: flex; gap: 40px; flex-direction: ${orientation === 'horizontal' ? 'column' : 'row'}; width: fit-content;`);

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

        await createWidget(page, 'dxTabs', tabsOptions, '#tabs');
        await createWidget(page, 'dxTabs', { ...tabsOptions, rtlEnabled: true }, '#tabs-rtl');

        await testScreenshot(page, `Tabs item selected, orientation=${orientation}, stylingMode=${stylingMode}.png`, { element: '#container' });
      });
    });
  });

  test('Tabs item states', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'tabs');

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

    await createWidget(page, 'dxTabs', {
      dataSource,
      selectOnFocus: false,
      showNavButtons: true,
      width: 600,
      useInkRipple: false,
    }, '#tabs');

    await testScreenshot(page, 'Tabs without focus.png', { element: '#tabs' });

    await page.keyboard.press('Tab');
    await testScreenshot(page, 'Tabs item focused.png', { element: '#tabs' });

    await page.keyboard.press('ArrowRight');
    await testScreenshot(page, 'Tabs disabled item focused.png', { element: '#tabs' });

    const thirdItem = page.locator(`.${TAB_CLASS}:nth-child(3)`);
    const fourthItem = page.locator(`.${TAB_CLASS}:nth-child(4)`);

    await page.keyboard.press('ArrowRight');
    await thirdItem.dispatchEvent('mousedown');
    await testScreenshot(page, 'Tabs item active.png', { element: '#tabs' });
    await thirdItem.dispatchEvent('mouseup');

    await thirdItem.click();
    await fourthItem.hover();
    await testScreenshot(page, 'Tabs item hovered.png', { element: '#tabs' });

    await clickWithOffset(page, page.locator('body'), { offsetX: -10, offsetY: -10 });

    await thirdItem.hover();
    await testScreenshot(page, 'Tabs selected item hovered.png', { element: '#tabs' });

    await thirdItem.dispatchEvent('mousedown');
    await testScreenshot(page, 'Tabs selected item active.png', { element: '#tabs' });
    await thirdItem.dispatchEvent('mouseup');
  });
});
