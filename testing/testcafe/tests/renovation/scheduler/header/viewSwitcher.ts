import Scheduler from '../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../helpers/multi-platform-test';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

fixture('Scheduler header - View switcher');

test('it should correctly switch a differently typed views (T1080992)', async (t) => {
  const scheduler = new Scheduler('#container');
  const {
    toolbar: {
      viewSwitcher,
    },
  } = scheduler;

  await t
    .click(viewSwitcher.getButton('Some week').element)
    .expect(scheduler.checkViewType('week'))
    .ok()
    .click(viewSwitcher.getButton('Day').element)
    .expect(scheduler.checkViewType('day'))
    .ok();
}).before(async (_, { platform }) => createWidget(platform, 'dxScheduler', {
  width: 800,
  height: 600,
  views: [
    'day',
    {
      type: 'week',
      name: 'Some week',
    },
  ],
}));
