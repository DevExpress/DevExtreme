import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { scrollToDate } from '../../helpers/utils';
import { testScreenshot } from '../../../../helpers/themeUtils';
import {
  resources,
  views,
  horizontalViews,
  setZoomLevel,
  scrollConfig,
} from './utils';

// We don't support zooming (known limitation)
fixture.disablePageReloads`Scheduler: Virtual Scrolling with Zooming`
  .page(url(__dirname, '../../../container.html'));

const createScheduler = async (
  additionalProps: Record<string, unknown>,
): Promise<void> => {
  await createWidget('dxScheduler', {
    currentDate: new Date(2021, 0, 1),
    height: 600,
    resources,
    views,
    currentView: 'day',
    scrolling: { mode: 'virtual' },
    startDayHour: 0,
    endDayHour: 3,
    ...additionalProps,
  });
};

test('Virtual scrolling layout in scheduler views when horizontal grouping is enabled and zooming is used', async (t) => {
  const scheduler = new Scheduler('#container');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // TODO: views[0] is day view and we have a bug in its CSS
  // It is not advisable to create screenshots for incorrect layout
  for (let i = 1; i < views.length; i += 1) {
    const view = views[i];

    await scheduler.option('currentView', view.type);

    await testScreenshot(
      t,
      takeScreenshot,
      `virtual-scrolling-${view.type}-before-scroll-horizontal-grouping-scaling.png`,
    );

    await scrollToDate(scrollConfig[i].firstDate, { resourceId: 7 });

    await testScreenshot(
      t,
      takeScreenshot,
      `virtual-scrolling-${view.type}-after-scroll-horizontal-grouping-scaling.png`,
    );
  }

  await setZoomLevel(0);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await setZoomLevel(125);
  await createScheduler({
    views: horizontalViews,
    groups: ['resourceId'],
  });
});
