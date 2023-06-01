import createWidget from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import Scheduler from '../../../../../model/scheduler';

fixture.disablePageReloads`Scheduler Timeline: Grouping`
  .page(url(__dirname, '../../../../container.html'));

[
  'timelineDay',
  'timelineWeek',
  'timelineWorkWeek',
].forEach((view) => {
  test(`${view} view - header panel should contain group rows if horizontal grouping`, async (t) => {
    const scheduler = new Scheduler('#container');

    await t
      .expect(await scheduler.headerPanel.groupCells.count)
      .eql(2);
  }).before(async () => {
    await createWidget('dxScheduler', {
      groupOrientation: 'horizontal',
      views: [{
        type: 'timelineDay',
        groupOrientation: 'horizontal',
      }],
      currentView: 'timelineDay',
      groups: ['one'],
      resources: [{
        fieldExpr: 'one',
        dataSource: [
          { id: 1, text: 'a' },
          { id: 2, text: 'b' },
        ],
      }],
    });
  });
});
