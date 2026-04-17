import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe.skip('Calendar keyboard navigation', () => {
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

    await page.locator('body').click();
    await page.keyboard.press('Tab');

    const prevButton = page.locator('#container .dx-calendar-navigator-previous-view');
    await expect(prevButton).toHaveClass(/dx-state-focused/);

    await page.keyboard.press('Tab');
    const caption = page.locator('#container .dx-calendar-caption-button');
    await expect(caption).toHaveClass(/dx-state-focused/);

    await page.keyboard.press('Tab');
    const nextButton = page.locator('#container .dx-calendar-navigator-next-view');
    await expect(nextButton).toHaveClass(/dx-state-focused/);

    await page.keyboard.press('Tab');

    const cell = page.locator(`#container td[data-value="2021/10/17"]`);
    await expect(cell).toHaveClass(new RegExp(CALENDAR_CONTOURED_DATE_CLASS));
    await expect(cell).toHaveClass(new RegExp(CALENDAR_SELECTED_DATE_CLASS));

    await page.keyboard.press('Tab');

    const todayButton = page.locator('#container .dx-calendar-today-button');
    await expect(todayButton).toHaveClass(/dx-state-focused/);

    await page.keyboard.press('Enter');

    const currentValue = await page.evaluate(() => {
      const instance = ($('#container') as any).dxCalendar('instance');
      return instance.option('value');
    });
    const currentDate = new Date(currentValue);
    const today = new Date();

    expect(currentDate.getFullYear()).toBe(today.getFullYear());
    expect(currentDate.getMonth()).toBe(today.getMonth());
    expect(currentDate.getDate()).toBe(today.getDate());

    const todayFormatted = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
    const todayCell = page.locator(`#container td[data-value="${todayFormatted}"]`);
    await expect(todayCell).toHaveClass(new RegExp(CALENDAR_SELECTED_DATE_CLASS));
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

    await page.locator('body').click();
    await page.keyboard.press('Tab');

    const prevButton = page.locator('#container .dx-calendar-navigator-previous-view');
    await expect(prevButton).toHaveClass(/dx-state-focused/);
    expect(await page.evaluate(() => (window as any).onFocusInCounter)).toBe(1);
    expect(await page.evaluate(() => (window as any).onFocusOutCounter)).toBe(0);

    await page.keyboard.press('Tab');
    const caption = page.locator('#container .dx-calendar-caption-button');
    await expect(caption).toHaveClass(/dx-state-focused/);
    expect(await page.evaluate(() => (window as any).onFocusInCounter)).toBe(1);
    expect(await page.evaluate(() => (window as any).onFocusOutCounter)).toBe(0);

    await page.keyboard.press('Tab');
    const nextButton = page.locator('#container .dx-calendar-navigator-next-view');
    await expect(nextButton).toHaveClass(/dx-state-focused/);
    expect(await page.evaluate(() => (window as any).onFocusInCounter)).toBe(1);
    expect(await page.evaluate(() => (window as any).onFocusOutCounter)).toBe(0);

    await page.keyboard.press('Tab');
    const cell = page.locator(`#container td[data-value="2021/10/17"]`);
    await expect(cell).toHaveClass(new RegExp(CALENDAR_CONTOURED_DATE_CLASS));
    await expect(cell).toHaveClass(new RegExp(CALENDAR_SELECTED_DATE_CLASS));
    expect(await page.evaluate(() => (window as any).onFocusInCounter)).toBe(1);
    expect(await page.evaluate(() => (window as any).onFocusOutCounter)).toBe(0);

    await page.keyboard.press('Tab');
    const todayButton = page.locator('#container .dx-calendar-today-button');
    await expect(todayButton).toHaveClass(/dx-state-focused/);
    expect(await page.evaluate(() => (window as any).onFocusInCounter)).toBe(1);
    expect(await page.evaluate(() => (window as any).onFocusOutCounter)).toBe(0);

    await page.keyboard.press('Tab');
    const calendarFocused = await page.evaluate(() => {
      return document.querySelector('#container')?.classList.contains('dx-state-focused') ?? false;
    });
    expect(calendarFocused).toBe(false);
    expect(await page.evaluate(() => (window as any).onFocusInCounter)).toBe(1);
    expect(await page.evaluate(() => (window as any).onFocusOutCounter)).toBe(1);
  });
});
