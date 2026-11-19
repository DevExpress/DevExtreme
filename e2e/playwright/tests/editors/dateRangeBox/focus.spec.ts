import type { Locator, Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { addFocusableElementBefore } from '../../../helpers/domUtils';
import DateRangeBox from '../../../models/dateRangeBox';

const createDateRangeBoxWithFocusCounters = async (page: Page, options: object): Promise<void> => {
  await page.evaluate(() => {
    (window as any).onFocusInCounter = 0;
    (window as any).onFocusOutCounter = 0;
  });

  await createWidget(page, 'dxDateRangeBox', (config) => ({
    ...config,
    onFocusIn() {
      ((window as any).onFocusInCounter as number) += 1;
    },
    onFocusOut() {
      ((window as any).onFocusOutCounter as number) += 1;
    },
  }), '#container', { arg: options });
};

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

const expectOpened = async (dateRangeBox: DateRangeBox, opened = true): Promise<void> => {
  await expect.poll(() => dateRangeBox.option('opened')).toBe(opened);
};

const expectFocusState = async (
  dateRangeBox: DateRangeBox,
  isDateRangeBoxFocused: boolean,
  isStartDateBoxFocused: boolean,
  isEndDateBoxFocused: boolean,
): Promise<void> => {
  await dateRangeBox.expectFocused(isDateRangeBoxFocused);
  await dateRangeBox.getStartDateBox().expectFocused(isStartDateBoxFocused);
  await dateRangeBox.getEndDateBox().expectFocused(isEndDateBoxFocused);
};

// The TestCafe click offsets: a negative one counts from the opposite edge, a missing one is the
// middle of the element.
const clickWithOffset = async (
  target: Locator,
  offsetX?: number,
  offsetY?: number,
): Promise<void> => {
  const { width, height } = (await target.boundingBox())!;
  const getPosition = (offset: number | undefined, size: number): number => {
    if (offset === undefined) {
      return Math.round(size / 2);
    }

    return offset < 0 ? size + offset : offset;
  };

  await target.click({
    position: { x: getPosition(offsetX, width), y: getPosition(offsetY, height) },
  });
};

test.describe('DateRangeBox focus state', () => {
  test('DateRangeBox & DateBoxes should have focus class if inputs are focused by tab', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
      width: 500,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();
    await expectFocusState(dateRangeBox, true, true, false);

    await page.keyboard.press('Tab');
    await expectFocusState(dateRangeBox, true, false, true);

    await page.keyboard.press('Tab');
    await expectFocusState(dateRangeBox, false, false, false);
  });

  test('DateRangeBox & DateBoxes should have focus class if inputs are focused by click', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
      width: 500,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();
    await expectFocusState(dateRangeBox, true, true, false);

    await dateRangeBox.getEndDateBox().input.click();
    await expectFocusState(dateRangeBox, true, false, true);

    await clickWithOffset(page.locator('body'), -50);
    await expectFocusState(dateRangeBox, false, false, false);
  });

  test('DateRangeBox & Start DateBox should have focus class after click on drop down button', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.dropDownButton.click();
    await expectFocusState(dateRangeBox, true, true, false);
  });

  test('DateRangeBox & StartDateBox should be focused if dateRangeBox open by click on drop down button and endDateBox was focused', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().element.click();

    await expectFocusState(dateRangeBox, true, false, true);

    await dateRangeBox.dropDownButton.click();

    await expectFocusState(dateRangeBox, true, true, false);
  });

  test('onFocusIn should be called only after first click on drop down button', async ({ page }) => {
    await createDateRangeBoxWithFocusCounters(page, {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await clickWithOffset(dateRangeBox.element, -20, -20);

    await expectOpened(dateRangeBox);

    await expectFocusCounters(page, 1, 0);

    await dateRangeBox.dropDownButton.click();

    await expectOpened(dateRangeBox, false);
    await expectFocusCounters(page, 1, 0);

    await clickWithOffset(dateRangeBox.element, -20, -20);

    await expectOpened(dateRangeBox);
    await expectFocusCounters(page, 1, 0);
  });

  test('onFocusIn should be called only on focus of startDate input', async ({ page }) => {
    await createDateRangeBoxWithFocusCounters(page, {
      value: [new Date('2021/09/17'), new Date('2021/10/24')],
      openOnFieldClick: true,
      width: 500,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');
    const focusableElementBeforeDateRangeBox = page.locator('#focusable-start');

    await addFocusableElementBefore(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();

    await expectFocusCounters(page, 1, 0);

    await page.keyboard.press('Tab');

    await expectFocusCounters(page, 1, 0);

    await dateRangeBox.getStartDateBox().input.click();

    await expectOpened(dateRangeBox);
    await dateRangeBox.getCalendarCell(10).click();
    await expect.poll(() => dateRangeBox.option('value'))
      .toEqual([new Date(2021, 8, 8), new Date(2021, 9, 24)]);
    await expectFocusCounters(page, 1, 0);

    await expectOpened(dateRangeBox);
    await dateRangeBox.getCalendarCell(20).click();
    await expect.poll(() => dateRangeBox.option('value'))
      .toEqual([new Date(2021, 8, 8), new Date(2021, 8, 18)]);
    await expectOpened(dateRangeBox, false);
    await expectFocusCounters(page, 1, 0);

    await page.keyboard.press('Shift+Tab');
    await expectFocusState(dateRangeBox, true, true, false);
    await expectFocusCounters(page, 1, 0);

    await page.keyboard.press('Shift+Tab');
    await expectFocusState(dateRangeBox, false, false, false);
    await expect(focusableElementBeforeDateRangeBox).toBeFocused();
    await expectFocusCounters(page, 1, 1);
  });

  test('Click by separator element should focus DateRangeBox or leave active input focused without call onFocusIn event handler', async ({ page }) => {
    await createDateRangeBoxWithFocusCounters(page, {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
      width: 500,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.separator.click();

    await expectOpened(dateRangeBox, false);
    await expectFocusState(dateRangeBox, true, true, false);
    await expectFocusCounters(page, 1, 0);

    await dateRangeBox.separator.click();

    await expectOpened(dateRangeBox, false);
    await expectFocusState(dateRangeBox, true, true, false);
    await expectFocusCounters(page, 1, 0);

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, false, true);
    await expectFocusCounters(page, 1, 0);

    await dateRangeBox.separator.click();

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, false, true);
    await expectFocusCounters(page, 1, 0);

    await clickWithOffset(page.locator('body'), -50);
    await expectOpened(dateRangeBox, false);
    await expectFocusState(dateRangeBox, false, false, false);
    await expectFocusCounters(page, 1, 1);
  });

  test('EndDateBox should be stay focused after close popup by click on drop down button', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date('2021/09/17'), new Date('2021/10/24')],
      openOnFieldClick: false,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await clickWithOffset(dateRangeBox.element, -20, -20);

    await expectOpened(dateRangeBox);

    await dateRangeBox.getCalendarCell(10).click();
    await expect.poll(() => dateRangeBox.option('value'))
      .toEqual([new Date(2021, 8, 8), new Date(2021, 9, 24)]);
    await expectFocusState(dateRangeBox, true, false, true);

    await dateRangeBox.dropDownButton.click();

    await expectOpened(dateRangeBox, false);
    await expectFocusState(dateRangeBox, true, false, true);
  });

  test('DateRangeBox & StartDateBox should be focused after click on clear button', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      showClearButton: true,
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().element.click();

    await expectFocusState(dateRangeBox, true, false, true);

    await dateRangeBox.clearButton.click();

    await expectFocusState(dateRangeBox, true, true, false);
  });

  test('DateRangeBox & StartDateBox should be focused and stay opened after click on clear button when popup is opened', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      showClearButton: true,
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
    }, '#container');

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().element.click();

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, true, false);

    await dateRangeBox.clearButton.click();

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, true, false);
  });

  test('DateRangeBox & StartDateBox should be focused after click on clear button, opened: true', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      showClearButton: true,
      value: [null, '2021/10/24'],
      openOnFieldClick: false,
      opened: true,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().input.click();
    await dateRangeBox.dropDownButton.click();

    await expectFocusState(dateRangeBox, true, false, true);

    await dateRangeBox.clearButton.click();

    await expectFocusState(dateRangeBox, true, true, false);
  });

  test('DateRangeBox & StartDateBox should be focused if startDateBox open by keyboard, alt+down, alt+up', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();

    await expectOpened(dateRangeBox, false);
    await expectFocusState(dateRangeBox, true, true, false);

    await page.keyboard.press('Alt+ArrowDown');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, true, false);

    await page.keyboard.press('Alt+ArrowUp');

    await expectOpened(dateRangeBox, false);
    await expectFocusState(dateRangeBox, true, true, false);
  });

  test('DateRangeBox & StartDateBox should be focused if endDateBox open and close by keyboard, alt+down, alt+up', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox, false);
    await expectFocusState(dateRangeBox, true, false, true);

    await page.keyboard.press('Alt+ArrowDown');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, false, true);

    await page.keyboard.press('Alt+ArrowUp');

    await expectOpened(dateRangeBox, false);
    await expectFocusState(dateRangeBox, true, false, true);
  });

  test('Opened dateRangeBox should not be closed after click on inputs, openOnFieldClick: true', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
      opened: true,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, true, false);

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, false, true);

    await dateRangeBox.getStartDateBox().input.click();

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, true, false);
  });

  test('Opened dateRangeBox should be closed after outside click, openOnFieldClick: true', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      width: 500,
      openOnFieldClick: true,
      opened: true,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await clickWithOffset(page.locator('body'), -50);

    await expectOpened(dateRangeBox, false);
    await expectFocusState(dateRangeBox, false, false, false);

    await dateRangeBox.dropDownButton.click();

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, true, false);
  });

  test('DateRangeBox and StartDateBox should have focus class after focus via accessKey', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      accessKey: 'x',
      openOnFieldClick: false,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().input.click();
    await expect(dateRangeBox.getStartDateBox().input).toHaveAttribute('accesskey', 'x');

    await page.evaluate(() => {
      (document.querySelector('[accesskey="x"]') as HTMLElement).focus();
    });

    await expectFocusState(dateRangeBox, true, true, false);
  });
});
