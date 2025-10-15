import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Toolbar from 'devextreme-testcafe-models/toolbar/toolbar';
import { ToolbarItemComponent } from 'devextreme/common';
import { Item, LocateInMenuMode } from 'devextreme/ui/toolbar';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setAttribute, setStyleAttribute } from '../../../helpers/domUtils';

fixture.disablePageReloads`Toolbar_common`
  .page(url(__dirname, '../../container.html'));

['never', 'always'].forEach((locateInMenu: LocateInMenuMode) => {
  [true, false].forEach((rtlEnabled) => {
    test(`Default nested widgets render,items[].locateInMenu=${locateInMenu},rtl=${rtlEnabled}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const toolbar = new Toolbar('#toolbar');
      let targetContainer = Selector('#container');

      const overflowMenu = toolbar.getOverflowMenu();

      if (locateInMenu !== 'never') {
        await t.click(overflowMenu.element);

        targetContainer = overflowMenu.getPopup().getContent();
      }

      await setStyleAttribute(targetContainer, 'background-color: gold;');

      await testScreenshot(t, takeScreenshot, `Toolbar widgets render${rtlEnabled ? ' rtl=true' : ''},items[]locateInMenu=${locateInMenu}.png`, {
        element: targetContainer,
      });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await appendElementTo('#container', 'div', 'toolbar');
      await setAttribute('#container', 'style', 'width: 1184px;');

      const supportedWidgets: ToolbarItemComponent[] = ['dxAutocomplete', 'dxButton', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', 'dxTabs', 'dxTextBox', 'dxButtonGroup', 'dxDropDownButton'];
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

      return createWidget('dxToolbar', {
        items: toolbarItems,
        rtlEnabled,
        width: locateInMenu === 'auto' ? 50 : '100%',
      }, '#toolbar');
    });
  });
});

[true, false].forEach((rtlEnabled) => {
  test(`Default nested widgets render, rtlEnabled: ${rtlEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `Toolbar nested widgets render in multiline rtl=${rtlEnabled}.png`, {
      element: '#toolbar',
    });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await setAttribute('#container', 'style', 'box-sizing: border-box; width: 400px; height: 400px; padding: 8px;');
    await appendElementTo('#container', 'div', 'toolbar');

    const supportedWidgets: ToolbarItemComponent[] = ['dxAutocomplete', 'dxButton', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', 'dxTabs', 'dxTextBox', 'dxButtonGroup', 'dxDropDownButton'];
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

    return createWidget('dxToolbar', {
      multiline: true,
      items: toolbarItems,
      rtlEnabled,
    }, '#toolbar');
  });
});
