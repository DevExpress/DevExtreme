import type { Page } from '@playwright/test';
import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';
import {
  hierarchicalAppointments,
  hierarchicalRooms,
} from './hierarchicalGrouping.data';

const createScheduler = async (
  page: Page,
  view: string,
  groupOrientation: string,
  rtlEnabled = false,
): Promise<void> => {
  await createWidget(page, 'dxScheduler', {
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
    resourceCellTemplate(itemData: any, _index: number, element: any) {
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
  test(`Hierarchical grouping layout test (view='${view}', groupOrientation=${groupOrientation}${rtlEnabled ? ', rtl=true' : ''})`, async ({ page }) => {
    await createScheduler(page, view, groupOrientation, rtlEnabled);

    if (shouldScrollToMiddleGroup(view, groupOrientation)) {
      const scheduler = new Scheduler(page, '#container');

      await scheduler.scrollTo(new Date(2021, 3, 26, 12), { roomId: 201 });
    }

    await testScreenshot(
      page,
      `hierarchical-grouping(view=${view}-orientation=${groupOrientation}${rtlEnabled ? '-rtl' : ''}).png`,
    );
  });
};

['vertical', 'horizontal'].forEach((groupOrientation) => {
  ['day', 'week', 'workWeek', 'month'].forEach((view) => {
    runScreenshotTest(view, groupOrientation);
  });
});

['vertical', 'horizontal'].forEach((groupOrientation) => {
  ['timelineDay', 'timelineWeek', 'timelineMonth']
    .filter((view) => groupOrientation !== 'horizontal' || view === 'timelineDay')
    .forEach((view) => {
      runScreenshotTest(view, groupOrientation);
    });
});

runScreenshotTest('agenda', 'vertical');

runScreenshotTest('day', 'horizontal', true);
runScreenshotTest('day', 'vertical', true);
runScreenshotTest('timelineWeek', 'vertical', true);
