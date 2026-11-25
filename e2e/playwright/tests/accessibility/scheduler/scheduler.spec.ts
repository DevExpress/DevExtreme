import { expect, test } from '../../../helpers/accessibility/test';
import Scheduler from '../../../models/scheduler';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { createWidget } from '../../../helpers/createWidget';
import { a11yCheckConfig } from './axe_options';

test('Scheduler should have right aria attributes after view changed', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [],
    currentView: 'month',
  });

  const scheduler = new Scheduler(page, '#container');

  await expect(scheduler.element).toHaveAttribute('aria-label', /Scheduler\. Month view/);
  await expect(scheduler.getGeneralStatusContainer().first()).toContainText('Scheduler. Month view');

  await expect(scheduler.element).toHaveAttribute('role', 'application');

  await scheduler.option('currentView', 'week');

  await expect(scheduler.element).toHaveAttribute('aria-label', /Scheduler\. Week view/);
  await expect(scheduler.getGeneralStatusContainer().first()).toContainText('Scheduler. Week view');

  await a11yCheck(page, a11yCheckConfig, '#container');
});

test('Scheduler table elements have right aria attributes', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [],
    currentView: 'month',
    currentDate: new Date(2021, 3, 29),
  });

  const scheduler = new Scheduler(page, '#container');

  const tables = scheduler.element.locator('table');
  await expect(tables).toHaveCount(4);

  for (let i = 0; i < await tables.count(); i += 1) {
    await expect(tables.nth(i)).toHaveAttribute('aria-hidden', 'true');
  }

  await a11yCheck(page, a11yCheckConfig, '#container');
});

[
  'agenda', 'day', 'month', 'timelineDay', 'timelineMonth', 'timelineWeek', 'timelineWorkWeek', 'week', 'workWeek',
].forEach((currentView) => {
  test(`Scheduler has no axe errors on view ${currentView}`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'America/Los_Angeles',
      dataSource: [
        {
          text: 'Website Re-Design Plan',
          startDate: new Date('2021-04-29T16:30:00.000Z'),
          endDate: new Date('2021-04-29T18:30:00.000Z'),
        },
      ],
      currentView,
      currentDate: new Date(2021, 3, 29),
      startDayHour: 9,
    });

    await a11yCheck(page, a11yCheckConfig, '#container');
  });
});

const groupedRooms = [
  { id: 'building-a', text: 'Building A', parentId: null },
  { id: 'floor-a1', text: 'Floor 1', parentId: 'building-a' },
  { id: 101, text: 'Room 101', parentId: 'floor-a1' },
  { id: 102, text: 'Room 102', parentId: 'floor-a1' },
  { id: 'building-b', text: 'Building B', parentId: null },
  { id: 201, text: 'Room 201', parentId: 'building-b' },
];

const flatRooms = groupedRooms.filter(
  (room) => !groupedRooms.some((item) => item.parentId === room.id),
);

const groupedAppointments = [
  {
    text: 'Standup',
    roomId: 101,
    startDate: new Date('2021-04-29T16:30:00.000Z'),
    endDate: new Date('2021-04-29T18:30:00.000Z'),
  },
];

const groupingCases = [
  { view: 'day', orientation: 'vertical' },
  { view: 'day', orientation: 'horizontal' },
  { view: 'workWeek', orientation: 'vertical' },
  { view: 'workWeek', orientation: 'horizontal' },
  { view: 'timelineDay', orientation: 'vertical' },
  { view: 'timelineDay', orientation: 'horizontal' },
  { view: 'agenda', orientation: 'vertical' },
];

([
  { name: 'flat', dataSource: flatRooms, parentIdExpr: undefined },
  { name: 'hierarchical', dataSource: groupedRooms, parentIdExpr: 'parentId' },
] as const).forEach(({ name, dataSource, parentIdExpr }) => {
  groupingCases.forEach(({ view, orientation }) => {
    test(`Scheduler should pass accessibility checks with ${name} grouping on view ${view} (${orientation})`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        dataSource: groupedAppointments,
        views: [{ type: view, groupOrientation: orientation }],
        currentView: view,
        currentDate: new Date(2021, 3, 29),
        startDayHour: 9,
        endDayHour: 12,
        groups: ['roomId'],
        resources: [{ fieldExpr: 'roomId', dataSource, parentIdExpr }],
        height: 800,
      });

      await a11yCheck(page, a11yCheckConfig, '#container');
    });
  });
});
