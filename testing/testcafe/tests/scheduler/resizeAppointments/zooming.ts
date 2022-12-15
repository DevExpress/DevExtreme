import { ClientFunction } from 'testcafe';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import { setZoomLevel } from '../virtualScrolling/utils';

fixture.disablePageReloads`Resize appointments - Zooming`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

test('Vertical resize with zooming', async (t) => {
  const scheduler = new Scheduler('#container');
  const resizableAppointment = scheduler.getAppointment('Appt-01');

  await t
    .drag(resizableAppointment.resizableHandle.bottom, 0, 430, { offsetY: 20 });

  const height = parseInt(await resizableAppointment.size.height, 10);

  await t
    .expect(height)
    .eql(515);
}).before(async () => {
  await setZoomLevel(110);

  await createWidget(
    'dxScheduler',
    {
      dataSource: [{
        text: 'Appt-01',
        startDate: new Date(2021, 2, 28, 0),
        endDate: new Date(2021, 2, 28, 0, 30),
      }],
      views: ['day'],
      currentView: 'day',
      cellDuration: 15,
      currentDate: new Date(2021, 2, 28),
    },
  );

  await ClientFunction(() => {
    $('.dx-scheduler-cell-sizes-vertical').css('height', '43px');
  })();
}).after(async () => {
  await setZoomLevel(0);
  await disposeWidgets();
});
