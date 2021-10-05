import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../model/scheduler';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture`Layout:Templates:displayArguments`
  .page(url(__dirname, '../../../container.html'));

const testCases = [{
  timeZone: 'America/Los_Angeles',
  dataSource: [{
    startDate: new Date(2021, 2, 28, 20),
    endDate: new Date(2021, 2, 28, 22),
  }],
}, {
  timeZone: undefined,
  dataSource: [{
    startDate: new Date(2021, 2, 28, 10),
    endDate: new Date(2021, 2, 28, 12),
  }],
}];

testCases.forEach(({ timeZone, dataSource }) => {
  test(`displayStartDate and displayEndDate arguments should be right with timeZone='${timeZone}'`, async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`template-display-arguments=${timeZone}.png`, scheduler.workSpace))
      .ok();

    await t
      .expect(await takeScreenshot(`template-display-arguments=${timeZone}.png`, scheduler.workSpace))
      .ok();

    await t
      .click(scheduler.getAppointmentByIndex(0).element, { speed: 0.1 });

    await t
      .expect(await takeScreenshot(`on-appointment-click-display-arguments=${timeZone}.png`, scheduler.workSpace))
      .ok();

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxScheduler', {
      timeZone,
      dataSource,
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(2021, 2, 28),
      startDayHour: 9,
      height: 600,

      onAppointmentClick: ClientFunction((model) => {
        const data = model.targetedAppointmentData;

        const result = $('<b />');
        result.append(`${data.displayStartDate} ${data.displayEndDate}`);

        $('.container').prepend(result);
      }),
      appointmentTemplate: (model) => {
        const data = model.targetedAppointmentData;

        const result = $('<b />');
        result.append(`${data.displayStartDate} ${data.displayEndDate}`);

        return result;
      },
    }, true);
  });
});
