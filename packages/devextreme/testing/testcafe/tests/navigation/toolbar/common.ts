import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { appendElementTo, setAttribute, setStyleAttribute } from '../../../helpers/domUtils';
import Toolbar from '../../../model/toolbar/toolbar';

fixture.disablePageReloads`Toolbar_common`
  .page(url(__dirname, '../../container.html'));

const supportedWidgets = ['dxAutocomplete', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', 'dxTabs', 'dxTextBox', 'dxButtonGroup', 'dxDropDownButton'];

['never', 'always', 'auto'].forEach((locateInMenu) => {
  [true, false].forEach((rtlEnabled) => {
    test(`Default nested widgets render,items[].locateInMenu=${locateInMenu},rtl=${rtlEnabled}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const toolbar = new Toolbar('#toolbar');
      let targetContainer = Selector('#container');

      const overflowMenu = toolbar.getOverflowMenu();

      if (locateInMenu !== 'never') {
        await t
          .click(overflowMenu.element);

        targetContainer = overflowMenu.getPopup().getContent();
      }

      await setStyleAttribute(targetContainer, 'background-color: gold;');

      await testScreenshot(t, takeScreenshot, `Toolbar widgets render${rtlEnabled ? ' rtl=true' : ''},items[]locateInMenu=${locateInMenu}.png`, {
        element: targetContainer,
        shouldTestInCompact: true,
        compactCallBack: async () => {
          await toolbar.repaint();

          if (locateInMenu !== 'never') {
            await t
              .click(overflowMenu.element);
          }
          await setStyleAttribute(targetContainer, 'background-color: gold;');
        },
      });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await appendElementTo('#container', 'div', 'toolbar');
      await setAttribute('#container', 'style', 'width: 1184px;');

      const toolbarItems = [] as any[];
      (supportedWidgets as any[]).forEach((widgetName) => {
        const itemConfig = {
          location: 'before',
          locateInMenu,
          widget: widgetName,
          options: {
            value: new Date(2021, 9, 17),
            stylingMode: 'contained',
            text: `${widgetName}`,
            icon: 'refresh',
            items: [{ text: `${widgetName}`, icon: 'export' }],
          },
        };

        if (locateInMenu === 'never') {
          (itemConfig.options as any).width = 115;
        }

        toolbarItems.push(itemConfig);
      });

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

  test(`Toolbar with dropDownButton,items[].locateInMenu=${locateInMenu}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const toolbar = new Toolbar('#toolbar');
    const overflowMenu = toolbar.getOverflowMenu();
    let targetContainer = Selector('#container');

    if (locateInMenu !== 'never') {
      await t
        .click(overflowMenu.element);

      targetContainer = overflowMenu.getPopup().getContent();
    }

    await testScreenshot(t, takeScreenshot, `Toolbar with dropDownButton,items[]locateInMenu=${locateInMenu === 'auto' ? 'always' : locateInMenu}.png`, {
      element: targetContainer,
      shouldTestInCompact: true,
      compactCallBack: async () => {
        await toolbar.repaint();

        if (locateInMenu !== 'never') {
          await t
            .click(overflowMenu.element);
        }
      },
    });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await appendElementTo('#container', 'div', 'toolbar');
    await setAttribute('#container', 'style', 'width: 1184px;');

    const toolbarItems = [
      {
        location: 'before',
        locateInMenu,
        widget: 'dxDropDownButton',
        options: {
          text: 'default',
        },
      },
      {
        location: 'before',
        locateInMenu,
        widget: 'dxDropDownButton',
        options: {
          stylingMode: 'text',
          text: 'opts.stylingMode: text',
        },
      },
      {
        location: 'before',
        locateInMenu,
        widget: 'dxDropDownButton',
        options: {
          stylingMode: 'outlined',
          text: 'opts.stylingMode: outlined',
        },
      },
      {
        location: 'before',
        locateInMenu,
        widget: 'dxDropDownButton',
        options: {
          stylingMode: 'contained',
          text: 'opts.stylingMode: contained',
        },
      },
    ];

    return createWidget('dxToolbar', {
      items: toolbarItems,
      width: locateInMenu === 'auto' ? 50 : '100%',
    }, '#toolbar');
  });
});

['always', 'never'].forEach((locateInMenu) => {
  ['text', 'outlined', 'contained'].forEach((stylingMode) => {
    test(`Toolbar with different types of buttons,items[{locateInMenu=${locateInMenu},stylingMode:${stylingMode}}]`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const toolbar = new Toolbar('#toolbar');
      const overflowMenu = toolbar.getOverflowMenu();

      let targetContainer = Selector('#toolbar');
      if (locateInMenu === 'always') {
        await t
          .click(overflowMenu.element);

        targetContainer = overflowMenu.getPopup().getContent();
      }

      await testScreenshot(t, takeScreenshot, `Toolbar with ${stylingMode} buttons,items[]locateInMenu=${locateInMenu}.png`, {
        element: targetContainer,
        shouldTestInCompact: true,
        compactCallBack: async () => {
          await toolbar.repaint();
          if (locateInMenu === 'always') {
            await t
              .click(overflowMenu.element);
          }
        },
      });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await appendElementTo('#container', 'div', 'toolbar');
      await setAttribute('#container', 'style', 'width: 600px;');

      const toolbarItems = [
        {
          location: 'before',
          locateInMenu,
          widget: 'dxButton',
          options: {
            type: 'default',
            text: 'default',
            icon: 'money',
            stylingMode,
          },
        },
        {
          location: 'before',
          locateInMenu,
          widget: 'dxButton',
          options: {
            type: 'back',
            text: 'back',
            icon: 'money',
            stylingMode,
          },
        },
        {
          location: 'before',
          locateInMenu,
          widget: 'dxButton',
          options: {
            type: 'danger',
            text: 'danger',
            icon: 'money',
            stylingMode,
          },
        },
        {
          location: 'before',
          locateInMenu,
          widget: 'dxButton',
          options: {
            type: 'normal',
            text: 'normal',
            icon: 'money',
            stylingMode,
          },
        },
        {
          location: 'before',
          locateInMenu,
          widget: 'dxButton',
          options: {
            type: 'success',
            text: 'success',
            icon: 'money',
            stylingMode,
          },
        },
      ];

      return createWidget('dxToolbar', {
        items: toolbarItems,
      }, '#toolbar');
    });
  });
});
