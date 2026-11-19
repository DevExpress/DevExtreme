import type { Locator } from '@playwright/test';
import type { ToolbarItemComponent } from 'devextreme/common';
import type { Item, LocateInMenuMode } from 'devextreme/ui/toolbar';
import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import Toolbar from '../../../models/toolbar';

const supportedWidgets: ToolbarItemComponent[] = ['dxAutocomplete', 'dxButton', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', 'dxTabs', 'dxTextBox', 'dxButtonGroup', 'dxDropDownButton'];

const appendStyle = (locator: Locator, style: string): Promise<void> => locator.evaluate(
  (element, value) => {
    element.setAttribute('style', `${element.getAttribute('style') ?? ''} ${value}`);
  },
  style,
);

test.describe('Toolbar_common', () => {
  (['never', 'always'] as LocateInMenuMode[]).forEach((locateInMenu) => {
    [true, false].forEach((rtlEnabled) => {
      test(`Default nested widgets render,items[].locateInMenu=${locateInMenu},rtl=${rtlEnabled}`, async ({ page }) => {
        await appendElementTo(page, '#container', 'div', 'toolbar');
        await setAttribute(page, '#container', 'style', 'width: 1184px;');

        await createWidget(page, 'dxToolbar', ({ widgets, mode, rtl }) => {
          const toolbarItems: Item[] = widgets.map((widgetName) => ({
            location: 'before',
            locateInMenu: mode,
            widget: widgetName,
            options: {
              value: new Date(2021, 9, 17),
              stylingMode: 'contained',
              text: `${widgetName}`,
              icon: 'refresh',
              items: [{ text: `${widgetName}`, icon: 'export' }],
              iconPosition: widgetName === 'dxTabs' ? 'start' : undefined,
              width: mode === 'never' ? 115 : undefined,
            },
          }));

          toolbarItems.push({
            location: 'before',
            locateInMenu: mode,
            text: 'Some text',
          });

          return {
            items: toolbarItems,
            rtlEnabled: rtl,
            width: mode === 'auto' ? 50 : '100%',
          };
        }, '#toolbar', { arg: { widgets: supportedWidgets, mode: locateInMenu, rtl: rtlEnabled } });

        const toolbar = new Toolbar(page, '#toolbar');
        let targetContainer = page.locator('#container');

        const overflowMenu = toolbar.getOverflowMenu();

        if (locateInMenu !== 'never') {
          await overflowMenu.element.click();

          targetContainer = overflowMenu.getPopup().getContent().first();
        }

        await appendStyle(targetContainer, 'background-color: gold;');

        await testScreenshot(page, `Toolbar widgets render${rtlEnabled ? ' rtl=true' : ''},items[]locateInMenu=${locateInMenu}.png`, {
          element: targetContainer,
        });
      });
    });
  });

  [true, false].forEach((rtlEnabled) => {
    test(`Default nested widgets render, rtlEnabled: ${rtlEnabled}`, async ({ page }) => {
      await setAttribute(page, '#container', 'style', 'box-sizing: border-box; width: 400px; height: 400px; padding: 8px;');
      await appendElementTo(page, '#container', 'div', 'toolbar');

      await createWidget(page, 'dxToolbar', ({ widgets, rtl }) => {
        const toolbarItems: Item[] = widgets.map((widgetName) => ({
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

        return {
          multiline: true,
          items: toolbarItems,
          rtlEnabled: rtl,
        };
      }, '#toolbar', { arg: { widgets: supportedWidgets, rtl: rtlEnabled } });

      await testScreenshot(page, `Toolbar nested widgets render in multiline rtl=${rtlEnabled}.png`, {
        element: '#toolbar',
      });
    });
  });
});
