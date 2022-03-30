import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction, Selector } from 'testcafe';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';
import { Item } from '../../../../../js/ui/toolbar.d';
import { appendElementTo } from '../helpers/domUtils';

fixture`Toolbar_common`
  .page(url(__dirname, '../../container.html'));

['generic.light', 'generic.dark', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'].forEach((theme) => {
  const supportedWidgets = ['dxAutocomplete', 'dxButton', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', /* 'dxTabs', */ 'dxTextBox', 'dxButtonGroup', 'dxDropDownButton'];

  (['always', 'never'] as any[]).forEach((locateInMenu) => {
    test(`Default nested widgets render,theme=${theme},items[].locateInMenu=${locateInMenu}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      let targetContainerSelector = '#container';

      if (locateInMenu === 'always') {
        await ClientFunction(() => {
          $('.dx-toolbar .dx-dropdownmenu-button').click();
        }, { dependencies: { } })();

        targetContainerSelector = '.dx-dropdownmenu-popup .dx-overlay-content';
      }

      await ClientFunction(() => {
        $(targetContainerSelector).css({ backgroundColor: 'gold' });
      }, { dependencies: { targetContainerSelector } })();

      await t
        .expect(await takeScreenshot(`Default-nested-widgets-render,theme=${theme.replace(/\./g, '-')},items[]locateInMenu=${locateInMenu}.png`, Selector(targetContainerSelector)))
        .ok()
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await changeTheme(theme);

      const toolbarItems = [] as Item[];
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
    }).after(async () => {
      await changeTheme('generic.light');
    });

    test(`Toolbar with dropDownButton,theme=${theme},items[].locateInMenu=${locateInMenu}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      let targetContainerSelector = '#container';

      if (locateInMenu === 'always') {
        await ClientFunction(() => {
          $('.dx-toolbar .dx-dropdownmenu-button').click();
        }, { dependencies: { } })();

        targetContainerSelector = '.dx-dropdownmenu-popup .dx-overlay-content';
      }

      await ClientFunction(() => {
        $(targetContainerSelector).css({ backgroundColor: 'gold' });
      }, { dependencies: { targetContainerSelector } })();

      await t.wait(1000);

      await t
        .expect(await takeScreenshot(`Toolbar-with-dropDownButton,theme=${theme.replace(/\./g, '-')},items[]locateInMenu=${locateInMenu}.png`, Selector(targetContainerSelector)))
        .ok()
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await changeTheme(theme);

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
      ] as Item[];

      return createWidget('dxToolbar', {
        items: toolbarItems,
      });
    }).after(async () => {
      await changeTheme('generic.light');
    });

    test(`Toolbar with different types of buttons,theme=${theme},items[].locateInMenu=${locateInMenu}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      let targetContainerSelector = '#container';

      if (locateInMenu === 'always') {
        await ClientFunction(() => {
          $('.dx-toolbar .dx-dropdownmenu-button').click();
        }, { dependencies: { } })();

        targetContainerSelector = '.dx-dropdownmenu-popup .dx-overlay-content';
      }

      await t
        .expect(await takeScreenshot(`Toolbar-with-button,theme=${theme.replace(/\./g, '-')},items[]locateInMenu=${locateInMenu}.png`, Selector(targetContainerSelector)))
        .ok()
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await changeTheme(theme);

      const toolbarItems = [
        {
          location: 'before',
          locateInMenu,
          widget: 'dxButton',
          options: {
            type: 'default',
            text: 'default',
            icon: 'money',
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
          },
        },
      ] as Item[];

      return createWidget('dxToolbar', {
        items: toolbarItems,
      });
    }).after(async () => {
      await changeTheme('generic.light');
    });
  });

  test(`Toolbar with buttonGroup,theme=${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`Toolbar_buttonGroup_appearence_,theme=${theme.replace(/\./g, '-')}.png`))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());

    // eslint-disable-next-line no-plusplus
    for (let i = 1; i < 6; i++) {
      const menuButton = Selector(`#toolbar${i} .dx-dropdownmenu`);

      await t
        .click(menuButton)
        .expect(await takeScreenshot(`Toolbar${i}_buttonGroup_openedMenuAppearence_,theme=${theme.replace(/\./g, '-')}.png`))
        .ok()
        .click(menuButton);
    }

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(910, 800);
    await changeTheme(theme);

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
    ] as Item[];

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
  }).after(async (t) => {
    await restoreBrowserSize(t);
    await changeTheme('generic.light');
  });

  test(`Default nested widgets render,theme=${theme},items[].locateInMenu=auto`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    let targetContainerSelector = '#container';

    await ClientFunction(() => {
      $('.dx-toolbar .dx-dropdownmenu-button').click();
    }, { dependencies: { } })();

    targetContainerSelector = '.dx-dropdownmenu-popup .dx-overlay-content';

    await ClientFunction(() => {
      $(targetContainerSelector).css({ backgroundColor: 'gold' });
    }, { dependencies: { targetContainerSelector } })();

    await t
      .expect(await takeScreenshot(`Default-nested-widgets-render,theme=${theme.replace(/\./g, '-')},items[]locateInMenu=always.png`, Selector(targetContainerSelector)))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);

    const toolbarItems = [] as Item[];
    (supportedWidgets as any[]).forEach((widgetName) => {
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
  }).after(async () => {
    await changeTheme('generic.light');
  });

  test(`Toolbar with dropDownButton,theme=${theme},items[].locateInMenu=auto`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await ClientFunction(() => {
      $('.dx-toolbar .dx-dropdownmenu-button').click();
    }, { dependencies: { } })();

    const targetContainerSelector = '.dx-dropdownmenu-popup .dx-overlay-content';

    await t
      .expect(await takeScreenshot(`Toolbar-with-dropDownButton,theme=${theme.replace(/\./g, '-')},items[]locateInMenu=always.png`, Selector(targetContainerSelector)))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);

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
    ] as Item[];

    return createWidget('dxToolbar', {
      width: 200,
      items: toolbarItems,
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });
});
