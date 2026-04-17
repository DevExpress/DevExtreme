import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import { DateRangeBox } from '../../../playwright-helpers/dateRangeBox';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('DateRangeBox focus state', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('DateRangeBox & DateBoxes should have focus class if inputs are focused by tab', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
      width: 500,
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();

    await page.keyboard.press('Tab');
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await page.keyboard.press('Tab');
    expect(await dateRangeBox.isFocused()).toBeFalsy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
  });

  test('DateRangeBox & DateBoxes should have focus class if inputs are focused by click', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
      width: 500,
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();

    await dateRangeBox.getEndDateBox().input.click();
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await page.locator('body').click({ position: { x: 0, y: 0 } });
    expect(await dateRangeBox.isFocused()).toBeFalsy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
  });

  test('DateRangeBox & Start DateBox should have focus class after click on drop down button', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.dropDownButton.click();
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
  });

  test('DateRangeBox & StartDateBox should be focused if dateRangeBox open by click on drop down button and endDateBox was focused', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getEndDateBox().element.click();
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await dateRangeBox.dropDownButton.click();
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
  });

  test('onFocusIn should be called only after first click on drop down button', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).onFocusInCounter = 0;
      (window as any).onFocusOutCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
      onFocusIn() { ((window as any).onFocusInCounter as number) += 1; },
      onFocusOut() { ((window as any).onFocusOutCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.element.click({ position: { x: 10, y: 10 } });
    expect(await dateRangeBox.option('opened')).toBeTruthy();
    expect(await page.evaluate(() => (window as any).onFocusInCounter)).toEqual(1);
    expect(await page.evaluate(() => (window as any).onFocusOutCounter)).toEqual(0);

    await dateRangeBox.dropDownButton.click();
    expect(await dateRangeBox.option('opened')).toBeFalsy();
    expect(await page.evaluate(() => (window as any).onFocusInCounter)).toEqual(1);
    expect(await page.evaluate(() => (window as any).onFocusOutCounter)).toEqual(0);

    await dateRangeBox.element.click({ position: { x: 10, y: 10 } });
    expect(await dateRangeBox.option('opened')).toBeTruthy();
    expect(await page.evaluate(() => (window as any).onFocusInCounter)).toEqual(1);
    expect(await page.evaluate(() => (window as any).onFocusOutCounter)).toEqual(0);
  });

  test('onFocusIn should be called only on focus of startDate input', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).onFocusInCounter = 0;
      (window as any).onFocusOutCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date('2021/09/17'), new Date('2021/10/24')],
      openOnFieldClick: true,
      width: 500,
      onFocusIn() { ((window as any).onFocusInCounter as number) += 1; },
      onFocusOut() { ((window as any).onFocusOutCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();
    expect(await page.evaluate(() => (window as any).onFocusInCounter)).toEqual(1);
    expect(await page.evaluate(() => (window as any).onFocusOutCounter)).toEqual(0);

    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => (window as any).onFocusInCounter)).toEqual(1);
    expect(await page.evaluate(() => (window as any).onFocusOutCounter)).toEqual(0);

    await dateRangeBox.getStartDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toBeTruthy();

    await dateRangeBox.getCalendarCell(10).click();
    expect(await page.evaluate(() => (window as any).onFocusInCounter)).toEqual(1);
    expect(await page.evaluate(() => (window as any).onFocusOutCounter)).toEqual(0);

    expect(await dateRangeBox.option('opened')).toBeTruthy();

    await dateRangeBox.getCalendarCell(20).click();
    expect(await page.evaluate(() => (window as any).onFocusInCounter)).toEqual(1);
    expect(await page.evaluate(() => (window as any).onFocusOutCounter)).toEqual(0);

    await page.keyboard.press('Shift+Tab');
    await page.waitForTimeout(100);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
    expect(await page.evaluate(() => (window as any).onFocusInCounter)).toEqual(1);
    expect(await page.evaluate(() => (window as any).onFocusOutCounter)).toEqual(0);

    await page.keyboard.press('Shift+Tab');
    await page.waitForTimeout(100);
    expect(await dateRangeBox.isFocused()).toBeFalsy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
    expect(await page.evaluate(() => (window as any).onFocusInCounter)).toEqual(1);
    expect(await page.evaluate(() => (window as any).onFocusOutCounter)).toEqual(1);
  });

  test('Click by separator element should focus DateRangeBox or leave active input focused without call onFocusIn event handler', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).onFocusInCounter = 0;
      (window as any).onFocusOutCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
      width: 500,
      onFocusIn() { ((window as any).onFocusInCounter as number) += 1; },
      onFocusOut() { ((window as any).onFocusOutCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.separator.click();
    expect(await dateRangeBox.option('opened')).toBeFalsy();
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
    expect(await page.evaluate(() => (window as any).onFocusInCounter)).toEqual(1);
    expect(await page.evaluate(() => (window as any).onFocusOutCounter)).toEqual(0);

    await dateRangeBox.separator.click();
    expect(await dateRangeBox.option('opened')).toBeFalsy();
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
    expect(await page.evaluate(() => (window as any).onFocusInCounter)).toEqual(1);
    expect(await page.evaluate(() => (window as any).onFocusOutCounter)).toEqual(0);

    await dateRangeBox.getEndDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toBeTruthy();
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
    expect(await page.evaluate(() => (window as any).onFocusInCounter)).toEqual(1);
    expect(await page.evaluate(() => (window as any).onFocusOutCounter)).toEqual(0);

    await dateRangeBox.separator.click();
    expect(await dateRangeBox.option('opened')).toBeTruthy();
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
    expect(await page.evaluate(() => (window as any).onFocusInCounter)).toEqual(1);
    expect(await page.evaluate(() => (window as any).onFocusOutCounter)).toEqual(0);

    await page.locator('body').click({ position: { x: 0, y: 0 } });
    expect(await dateRangeBox.option('opened')).toBeFalsy();
    expect(await dateRangeBox.isFocused()).toBeFalsy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
    expect(await page.evaluate(() => (window as any).onFocusInCounter)).toEqual(1);
    expect(await page.evaluate(() => (window as any).onFocusOutCounter)).toEqual(1);
  });

  test('EndDateBox should be stay focused after close popup by click on drop down button', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date('2021/09/17'), new Date('2021/10/24')],
      openOnFieldClick: false,
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.element.click({ position: { x: 10, y: 10 } });
    expect(await dateRangeBox.option('opened')).toBeTruthy();

    await dateRangeBox.getCalendarCell(10).click();
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await dateRangeBox.dropDownButton.click();
    expect(await dateRangeBox.option('opened')).toBeFalsy();
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
  });

  test('DateRangeBox & StartDateBox should be focused after click on clear button', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      showClearButton: true,
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getEndDateBox().element.click();
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await dateRangeBox.clearButton.click();
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
  });

  test('DateRangeBox & StartDateBox should be focused and stay opened after click on clear button when popup is opened', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      showClearButton: true,
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().element.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();

    await dateRangeBox.clearButton.click();
    await page.waitForTimeout(500);
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
  });

  test('DateRangeBox & StartDateBox should be focused if startDateBox open by keyboard, alt+down, alt+up', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();

    await page.keyboard.press('Alt+ArrowDown');
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();

    await page.keyboard.press('Alt+ArrowUp');
    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
  });

  test('DateRangeBox & StartDateBox should be focused if endDateBox open and close by keyboard, alt+down, alt+up', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getEndDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await page.keyboard.press('Alt+ArrowDown');
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await page.keyboard.press('Alt+ArrowUp');
    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
  });

  test('Opened dateRangeBox should not be closed after click on inputs, openOnFieldClick: true', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
      opened: true,
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();

    await dateRangeBox.getEndDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await dateRangeBox.getStartDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
  });

  test('Opened dateRangeBox should be closed after outside click, openOnFieldClick: true', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      width: 500,
      openOnFieldClick: true,
      opened: true,
    });

    const dateRangeBox = new DateRangeBox(page);

    await page.locator('body').click({ position: { x: 0, y: 0 } });
    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.isFocused()).toBeFalsy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();

    await dateRangeBox.dropDownButton.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
  });

});

