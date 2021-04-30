import { createScreenshotsComparer } from '../../../helpers/screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import {
  resources,
  createDataSetForScreenShotTests,
  views,
  scrollTo,
} from './utils';

fixture`Scheduler: Adaptive Generic theme layout`
  .page(url(__dirname, '../../container.html'));

const createScheduler = async (
  additionalProps: Record<string, unknown>,
): Promise<void> => {
  await createWidget('dxScheduler', {
    dataSource: createDataSetForScreenShotTests(),
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

test('Virtual scrolling layout in scheduler views', async (t) => {
  const scheduler = new Scheduler('#container');

  const scrollConfig = [{
    firstDate: new Date(2021, 0, 7),
    lastDate: new Date(2021, 0, 1),
  }, {
    firstDate: new Date(2021, 0, 15),
    lastDate: new Date(2020, 11, 27),
  }, {
    firstDate: new Date(2021, 0, 1),
    lastDate: new Date(2020, 11, 27),
  }, {
    firstDate: new Date(2021, 0, 7),
    lastDate: new Date(2021, 0, 1),
  }, {
    firstDate: new Date(2021, 0, 15),
    lastDate: new Date(2020, 11, 27),
  }, {
    firstDate: new Date(2021, 0, 30),
    lastDate: new Date(2021, 0, 1),
  }];

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // TODO: views[0] is day view and we have a bug in its CSS
  // It is not advisable to create screenshots for incorrect layout
  for (let i = 1; i < views.length; i += 1) {
    const view = views[i];

    await scheduler.option('currentView', view.type);

    await t.expect(
      await takeScreenshot(`virtual-scrolling-${view.type}-before-scroll.png`),
    ).ok();

    await scrollTo(scrollConfig[i].firstDate);

    await t.expect(
      await takeScreenshot(`virtual-scrolling-${view.type}-after-scroll.png`),
    ).ok();

    await scrollTo(scrollConfig[i].lastDate);

    await t.expect(
      await takeScreenshot(`virtual-scrolling-${view.type}-before-scroll.png`),
    ).ok();
  }

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createScheduler({});
});
