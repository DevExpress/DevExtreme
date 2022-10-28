import { Selector } from 'testcafe';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import Scheduler from '../../../model/scheduler';

fixture`Drag-n-drop to fake cell`
  .page(url(__dirname, './pages/containerWithFakeCell.html'));

safeSizeTest('Should not select cells outside the scheduler(T1040795)', async (t) => {
  const scheduler = new Scheduler('#container');

  const { element } = scheduler.getAppointment('app');

  await t
    .drag(element, 0, 200)

    .expect(Selector('#fake').hasClass('dx-scheduler-date-table-droppable-cell'))
    .eql(false);
}).before(async () => createWidget('dxScheduler', {
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
}));
