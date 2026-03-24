import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setAttribute, setStyleAttribute, Toolbar } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Toolbar_common', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  ['never', 'always'].forEach((locateInMenu) => {
    [true, false].forEach((rtlEnabled) => {
      test(`Default nested widgets render,items[].locateInMenu=${locateInMenu},rtl=${rtlEnabled}`, async ({ page }) => {

        await appendElementTo(page, '#container', 'div', 'toolbar');
        await setAttribute(page, '#container', 'style', 'width: 1184px;');

        const supportedWidgets = ['dxAutocomplete', 'dxButton', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', 'dxTabs', 'dxTextBox', 'dxButtonGroup', 'dxDropDownButton'];
        const toolbarItems: any[] = supportedWidgets.map((widgetName) => ({
          location: 'before',
          locateInMenu,
          widget: widgetName,
          options: {
            value: new Date(2021, 9, 17),
            stylingMode: 'contained',
            text: `${widgetName}`,
            icon: 'refresh',
            items: [{ text: `${widgetName}`, icon: 'export' }],
            iconPosition: widgetName === 'dxTabs' ? 'start' : undefined,
            width: locateInMenu === 'never' ? 115 : undefined,
          },
        }));

        toolbarItems.push({
          location: 'before',
          locateInMenu,
          text: 'Some text',
        });

        await createWidget(page, 'dxToolbar', {
          items: toolbarItems,
          rtlEnabled,
          width: locateInMenu === 'auto' ? 50 : '100%',
        }, '#toolbar');

        const toolbar = new Toolbar(page, '#toolbar');
        let targetSelector = '#container';

        if (locateInMenu !== 'never') {
          const overflowMenu = toolbar.getOverflowMenu();
          await overflowMenu.click();

          const popup = overflowMenu.getPopup();
          const content = popup.getContent();
          await content.evaluate((el) => { el.setAttribute('style', `${el.getAttribute('style') || ''} background-color: gold;`); });

          await testScreenshot(page, `Toolbar widgets render${rtlEnabled ? ' rtl=true' : ''},items[]locateInMenu=${locateInMenu}.png`);
        } else {
          await setStyleAttribute(page, targetSelector, 'background-color: gold;');

          await testScreenshot(page, `Toolbar widgets render${rtlEnabled ? ' rtl=true' : ''},items[]locateInMenu=${locateInMenu}.png`, {
            element: targetSelector,
          });
        }
      });
    });
  });

  [true, false].forEach((rtlEnabled) => {
    test(`Default nested widgets render, rtlEnabled: ${rtlEnabled}`, async ({ page }) => {

      await setAttribute(page, '#container', 'style', 'box-sizing: border-box; width: 400px; height: 400px; padding: 8px;');
      await appendElementTo(page, '#container', 'div', 'toolbar');

      const supportedWidgets = ['dxAutocomplete', 'dxButton', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', 'dxTabs', 'dxTextBox', 'dxButtonGroup', 'dxDropDownButton'];
      const toolbarItems: any[] = supportedWidgets.map((widgetName) => ({
        location: 'before',
        widget: widgetName,
        options: {
          value: new Date(2021, 9, 17),
          stylingMode: 'contained',
          text: 1,
          items: [{ text: 1 }, { text: 2 }],
          showClearButton: true,
        },
      }));

      toolbarItems.push({
        location: 'after',
        text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
      });

      await createWidget(page, 'dxToolbar', {
        multiline: true,
        items: toolbarItems,
        rtlEnabled,
      }, '#toolbar');

      await testScreenshot(page, `Toolbar nested widgets render in multiline rtl=${rtlEnabled}.png`, {
        element: '#toolbar',
      });
    });
  });
});
