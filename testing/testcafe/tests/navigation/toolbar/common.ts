import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
import { setStyleAttribute } from '../helpers/domUtils';
import Toolbar from '../../../model/toolbar/toolbar';

fixture.disablePageReloads`Toolbar_common`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

const supportedWidgets = ['dxAutocomplete', 'dxButton', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', /* 'dxTabs', */ 'dxTextBox', 'dxButtonGroup', 'dxDropDownButton'];

['always', 'never', 'auto'].forEach((locateInMenu) => {
  [true, false].forEach((rtlEnabled) => {
    test(`Default nested widgets render,items[].locateInMenu=${locateInMenu},rtl=${rtlEnabled}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const toolbar = new Toolbar('#container');
      let targetContainer = Selector('#container');

      const overflowMenu = toolbar.getOverflowMenu();

      if (locateInMenu !== 'never') {
        await t
          .click(overflowMenu.element);

        targetContainer = overflowMenu.getPopup().getContent();
      }

      await setStyleAttribute(targetContainer, 'background-color: gold;');

      await takeScreenshotInTheme(t, takeScreenshot, `Default nested widgets render${rtlEnabled ? ' rtl=true' : ''},items[]locateInMenu=${locateInMenu === 'auto' ? 'always' : locateInMenu}.png`, targetContainer, true, async () => {
        if (locateInMenu === 'always') {
          await toolbar.repaint();
          await t
            .click(overflowMenu.element);

          await setStyleAttribute(targetContainer, 'background-color: gold;');
        }
      });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      const toolbarItems = [] as any[];
      (supportedWidgets as any[]).forEach((widgetName) => {
        toolbarItems.push({
          location: 'before',
          locateInMenu,
          widget: widgetName,
          options: {
            value: new Date(2021, 9, 17),
            stylingMode: 'contained',
            text: 'Text',
            icon: 'Refresh',
            items: [{ text: 'Text', icon: 'Refresh' }, { text: 'Text', icon: 'exportxslx' }],
            showClearButton: true,
          },
        });
      });

      toolbarItems.push({
        location: 'center',
        locateInMenu,
        text: 'Some text',
      });

      return createWidget('dxToolbar', {
        items: toolbarItems,
        rtlEnabled: true,
        width: locateInMenu === 'auto' ? 50 : '100%',
      });
    });
  });

  test(`Toolbar with dropDownButton,items[].locateInMenu=${locateInMenu}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const toolbar = new Toolbar('#container');
    const overflowMenu = toolbar.getOverflowMenu();
    let targetContainer = Selector('#container');

    if (locateInMenu !== 'never') {
      await t
        .click(overflowMenu.element);

      targetContainer = overflowMenu.getPopup().getContent();
    }

    await takeScreenshotInTheme(t, takeScreenshot, `Toolbar with dropDownButton,items[]locateInMenu=${locateInMenu === 'auto' ? 'always' : locateInMenu}.png`, targetContainer, true, async () => {
      if (locateInMenu === 'always') {
        await toolbar.repaint();
        await t
          .click(overflowMenu.element);
      }
    });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
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
    });
  });
});

['always', 'never'].forEach((locateInMenu) => {
  ['text', 'outlined', 'contained'].forEach((stylingMode) => {
    test(`Toolbar with different types of buttons,items[{locateInMenu=${locateInMenu},stylingMode:${stylingMode}}]`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const toolbar = new Toolbar('#container');
      const overflowMenu = toolbar.getOverflowMenu();

      let targetContainer = Selector('#container');

      if (locateInMenu === 'always') {
        await t
          .click(overflowMenu.element);

        targetContainer = overflowMenu.getPopup().getContent();
      }

      await takeScreenshotInTheme(t, takeScreenshot, `Toolbar with ${stylingMode} buttons,items[]locateInMenu=${locateInMenu}.png`, targetContainer, true, async () => {
        if (locateInMenu === 'always') {
          await toolbar.repaint();
          await t
            .click(overflowMenu.element);
        }
      });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
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
      });
    });
  });
});
