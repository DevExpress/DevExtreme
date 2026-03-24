import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
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

  test.skip('DateRangeBox & DateBoxes should have focus class if inputs are focused by tab', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
    value: ['2021/09/17', '2021/10/24'],
    openOnFieldClick: false,
    width: 500,
  });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

    await page.keyboard.press('Tab')
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.keyboard.press('Tab')
      .expect(dateRangeBox.isFocused)
      .notOk()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

    });

  test.skip('DateRangeBox & DateBoxes should have focus class if inputs are focused by click', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
    value: ['2021/09/17', '2021/10/24'],
    openOnFieldClick: false,
    width: 500,
  });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

    await page.click(dateRangeBox.getEndDateBox().input)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.click(page.locator('body'), { offsetX: -50 })
      .expect(dateRangeBox.isFocused)
      .notOk()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

    });

  test.skip('DateRangeBox & Start DateBox should have focus class after click on drop down button', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
    value: ['2021/09/17', '2021/10/24'],
    openOnFieldClick: false,
  });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.dropDownButton)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

    });

  test.skip('DateRangeBox & StartDateBox should be focused if dateRangeBox open by click on drop down button and endDateBox was focused', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
    value: ['2021/09/17', '2021/10/24'],
    openOnFieldClick: false,
  });

    const dateRangeBox = page.locator('#container');

    await dateRangeBox.getEndDateBox().element.click();

    expect(dateRangeBox.isFocused).toBeTruthy()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.click(dateRangeBox.dropDownButton);

    expect(dateRangeBox.isFocused).toBeTruthy()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

    });

  test.skip('onFocusIn should be called only after first click on drop down button', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onFocusInCounter = 0;
      (window as any).onFocusOutCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
      onFocusIn() {
        ((window as any).onFocusInCounter as number) += 1;
      },
      onFocusOut() {
        ((window as any).onFocusOutCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.element, { offsetX: -20, offsetY: -20 });

    await page.expect(dateRangeBox.option('opened'))
      .ok();

    await page.expect(ClientFunction(() => (window as any).onFocusInCounter)())
      .eql(1)
      .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
      .eql(0);

    await page.click(dateRangeBox.dropDownButton);

    await page.expect(dateRangeBox.option('opened'))
      .notOk()
      .expect(ClientFunction(() => (window as any).onFocusInCounter)())
      .eql(1)
      .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
      .eql(0);

    await page.click(dateRangeBox.element, { offsetX: -20, offsetY: -20 });

    await page.expect(dateRangeBox.option('opened'))
      .ok()
      .expect(ClientFunction(() => (window as any).onFocusInCounter)())
      .eql(1)
      .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
      .eql(0);

    });

  test.skip('onFocusIn should be called only on focus of startDate input', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onFocusInCounter = 0;
      (window as any).onFocusOutCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date('2021/09/17'), new Date('2021/10/24')],
      openOnFieldClick: true,
      width: 500,
      onFocusIn() {
        ((window as any).onFocusInCounter as number) += 1;
      },
      onFocusOut() {
        ((window as any).onFocusOutCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.expect(ClientFunction(() => (window as any).onFocusInCounter)())
      .eql(1)
      .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
      .eql(0);

    await page.keyboard.press('Tab');

    await page.expect(ClientFunction(() => (window as any).onFocusInCounter)())
      .eql(1)
      .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
      .eql(0);

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .ok()
      .click(dateRangeBox.getCalendarCell(10))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 8, 8), new Date(2021, 9, 24)])
      .expect(ClientFunction(() => (window as any).onFocusInCounter)())
      .eql(1)
      .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
      .eql(0);

    await page.expect(dateRangeBox.option('opened'))
      .ok()
      .click(dateRangeBox.getCalendarCell(20))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 8, 8), new Date(2021, 8, 18)])
      .expect(ClientFunction(() => (window as any).onFocusInCounter)())
      .eql(1)
      .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
      .eql(0);

    await page.keyboard.press('shift+tab')
      .wait(100)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk()
      .expect(ClientFunction(() => (window as any).onFocusInCounter)())
      .eql(1)
      .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
      .eql(0);

    await page.keyboard.press('shift+tab')
      .wait(100)
      .expect(dateRangeBox.isFocused)
      .notOk()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk()
      .expect(ClientFunction(() => (window as any).onFocusInCounter)())
      .eql(1)
      .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
      .eql(1);

    });

  test.skip('Click by separator element should focus DateRangeBox or leave active input focused without call onFocusIn event handler', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).onFocusInCounter = 0;
      (window as any).onFocusOutCounter = 0;
    });

    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
      width: 500,
      onFocusIn() {
        ((window as any).onFocusInCounter as number) += 1;
      },
      onFocusOut() {
        ((window as any).onFocusOutCounter as number) += 1;
      },
    });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.separator);

    await page.expect(dateRangeBox.option('opened'))
      .notOk()
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk()
      .expect(ClientFunction(() => (window as any).onFocusInCounter)())
      .eql(1)
      .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
      .eql(0);

    await page.click(dateRangeBox.separator);

    await page.expect(dateRangeBox.option('opened'))
      .notOk()
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk()
      .expect(ClientFunction(() => (window as any).onFocusInCounter)())
      .eql(1)
      .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
      .eql(0);

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .ok()
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok()
      .expect(ClientFunction(() => (window as any).onFocusInCounter)())
      .eql(1)
      .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
      .eql(0);

    await page.click(dateRangeBox.separator);

    await page.expect(dateRangeBox.option('opened'))
      .ok()
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok()
      .expect(ClientFunction(() => (window as any).onFocusInCounter)())
      .eql(1)
      .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
      .eql(0);

    await page.click(page.locator('body'), { offsetX: -50 })
      .expect(dateRangeBox.option('opened'))
      .notOk()
      .expect(dateRangeBox.isFocused)
      .notOk()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk()
      .expect(ClientFunction(() => (window as any).onFocusInCounter)())
      .eql(1)
      .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
      .eql(1);

    });

  test.skip('EndDateBox should be stay focused after close popup by click on drop down button', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
    value: [new Date('2021/09/17'), new Date('2021/10/24')],
    openOnFieldClick: false,
  });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.element, { offsetX: -20, offsetY: -20 });

    await page.expect(dateRangeBox.option('opened'))
      .ok();

    await page.click(dateRangeBox.getCalendarCell(10))
      .expect(dateRangeBox.option('value'))
      .eql([new Date(2021, 8, 8), new Date(2021, 9, 24)])
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.click(dateRangeBox.dropDownButton);

    await page.expect(dateRangeBox.option('opened'))
      .notOk()
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    });

  test.skip('DateRangeBox & StartDateBox should be focused after click on clear button', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
    showClearButton: true,
    value: ['2021/09/17', '2021/10/24'],
    openOnFieldClick: false,
  });

    const dateRangeBox = page.locator('#container');

    await dateRangeBox.getEndDateBox().element.click();

    expect(dateRangeBox.isFocused).toBeTruthy()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.click(dateRangeBox.clearButton);

    expect(dateRangeBox.isFocused).toBeTruthy()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

    });

  test.skip('DateRangeBox & StartDateBox should be focused and stay opened after click on clear button when popup is opened', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
    showClearButton: true,
    value: ['2021/09/17', '2021/10/24'],
    openOnFieldClick: true,
  }, '#container');

    const dateRangeBox = page.locator('#container');

    await dateRangeBox.getStartDateBox().element.click();

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

    await page.click(dateRangeBox.clearButton);

    await page.waitForTimeout(500);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

    });

  test.skip('DateRangeBox & StartDateBox should be focused after click on clear button (opened)', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
    showClearButton: true,
    value: [null, '2021/10/24'],
    openOnFieldClick: false,
    opened: true,
  });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getEndDateBox().input)
      .click(dateRangeBox.dropDownButton);

    expect(dateRangeBox.isFocused).toBeTruthy()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.click(dateRangeBox.clearButton);

    expect(dateRangeBox.isFocused).toBeTruthy()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

    });

  test.skip('DateRangeBox & StartDateBox should be focused if startDateBox open by keyboard, alt+down, alt+up', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
    value: ['2021/09/17', '2021/10/24'],
    openOnFieldClick: false,
  });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

    await page.keyboard.press('alt+down');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

    await page.keyboard.press('alt+up');

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

    });

  test.skip('DateRangeBox & StartDateBox should be focused if endDateBox open and close by keyboard, alt+down, alt+up', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
    value: ['2021/09/17', '2021/10/24'],
    openOnFieldClick: false,
  });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.keyboard.press('alt+down');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.keyboard.press('alt+up');

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    });

  test.skip('Opened dateRangeBox should not be closed after click on inputs, openOnFieldClick: true', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
    value: ['2021/09/17', '2021/10/24'],
    openOnFieldClick: true,
    opened: true,
  });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

    });

  test.skip('Opened dateRangeBox should be closed after outside click, openOnFieldClick: true', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
    value: ['2021/09/17', '2021/10/24'],
    width: 500,
    openOnFieldClick: true,
    opened: true,
  });

    const dateRangeBox = page.locator('#container');

    await page.click(page.locator('body'), { offsetX: -50 });

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.isFocused)
      .notOk()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

    await page.click(dateRangeBox.dropDownButton);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

    });

  // TODO: find way to reproduce focus using accessKey accessKey
  test.skip('DateRangeBox and StartDateBox should have focus class after focus via accessKey', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
    accessKey: 'x',
    openOnFieldClick: false,
  });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.keyboard.press('alt+x');

    expect(dateRangeBox.isFocused).toBeTruthy()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

    });
});
