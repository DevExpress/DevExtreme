import { takeScreenshot } from 'devextreme-screenshot-comparer/build/src/take-screenshot';

import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import { generateOptionMatrix } from '../../../helpers/generateOptionMatrix';
import type { ViewType } from '../../../../../js/ui/scheduler';

fixture.disablePageReloads`Scheduler: Virtual scrolling (many cells)`
  .page(url(__dirname, '../../container.html'));

const buildScreenshotName = (viewType: ViewType, step: string) => `virtual-scrolling-many-cells-${viewType}-horizontal-${step}.png`;

const testCases = generateOptionMatrix({
  views: [
    [
      {
        type: 'month' as ViewType,
        groupOrientation: 'horizontal',
      },
    ],
    [
      {
        type: 'week' as ViewType,
        groupOrientation: 'horizontal',
      },
    ],
    [
      {
        type: 'workWeek' as ViewType,
        groupOrientation: 'horizontal',
      },
    ],
  ],
});

testCases.forEach(({ views }) => {
  const viewType = views[0].type;
  const resourceCount = 400;

  test(`it should correctly render virtual table if more than 1000 cells are virtualized for ${viewType} view (T1205597)`, async (t) => {
    const scheduler = new Scheduler('#container');

    await takeScreenshot(t, scheduler.element, buildScreenshotName(viewType, 'start'));

    await scheduler.scrollTo(new Date(2024, 1, 1, 12), { groupId: resourceCount / 2 });

    await takeScreenshot(t, scheduler.element, buildScreenshotName(viewType, 'middle'));

    await scheduler.scrollTo(new Date(2024, 1, 1, 12), { groupId: resourceCount - 1 });

    await takeScreenshot(t, scheduler.element, buildScreenshotName(viewType, 'end'));
  }).before(async () => {
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
        views,
        currentView: viewType,
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
});
