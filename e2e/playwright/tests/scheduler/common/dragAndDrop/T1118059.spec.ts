import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { setStyleAttribute } from '../../../../helpers/domUtils';
import { dragToElement } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#scheduler';

const MARKUP = `<div style="display: flex;">
  <div id="drag-container" style="background: red; width: 250px; height: 150px;">drag container</div>
  <div id="space-right" style="background: yellow; width: 400px; height: 150px;">top right space</div>
</div>
<div style="display: flex;">
  <div id="left-right" style="background: yellow; width: 250px; height: 550px;">left space</div>
  <div id="scheduler"></div>
</div>`;

const DATA_SOURCE = [{
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
}];

const prepareContainer = async (page: Page): Promise<void> => {
  await page.evaluate(() => { (window as any).eventName = ''; });
  await setStyleAttribute(page, '#container', 'display: flex; flex-direction: column;');
  await page.evaluate((markup) => { $('#container').append(markup); }, MARKUP);
};

const getEventName = (page: Page): Promise<string> => page.evaluate(
  () => (window as any).eventName,
);

const eventHandlers = {
  onAppointmentUpdated: () => { (window as any).eventName = 'onAppointmentUpdated'; },
  onAppointmentUpdating: () => { (window as any).eventName = 'onAppointmentUpdating'; },
  onAppointmentDeleting: () => { (window as any).eventName = 'onAppointmentDeleting'; },
};

test('After drag to draggable component, should be called onAppointmentDeleting event only', async ({ page }) => {
  await prepareContainer(page);

  await createWidget(page, 'dxDraggable', {
    group: 'appointmentsGroup',
  }, '#drag-container');

  await createWidget(page, 'dxScheduler', {
    dataSource: DATA_SOURCE,
    views: [{
      type: 'day',
      intervalCount: 2,
    }],
    ...eventHandlers,
    currentDate: new Date(2021, 3, 26),
    startDayHour: 9,
    height: 600,
    width: 500,
    appointmentDragging: {
      group: 'appointmentsGroup',
      onRemove(e) {
        e.component.deleteAppointment(e.itemData);
      },
    },
  }, SCHEDULER_SELECTOR);

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

  await dragToElement(
    page,
    scheduler.getAppointment('Regular test app').element,
    page.locator('#drag-container'),
  );

  await expect.poll(async () => getEventName(page)).toBe('onAppointmentDeleting');
});

test('After drag over component area, shouldn\'t called onAppointment* data events and appointment shouldn\'t change position', async ({ page }) => {
  await prepareContainer(page);

  await createWidget(page, 'dxScheduler', {
    dataSource: DATA_SOURCE,
    views: [{
      type: 'day',
      intervalCount: 2,
    }],
    ...eventHandlers,
    currentDate: new Date(2021, 3, 26),
    startDayHour: 9,
    height: 600,
    width: 500,
  }, SCHEDULER_SELECTOR);

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

  await dragToElement(
    page,
    scheduler.getAppointment('All day test app 2').element,
    page.locator('#space-right'),
  );

  expect(await getEventName(page)).toBe('');
  await expect(scheduler.getAppointment('All day test app 2').date.time).toHaveText('April 27');

  await dragToElement(
    page,
    scheduler.getAppointment('Regular test app').element,
    page.locator('#left-right'),
  );

  expect(await getEventName(page)).toBe('');
  await expect(scheduler.getAppointment('Regular test app').date.time)
    .toHaveText('10:30 AM - 11:00 AM');
});
