import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import DateRangeBox from '../../../model/dateRangeBox';
import { clearTestPage } from '../../../helpers/clearPage';

fixture`DateRangeBox focus state`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => clearTestPage());

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
  openOnFieldClick: false,
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
  openOnFieldClick: false,
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
  openOnFieldClick: false,
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
  openOnFieldClick: false,
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
  openOnFieldClick: false,
}));

test('DateRangeBox & StartDateBox should be focused if startDateBox open by keyboard, alt+down, alt+up', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getStartDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();

  await t
    .pressKey('alt+down');

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
    .pressKey('alt+up');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: false,
}));

test('DateRangeBox & StartDateBox should be focused if endDateBox open and close by keyboard, alt+down, alt+up', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getEndDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();

  await t
    .pressKey('alt+down');

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
    .pressKey('alt+up');

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .ok();
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: false,
}));

test('Opened dateRangeBox should not be closed after click on inputs, openOnFieldClick: true', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getStartDateBox().input);

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
    .click(dateRangeBox.getStartDateBox().input);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: true,
  opened: true,
}));

test('Opened dateRangeBox should be closed after outside click, openOnFieldClick: true', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(Selector('body'));

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(false)
    .expect(dateRangeBox.isFocused)
    .notOk()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .notOk()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();

  await t
    .click(dateRangeBox.dropDownButton);

  await t
    .expect(dateRangeBox.option('opened'))
    .eql(true)
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  value: ['2021/09/17', '2021/10/24'],
  openOnFieldClick: true,
  opened: true,
}));

// TODO: find way to reproduce focus using accessKey accessKey
test.skip('DateRangeBox and StartDateBox should have focus class after focus via accessKey', async (t) => {
  const dateRangeBox = new DateRangeBox('#container');

  await t
    .click(dateRangeBox.getEndDateBox().input);

  await t
    .pressKey('alt+x');

  await t
    .expect(dateRangeBox.isFocused)
    .ok()
    .expect(dateRangeBox.getStartDateBox().isFocused)
    .ok()
    .expect(dateRangeBox.getEndDateBox().isFocused)
    .notOk();
}).before(async () => createWidget('dxDateRangeBox', {
  accessKey: 'x',
  openOnFieldClick: false,
}));
