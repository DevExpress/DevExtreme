import { ClientFunction } from 'testcafe';
import Scheduler from '../../../../model/scheduler';
import { createScreenshotsComparer } from '../../../../helpers/screenshot-comparer';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture`Layout:Templates:appointmentTooltipTemplate`
  .page(url(__dirname, '../../../container.html'));

test('appointmentTooltipTemplate layout should be rendered right', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.click(scheduler.getAppointmentByIndex().element);

  await t
    .expect(await takeScreenshot('appointment-tooltip-template.png', scheduler.element))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [{
      startDate: new Date(2017, 4, 25, 0, 30),
      endDate: new Date(2017, 4, 25, 2, 30),
    }],
    views: ['workWeek'],
    currentView: 'workWeek',
    currentDate: new Date(2017, 4, 25),
    appointmentTooltipTemplate: ClientFunction((appointment) => {
      const result = $('<div  style=\'display: flex; flex-wrap: wrap;\' />');

      const startDateBox = ($('<div />') as any).dxDateBox({
        type: 'datetime',
        value: appointment.appointmentData.startDate,
      });

      const endDateBox = ($('<div />') as any).dxDateBox({
        type: 'datetime',
        value: appointment.appointmentData.endDate,
      });

      result.append(startDateBox, endDateBox);

      return result;
    }),
    height: 600,
  }, true);
});
