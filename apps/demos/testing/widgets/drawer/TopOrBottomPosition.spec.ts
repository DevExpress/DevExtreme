import { test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const RADIO_GROUP_CLASS = 'dx-radiogroup';
const RADIO_BUTTON_CLASS = 'dx-radiobutton';
const TOOLBAR_CLASS = 'dx-toolbar';
const BUTTON_CLASS = 'dx-button';

const getElements = (page: Page) => {
  const optionsGroup = page.locator(`.${RADIO_GROUP_CLASS}`);

  return {
    menuButton: page.locator(`.${TOOLBAR_CLASS} .${BUTTON_CLASS}`).first(),
    openedStateModes: optionsGroup.nth(0).locator(`.${RADIO_BUTTON_CLASS}`),
    positions: optionsGroup.nth(1).locator(`.${RADIO_BUTTON_CLASS}`),
  };
};

describeManualTest('Drawer', 'TopOrBottomPosition', { width: 900, height: 1200 }, () => {
  test('TopOrBottomPosition -> position: bottom -> openedStateMode: overlap -> open -> resize -> close', async ({ page }) => {
    const { menuButton, openedStateModes, positions } = getElements(page);

    await positions.nth(1).click();
    await openedStateModes.nth(2).click();

    await testScreenshot(page, 'drawer(overlap, bottom, expand).png');

    await menuButton.click();

    await testScreenshot(page, 'drawer_opened(overlap, bottom, expand).png');

    await page.setViewportSize({ width: 900, height: 1000 });

    await testScreenshot(page, 'drawer_after_resize(overlap, bottom, expand).png');

    await page.setViewportSize({ width: 900, height: 1200 });

    await menuButton.click();

    await testScreenshot(page, 'drawer_closed(overlap, bottom, expand).png');
  });

  test('TopOrBottomPosition -> openedStateMode: overlap -> position: bottom -> open -> resize -> close', async ({ page }) => {
    const { menuButton, openedStateModes, positions } = getElements(page);

    await openedStateModes.nth(2).click();
    await positions.nth(1).click();

    // The focus is on the other radio button than in the first test, so the shot has its own etalon.
    await testScreenshot(page, 'drawer(overlap, bottom, expand, position last).png');

    await menuButton.click();

    await testScreenshot(page, 'drawer_opened(overlap, bottom, expand).png');

    await page.setViewportSize({ width: 900, height: 1000 });

    await testScreenshot(page, 'drawer_after_resize(overlap, bottom, expand).png');

    await page.setViewportSize({ width: 900, height: 1200 });

    await menuButton.click();

    await testScreenshot(page, 'drawer_closed(overlap, bottom, expand).png');
  });
});
