import { test, expect } from '@playwright/test';
import { createWidget, setupTestPage, getContainerUrl } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

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

test.describe.skip('Appointment resources', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

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

    const appointment1 = page.locator('.dx-scheduler-appointment').filter({ hasText: 'test-appt-1' });
    const appointment2 = page.locator('.dx-scheduler-appointment').filter({ hasText: 'test-appt-2' });

    const color1 = await appointment1.evaluate((el) => getComputedStyle(el).backgroundColor);
    const color2 = await appointment2.evaluate((el) => getComputedStyle(el).backgroundColor);

    expect(color1).toBe(priorityData[0].color);
    expect(color2).toBe(priorityData[1].color);
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

    await expect(page.locator('.dx-scheduler-appointment').filter({ hasText: 'Appt-1' })).toBeVisible();
    await expect(page.locator('.dx-scheduler-appointment').filter({ hasText: 'Appt-2' })).toBeVisible();
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

    const cell = page.locator('.dx-scheduler-date-table-row').nth(2).locator('.dx-scheduler-date-table-cell').nth(0);
    await cell.dblclick();

    await expect(page.locator('.dx-scheduler-appointment-popup')).toBeVisible();

    const resourceTagBox = page.locator('.dx-tagbox');
    await expect(resourceTagBox).toBeVisible();
    await resourceTagBox.click();

    const tagBoxPopup = page.locator('.dx-tagbox-popup-wrapper');
    await expect(tagBoxPopup).toBeVisible();

    await tagBoxPopup.locator('.dx-list-item').first().click();

    const tags = page.locator('.dx-tagbox .dx-tag');
    await expect(tags).toHaveCount(1);
  });

  test('Resource color should be correct for the complex resource id without grouping', async ({ page }) => {
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

    const appointmentA = page.locator('.dx-scheduler-appointment').filter({ hasText: 'a' });
    const appointmentB = page.locator('.dx-scheduler-appointment').filter({ hasText: 'b' });
    const appointmentC = page.locator('.dx-scheduler-appointment').filter({ hasText: 'c' });

    const colorA = await appointmentA.evaluate((el) => getComputedStyle(el).backgroundColor);
    const colorB = await appointmentB.evaluate((el) => getComputedStyle(el).backgroundColor);
    const colorC = await appointmentC.evaluate((el) => getComputedStyle(el).backgroundColor);

    expect(colorA).toBe('rgb(255, 0, 0)');
    expect(colorB).toBe('rgb(0, 128, 0)');
    expect(colorC).toBe('rgb(255, 255, 0)');
  });
});
