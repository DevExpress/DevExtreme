import { test, expect } from '@playwright/test';
import { createWidget, appendElementTo } from '../../../playwright-helpers';
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

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getStartDateBox().option('opened'))
      .eql(false)
      .expect(dateRangeBox.getEndDateBox().option('opened'))
      .eql(false);

    await page.keyboard.press('alt+down');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getStartDateBox().option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().option('opened'))
      .eql(true);

    await page.keyboard.press('alt+up');

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getStartDateBox().option('opened'))
      .eql(false)
      .expect(dateRangeBox.getEndDateBox().option('opened'))
      .eql(false);

    await page.keyboard.press('alt+down');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getStartDateBox().option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().option('opened'))
      .eql(true);

    await page.keyboard.press('alt+up');

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getStartDateBox().option('opened'))
      .eql(false)
      .expect(dateRangeBox.getEndDateBox().option('opened'))
      .eql(false);

    });

  test('DateRangeBox should be opened and close by press alt+down and alt+up respectively when endDateBox is focused', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
    value: ['2021/09/17', '2021/10/24'],
    openOnFieldClick: false,
  });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getStartDateBox().option('opened'))
      .eql(false)
      .expect(dateRangeBox.getEndDateBox().option('opened'))
      .eql(false);

    await page.keyboard.press('alt+down');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getStartDateBox().option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().option('opened'))
      .eql(true);

    await page.keyboard.press('alt+up');

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getStartDateBox().option('opened'))
      .eql(false)
      .expect(dateRangeBox.getEndDateBox().option('opened'))
      .eql(false);

    await page.keyboard.press('alt+down');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getStartDateBox().option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().option('opened'))
      .eql(true);

    await page.keyboard.press('alt+up');

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getStartDateBox().option('opened'))
      .eql(false)
      .expect(dateRangeBox.getEndDateBox().option('opened'))
      .eql(false);

    });

  test('DateRangeBox should be opened by press alt+down if startDate input is focused and close by press alt+up if endDateBox is focused', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
    value: ['2021/09/17', '2021/10/24'],
    openOnFieldClick: false,
  });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getStartDateBox().option('opened'))
      .eql(false)
      .expect(dateRangeBox.getEndDateBox().option('opened'))
      .eql(false);

    await page.keyboard.press('alt+down');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getStartDateBox().option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().option('opened'))
      .eql(true);

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getStartDateBox().option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().option('opened'))
      .eql(true);

    await page.keyboard.press('alt+up');

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.getStartDateBox().option('opened'))
      .eql(false)
      .expect(dateRangeBox.getEndDateBox().option('opened'))
      .eql(false);

    });

  test('DateRangeBox should be closed by press esc key when startDateBox is focused', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
    value: ['2021/09/17', '2021/10/24'],
    openOnFieldClick: true,
  });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.keyboard.press('esc');

    await page.expect(dateRangeBox.option('opened'))
      .eql(false);

    });

  test('DateRangeBox should be closed by press esc key when endDateBox is focused', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
    value: ['2021/09/17', '2021/10/24'],
    openOnFieldClick: true,
  });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.keyboard.press('esc');

    await page.expect(dateRangeBox.option('opened'))
      .eql(false);

    });

  test('DateRangeBox should be closed by press esc key when today/cancel/apply button in popup is focused, applyValueMode is useButtons', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
    value: ['2021/09/17', '2021/10/24'],
    openOnFieldClick: true,
    applyValueMode: 'useButtons',
  });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.keyboard.press('Tab')
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab');

    await page.expect(dateRangeBox.getPopup().getTodayButton().isFocused)
      .eql(true);

    await page.keyboard.press('esc');

    await page.expect(dateRangeBox.option('opened'))
      .eql(false);

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.keyboard.press('Tab')
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab');

    await page.expect(dateRangeBox.getPopup().getApplyButton().isFocused)
      .eql(true);

    await page.keyboard.press('esc');

    await page.expect(dateRangeBox.option('opened'))
      .eql(false);

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.keyboard.press('Tab')
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab');

    await page.expect(dateRangeBox.getPopup().getCancelButton().isFocused)
      .eql(true);

    await page.keyboard.press('esc');

    await page.expect(dateRangeBox.option('opened'))
      .eql(false);

    });

  test('DateRangeBox should be closed by press esc key when navigator element in popup is focused, applyValueMode is useButtons', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
    value: ['2021/09/17', '2021/10/24'],
    openOnFieldClick: true,
    applyValueMode: 'useButtons',
  });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.keyboard.press('Tab');

    await page.expect(dateRangeBox.getPopup().getNavigatorPrevButton().isFocused)
      .eql(true);

    await page.keyboard.press('esc');

    await page.expect(dateRangeBox.option('opened'))
      .eql(false);

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.keyboard.press('Tab')
      .pressKey('tab');

    await page.expect(dateRangeBox.getPopup().getNavigatorCaption().isFocused)
      .eql(true);

    await page.keyboard.press('esc');

    await page.expect(dateRangeBox.option('opened'))
      .eql(false);

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.keyboard.press('Tab')
      .pressKey('tab')
      .pressKey('tab');

    await page.expect(dateRangeBox.getPopup().getNavigatorNextButton().isFocused)
      .eql(true);

    await page.keyboard.press('esc');

    await page.expect(dateRangeBox.option('opened'))
      .eql(false);

    });

  test('DateRangeBox should be closed by press esc key when views wrapper in popup is focused, applyValueMode is useButtons', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
    value: ['2021/09/17', '2021/10/24'],
    openOnFieldClick: true,
    applyValueMode: 'useButtons',
  });

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true);

    await page.keyboard.press('Tab')
      .pressKey('tab')
      .pressKey('tab')
      .pressKey('tab');

    await page.expect(dateRangeBox.getPopup().getViewsWrapper().focused)
      .eql(true);

    await page.keyboard.press('esc');

    await page.expect(dateRangeBox.option('opened'))
      .eql(false);

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

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getStartDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.isFocused)
      .notOk();

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

    const dateRangeBox = page.locator('#dateRangeBox');

    await page.locator('#firstFocusableElement').click()
      .pressKey('tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

    await page.keyboard.press('Tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getPopup().getNavigatorPrevButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorCaption().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorNextButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getApplyButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getCancelButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
      .notOk();

    await page.keyboard.press('Tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .notOk()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorPrevButton().isFocused)
      .ok()
      .expect(dateRangeBox.getPopup().getNavigatorCaption().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorNextButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getApplyButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getCancelButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
      .notOk();

    await page.keyboard.press('Tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .notOk()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorPrevButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorCaption().isFocused)
      .ok()
      .expect(dateRangeBox.getPopup().getNavigatorNextButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getApplyButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getCancelButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
      .notOk();

    await page.keyboard.press('Tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .notOk()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorPrevButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorCaption().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorNextButton().isFocused)
      .ok()
      .expect(dateRangeBox.getPopup().getApplyButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getCancelButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
      .notOk();

    await page.keyboard.press('Tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .notOk()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorPrevButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorCaption().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorNextButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getViewsWrapper().focused)
      .ok()
      .expect(dateRangeBox.getPopup().getApplyButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getCancelButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
      .notOk();

    await page.keyboard.press('Tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .notOk()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorPrevButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorCaption().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorNextButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getApplyButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getCancelButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .notOk()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getApplyButton().isFocused)
      .ok()
      .expect(dateRangeBox.getPopup().getCancelButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
      .notOk();

    await page.keyboard.press('Tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .notOk()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getApplyButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getCancelButton().isFocused)
      .ok()
      .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
      .notOk();

    await page.keyboard.press('Tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getApplyButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getCancelButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
      .notOk();

    await page.keyboard.press('Tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getPopup().getApplyButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getCancelButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
      .notOk();

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

    const dateRangeBox = page.locator('#dateRangeBox');

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorPrevButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorCaption().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorNextButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getApplyButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getCancelButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
      .notOk();

    await page.keyboard.press('shift+tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .notOk()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorPrevButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorCaption().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorNextButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getApplyButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getCancelButton().isFocused)
      .ok()
      .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
      .notOk();

    await page.keyboard.press('shift+tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .notOk()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorPrevButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorCaption().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorNextButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getApplyButton().isFocused)
      .ok()
      .expect(dateRangeBox.getPopup().getCancelButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
      .notOk();

    await page.keyboard.press('shift+tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .notOk()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorPrevButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorCaption().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorNextButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getApplyButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getCancelButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .notOk()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorPrevButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorCaption().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorNextButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getViewsWrapper().focused)
      .ok()
      .expect(dateRangeBox.getPopup().getApplyButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getCancelButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
      .notOk();

    await page.keyboard.press('shift+tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .notOk()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorPrevButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorCaption().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorNextButton().isFocused)
      .ok()
      .expect(dateRangeBox.getPopup().getApplyButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getCancelButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
      .notOk();

    await page.keyboard.press('shift+tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .notOk()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorPrevButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorCaption().isFocused)
      .ok()
      .expect(dateRangeBox.getPopup().getNavigatorNextButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getApplyButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getCancelButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
      .notOk();

    await page.keyboard.press('shift+tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .notOk()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorPrevButton().isFocused)
      .ok()
      .expect(dateRangeBox.getPopup().getNavigatorCaption().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorNextButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getApplyButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getCancelButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
      .notOk();

    await page.keyboard.press('shift+tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getPopup().getNavigatorPrevButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorCaption().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorNextButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getApplyButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getCancelButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
      .notOk();

    await page.keyboard.press('shift+tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorPrevButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorCaption().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getNavigatorNextButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getApplyButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getCancelButton().isFocused)
      .notOk()
      .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
      .notOk();

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

    const dateRangeBox = page.locator('#dateRangeBox');

    await page.locator('#firstFocusableElement').click()
      .pressKey('tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

    await page.keyboard.press('Tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getPopup().getNavigatorPrevButton().isFocused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getPopup().getNavigatorCaption().isFocused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getPopup().getNavigatorNextButton().isFocused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getPopup().getViewsWrapper().focused)
      .ok();

    await page.keyboard.press('Tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

    await page.keyboard.press('Tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

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

    const dateRangeBox = page.locator('#dateRangeBox');

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .notOk()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

    await page.keyboard.press('shift+tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getPopup().getViewsWrapper().focused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getPopup().getNavigatorNextButton().isFocused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getPopup().getNavigatorCaption().isFocused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getPopup().getNavigatorPrevButton().isFocused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.keyboard.press('shift+tab');

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.isFocused)
      .ok()
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok()
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .notOk();

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

    const dateRangeBox = page.locator('#container');

    await page.click(dateRangeBox.getEndDateBox().input);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getEndDateBox().isFocused)
      .ok();

    await page.keyboard.press('shift+tab')
      .wait(100);

    await page.expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.getStartDateBox().isFocused)
      .ok();

    await page.keyboard.press('shift+tab')
      .wait(100);

    await page.expect(dateRangeBox.option('opened'))
      .eql(false);

    });

  [
    { key: 'left', offsetInDays: -1 },
    { key: 'right', offsetInDays: 1 },
    { key: 'up', offsetInDays: -7 },
    { key: 'down', offsetInDays: 7 },
  ].forEach(({ key, offsetInDays }) => {
    test(`DateRangeBox start value should be changed after after opening and navigation by '${key}' key and click on 'enter' key`, async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: initialValue,
      openOnFieldClick: false,
    });

      const dateRangeBox = page.locator('#container');

      await page.click(dateRangeBox.dropDownButton);

      await page.expect(dateRangeBox.option('opened'))
        .eql(true)
        .expect(dateRangeBox.option('value'))
        .eql(initialValue);

      await page.pressKey(key)
        .pressKey('enter');

      const expectedStartDate = getDateByOffset(initialValue[0], offsetInDays);

      await page.expect(dateRangeBox.option('opened'))
        .eql(true)
        .expect(dateRangeBox.option('value'))
        .eql([expectedStartDate, new Date(initialValue[1])]);

    });

    test(`Selection in calendar should be started with current startDate value after select startDate if endDate is not specified (key=${key})`, async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: [initialValue[0], null],
    });

      const dateRangeBox = page.locator('#container');

      await page.click(dateRangeBox.dropDownButton);

      await page.pressKey(key)
        .pressKey('enter');

      await page.keyboard.press('ArrowRight')
        .pressKey('right')
        .pressKey('right')
        .pressKey('right')
        .pressKey('right')
        .pressKey('enter');

      const expectedStartDate = getDateByOffset(initialValue[0], offsetInDays);
      const expectedEndDate = getDateByOffset(expectedStartDate, 5);

      await page.expect(dateRangeBox.option('opened'))
        .eql(false)
        .expect(dateRangeBox.option('value'))
        .eql([expectedStartDate, expectedEndDate]);

    });

    test(`Selection in calendar should be started with endDate value after select startDate if endDate is specified (key=${key})`, async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', {
      value: initialValue,
      openOnFieldClick: false,
    });

      const dateRangeBox = page.locator('#container');

      await page.click(dateRangeBox.dropDownButton);

      await page.keyboard.press('ArrowLeft')
        .pressKey('enter');

      await page.pressKey(key)
        .pressKey('enter');

      const expectedStartDate = getDateByOffset(initialValue[0], -1);
      const expectedEndDate = getDateByOffset(initialValue[1], offsetInDays);

      await page.expect(dateRangeBox.option('opened'))
        .eql(false)
        .expect(dateRangeBox.option('value'))
        .eql([expectedStartDate, expectedEndDate]);

    });
  });
});
