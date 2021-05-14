import { createScreenshotsComparer } from '../../../helpers/screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import {
  resources,
  views,
  scrollTo,
  horizontalViews,
  setZoomLevel,
  scrollConfig,
} from './utils';

fixture`Scheduler: Virtual Scrolling with Zooming`
  .page(url(__dirname, '../../container.html'));

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
  }, true);
};

test('Virtual scrolling layout in scheduler views when horizontal grouping is enabled and zooming is used', async (t) => {
  const scheduler = new Scheduler('#container');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // TODO: views[0] is day view and we have a bug in its CSS
  // It is not advisable to create screenshots for incorrect layout
  for (let i = 1; i < views.length; i += 1) {
    const view = views[i];

    await scheduler.option('currentView', view.type);

    await t.expect(
      await takeScreenshot(`virtual-scrolling-${view.type}-before-scroll-horizontal-grouping-scaling.png`),
    ).ok();

    await scrollTo(scrollConfig[i].firstDate, { resourceId: 7 });

    await t.expect(
      await takeScreenshot(`virtual-scrolling-${view.type}-after-scroll-horizontal-grouping-scaling.png`),
    ).ok();
  }

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await setZoomLevel(125);
  await createScheduler({
    views: horizontalViews,
    groups: ['resourceId'],
  });
}).after(async () => {
  await setZoomLevel(0);
});
