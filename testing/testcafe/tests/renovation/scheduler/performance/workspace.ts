import { multiPlatformTest, createWidget } from '../../../../helpers/multi-platform-test';
import { getRenderCount } from '../../../../helpers/diagnostic';
import { restoreBrowserSize } from '../../../../helpers/restoreBrowserSize';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

fixture.disablePageReloads.skip('Scheduler: Workspace');

const renderCounts = {
  jquery: 4,
  react: 6,
};

test('Default render', async (t, { platform }) => {
  await t
    .expect(getRenderCount('scheduler_workspace'))
    .eql(renderCounts[platform]);
}).before(async (_, { platform }) => {
  await createWidget(platform, 'dxScheduler', {
    height: 600,
    width: 800,
  });
}).after(async (t) => restoreBrowserSize(t));
