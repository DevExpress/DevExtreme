import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`Scheduler performance`
  .page(url(__dirname, '../../container.html'));

const startDate = new Date(2025, 0, 6);
const delta = 15 * 60 * 1000;
const dataSource = Array.from({ length: 400 }, (_, i) => ({
  startDate: startDate.getTime() + i * delta,
  endDate: startDate.getTime() + (i + 1) * delta,
  recurrenceRule: 'FREQ=DAILY;INTERVAL=7',
  text: `Appointment ${i + 1}`,
}));

test('Switch between view screens should be fast if timezone not set', async (t) => {
  const scheduler = new Scheduler('#container');
  const now = Date.now();

  await t
    .click(scheduler.toolbar.navigator.nextButton)
    .expect(scheduler.toolbar.navigator.caption.textContent).eql('13-19 January 2025');
  await t.expect(Date.now() - now).lt(700, 'Switching to next view took too long');
  await t
    .click(scheduler.toolbar.navigator.nextButton)
    .expect(scheduler.toolbar.navigator.caption.textContent).eql('20-26 January 2025');
  await t.expect(Date.now() - now).lt(1400, 'Switching to next view took too long');
}).before(async () => createWidget('dxScheduler', {
  dataSource,
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2025, 0, 8, 15),
  startDayHour: 8,
  firstDayOfWeek: 1,
  height: 600,
}));

test('Switch between view screens should be fast if timezone set', async (t) => {
  const scheduler = new Scheduler('#container');
  const now = Date.now();

  await t
    .click(scheduler.toolbar.navigator.nextButton)
    .expect(scheduler.toolbar.navigator.caption.textContent).eql('13-19 January 2025');
  await t.expect(Date.now() - now).lt(900, 'Switching to next view took too long');
  await t
    .click(scheduler.toolbar.navigator.nextButton)
    .expect(scheduler.toolbar.navigator.caption.textContent).eql('20-26 January 2025');
  await t.expect(Date.now() - now).lt(1800, 'Switching to next view took too long');
}).before(async () => createWidget('dxScheduler', {
  dataSource,
  views: ['week'],
  timeZone: 'Europe/London',
  currentView: 'week',
  currentDate: new Date(2025, 0, 8, 15),
  startDayHour: 8,
  firstDayOfWeek: 1,
  height: 600,
}));
