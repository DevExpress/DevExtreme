import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';

fixture.disablePageReloads`Scheduler: Current Time Indication`
  .page(url(__dirname, '../../../container.html'));

const views = ['day', 'week'];

const createScheduler = async (
  additionalProps: Record<string, unknown> = {},
): Promise<void> => {
  await createWidget('dxScheduler', {
    dataSource: [],
    currentDate: new Date(2021, 7, 1),
    height: 400,
    width: 700,
    startDayHour: 5,
    indicatorTime: new Date(2021, 7, 1, 6),
    currentView: 'day',
    views,
    groups: ['groupId'],
    resources: [{
      fieldExpr: 'groupId',
      label: 'group',
      dataSource: [
        { text: 'Group 1', id: 1 },
        { text: 'Group 2', id: 2 },
        { text: 'Group 3', id: 3 },
        { text: 'Group 4', id: 4 },
        { text: 'Group 5', id: 5 },
        { text: 'Group 6', id: 6 },
      ],
    }],
    ...additionalProps,
  });
};

test('Current time indicator should be placed correctly when there are many groups and orientation is horizontal', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // eslint-disable-next-line no-restricted-syntax
  for (const view of views) {
    await scheduler.option('currentView', view);

    await t.expect(
      await takeScreenshot(`current-time-indicator-in-${view}-with-many-groups.png`, scheduler.workSpace),
    ).ok();
  }

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createScheduler();
});
