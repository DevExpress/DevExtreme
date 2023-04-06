import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

const CLICK_OPTIONS = { speed: 0.5 };
const SCHEDULER_SELECTOR = '#container';
const INITIAL_APPOINTMENT_TITLE = 'appointment';

fixture.disablePageReloads`Reccurence dialog`
  .page(url(__dirname, '../../container.html'));

test('Reccurence dialog screenshot', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointment = scheduler.getAppointment(INITIAL_APPOINTMENT_TITLE);

  await t
    .doubleClick(appointment.element, CLICK_OPTIONS)
    // act
    .expect(await takeScreenshot('reccurence-dialog-screenshot.png', scheduler.element))
    .ok()
    // assert
    .expect(Selector('.dx-overlay-wrapper.dx-dialog'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  dataSource: [{
    id: 1,
    text: INITIAL_APPOINTMENT_TITLE,
    startDate: new Date(2021, 2, 29, 9, 30),
    endDate: new Date(2021, 2, 29, 11, 30),
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
  }],
  views: ['day'],
  currentView: 'day',
  currentDate: new Date(2021, 2, 29),
  startDayHour: 9,
  endDayHour: 14,
  height: 600,
}));
