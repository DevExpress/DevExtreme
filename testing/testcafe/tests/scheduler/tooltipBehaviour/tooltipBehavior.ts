import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import dataSource from './init/widget.data';
import { createScheduler, scroll } from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`Appointment tooltip behavior during scrolling in the Scheduler (T755449)`
  .page(url(__dirname, '../../container.html'));

safeSizeTest('The tooltip of collector should not scroll page and immediately hide', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .click(scheduler.collectors.find('7').element)
    .expect(scheduler.appointmentTooltip.isVisible())
    .ok();
}, [600, 450]).before(async () => createScheduler({
  views: [{
    type: 'week',
    name: 'week',
    maxAppointmentsPerCell: '0',
  }],
  currentDate: new Date(2017, 4, 25),
  startDayHour: 9,
  currentView: 'week',
  dataSource: [{
    text: 'A',
    startDate: new Date(2017, 4, 22, 9, 30),
    endDate: new Date(2017, 4, 22, 11, 30),
  }, {
    text: 'B',
    startDate: new Date(2017, 4, 22, 9, 30),
    endDate: new Date(2017, 4, 22, 11, 30),
  }, {
    text: 'C',
    startDate: new Date(2017, 4, 22, 9, 30),
    endDate: new Date(2017, 4, 22, 11, 30),
  }, {
    text: 'D',
    startDate: new Date(2017, 4, 22, 9, 30),
    endDate: new Date(2017, 4, 22, 11, 30),
  }, {
    text: 'E',
    startDate: new Date(2017, 4, 22, 9, 30),
    endDate: new Date(2017, 4, 22, 11, 30),
  }, {
    text: 'F',
    startDate: new Date(2017, 4, 22, 9, 30),
    endDate: new Date(2017, 4, 22, 11, 30),
  }, {
    text: 'G',
    startDate: new Date(2017, 4, 22, 9, 30),
    endDate: new Date(2017, 4, 22, 11, 30),
  }],
}));

safeSizeTest('The tooltip should not hide after automatic scrolling during an appointment click', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment = scheduler.getAppointment('Brochure Design Review');

  await t
    .click(appointment.element)
    .expect(scheduler.appointmentTooltip.isVisible())
    .ok();
}, [600, 400]).before(async () => createScheduler({
  views: ['week'],
  currentView: 'week',
  dataSource,
}));

safeSizeTest('The tooltip should hide after manually scrolling in the browser', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment = scheduler.getAppointment('Brochure Design Review');

  await t
    .click(appointment.element)
    .expect(scheduler.appointmentTooltip.isVisible())
    .ok();
  await scroll(0, 100);
  await t
    .wait(500)
    .expect(scheduler.appointmentTooltip.isVisible()).notOk();
}, [600, 400]).before(async () => createScheduler({
  views: ['week'],
  currentView: 'week',
  dataSource,
}));

[
  false,
  true,
].forEach((adaptivityEnabled) => {
  safeSizeTest('The tooltip screenshot', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const scheduler = new Scheduler('#container');
    const appointment = scheduler.getAppointment('Brochure Design Review');
    const tooltipNamePrefix = adaptivityEnabled ? 'mobile' : 'desktop';

    const expectedSelector = adaptivityEnabled
      ? scheduler.appointmentTooltip.mobileElement
      : scheduler.appointmentTooltip.element;

    await t
      .click(appointment.element)
      // act
      .expect(await takeScreenshot(`appointment-${tooltipNamePrefix}-tooltip-screenshot.png`, scheduler.element))
      .ok()
      // assert
      .expect(expectedSelector.exists)
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [600, 400]).before(async (t) => {
    await t.debug();

    return createScheduler({
      views: ['week'],
      currentView: 'week',
      dataSource,
      adaptivityEnabled,
    });
  });
});
