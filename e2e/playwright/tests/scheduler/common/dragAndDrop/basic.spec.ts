import type { Locator, Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { dragToElement, finishDrag, startDragToOffset } from '../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import { getThemeName } from '../../../../helpers/themeUtils';
import Scheduler from '../../../../models/scheduler';
import { dataSource } from './init/widget.data';
import createScheduler from './init/widget.setup';

const MAX_SCROLL_MARGIN = 50;

const dragToOffsetWithPageScroll = async (
  page: Page,
  source: Locator,
  deltaX: number,
  deltaY: number,
): Promise<void> => {
  await startDragToOffset(page, source, 0, 0);

  const box = await source.boundingBox();

  if (!box) {
    throw new Error(`${source.toString()} has no box to point at`);
  }

  const end = await page.evaluate(({ x, y, maxMargin }) => {
    const root = document.documentElement;
    const pageX = Math.min(Math.max(0, x + window.scrollX), root.scrollWidth);
    const pageY = Math.min(Math.max(0, y + window.scrollY), root.scrollHeight);
    const getScroll = (point: number, scroll: number, size: number): number => {
      const margin = Math.min(maxMargin, Math.floor(size / 2));

      if (point >= scroll + size - margin) {
        return point - size + margin;
      }

      return point <= scroll + margin ? point - margin : scroll;
    };

    window.scrollTo(
      getScroll(pageX, window.scrollX, root.clientWidth),
      getScroll(pageY, window.scrollY, root.clientHeight),
    );

    return { x: pageX - window.scrollX, y: pageY - window.scrollY };
  }, {
    x: Math.round(box.x + box.width / 2) + deltaX,
    y: Math.round(box.y + box.height / 2) + deltaY,
    maxMargin: MAX_SCROLL_MARGIN,
  });

  await page.mouse.move(end.x, end.y, { steps: 10 });
  await finishDrag(page);
};

test.describe('Drag-and-drop appointments in the Scheduler basic views', () => {
  ['day', 'week', 'workWeek'].forEach((view) => test(`Drag-n-drop in the "${view}" view`, async ({ page }) => {
    await createScheduler(page, {
      views: [view],
      currentView: view,
      dataSource,
    });

    const scheduler = new Scheduler(page, '#container');
    const draggableAppointment = scheduler.getAppointment('Brochure Design Review');

    await dragToElement(page, draggableAppointment.element, scheduler.getDateTableCell(4, 0));
    await expect(draggableAppointment.element).toHaveCSS('height', '38px');
    await expect(draggableAppointment.date).toHaveText('11:00 AM - 11:30 AM');
  }));

  test('Drag-n-drop in the "month" view', async ({ page, theme }) => {
    await createScheduler(page, {
      views: ['month'],
      currentView: 'month',
      dataSource,
      height: 834,
    });

    const scheduler = new Scheduler(page, '#container');
    const draggableAppointment = scheduler.getAppointment('Brochure Design Review');

    await dragToElement(page, draggableAppointment.element, scheduler.getDateTableCell(0, 4));
    await expect(draggableAppointment.element)
      .toHaveCSS('height', getThemeName(theme) === 'fluent-next' ? '23.75px' : '23.8281px');
    await expect(draggableAppointment.date).toHaveText('9:00 AM - 9:30 AM');
  });

  test('Drag-n-drop when browser has horizontal scroll', async ({ page }) => {
    await createScheduler(page, {
      views: ['week'],
      currentView: 'week',
      dataSource: [{
        text: 'Staff Productivity Report',
        startDate: new Date(2019, 3, 6, 9, 0),
        endDate: new Date(2019, 3, 6, 10, 30),
        resourceId: 2,
      }],
      width: 1800,
    });

    const scheduler = new Scheduler(page, '#container');
    const draggableAppointment = scheduler.getAppointment('Staff Productivity Report');

    await dragToOffsetWithPageScroll(page, draggableAppointment.element, 250, -50);
    await draggableAppointment.expectState('allDay');
  });

  test('Drag-n-drop when browser has vertical scroll', async ({ page }) => {
    await createScheduler(page, {
      views: ['week'],
      currentView: 'week',
      dataSource: [{
        text: 'Staff Productivity Report',
        startDate: new Date(2019, 3, 1, 21, 0),
        endDate: new Date(2019, 3, 1, 21, 30),
        resourceId: 2,
      }],
      height: 1800,
    });

    const scheduler = new Scheduler(page, '#container');
    const draggableAppointment = scheduler.getAppointment('Staff Productivity Report');

    await dragToElement(page, draggableAppointment.element, scheduler.getDateTableCell(25, 0));
    await expect(draggableAppointment.date).toHaveText('9:30 PM - 10:00 PM');
  });

  test('Drag recurrent appointment occurrence from collector (T832887)', async ({ page }) => {
    await createScheduler(page, {
      views: ['week'],
      currentView: 'week',
      firstDayOfWeek: 2,
      startDayHour: 4,
      maxAppointmentsPerCell: 1,
      dataSource: [{
        text: 'Recurrence one',
        startDate: new Date(2019, 2, 26, 8, 0),
        endDate: new Date(2019, 2, 26, 10, 0),
        recurrenceException: '',
        recurrenceRule: 'FREQ=DAILY',
      }, {
        text: 'Non-recurrent appointment',
        startDate: new Date(2019, 2, 26, 7, 0),
        endDate: new Date(2019, 2, 26, 11, 0),
      }, {
        text: 'Recurrence two',
        startDate: new Date(2019, 2, 26, 8, 0),
        endDate: new Date(2019, 2, 26, 10, 0),
        recurrenceException: '',
        recurrenceRule: 'FREQ=DAILY',
      }],
      currentDate: new Date(2019, 2, 26),
    });

    const scheduler = new Scheduler(page, '#container');
    const appointment = scheduler.getAppointment('Recurrence two');
    const collector = scheduler.collectors.find('2');
    const { appointmentTooltip } = scheduler;
    const appointmentTooltipItem = appointmentTooltip.getListItem('Recurrence two');
    const popup = scheduler.getDeleteRecurrenceDialog();

    await collector.click();

    await appointmentTooltip.expectVisible();
    await dragToElement(page, appointmentTooltipItem.element, scheduler.getDateTableCell(2, 2));
    await expect(appointmentTooltipItem.element).not.toBeAttached();
    await popup.appointment.click();
    await expect(appointment.element).toBeAttached();
    await expect(appointment.date).toHaveText('4:00 AM - 6:00 AM');
    await expect(collector.element).not.toBeAttached();
  });

  test('Drag-n-drop the appointment to the left column to the cell that has the same time', async ({ page }) => {
    await createScheduler(page, {
      timeZone: 'Etc/GMT',
      dataSource: [{
        text: 'Test appointment',
        startDate: new Date('2022-09-08T10:00:00.000Z'),
        endDate: new Date('2022-09-08T10:30:00.000Z'),
      }],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date('2022-09-09T10:00:00.000Z'),
      startDayHour: 9,
      width: 600,
      height: 600,
    });

    const scheduler = new Scheduler(page, '#container');
    const draggableAppointment = scheduler.getAppointment('Test appointment');

    await dragToElement(
      page,
      draggableAppointment.element,
      scheduler.getDateTableCell(2, 2),
    );

    await testScreenshot(page, 'drag-n-drop-appointment-to-left-column.png', { element: scheduler.workSpace });
  });
});
