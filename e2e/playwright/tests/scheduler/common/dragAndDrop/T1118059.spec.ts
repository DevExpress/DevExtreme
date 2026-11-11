import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { setStyleAttribute } from '../../../../helpers/domUtils';
import { dragToElement } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#scheduler';

// eslint-disable-next-line no-multi-str
const markup = '<div style="display: flex;">\
  <div id="drag-container" style="background: red; width: 250px; height: 150px;">drag container</div>\
  <div id="space-right" style="background: yellow; width: 400px; height: 150px;">top right space</div>\
</div>\
<div style="display: flex;">\
  <div id="left-right" style="background: yellow; width: 250px; height: 550px;">left space</div>\
  <div id="scheduler"></div>\
</div>';

const SCHEDULER_OPTIONS = {
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
  currentDate: new Date(2021, 3, 26),
  startDayHour: 9,
  height: 600,
  width: 500,
};

const safeEvent = (page: Page, value: string): Promise<void> => page.evaluate((eventName) => {
  (window as any).eventName = eventName;
}, value);

const getEventName = (page: Page): Promise<string> => page.evaluate(
  () => (window as any).eventName,
);

const appendMarkup = async (page: Page): Promise<void> => {
  await setStyleAttribute(page, '#container', 'display: flex; flex-direction: column;');

  await page.evaluate((html) => {
    $('#container').append(html);
  }, markup);
};

test.describe('T1118059', () => {
  test('After drag to draggable component, should be called onAppointmentDeleting event only', async ({ page }) => {
    await appendMarkup(page);

    await createWidget(page, 'dxDraggable', {
      group: 'appointmentsGroup',
    }, '#drag-container');

    await createWidget(page, 'dxScheduler', (options: Record<string, unknown>) => ({
      ...options,
      onAppointmentUpdated: () => { (window as any).eventName = 'onAppointmentUpdated'; },
      onAppointmentUpdating: () => { (window as any).eventName = 'onAppointmentUpdating'; },
      onAppointmentDeleting: () => { (window as any).eventName = 'onAppointmentDeleting'; },
      appointmentDragging: {
        group: 'appointmentsGroup',
        onRemove(e) {
          e.component.deleteAppointment(e.itemData);
        },
      },
    }), SCHEDULER_SELECTOR, { arg: SCHEDULER_OPTIONS });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await dragToElement(page, scheduler.getAppointment('Regular test app').element, page.locator('#drag-container'));

    await expect.poll(() => getEventName(page)).toBe('onAppointmentDeleting');
  });

  test('After drag over component area, shouldn\'t called onAppointment* data events and appointment shouldn\'t change position', async ({ page }) => {
    await safeEvent(page, '');
    await appendMarkup(page);

    await createWidget(page, 'dxScheduler', (options: Record<string, unknown>) => ({
      ...options,
      onAppointmentUpdated: () => { (window as any).eventName = 'onAppointmentUpdated'; },
      onAppointmentUpdating: () => { (window as any).eventName = 'onAppointmentUpdating'; },
      onAppointmentDeleting: () => { (window as any).eventName = 'onAppointmentDeleting'; },
    }), SCHEDULER_SELECTOR, { arg: SCHEDULER_OPTIONS });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await dragToElement(page, scheduler.getAppointment('All day test app 2').element, page.locator('#space-right'));

    await expect.poll(() => getEventName(page)).toBe('');
    await expect(scheduler.getAppointment('All day test app 2').date).toHaveText('April 27');

    await dragToElement(page, scheduler.getAppointment('Regular test app').element, page.locator('#left-right'));

    await expect.poll(() => getEventName(page)).toBe('');
    await expect(scheduler.getAppointment('Regular test app').date).toHaveText('10:30 AM - 11:00 AM');
  });
});
