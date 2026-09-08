import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { appendElementTo, setClassAttribute } from '../../../../helpers/domUtils';
import { dragToOffset } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';

test('Should not select cells outside the scheduler(T1040795)', async ({ page }) => {
  await appendElementTo(page, '#container', 'div', 'scheduler');
  await appendElementTo(page, '#container', 'div', 'fake', {
    width: '400px', height: '100px',
  });
  await setClassAttribute(page, '#fake', 'scheduler-date-table-cell');

  await createWidget(page, 'dxScheduler', {
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
  }, '#scheduler');

  const scheduler = new Scheduler(page, '#scheduler');
  const { element } = scheduler.getAppointment('app');

  await dragToOffset(page, element, 0, 200);

  await expect(page.locator('#fake')).not.toHaveClass(/dx-scheduler-date-table-droppable-cell/);
});
