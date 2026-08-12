import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Toolbar from 'devextreme-testcafe-models/toolbar/toolbar';
import { Item } from 'devextreme/ui/toolbar';
import { Item as ButtonGroupItem } from 'devextreme/ui/button_group';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setClassAttribute, removeClassAttribute } from '../../../helpers/domUtils';

const BUTTON_CLASS = 'dx-button';
const ACTIVE_STATE_CLASS = 'dx-state-active';
const HOVER_STATE_CLASS = 'dx-state-hover';
const FOCUSED_STATE_CLASS = 'dx-state-focused';

const stylingModes = ['text', 'outlined', 'contained'];
const buttonTypes = ['danger', 'default', 'normal', 'success'];
const stateClasses = [FOCUSED_STATE_CLASS, HOVER_STATE_CLASS, ACTIVE_STATE_CLASS];

fixture.disablePageReloads`Toolbar_OverflowMenu`
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
    allowKeyboardNavigation: false,
    items: [
      { text: 'item1', locateInMenu: 'always' },
      { text: 'item2', locateInMenu: 'always' },
      { text: 'item3', locateInMenu: 'always' }],
  }, '#toolbar');
});

test('ButtonGroup item should not have hover and active state', async (t) => {
  const toolbar = new Toolbar('#container');
  const overflowMenu = toolbar.getOverflowMenu();

  await t.click(overflowMenu.element);

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

test('Toolbar buttons in menu appearance', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const toolbar = new Toolbar('#container');

  await t.click(toolbar.getOverflowMenu().element);

  const targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

  await testScreenshot(t, takeScreenshot, 'Toolbar buttons in menu.png', { element: targetContainer });

  const items = await toolbar.getOverflowMenu().getList().getItemsAsArray();

  // eslint-disable-next-line no-restricted-syntax
  for (const state of stateClasses) {
    await Promise.all(items.map((item) => setClassAttribute(item, state)));

    const stateName = state.replace('dx-state-', '');
    await testScreenshot(t, takeScreenshot, `Toolbar buttons in menu ${stateName}.png`, { element: targetContainer });

    await Promise.all(items.map((item) => removeClassAttribute(item, state)));
  }

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const items: Item[] = stylingModes.flatMap((stylingMode) => buttonTypes.map((type) => ({
    widget: 'dxButton',
    locateInMenu: 'always',
    options: {
      stylingMode,
      text: `Button ${stylingMode}`,
      type,
      icon: 'home',
    },
  })));

  await createWidget('dxToolbar', {
    width: 50,
    multiline: false,
    allowKeyboardNavigation: false,
    items,
  });
});

test('Toolbar buttons as custom template appearance', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const toolbar = new Toolbar('#container');

  await t.click(toolbar.getOverflowMenu().element);

  const targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

  await testScreenshot(t, takeScreenshot, 'Toolbar buttons as custom template in menu.png', { element: targetContainer });

  const items = await toolbar.getOverflowMenu().getList().getItemsAsArray();

  // eslint-disable-next-line no-restricted-syntax
  for (const state of stateClasses) {
    await Promise.all(items.map((item) => setClassAttribute(item, state)));

    const stateName = state.replace('dx-state-', '');
    await testScreenshot(t, takeScreenshot, `Toolbar buttons as custom template in menu ${stateName}.png`, { element: targetContainer });

    await Promise.all(items.map((item) => removeClassAttribute(item, state)));
  }

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const items: Item[] = stylingModes.flatMap((stylingMode) => buttonTypes.map((type) => {
    const template = ClientFunction(() => ($('<div>') as any).dxButton({
      stylingMode,
      text: `Button ${stylingMode}`,
      type,
      icon: 'home',
    }), { dependencies: { stylingMode, type } });

    return {
      locateInMenu: 'always',
      template,
    };
  }));

  await createWidget('dxToolbar', {
    allowKeyboardNavigation: false,
    width: 50,
    multiline: false,
    items,
  });
});

test('Toolbar button group appearance', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const toolbar = new Toolbar('#container');

  await t.click(toolbar.getOverflowMenu().element);

  const targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

  await testScreenshot(t, takeScreenshot, 'Toolbar buttonGroup in menu.png', { element: targetContainer });

  const items = await toolbar.getOverflowMenu().getList().getItemsAsArray();

  // eslint-disable-next-line no-restricted-syntax
  for (const state of stateClasses) {
    await Promise.all(items.map((item) => setClassAttribute(item, state)));

    const stateName = state.replace('dx-state-', '');
    await testScreenshot(t, takeScreenshot, `Toolbar buttonGroup in menu ${stateName}.png`, { element: targetContainer });

    await Promise.all(items.map((item) => removeClassAttribute(item, state)));
  }

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const items: Item[] = stylingModes.map((stylingMode) => {
    const buttons: ButtonGroupItem[] = buttonTypes.map((type) => ({
      text: `ButtonGroup ${stylingMode}`,
      type,
      icon: 'home',
    }));

    return {
      widget: 'dxButtonGroup',
      locateInMenu: 'always',
      options: {
        stylingMode,
        items: buttons,
      },
    };
  });

  await createWidget('dxToolbar', {
    allowKeyboardNavigation: false,
    width: 50,
    items,
  });
});

test('Toolbar button group as custom template appearance', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const toolbar = new Toolbar('#container');

  await t.click(toolbar.getOverflowMenu().element);

  const targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

  await testScreenshot(t, takeScreenshot, 'Toolbar buttonGroup as custom template in menu.png', { element: targetContainer });

  const items = await toolbar.getOverflowMenu().getList().getItemsAsArray();

  // eslint-disable-next-line no-restricted-syntax
  for (const state of stateClasses) {
    await Promise.all(items.map((item) => setClassAttribute(item, state)));

    const stateName = state.replace('dx-state-', '');
    await testScreenshot(t, takeScreenshot, `Toolbar buttonGroup as custom template in menu ${stateName}.png`, { element: targetContainer });

    await Promise.all(items.map((item) => removeClassAttribute(item, state)));
  }

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const items: Item[] = stylingModes.map((stylingMode) => {
    const buttons: ButtonGroupItem[] = buttonTypes.map((type) => ({
      text: `${stylingMode[0].toUpperCase()}${stylingMode.slice(1)}`,
      type,
      icon: 'home',
    }));

    const template = ClientFunction(() => ($('<div>') as any).dxButtonGroup({
      width: 490,
      stylingMode,
      items: buttons,
    }), { dependencies: { stylingMode, buttons } });

    return {
      locateInMenu: 'always',
      template,
    };
  });

  await createWidget('dxToolbar', {
    allowKeyboardNavigation: false,
    width: 50,
    items,
  });
});
