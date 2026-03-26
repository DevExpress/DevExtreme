import { test, expect } from '@playwright/test';
import { createWidget, appendElementTo } from '../../../playwright-helpers';
import { DateRangeBox } from '../../../playwright-helpers/dateRangeBox';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('DateRangeBox keyboard navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const initialValue = [new Date('2021/10/17'), new Date('2021/11/24')];

  const getDateByOffset = (date: Date | string, offset: number) => {
    const resultDate = new Date(date);
    return new Date(resultDate.setDate(resultDate.getDate() + offset));
  };

  test('DateRangeBox should be opened and close by press alt+down and alt+up respectively when startDateBox is focused', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();

    expect(await dateRangeBox.option('opened')).toEqual(false);

    await page.keyboard.press('Alt+ArrowDown');

    expect(await dateRangeBox.option('opened')).toEqual(true);

    await page.keyboard.press('Alt+ArrowUp');

    expect(await dateRangeBox.option('opened')).toEqual(false);

    await page.keyboard.press('Alt+ArrowDown');

    expect(await dateRangeBox.option('opened')).toEqual(true);

    await page.keyboard.press('Alt+ArrowUp');

    expect(await dateRangeBox.option('opened')).toEqual(false);
  });

  test('DateRangeBox should be opened and close by press alt+down and alt+up respectively when endDateBox is focused', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getEndDateBox().input.click();

    expect(await dateRangeBox.option('opened')).toEqual(false);

    await page.keyboard.press('Alt+ArrowDown');

    expect(await dateRangeBox.option('opened')).toEqual(true);

    await page.keyboard.press('Alt+ArrowUp');

    expect(await dateRangeBox.option('opened')).toEqual(false);

    await page.keyboard.press('Alt+ArrowDown');

    expect(await dateRangeBox.option('opened')).toEqual(true);

    await page.keyboard.press('Alt+ArrowUp');

    expect(await dateRangeBox.option('opened')).toEqual(false);
  });

  test('DateRangeBox should be opened by press alt+down if startDate input is focused and close by press alt+up if endDateBox is focused', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: false,
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();

    expect(await dateRangeBox.option('opened')).toEqual(false);

    await page.keyboard.press('Alt+ArrowDown');

    expect(await dateRangeBox.option('opened')).toEqual(true);

    await dateRangeBox.getEndDateBox().input.click();

    expect(await dateRangeBox.option('opened')).toEqual(true);

    await page.keyboard.press('Alt+ArrowUp');

    expect(await dateRangeBox.option('opened')).toEqual(false);
  });

  test('DateRangeBox should be closed by press esc key when startDateBox is focused', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();

    expect(await dateRangeBox.option('opened')).toEqual(true);

    await page.keyboard.press('Escape');

    expect(await dateRangeBox.option('opened')).toEqual(false);
  });

  test('DateRangeBox should be closed by press esc key when endDateBox is focused', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getEndDateBox().input.click();

    expect(await dateRangeBox.option('opened')).toEqual(true);

    await page.keyboard.press('Escape');

    expect(await dateRangeBox.option('opened')).toEqual(false);
  });

  test('DateRangeBox should be closed by press esc key when today/cancel/apply button in popup is focused, applyValueMode is useButtons', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getEndDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    expect(await dateRangeBox.getPopup().getTodayButton().isFocused()).toEqual(true);

    await page.keyboard.press('Escape');
    expect(await dateRangeBox.option('opened')).toEqual(false);

    await dateRangeBox.getEndDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    expect(await dateRangeBox.getPopup().getApplyButton().isFocused()).toEqual(true);

    await page.keyboard.press('Escape');
    expect(await dateRangeBox.option('opened')).toEqual(false);

    await dateRangeBox.getEndDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    expect(await dateRangeBox.getPopup().getCancelButton().isFocused()).toEqual(true);

    await page.keyboard.press('Escape');
    expect(await dateRangeBox.option('opened')).toEqual(false);
  });

  test('DateRangeBox should be closed by press esc key when navigator element in popup is focused, applyValueMode is useButtons', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getEndDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await page.keyboard.press('Tab');
    expect(await dateRangeBox.getPopup().getNavigatorPrevButton().isFocused()).toEqual(true);

    await page.keyboard.press('Escape');
    expect(await dateRangeBox.option('opened')).toEqual(false);

    await dateRangeBox.getEndDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    expect(await dateRangeBox.getPopup().getNavigatorCaption().isFocused()).toEqual(true);

    await page.keyboard.press('Escape');
    expect(await dateRangeBox.option('opened')).toEqual(false);

    await dateRangeBox.getEndDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    expect(await dateRangeBox.getPopup().getNavigatorNextButton().isFocused()).toEqual(true);

    await page.keyboard.press('Escape');
    expect(await dateRangeBox.option('opened')).toEqual(false);
  });

  test('DateRangeBox should be closed by press esc key when views wrapper in popup is focused, applyValueMode is useButtons', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
    });

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getEndDateBox().input.click();
    expect(await dateRangeBox.option('opened')).toEqual(true);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    expect(await dateRangeBox.getPopup().getViewsWrapper().isFocused()).toEqual(true);

    await page.keyboard.press('Escape');
    expect(await dateRangeBox.option('opened')).toEqual(false);
  });

  test('DateRangeBox should not be closed by press tab key on startDate input', async ({ page }) => {
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

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getStartDateBox().input.click();

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();

    await page.keyboard.press('Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await page.keyboard.press('Tab');

    expect(await dateRangeBox.option('opened')).toEqual(false);
    expect(await dateRangeBox.isFocused()).toBeFalsy();
  });

  test('DateRangeBox keyboard navigation via `tab` key if applyValueMode is useButtons, start -> end -> prev -> caption -> next -> views -> today -> apply -> cancel -> start -> end', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'firstFocusableElement');
    await appendElementTo(page, '#container', 'div', 'dateRangeBox');
    await appendElementTo(page, '#container', 'div', 'lastFocusableElement');

    await createWidget(page, 'dxButton', {
      text: 'First Focusable Element',
    }, '#firstFocusableElement');

    await createWidget(page, 'dxButton', {
      text: 'Last Focusable Element',
    }, '#lastFocusableElement');

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
    await page.keyboard.press('Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();

    await page.keyboard.press('Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getPopup().getNavigatorPrevButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorCaption().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorNextButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getApplyButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getCancelButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getTodayButton().isFocused()).toBeFalsy();

    await page.keyboard.press('Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeFalsy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorPrevButton().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getPopup().getNavigatorCaption().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorNextButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getApplyButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getCancelButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getTodayButton().isFocused()).toBeFalsy();

    await page.keyboard.press('Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeFalsy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorPrevButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorCaption().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getPopup().getNavigatorNextButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getApplyButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getCancelButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getTodayButton().isFocused()).toBeFalsy();

    await page.keyboard.press('Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeFalsy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorPrevButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorCaption().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorNextButton().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getPopup().getApplyButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getCancelButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getTodayButton().isFocused()).toBeFalsy();

    await page.keyboard.press('Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeFalsy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorPrevButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorCaption().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorNextButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getViewsWrapper().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getPopup().getApplyButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getCancelButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getTodayButton().isFocused()).toBeFalsy();

    await page.keyboard.press('Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeFalsy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getApplyButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getCancelButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getTodayButton().isFocused()).toBeTruthy();

    await page.keyboard.press('Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeFalsy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getApplyButton().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getPopup().getCancelButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getTodayButton().isFocused()).toBeFalsy();

    await page.keyboard.press('Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeFalsy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getApplyButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getCancelButton().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getPopup().getTodayButton().isFocused()).toBeFalsy();

    await page.keyboard.press('Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getApplyButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getCancelButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getTodayButton().isFocused()).toBeFalsy();

    await page.keyboard.press('Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getPopup().getApplyButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getCancelButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getTodayButton().isFocused()).toBeFalsy();
  });

  test('DateRangeBox keyboard navigation via `shift+tab` key if applyValueMode is useButtons, end -> start -> cancel -> apply -> today -> views -> next -> caption -> prev -> end -> start', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'firstFocusableElement');
    await appendElementTo(page, '#container', 'div', 'dateRangeBox');
    await appendElementTo(page, '#container', 'div', 'lastFocusableElement');

    await createWidget(page, 'dxButton', {
      text: 'First Focused Element',
    }, '#firstFocusableElement');

    await createWidget(page, 'dxButton', {
      text: 'Last Focused Element',
    }, '#lastFocusableElement');

    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
      applyValueMode: 'useButtons',
      opened: false,
      width: 500,
    }, '#dateRangeBox');

    const dateRangeBox = new DateRangeBox(page, '#dateRangeBox');

    await dateRangeBox.getEndDateBox().input.click();

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await page.keyboard.press('Shift+Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorPrevButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorCaption().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorNextButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getApplyButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getCancelButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getTodayButton().isFocused()).toBeFalsy();

    await page.keyboard.press('Shift+Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeFalsy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorPrevButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorCaption().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorNextButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getApplyButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getCancelButton().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getPopup().getTodayButton().isFocused()).toBeFalsy();

    await page.keyboard.press('Shift+Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeFalsy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorPrevButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorCaption().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorNextButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getApplyButton().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getPopup().getCancelButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getTodayButton().isFocused()).toBeFalsy();

    await page.keyboard.press('Shift+Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeFalsy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorPrevButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorCaption().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorNextButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getApplyButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getCancelButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getTodayButton().isFocused()).toBeTruthy();

    await page.keyboard.press('Shift+Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeFalsy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorPrevButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorCaption().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorNextButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getViewsWrapper().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getPopup().getApplyButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getCancelButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getTodayButton().isFocused()).toBeFalsy();

    await page.keyboard.press('Shift+Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeFalsy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorPrevButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorCaption().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorNextButton().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getPopup().getApplyButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getCancelButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getTodayButton().isFocused()).toBeFalsy();

    await page.keyboard.press('Shift+Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeFalsy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorPrevButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorCaption().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getPopup().getNavigatorNextButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getApplyButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getCancelButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getTodayButton().isFocused()).toBeFalsy();

    await page.keyboard.press('Shift+Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeFalsy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorPrevButton().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getPopup().getNavigatorCaption().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorNextButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getApplyButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getCancelButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getTodayButton().isFocused()).toBeFalsy();

    await page.keyboard.press('Shift+Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getPopup().getNavigatorPrevButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorCaption().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorNextButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getApplyButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getCancelButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getTodayButton().isFocused()).toBeFalsy();

    await page.keyboard.press('Shift+Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorPrevButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorCaption().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getNavigatorNextButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getApplyButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getCancelButton().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getPopup().getTodayButton().isFocused()).toBeFalsy();
  });

  test('DateRangeBox keyboard navigation via `tab` key if applyValueMode is instantly, start -> end -> prev -> caption -> next -> views -> start -> end', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'firstFocusableElement');
    await appendElementTo(page, '#container', 'div', 'dateRangeBox');
    await appendElementTo(page, '#container', 'div', 'lastFocusableElement');

    await createWidget(page, 'dxButton', {
      text: 'First Focusable Element',
    }, '#firstFocusableElement');

    await createWidget(page, 'dxButton', {
      text: 'Last Focusable Element',
    }, '#lastFocusableElement');

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
    await page.keyboard.press('Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();

    await page.keyboard.press('Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await page.keyboard.press('Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getPopup().getNavigatorPrevButton().isFocused()).toBeTruthy();

    await page.keyboard.press('Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getPopup().getNavigatorCaption().isFocused()).toBeTruthy();

    await page.keyboard.press('Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getPopup().getNavigatorNextButton().isFocused()).toBeTruthy();

    await page.keyboard.press('Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getPopup().getViewsWrapper().isFocused()).toBeTruthy();

    await page.keyboard.press('Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();

    await page.keyboard.press('Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();
  });

  test('DateRangeBox keyboard navigation via `shift+tab` key if applyValueMode is instantly, end -> start -> views -> next -> caption -> prev -> end -> start', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'firstFocusableElement');
    await appendElementTo(page, '#container', 'div', 'dateRangeBox');
    await appendElementTo(page, '#container', 'div', 'lastFocusableElement');

    await createWidget(page, 'dxButton', {
      text: 'First Focused Element',
    }, '#firstFocusableElement');

    await createWidget(page, 'dxButton', {
      text: 'Last Focused Element',
    }, '#lastFocusableElement');

    await createWidget(page, 'dxDateRangeBox', {
      value: ['2021/09/17', '2021/10/24'],
      openOnFieldClick: true,
      applyValueMode: 'instantly',
      opened: false,
      width: 500,
    }, '#dateRangeBox');

    const dateRangeBox = new DateRangeBox(page, '#dateRangeBox');

    await dateRangeBox.getEndDateBox().input.click();

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeFalsy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await page.keyboard.press('Shift+Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();

    await page.keyboard.press('Shift+Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getPopup().getViewsWrapper().isFocused()).toBeTruthy();

    await page.keyboard.press('Shift+Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getPopup().getNavigatorNextButton().isFocused()).toBeTruthy();

    await page.keyboard.press('Shift+Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getPopup().getNavigatorCaption().isFocused()).toBeTruthy();

    await page.keyboard.press('Shift+Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getPopup().getNavigatorPrevButton().isFocused()).toBeTruthy();

    await page.keyboard.press('Shift+Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await page.keyboard.press('Shift+Tab');

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.isFocused()).toBeTruthy();
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeFalsy();
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

    const dateRangeBox = new DateRangeBox(page);

    await dateRangeBox.getEndDateBox().input.click();

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getEndDateBox().isFocused()).toBeTruthy();

    await page.keyboard.press('Shift+Tab');
    await page.waitForTimeout(100);

    expect(await dateRangeBox.option('opened')).toEqual(true);
    expect(await dateRangeBox.getStartDateBox().isFocused()).toBeTruthy();

    await page.keyboard.press('Shift+Tab');
    await page.waitForTimeout(100);

    expect(await dateRangeBox.option('opened')).toEqual(false);
  });

  [
    { key: 'ArrowLeft', keyName: 'left', offsetInDays: -1 },
    { key: 'ArrowRight', keyName: 'right', offsetInDays: 1 },
    { key: 'ArrowUp', keyName: 'up', offsetInDays: -7 },
    { key: 'ArrowDown', keyName: 'down', offsetInDays: 7 },
  ].forEach(({ key, keyName, offsetInDays }) => {
    test(`DateRangeBox start value should be changed after after opening and navigation by '${keyName}' key and click on 'enter' key`, async ({ page }) => {
      await createWidget(page, 'dxDateRangeBox', {
        value: initialValue,
        openOnFieldClick: false,
      });

      const dateRangeBox = new DateRangeBox(page);

      await dateRangeBox.dropDownButton.click();

      expect(await dateRangeBox.option('opened')).toEqual(true);

      await page.keyboard.press(key);
      await page.keyboard.press('Enter');

      const expectedStartDate = getDateByOffset(initialValue[0], offsetInDays);

      expect(await dateRangeBox.option('opened')).toEqual(true);
      expect(await dateRangeBox.option('value')).toEqual([
        expectedStartDate.toISOString(),
        initialValue[1].toISOString(),
      ]);
    });

    test(`Selection in calendar should be started with current startDate value after select startDate if endDate is not specified (key=${key})`, async ({ page }) => {
      await createWidget(page, 'dxDateRangeBox', {
        value: [initialValue[0], null],
      });

      const dateRangeBox = new DateRangeBox(page);

      await dateRangeBox.dropDownButton.click();

      await page.keyboard.press(key);
      await page.keyboard.press('Enter');

      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('Enter');

      const expectedStartDate = getDateByOffset(initialValue[0], offsetInDays);
      const expectedEndDate = getDateByOffset(expectedStartDate, 5);

      expect(await dateRangeBox.option('opened')).toEqual(false);
      expect(await dateRangeBox.option('value')).toEqual([
        expectedStartDate.toISOString(),
        expectedEndDate.toISOString(),
      ]);
    });

    test(`Selection in calendar should be started with endDate value after select startDate if endDate is specified (key=${key})`, async ({ page }) => {
      await createWidget(page, 'dxDateRangeBox', {
        value: initialValue,
        openOnFieldClick: false,
      });

      const dateRangeBox = new DateRangeBox(page);

      await dateRangeBox.dropDownButton.click();

      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('Enter');

      await page.keyboard.press(key);
      await page.keyboard.press('Enter');

      const expectedStartDate = getDateByOffset(initialValue[0], -1);
      const expectedEndDate = getDateByOffset(initialValue[1], offsetInDays);

      expect(await dateRangeBox.option('opened')).toEqual(false);
      expect(await dateRangeBox.option('value')).toEqual([
        expectedStartDate.toISOString(),
        expectedEndDate.toISOString(),
      ]);
    });
  });
});
