import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo } from '../../../playwright-helpers';
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

  const purePressKey = async (t, key): Promise<void> => {
    await page.pressKey(key)
      .wait(100);
  };

  test.skip('Click on action button should correctly work with SelectBox containing the field template (T811890)', async ({ page }) => {
    await createWidget(page, 'dxSelectBox', {
    items: ['item1', 'item2'],
    fieldTemplate: (value) => ($('<div>') as any).dxTextBox({ value }),
  });

    const selectBox = page.locator('#container');
    const { getInstance } = selectBox;

    await ClientFunction(
      () => {
        (getInstance() as any).option('buttons', [{
          name: 'test',
          options: {
            icon: 'home',
            onClick: () => {
              (getInstance() as any).option('value', 'item2');
              (getInstance() as any).focus(); // NOTE: need because of editor input rerendering
            },
          },
        }]);
      },
      { dependencies: { getInstance } },
    )();

    await selectBox.click();
    await purePressKey(t, 'alt+up');
    expect(selectBox.isFocused).toBeTruthy()
      .expect(await selectBox.isOpened())
      .notOk();

    const actionButton = selectBox.getButton(0);
    await actionButton.click()
      .expect(selectBox.isFocused).ok()
      .expect(selectBox.value)
      .eql('item2');

    });

  test.skip('Click on action button after typing should correctly work with SelectBox containing the field template (T811890)', async ({ page }) => {
    await createWidget(page, 'dxSelectBox', {
    items: ['item1', 'item2'],
    fieldTemplate: (value) => ($('<div>') as any).dxTextBox({ value }),
  });

    const selectBox = page.locator('#container');
    const { getInstance } = selectBox;

    await ClientFunction(
      () => {
        (getInstance() as any).option('buttons', [{
          name: 'test',
          options: {
            icon: 'home',
            onClick: () => {
              (getInstance() as any).option('value', 'item2');
              (getInstance() as any).focus(); // NOTE: need because of editor input rerendering
            },
          },
        }]);
      },
      { dependencies: { getInstance } },
    )();

    await selectBox.click();
    await purePressKey(t, 'alt+up');
    expect(selectBox.isFocused).toBeTruthy()
      .expect(await selectBox.isOpened())
      .notOk();

    const actionButton = selectBox.getButton(0);

    await selectBox.input.fill('tt');
    await actionButton.click()
      .expect(selectBox.isFocused).ok()
      .expect(selectBox.value)
      .eql('item2');

    });

  test.skip('editor can be focused out after click on action button', async ({ page }) => {
    await createWidget(page, 'dxSelectBox', {
    items: ['item1', 'item2'],
  });

    const selectBox = page.locator('#container');
    const { getInstance } = selectBox;

    await ClientFunction(
      () => {
        (getInstance() as any).option('buttons', [{
          name: 'test',
          options: {
            icon: 'home',
            onClick: () => {
              (getInstance() as any).option('value', 'item2');
            },
          },
        }]);
      },
      { dependencies: { getInstance } },
    )();

    await selectBox.click();
    expect(selectBox.isFocused).toBeTruthy();

    const actionButton = selectBox.getButton(0);
    await actionButton.click()
      .expect(selectBox.isFocused).ok();

    await purePressKey(t, 'tab');
    expect(selectBox.isFocused).toBeFalsy();

    });

  test.skip('selectbox should not be opened after click on disabled action button (T1117453)', async ({ page }) => {
    await createWidget(page, 'dxSelectBox', {
    items: ['item1', 'item2'],
    value: 'item1',
  });

    const selectBox = page.locator('#container');
    const { getInstance } = selectBox;

    await ClientFunction(
      () => {
        (getInstance() as any).option('buttons', [{
          name: 'test',
          options: {
            icon: 'home',
            type: 'default',
            disabled: true,
            onClick: () => {
              (getInstance() as any).option('value', 'item2');
            },
          },
        }]);
      },
      { dependencies: { getInstance } },
    )();

    const actionButton = selectBox.getButton(0);
    await actionButton.click()
      .expect(selectBox.isFocused)
      .notOk()
      .expect(await selectBox.isOpened())
      .notOk()
      .expect(selectBox.value)
      .eql('item1');

    });

  test.skip('SelectBox: positioning content in the custom dropdown button', async ({ page }) => {

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
