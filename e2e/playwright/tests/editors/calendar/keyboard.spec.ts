import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import Calendar from '../../../models/calendar';
import { expectClass } from '../../../models/internal/classMatcher';

const CALENDAR_SELECTED_DATE_CLASS = 'dx-calendar-selected-date';
const CALENDAR_CONTOURED_DATE_CLASS = 'dx-calendar-contoured-date';

const expectFocusCounters = async (
  page: Page,
  focusInCount: number,
  focusOutCount: number,
): Promise<void> => {
  await expect.poll(() => page.evaluate(() => (window as any).onFocusInCounter))
    .toBe(focusInCount);
  await expect.poll(() => page.evaluate(() => (window as any).onFocusOutCounter))
    .toBe(focusOutCount);
};

test.describe('Calendar keyboard navigation', () => {
  test('Tab navigation order prevButton-caption-nextButton-viewdWrapper-todayButton', async ({ page }) => {
    await createWidget(page, 'dxCalendar', {
      value: new Date(2021, 9, 17),
      showTodayButton: true,
    });

    const calendar = new Calendar(page, '#container');

    await page.locator('body').click();
    await page.keyboard.press('Tab');

    await calendar.getNavigatorPrevButton().expectFocused();
    await page.keyboard.press('Tab');
    await calendar.getNavigatorCaption().expectFocused();
    await page.keyboard.press('Tab');
    await calendar.getNavigatorNextButton().expectFocused();
    await page.keyboard.press('Tab');

    const cell = calendar.getView().getCellByDate(new Date(2021, 9, 17));

    await expectClass(cell, CALENDAR_CONTOURED_DATE_CLASS);
    await expectClass(cell, CALENDAR_SELECTED_DATE_CLASS);

    await page.keyboard.press('Tab');

    await calendar.getTodayButton().expectFocused();

    await page.keyboard.press('Enter');

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    await expect.poll(async () => {
      const currentDate: Date = await calendar.option('value');

      currentDate.setHours(0, 0, 0, 0);

      return currentDate;
    }).toEqual(today);

    const todayCell = calendar.getView().getCellByDate(today);

    await expectClass(todayCell, CALENDAR_SELECTED_DATE_CLASS);
  });

  test('focusin and focusout event handlers should not be called on tab navigate inside calendar', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).onFocusInCounter = 0;
      (window as any).onFocusOutCounter = 0;
    });

    await createWidget(page, 'dxCalendar', () => ({
      value: new Date(2021, 9, 17),
      showTodayButton: true,
      onFocusIn() {
        ((window as any).onFocusInCounter as number) += 1;
      },
      onFocusOut() {
        ((window as any).onFocusOutCounter as number) += 1;
      },
    }));

    const calendar = new Calendar(page, '#container');

    await page.locator('body').click();
    await page.keyboard.press('Tab');

    await calendar.getNavigatorPrevButton().expectFocused();
    await expectFocusCounters(page, 1, 0);

    await page.keyboard.press('Tab');

    await calendar.getNavigatorCaption().expectFocused();
    await expectFocusCounters(page, 1, 0);

    await page.keyboard.press('Tab');

    await calendar.getNavigatorNextButton().expectFocused();
    await expectFocusCounters(page, 1, 0);

    await page.keyboard.press('Tab');

    const cell = calendar.getView().getCellByDate(new Date(2021, 9, 17));

    await expectClass(cell, CALENDAR_CONTOURED_DATE_CLASS);
    await expectClass(cell, CALENDAR_SELECTED_DATE_CLASS);
    await expectFocusCounters(page, 1, 0);

    await page.keyboard.press('Tab');

    await calendar.getTodayButton().expectFocused();
    await expectFocusCounters(page, 1, 0);

    await page.keyboard.press('Tab');

    await calendar.expectFocused(false);
    await expectFocusCounters(page, 1, 1);
  });
});
