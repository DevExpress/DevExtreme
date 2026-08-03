import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../helpers/themeUtils';
import { scrollToDate } from '../../helpers/utils';
import {
  hierarchicalAppointments,
  hierarchicalRooms,
} from './hierarchicalGrouping.data';

fixture.disablePageReloads`Scheduler: Hierarchical grouping layout`
  .page(url(__dirname, '../../../container.html'));

const createScheduler = async (
  view: string,
  groupOrientation: string,
  rtlEnabled = false,
): Promise<void> => {
  await createWidget('dxScheduler', {
    dataSource: hierarchicalAppointments,
    currentDate: new Date(2021, 3, 26),
    startDayHour: 9,
    endDayHour: 18,
    height: 780,
    crossScrollingEnabled: true,
    rtlEnabled,
    groups: ['roomId'],
    resources: [{
      fieldExpr: 'roomId',
      parentIdExpr: 'parentId',
      dataSource: hierarchicalRooms,
      label: 'Room',
      allowMultiple: true,
    }],
    resourceCellTemplate(itemData, _index, element) {
      const { text, color, isLeaf } = itemData;

      $(element).append(
        $('<div>')
          .css({ padding: '2px 6px', textAlign: 'left', borderLeft: `4px solid ${color ?? 'transparent'}` })
          .append($('<div>').css({ fontWeight: isLeaf ? 400 : 700 }).text(text)),
      );
    },
    views: [{
      type: view,
      name: view,
      groupOrientation,
    }],
    currentView: view,
  });
};

const shouldScrollToMiddleGroup = (view: string, groupOrientation: string): boolean => (
  groupOrientation === 'horizontal' && view.startsWith('timeline')
);

const runScreenshotTest = (
  view: string,
  groupOrientation: string,
  rtlEnabled = false,
): void => {
  test(`Hierarchical grouping layout test (view='${view}', groupOrientation=${groupOrientation}${rtlEnabled ? ', rtl=true' : ''})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    if (shouldScrollToMiddleGroup(view, groupOrientation)) {
      await scrollToDate(new Date(2021, 3, 26, 12), { roomId: 201 });
      await t.wait(50);
    }

    await testScreenshot(
      t,
      takeScreenshot,
      `hierarchical-grouping(view=${view}-orientation=${groupOrientation}${rtlEnabled ? '-rtl' : ''}).png`,
    );

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createScheduler(view, groupOrientation, rtlEnabled));
};

// visual: generic.light
// visual: fluent.blue.light
// visual: material.blue.light
['vertical', 'horizontal'].forEach((groupOrientation) => {
  ['day', 'week', 'workWeek', 'month'].forEach((view) => {
    runScreenshotTest(view, groupOrientation);
  });
});

// visual: generic.light
// visual: fluent.blue.light
// visual: material.blue.light
['vertical', 'horizontal'].forEach((groupOrientation) => {
  ['timelineDay', 'timelineWeek', 'timelineMonth']
    .filter((view) => groupOrientation !== 'horizontal' || view === 'timelineDay')
    .forEach((view) => {
      runScreenshotTest(view, groupOrientation);
    });
});

// visual: generic.light
// visual: fluent.blue.light
// visual: material.blue.light
runScreenshotTest('agenda', 'vertical');

// visual: generic.light
// visual: fluent.blue.light
// visual: material.blue.light
runScreenshotTest('day', 'horizontal', true);
runScreenshotTest('day', 'vertical', true);
runScreenshotTest('timelineWeek', 'vertical', true);
