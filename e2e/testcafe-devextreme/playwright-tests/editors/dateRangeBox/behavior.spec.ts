import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import { DateRangeBox } from '../../../playwright-helpers/dateRangeBox';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

const getCounter = (page: any) => page.evaluate(() => (window as any).onValueChangedCounter);

test.describe('DateRangeBox behavior (applyValueMode=\'instantly\')', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Open by click on startDate input and select date in calendar, value: [null, null]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [null, null],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await dateRangeBox.getCalendarCell(10).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 6).toISOString(), null]);
    expect(await getCounter(page)).toEqual(1);

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await dateRangeBox.getCalendarCell(21).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 6).toISOString(), new Date(2021, 9, 17).toISOString()]);
    expect(await getCounter(page)).toEqual(2);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
  });

  test('Open by click on startDate input and reselect start date in calendar, value: ["2021/09/17", null]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [null, null],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await dateRangeBox.getCalendarCell(10).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 6).toISOString(), null]);
    expect(await getCounter(page)).toEqual(1);

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await dateRangeBox.getStartDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();

    await dateRangeBox.getCalendarCell(21).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), null]);
    expect(await getCounter(page)).toEqual(2);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await dateRangeBox.getCalendarCell(25).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 21).toISOString()]);
    expect(await getCounter(page)).toEqual(3);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
  });

  test('Open by click on endDate input and select date in calendar, value: [null, null]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [null, null],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getEndDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await dateRangeBox.getCalendarCell(21).click();
    expect(await dateRangeBox.option('value')).toEqual([null, new Date(2021, 9, 17).toISOString()]);
    expect(await getCounter(page)).toEqual(1);

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();

    await dateRangeBox.getCalendarCell(10).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 6).toISOString(), new Date(2021, 9, 17).toISOString()]);
    expect(await getCounter(page)).toEqual(2);

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await dateRangeBox.getCalendarCell(27).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 6).toISOString(), new Date(2021, 9, 23).toISOString()]);
    expect(await getCounter(page)).toEqual(3);

    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
  });

  test('Open by click on startDate input and select date in calendar < endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await dateRangeBox.getCalendarCell(10).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 6).toISOString(), new Date(2021, 9, 24).toISOString()]);
    expect(await getCounter(page)).toEqual(1);

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
  });

  test('Open by click on startDate input and select date in calendar > startDate, value: ["2021/09/17", "2021/09/28"]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 28)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await dateRangeBox.getCalendarCell(25).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 21).toISOString(), new Date(2021, 9, 28).toISOString()]);
    expect(await getCounter(page)).toEqual(1);

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
  });

  test('Open by click on startDate input and select date in calendar > endDate, value: ["2021/09/17", "2021/09/21"]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 21)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await dateRangeBox.getCalendarCell(30).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 26).toISOString(), null]);
    expect(await getCounter(page)).toEqual(1);

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await dateRangeBox.getStartDateBox().input.click();

    await dateRangeBox.getCalendarCell(31).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 27).toISOString(), null]);
    expect(await getCounter(page)).toEqual(2);

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await dateRangeBox.getStartDateBox().input.click();

    await dateRangeBox.getCalendarCell(32).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 28).toISOString(), null]);
    expect(await getCounter(page)).toEqual(3);

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
  });

  test('Open by click on endDate input and select date in calendar > endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getEndDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await dateRangeBox.getCalendarCell(30).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 26).toISOString()]);
    expect(await getCounter(page)).toEqual(1);

    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
  });

  test('Open by click on endDate input and select date in calendar < endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getEndDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await dateRangeBox.getCalendarCell(25).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 21).toISOString()]);
    expect(await getCounter(page)).toEqual(1);

    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
  });

  test('Open by click on endDate input and select date in calendar < startDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getEndDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await dateRangeBox.getCalendarCell(10).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 6).toISOString(), null]);
    expect(await getCounter(page)).toEqual(1);

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await dateRangeBox.getCalendarCell(9).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 5).toISOString(), null]);
    expect(await getCounter(page)).toEqual(2);

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await dateRangeBox.getCalendarCell(8).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 4).toISOString(), null]);
    expect(await getCounter(page)).toEqual(3);

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await dateRangeBox.getCalendarCell(10).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 4).toISOString(), new Date(2021, 9, 6).toISOString()]);
    expect(await getCounter(page)).toEqual(4);

    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
  });

  test('Open by click on endDate input and select date in calendar = endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getEndDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await dateRangeBox.getCalendarCell(28).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 24).toISOString()]);
    expect(await getCounter(page)).toEqual(0);

    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
  });

  test('Open by click on endDate input and select date in calendar = startDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getEndDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await dateRangeBox.getCalendarCell(21).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 17).toISOString()]);
    expect(await getCounter(page)).toEqual(1);

    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
  });

  test('Open by click on startDate input and select date in calendar = startDate -> endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await dateRangeBox.getCalendarCell(21).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 24).toISOString()]);
    expect(await getCounter(page)).toEqual(0);

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await dateRangeBox.getCalendarCell(28).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 24).toISOString()]);
    expect(await getCounter(page)).toEqual(0);

    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
  });

  test('Value in calendar should be updated by click on clear button if popup is open', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      opened: true,
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      showClearButton: true,
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    expect(await dateRangeBox.option('opened')).toEqual(true);

    await dateRangeBox.clearButton.click();
    expect(await dateRangeBox.option('value')).toEqual([null, null]);
    expect(await dateRangeBox.getCalendar().option('value')).toEqual([null, null]);
    expect(await getCounter(page)).toEqual(1);
  });

  test('Value in calendar should be updated after change start date value by keyboard and click on endDate input if popup is open', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      opened: false,
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      showClearButton: true,
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await page.keyboard.press('Backspace');
    await dateRangeBox.getStartDateBox().input.pressSequentially('0');

    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 24).toISOString()]);
    expect(await getCounter(page)).toEqual(0);

    await dateRangeBox.getEndDateBox().input.click();

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await getCounter(page)).toEqual(1);
  });

  test('Value in calendar should be updated after change start date value by keyboard and press `tab` if popup is open', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      opened: false,
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      showClearButton: true,
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await dateRangeBox.getStartDateBox().input.pressSequentially('19');

    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 24).toISOString()]);
    expect(await getCounter(page)).toEqual(0);

    await page.keyboard.press('Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await getCounter(page)).toEqual(1);
  });
});

test.describe('DateRangeBox behavior (applyValueMode=\'useButtons\')', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Value should be saved after select range in calendar and click on apply button, value: [null, null]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [null, null],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await dateRangeBox.getCalendarCell(10).click();
    expect(await dateRangeBox.option('value')).toEqual([null, null]);
    expect(await getCounter(page)).toEqual(0);

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await dateRangeBox.getCalendarCell(21).click();
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.option('value')).toEqual([null, null]);
    expect(await getCounter(page)).toEqual(0);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();

    await dateRangeBox.getPopup().getApplyButton().element.click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 6).toISOString(), new Date(2021, 9, 17).toISOString()]);
    expect(await getCounter(page)).toEqual(1);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
  });

  test('Value should not be saved after select range and click on cancel button', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [null, null],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();
    await dateRangeBox.getCalendarCell(10).click();
    await dateRangeBox.getCalendarCell(21).click();
    expect(await getCounter(page)).toEqual(0);

    await dateRangeBox.getPopup().getCancelButton().element.click();
    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.option('value')).toEqual([null, null]);
    expect(await getCounter(page)).toEqual(0);
  });

  test('Open by click on startDate input and reselect start date in calendar, value: [null, null]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [null, null],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await dateRangeBox.getCalendarCell(10).click();
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([null, null]);
    expect(await getCounter(page)).toEqual(0);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 6).toISOString(), null]);
    expect(await getCounter(page)).toEqual(1);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();

    await dateRangeBox.getStartDateBox().input.click();

    await dateRangeBox.getCalendarCell(21).click();
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 6).toISOString(), null]);
    expect(await getCounter(page)).toEqual(1);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), null]);
    expect(await getCounter(page)).toEqual(2);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
  });

  test('Open by click on endDate input and select date in calendar, value: [null, null]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [null, null],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getEndDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await dateRangeBox.getCalendarCell(21).click();
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([null, null]);
    expect(await getCounter(page)).toEqual(0);

    await dateRangeBox.getCalendarCell(10).click();
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([null, null]);
    expect(await getCounter(page)).toEqual(0);

    await dateRangeBox.getCalendarCell(27).click();
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([null, null]);
    expect(await getCounter(page)).toEqual(0);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 6).toISOString(), new Date(2021, 9, 23).toISOString()]);
    expect(await getCounter(page)).toEqual(1);
  });

  test('Open by click on startDate input and select date in calendar < endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await dateRangeBox.getCalendarCell(10).click();
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 24).toISOString()]);
    expect(await getCounter(page)).toEqual(0);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 6).toISOString(), new Date(2021, 9, 24).toISOString()]);
    expect(await getCounter(page)).toEqual(1);
  });

  test('Open by click on startDate input and select date in calendar > startDate, value: ["2021/09/17", "2021/09/28"]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 28)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();

    await dateRangeBox.getCalendarCell(25).click();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 28).toISOString()]);
    expect(await getCounter(page)).toEqual(0);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 21).toISOString(), new Date(2021, 9, 28).toISOString()]);
    expect(await getCounter(page)).toEqual(1);
  });

  test('Open by click on startDate input and select date in calendar > endDate, value: ["2021/09/17", "2021/09/21"]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 21)],
      openOnFieldClick: true,
      width: 500,
      applyValueMode: 'useButtons',
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();

    await dateRangeBox.getCalendarCell(30).click();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 21).toISOString()]);
    expect(await getCounter(page)).toEqual(0);

    await dateRangeBox.getStartDateBox().input.click();

    await dateRangeBox.getCalendarCell(31).click();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 21).toISOString()]);
    expect(await getCounter(page)).toEqual(0);

    await dateRangeBox.getStartDateBox().input.click();

    await dateRangeBox.getCalendarCell(32).click();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 21).toISOString()]);
    expect(await getCounter(page)).toEqual(0);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 28).toISOString(), null]);
    expect(await getCounter(page)).toEqual(1);
  });

  test('Open by click on endDate input and select date in calendar > endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getEndDateBox().input.click();

    await dateRangeBox.getCalendarCell(30).click();
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 24).toISOString()]);
    expect(await getCounter(page)).toEqual(0);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 26).toISOString()]);
    expect(await getCounter(page)).toEqual(1);
  });

  test('Open by click on endDate input and select date in calendar < endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getEndDateBox().input.click();

    await dateRangeBox.getCalendarCell(25).click();
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 24).toISOString()]);
    expect(await getCounter(page)).toEqual(0);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 21).toISOString()]);
    expect(await getCounter(page)).toEqual(1);
  });

  test('Open by click on endDate input and select date in calendar < startDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getEndDateBox().input.click();

    await dateRangeBox.getCalendarCell(10).click();
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 24).toISOString()]);
    expect(await getCounter(page)).toEqual(0);

    await dateRangeBox.getCalendarCell(9).click();
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 24).toISOString()]);
    expect(await getCounter(page)).toEqual(0);

    await dateRangeBox.getCalendarCell(8).click();
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 24).toISOString()]);
    expect(await getCounter(page)).toEqual(0);

    await dateRangeBox.getCalendarCell(10).click();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 24).toISOString()]);
    expect(await getCounter(page)).toEqual(0);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 4).toISOString(), new Date(2021, 9, 6).toISOString()]);
    expect(await getCounter(page)).toEqual(1);
  });

  test('Open by click on endDate input and select date in calendar = endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getEndDateBox().input.click();

    await dateRangeBox.getCalendarCell(28).click();
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 24).toISOString()]);
    expect(await getCounter(page)).toEqual(0);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 24).toISOString()]);
    expect(await getCounter(page)).toEqual(0);
  });

  test('Open by click on endDate input and select date in calendar = startDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getEndDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await dateRangeBox.getCalendarCell(21).click();
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 24).toISOString()]);
    expect(await getCounter(page)).toEqual(0);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 17).toISOString()]);
    expect(await getCounter(page)).toEqual(1);
  });

  test('Open by click on startDate input and select date in calendar = startDate -> endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await page.evaluate(() => { (window as any).onValueChangedCounter = 0; });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: { currentDate: new Date(2021, 9, 19) },
      onValueChanged() { ((window as any).onValueChangedCounter as number) += 1; },
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();

    await dateRangeBox.getCalendarCell(21).click();
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 24).toISOString()]);
    expect(await getCounter(page)).toEqual(0);

    await dateRangeBox.getCalendarCell(28).click();
    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 24).toISOString()]);
    expect(await getCounter(page)).toEqual(0);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.option('value')).toEqual([new Date(2021, 9, 17).toISOString(), new Date(2021, 9, 24).toISOString()]);
    expect(await getCounter(page)).toEqual(0);
  });
});
