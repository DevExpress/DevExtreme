import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import type Calendar from '../../../models/calendar';
import DateRangeBox from '../../../models/dateRangeBox';

type DateRange = (Date | null)[];

const createDateRangeBox = async (page: Page, options: object): Promise<void> => {
  await page.evaluate(() => {
    (window as any).onValueChangedCounter = 0;
  });

  await createWidget(page, 'dxDateRangeBox', (config) => ({
    ...config,
    onValueChanged() {
      ((window as any).onValueChangedCounter as number) += 1;
    },
  }), '#container', { arg: options });
};

const expectOpened = async (dateRangeBox: DateRangeBox, opened = true): Promise<void> => {
  await expect.poll(() => dateRangeBox.option('opened')).toBe(opened);
};

const expectValue = async (widget: DateRangeBox | Calendar, value: DateRange): Promise<void> => {
  await expect.poll(() => widget.option('value')).toEqual(value);
};

const expectValueChangedCount = async (page: Page, count: number): Promise<void> => {
  await expect.poll(() => page.evaluate(() => (window as any).onValueChangedCounter)).toBe(count);
};

test.describe('DateRangeBox behavior (applyValueMode=\'instantly\')', () => {
  test('Open by click on startDate input and select date in calendar, value: [null, null]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [null, null],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();

    await expectOpened(dateRangeBox);

    await dateRangeBox.getCalendarCell(10).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 6), null]);
    await expectValueChangedCount(page, 1);

    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();

    await dateRangeBox.getCalendarCell(21).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 6), new Date(2021, 9, 17)]);
    await expectValueChangedCount(page, 2);
    await dateRangeBox.getEndDateBox().expectFocused();

    await expectOpened(dateRangeBox, false);
    await dateRangeBox.getEndDateBox().expectFocused();
  });

  test('Open by click on startDate input and reselect start date in calendar, value: ["2021/09/17", null]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [null, null],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();

    await expectOpened(dateRangeBox);

    await dateRangeBox.getCalendarCell(10).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 6), null]);
    await expectValueChangedCount(page, 1);

    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();

    await dateRangeBox.getStartDateBox().input.click();

    await expectOpened(dateRangeBox);
    await dateRangeBox.getStartDateBox().expectFocused();

    await dateRangeBox.getCalendarCell(21).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), null]);
    await expectValueChangedCount(page, 2);
    await dateRangeBox.getEndDateBox().expectFocused();

    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();

    await dateRangeBox.getCalendarCell(25).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 21)]);
    await expectValueChangedCount(page, 3);
    await dateRangeBox.getEndDateBox().expectFocused();

    await expectOpened(dateRangeBox, false);
    await dateRangeBox.getEndDateBox().expectFocused();
  });

  test('Open by click on endDate input and select date in calendar, value: [null, null]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [null, null],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox);

    await dateRangeBox.getCalendarCell(21).click();
    await expectValue(dateRangeBox, [null, new Date(2021, 9, 17)]);
    await expectValueChangedCount(page, 1);

    await expectOpened(dateRangeBox);
    await dateRangeBox.getStartDateBox().expectFocused();

    await dateRangeBox.getCalendarCell(10).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 6), new Date(2021, 9, 17)]);
    await expectValueChangedCount(page, 2);

    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();

    await dateRangeBox.getCalendarCell(27).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 6), new Date(2021, 9, 23)]);
    await expectValueChangedCount(page, 3);

    await expectOpened(dateRangeBox, false);
    await dateRangeBox.getEndDateBox().expectFocused();
  });

  test('Open by click on startDate input and select date in calendar < endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();

    await expectOpened(dateRangeBox);

    await dateRangeBox.getCalendarCell(10).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 6), new Date(2021, 9, 24)]);
    await expectValueChangedCount(page, 1);

    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();
  });

  test('Open by click on startDate input and select date in calendar > startDate, value: ["2021/09/17", "2021/09/28"]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 28)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();

    await expectOpened(dateRangeBox);

    await dateRangeBox.getCalendarCell(25).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 21), new Date(2021, 9, 28)]);
    await expectValueChangedCount(page, 1);

    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();
  });

  test('Open by click on startDate input and select date in calendar > endDate, value: ["2021/09/17", "2021/09/21"]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 21)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();

    await expectOpened(dateRangeBox);

    await dateRangeBox.getCalendarCell(30).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 26), null]);
    await expectValueChangedCount(page, 1);

    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();

    await dateRangeBox.getStartDateBox().input.click();

    await dateRangeBox.getCalendarCell(31).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 27), null]);
    await expectValueChangedCount(page, 2);

    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();

    await dateRangeBox.getStartDateBox().input.click();

    await dateRangeBox.getCalendarCell(32).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 28), null]);
    await expectValueChangedCount(page, 3);

    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();
  });

  test('Open by click on endDate input and select date in calendar > endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox);

    await dateRangeBox.getCalendarCell(30).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 26)]);
    await expectValueChangedCount(page, 1);

    await expectOpened(dateRangeBox, false);
    await dateRangeBox.getEndDateBox().expectFocused();
  });

  test('Open by click on endDate input and select date in calendar < endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox);

    await dateRangeBox.getCalendarCell(25).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 21)]);
    await expectValueChangedCount(page, 1);

    await expectOpened(dateRangeBox, false);
    await dateRangeBox.getEndDateBox().expectFocused();
  });

  test('Open by click on endDate input and select date in calendar < startDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox);

    await dateRangeBox.getCalendarCell(10).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 6), null]);
    await expectValueChangedCount(page, 1);

    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();

    await dateRangeBox.getCalendarCell(9).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 5), null]);
    await expectValueChangedCount(page, 2);

    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();

    await dateRangeBox.getCalendarCell(8).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 4), null]);
    await expectValueChangedCount(page, 3);

    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();

    await dateRangeBox.getCalendarCell(10).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 4), new Date(2021, 9, 6)]);
    await expectValueChangedCount(page, 4);

    await expectOpened(dateRangeBox, false);
    await dateRangeBox.getEndDateBox().expectFocused();
  });

  test('Open by click on endDate input and select date in calendar = endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox);

    await dateRangeBox.getCalendarCell(28).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 24)]);
    await expectValueChangedCount(page, 0);

    await expectOpened(dateRangeBox, false);
    await dateRangeBox.getEndDateBox().expectFocused();
  });

  test('Open by click on endDate input and select date in calendar = startDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox);

    await dateRangeBox.getCalendarCell(21).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 17)]);
    await expectValueChangedCount(page, 1);

    await expectOpened(dateRangeBox, false);
    await dateRangeBox.getEndDateBox().expectFocused();
  });

  test('Open by click on startDate input and select date in calendar = startDate -> endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();

    await expectOpened(dateRangeBox);

    await dateRangeBox.getCalendarCell(21).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 24)]);
    await expectValueChangedCount(page, 0);

    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();

    await dateRangeBox.getCalendarCell(28).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 24)]);
    await expectValueChangedCount(page, 0);

    await expectOpened(dateRangeBox, false);
    await dateRangeBox.getEndDateBox().expectFocused();
  });

  test('Value in calendar should be updated by click on clear button if popup is open', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      opened: true,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      showClearButton: true,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await expectOpened(dateRangeBox);

    await expectOpened(dateRangeBox);
    await dateRangeBox.clearButton.click();
    await expectValue(dateRangeBox, [null, null]);
    await expectValue(dateRangeBox.getCalendar(), [null, null]);
    await expectValueChangedCount(page, 1);
  });

  test('Value in calendar should be updated after change start date value by keyboard and click on endDate input if popup is open', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      opened: false,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      showClearButton: true,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();

    await expectOpened(dateRangeBox);

    await page.keyboard.press('Backspace');
    await dateRangeBox.getStartDateBox().input.pressSequentially('0');

    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 24)]);
    await expectValue(dateRangeBox.getCalendar(), [new Date(2021, 9, 17), new Date(2021, 9, 24)]);
    await expectValueChangedCount(page, 0);

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox);
    await expectValue(dateRangeBox, [new Date(2020, 9, 17), new Date(2021, 9, 24)]);
    await expectValue(dateRangeBox.getCalendar(), [new Date(2020, 9, 17), new Date(2021, 9, 24)]);
    await expectValueChangedCount(page, 1);
  });

  test('Value in calendar should be updated after change start date value by keyboard and press `tab` if popup is open', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      opened: false,
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
      showClearButton: true,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();

    await expectOpened(dateRangeBox);

    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await dateRangeBox.getStartDateBox().input.pressSequentially('19');

    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 24)]);
    await expectValue(dateRangeBox.getCalendar(), [new Date(2021, 9, 17), new Date(2021, 9, 24)]);
    await expectValueChangedCount(page, 0);

    await page.keyboard.press('Tab');

    await expectOpened(dateRangeBox);
    await expectValue(dateRangeBox, [new Date(2019, 9, 17), new Date(2021, 9, 24)]);
    await expectValue(dateRangeBox.getCalendar(), [new Date(2019, 9, 17), new Date(2021, 9, 24)]);
    await expectValueChangedCount(page, 1);

    await dateRangeBox.getEndDateBox().input.pressSequentially('10/24/2023');
    await dateRangeBox.getStartDateBox().input.click();

    await expectOpened(dateRangeBox);
    await expectValue(dateRangeBox, [new Date(2019, 9, 17), new Date(2023, 9, 24)]);
    await expectValue(dateRangeBox.getCalendar(), [new Date(2019, 9, 17), new Date(2023, 9, 24)]);
    await expectValueChangedCount(page, 2);
  });
});

test.describe('DateRangeBox behavior (applyValueMode=\'useButtons\')', () => {
  test('Value should be saved after select range in calendar and click on apply button, value: [null, null]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [null, null],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();

    await expectOpened(dateRangeBox);

    await dateRangeBox.getCalendarCell(10).click();
    await expectValue(dateRangeBox, [null, null]);
    await expectValueChangedCount(page, 0);

    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();

    await dateRangeBox.getCalendarCell(21).click();
    await expectOpened(dateRangeBox);
    await expectValue(dateRangeBox, [null, null]);
    await expectValueChangedCount(page, 0);
    await dateRangeBox.getStartDateBox().expectFocused();

    await dateRangeBox.getPopup().getApplyButton().element.click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 6), new Date(2021, 9, 17)]);
    await expectValueChangedCount(page, 1);
    await dateRangeBox.getStartDateBox().expectFocused();
  });

  test('Value should not be saved after select range and click on cancel button', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [null, null],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();

    await dateRangeBox.getCalendarCell(10).click();
    await dateRangeBox.getCalendarCell(21).click();
    await expectValueChangedCount(page, 0);

    await dateRangeBox.getPopup().getCancelButton().element.click();
    await expectOpened(dateRangeBox, false);
    await expectValue(dateRangeBox, [null, null]);
    await expectValueChangedCount(page, 0);
  });

  test('Open by click on startDate input and reselect start date in calendar, value: [null, null]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [null, null],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();

    await expectOpened(dateRangeBox);

    await dateRangeBox.getCalendarCell(10).click();
    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();
    await expectValue(dateRangeBox, [null, null]);
    await expectValueChangedCount(page, 0);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    await expectOpened(dateRangeBox, false);
    await expectValue(dateRangeBox, [new Date(2021, 9, 6), null]);
    await expectValueChangedCount(page, 1);
    await dateRangeBox.getStartDateBox().expectFocused();

    await dateRangeBox.getStartDateBox().input.click();

    await dateRangeBox.getCalendarCell(21).click();
    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 6), null]);
    await expectValueChangedCount(page, 1);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    await expectOpened(dateRangeBox, false);
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), null]);
    await expectValueChangedCount(page, 2);
    await dateRangeBox.getStartDateBox().expectFocused();
  });

  test('Open by click on endDate input and select date in calendar, value: [null, null]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [null, null],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox);

    await dateRangeBox.getCalendarCell(21).click();
    await expectOpened(dateRangeBox);
    await dateRangeBox.getStartDateBox().expectFocused();
    await expectValue(dateRangeBox, [null, null]);
    await expectValueChangedCount(page, 0);

    await dateRangeBox.getCalendarCell(10).click();
    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();
    await expectValue(dateRangeBox, [null, null]);
    await expectValueChangedCount(page, 0);

    await dateRangeBox.getCalendarCell(27).click();
    await expectOpened(dateRangeBox);
    await dateRangeBox.getStartDateBox().expectFocused();
    await expectValue(dateRangeBox, [null, null]);
    await expectValueChangedCount(page, 0);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    await expectOpened(dateRangeBox, false);
    await dateRangeBox.getStartDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 6), new Date(2021, 9, 23)]);
    await expectValueChangedCount(page, 1);
  });

  test('Open by click on startDate input and select date in calendar < endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();

    await expectOpened(dateRangeBox);

    await dateRangeBox.getCalendarCell(10).click();
    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 24)]);
    await expectValueChangedCount(page, 0);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    await expectOpened(dateRangeBox, false);
    await dateRangeBox.getStartDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 6), new Date(2021, 9, 24)]);
    await expectValueChangedCount(page, 1);
  });

  test('Open by click on startDate input and select date in calendar > startDate, value: ["2021/09/17", "2021/09/28"]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 28)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();

    await dateRangeBox.getCalendarCell(25).click();
    await dateRangeBox.getEndDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 28)]);
    await expectValueChangedCount(page, 0);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    await expectOpened(dateRangeBox, false);
    await dateRangeBox.getStartDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 21), new Date(2021, 9, 28)]);
    await expectValueChangedCount(page, 1);
  });

  test('Open by click on startDate input and select date in calendar > endDate, value: ["2021/09/17", "2021/09/21"]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 21)],
      openOnFieldClick: true,
      width: 500,
      applyValueMode: 'useButtons',
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();

    await dateRangeBox.getCalendarCell(30).click();
    await dateRangeBox.getEndDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 21)]);
    await expectValueChangedCount(page, 0);

    await dateRangeBox.getStartDateBox().input.click();

    await dateRangeBox.getCalendarCell(31).click();
    await dateRangeBox.getEndDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 21)]);
    await expectValueChangedCount(page, 0);

    await dateRangeBox.getStartDateBox().input.click();

    await dateRangeBox.getCalendarCell(32).click();
    await dateRangeBox.getEndDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 21)]);
    await expectValueChangedCount(page, 0);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    await expectOpened(dateRangeBox, false);
    await dateRangeBox.getStartDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 28), null]);
    await expectValueChangedCount(page, 1);
  });

  test('Open by click on endDate input and select date in calendar > endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().input.click();

    await dateRangeBox.getCalendarCell(30).click();
    await expectOpened(dateRangeBox);
    await dateRangeBox.getStartDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 24)]);
    await expectValueChangedCount(page, 0);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    await expectOpened(dateRangeBox, false);
    await dateRangeBox.getStartDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 26)]);
    await expectValueChangedCount(page, 1);
  });

  test('Open by click on endDate input and select date in calendar < endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().input.click();

    await dateRangeBox.getCalendarCell(25).click();
    await expectOpened(dateRangeBox);
    await dateRangeBox.getStartDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 24)]);
    await expectValueChangedCount(page, 0);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    await expectOpened(dateRangeBox, false);
    await dateRangeBox.getStartDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 21)]);
    await expectValueChangedCount(page, 1);
  });

  test('Open by click on endDate input and select date in calendar < startDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().input.click();

    await dateRangeBox.getCalendarCell(10).click();
    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 24)]);
    await expectValueChangedCount(page, 0);

    await dateRangeBox.getCalendarCell(9).click();
    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 24)]);
    await expectValueChangedCount(page, 0);

    await dateRangeBox.getCalendarCell(8).click();
    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 24)]);
    await expectValueChangedCount(page, 0);

    await dateRangeBox.getCalendarCell(10).click();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 24)]);
    await expectValueChangedCount(page, 0);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    await expectOpened(dateRangeBox, false);
    await dateRangeBox.getStartDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 4), new Date(2021, 9, 6)]);
    await expectValueChangedCount(page, 1);
  });

  test('Open by click on endDate input and select date in calendar = endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().input.click();

    await dateRangeBox.getCalendarCell(28).click();
    await expectOpened(dateRangeBox);
    await dateRangeBox.getStartDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 24)]);
    await expectValueChangedCount(page, 0);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    await expectOpened(dateRangeBox, false);
    await dateRangeBox.getStartDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 24)]);
    await expectValueChangedCount(page, 0);
  });

  test('Open by click on endDate input and select date in calendar = startDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox);

    await dateRangeBox.getCalendarCell(21).click();
    await expectOpened(dateRangeBox);
    await dateRangeBox.getStartDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 24)]);
    await expectValueChangedCount(page, 0);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    await expectOpened(dateRangeBox, false);
    await dateRangeBox.getStartDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 17)]);
    await expectValueChangedCount(page, 1);
  });

  test('Open by click on startDate input and select date in calendar = startDate -> endDate, value: ["2021/09/17", "2021/09/24"]', async ({ page }) => {
    await createDateRangeBox(page, {
      value: [new Date(2021, 9, 17), new Date(2021, 9, 24)],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      width: 500,
      calendarOptions: {
        currentDate: new Date(2021, 9, 19),
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();

    await dateRangeBox.getCalendarCell(21).click();
    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 24)]);
    await expectValueChangedCount(page, 0);

    await dateRangeBox.getCalendarCell(28).click();
    await expectOpened(dateRangeBox);
    await dateRangeBox.getStartDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 24)]);
    await expectValueChangedCount(page, 0);

    await dateRangeBox.getPopup().getApplyButton().element.click();
    await expectOpened(dateRangeBox, false);
    await dateRangeBox.getStartDateBox().expectFocused();
    await expectValue(dateRangeBox, [new Date(2021, 9, 17), new Date(2021, 9, 24)]);
    await expectValueChangedCount(page, 0);
  });
});
