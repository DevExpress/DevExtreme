import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage, setStyleAttribute } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const SCHEDULER_SELECTOR = '#scheduler';

const markup = '<div style="display: flex;">' +
  '<div id="drag-container" style="background: red; width: 250px; height: 150px;">drag container</div>' +
  '<div id="space-right" style="background: yellow; width: 400px; height: 150px;">top right space</div>' +
  '</div>' +
  '<div style="display: flex;">' +
  '<div id="left-right" style="background: yellow; width: 250px; height: 550px;">left space</div>' +
  '<div id="scheduler"></div>' +
  '</div>';

test.describe.skip('T1118059', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('After drag to draggable component, should be called onAppointmentDeleting event only', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).eventName = '';
    });

    await setStyleAttribute(page, '#container', 'display: flex; flex-direction: column;');

    await page.evaluate((m) => {
      $('#container').append(m);
    }, markup);

    await createWidget(page, 'dxDraggable', {
      group: 'appointmentsGroup',
    }, '#drag-container');

    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'All day test app 1',
        startDate: new Date(2021, 3, 26),
        endDate: new Date(2021, 3, 26),
        allDay: true,
      }, {
        text: 'All day test app 2',
        startDate: new Date(2021, 3, 27),
        endDate: new Date(2021, 3, 27),
        allDay: true,
      }, {
        text: 'Regular test app',
        startDate: new Date(2021, 3, 27, 10, 30),
        endDate: new Date(2021, 3, 27, 11),
      }],
      views: [{
        type: 'day',
        intervalCount: 2,
      }],
      onAppointmentUpdated: new Function(`window.eventName = 'onAppointmentUpdated';`) as any,
      onAppointmentUpdating: new Function(`window.eventName = 'onAppointmentUpdating';`) as any,
      onAppointmentDeleting: new Function(`window.eventName = 'onAppointmentDeleting';`) as any,
      currentDate: new Date(2021, 3, 26),
      startDayHour: 9,
      height: 600,
      width: 500,
      appointmentDragging: {
        group: 'appointmentsGroup',
        onRemove: new Function('e', 'e.component.deleteAppointment(e.itemData);') as any,
      },
    }, SCHEDULER_SELECTOR);

    const regularApp = page.locator(`${SCHEDULER_SELECTOR} .dx-scheduler-appointment`).filter({ hasText: 'Regular test app' });
    const dragContainer = page.locator('#drag-container');

    await regularApp.dragTo(dragContainer);

    await page.waitForTimeout(500);

    const eventName = await page.evaluate(() => (window as any).eventName);
    expect(eventName).toBe('onAppointmentDeleting');
  });

  test('After drag over component area, shouldn\'t called onAppointment* data events and appointment shouldn\'t change position', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).eventName = '';
    });

    await setStyleAttribute(page, '#container', 'display: flex; flex-direction: column;');

    await page.evaluate((m) => {
      $('#container').append(m);
    }, markup);

    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'All day test app 1',
        startDate: new Date(2021, 3, 26),
        endDate: new Date(2021, 3, 26),
        allDay: true,
      }, {
        text: 'All day test app 2',
        startDate: new Date(2021, 3, 27),
        endDate: new Date(2021, 3, 27),
        allDay: true,
      }, {
        text: 'Regular test app',
        startDate: new Date(2021, 3, 27, 10, 30),
        endDate: new Date(2021, 3, 27, 11),
      }],
      views: [{
        type: 'day',
        intervalCount: 2,
      }],
      onAppointmentUpdated: new Function(`window.eventName = 'onAppointmentUpdated';`) as any,
      onAppointmentUpdating: new Function(`window.eventName = 'onAppointmentUpdating';`) as any,
      onAppointmentDeleting: new Function(`window.eventName = 'onAppointmentDeleting';`) as any,
      currentDate: new Date(2021, 3, 26),
      startDayHour: 9,
      height: 600,
      width: 500,
    }, SCHEDULER_SELECTOR);

    const allDayApp2 = page.locator(`${SCHEDULER_SELECTOR} .dx-scheduler-appointment`).filter({ hasText: 'All day test app 2' });
    const spaceRight = page.locator('#space-right');

    await allDayApp2.dragTo(spaceRight);

    let eventName = await page.evaluate(() => (window as any).eventName);
    expect(eventName).toBe('');

    const allDayTimeText = await allDayApp2.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(allDayTimeText).toContain('April 27');

    const regularApp = page.locator(`${SCHEDULER_SELECTOR} .dx-scheduler-appointment`).filter({ hasText: 'Regular test app' });
    const leftRight = page.locator('#left-right');

    await regularApp.dragTo(leftRight);

    eventName = await page.evaluate(() => (window as any).eventName);
    expect(eventName).toBe('');

    const regularTimeText = await regularApp.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(regularTimeText).toContain('10:30 AM - 11:00 AM');
  });
});
