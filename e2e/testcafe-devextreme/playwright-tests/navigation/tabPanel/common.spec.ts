import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setAttribute, insertStylesheetRulesToPage } from '../../../playwright-helpers';
import { TabPanel } from '../../../playwright-helpers/tabPanel';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('TabPanel_common', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const TABS_RIGHT_NAV_BUTTON_CLASS = 'dx-tabs-nav-button-right';
  const TABS_LEFT_NAV_BUTTON_CLASS = 'dx-tabs-nav-button-left';

  ['with scrolling', 'without scrolling'].forEach((mode) => {
    const testName = `TabPanel borders ${mode}`;
    test(testName, async ({ page }) => {

      const dataSource: any[] = [
        { title: 'John Heart', text: 'John Heart' },
        { title: 'Olivia Peyton', text: 'Olivia Peyton' },
        { title: 'Robert Reagan', text: 'Robert Reagan' },
        { title: 'Greta Sims', text: 'Greta Sims' },
        { title: 'Olivia Peyton', text: 'Olivia Peyton' },
      ];

      const tabPanelOptions = {
        dataSource,
        itemTemplate: (data: any, index: any, itemElement: any) => {
          ($('<div>').css('marginTop', '10px') as any)
            .dxTabs({
              items: [
                { title: 'John Heart', text: 'John Heart' },
                { title: 'Olivia Peyton', text: 'Olivia Peyton' },
                { title: 'Robert Reagan', text: 'Robert Reagan' },
                { title: 'Greta Sims', text: 'Greta Sims' },
                { title: 'Olivia Peyton', text: 'Olivia Peyton' },
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

      await createWidget(page, 'dxTabPanel', tabPanelOptions);

      await testScreenshot(page, `${testName}.png`, { element: '#container' });
    });
  });

  test('TabPanel text-overflow with tabsPosition left', async ({ page }) => {

    const dataSource: any[] = [
      { icon: 'user', text: 'John Heart', title: 'John Heart' },
      { icon: 'user', text: 'Marina Elizabeth Thomas Grace Sophia', title: 'Mariya Elizabeth Thomas Grace Sophia' },
      { icon: 'user', text: 'Robert Reagan', title: 'Robert Reagan' },
      { icon: 'user', text: 'Greta Sims', title: 'Greta Sims' },
    ];

    await createWidget(page, 'dxTabPanel', {
      dataSource,
      width: 600,
      height: 250,
      tabsPosition: 'left',
      showNavButtons: true,
    });

    await testScreenshot(page, 'TabPanel text-overflow when tabsPosition is left.png', { element: '#container' });

    await setAttribute(page, '.dx-tabs-wrapper', 'style', 'max-width: 130px;');

    await testScreenshot(page, 'TabPanel text-overflow when tabs wrapper width is limited.png', { element: '#container' });
  });

  test('TabPanel focus borders after change selectedIndex in runtime', async ({ page }) => {

    const dataSource: any[] = [
      { title: 'John Heart', text: 'John Heart' },
      { title: 'Olivia Peyton', text: 'Olivia Peyton' },
      { title: 'Robert Reagan', text: 'Robert Reagan' },
      { title: 'Greta Sims', text: 'Greta Sims' },
      { title: 'Olivia Peyton', text: 'Olivia Peyton' },
    ];

    await createWidget(page, 'dxTabPanel', {
      dataSource,
      height: 120,
      width: 300,
    });

    const tabPanel = new TabPanel(page);
    await tabPanel.option('selectedIndex', 1);

    await testScreenshot(page, 'TabPanel focus borders.png', { element: '#container' });
  });

  test('TabPanel navigation buttons hover', async ({ page }) => {

    const dataSource: any[] = [
      { title: 'John Heart', text: 'John Heart' },
      { title: 'Olivia Peyton', text: 'Olivia Peyton' },
      { title: 'Robert Reagan', text: 'Robert Reagan' },
      { title: 'Greta Sims', text: 'Greta Sims' },
      { title: 'Olivia Peyton', text: 'Olivia Peyton' },
    ];

    const tabPanelOptions = {
      dataSource,
      height: 120,
      width: 400,
      showNavButtons: true,
      selectedIndex: 2,
      useInkRipple: false,
    };

    await createWidget(page, 'dxTabPanel', tabPanelOptions);

    await page.locator('body').click();

    const rightNavButton = page.locator(`.${TABS_RIGHT_NAV_BUTTON_CLASS}`);
    await rightNavButton.click();
    await rightNavButton.hover();

    await testScreenshot(page, 'TabPanel right navigation button hovered.png', { element: '#container' });

    const leftNavButton = page.locator(`.${TABS_LEFT_NAV_BUTTON_CLASS}`);
    await leftNavButton.hover();

    await testScreenshot(page, 'TabPanel left navigation button hovered.png', { element: '#container' });
  });

  ['top', 'right', 'bottom', 'left'].forEach((tabsPosition) => {
    const testName = `TabPanel without focus,tabsPosition=${tabsPosition}`;
    test(testName, async ({ page }) => {

      await appendElementTo(page, '#container', 'div', 'tabpanel');
      await appendElementTo(page, '#container', 'div', 'tabpanel-rtl');
      await setAttribute(page, '#container', 'style', 'display: flex; gap: 40px; flex-direction: column; width: fit-content;');

      const dataSource: any[] = [
        { title: 'John Heart', text: 'John Heart' },
        { title: 'Olivia Peyton', text: 'Olivia Peyton' },
        { title: 'Robert Reagan', text: 'Robert Reagan' },
        { title: 'Greta Sims', text: 'Greta Sims' },
        { title: 'Olivia Peyton', text: 'Olivia Peyton' },
      ];

      const tabPanelOptions = {
        dataSource,
        height: 250,
        width: 450,
        tabsPosition,
        useInkRipple: false,
      };

      await createWidget(page, 'dxTabPanel', tabPanelOptions, '#tabpanel');
      await createWidget(page, 'dxTabPanel', { ...tabPanelOptions, rtlEnabled: true }, '#tabpanel-rtl');

      await page.locator('body').click();

      await testScreenshot(page, `${testName}.png`, { element: '#container' });
    });
  });

  test('TabPanel item focus when clicking on multiview', async ({ page }) => {

    const dataSource: any[] = [
      { title: 'John Heart', text: 'John Heart' },
      { title: 'Olivia Peyton', text: 'Olivia Peyton' },
      { title: 'Robert Reagan', text: 'Robert Reagan' },
      { title: 'Greta Sims', text: 'Greta Sims' },
      { title: 'Olivia Peyton', text: 'Olivia Peyton' },
    ];

    await createWidget(page, 'dxTabPanel', {
      dataSource,
      height: 250,
      width: 450,
      useInkRipple: false,
    });

    const tabPanel = new TabPanel(page);
    await tabPanel.multiView.element.click();
    await testScreenshot(page, 'TabPanel item focus when clicking on multiview.png', { element: '#container' });
  });

  const positions = ['top', 'left', 'right', 'bottom'];

  positions.forEach((tabsPosition) => {
    test(`TabPanel border appearance when it placed inside the content of TabPanel with=${tabsPosition}`, async ({ page }) => {

      await insertStylesheetRulesToPage(page, '.dx-tabpanel { margin: 10px }');

      const dataSource: any[] = [
        { title: 'John Heart', text: 'John Heart' },
        { title: 'Olivia Peyton', text: 'Olivia Peyton' },
      ];

      await page.evaluate(({ ds, tp, pos }) => {
        ($('#container') as any).dxTabPanel({
          dataSource: ds,
          height: 700,
          width: 500,
          tabsPosition: tp,
          selectedIndex: 1,
          deferRendering: true,
          itemTemplate: () => {
            const $container = $('<div>');
            pos.forEach((position: string) => {
              const $tabPanel = ($('<div>') as any).dxTabPanel({
                height: 120,
                tabsPosition: position,
                dataSource: ds,
              });
              $container.append($tabPanel);
              $container.append($('<hr>'));
            });
            return $container;
          },
        });
      }, { ds: dataSource, tp: tabsPosition, pos: positions });

      await testScreenshot(page, `Nested TabPanel borders appearance,tabsPos=${tabsPosition}.png`, { element: '#container' });
    });
  });

  test('TabPanel tabs min-width', async ({ page }) => {

    const dataSource: any[] = [
      { text: 'ok', title: 'ok' },
      { icon: 'comment' },
      { icon: 'user' },
      { icon: 'money' },
      { text: 'ok', title: 'ok', icon: 'search' },
      { text: 'alignright', title: 'alignright', icon: 'alignright' },
    ];

    await createWidget(page, 'dxTabPanel', {
      dataSource,
      height: 250,
      width: 900,
      useInkRipple: false,
    });

    await testScreenshot(page, 'TabPanel tabs min-width.png', { element: '#container' });
  });

  ['left', 'right'].forEach((tabsPosition) => {
    test(`TabPanel should be shown correctly even if there is only one tab, tabsPosition=${tabsPosition}`, async ({ page }) => {

      const dataSource: any[] = [
        { title: 'John Heart', text: 'John Heart' },
      ];

      await createWidget(page, 'dxTabPanel', {
        dataSource,
        height: 120,
        width: 300,
        tabsPosition,
      });

      await testScreenshot(page, `TabPanel with single tab, tabPosition=${tabsPosition}.png`, { element: '#container' });
    });
  });
});
