import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
import { appendElementTo, setStyleAttribute } from '../helpers/domUtils';
import Toolbar from '../../../model/toolbar/toolbar';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

fixture.disablePageReloads`Toolbar_common`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

const supportedWidgets = ['dxAutocomplete', 'dxButton', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', /* 'dxTabs', */ 'dxTextBox', 'dxButtonGroup', 'dxDropDownButton'];

['always', 'never'].forEach((locateInMenu) => {
  test(`Default nested widgets render,items[].locateInMenu=${locateInMenu}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const toolbar = new Toolbar('#container');
    let targetContainer = Selector('#container');

    const overflowMenu = toolbar.getOverflowMenu();

    if (locateInMenu === 'always') {
      await t
        .click(overflowMenu.element);

      targetContainer = overflowMenu.getPopup().getContent();
    }

    await setStyleAttribute(targetContainer, 'background-color: gold;');

    await takeScreenshotInTheme(t, takeScreenshot, `Default nested widgets render,items[]locateInMenu=${locateInMenu}.png`, targetContainer, true, async () => {
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
          text: 1,
          items: [{ text: 1 }, { text: 2 }],
          showClearButton: true,
        },
      });
    });

    return createWidget('dxToolbar', {
      items: toolbarItems,
    });
  });

  test(`Toolbar with dropDownButton,items[].locateInMenu=${locateInMenu}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const toolbar = new Toolbar('#container');
    const overflowMenu = toolbar.getOverflowMenu();
    let targetContainer = Selector('#container');

    if (locateInMenu === 'always') {
      await t
        .click(overflowMenu.element);

      targetContainer = overflowMenu.getPopup().getContent();
    }

    await takeScreenshotInTheme(t, takeScreenshot, `Toolbar with dropDownButton,items[]locateInMenu=${locateInMenu}.png`, targetContainer, true, async () => {
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
    });
  });

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

safeSizeTest('Toolbar with buttonGroup', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshotInTheme(t, takeScreenshot, 'Toolbar buttonGroup appearence.png', undefined, true);
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());

  for (let i = 1; i < 6; i += 1) {
    const menuButton = Selector(`#toolbar${i} .dx-dropdownmenu`);

    await t
      .click(menuButton);

    await takeScreenshotInTheme(t, takeScreenshot, `Toolbar${i} buttonGroup openedMenuAppearence.png`, undefined, true);

    await t
      .click(menuButton);
  }

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.resizeWindow(910, 800);

  const toolbarItems = [
    {
      location: 'before',
      locateInMenu: 'auto',
      widget: 'dxButtonGroup',
      options: {
        keyExpr: 'alignment',
        items: [
          { icon: 'alignleft', alignment: 'left', text: 'Align left' },
          { icon: 'aligncenter', alignment: 'center', text: 'Center' },
          { icon: 'alignright', alignment: 'right', text: 'Right' },
          { icon: 'alignjustify', alignment: 'justify', text: 'Justify' },
        ],
      },
    }, {
      location: 'before',
      locateInMenu: 'auto',
      widget: 'dxButtonGroup',
      options: {
        items: [
          { icon: 'bold', style: 'bold', text: 'Bold' },
          { icon: 'italic', style: 'italic', text: 'Italic' },
        ],
      },
    }, {
      location: 'center',
      locateInMenu: 'auto',
      text: 'Some text',
    }, {
      widget: 'dxButton',
      options: { icon: 'back', text: 'back' },
      locateInMenu: 'always',
      location: 'after',
    },
  ];

  await appendElementTo('#container', 'div', 'toolbar1', {});
  await createWidget('dxToolbar', { items: toolbarItems }, false, '#toolbar1');

  await appendElementTo('#container', 'div', 'toolbar2', {});
  await createWidget('dxToolbar', { items: toolbarItems, width: 200 }, false, '#toolbar2');

  await appendElementTo('#container', 'div', 'toolbar3', {});
  await createWidget('dxToolbar', { items: toolbarItems, rtlEnabled: true }, false, '#toolbar3');

  await appendElementTo('#container', 'div', 'toolbar4', {});
  await createWidget('dxToolbar', { items: toolbarItems, rtlEnabled: true, width: 200 }, false, '#toolbar4');

  await appendElementTo('#container', 'div', 'toolbar5', {});
  await createWidget('dxToolbar', { items: [{ locateInMenu: 'always', text: 'text' }] }, false, '#toolbar5');
}).after(async () => disposeWidgets());

test('Default nested widgets render,items[].locateInMenu=auto', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const toolbar = new Toolbar('#container');
  await t
    .click(toolbar.getOverflowMenu().element);

  const targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

  await setStyleAttribute(targetContainer, 'background-color: gold;');

  await takeScreenshotInTheme(t, takeScreenshot, 'Default nested widgets render,items[]locateInMenu=auto.png', targetContainer, true);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const toolbarItems = [] as any[];
  supportedWidgets.forEach((widgetName) => {
    toolbarItems.push({
      location: 'before',
      locateInMenu: 'auto',
      widget: widgetName,
      options: {
        value: new Date(2021, 9, 17),
        stylingMode: 'contained',
        text: 1,
        items: [{ text: 1 }, { text: 2 }],
        showClearButton: true,
      },
    });
  });

  return createWidget('dxToolbar', {
    items: toolbarItems,
    width: 100,
  });
});

test('Toolbar with dropDownButton,items[].locateInMenu=auto', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const toolbar = new Toolbar('#container');
  const overflowMenu = toolbar.getOverflowMenu();

  await t
    .click(overflowMenu.element);

  const targetContainer = overflowMenu.getPopup().getContent();

  await takeScreenshotInTheme(t, takeScreenshot, 'Toolbar with dropDownButton,items[]locateInMenu=always.png', targetContainer, true, async () => {
    await toolbar.repaint();
    await t
      .click(overflowMenu.element);
  });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const toolbarItems = [
    {
      location: 'before',
      locateInMenu: 'auto',
      widget: 'dxDropDownButton',
      options: {
        text: 'default',
      },
    },
    {
      location: 'before',
      locateInMenu: 'auto',
      widget: 'dxDropDownButton',
      options: {
        stylingMode: 'text',
        text: 'opts.stylingMode: text',
      },
    },
    {
      location: 'before',
      locateInMenu: 'auto',
      widget: 'dxDropDownButton',
      options: {
        stylingMode: 'outlined',
        text: 'opts.stylingMode: outlined',
      },
    },
    {
      location: 'before',
      locateInMenu: 'auto',
      widget: 'dxDropDownButton',
      options: {
        stylingMode: 'contained',
        text: 'opts.stylingMode: contained',
      },
    },
  ] as any[];

  return createWidget('dxToolbar', {
    width: 50,
    items: toolbarItems,
  });
});
