import type { Orientation, ViewType } from 'devextreme/ui/scheduler';
import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { generateOptionMatrix } from '../../../../helpers/generateOptionMatrix';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

const buildScreenshotName = (
  viewType: ViewType,
  orientation: Orientation,
  step: string,
): string => `virtual-scrolling-many-cells-${viewType}-${orientation}-${step}.png`;

const testCases = generateOptionMatrix<{ viewType: ViewType; groupOrientation: Orientation }>({
  viewType: ['month', 'week', 'workWeek'],
  groupOrientation: ['horizontal', 'vertical'],
});

testCases.forEach(({ viewType, groupOrientation }) => {
  const resourceCount = 400;

  test(`it should correctly render virtual table if a lot of resources are presented for ${viewType} view and ${groupOrientation} orientation (T1205597, T1137490)`, async ({ page }) => {
    const resources = Array.from({ length: resourceCount }, (_, i) => ({
      id: i,
      text: `Resource ${i}`,
    }));

    const appointmentDateInfo = Array.from({ length: 29 })
      .map((_, i) => ({
        startDate: new Date(2024, 1, i + 1, 1),
        endDate: new Date(2024, 1, i + 1, 4),
      }));

    const appointments = Array.from({ length: resourceCount })
      .map((_, resourceIndex) => appointmentDateInfo.map(({ startDate, endDate }) => ({
        text: `Appointment for Resource ${resourceIndex}`,
        startDate,
        endDate,
        groupId: resourceIndex,
      })))
      .flat();

    await createWidget(page, 'dxScheduler', {
      height: 600,
      currentDate: new Date(2024, 1, 1),
      dataSource: appointments,
      views: [{
        type: viewType,
        groupOrientation,
      }],
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
    });

    const scheduler = new Scheduler(page, '#container');

    await testScreenshot(
      page,
      buildScreenshotName(viewType, groupOrientation, 'start'),
      { element: scheduler.element },
    );

    await scheduler.scrollTo(new Date(2024, 1, 1, 1), { groupId: resourceCount / 2 });

    await testScreenshot(
      page,
      buildScreenshotName(viewType, groupOrientation, 'middle'),
      { element: scheduler.element },
    );

    await scheduler.scrollTo(new Date(2024, 1, 1, 1), { groupId: resourceCount - 1 });

    await testScreenshot(
      page,
      buildScreenshotName(viewType, groupOrientation, 'end'),
      { element: scheduler.element },
    );
  });
});
