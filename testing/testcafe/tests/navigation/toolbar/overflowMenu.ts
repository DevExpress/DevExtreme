/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector, ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import Toolbar from '../../../model/toolbar/toolbar';
import Guid from '../../../../../js/core/guid';
import { changeTheme } from '../../../helpers/changeTheme';
import {
  appendElementTo, setClassAttribute,
} from '../helpers/domUtils';

const BUTTON_CLASS = 'dx-button';
const ACTIVE_STATE_CLASS = 'dx-state-active';
const HOVER_STATE_CLASS = 'dx-state-hover';
const FOCUSED_STATE_CLASS = 'dx-state-focused';

const themes = ['generic.light', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'];
const supportedWidgets = ['dxAutocomplete', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', 'dxTabs', 'dxTextBox', 'dxDropDownButton'];
const stylingModes = ['text', 'outlined', 'contained'];
const types = ['back', 'danger', 'default', 'normal', 'success'];
const states = [HOVER_STATE_CLASS, FOCUSED_STATE_CLASS, `${FOCUSED_STATE_CLASS} ${ACTIVE_STATE_CLASS}`, false] as any[];

fixture`Toolbar_OverflowMenu`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => {
    await changeTheme('generic.light');
  });

test('Drop down button should lost hover and active state', async (t) => {
  const toolbar = new Toolbar('#container');
  const dropDownMenu = toolbar.getOverflowMenu();

  await t
    .dispatchEvent(dropDownMenu.element, 'mousedown')
    .expect(dropDownMenu.isActive)
    .ok()
    .expect(dropDownMenu.isFocused)
    .notOk()
    .expect(dropDownMenu.isHovered)
    .notOk()
    .dispatchEvent(dropDownMenu.element, 'mouseup')
    .expect(dropDownMenu.isActive)
    .notOk()
    .expect(dropDownMenu.isFocused)
    .notOk()
    .expect(dropDownMenu.isHovered)
    .notOk();

  await t
    .click(dropDownMenu.element)
    .expect(dropDownMenu.isActive)
    .notOk()
    .expect(dropDownMenu.isFocused)
    .ok()
    .expect(dropDownMenu.isHovered)
    .ok();

  await t
    .hover('#button')
    .expect(dropDownMenu.isHovered)
    .notOk()
    .expect(dropDownMenu.isFocused)
    .notOk()
    .expect(dropDownMenu.isActive)
    .notOk();

  await t
    .click('#button')
    .expect(dropDownMenu.isHovered)
    .notOk()
    .expect(dropDownMenu.isFocused)
    .notOk()
    .expect(dropDownMenu.isActive)
    .notOk();
}).before(async () => {
  await appendElementTo('body', 'button', 'button', {
    width: '50px', height: '50px', backgroundColor: 'steelblue', paddingTop: '400px',
  });

  return createWidget('dxToolbar', {
    items: [
      { text: 'item1', locateInMenu: 'always' },
      { text: 'item2', locateInMenu: 'always' },
      { text: 'item3', locateInMenu: 'always' }],
  });
});

test('ButtonGroup item should not have hover and active state', async (t) => {
  const toolbar = new Toolbar('#container');
  const overflowMenu = toolbar.getOverflowMenu();

  await t
    .click(overflowMenu.element);

  const list = overflowMenu.getList();

  const items = list.getItems();

  await t
    .expect(items.count)
    .eql(1);

  const item = items.nth(0);
  const button = item.find(`.${BUTTON_CLASS}`);

  await t
    .hover(button)
    .dispatchEvent(button, 'mousedown')
    .expect(item.hasClass(ACTIVE_STATE_CLASS))
    .notOk()
    .expect(item.hasClass(FOCUSED_STATE_CLASS))
    .notOk()
    .expect(item.hasClass(HOVER_STATE_CLASS))
    .notOk()
    .expect(button.hasClass(ACTIVE_STATE_CLASS))
    .notOk()
    .expect(button.hasClass(FOCUSED_STATE_CLASS))
    .ok()
    .expect(button.hasClass(HOVER_STATE_CLASS))
    .ok();

  await t
    .dispatchEvent(button, 'mouseup')
    .expect(item.hasClass(ACTIVE_STATE_CLASS))
    .notOk()
    .expect(item.hasClass(FOCUSED_STATE_CLASS))
    .notOk()
    .expect(item.hasClass(HOVER_STATE_CLASS))
    .notOk()
    .expect(button.hasClass(ACTIVE_STATE_CLASS))
    .notOk()
    .expect(button.hasClass(FOCUSED_STATE_CLASS))
    .ok()
    .expect(button.hasClass(HOVER_STATE_CLASS))
    .ok();

  await t
    .expect(overflowMenu.option('opened'))
    .eql(true)
    .click(button)
    .expect(overflowMenu.option('opened'))
    .eql(false);
}).before(async () => createWidget('dxToolbar', {
  items: [
    {
      location: 'before',
      locateInMenu: 'always',
      widget: 'dxButtonGroup',
      options: {
        items: [{
          icon: 'alignleft',
          text: 'Align left',
        },
        {
          icon: 'aligncenter',
          text: 'Center',
        }],
        selectionMode: 'single',
      },
    },
  ],
}));

test('Click on overflow button should prevent popup\'s hideOnOutsideClick', async (t) => {
  const toolbar = new Toolbar('#container');
  const menu = toolbar.getOverflowMenu();

  await t
    .click(menu.element)
    .expect(menu.getPopup().getWrapper().count)
    .eql(1);

  await t
    .click(menu.element)
    .expect(menu.getPopup().getWrapper().count)
    .eql(0);
}).before(async () => createWidget('dxToolbar', {
  items: [
    { text: 'item1', locateInMenu: 'always' },
    { text: 'item2', locateInMenu: 'always' },
    { text: 'item3', locateInMenu: 'always' },
  ],
}));

['auto'].forEach((locateInMenu) => { // always
  let ids = [] as string[];
  themes.forEach((theme) => {
    states.forEach((state) => {
      test(`Toolbar buttons appearence${state ? `,${state.replaceAll('dx-state-', '')}` : ''},locateInMenu=${locateInMenu},theme=${theme}`, async (t) => {
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        const toolbar = new Toolbar('#container');
        let targetContainer = Selector('#container');

        await t
          .click(toolbar.getOverflowMenu().element);

        targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

        for (const id of ids) {
          if (state) {
            await setClassAttribute(Selector(`#${id}`), state);
          }
        }

        await t
          .expect(await takeScreenshot(`Toolbar-buttons${state ? `,${state.replaceAll('dx-state-', '')}` : ''},theme=${theme.replace(/\./g, '-')}.png`, targetContainer))
          .ok()
          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }).before(async () => {
        ids = [];
        await changeTheme(theme);

        const items = [] as any;

        for (const stylingMode of stylingModes) {
          for (const type of types) {
            const id = `${`dx${new Guid()}`}`;

            ids.push(id);
            items.push({
              widget: 'dxButton',
              locateInMenu,
              options: {
                stylingMode,
                text: 'Button Text',
                type,
                hint: `stylingMode=${stylingMode}, type=${type}`,
                icon: 'home',
                elementAttr: {
                  id,
                },
              },
            });
          }
        }

        await createWidget('dxToolbar', {
          width: 50,
          multiline: false,
          items,
        });
      });

      ['template', 'menuItemTemplate'].forEach((templateName) => {
        test(`Toolbar buttons as ${templateName} appearence${state ? `,${state.replaceAll('dx-state-', '')}` : ''},locateInMenu=${locateInMenu},theme=${theme}`, async (t) => {
          const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

          const toolbar = new Toolbar('#container');
          let targetContainer = Selector('#container');

          await t
            .click(toolbar.getOverflowMenu().element);

          targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

          for (const id of ids) {
            if (state) {
              await setClassAttribute(Selector(`#${id}`), state);
            }
          }

          await t
            .expect(await takeScreenshot(`Toolbar-buttons${state ? `,${state.replaceAll('dx-state-', '')}` : ''},theme=${theme.replace(/\./g, '-')}.png`, targetContainer))
            .ok()
            .expect(compareResults.isValid())
            .ok(compareResults.errorMessages());
        }).before(async () => {
          ids = [];
          await changeTheme(theme);

          const items = [] as any;

          for (const stylingMode of stylingModes) {
            for (const type of types) {
              const id = `${`dx${new Guid()}`}`;

              ids.push(id);

              const template = ClientFunction(() => ($('<div>') as any).dxButton({
                stylingMode,
                text: 'Button Text',
                type,
                hint: `stylingMode=${stylingMode}, type=${type}`,
                icon: 'home',
                elementAttr: {
                  id,
                },
              }), { dependencies: { stylingMode, id, type } });

              items.push({
                widget: 'dxButton',
                locateInMenu,
                [templateName]: template,
              });
            }
          }

          await createWidget('dxToolbar', {
            width: 50,
            multiline: false,
            items,
          });
        });

        test(`Toolbar buttons as custom ${templateName} appearence${state ? `,${state.replaceAll('dx-state-', '')}` : ''},locateInMenu=${locateInMenu},theme=${theme}`, async (t) => {
          const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

          const toolbar = new Toolbar('#container');
          let targetContainer = Selector('#container');

          await t
            .click(toolbar.getOverflowMenu().element);

          targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

          for (const id of ids) {
            if (state) {
              await setClassAttribute(Selector(`#${id}`), state);
            }
          }

          await t
            .expect(await takeScreenshot(`Toolbar-buttons-custom-${templateName}${state ? `,${state.replaceAll('dx-state-', '')}` : ''},theme=${theme.replace(/\./g, '-')}.png`, targetContainer))
            .ok()
            .expect(compareResults.isValid())
            .ok(compareResults.errorMessages());
        }).before(async () => {
          ids = [];
          await changeTheme(theme);

          const items = [] as any;

          for (const stylingMode of stylingModes) {
            for (const type of types) {
              const id = `${`dx${new Guid()}`}`;

              ids.push(id);

              const template = ClientFunction(() => ($('<div>') as any).dxButton({
                stylingMode,
                text: 'Button Text',
                type,
                hint: `stylingMode=${stylingMode}, type=${type}`,
                icon: 'home',
                elementAttr: {
                  id,
                },
              }), { dependencies: { stylingMode, id, type } });

              items.push({
                locateInMenu,
                [templateName]: template,
              });
            }
          }

          await createWidget('dxToolbar', {
            width: 50,
            multiline: false,
            items,
          });
        });
      });

      test(`Toolbar button group appearence${state ? `,${state.replaceAll('dx-state-', '')}` : ''},locateInMenu=${locateInMenu},theme=${theme}`, async (t) => {
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        const toolbar = new Toolbar('#container');
        let targetContainer = Selector('#container');

        await t
          .click(toolbar.getOverflowMenu().element);

        targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

        for (const id of ids) {
          if (state) {
            await setClassAttribute(Selector(`#${id}`), state);
          }
        }

        await t
          .expect(await takeScreenshot(`Toolbar-buttonGroup${state ? `,${state.replaceAll('dx-state-', '')}` : ''},theme=${theme.replace(/\./g, '-')}.png`, targetContainer))
          .ok()
          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }).before(async () => {
        ids = [];
        await changeTheme(theme);

        const items = [] as any;

        for (const stylingMode of stylingModes) {
          const buttons = [] as any;
          for (const type of types) {
            const id = `${`dx${new Guid()}`}`;

            ids.push(id);

            buttons.push({
              text: 'Button Text',
              type,
              icon: 'home',
              elementAttr: {
                id,
              },
            });
          }

          items.push({
            widget: 'dxButtonGroup',
            locateInMenu,
            options: {
              stylingMode,
              items: buttons,
            },
          });
        }

        await createWidget('dxToolbar', {
          width: 50,
          items,
        });
      });

      ['template', 'menuItemTemplate'].forEach((templateName) => {
        test(`Toolbar button group as ${templateName} appearence${state ? `,${state.replaceAll('dx-state-', '')}` : ''},locateInMenu=${locateInMenu},theme=${theme}`, async (t) => {
          const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

          const toolbar = new Toolbar('#container');
          let targetContainer = Selector('#container');

          await t
            .click(toolbar.getOverflowMenu().element);

          targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

          for (const id of ids) {
            if (state) {
              await setClassAttribute(Selector(`#${id}`), state);
            }
          }

          await t
            .expect(await takeScreenshot(`Toolbar-buttonGroup${state ? `,${state.replaceAll('dx-state-', '')}` : ''},theme=${theme.replace(/\./g, '-')}.png`, targetContainer))
            .ok()
            .expect(compareResults.isValid())
            .ok(compareResults.errorMessages());
        }).before(async () => {
          ids = [];
          await changeTheme(theme);

          const items = [] as any;

          for (const stylingMode of stylingModes) {
            const buttons = [] as any;
            for (const type of types) {
              const id = `${`dx${new Guid()}`}`;

              ids.push(id);

              buttons.push({
                text: 'Button Text',
                type,
                icon: 'home',
                elementAttr: {
                  id,
                },
              });
            }

            const template = ClientFunction(() => ($('<div>') as any).dxButtonGroup({
              stylingMode,
              items: buttons,
            }), { dependencies: { stylingMode, buttons } });

            items.push({
              widget: 'dxButtonGroup',
              locateInMenu,
              [templateName]: template,
            });
          }

          await createWidget('dxToolbar', {
            width: 50,
            items,
          });
        });

        test(`Toolbar button group as custom ${templateName} appearence${state ? `,${state.replaceAll('dx-state-', '')}` : ''},locateInMenu=${locateInMenu},theme=${theme}`, async (t) => {
          const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

          const toolbar = new Toolbar('#container');
          let targetContainer = Selector('#container');

          await t
            .click(toolbar.getOverflowMenu().element);

          targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

          for (const id of ids) {
            if (state) {
              await setClassAttribute(Selector(`#${id}`), state);
            }
          }

          await t
            .expect(await takeScreenshot(`Toolbar-buttonGroup-custom-${templateName}${state ? `,${state.replaceAll('dx-state-', '')}` : ''},theme=${theme.replace(/\./g, '-')}.png`, targetContainer))
            .ok()
            .expect(compareResults.isValid())
            .ok(compareResults.errorMessages());
        }).before(async () => {
          ids = [];
          await changeTheme(theme);

          const items = [] as any;

          for (const stylingMode of stylingModes) {
            const buttons = [] as any;
            for (const type of types) {
              const id = `${`dx${new Guid()}`}`;

              ids.push(id);

              buttons.push({
                text: 'Button Text',
                type,
                icon: 'home',
                elementAttr: {
                  id,
                },
              });
            }

            const template = ClientFunction(() => ($('<div>') as any).dxButtonGroup({
              stylingMode,
              items: buttons,
            }), { dependencies: { stylingMode, buttons } });

            items.push({
              locateInMenu,
              [templateName]: template,
            });
          }

          await createWidget('dxToolbar', {
            width: 50,
            items,
          });
        });
      });
    });

    test(`Toolbar all widgets appearance,theme=${theme},locateInMenu=${locateInMenu}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const toolbar = new Toolbar('#container');
      let targetContainer = Selector('#container');

      await t
        .click(toolbar.getOverflowMenu().element);

      targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

      await t
        .expect(await takeScreenshot(`Toolbar all widgets appearance,theme=${theme.replace(/\./g, '-')}.png`, targetContainer))
        .ok()
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await changeTheme(theme);

      const toolbarItems = [] as any[];
      (supportedWidgets as any[]).forEach((widgetName) => {
        toolbarItems.push({
          locateInMenu,
          widget: widgetName,
          options: {
            value: new Date(2021, 9, 17),
            stylingMode: 'contained',
            text: 'test value',
            items: [{ text: 'test value_1' }, { text: 'test value_2' }],
            showClearButton: true,
          },
        });
      });

      return createWidget('dxToolbar', {
        width: 50,
        items: toolbarItems,
      });
    });

    ['template', 'menuItemTemplate'].forEach((templateName) => {
      test(`Toolbar all widgets as ${templateName} appearance,theme=${theme},locateInMenu=${locateInMenu}`, async (t) => {
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        const toolbar = new Toolbar('#container');
        let targetContainer = Selector('#container');

        await t
          .click(toolbar.getOverflowMenu().element);

        targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

        await t
          .expect(await takeScreenshot(`Toolbar all widgets as ${templateName} appearance,theme=${theme.replace(/\./g, '-')}.png`, targetContainer))
          .ok()
          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }).before(async () => {
        await changeTheme(theme);

        const toolbarItems = [] as any[];
        (supportedWidgets as any[]).forEach((widgetName) => {
          const template = ClientFunction(() => ($('<div>') as any)[`${widgetName}`]({
            value: new Date(2021, 9, 17),
            stylingMode: 'contained',
            text: 'test value',
            items: [{ text: 'test value_1' }, { text: 'test value_2' }],
          }), { dependencies: { widgetName } });

          toolbarItems.push({
            locateInMenu,
            widget: widgetName,
            [templateName]: template,
          });
        });

        return createWidget('dxToolbar', {
          width: 50,
          items: toolbarItems,
        });
      });
    });
  });
});
