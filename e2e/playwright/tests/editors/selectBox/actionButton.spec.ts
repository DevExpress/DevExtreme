import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import SelectBox from '../../../models/selectBox';

const FOCUSED_STATE_CLASS = 'dx-state-focused';

interface ActionButtonOptions {
  refocus?: boolean;
  type?: string;
  disabled?: boolean;
}

const setActionButton = async (
  page: Page,
  { refocus = false, ...buttonOptions }: ActionButtonOptions = {},
): Promise<void> => page.evaluate(({ shouldRefocus, options }) => {
  const selectBox = ($('#container') as any).dxSelectBox('instance');

  selectBox.option('buttons', [{
    name: 'test',
    options: {
      icon: 'home',
      ...options,
      onClick: () => {
        selectBox.option('value', 'item2');

        if (shouldRefocus) {
          // The editor rerenders its input.
          selectBox.focus();
        }
      },
    },
  }]);
}, { shouldRefocus: refocus, options: buttonOptions });

test.describe('SelectBox', () => {
  test('Click on action button should correctly work with SelectBox containing the field template (T811890)', async ({ page }) => {
    await createWidget(page, 'dxSelectBox', () => ({
      items: ['item1', 'item2'],
      fieldTemplate: (value) => ($('<div>') as any).dxTextBox({ value }),
    }));

    const selectBox = new SelectBox(page, '#container');

    await setActionButton(page, { refocus: true });

    await selectBox.element.click();
    await page.keyboard.press('Alt+ArrowUp');
    await selectBox.expectFocused();
    await expect.poll(() => selectBox.isOpened()).toBe(false);

    await selectBox.getButton(0).element.click();
    await selectBox.expectFocused();
    await expect(selectBox.input).toHaveValue('item2');
  });

  test('Click on action button after typing should correctly work with SelectBox containing the field template (T811890)', async ({ page }) => {
    await createWidget(page, 'dxSelectBox', () => ({
      items: ['item1', 'item2'],
      fieldTemplate: (value) => ($('<div>') as any).dxTextBox({ value }),
    }));

    const selectBox = new SelectBox(page, '#container');

    await setActionButton(page, { refocus: true });

    await selectBox.element.click();
    await page.keyboard.press('Alt+ArrowUp');
    await selectBox.expectFocused();
    await expect.poll(() => selectBox.isOpened()).toBe(false);

    await selectBox.input.pressSequentially('tt');
    await selectBox.getButton(0).element.click();
    await selectBox.expectFocused();
    await expect(selectBox.input).toHaveValue('item2');
  });

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
