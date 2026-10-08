import Scheduler from 'devextreme-testcafe-models/scheduler';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { a11yCheckConfig, a11yContext } from './axe_options';

fixture.disablePageReloads`Scheduler - a11y`
  .page(url(__dirname, '../../container.html'));

test('Scheduler should have right aria attributes after view changed', async (t) => {
  const scheduler = new Scheduler('#container');

  await t.expect(scheduler.element.getAttribute('aria-label')).contains('Scheduler. Month view');
  await t.expect(scheduler.getGeneralStatusContainer().textContent).contains('Scheduler. Month view');

  await t.expect(scheduler.element.getAttribute('role')).eql('application');

  await scheduler.option('currentView', 'week');

  await t.expect(scheduler.element.getAttribute('aria-label')).contains('Scheduler. Week view');
  await t.expect(scheduler.getGeneralStatusContainer().textContent).contains('Scheduler. Week view');

  await a11yCheck(t, a11yCheckConfig, a11yContext);
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    currentView: 'month',
  });
});

test('Scheduler table elements have right aria attributes', async (t) => {
  const scheduler = new Scheduler('#container');

  const tables = scheduler.element.find('table');
  await t.expect(tables.count).eql(4);

  for (let i = 0; i < await tables.count; i += 1) {
    await t.expect(
      tables.nth(i).getAttribute('aria-hidden'),
    ).eql('true');
  }

  await a11yCheck(t, a11yCheckConfig, a11yContext);
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    currentView: 'month',
  });
});

[
  'agenda', 'day', 'month', 'timelineDay', 'timelineMonth', 'timelineWeek', 'timelineWorkWeek', 'week', 'workWeek',
].forEach((currentView) => {
  test(`Scheduler has no axe errors on view ${currentView}`, async (t) => {
    await a11yCheck(t, a11yCheckConfig, a11yContext);
  }).before(async () => {
    await createWidget('dxScheduler', {
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
    test(`Scheduler should pass accessibility checks with ${name} grouping on view ${view} (${orientation})`, async (t) => {
      await a11yCheck(t, a11yCheckConfig, a11yContext);
    }).before(async () => {
      await createWidget('dxScheduler', {
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
    });
  });
});
