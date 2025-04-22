import { ClientFunction } from 'testcafe';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`Appointment Editing`
  .page(url(__dirname, '../../../container.html'));

const dataSource = [{
  text: 'appointment1',
  startDate: new Date('2021-04-02T07:30:00.000Z'),
  endDate: new Date('2021-04-02T09:00:00.000Z'),
}, {
  text: 'appointment2',
  startDate: new Date('2021-04-02T07:35:00.000Z'),
  endDate: new Date('2021-04-02T09:05:00.000Z'),
}];
const config = {
  dataSource,
  timeZone: 'America/Los_Angeles',
  currentDate: new Date(2021, 3, 2),
  maxAppointmentsPerCell: 1,
};

['day', 'week', 'month', 'timelineDay', 'timelineWeek', 'timelineMonth'].forEach((view) => {
  test(`appointmentCollectorTemplate should render with appointments data on ${view} view`, async (t) => {
    const renderedData = await ClientFunction(() => (window as any).appointmentCollectorArgsData)();

    await t.expect(renderedData).eql({
      appointmentCount: 1,
      isCompact: ['day', 'week'].includes(view),
      items: [dataSource[1]],
    });
  })
    .before(async () => createWidget('dxScheduler', {
      ...config,
      dataSource,
      views: [view],
      currentView: view,
      appointmentCollectorTemplate(data: any) {
        (window as any).appointmentCollectorArgsData = data;
        return document.createElement('div');
      },
    }))
    .after(() => ClientFunction(() => {
      (window as any).appointmentCollectorArgsData = undefined;
    })());

  test(`appointmentCollectorTemplate in view config should render with appointments data on ${view} view`, async (t) => {
    const renderedData = await ClientFunction(() => (window as any).appointmentCollectorArgsData)();

    await t.expect(renderedData).eql({
      appointmentCount: 1,
      isCompact: ['day', 'week'].includes(view),
      items: [dataSource[1]],
    });
  })
    .before(async () => createWidget('dxScheduler', {
      ...config,
      dataSource,
      views: [{
        type: view,
        appointmentCollectorTemplate(data: any) {
          (window as any).appointmentCollectorArgsData = data;
          return document.createElement('div');
        },
      }],
      currentView: view,
    }))
    .after(() => ClientFunction(() => {
      (window as any).appointmentCollectorArgsData = undefined;
    })());
});
