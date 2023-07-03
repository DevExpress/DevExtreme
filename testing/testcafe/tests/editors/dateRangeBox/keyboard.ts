import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import DateRangeBox from '../../../model/dateRangeBox';
import { clearTestPage } from '../../../helpers/clearPage';
import { appendElementTo } from '../../../helpers/domUtils';

fixture.disablePageReloads`DateRangeBox keyboard navigation`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => clearTestPage());

const initialValue = ['2021/10/17', '2021/11/24'];

const getDateByOffset = (date: Date | string, offset: number) => {
  const resultDate = new Date(date);

  return new Date(resultDate.setDate(resultDate.getDate() + offset));
};

test('DateRangeBox should be opened and close by press alt+down and alt+up respectively when startDateBox is focused', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getStartDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.getStartDateBox().option('opened'))
    .eql(false)
    .expect(dateRangeBox.getEndDateBox().option('opened'))
    .eql(false);

  await t
    .pressKey('alt+down');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getStartDateBox().option('opened'))
    .eql(true)
    .expect(dateRangeBox.getEndDateBox().option('opened'))
    .eql(true);

  await t
    .pressKey('alt+up');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.getStartDateBox().option('opened'))
    .eql(false)
    .expect(dateRangeBox.getEndDateBox().option('opened'))
    .eql(false);

  await t
    .pressKey('alt+down');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getStartDateBox().option('opened'))
    .eql(true)
    .expect(dateRangeBox.getEndDateBox().option('opened'))
    .eql(true);

  await t
    .pressKey('alt+up');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.getStartDateBox().option('opened'))
    .eql(false)
    .expect(dateRangeBox.getEndDateBox().option('opened'))
    .eql(false);
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: false,
}));

test('DateRangeBox should be opened and close by press alt+down and alt+up respectively when endDateBox is focused', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getEndDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.getStartDateBox().option('opened'))
    .eql(false)
    .expect(dateRangeBox.getEndDateBox().option('opened'))
    .eql(false);

  await t
    .pressKey('alt+down');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getStartDateBox().option('opened'))
    .eql(true)
    .expect(dateRangeBox.getEndDateBox().option('opened'))
    .eql(true);

  await t
    .pressKey('alt+up');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.getStartDateBox().option('opened'))
    .eql(false)
    .expect(dateRangeBox.getEndDateBox().option('opened'))
    .eql(false);

  await t
    .pressKey('alt+down');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getStartDateBox().option('opened'))
    .eql(true)
    .expect(dateRangeBox.getEndDateBox().option('opened'))
    .eql(true);

  await t
    .pressKey('alt+up');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.getStartDateBox().option('opened'))
    .eql(false)
    .expect(dateRangeBox.getEndDateBox().option('opened'))
    .eql(false);
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: false,
}));

test('DateRangeBox should be opened by press alt+down if startDate input is focused and close by press alt+up if endDateBox is focused', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getStartDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.getStartDateBox().option('opened'))
    .eql(false)
    .expect(dateRangeBox.getEndDateBox().option('opened'))
    .eql(false);

  await t
    .pressKey('alt+down');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getStartDateBox().option('opened'))
    .eql(true)
    .expect(dateRangeBox.getEndDateBox().option('opened'))
    .eql(true);

  await t
    .click(dateRangeBox.getEndDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getStartDateBox().option('opened'))
    .eql(true)
    .expect(dateRangeBox.getEndDateBox().option('opened'))
    .eql(true);

  await t
    .pressKey('alt+up');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.getStartDateBox().option('opened'))
    .eql(false)
    .expect(dateRangeBox.getEndDateBox().option('opened'))
    .eql(false);
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: false,
}));

test('DateRangeBox should be closed by press esc key when startDateBox is focused', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getStartDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true);

  await t
    .pressKey('esc');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false);
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: true,
}));

test('DateRangeBox should be closed by press esc key when endDateBox is focused', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getEndDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true);

  await t
    .pressKey('esc');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false);
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: true,
}));

test('DateRangeBox should be closed by press esc key when today button is focused, applyValueMode is useButtons', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getEndDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true);

  await t
    .pressKey('tab');

  await t
    .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
    .eql(true);

  await t
    .pressKey('esc');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false);
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: true,
  applyValueMode: 'useButtons',
}));

test('DateRangeBox should not be closed by press tab key on startDate input', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(Selector('body'), { offsetX: -50 })
    .pressKey('tab');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok();

  await t
    .pressKey('tab');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .pressKey('tab');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: true,
  opened: true,
  width: 500,
  dropDownOptions: {
    hideOnOutsideClick: false,
  },
}));

test('DateRangeBox keyboard navigation via `tab` key if applyValueMode is useButtons, start -> end -> today -> apply -> cancel -> start -> end', async (t) => {
  const dateRangeBox = new DateRangeBox('#dateRangeBox');

  await t
    .click(Selector('#firstFocusableElement'))
    .pressKey('tab');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();

  await t
    .pressKey('tab');

  await t
    .expect(dateRangeBox.option('opened'))
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

  await t
    .pressKey('tab');

  await t
    .expect(dateRangeBox.option('opened'))
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
    .notOk()
    .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
    .ok();

  await t
    .pressKey('tab');

  await t
    .expect(dateRangeBox.option('opened'))
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

  await t
    .pressKey('tab');

  await t
    .expect(dateRangeBox.option('opened'))
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

  await t
    .pressKey('tab');

  await t
    .expect(dateRangeBox.option('opened'))
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

  await t
    .pressKey('tab');

  await t
    .expect(dateRangeBox.option('opened'))
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
}).before(async () => {
  await appendElementTo('#container', 'div', 'firstFocusableElement');
  await appendElementTo('#container', 'div', 'dateRangeBox');
  await appendElementTo('#container', 'div', 'lastFocusableElement');

  await createWidget('dxButton', {
    text: 'First Focusable Element',
  }, '#firstFocusableElement');

  await createWidget('dxButton', {
    text: 'Last Focusable Element',
  }, '#lastFocusableElement');

  return createWidget('dxDateRangeBox', {
    value: ['2021/09/17', '2021/10/24'],
    openOnFieldClick: true,
    applyValueMode: 'useButtons',
    opened: true,
    width: 500,
    dropDownOptions: {
      hideOnOutsideClick: false,
    },
  }, '#dateRangeBox');
});

test('DateRangeBox keyboard navigation via `shift+tab` key if applyValueMode is useButtons, end -> start -> cancel -> apply -> today -> end -> start', async (t) => {
  const dateRangeBox = new DateRangeBox('#dateRangeBox');

  await t
    .click(dateRangeBox.getEndDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateRangeBox.option('opened'))
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

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateRangeBox.option('opened'))
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

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateRangeBox.option('opened'))
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

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateRangeBox.option('opened'))
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
    .notOk()
    .expect(dateRangeBox.getPopup().getTodayButton().isFocused)
    .ok();

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateRangeBox.option('opened'))
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

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateRangeBox.option('opened'))
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
}).before(async () => {
  await appendElementTo('#container', 'div', 'firstFocusableElement');
  await appendElementTo('#container', 'div', 'dateRangeBox');
  await appendElementTo('#container', 'div', 'lastFocusableElement');

  await createWidget('dxButton', {
    text: 'First Focused Element',
  }, '#firstFocusableElement');

  await createWidget('dxButton', {
    text: 'Last Focused Element',
  }, '#lastFocusableElement');

  return createWidget('dxDateRangeBox', {
    value: ['2021/09/17', '2021/10/24'],
    openOnFieldClick: true,
    applyValueMode: 'useButtons',
    opened: false,
    width: 500,
  }, '#dateRangeBox');
});

test('DateRangeBox should not be closed by press shift+tab key on endDate input', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(Selector('body'), { offsetX: -50 })
    .pressKey('shift+tab');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok();

  await t
    .pressKey('shift+tab');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: true,
  opened: true,
  width: 500,
  dropDownOptions: {
    hideOnOutsideClick: false,
  },
}));

[
  { key: 'left', offsetInDays: -1 },
  { key: 'right', offsetInDays: 1 },
  { key: 'up', offsetInDays: -7 },
  { key: 'down', offsetInDays: 7 },
].forEach(({ key, offsetInDays }) => {
  test(`DateRangeBox start value should be changed after after opening and navigation by '${key}' key and click on 'enter' key`, async (t) => {
    const dateRangeBox = new DateRangeBox('#container');

    await t
      .click(dateRangeBox.dropDownButton);

    await t
      .expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.option('value'))
      .eql(initialValue);

    await t
      .pressKey(key)
      .pressKey('enter');

    const expectedStartDate = getDateByOffset(initialValue[0], offsetInDays);

    await t
      .expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.option('value'))
      .eql([expectedStartDate, new Date(initialValue[1])]);
  }).before(async () => createWidget('dxDateRangeBox', {
    value: initialValue,
    openOnFieldClick: false,
  }));

  test('Selection in calendar should be started with current startDate value after select startDate if endDate is not specified', async (t) => {
    const dateRangeBox = new DateRangeBox('#container');

    await t
      .click(dateRangeBox.dropDownButton);

    await t
      .pressKey(key)
      .pressKey('enter');

    await t
      .pressKey('right')
      .pressKey('right')
      .pressKey('right')
      .pressKey('right')
      .pressKey('right')
      .pressKey('enter');

    const expectedStartDate = getDateByOffset(initialValue[0], offsetInDays);
    const expectedEndDate = getDateByOffset(expectedStartDate, 5);

    await t
      .expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.option('value'))
      .eql([expectedStartDate, expectedEndDate]);
  }).before(async () => createWidget('dxDateRangeBox', {
    value: [initialValue[0], null],
  }));

  test('Selection in calendar should be started with endDate value after select startDate if endDate is specified', async (t) => {
    const dateRangeBox = new DateRangeBox('#container');

    await t
      .click(dateRangeBox.dropDownButton);

    await t
      .pressKey('left')
      .pressKey('enter');

    await t
      .pressKey(key)
      .pressKey('enter');

    const expectedStartDate = getDateByOffset(initialValue[0], -1);
    const expectedEndDate = getDateByOffset(initialValue[1], offsetInDays);

    await t
      .expect(dateRangeBox.option('opened'))
      .eql(false)
      .expect(dateRangeBox.option('value'))
      .eql([expectedStartDate, expectedEndDate]);
  }).before(async () => createWidget('dxDateRangeBox', {
    value: initialValue,
    openOnFieldClick: false,
  }));
});
