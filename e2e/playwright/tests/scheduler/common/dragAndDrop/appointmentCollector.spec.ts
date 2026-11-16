import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { dragToElement, dragToOffset } from '../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';
import { appointmentCollectorData } from './init/widget.data';
import createScheduler from './init/widget.setup';

test.describe('Drag-and-drop behaviour for the appointment tooltip', () => {
  test('Drag-n-drop between a scheduler table cell and the appointment tooltip', async ({ page }) => {
    await createScheduler(page, {
      views: ['week'],
      currentView: 'week',
      dataSource: appointmentCollectorData,
      maxAppointmentsPerCell: 2,
      width: 1000,
    });

    const scheduler = new Scheduler(page, '#container');
    const appointment = scheduler.getAppointment('Approve Personal Computer Upgrade Plan');
    const collector = scheduler.collectors.find('2');
    const { appointmentTooltip } = scheduler;
    const appointmentTooltipItem = appointmentTooltip.getListItem('Approve Personal Computer Upgrade Plan');

    await collector.click();

    await appointmentTooltip.expectVisible();
    await dragToElement(page, appointmentTooltipItem.element, scheduler.getDateTableCell(2, 5));
    await expect(appointmentTooltipItem.element).not.toBeAttached();
    await expect(appointment.element).toBeAttached();
    await expect(appointment.element).toHaveCSS('height', '76px');
    await expect(appointment.date).toHaveText('9:30 AM - 10:30 AM');
    await dragToElement(page, appointment.element, scheduler.getDateTableCell(3, 2));

    await collector.click();

    await appointmentTooltip.expectVisible();
    await expect(appointment.element).not.toBeAttached();
  });

  test('Drag-n-drop to the cell on the left should work in week view (T1005115)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2019, 3, 1),
      views: ['week'],
      currentView: 'week',
      dataSource: [{
        text: 'Website Re-Design Plan',
        startDate: new Date(2019, 3, 3, 9, 30),
        endDate: new Date(2019, 3, 3, 11, 30),
      }, {
        text: 'Approve Personal Computer Upgrade Plan',
        startDate: new Date(2019, 3, 3, 10, 0),
        endDate: new Date(2019, 3, 3, 10, 30),
      }, {
        text: 'Install New Database',
        startDate: new Date(2019, 3, 3, 9, 45),
        endDate: new Date(2019, 3, 3, 11, 15),
      }],
      maxAppointmentsPerCell: 2,
      height: 800,
      startDayHour: 9,
    });

    const scheduler = new Scheduler(page, '#container');
    const collector = scheduler.collectors.find('1');
    const { appointmentTooltip } = scheduler;
    const appointmentTooltipItem = appointmentTooltip.getListItem('Approve Personal Computer Upgrade Plan');

    await collector.click();

    await dragToElement(
      page,
      appointmentTooltipItem.element,
      scheduler.getDateTableCell(2, 2),
    );

    await testScreenshot(page, 'drag-n-drop-from-tooltip-to-left-cell-in-week.png', { element: scheduler.workSpace });
  });

  test('Drag-n-drop in the same table cell', async ({ page }) => {
    await createScheduler(page, {
      views: ['week'],
      currentView: 'week',
      dataSource: appointmentCollectorData,
      maxAppointmentsPerCell: 2,
      width: 1000,
    });

    const scheduler = new Scheduler(page, '#container');
    const collector = scheduler.collectors.find('2');
    const { appointmentTooltip } = scheduler;
    const appointmentTooltipItem = appointmentTooltip.getListItem('Approve Personal Computer Upgrade Plan');

    await collector.click();

    await appointmentTooltip.expectVisible();
    await dragToOffset(page, appointmentTooltipItem.element, 0, -90);

    await collector.click();

    await appointmentTooltip.expectVisible();
    await expect(appointmentTooltipItem.element).toBeAttached();
  });

  test.describe('generic.light', () => {
    test.use({ theme: 'generic.light' });

    test('Drag-n-drop to the cell below should work in month view (T1005115)', async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        currentDate: new Date(2019, 3, 1),
        views: ['month'],
        currentView: 'month',
        dataSource: [{
          text: 'Website Re-Design Plan',
          startDate: new Date(2019, 3, 3, 9, 30),
          endDate: new Date(2019, 3, 3, 11, 30),
        }, {
          text: 'Approve Personal Computer Upgrade Plan',
          startDate: new Date(2019, 3, 3, 10, 0),
          endDate: new Date(2019, 3, 3, 11, 0),
        }, {
          text: 'Install New Database',
          startDate: new Date(2019, 3, 3, 9, 45),
          endDate: new Date(2019, 3, 3, 11, 15),
        }],
        maxAppointmentsPerCell: 2,
        height: 800,
      });

      const scheduler = new Scheduler(page, '#container');
      const collector = scheduler.collectors.find('1 more');
      const { appointmentTooltip } = scheduler;
      const appointmentTooltipItem = appointmentTooltip.getListItem('Approve Personal Computer Upgrade Plan');

      await collector.element.click();
      await dragToElement(
        page,
        appointmentTooltipItem.element,
        scheduler.getDateTableCell(1, 3),
      );

      await testScreenshot(page, 'drag-n-drop-from-tooltip-to-cell-below-in-month.png', { element: scheduler.workSpace });
    });
  });
});
