import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import DateRangeBox from '../../../model/dateRangeBox';
import { clearTestPage } from '../../../helpers/clearPage';

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
    .eql(false);

  await t
    .pressKey('alt+down');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true);

  await t
    .pressKey('alt+up');

  await t
    .expect(dateRangeBox.option('opened'))
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
    .eql(false);

  await t
    .pressKey('alt+down');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true);

  await t
    .pressKey('alt+up');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false);
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: false,
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
