import type { Page } from '@playwright/test';
import type { Item as ButtonGroupItem } from 'devextreme/ui/button_group';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { addClass, appendElementTo, removeClass } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import { expectClass } from '../../../models/internal/classMatcher';
import Toolbar from '../../../models/toolbar';

const BUTTON_CLASS = 'dx-button';
const ACTIVE_STATE_CLASS = 'dx-state-active';
const HOVER_STATE_CLASS = 'dx-state-hover';
const FOCUSED_STATE_CLASS = 'dx-state-focused';

const stylingModes = ['text', 'outlined', 'contained'];
const buttonTypes = ['danger', 'default', 'normal', 'success'];
const stateClasses = [FOCUSED_STATE_CLASS, HOVER_STATE_CLASS, ACTIVE_STATE_CLASS];

// Opens the menu, shoots its content, then shoots it again with every list item in each state.
const testMenuStates = async (page: Page, baseName: string): Promise<void> => {
  const toolbar = new Toolbar(page, '#container');

  await toolbar.getOverflowMenu().element.click();

  const targetContainer = toolbar.getOverflowMenu().getPopup().getContent()
    .first();

  await testScreenshot(page, `${baseName}.png`, { element: targetContainer });

  const { items } = toolbar.getOverflowMenu().getList();
  const count = await items.count();
  const listItems = Array.from({ length: count }, (_, index) => items.nth(index));

  for (const state of stateClasses) {
    for (const item of listItems) {
      await addClass(item, state);
    }

    const stateName = state.replace('dx-state-', '');
    await testScreenshot(page, `${baseName} ${stateName}.png`, { element: targetContainer });

    for (const item of listItems) {
      await removeClass(item, state);
    }
  }
};

test.describe('Toolbar_OverflowMenu', () => {
  test('Drop down button should lost hover and active state', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'toolbar');
    await appendElementTo(page, '#container', 'button', 'button', {
      width: '50px', height: '50px', backgroundColor: 'steelblue', marginTop: '400px',
    });

    await createWidget(page, 'dxToolbar', {
      allowKeyboardNavigation: false,
      items: [
        { text: 'item1', locateInMenu: 'always' },
        { text: 'item2', locateInMenu: 'always' },
        { text: 'item3', locateInMenu: 'always' }],
    }, '#toolbar');

    const toolbar = new Toolbar(page, '#toolbar');
    const dropDownMenu = toolbar.getOverflowMenu();

    await dropDownMenu.element.dispatchEvent('mousedown');
    await dropDownMenu.expectActive();
    await dropDownMenu.expectFocused(false);
    await dropDownMenu.expectHovered(false);
    await dropDownMenu.element.dispatchEvent('mouseup');
    await dropDownMenu.expectActive(false);
    await dropDownMenu.expectFocused(false);
    await dropDownMenu.expectHovered(false);

    await dropDownMenu.element.click();
    await dropDownMenu.expectActive(false);
    await dropDownMenu.expectHovered();

    await page.locator('#button').hover();
    await dropDownMenu.expectHovered(false);
    await dropDownMenu.expectFocused(false);
    await dropDownMenu.expectActive(false);

    await page.locator('#button').click();
    await dropDownMenu.expectHovered(false);
    await dropDownMenu.expectFocused(false);
    await dropDownMenu.expectActive(false);
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

    const toolbar = new Toolbar(page, '#container');
    const overflowMenu = toolbar.getOverflowMenu();

    await overflowMenu.element.click();

    const { items } = overflowMenu.getList();

    await expect(items).toHaveCount(1);

    const item = items.nth(0);
    const button = item.locator(`.${BUTTON_CLASS}`).first();

    await button.hover();
    await button.dispatchEvent('mousedown');
    await expectClass(item, ACTIVE_STATE_CLASS, false);
    await expectClass(item, FOCUSED_STATE_CLASS, false);
    await expectClass(item, HOVER_STATE_CLASS, false);
    await expectClass(button, ACTIVE_STATE_CLASS, false);
    await expectClass(button, FOCUSED_STATE_CLASS);
    await expectClass(button, HOVER_STATE_CLASS);

    await button.dispatchEvent('mouseup');
    await expectClass(item, ACTIVE_STATE_CLASS, false);
    await expectClass(item, FOCUSED_STATE_CLASS, false);
    await expectClass(item, HOVER_STATE_CLASS, false);
    await expectClass(button, ACTIVE_STATE_CLASS, false);
    await expectClass(button, FOCUSED_STATE_CLASS);
    await expectClass(button, HOVER_STATE_CLASS);

    await expect.poll(() => overflowMenu.option('opened')).toBe(true);
    await button.click();
    await expect.poll(() => overflowMenu.option('opened')).toBe(false);
  });

  test('Click on overflow button should prevent popup\'s hideOnOutsideClick', async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
      items: [
        { text: 'item1', locateInMenu: 'always' },
        { text: 'item2', locateInMenu: 'always' },
        { text: 'item3', locateInMenu: 'always' },
      ],
    });

    const toolbar = new Toolbar(page, '#container');
    const menu = toolbar.getOverflowMenu();

    await menu.element.click();
    await expect(menu.getPopup().getWrapper()).toHaveCount(1);

    await menu.element.click();
    await expect(menu.getPopup().getWrapper()).toHaveCount(0);
  });

  test('Toolbar buttons in menu appearance', async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
      width: 50,
      multiline: false,
      allowKeyboardNavigation: false,
      items: stylingModes.flatMap((stylingMode) => buttonTypes.map((type) => ({
        widget: 'dxButton',
        locateInMenu: 'always',
        options: {
          stylingMode,
          text: `Button ${stylingMode}`,
          type,
          icon: 'home',
        },
      }))),
    });

    await testMenuStates(page, 'Toolbar buttons in menu');
  });

  test('Toolbar buttons as custom template appearance', async ({ page }) => {
    await createWidget(page, 'dxToolbar', ({ modes, types }) => ({
      allowKeyboardNavigation: false,
      width: 50,
      multiline: false,
      items: modes.flatMap((stylingMode) => types.map((type) => ({
        locateInMenu: 'always',
        template: () => ($('<div>') as any).dxButton({
          stylingMode,
          text: `Button ${stylingMode}`,
          type,
          icon: 'home',
        }),
      }))),
    }), undefined, { arg: { modes: stylingModes, types: buttonTypes } });

    await testMenuStates(page, 'Toolbar buttons as custom template in menu');
  });

  test('Toolbar button group appearance', async ({ page }) => {
    await createWidget(page, 'dxToolbar', {
      allowKeyboardNavigation: false,
      width: 50,
      items: stylingModes.map((stylingMode) => {
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
      }),
    });

    await testMenuStates(page, 'Toolbar buttonGroup in menu');
  });

  test('Toolbar button group as custom template appearance', async ({ page }) => {
    await createWidget(page, 'dxToolbar', ({ modes, types }) => ({
      allowKeyboardNavigation: false,
      width: 50,
      items: modes.map((stylingMode) => {
        const buttons = types.map((type) => ({
          text: `${stylingMode[0].toUpperCase()}${stylingMode.slice(1)}`,
          type,
          icon: 'home',
        }));

        return {
          locateInMenu: 'always',
          template: () => ($('<div>') as any).dxButtonGroup({
            width: 490,
            stylingMode,
            items: buttons,
          }),
        };
      }),
    }), undefined, { arg: { modes: stylingModes, types: buttonTypes } });

    await testMenuStates(page, 'Toolbar buttonGroup as custom template in menu');
  });
});
