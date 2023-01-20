/* eslint-disable no-restricted-syntax */
import { Selector, ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import Toolbar from '../../../model/toolbar/toolbar';
import Guid from '../../../../../js/core/guid';
import { appendElementTo, setClassAttribute } from '../../../helpers/domUtils';

const BUTTON_CLASS = 'dx-button';
const ACTIVE_STATE_CLASS = 'dx-state-active';
const HOVER_STATE_CLASS = 'dx-state-hover';
const FOCUSED_STATE_CLASS = 'dx-state-focused';

const supportedWidgets = ['dxAutocomplete', 'dxCheckBox', 'dxDateBox', 'dxMenu', 'dxSelectBox', 'dxTabs', 'dxTextBox', 'dxDropDownButton'];
const stylingModes = ['text', 'outlined', 'contained'];
const types = ['back', 'danger', 'default', 'normal', 'success'];
// eslint-disable-next-line max-len
const states = [false] as any[]; // FOCUSED_STATE_CLASS, HOVER_STATE_CLASS, `${FOCUSED_STATE_CLASS} ${ACTIVE_STATE_CLASS}`

fixture`Toolbar_OverflowMenu`
  .page(url(__dirname, '../../container.html'));

test('Drop down button should lost hover and active state', async (t) => {
  const toolbar = new Toolbar('#toolbar');
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
  await appendElementTo('#container', 'div', 'toolbar');
  await appendElementTo('#container', 'button', 'button', {
    width: '50px', height: '50px', backgroundColor: 'steelblue', marginTop: '400px',
  });

  return createWidget('dxToolbar', {
    items: [
      { text: 'item1', locateInMenu: 'always' },
      { text: 'item2', locateInMenu: 'always' },
      { text: 'item3', locateInMenu: 'always' }],
  }, '#toolbar');
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
  states.forEach((state) => {
    test(`Toolbar buttons appearence${state ? `,${state.replaceAll('dx-state-', '')}` : ''},locateInMenu=${locateInMenu}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const toolbar = new Toolbar('#container');
      let targetContainer = Selector('#container');

      await t
        .click(toolbar.getOverflowMenu().element);

      targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

      for (const id of t.ctx.ids) {
        if (state) {
          await setClassAttribute(Selector(`#${id}`), state);
        }
      }

      await testScreenshot(t, takeScreenshot, `Toolbar-buttons${state ? `,${state.replaceAll('dx-state-', '')}` : ''}.png`, { element: targetContainer });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async (t) => {
      t.ctx.ids = [];

      const items = [] as any;

      for (const stylingMode of stylingModes) {
        for (const type of types) {
          const id = `${`dx${new Guid()}`}`;

          t.ctx.ids.push(id);
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

    ['template'].forEach((templateName) => { // 'menuItemTemplate'
      test(`Toolbar buttons as ${templateName} appearence${state ? `,${state.replaceAll('dx-state-', '')}` : ''},locateInMenu=${locateInMenu}`, async (t) => {
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        const toolbar = new Toolbar('#container');
        let targetContainer = Selector('#container');

        await t
          .click(toolbar.getOverflowMenu().element);

        targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

        for (const id of t.ctx.ids) {
          if (state) {
            await setClassAttribute(Selector(`#${id}`), state);
          }
        }

        await testScreenshot(t, takeScreenshot, `Toolbar-buttons${state ? `,${state.replaceAll('dx-state-', '')}` : ''}.png`, { element: targetContainer });

        await t
          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }).before(async (t) => {
        t.ctx.ids = [];

        const items = [] as any;

        for (const stylingMode of stylingModes) {
          for (const type of types) {
            const id = `${`dx${new Guid()}`}`;

            t.ctx.ids.push(id);

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

      test(`Toolbar buttons as custom ${templateName} appearence${state ? `,${state.replaceAll('dx-state-', '')}` : ''},locateInMenu=${locateInMenu}`, async (t) => {
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        const toolbar = new Toolbar('#container');
        let targetContainer = Selector('#container');

        await t
          .click(toolbar.getOverflowMenu().element);

        targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

        for (const id of t.ctx.ids) {
          if (state) {
            await setClassAttribute(Selector(`#${id}`), state);
          }
        }

        await testScreenshot(t, takeScreenshot, `Toolbar-buttons-custom-${templateName}${state ? `,${state.replaceAll('dx-state-', '')}` : ''}.png`, { element: targetContainer });

        await t
          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }).before(async (t) => {
        t.ctx.ids = [];

        const items = [] as any;

        for (const stylingMode of stylingModes) {
          for (const type of types) {
            const id = `${`dx${new Guid()}`}`;

            t.ctx.ids.push(id);

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

    test(`Toolbar button group appearence ${state ? `,${state.replaceAll('dx-state-', '')}` : ''},locateInMenu=${locateInMenu}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const toolbar = new Toolbar('#container');
      let targetContainer = Selector('#container');

      await t
        .click(toolbar.getOverflowMenu().element);

      targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

      for (const id of t.ctx.ids) {
        if (state) {
          await setClassAttribute(Selector(`#${id}`), state);
        }
      }

      await testScreenshot(t, takeScreenshot, `Toolbar-buttonGroup${state ? `,${state.replaceAll('dx-state-', '')}` : ''}.png`, { element: targetContainer });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async (t) => {
      t.ctx.ids = [];

      const items = [] as any;

      for (const stylingMode of stylingModes) {
        const buttons = [] as any;
        for (const type of types) {
          const id = `${`dx${new Guid()}`}`;

          t.ctx.ids.push(id);

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

    ['template'].forEach((templateName) => { // 'menuItemTemplate'
      test(`Toolbar button group as ${templateName} appearence${state ? `,${state.replaceAll('dx-state-', '')}` : ''},locateInMenu=${locateInMenu}`, async (t) => {
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        const toolbar = new Toolbar('#container');
        let targetContainer = Selector('#container');

        await t
          .click(toolbar.getOverflowMenu().element);

        targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

        for (const id of t.ctx.ids) {
          if (state) {
            await setClassAttribute(Selector(`#${id}`), state);
          }
        }

        await testScreenshot(t, takeScreenshot, `Toolbar-buttonGroup${state ? `,${state.replaceAll('dx-state-', '')}` : ''}.png`, { element: targetContainer });

        await t
          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }).before(async (t) => {
        t.ctx.ids = [];

        const items = [] as any;

        for (const stylingMode of stylingModes) {
          const buttons = [] as any;
          for (const type of types) {
            const id = `${`dx${new Guid()}`}`;

            t.ctx.ids.push(id);

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

      test(`Toolbar button group as custom ${templateName} appearence${state ? `,${state.replaceAll('dx-state-', '')}` : ''},locateInMenu=${locateInMenu}`, async (t) => {
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        const toolbar = new Toolbar('#container');
        let targetContainer = Selector('#container');

        await t
          .click(toolbar.getOverflowMenu().element);

        targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

        for (const id of t.ctx.ids) {
          if (state) {
            await setClassAttribute(Selector(`#${id}`), state);
          }
        }

        await testScreenshot(t, takeScreenshot, `Toolbar-buttonGroup-custom-${templateName}${state ? `,${state.replaceAll('dx-state-', '')}` : ''}.png`, { element: targetContainer });

        await t
          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }).before(async (t) => {
        t.ctx.ids = [];

        const items = [] as any;

        for (const stylingMode of stylingModes) {
          const buttons = [] as any;
          for (const type of types) {
            const id = `${`dx${new Guid()}`}`;

            t.ctx.ids.push(id);

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

  test(`Toolbar all widgets appearance,locateInMenu=${locateInMenu}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const toolbar = new Toolbar('#container');
    let targetContainer = Selector('#container');

    await t
      .click(toolbar.getOverflowMenu().element);

    targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

    await testScreenshot(t, takeScreenshot, 'Toolbar all widgets appearance.png', { element: targetContainer });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
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

  ['template'].forEach((templateName) => { // 'menuItemTemplate'
    test(`Toolbar all widgets as ${templateName} appearance, locateInMenu=${locateInMenu}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const toolbar = new Toolbar('#container');
      let targetContainer = Selector('#container');

      await t
        .click(toolbar.getOverflowMenu().element);

      targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

      await testScreenshot(t, takeScreenshot, `Toolbar all widgets as ${templateName} appearance.png`, { element: targetContainer });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
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
