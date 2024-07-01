import { ClientFunction, Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import Calendar from '../../../model/calendar';

const CALENDAR_SELECTED_DATE_CLASS = 'dx-calendar-selected-date';
const CALENDAR_CONTOURED_DATE_CLASS = 'dx-calendar-contoured-date';

fixture.disablePageReloads`Calendar keyboard navigation`
  .page(url(__dirname, '../../container.html'));

test('Tab navigation order prevButton-caption-nextButton-viewdWrapper-todayButton', async (t) => {
  const calendar = new Calendar('#container');

  await t
    .click(Selector('body'))
    .pressKey('tab');

  await t
    .expect(calendar.getNavigatorPrevButton().isFocused)
    .ok()
    .pressKey('tab')
    .expect(calendar.getNavigatorCaption().isFocused)
    .ok()
    .pressKey('tab')
    .expect(calendar.getNavigatorNextButton().isFocused)
    .ok()
    .pressKey('tab');

  const cell = calendar.getView().getCellByDate(new Date(2021, 9, 17));
  await t
    .expect(cell.hasClass(CALENDAR_CONTOURED_DATE_CLASS))
    .ok()
    .expect(cell.hasClass(CALENDAR_SELECTED_DATE_CLASS))
    .ok();

  await t
    .pressKey('tab');

  await t
    .expect(calendar.getTodayButton().isFocused)
    .ok();

  await t
    .pressKey('enter');

  const currentDate = await calendar.option('value') as Date;
  const today = new Date();

  currentDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  await t
    .expect(currentDate)
    .eql(today);

  const todayCell = calendar.getView().getCellByDate(today);

  await t
    .expect(todayCell.hasClass(CALENDAR_SELECTED_DATE_CLASS))
    .ok();
}).before(async () => createWidget('dxCalendar', {
  value: new Date(2021, 9, 17),
  showTodayButton: true,
}));

test('focusin and focusout event handlers should not be called on tab navigate inside calendar', async (t) => {
  const calendar = new Calendar('#container');

  await t
    .click(Selector('body'))
    .pressKey('tab');

  await t
    .expect(calendar.getNavigatorPrevButton().isFocused)
    .ok()
    .expect(ClientFunction(() => (window as any).onFocusInCounter)())
    .eql(1)
    .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
    .eql(0);

  await t
    .pressKey('tab');

  await t
    .expect(calendar.getNavigatorCaption().isFocused)
    .ok()
    .expect(ClientFunction(() => (window as any).onFocusInCounter)())
    .eql(1)
    .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
    .eql(0);

  await t
    .pressKey('tab');

  await t
    .expect(calendar.getNavigatorNextButton().isFocused)
    .ok()
    .expect(ClientFunction(() => (window as any).onFocusInCounter)())
    .eql(1)
    .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
    .eql(0);

  await t
    .pressKey('tab');

  const cell = calendar.getView().getCellByDate(new Date(2021, 9, 17));
  await t
    .expect(cell.hasClass(CALENDAR_CONTOURED_DATE_CLASS))
    .ok()
    .expect(cell.hasClass(CALENDAR_SELECTED_DATE_CLASS))
    .ok()
    .expect(ClientFunction(() => (window as any).onFocusInCounter)())
    .eql(1)
    .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
    .eql(0);

  await t
    .pressKey('tab');

  await t
    .expect(calendar.getTodayButton().isFocused)
    .ok()
    .expect(ClientFunction(() => (window as any).onFocusInCounter)())
    .eql(1)
    .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
    .eql(0);

  await t
    .pressKey('tab');

  await t
    .expect(calendar.isFocused)
    .notOk()
    .expect(ClientFunction(() => (window as any).onFocusInCounter)())
    .eql(1)
    .expect(ClientFunction(() => (window as any).onFocusOutCounter)())
    .eql(1);
}).before(async () => {
  await ClientFunction(() => {
    (window as any).onFocusInCounter = 0;
    (window as any).onFocusOutCounter = 0;
  })();

  return createWidget('dxCalendar', {
    value: new Date(2021, 9, 17),
    showTodayButton: true,
    onFocusIn() {
      ((window as any).onFocusInCounter as number) += 1;
    },
    onFocusOut() {
      ((window as any).onFocusOutCounter as number) += 1;
    },
  });
}).after(async () => {
  await ClientFunction(() => {
    delete (window as any).onFocusInCounter;
    delete (window as any).onFocusOutCounter;
  })();
});
