import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Splitter_integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('The splitter pane should be rendered with the correct ratio inside the tab content of TabPanel if pane.size uses pixels', async ({ page }) => {
    await createWidget(page, 'dxTabPanel', {
    width: '100%',
    height: 300,
    deferRendering: true,
    templatesRenderAsynchronously: true,
    dataSource: [{
      title: 'Tab_1',
      collapsible: true,
      text: 'Tab_1 content',
    }, {
      title: 'Tab_2',
      collapsible: true,
      template: () => ($('<div>') as any).dxSplitter({
        orientation: 'horizontal',
        allowKeyboardNavigation: true,
        dataSource: [{
          size: '100px',
          text: 'Pane_1',
          collapsible: true,
          template: () => $('<div>').text('Pane_1'),
        }, {
          collapsible: true,
          splitter: {
            orientation: 'vertical',
            dataSource: [{
              text: 'Pane_2_1',
              collapsible: true,
              template: () => $('<div>').text('Pane_2_1'),
            }, {
              text: 'Pane_2_2',
              collapsible: true,
              template: () => $('<div>').text('Pane_2_2'),
            }],
          },
        }],
      }),
    }],
  });

    const tabPanel = page.locator('#container');

    await tabPanel.tabs.getItem(1).element.click()
      .click(tabPanel.multiView.element);

    await testScreenshot(page, 'Splitter in tab content, pane_1.size=`100px`.png', { element: '#container' });

    await resizeWindow(600, 400);

    await testScreenshot(page, 'Splitter in tab content after window resize, pane_1.size=`100px`.png', { element: '#container' });

    });
});
