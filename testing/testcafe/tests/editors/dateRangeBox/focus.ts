import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import DateRangeBox from '../../../model/dateRangeBox';

fixture.disablePageReloads`DateRangeBox focus state`
  .page(url(__dirname, '../../container.html'));

test('DateRangeBox & DateBoxes should have focus class if inputs are focused by tab', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(Selector('body'))
    .pressKey('tab')
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();

  await t
    .pressKey('tab')
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .pressKey('tab')
    .expect(dateRangeBox.isFocused)
    .notOk()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
}));

test('DateRangeBox & DateBoxes should have focus class if inputs are focused by click', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getStartDateBox().input)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();

  await t
    .click(dateRangeBox.getEndDateBox().input)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .click(Selector('body'))
    .expect(dateRangeBox.isFocused)
    .notOk()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
}));

test('DateRangeBox & Start DateBox should have focus class after click on drop down button', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.dropDownButton)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
}));

test('DateRangeBox & StartDateBox should be focused if dateRangeBox open by click on drop down button and endDateBox was focused', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getEndDateBox().element);

  await t
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .click(dateRangeBox.dropDownButton);

  await t
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
}));

test('DateRangeBox & StartDateBox should be focused after click on clear button', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getEndDateBox().element);

  await t
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .click(dateRangeBox.clearButton);

  await t
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  showClearButton: true,
  value: ['2021/09/17', '2021/10/24'],
}));

// TODO: support this scenario
test.skip('DateRangeBox & StartDateBox should be focused if dateRangeBox open by keyboard, alt+down', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getEndDateBox().input);

  await t
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .pressKey('alt+down');

  await t
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
}));
