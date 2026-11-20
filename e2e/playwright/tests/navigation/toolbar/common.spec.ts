import type { ToolbarItemComponent } from 'devextreme/common';
import type { Item, LocateInMenuMode } from 'devextreme/ui/toolbar';
import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setAttribute, setStyleAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import Toolbar from '../../../models/toolbar';

const supportedWidgets: ToolbarItemComponent[] = ['dxAutocomplete', 'dxButton', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', 'dxTabs', 'dxTextBox', 'dxButtonGroup', 'dxDropDownButton'];

test.describe('Toolbar_common', () => {
  (['never', 'always'] as LocateInMenuMode[]).forEach((locateInMenu) => {
    [true, false].forEach((rtlEnabled) => {
      test(`Default nested widgets render,items[].locateInMenu=${locateInMenu},rtl=${rtlEnabled}`, async ({ page }) => {
        await appendElementTo(page, '#container', 'div', 'toolbar');
        await setAttribute(page, '#container', 'style', 'width: 1184px;');

        const toolbarItems: Item[] = supportedWidgets.map((widgetName) => ({
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
        let targetContainer = page.locator('#container');

        const overflowMenu = toolbar.getOverflowMenu();

        if (locateInMenu !== 'never') {
          await overflowMenu.element.click();

          targetContainer = overflowMenu.getPopup().getContent().first();
        }

        await setStyleAttribute(page, targetContainer, 'background-color: gold;');

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

      const toolbarItems: Item[] = supportedWidgets.map((widgetName) => ({
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
