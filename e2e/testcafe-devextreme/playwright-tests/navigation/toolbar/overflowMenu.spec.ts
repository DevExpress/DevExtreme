import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setClassAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Toolbar_OverflowMenu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const BUTTON_CLASS = 'dx-button';
  const ACTIVE_STATE_CLASS = 'dx-state-active';
  const HOVER_STATE_CLASS = 'dx-state-hover';
  const FOCUSED_STATE_CLASS = 'dx-state-focused';

  const stylingModes = ['text', 'outlined', 'contained'];
  const buttonTypes = ['danger', 'default', 'normal', 'success'];
  const stateClasses = [FOCUSED_STATE_CLASS, HOVER_STATE_CLASS, ACTIVE_STATE_CLASS];

  test('Drop down button should lost hover and active state', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'toolbar');
    await appendElementTo(page, '#container', 'button', 'button', {
      width: '50px', height: '50px', backgroundColor: 'steelblue', marginTop: '400px',
    });

    await createWidget(page, 'dxToolbar', {
      items: [
        { text: 'item1', locateInMenu: 'always' },
        { text: 'item2', locateInMenu: 'always' },
        { text: 'item3', locateInMenu: 'always' }],
    }, '#toolbar');

    const toolbar = page.locator('#toolbar');
    const dropDownMenu = toolbar.getOverflowMenu();

    await page.dispatchEvent(dropDownMenu.element, 'mousedown')
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

    await dropDownMenu.click()
      .expect(dropDownMenu.isActive)
      .notOk()
      .expect(dropDownMenu.isHovered)
      .ok();

    await page.hover('#button')
      .expect(dropDownMenu.isHovered)
      .notOk()
      .expect(dropDownMenu.isFocused)
      .notOk()
      .expect(dropDownMenu.isActive)
      .notOk();

    await page.locator('#button').click()
      .expect(dropDownMenu.isHovered)
      .notOk()
      .expect(dropDownMenu.isFocused)
      .notOk()
      .expect(dropDownMenu.isActive)
      .notOk();

    });

  test('ButtonGroup item should not have hover and active state', async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
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
  });

    const toolbar = page.locator('#container');
    const overflowMenu = toolbar.getOverflowMenu();

    await overflowMenu.click();

    const list = overflowMenu.getList();
    const items = list.getItems();

    expect(items.count).toBe(1);

    const item = items.nth(0);
    const button = item.find(`.${BUTTON_CLASS}`);

    await button.hover()
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

    await button.dispatchEvent('mouseup')
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

    await page.expect(overflowMenu.option('opened'))
      .eql(true)
      .click(button)
      .expect(overflowMenu.option('opened'))
      .eql(false);

    });

  test('Click on overflow button should prevent popup\'s hideOnOutsideClick', async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
    items: [
      { text: 'item1', locateInMenu: 'always' },
      { text: 'item2', locateInMenu: 'always' },
      { text: 'item3', locateInMenu: 'always' },
    ],
  });

    const toolbar = page.locator('#container');
    const menu = toolbar.getOverflowMenu();

    await menu.click()
      .expect(menu.getPopup().getWrapper().count)
      .eql(1);

    await menu.click()
      .expect(menu.getPopup().getWrapper().count)
      .eql(0);

    });

  test('Toolbar buttons in menu appearance', async ({ page }) => {

    const items: any[] = stylingModes.flatMap((stylingMode) => buttonTypes.map((type) => ({
      widget: 'dxButton',
      locateInMenu: 'always',
      options: {
        stylingMode,
        text: `Button ${stylingMode}`,
        type,
        icon: 'home',
      },
    })));

    await createWidget(page, 'dxToolbar', {
      width: 50,
      multiline: false,
      items,
    });

    const toolbar = page.locator('#container');

    await toolbar.getOverflowMenu().element.click();

    const targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

    await testScreenshot(page, 'Toolbar buttons in menu.png', { element: targetContainer });

    const items = await toolbar.getOverflowMenu().getList().getItemsAsArray();

      for (const state of stateClasses) {
      await Promise.all(items.map((item) => setClassAttribute(page, item, state)));

      const stateName = state.replace('dx-state-', '');
      await testScreenshot(page, `Toolbar buttons in menu ${stateName}.png`, { element: targetContainer });

      await Promise.all(items.map((item) => removeClassAttribute(item, state)));
    }

    });

  test('Toolbar buttons as custom template appearance', async ({ page }) => {

    const items: any[] = stylingModes.flatMap((stylingMode) => buttonTypes.map((type) => {
      const template = async () => page.evaluate(() => ($('<div>') as any).dxButton({
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

    await createWidget(page, 'dxToolbar', {
      width: 50,
      multiline: false,
      items,
    });

    const toolbar = page.locator('#container');

    await toolbar.getOverflowMenu().element.click();

    const targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

    await testScreenshot(page, 'Toolbar buttons as custom template in menu.png', { element: targetContainer });

    const items = await toolbar.getOverflowMenu().getList().getItemsAsArray();

      for (const state of stateClasses) {
      await Promise.all(items.map((item) => setClassAttribute(page, item, state)));

      const stateName = state.replace('dx-state-', '');
      await testScreenshot(page, `Toolbar buttons as custom template in menu ${stateName}.png`, { element: targetContainer });

      await Promise.all(items.map((item) => removeClassAttribute(item, state)));
    }

    });

  test('Toolbar button group appearance', async ({ page }) => {

    const items: any[] = stylingModes.map((stylingMode) => {
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

    await createWidget(page, 'dxToolbar', {
      width: 50,
      items,
    });

    const toolbar = page.locator('#container');

    await toolbar.getOverflowMenu().element.click();

    const targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

    await testScreenshot(page, 'Toolbar buttonGroup in menu.png', { element: targetContainer });

    const items = await toolbar.getOverflowMenu().getList().getItemsAsArray();

      for (const state of stateClasses) {
      await Promise.all(items.map((item) => setClassAttribute(page, item, state)));

      const stateName = state.replace('dx-state-', '');
      await testScreenshot(page, `Toolbar buttonGroup in menu ${stateName}.png`, { element: targetContainer });

      await Promise.all(items.map((item) => removeClassAttribute(item, state)));
    }

    });

  test('Toolbar button group as custom template appearance', async ({ page }) => {

    const items: any[] = stylingModes.map((stylingMode) => {
      const buttons: ButtonGroupItem[] = buttonTypes.map((type) => ({
        text: `${stylingMode[0].toUpperCase()}${stylingMode.slice(1)}`,
        type,
        icon: 'home',
      }));

      const template = async () => page.evaluate(() => ($('<div>') as any).dxButtonGroup({
        width: 490,
        stylingMode,
        items: buttons,
      }), { dependencies: { stylingMode, buttons } });

      return {
        locateInMenu: 'always',
        template,
      };
    });

    await createWidget(page, 'dxToolbar', {
      width: 50,
      items,
    });

    const toolbar = page.locator('#container');

    await toolbar.getOverflowMenu().element.click();

    const targetContainer = toolbar.getOverflowMenu().getPopup().getContent();

    await testScreenshot(page, 'Toolbar buttonGroup as custom template in menu.png', { element: targetContainer });

    const items = await toolbar.getOverflowMenu().getList().getItemsAsArray();

      for (const state of stateClasses) {
      await Promise.all(items.map((item) => setClassAttribute(page, item, state)));

      const stateName = state.replace('dx-state-', '');
      await testScreenshot(page, `Toolbar buttonGroup as custom template in menu ${stateName}.png`, { element: targetContainer });

      await Promise.all(items.map((item) => removeClassAttribute(item, state)));
    }

    });
});
