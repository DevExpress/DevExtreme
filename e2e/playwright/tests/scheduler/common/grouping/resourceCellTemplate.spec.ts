import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

test.describe('ResourceCellTemplate', () => {
  test('resourceCellTemplate layout should be rendered right in the agenda view', async ({ page }) => {
    const currentDate = new Date(2017, 4, 25);
    await createWidget(page, 'dxScheduler', (date) => ({
      dataSource: [{
        text: 'appointment',
        startDate: date,
        endDate: date,
        resource: 1,
      }],
      views: ['agenda'],
      currentView: 'agenda',
      currentDate: date,
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
    }), '#container', { arg: currentDate });

    const scheduler = new Scheduler(page, '#container');
    const groupHeader = scheduler.getGroupCell();

    await expect(groupHeader).toHaveText('Custom resource text');
  });
});
