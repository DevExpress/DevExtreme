import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Tabs_common', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const TAB_CLASS = 'dx-tab';

  test('Tabs background color', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'tabs');
    await setAttribute(page, '#container', 'style', 'width: 400px; background: #fff000 !important;');

    const dataSource: any[] = [
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
    const dataSource: any[] = [
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
    test(`Tabs icon position, rtl=${rtlEnabled}`, async ({ page }) => {

      await setAttribute(page, '#container', 'style', 'display: flex; flex-direction: column; gap: 20px; width: 800px');

      const iconPositions = ['start', 'end', 'top', 'bottom'];
      const dataSource: any[] = [
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

    const dataSource: any[] = [
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
      test(`Tabs item selected states, stylingMode=${stylingMode}, orientation=${orientation}`, async ({ page }) => {

        await appendElementTo(page, '#container', 'div', 'tabs');
        await appendElementTo(page, '#container', 'div', 'tabs-rtl');
        await setAttribute(page, '#container', 'style', `display: flex; gap: 40px; flex-direction: ${orientation === 'horizontal' ? 'column' : 'row'}; width: fit-content;`);

        const dataSource: any[] = [
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

    const dataSource: any[] = [
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

    await createWidget(page, 'dxTabs', tabsOptions, '#tabs');

    await testScreenshot(page, 'Tabs without focus.png', { element: '#tabs' });

    await page.keyboard.press('Tab');
    await testScreenshot(page, 'Tabs item focused.png', { element: '#tabs' });

    await page.keyboard.press('ArrowRight');
    await testScreenshot(page, 'Tabs disabled item focused.png', { element: '#tabs' });

    const thirdItem = page.locator(`.${TAB_CLASS}:nth-child(3)`);
    const fourthItem = page.locator(`.${TAB_CLASS}:nth-child(4)`);

    await page.keyboard.press('ArrowRight')
      .dispatchEvent(thirdItem, 'mousedown');
    await testScreenshot(page, 'Tabs item active.png', { element: '#tabs' });
    await thirdItem.dispatchEvent('mouseup');

    await page.click(thirdItem)
      .hover(fourthItem);
    await testScreenshot(page, 'Tabs item hovered.png', { element: '#tabs' });

    await page.locator('body').click();

    await thirdItem.hover();
    await testScreenshot(page, 'Tabs selected item hovered.png', { element: '#tabs' });

    await thirdItem.dispatchEvent('mousedown');
    await testScreenshot(page, 'Tabs selected item active.png', { element: '#tabs' });
    await thirdItem.dispatchEvent('mouseup');

    });
});
