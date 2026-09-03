import { expect, test } from '../../../../../../fixtures';
import { createWidget } from '../../../../../../helpers/createWidget';
import Scheduler from '../../../../../../models/scheduler';

[
  'timelineDay',
  'timelineWeek',
  'timelineWorkWeek',
].forEach((view) => {
  test(`${view} view - header panel should contain group rows if horizontal grouping`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
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

    const scheduler = new Scheduler(page, '#container');

    await expect(scheduler.headerPanel.groupCells).toHaveCount(2);
  });
});
