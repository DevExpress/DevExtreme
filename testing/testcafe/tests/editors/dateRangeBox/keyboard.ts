import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import DateRangeBox from '../../../model/dateRangeBox';
import { clearTestPage } from '../../../helpers/clearPage';

fixture.disablePageReloads`DateRangeBox keyboard navigation`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => clearTestPage());

const initialValue = ['2021/10/17', '2021/11/24'];

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
  { key: 'left', expectedStartDate: new Date(2021, 9, 16) },
  { key: 'right', expectedStartDate: new Date(2021, 9, 18) },
  { key: 'up', expectedStartDate: new Date(2021, 9, 10) },
  { key: 'down', expectedStartDate: new Date(2021, 9, 24) },
].forEach(({ key, expectedStartDate }) => {
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

    await t
      .expect(dateRangeBox.option('opened'))
      .eql(true)
      .expect(dateRangeBox.option('value'))
      .eql([expectedStartDate, new Date(initialValue[1])]);
  }).before(async () => createWidget('dxDateRangeBox', {
    value: initialValue,
    openOnFieldClick: false,
  }));

  test('DateRangeBox should allow to select endDate value in calendar after select startDate', async (t) => {
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

    let expectedEndDate = new Date(expectedStartDate);
    expectedEndDate = new Date(expectedEndDate.setDate(expectedStartDate.getDate() + 5));

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
