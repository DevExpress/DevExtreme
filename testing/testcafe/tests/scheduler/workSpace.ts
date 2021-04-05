import { ClientFunction } from 'testcafe';
import createWidget from '../../helpers/createWidget';
import Scheduler from '../../model/scheduler';
import { extend } from '../../../../js/core/utils/extend';
import url from '../../helpers/getPageUrl';

fixture`Scheduler: Workspace`
  .page(url(__dirname, '../container.html'));

const disableAnimation = ClientFunction(() => {
  (window as any).DevExpress.fx.off = true;
});

const createScheduler = async (options = {}): Promise<void> => {
  await disableAnimation();
  await createWidget('dxScheduler', extend(options, {
    dataSource: [],
    startDayHour: 9,
    height: 600,
  }));
};

test('Vertical selection between two workspace cells should focus cells between them (T804954)', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .resizeWindow(1200, 800)
    .dragToElement(scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(3, 0))
    .expect(scheduler.dateTableCells.filter('.dx-state-focused').count).eql(4);
}).before(() => createScheduler({
  views: [{ name: '2 Days', type: 'day', intervalCount: 2 }],
  currentDate: new Date(2015, 1, 9),
  currentView: 'day',
}));

test('Horizontal selection between two workspace cells should focus cells between them', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .setTestSpeed(0.5)
    .resizeWindow(1200, 800)
    .dragToElement(scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 3))
    .expect(scheduler.dateTableCells.filter('.dx-state-focused').count)
    .eql(4);
}).before(() => createScheduler({
  views: ['timelineWeek'],
  currentDate: new Date(2015, 1, 9),
  currentView: 'timelineWeek',
  groups: ['roomId'],
  resources: [{
    fieldExpr: 'roomId',
    label: 'Room',
    dataSource: [{
      text: '1', id: 1,
    }, {
      text: '2', id: 2,
    }],
  }],
}));
