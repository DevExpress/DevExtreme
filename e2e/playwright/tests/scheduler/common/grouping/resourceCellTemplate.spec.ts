import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

test('resourceCellTemplate layout should be rendered right in the agenda view', async ({ page }) => {
  const currentDate = new Date(2017, 4, 25);

  await createWidget(page, 'dxScheduler', {
    dataSource: [{
      text: 'appointment',
      startDate: currentDate,
      endDate: currentDate,
      resource: 1,
    }],
    views: ['agenda'],
    currentView: 'agenda',
    currentDate,
    resourceCellTemplate() {
      return 'Custom resource text';
    },
    groups: ['resource'],
    resources: [{
      fieldExpr: 'resource',
      dataSource: [{
        text: 'Resource text',
        id: 1,
      }],
      label: 'Resource',
    }],
    height: 600,
  });

  const scheduler = new Scheduler(page, '#container');

  await expect(scheduler.getGroupCell()).toHaveText('Custom resource text');
});
