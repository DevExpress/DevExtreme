import { takeScreenshot } from 'devextreme-screenshot-comparer/build/src/take-screenshot';

import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`Scheduler: Virtual scrolling`
  .page(url(__dirname, '../../container.html'));

test('it should correctly render virtual table if more than 1000 cells are virtualized (T1091980)', async (t) => {
  const scheduler = new Scheduler('#container');

  await takeScreenshot(t, scheduler.element, 'virtual-scrolling-many-cells-start.png');

  await scheduler.scrollTo(new Date(2024, 1, 1, 12), { groupId: 100 });

  await takeScreenshot(t, scheduler.element, 'virtual-scrolling-many-cells-middle.png');

  await scheduler.scrollTo(new Date(2024, 1, 1, 12), { groupId: 199 });

  await takeScreenshot(t, scheduler.element, 'virtual-scrolling-many-cells-end.png');
}).before(async () => {
  const resourceCount = 200;

  const resources = Array.from({ length: resourceCount }, (_, i) => ({
    id: i,
    text: `Resource ${i}`,
  }));

  const appointmentDateInfo = Array.from({ length: 29 })
    .map((_, i) => ({
      startDate: new Date(2024, 1, i + 1, 12),
      endDate: new Date(2024, 1, i + 1, 20),
    }));

  const appointments = Array.from({ length: resourceCount })
    .map((_, resourceIndex) => appointmentDateInfo.map(({ startDate, endDate }) => ({
      text: `Appointment for Resource ${resourceIndex}`,
      startDate,
      endDate,
      groupId: resourceIndex,
    })))
    .flat();

  await createWidget(
    'dxScheduler',
    {
      height: 600,
      currentDate: new Date(2024, 1, 1),
      dataSource: appointments,
      views: [
        {
          type: 'month',
          groupOrientation: 'horizontal',
        },
      ],
      currentView: 'month',
      scrolling: {
        mode: 'virtual',
      },
      groups: ['groupId'],
      resources: [{
        fieldExpr: 'groupId',
        dataSource: resources,
        label: 'Group',
      }],
    },
  );
});
