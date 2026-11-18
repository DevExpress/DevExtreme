import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import SelectBox from '../../../models/selectBox';

const FOCUSED_STATE_CLASS = 'dx-state-focused';

interface ActionButtonOptions {
  type?: string;
  disabled?: boolean;
}

const setActionButton = async (
  page: Page,
  buttonOptions: ActionButtonOptions = {},
): Promise<void> => page.evaluate((options) => {
  const selectBox = ($('#container') as any).dxSelectBox('instance');

  selectBox.option('buttons', [{
    name: 'test',
    options: {
      icon: 'home',
      ...options,
      onClick: () => {
        selectBox.option('value', 'item2');
      },
    },
  }]);
}, buttonOptions);

test.describe('SelectBox', () => {
  test('editor can be focused out after click on action button', async ({ page }) => {
    await createWidget(page, 'dxSelectBox', {
      items: ['item1', 'item2'],
    });

    const selectBox = new SelectBox(page, '#container');

    await setActionButton(page);

    await selectBox.element.click();
    await selectBox.expectFocused();

    await selectBox.getButton(0).element.click();
    await selectBox.expectFocused();

    await page.keyboard.press('Tab');

    if (await selectBox.hasClass(FOCUSED_STATE_CLASS)) {
      await page.keyboard.press('Tab');
    }

    await selectBox.expectFocused(false);
  });

  test('selectbox should not be opened after click on disabled action button (T1117453)', async ({ page }) => {
    await createWidget(page, 'dxSelectBox', {
      items: ['item1', 'item2'],
      value: 'item1',
    });

    const selectBox = new SelectBox(page, '#container');

    await setActionButton(page, { type: 'default', disabled: true });

    // The button is aria-disabled, and a locator click waits for it to become enabled. A user
    // clicks it anyway: the mouse goes to the point where the button is.
    const box = await selectBox.getButton(0).element.boundingBox();

    expect(box).not.toBeNull();
    await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);

    await selectBox.expectFocused(false);
    await expect.poll(() => selectBox.isOpened()).toBe(false);
    await expect(selectBox.input).toHaveValue('item1');
  });

  test('SelectBox: positioning content in the custom dropdown button', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'selectBox');
    await createWidget(page, 'dxSelectBox', () => ({
      items: ['item1', 'item2'],
      value: 'item1',
      dropDownButtonTemplate() {
        return '<span style="line-height: 1">X</span>';
      },
    }), '#container');

    await testScreenshot(page, 'SelectBox Customize DropDown Button.png', { element: '#container' });
  });
});
