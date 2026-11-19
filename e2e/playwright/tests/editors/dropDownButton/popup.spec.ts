import type { Locator, Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import DropDownButton from '../../../models/dropDownButton';

const getRect = (
  locator: Locator,
): Promise<{ left: number; top: number; bottom: number }> => locator.evaluate((element) => {
  const { left, top, bottom } = element.getBoundingClientRect();

  return { left, top, bottom };
});

const hasPageScroll = (page: Page): Promise<boolean> => page.evaluate(() => {
  const {
    scrollWidth, clientWidth, scrollHeight, clientHeight,
  } = document.documentElement;

  return scrollWidth > clientWidth || scrollHeight > clientHeight;
});

test.describe('Drop Down Button\'s Popup', () => {
  test('Popup should have correct position when DropDownButton is placed in the right bottom(T1034931)', async ({ page }) => {
    await createWidget(page, 'dxDropDownButton', {
      items: [1, 2, 3, 4, 5, 6, 7],
      elementAttr: { style: 'position: absolute; right: 10px; bottom: 10px;' },
      opened: true,
    });

    const dropDownButton = new DropDownButton(page, '#container');
    const popupContent = page.locator('.dx-overlay-content').first();

    await expect.poll(async () => {
      const buttonRect = await getRect(dropDownButton.element);
      const popupRect = await getRect(popupContent);

      return Math.abs(buttonRect.left - popupRect.left);
    }).toBeLessThan(1);
    await expect.poll(async () => {
      const buttonRect = await getRect(dropDownButton.element);
      const popupRect = await getRect(popupContent);

      return Math.abs(buttonRect.top - popupRect.bottom);
    }).toBeLessThan(1);
    await expect.poll(() => hasPageScroll(page)).toBe(false);
  });
});
