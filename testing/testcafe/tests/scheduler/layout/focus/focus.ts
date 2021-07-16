import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../model/scheduler';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture`Layout:Templates:Focus`
  .page(url(__dirname, './container.html'));

test('Workspace should be focus on click', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .click(scheduler.workSpace)
    .expect(await takeScreenshot('workspace-focused-on-click.png', scheduler.element))
    .ok();

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [{
      text: 'A',
      startDate: new Date(2021, 4, 27, 0, 30),
      endDate: new Date(2021, 4, 27, 1),
      recurrenceRule: 'FREQ=DAILY',
    }],
    recurrenceEditMode: 'series',
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 4, 27),
    height: 600,
    width: 600,
  }, true);
});

test('Appointment should be focus on click', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .click(scheduler.getAppointment('A').element)
    .expect(await takeScreenshot('appointment-focused-on-click.png', scheduler.element))
    .ok();

  await t
    .doubleClick(scheduler.getAppointment('A').element, { speed: 0.1 })
    .expect(await takeScreenshot('popup-focused-after-show.png', scheduler.appointmentPopup.element))
    .ok();

  await t
    .click(scheduler.appointmentPopup.cancelButton, { speed: 0.1 })
    .expect(await takeScreenshot('appointment-focused-after-hide-popup.png', scheduler.element))
    .ok();

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [{
      text: 'A',
      startDate: new Date(2021, 4, 27, 0, 30),
      endDate: new Date(2021, 4, 27, 1),
      recurrenceRule: 'FREQ=DAILY',
    }],
    recurrenceEditMode: 'series',
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 4, 27),
    height: 600,
    width: 600,
  }, true);
});

test('Appointment should be get focus after popup hided', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .doubleClick(scheduler.getAppointment('A').element, { speed: 0.1 })
    .expect(await takeScreenshot('popup-focused-after-show.png', scheduler.element))
    .ok();

  await t
    .click(scheduler.appointmentPopup.cancelButton, { speed: 0.1 })
    .expect(await takeScreenshot('appointment-focused-after-hide-popup.png', scheduler.element))
    .ok();

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [{
      text: 'A',
      startDate: new Date(2021, 4, 27, 0, 30),
      endDate: new Date(2021, 4, 27, 1),
      recurrenceRule: 'FREQ=DAILY',
    }],
    recurrenceEditMode: 'series',
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 4, 27),
    height: 600,
    width: 600,
  }, true);
});
