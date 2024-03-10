import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';

import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import { generateOptionMatrix } from '../../../helpers/generateOptionMatrix';
import type { ViewType, Orientation } from '../../../../../js/ui/scheduler';

fixture.disablePageReloads`Scheduler: Virtual scrolling (many cells)`
  .page(url(__dirname, '../../container.html'));

interface View {
  type: ViewType;
  groupOrientation: Orientation;
}

const buildScreenshotName = (viewType: ViewType, orientation: Orientation, step: string) => `virtual-scrolling-many-cells-${viewType}-${orientation}-${step}.png`;

const testCases = generateOptionMatrix<{ views: View[] }>({
  views: [
    [
      {
        type: 'month',
        groupOrientation: 'vertical',
      },
    ],
    [
      {
        type: 'week',
        groupOrientation: 'vertical',
      },
    ],
    [
      {
        type: 'workWeek',
        groupOrientation: 'vertical',
      },
    ],
  ],
});

testCases.forEach(({ views }) => {
  const { type: viewType, groupOrientation: orientation } = views[0];
  const resourceCount = 400;

  test(`it should correctly render virtual table if more than 1000 cells are virtualized for ${viewType} view and ${orientation} orientation`, async (t) => {
    const scheduler = new Scheduler('#container');

    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(buildScreenshotName(viewType, orientation, 'start'), scheduler.element))
      .ok();

    await scheduler.scrollTo(new Date(2024, 1, 1, 1), { groupId: resourceCount / 2 });

    await t
      .expect(await takeScreenshot(buildScreenshotName(viewType, orientation, 'middle'), scheduler.element))
      .ok();

    await scheduler.scrollTo(new Date(2024, 1, 1, 1), { groupId: resourceCount - 1 });

    await t
      .expect(await takeScreenshot(buildScreenshotName(viewType, orientation, 'end'), scheduler.element))
      .ok();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
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
