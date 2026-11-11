import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';
import { scrollToDate } from '../../helpers/utils';
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
  await createWidget(page, 'dxScheduler', (arg) => ({
    dataSource: arg.appointments,
    currentDate: arg.currentDate,
    startDayHour: 9,
    endDayHour: 18,
    height: 780,
    crossScrollingEnabled: true,
    rtlEnabled: arg.rtlEnabled,
    groups: ['roomId'],
    resources: [{
      fieldExpr: 'roomId',
      parentIdExpr: 'parentId',
      dataSource: arg.rooms,
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
      type: arg.view,
      name: arg.view,
      groupOrientation: arg.groupOrientation,
    }],
    currentView: arg.view,
  }), '#container', {
    arg: {
      appointments: hierarchicalAppointments,
      rooms: hierarchicalRooms,
      currentDate: new Date(2021, 3, 26),
      view,
      groupOrientation,
      rtlEnabled,
    },
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

      await scrollToDate(page, new Date(2021, 3, 26, 12), { roomId: 201 });
      await expect.poll(async () => (await scheduler.getHeaderScroll()).left)
        .toBe((await scheduler.getWorkSpaceScroll()).left);
    }

    await testScreenshot(
      page,
      `hierarchical-grouping(view=${view}-orientation=${groupOrientation}${rtlEnabled ? '-rtl' : ''}).png`,
    );
  });
};

test.describe('Scheduler: Hierarchical grouping layout', () => {
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
});
