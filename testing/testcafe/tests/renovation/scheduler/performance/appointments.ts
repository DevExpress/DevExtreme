import { ClientFunction } from 'testcafe';
import { restoreBrowserSize } from '../../../../helpers/restoreBrowserSize';
import Scheduler from '../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../helpers/multi-platform-test';
import { getRenderCount } from '../../../../helpers/diagnostic';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

fixture('Scheduler: Appointments performance');

test('Default', async (t, { platform }) => {
  const renderCounts = {
    jquery: 4,
    react: 7,
  };

  await t
    .expect(getRenderCount('scheduler_workspace'))
    .eql(renderCounts[platform]);
}).before(async (_, { platform }) => {
  await createWidget(platform, 'dxScheduler', {
    height: 600,
    width: 800,
    currentDate: new Date(2020, 8, 7),
    dataSource: [{
      startDate: new Date(2020, 8, 13, 2),
      endDate: new Date(2020, 8, 13, 3),
      text: 'test',
    }],
  });
}).after(async (t) => restoreBrowserSize(t));

test('Virtual scrolling', async (t, { platform }) => {
  const scheduler = new Scheduler('#container');
  const scrollableContent = scheduler.dateTableScrollable.find('.dx-scrollable-container');

  const renderCounts = {
    jquery: 6,
    react: 13,
  };

  await ClientFunction(() => {
    ((scrollableContent as any)() as HTMLElement).scrollTo({ left: 500 });
  }, {
    dependencies: { scrollableContent },
  })();

  await t
    .expect(getRenderCount('scheduler_workspace'))
    .eql(renderCounts[platform]);
}).before(async (_, { platform }) => {
  await createWidget(platform, 'dxScheduler', {
    height: 600,
    width: 800,
    currentDate: new Date(2020, 8, 7),
    scrolling: {
      mode: 'virtual',
    },
    currentView: 'week',
    views: [{
      type: 'week',
      intervalCount: 10,
    }],
    dataSource: [{
      startDate: new Date(2020, 8, 13, 2),
      endDate: new Date(2020, 8, 13, 3),
      text: 'test',
    }],
  });
}).after(async (t) => restoreBrowserSize(t));
