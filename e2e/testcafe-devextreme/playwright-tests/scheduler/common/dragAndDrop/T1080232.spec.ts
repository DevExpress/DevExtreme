import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage, appendElementTo } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('Appointment (T1080232)', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('it should correctly drag external item to the appointment after drag appointment', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', { id: 'list' });

    await page.evaluate(() => {
      $('#list').append('<div>drag-item</div>').addClass('drag-item');
    });

    await appendElementTo(page, '#container', 'div', { id: 'scheduler' });

    await createWidget(page, 'dxSortable', {
      group: 'resourceGroup',
    }, '#list');

    await createWidget(page, 'dxScheduler', {
      resources: [
        {
          fieldExpr: 'resourceId',
          dataSource: [
            { id: 0, color: '#e01e38' },
            { id: 1, color: '#f98322' },
            { id: 2, color: '#1e65e8' },
          ],
          label: 'Color',
        },
      ],
      firstDayOfWeek: 1,
      maxAppointmentsPerCell: 5,
      currentView: 'day',
      dataSource: [{
        text: 'Appt-01',
        startDate: new Date(2021, 3, 26, 10),
        endDate: new Date(2021, 3, 26, 11),
      }, {
        text: 'Appt-02',
        startDate: new Date(2021, 3, 26, 12),
        endDate: new Date(2021, 3, 26, 13),
      }],
      views: ['day'],
      currentDate: new Date(2021, 3, 26),
      startDayHour: 9,
      width: 800,
      height: 600,
      appointmentTemplate: new Function('e', '_', 'element', `
        var newData = e.appointmentData;
        return element
          .text(newData.text)
          .dxSortable({
            group: 'resourceGroup',
            data: [newData],
            onAdd: function() {
              element.attr('data-status', 'Added');
            },
          });
      `) as any,
    }, '#scheduler');

    const appt01 = page.locator('#scheduler .dx-scheduler-appointment').filter({ hasText: 'Appt-01' });
    const appt02 = page.locator('#scheduler .dx-scheduler-appointment').filter({ hasText: 'Appt-02' });
    const cell01 = page.locator('#scheduler .dx-scheduler-date-table-row').nth(1).locator('.dx-scheduler-date-table-cell').nth(0);
    const dragItem = page.locator('.drag-item');

    await appt01.dragTo(cell01);

    const appt01Box = await appt01.boundingBox();
    expect(appt01Box!.y).toBeCloseTo(183, 0);

    await dragItem.dragTo(appt02);

    const dataStatus = await appt02.locator('.dx-item-content').getAttribute('data-status');
    expect(dataStatus).toBe('Added');
  });
});
