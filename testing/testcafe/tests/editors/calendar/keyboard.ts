import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import Calendar from '../../../model/calendar';

const CALENDAR_SELECTED_DATE_CLASS = 'dx-calendar-selected-date';
const CALENDAR_CONTOURED_DATE_CLASS = 'dx-calendar-contoured-date';

fixture.disablePageReloads`Calendar keyboard navigation`
  .page(url(__dirname, '../../container.html'));

test('It should be possible navigate to today cell by keyboard', async (t) => {
  const calendar = new Calendar('#container');

  await t
    .click(Selector('body'))
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
