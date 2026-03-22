import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Calendar keyboard navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const CALENDAR_SELECTED_DATE_CLASS = 'dx-calendar-selected-date';
  const CALENDAR_CONTOURED_DATE_CLASS = 'dx-calendar-contoured-date';

  test('Tab navigation order prevButton-caption-nextButton-viewdWrapper-todayButton', async ({ page }) => {
    await createWidget(page, 'dxCalendar', {
    value: new Date(2021, 9, 17),
    showTodayButton: true,
  });

    const calendar = page.locator('#container');

    await page.locator('body').click()
      .pressKey('tab');

    await page.expect(calendar.getNavigatorPrevButton().isFocused)
      .ok()
      .pressKey('tab')
      .expect(calendar.getNavigatorCaption().isFocused)
      .ok()
      .pressKey('tab')
      .expect(calendar.getNavigatorNextButton().isFocused)
      .ok()
      .pressKey('tab');

    const cell = calendar.getView().getCellByDate(new Date(2021, 9, 17));
    await page.expect(cell.hasClass(CALENDAR_CONTOURED_DATE_CLASS))
      .ok()
      .expect(cell.hasClass(CALENDAR_SELECTED_DATE_CLASS))
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(calendar.getTodayButton().isFocused)
      .ok();

    await page.keyboard.press('Enter');

    const currentDate = await calendar.option('value') as Date;
    const today = new Date();

    currentDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    expect(currentDate).toBe(today);

    const todayCell = calendar.getView().getCellByDate(today);

    await page.expect(todayCell.hasClass(CALENDAR_SELECTED_DATE_CLASS))
      .ok();

    });

  test('focusin and focusout event handlers should not be called on tab navigate inside calendar', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onFocusInCounter = 0;
      (window as any).onFocusOutCounter = 0;
    });

    await createWidget(page, 'dxCalendar', {
      value: new Date(2021, 9, 17),
      showTodayButton: true,
      onFocusIn() {
        ((window as any).onFocusInCounter as number) += 1;
      },
      onFocusOut() {
        ((window as any).onFocusOutCounter as number) += 1;
      },
    });

    const calendar = page.locator('#container');

    await page.locator('body').click()
      .pressKey('tab');

    await page.expect(calendar.getNavigatorPrevButton().isFocused)
      .ok()
      .expect(ClientFunction(() => (window as any).onFocusInCounter)())
      .eql(1)
      .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
      .eql(0);

    await page.keyboard.press('Tab');

    await page.expect(calendar.getNavigatorCaption().isFocused)
      .ok()
      .expect(ClientFunction(() => (window as any).onFocusInCounter)())
      .eql(1)
      .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
      .eql(0);

    await page.keyboard.press('Tab');

    await page.expect(calendar.getNavigatorNextButton().isFocused)
      .ok()
      .expect(ClientFunction(() => (window as any).onFocusInCounter)())
      .eql(1)
      .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
      .eql(0);

    await page.keyboard.press('Tab');

    const cell = calendar.getView().getCellByDate(new Date(2021, 9, 17));
    await page.expect(cell.hasClass(CALENDAR_CONTOURED_DATE_CLASS))
      .ok()
      .expect(cell.hasClass(CALENDAR_SELECTED_DATE_CLASS))
      .ok()
      .expect(ClientFunction(() => (window as any).onFocusInCounter)())
      .eql(1)
      .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
      .eql(0);

    await page.keyboard.press('Tab');

    await page.expect(calendar.getTodayButton().isFocused)
      .ok()
      .expect(ClientFunction(() => (window as any).onFocusInCounter)())
      .eql(1)
      .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
      .eql(0);

    await page.keyboard.press('Tab');

    expect(calendar.isFocused).toBeFalsy()
      .expect(ClientFunction(() => (window as any).onFocusInCounter)())
      .eql(1)
      .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
      .eql(1);

    });
});
