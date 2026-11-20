import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';
import DateRangeBox from '../../../models/dateRangeBox';
import { expectClass } from '../../../models/internal/classMatcher';

interface PopupFocusState {
  prev?: boolean;
  caption?: boolean;
  next?: boolean;
  views?: boolean;
  apply?: boolean;
  cancel?: boolean;
  today?: boolean;
}

const initialValue = [new Date('2021/10/17'), new Date('2021/11/24')];

const getDateByOffset = (date: Date | string, offset: number): Date => {
  const resultDate = new Date(date);

  return new Date(resultDate.setDate(resultDate.getDate() + offset));
};

const pressKey = async (page: Page, key: string, times = 1): Promise<void> => {
  for (let index = 0; index < times; index += 1) {
    await page.keyboard.press(key);
  }
};

const expectOpened = async (dateRangeBox: DateRangeBox, opened = true): Promise<void> => {
  await expect.poll(() => dateRangeBox.option('opened')).toBe(opened);
};

const expectAllOpened = async (dateRangeBox: DateRangeBox, opened: boolean): Promise<void> => {
  await expectOpened(dateRangeBox, opened);
  await expect.poll(() => dateRangeBox.getStartDateBox().option('opened')).toBe(opened);
  await expect.poll(() => dateRangeBox.getEndDateBox().option('opened')).toBe(opened);
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

const expectPopupFocusState = async (
  dateRangeBox: DateRangeBox,
  state: PopupFocusState,
): Promise<void> => {
  const popup = dateRangeBox.getPopup();

  if (state.prev !== undefined) {
    await popup.getNavigatorPrevButton().expectFocused(state.prev);
  }

  if (state.caption !== undefined) {
    await popup.getNavigatorCaption().expectFocused(state.caption);
  }

  if (state.next !== undefined) {
    await popup.getNavigatorNextButton().expectFocused(state.next);
  }

  if (state.views) {
    await expect(popup.getViewsWrapper()).toBeFocused();
  }

  if (state.apply !== undefined) {
    await popup.getApplyButton().expectFocused(state.apply);
  }

  if (state.cancel !== undefined) {
    await popup.getCancelButton().expectFocused(state.cancel);
  }

  if (state.today !== undefined) {
    await popup.getTodayButton().expectFocused(state.today);
  }
};

const createFocusableElements = async (page: Page, state: string): Promise<void> => {
  await appendElementTo(page, '#container', 'div', 'firstFocusableElement');
  await appendElementTo(page, '#container', 'div', 'dateRangeBox');
  await appendElementTo(page, '#container', 'div', 'lastFocusableElement');

  await createWidget(page, 'dxButton', {
    text: `First ${state} Element`,
  }, '#firstFocusableElement');

  await createWidget(page, 'dxButton', {
    text: `Last ${state} Element`,
  }, '#lastFocusableElement');
};

test.describe('DateRangeBox keyboard navigation', () => {
  test('DateRangeBox should be opened and close by press alt+down and alt+up respectively when startDateBox is focused', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();

    await expectAllOpened(dateRangeBox, false);

    await pressKey(page, 'Alt+ArrowDown');

    await expectAllOpened(dateRangeBox, true);

    await pressKey(page, 'Alt+ArrowUp');

    await expectAllOpened(dateRangeBox, false);

    await pressKey(page, 'Alt+ArrowDown');

    await expectAllOpened(dateRangeBox, true);

    await pressKey(page, 'Alt+ArrowUp');

    await expectAllOpened(dateRangeBox, false);
  });

  test('DateRangeBox should be opened and close by press alt+down and alt+up respectively when endDateBox is focused', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().input.click();

    await expectAllOpened(dateRangeBox, false);

    await pressKey(page, 'Alt+ArrowDown');

    await expectAllOpened(dateRangeBox, true);

    await pressKey(page, 'Alt+ArrowUp');

    await expectAllOpened(dateRangeBox, false);

    await pressKey(page, 'Alt+ArrowDown');

    await expectAllOpened(dateRangeBox, true);

    await pressKey(page, 'Alt+ArrowUp');

    await expectAllOpened(dateRangeBox, false);
  });

  test('DateRangeBox should be opened by press alt+down if startDate input is focused and close by press alt+up if endDateBox is focused', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();

    await expectAllOpened(dateRangeBox, false);

    await pressKey(page, 'Alt+ArrowDown');

    await expectAllOpened(dateRangeBox, true);

    await dateRangeBox.getEndDateBox().input.click();

    await expectAllOpened(dateRangeBox, true);

    await pressKey(page, 'Alt+ArrowUp');

    await expectAllOpened(dateRangeBox, false);
  });

  test('DateRangeBox should be closed by press esc key when startDateBox is focused', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getStartDateBox().input.click();

    await expectOpened(dateRangeBox);

    await pressKey(page, 'Escape');

    await expectOpened(dateRangeBox, false);
  });

  test('DateRangeBox should be closed by press esc key when endDateBox is focused', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox);

    await pressKey(page, 'Escape');

    await expectOpened(dateRangeBox, false);
  });

  test('DateRangeBox should be closed by press esc key when today/cancel/apply button in popup is focused, applyValueMode is useButtons', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox);

    await pressKey(page, 'Tab', 5);

    await dateRangeBox.getPopup().getTodayButton().expectFocused();

    await pressKey(page, 'Escape');

    await expectOpened(dateRangeBox, false);

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox);

    await pressKey(page, 'Tab', 6);

    await dateRangeBox.getPopup().getApplyButton().expectFocused();

    await pressKey(page, 'Escape');

    await expectOpened(dateRangeBox, false);

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox);

    await pressKey(page, 'Tab', 7);

    await dateRangeBox.getPopup().getCancelButton().expectFocused();

    await pressKey(page, 'Escape');

    await expectOpened(dateRangeBox, false);
  });

  test('DateRangeBox should be closed by press esc key when navigator element in popup is focused, applyValueMode is useButtons', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox);

    await pressKey(page, 'Tab');

    await dateRangeBox.getPopup().getNavigatorPrevButton().expectFocused();

    await pressKey(page, 'Escape');

    await expectOpened(dateRangeBox, false);

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox);

    await pressKey(page, 'Tab', 2);

    await dateRangeBox.getPopup().getNavigatorCaption().expectFocused();

    await pressKey(page, 'Escape');

    await expectOpened(dateRangeBox, false);

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox);

    await pressKey(page, 'Tab', 3);

    await dateRangeBox.getPopup().getNavigatorNextButton().expectFocused();

    await pressKey(page, 'Escape');

    await expectOpened(dateRangeBox, false);
  });

  test('DateRangeBox should be closed by press esc key when views wrapper in popup is focused, applyValueMode is useButtons', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox);

    await pressKey(page, 'Tab', 4);

    await expect(dateRangeBox.getPopup().getViewsWrapper()).toBeFocused();

    await pressKey(page, 'Escape');

    await expectOpened(dateRangeBox, false);
  });

  test('DateRangeBox should not be closed by press tab key on startDate input', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'dateRangeBox');
    await appendElementTo(page, '#container', 'div', 'lastFocusableElement');

    await createWidget(page, 'dxButton', {
      text: 'Last Focusable Element',
    }, '#lastFocusableElement');

    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
      opened: true,
      width: 500,
      dropDownOptions: {
        hideOnOutsideClick: false,
      },
      calendarOptions: {
        focusStateEnabled: false,
      },
    }, '#dateRangeBox');

    const dateRangeBox = new DateRangeBox(page, '#dateRangeBox');

    await dateRangeBox.getStartDateBox().input.click();

    await expectOpened(dateRangeBox);
    await dateRangeBox.getStartDateBox().expectFocused();

    await pressKey(page, 'Tab');

    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();

    await pressKey(page, 'Tab');

    await expectOpened(dateRangeBox, false);
    await expectClass(page.locator('#lastFocusableElement'), 'dx-state-focused');
    await dateRangeBox.expectFocused(false);
  });

  test('DateRangeBox keyboard navigation via `tab` key if applyValueMode is useButtons, start -> end -> prev -> caption -> next -> views -> today -> apply -> cancel -> start -> end', async ({ page }) => {
    await createFocusableElements(page, 'Focusable');

    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      opened: true,
      width: 500,
      dropDownOptions: {
        hideOnOutsideClick: false,
      },
    }, '#dateRangeBox');

    const dateRangeBox = new DateRangeBox(page, '#dateRangeBox');

    await page.locator('#firstFocusableElement').click();
    await pressKey(page, 'Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, true, false);

    await pressKey(page, 'Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, false, true);
    await expectPopupFocusState(dateRangeBox, {
      prev: false, caption: false, next: false, apply: false, cancel: false, today: false,
    });

    await pressKey(page, 'Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, false, false, false);
    await expectPopupFocusState(dateRangeBox, {
      prev: true, caption: false, next: false, apply: false, cancel: false, today: false,
    });

    await pressKey(page, 'Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, false, false, false);
    await expectPopupFocusState(dateRangeBox, {
      prev: false, caption: true, next: false, apply: false, cancel: false, today: false,
    });

    await pressKey(page, 'Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, false, false, false);
    await expectPopupFocusState(dateRangeBox, {
      prev: false, caption: false, next: true, apply: false, cancel: false, today: false,
    });

    await pressKey(page, 'Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, false, false, false);
    await expectPopupFocusState(dateRangeBox, {
      prev: false,
      caption: false,
      next: false,
      views: true,
      apply: false,
      cancel: false,
      today: false,
    });

    await pressKey(page, 'Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, false, false, false);
    await expectPopupFocusState(dateRangeBox, {
      prev: false, caption: false, next: false, apply: false, cancel: false, today: true,
    });

    await pressKey(page, 'Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, false, false, false);
    await expectPopupFocusState(dateRangeBox, { apply: true, cancel: false, today: false });

    await pressKey(page, 'Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, false, false, false);
    await expectPopupFocusState(dateRangeBox, { apply: false, cancel: true, today: false });

    await pressKey(page, 'Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, true, false);
    await expectPopupFocusState(dateRangeBox, { apply: false, cancel: false, today: false });

    await pressKey(page, 'Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, false, true);
    await expectPopupFocusState(dateRangeBox, { apply: false, cancel: false, today: false });
  });

  test('DateRangeBox keyboard navigation via `shift+tab` key if applyValueMode is useButtons, end -> start -> cancel -> apply -> today -> views -> next -> caption -> prev -> end -> start', async ({ page }) => {
    await createFocusableElements(page, 'Focused');

    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      opened: false,
      width: 500,
    }, '#dateRangeBox');

    const dateRangeBox = new DateRangeBox(page, '#dateRangeBox');

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, false, true);

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, true, false);
    await expectPopupFocusState(dateRangeBox, {
      prev: false, caption: false, next: false, apply: false, cancel: false, today: false,
    });

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, false, false, false);
    await expectPopupFocusState(dateRangeBox, {
      prev: false, caption: false, next: false, apply: false, cancel: true, today: false,
    });

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, false, false, false);
    await expectPopupFocusState(dateRangeBox, {
      prev: false, caption: false, next: false, apply: true, cancel: false, today: false,
    });

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, false, false, false);
    await expectPopupFocusState(dateRangeBox, {
      prev: false, caption: false, next: false, apply: false, cancel: false, today: true,
    });

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, false, false, false);
    await expectPopupFocusState(dateRangeBox, {
      prev: false,
      caption: false,
      next: false,
      views: true,
      apply: false,
      cancel: false,
      today: false,
    });

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, false, false, false);
    await expectPopupFocusState(dateRangeBox, {
      prev: false, caption: false, next: true, apply: false, cancel: false, today: false,
    });

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, false, false, false);
    await expectPopupFocusState(dateRangeBox, {
      prev: false, caption: true, next: false, apply: false, cancel: false, today: false,
    });

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, false, false, false);
    await expectPopupFocusState(dateRangeBox, {
      prev: true, caption: false, next: false, apply: false, cancel: false, today: false,
    });

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, false, true);
    await expectPopupFocusState(dateRangeBox, {
      prev: false, caption: false, next: false, apply: false, cancel: false, today: false,
    });

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, true, false);
    await expectPopupFocusState(dateRangeBox, {
      prev: false, caption: false, next: false, apply: false, cancel: false, today: false,
    });
  });

  test('DateRangeBox keyboard navigation via `tab` key if applyValueMode is instantly, start -> end -> prev -> caption -> next -> views -> start -> end', async ({ page }) => {
    await createFocusableElements(page, 'Focusable');

    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
      applyValueMode: 'instantly',
      opened: true,
      width: 500,
      dropDownOptions: {
        hideOnOutsideClick: false,
      },
    }, '#dateRangeBox');

    const dateRangeBox = new DateRangeBox(page, '#dateRangeBox');

    await page.locator('#firstFocusableElement').click();
    await pressKey(page, 'Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, true, false);

    await pressKey(page, 'Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, false, true);

    await pressKey(page, 'Tab');

    await expectOpened(dateRangeBox);
    await expectPopupFocusState(dateRangeBox, { prev: true });

    await pressKey(page, 'Tab');

    await expectOpened(dateRangeBox);
    await expectPopupFocusState(dateRangeBox, { caption: true });

    await pressKey(page, 'Tab');

    await expectOpened(dateRangeBox);
    await expectPopupFocusState(dateRangeBox, { next: true });

    await pressKey(page, 'Tab');

    await expectOpened(dateRangeBox);
    await expectPopupFocusState(dateRangeBox, { views: true });

    await pressKey(page, 'Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, true, false);

    await pressKey(page, 'Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, false, true);
  });

  test('DateRangeBox keyboard navigation via `shift+tab` key if applyValueMode is instantly, end -> start -> views -> next -> caption -> prev -> end -> start', async ({ page }) => {
    await createFocusableElements(page, 'Focused');

    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
      applyValueMode: 'instantly',
      opened: false,
      width: 500,
    }, '#dateRangeBox');

    const dateRangeBox = new DateRangeBox(page, '#dateRangeBox');

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, false, true);

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, true, false);

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateRangeBox);
    await expectPopupFocusState(dateRangeBox, { views: true });

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateRangeBox);
    await expectPopupFocusState(dateRangeBox, { next: true });

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateRangeBox);
    await expectPopupFocusState(dateRangeBox, { caption: true });

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateRangeBox);
    await expectPopupFocusState(dateRangeBox, { prev: true });

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateRangeBox);
    await expectFocusState(dateRangeBox, true, true, false);
  });

  test('DateRangeBox should not be closed by press shift+tab key on endDate input', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
      opened: true,
      width: 500,
      dropDownOptions: {
        hideOnOutsideClick: false,
      },
      calendarOptions: {
        focusStateEnabled: false,
      },
    });

    const dateRangeBox = new DateRangeBox(page, '#container');

    await dateRangeBox.getEndDateBox().input.click();

    await expectOpened(dateRangeBox);
    await dateRangeBox.getEndDateBox().expectFocused();

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateRangeBox);
    await dateRangeBox.getStartDateBox().expectFocused();

    await pressKey(page, 'Shift+Tab');

    await expectOpened(dateRangeBox, false);
  });

  [
    { key: 'left', code: 'ArrowLeft', offsetInDays: -1 },
    { key: 'right', code: 'ArrowRight', offsetInDays: 1 },
    { key: 'up', code: 'ArrowUp', offsetInDays: -7 },
    { key: 'down', code: 'ArrowDown', offsetInDays: 7 },
  ].forEach(({ key, code, offsetInDays }) => {
    test(`DateRangeBox start value should be changed after after opening and navigation by '${key}' key and click on 'enter' key`, async ({ page }) => {
      await createWidget(page, 'dxDateRangeBox', {
        value: initialValue,
        openOnFieldClick: false,
      });

      const dateRangeBox = new DateRangeBox(page, '#container');

      await dateRangeBox.dropDownButton.click();

      await expectOpened(dateRangeBox);
      await expect.poll(() => dateRangeBox.option('value')).toEqual(initialValue);

      await pressKey(page, code);
      await pressKey(page, 'Enter');

      const expectedStartDate = getDateByOffset(initialValue[0], offsetInDays);

      await expectOpened(dateRangeBox);
      await expect.poll(() => dateRangeBox.option('value'))
        .toEqual([expectedStartDate, new Date(initialValue[1])]);
    });

    test(`Selection in calendar should be started with current startDate value after select startDate if endDate is not specified, '${key}' key`, async ({ page }) => {
      await createWidget(page, 'dxDateRangeBox', {
        value: [initialValue[0], null],
      });

      const dateRangeBox = new DateRangeBox(page, '#container');

      await dateRangeBox.dropDownButton.click();

      await pressKey(page, code);
      await pressKey(page, 'Enter');

      await pressKey(page, 'ArrowRight', 5);
      await pressKey(page, 'Enter');

      const expectedStartDate = getDateByOffset(initialValue[0], offsetInDays);
      const expectedEndDate = getDateByOffset(expectedStartDate, 5);

      await expectOpened(dateRangeBox, false);
      await expect.poll(() => dateRangeBox.option('value'))
        .toEqual([expectedStartDate, expectedEndDate]);
    });

    test(`Selection in calendar should be started with endDate value after select startDate if endDate is specified, '${key}' key`, async ({ page }) => {
      await createWidget(page, 'dxDateRangeBox', {
        value: initialValue,
        openOnFieldClick: false,
      });

      const dateRangeBox = new DateRangeBox(page, '#container');

      await dateRangeBox.dropDownButton.click();

      await pressKey(page, 'ArrowLeft');
      await pressKey(page, 'Enter');

      await pressKey(page, code);
      await pressKey(page, 'Enter');

      const expectedStartDate = getDateByOffset(initialValue[0], -1);
      const expectedEndDate = getDateByOffset(initialValue[1], offsetInDays);

      await expectOpened(dateRangeBox, false);
      await expect.poll(() => dateRangeBox.option('value'))
        .toEqual([expectedStartDate, expectedEndDate]);
    });
  });
});
