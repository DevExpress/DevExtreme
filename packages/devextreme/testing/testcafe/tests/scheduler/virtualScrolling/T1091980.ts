import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture`Scheduler: Virtual scrolling`
  .page(url(__dirname, '../../container.html'));

test('it should correctly render virtual table if scheduler sizes are set in % (T1091980)', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .expect(scheduler.allDayTableCells.count)
    .eql(24)
    .expect(scheduler.dateTableCells.count)
    .eql(576);

  await scheduler.scrollTo(new Date(2021, 5, 12, 19));

  await t
    .expect(scheduler.allDayTableCells.count)
    .eql(24)
    .expect(scheduler.dateTableCells.count)
    .eql(576);
}).before(async () => {
  await createWidget(
    'dxScheduler',
    {
      width: '100%',
      height: '100%',
      dataSource: [],
      views: [{
        type: 'week',
        intervalCount: 10,
      }],
      currentView: 'week',
      currentDate: new Date(2021, 3, 5),
      startDayHour: 8,
      endDayHour: 20,
      crossScrollingEnabled: true,
      scrolling: {
        mode: 'virtual',
      },
    },
  );
});
