import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

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

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [null, null],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.click(dateRangeBox.getCalendarCell(10))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 6), null])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.click(dateRangeBox.getCalendarCell(21))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 6), new Date(2021, 9, 17)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(2)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    });

  test('Open by click on startDate input and reselect start date in calendar, value: ["2021/09/17", null]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [null, null],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.click(dateRangeBox.getCalendarCell(10))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 6), null])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok();

    await page.click(dateRangeBox.getCalendarCell(21))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), null])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(2)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.click(dateRangeBox.getCalendarCell(25))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 21)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(3)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    });

  test('Open by click on endDate input and select date in calendar, value: [null, null]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [null, null],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.click(dateRangeBox.getCalendarCell(21))
      .expect(dateRangeBox.option('value'))
      .eql([null, new Date(2021, 9, 17)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok();

    await page.click(dateRangeBox.getCalendarCell(10))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 6), new Date(2021, 9, 17)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(2);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.click(dateRangeBox.getCalendarCell(27))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 6), new Date(2021, 9, 23)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(3);

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    });

  test('Open by click on startDate input and select date in calendar < endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.click(dateRangeBox.getCalendarCell(10))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 6), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    });

  test('Open by click on startDate input and select date in calendar > startDate, value: ["2021/09/17", "2021/09/28"]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 28)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.click(dateRangeBox.getCalendarCell(25))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 21), new Date(2021, 9, 28)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    });

  test('Open by click on startDate input and select date in calendar > endDate, value: ["2021/09/17", "2021/09/21"]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 21)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.click(dateRangeBox.getCalendarCell(30))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 26), null])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.click(dateRangeBox.getCalendarCell(31))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 27), null])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(2);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.click(dateRangeBox.getCalendarCell(32))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 28), null])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(3);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    });

  test('Open by click on endDate input and select date in calendar > endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.click(dateRangeBox.getCalendarCell(30))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 26)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1);

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    });

  test('Open by click on endDate input and select date in calendar < endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.click(dateRangeBox.getCalendarCell(25))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 21)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1);

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    });

  test('Open by click on endDate input and select date in calendar < startDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.click(dateRangeBox.getCalendarCell(10))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 6), null])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.click(dateRangeBox.getCalendarCell(9))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 5), null])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(2);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.click(dateRangeBox.getCalendarCell(8))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 4), null])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(3);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.click(dateRangeBox.getCalendarCell(10))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 4), new Date(2021, 9, 6)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(4);

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    });

  test('Open by click on endDate input and select date in calendar = endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.click(dateRangeBox.getCalendarCell(28))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    });

  test('Open by click on endDate input and select date in calendar = startDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.click(dateRangeBox.getCalendarCell(21))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 17)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1);

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    });

  test('Open by click on startDate input and select date in calendar = startDate -> endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.click(dateRangeBox.getCalendarCell(21))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.click(dateRangeBox.getCalendarCell(28))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    });

  test('Value in calendar should be updated by click on clear button if popup is open', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      opened: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      showClearButton: true,
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .click(dateRangeBox.clearButton)
      .expect(dateRangeBox.option('value'))
      .eql([null, null])
      .expect(dateRangeBox.getCalendar().option('value'))
      .eql([null, null])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1);

    });

  test('Value in calendar should be updated after change start date value by keyboard and click on endDate input if popup is open', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      opened: false,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      showClearButton: true,
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.keyboard.press('Backspace')
      .typeText(dateRangeBox.getStartDateBox().input, '0');

    await page.expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
      .expect(dateRangeBox.getCalendar().option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2020, 9, 17), new Date(2021, 9, 24)])
      .expect(dateRangeBox.getCalendar().option('value'))
      .eql([new Date(2020, 9, 17), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1);

    });

  test('Value in calendar should be updated after change start date value by keyboard and press `tab` if popup is open', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      opened: false,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      showClearButton: true,
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.keyboard.press('Backspace')
      .pressKey('backspace')
      .typeText(dateRangeBox.getStartDateBox().input, '19');

    await page.expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
      .expect(dateRangeBox.getCalendar().option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await page.keyboard.press('Tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2019, 9, 17), new Date(2021, 9, 24)])
      .expect(dateRangeBox.getCalendar().option('value'))
      .eql([new Date(2019, 9, 17), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1);

    await dateRangeBox.getEndDateBox().input.fill('10/24/2023')
      .click(dateRangeBox.getStartDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2019, 9, 17), new Date(2023, 9, 24)])
      .expect(dateRangeBox.getCalendar().option('value'))
      .eql([new Date(2019, 9, 17), new Date(2023, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(2);

    });

  test('Value should be saved after select range in calendar and click on apply button, value: [null, null]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [null, null],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.click(dateRangeBox.getCalendarCell(10))
      .expect(dateRangeBox.option('value'))
      .eql([null, null])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.click(dateRangeBox.getCalendarCell(21))
      .expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.option('value'))
      .eql([null, null])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok();

    await dateRangeBox.getPopup().getApplyButton().element.click()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 6), new Date(2021, 9, 17)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok();

    });

  test('Value should not be saved after select range and click on cancel button', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [null, null],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.click(dateRangeBox.getCalendarCell(10))
      .click(dateRangeBox.getCalendarCell(21))
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await dateRangeBox.getPopup().getCancelButton().element.click()
      .expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.option('value'))
      .eql([null, null])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    });

  test('Open by click on startDate input and reselect start date in calendar, value: [null, null]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [null, null],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.click(dateRangeBox.getCalendarCell(10))
      .expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([null, null])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await dateRangeBox.getPopup().getApplyButton().element.click()
      .expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 6), null])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok();

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.click(dateRangeBox.getCalendarCell(21))
      .expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 6), null])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1);

    await dateRangeBox.getPopup().getApplyButton().element.click()
      .expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), null])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(2)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok();

    });

  test('Open by click on endDate input and select date in calendar, value: [null, null]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [null, null],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.click(dateRangeBox.getCalendarCell(21))
      .expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([null, null])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await page.click(dateRangeBox.getCalendarCell(10))
      .expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([null, null])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await page.click(dateRangeBox.getCalendarCell(27))
      .expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([null, null])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await dateRangeBox.getPopup().getApplyButton().element.click()
      .expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 6), new Date(2021, 9, 23)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1);

    });

  test('Open by click on startDate input and select date in calendar < endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.click(dateRangeBox.getCalendarCell(10))
      .expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await dateRangeBox.getPopup().getApplyButton().element.click()
      .expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 6), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1);

    });

  test('Open by click on startDate input and select date in calendar > startDate, value: ["2021/09/17", "2021/09/28"]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 28)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.click(dateRangeBox.getCalendarCell(25))
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 28)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await dateRangeBox.getPopup().getApplyButton().element.click()
      .expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 21), new Date(2021, 9, 28)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1);

    });

  test('Open by click on startDate input and select date in calendar > endDate, value: ["2021/09/17", "2021/09/21"]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 21)],
      openOnFieldClick: true,
      width: 500,
      applyValueMode: 'useButtons',
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.click(dateRangeBox.getCalendarCell(30))
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 21)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.click(dateRangeBox.getCalendarCell(31))
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 21)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.click(dateRangeBox.getCalendarCell(32))
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 21)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await dateRangeBox.getPopup().getApplyButton().element.click()
      .expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 28), null])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1);

    });

  test('Open by click on endDate input and select date in calendar > endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.click(dateRangeBox.getCalendarCell(30))
      .expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await dateRangeBox.getPopup().getApplyButton().element.click()
      .expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 26)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1);

    });

  test('Open by click on endDate input and select date in calendar < endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.click(dateRangeBox.getCalendarCell(25))
      .expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await dateRangeBox.getPopup().getApplyButton().element.click()
      .expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 21)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1);

    });

  test('Open by click on endDate input and select date in calendar < startDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.click(dateRangeBox.getCalendarCell(10))
      .expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await page.click(dateRangeBox.getCalendarCell(9))
      .expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await page.click(dateRangeBox.getCalendarCell(8))
      .expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await page.click(dateRangeBox.getCalendarCell(10))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await dateRangeBox.getPopup().getApplyButton().element.click()
      .expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 4), new Date(2021, 9, 6)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1);

    });

  test('Open by click on endDate input and select date in calendar = endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.click(dateRangeBox.getCalendarCell(28))
      .expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await dateRangeBox.getPopup().getApplyButton().element.click()
      .expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    });

  test('Open by click on endDate input and select date in calendar = startDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.click(dateRangeBox.getCalendarCell(21))
      .expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await dateRangeBox.getPopup().getApplyButton().element.click()
      .expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 17)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(1);

    });

  test('Open by click on startDate input and select date in calendar = startDate -> endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onValueChangedCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      onValueChanged() {
        ((window as any).onValueChangedCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.click(dateRangeBox.getCalendarCell(21))
      .expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await page.click(dateRangeBox.getCalendarCell(28))
      .expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    await dateRangeBox.getPopup().getApplyButton().element.click()
      .expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 9, 17), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onValueChangedCounter)())
      .eql(0);

    });
});
