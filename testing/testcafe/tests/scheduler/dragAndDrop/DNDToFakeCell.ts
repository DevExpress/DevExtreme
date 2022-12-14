import { ClientFunction, Selector } from 'testcafe';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import Scheduler from '../../../model/scheduler';
import { appendElementTo } from '../../navigation/helpers/domUtils';

fixture.disablePageReloads`Drag-n-drop to fake cell`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

safeSizeTest('Should not select cells outside the scheduler(T1040795)', async (t) => {
  const scheduler = new Scheduler('#container');

  const { element } = scheduler.getAppointment('app');

  await t
    .drag(element, 0, 200)

    .expect(Selector('#fake').hasClass('dx-scheduler-date-table-droppable-cell'))
    .eql(false);
}).before(async () => {
  await appendElementTo('#container', 'div', 'scheduler');
  await appendElementTo('#container', 'div', 'fake', {
    width: '400px', height: '100px',
  });
  await ClientFunction(() => {
    $('#fake').addClass('scheduler-date-table-cell');
  })();

  return createWidget('dxScheduler', {
    dataSource: [
      {
        text: 'app',
        startDate: new Date(2021, 3, 26, 2),
        endDate: new Date(2021, 3, 26, 2, 30),
      },
    ],
    views: ['day'],
    currentDate: new Date(2021, 3, 26),
    height: 200,
    width: 400,
  });
});
