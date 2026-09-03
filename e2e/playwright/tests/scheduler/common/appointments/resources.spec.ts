import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { getThemeName } from '../../../../helpers/themeUtils';
import Scheduler from '../../../../models/scheduler';
import TagBox from '../../../../models/tagBox';

const dataSource = [{
  text: 'test-appt-1',
  priorityId: 1,
  typeId: 2,
  startDate: new Date('2021-05-26T06:45:00.000Z'),
  endDate: new Date('2021-05-26T09:15:00.000Z'),
}, {
  text: 'test-appt-2',
  priorityId: 2,
  typeId: 1,
  startDate: new Date('2021-05-26T06:45:00.000Z'),
  endDate: new Date('2021-05-26T09:15:00.000Z'),
}];

const priorityData = [{
  text: 'Low Priority',
  id: 1,
  color: 'rgb(252, 182, 94)',
}, {
  text: 'High Priority',
  id: 2,
  color: 'rgb(225, 142, 146)',
}];

test('Resource color should be correct if group is set in "views"', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    height: 600,
    dataSource,
    views: [{
      type: 'workWeek',
      startDayHour: 9,
      endDayHour: 18,
      groups: ['priorityId'],
    }],
    currentView: 'workWeek',
    currentDate: new Date(2021, 4, 25),
    resources: [{
      fieldExpr: 'priorityId',
      allowMultiple: false,
      dataSource: priorityData,
      label: 'Priority',
    }, {
      fieldExpr: 'typeId',
      allowMultiple: false,
      dataSource: [{
        id: 1,
        color: '#b6d623',
      }, {
        id: 2,
        color: '#679ec5',
      }],
    }],
  });

  const scheduler = new Scheduler(page, '#container');
  const appointment1 = scheduler.getAppointment('test-appt-1');
  const appointment2 = scheduler.getAppointment('test-appt-2');

  await expect.poll(async () => appointment1.getColor()).toBe(priorityData[0].color);
  await expect.poll(async () => appointment2.getColor()).toBe(priorityData[1].color);
});

test('Scheduler should renders correctly if resource dataSource is not set', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    height: 600,
    width: 800,
    dataSource: [{
      text: 'Appt-1',
      startDate: new Date(2021, 3, 27, 10),
      endDate: new Date(2021, 3, 27, 12),
    }, {
      text: 'Appt-2',
      startDate: new Date(2021, 3, 29, 11),
      endDate: new Date(2021, 3, 29, 13),
    }],
    views: ['workWeek'],
    currentView: 'workWeek',
    currentDate: new Date(2021, 3, 26),
    startDayHour: 9,
    endDayHour: 14,
    resources: [{
      fieldExpr: 'roomId',
      label: 'Room',
    }],
  });

  const scheduler = new Scheduler(page, '#container');

  await expect(scheduler.getAppointment('Appt-1').element).toBeAttached();
  await expect(scheduler.getAppointment('Appt-2').element).toBeAttached();
});

test('Resource with allowMultiple should be set correctly for new the appointment (T1075028)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    views: ['day'],
    currentView: 'day',
    currentDate: new Date(2021, 3, 27),
    startDayHour: 9,
    endDayHour: 14,
    resources: [{
      fieldExpr: 'test_Id',
      allowMultiple: true,
      dataSource: [{
        text: 'Test-0',
        id: 1,
      }, {
        text: 'Test-1',
        id: 2,
      }],
      label: 'MultipleResource',
    }],
  });

  const scheduler = new Scheduler(page, '#container');

  await scheduler.getDateTableCell(2, 0).dblclick();

  await expect(scheduler.appointmentPopup.contentElement).toBeVisible();

  const resourceTagBox = new TagBox(page, page.locator('.dx-tagbox').first());

  await expect(resourceTagBox.element).toBeAttached();

  await resourceTagBox.element.click();

  await expect.poll(async () => resourceTagBox.isOpened()).toBe(true);

  await (await resourceTagBox.getList()).getItem(0).element.click();

  await expect(resourceTagBox.tags).toHaveCount(1);
});

test('Resource color should be correct for the complex resource id without grouping', {
  tag: ['@generic.light'],
}, async ({ page }) => {
  // The TestCafe test named a theme to run in, and the runner dropped it everywhere else.
  test.skip(getThemeName() !== 'generic', 'the TestCafe test ran in the generic theme only');

  await createWidget(page, 'dxScheduler', {
    currentDate: new Date(2015, 6, 10),
    views: ['week'],
    currentView: 'week',
    editing: true,
    dataSource: [{
      text: 'a',
      allDay: true,
      startDate: new Date(2015, 6, 10, 0),
      endDate: new Date(2015, 6, 10, 0, 30),
      ownerId: { _value: 'guid-1' },
    }, {
      text: 'b',
      allDay: true,
      startDate: new Date(2015, 6, 10, 0),
      endDate: new Date(2015, 6, 10, 0, 30),
      ownerId: { _value: 'guid-2' },
    }, {
      text: 'c',
      startDate: new Date(2015, 6, 10, 2),
      endDate: new Date(2015, 6, 10, 2, 30),
      ownerId: { _value: 'guid-3' },
    }],
    resources: [
      {
        field: 'ownerId',
        dataSource: [
          {
            id: { _value: 'guid-1' },
            text: 'one',
            color: 'rgb(255, 0, 0)',
          },
          {
            id: { _value: 'guid-2' },
            text: 'two',
            color: 'rgb(0, 128, 0)',
          },
          {
            id: { _value: 'guid-3' },
            text: 'three',
            color: 'rgb(255, 255, 0)',
          },
        ],
      },
    ],
    scrolling: {
      orientation: 'vertical',
    },
    height: 600,
  });

  const scheduler = new Scheduler(page, '#container');

  await expect.poll(async () => scheduler.getAppointment('a').getColor()).toBe('rgb(255, 0, 0)');
  await expect.poll(async () => scheduler.getAppointment('b').getColor()).toBe('rgb(0, 128, 0)');
  await expect.poll(async () => scheduler.getAppointment('c').getColor()).toBe('rgb(255, 255, 0)');
});
