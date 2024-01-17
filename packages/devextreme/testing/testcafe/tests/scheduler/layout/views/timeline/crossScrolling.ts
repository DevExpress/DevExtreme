import createWidget from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import Scheduler from '../../../../../model/scheduler';

fixture`Scheduler Timeline: Cross-Scrolling`
  .page(url(__dirname, '../../../../container.html'));

test('Timeline should have Cross-Scrolling enabled', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .expect(await scheduler.workspaceHasBothScrollbar)
    .ok();
}).before(async () => {
  await createWidget('dxScheduler', {
    height: 400,
    width: 800,
    currentDate: new Date(2021, 1, 2),
    dataSource: [],
    views: ['timelineDay'],
    currentView: 'timelineDay',
    startDayHour: 8,
    endDayHour: 20,
    cellDuration: 60,
    showAllDayPanel: false,
    groups: ['humanId'],
    resources: [{
      fieldExpr: 'humanId',
      dataSource: [{
        id: 0,
        text: 'David Carter',
        color: '#74d57b',
      }, {
        id: 1,
        text: 'Emma Lewis',
        color: '#1db2f5',
      }, {
        id: 2,
        text: 'Noah Hill',
        color: '#f5564a',
      }, {
        id: 3,
        text: 'William Bell',
        color: '#97c95c',
      }, {
        id: 4,
        text: 'Jane Jones',
        color: '#ffc720',
      }, {
        id: 5,
        text: 'Violet Young',
        color: '#eb3573',
      }, {
        id: 6,
        text: 'Samuel Perry',
        color: '#a63db8',
      }, {
        id: 7,
        text: 'Luther Murphy',
        color: '#ffaa66',
      }, {
        id: 8,
        text: 'Craig Morris',
        color: '#2dcdc4',
      }],
      label: 'Employee',
    }],
  });
});
