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
  value: ['2023/01/05', '2023/02/14'],
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
  value: ['2023/01/05', '2023/02/14'],
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
  value: ['2023/01/05', '2023/02/14'],
}));

// TODO: end date box should be focused after select start date
// TODO: end date box should be focused after select end date
// eslint-disable-next-line max-len
// TODO: start date should be focused when endDateBox is focused and dateRangeBox open by click on dropdownbutton
