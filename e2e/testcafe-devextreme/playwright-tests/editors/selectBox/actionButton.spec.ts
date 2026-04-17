import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, SelectBox } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('SelectBox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Click on action button should correctly work with SelectBox containing the field template (T811890)', async ({ page }) => {
    await createWidget(page, 'dxSelectBox', {
      items: ['item1', 'item2'],
      fieldTemplate: (value: string) => ($('<div>') as any).dxTextBox({ value }),
    });

    await page.evaluate(() => {
      const instance = ($('#container') as any).dxSelectBox('instance');
      instance.option('buttons', [{
        name: 'test',
        options: {
          icon: 'home',
          onClick: () => {
            instance.option('value', 'item2');
            instance.focus();
          },
        },
      }]);
    });

    const selectBox = new SelectBox(page);

    await selectBox.click();
    await page.keyboard.press('Alt+ArrowUp');
    expect(await selectBox.isFocused).toBe(true);
    expect(await selectBox.isOpened()).toBe(false);

    const actionButton = selectBox.getButton(0);
    await actionButton.click();
    expect(await selectBox.isFocused).toBe(true);
    expect(await selectBox.value).toBe('item2');
  });

  test('Click on action button after typing should correctly work with SelectBox containing the field template (T811890)', async ({ page }) => {
    await createWidget(page, 'dxSelectBox', {
      items: ['item1', 'item2'],
      fieldTemplate: (value: string) => ($('<div>') as any).dxTextBox({ value }),
    });

    await page.evaluate(() => {
      const instance = ($('#container') as any).dxSelectBox('instance');
      instance.option('buttons', [{
        name: 'test',
        options: {
          icon: 'home',
          onClick: () => {
            instance.option('value', 'item2');
            instance.focus();
          },
        },
      }]);
    });

    const selectBox = new SelectBox(page);

    await selectBox.click();
    await page.keyboard.press('Alt+ArrowUp');
    expect(await selectBox.isFocused).toBe(true);
    expect(await selectBox.isOpened()).toBe(false);

    await selectBox.input.fill('tt');

    const actionButton = selectBox.getButton(0);
    await actionButton.click();
    expect(await selectBox.isFocused).toBe(true);
    expect(await selectBox.value).toBe('item2');
  });

  test('editor can be focused out after click on action button', async ({ page }) => {
    await createWidget(page, 'dxSelectBox', {
      items: ['item1', 'item2'],
    });

    await page.evaluate(() => {
      const instance = ($('#container') as any).dxSelectBox('instance');
      instance.option('buttons', [{
        name: 'test',
        options: {
          icon: 'home',
          onClick: () => {
            instance.option('value', 'item2');
          },
        },
      }]);
    });

    const selectBox = new SelectBox(page);

    await selectBox.click();
    expect(await selectBox.isFocused).toBe(true);

    const actionButton = selectBox.getButton(0);
    await actionButton.click();
    expect(await selectBox.isFocused).toBe(true);

    await page.keyboard.press('Tab');
    expect(await selectBox.isFocused).toBe(false);
  });

  test('selectbox should not be opened after click on disabled action button (T1117453)', async ({ page }) => {
    await createWidget(page, 'dxSelectBox', {
      items: ['item1', 'item2'],
      value: 'item1',
    });

    await page.evaluate(() => {
      const instance = ($('#container') as any).dxSelectBox('instance');
      instance.option('buttons', [{
        name: 'test',
        options: {
          icon: 'home',
          type: 'default',
          disabled: true,
          onClick: () => {
            instance.option('value', 'item2');
          },
        },
      }]);
    });

    const selectBox = new SelectBox(page);
    const actionButton = selectBox.getButton(0);

    await actionButton.click({ force: true });
    expect(await selectBox.isOpened()).toBe(false);
    expect(await selectBox.value).toBe('item1');
  });

  test('SelectBox: positioning content in the custom dropdown button', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'selectBox');

    await createWidget(page, 'dxSelectBox', {
      items: ['item1', 'item2'],
      value: 'item1',
      dropDownButtonTemplate() {
        return '<span style="line-height: 1">X</span>';
      },
    }, '#container');

    await testScreenshot(page, 'SelectBox Customize DropDown Button.png', { element: '#container' });
  });
});
