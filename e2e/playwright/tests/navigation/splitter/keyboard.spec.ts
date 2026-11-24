import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import Splitter from '../../../models/splitter';

test.describe('Splitter_keyboard', () => {
  test('The next resize handle should be focused after tab press', async ({ page }) => {
    await createWidget(page, 'dxSplitter', {
      width: 400,
      height: 400,
      dataSource: [
        { text: 'Pane_1' },
        { text: 'Pane_2' },
        { text: 'Pane_2' },
      ],
    });

    const splitter = new Splitter(page, '#container');

    await splitter.getResizeHandles().nth(0).click();

    await splitter.getResizeHandle(0).expectFocused();
    await splitter.getResizeHandle(1).expectFocused(false);

    await page.keyboard.press('Tab');

    await splitter.getResizeHandle(0).expectFocused(false);
    await splitter.getResizeHandle(1).expectFocused();
  });

  test('The previous resize handle should be focused after shift+tab press', async ({ page }) => {
    await createWidget(page, 'dxSplitter', {
      width: 400,
      height: 400,
      dataSource: [
        { text: 'Pane_1' },
        { text: 'Pane_2' },
        { text: 'Pane_2' },
      ],
    });

    const splitter = new Splitter(page, '#container');

    await splitter.getResizeHandles().nth(1).click();

    await splitter.getResizeHandle(1).expectFocused();
    await splitter.getResizeHandle(0).expectFocused(false);

    await page.keyboard.press('Shift+Tab');

    await splitter.getResizeHandle(1).expectFocused(false);
    await splitter.getResizeHandle(0).expectFocused();
  });

  [true, false].forEach((allowKeyboardNavigation) => {
    test(`The resize handle should not change its focused state after the pane collapses, allowKeyboardNavigation=${allowKeyboardNavigation}`, async ({ page }) => {
      await createWidget(page, 'dxSplitter', {
        width: 400,
        height: 400,
        allowKeyboardNavigation,
        dataSource: [
          { text: 'Pane_1', collapsible: true },
          { text: 'Pane_2' },
        ],
      });

      const splitter = new Splitter(page, '#container');

      await splitter.getResizeHandle(0).getCollapsePrev().click();

      await splitter.getResizeHandle(0).expectFocused(allowKeyboardNavigation);
    });
  });
});
