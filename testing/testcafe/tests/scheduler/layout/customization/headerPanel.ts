import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';

fixture`Scheduler: Layout Customization: Header Panel`
  .page(url(__dirname, './headerPanelCustomizationContainer.html'));

const createScheduler = async (
  additionalProps: Record<string, unknown>,
): Promise<void> => {
  await createWidget('dxScheduler', {
    currentDate: new Date(2021, 4, 11),
    height: 500,
    width: 700,
    startDayHour: 9,
    showAllDayPanel: false,
    dataSource: [],
    groups: ['priorityId'],
    resources: [{
      fieldExpr: 'priorityId',
      dataSource: [
        {
          text: 'Low Priority',
          id: 0,
          color: '#24ff50',
        }, {
          text: 'High Priority',
          id: 1,
          color: '#ff9747',
        },
      ],
      label: 'Priority',
    }],
    ...additionalProps,
  }, true);
};

const views = [{
  type: 'week',
  groupOrientation: 'horizontal',
}, {
  type: 'month',
  groupOrientation: 'horizontal',
}, {
  type: 'timelineWeek',
  groupOrientation: 'horizontal',
}, {
  type: 'timelineMonth',
  groupOrientation: 'horizontal',
}];

[false, true].forEach((crossScrollingEnabled) => {
  test('Header panel customization should work', async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await scheduler.option('currentView', view.type);

      await t.expect(
        await takeScreenshot(`custom-header-panel-in-${view.type}-cross-scrolling=${crossScrollingEnabled}.png`, scheduler.element),
      ).ok();
    }

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createScheduler({
      views,
      crossScrollingEnabled,
    });
  });
});
