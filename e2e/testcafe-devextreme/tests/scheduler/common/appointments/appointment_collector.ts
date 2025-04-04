import { ClientFunction } from 'testcafe';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`Appointment Editing`
  .page(url(__dirname, '../../../container.html'));

const dataSource = [{
  text: 'appointment2',
  startDate: new Date('2021-04-02T21:30:00.000Z'),
  endDate: new Date('2021-04-02T23:00:00.000Z'),
}, {
  text: 'appointment3',
  startDate: new Date('2021-04-02T23:30:00.000Z'),
  endDate: new Date('2021-04-03T01:00:00.000Z'),
}];

test('appointmentCollectorTemplate should render with appointments data', async (t) => {
  const renderedData = await ClientFunction(() => (window as any).renderedData)();

  await t.expect(renderedData).eql({
    appointmentCount: 1,
    isCompact: false,
    items: [dataSource[1]],
  });
}).before(async () => createWidget('dxScheduler', {
  dataSource,
  views: ['month'],
  currentView: 'month',
  currentDate: new Date(2021, 2, 28),
  maxAppointmentsPerCell: 1,
  appointmentCollectorTemplate(data: any) {
    (window as any).renderedData = data;
    return document.createElement('div');
  },
}));
